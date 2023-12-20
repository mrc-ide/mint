import {InferenceSession, Tensor} from 'onnxruntime-web';
import {Data, Graph, SeriesDefinition} from "./generated";
import {DynamicFormData} from "@reside-ic/vue-dynamic-form";

// Eventually this should be defined as a JSON schema and integrated into mintr.
export interface EmulatorConfig {
    models: ModelConfig[]
}

interface ModelConfig {
    name: string,
    filename: string,
    inputShape: number[],
    timerange: {
        offset: number,
        start: number,
        end: number,
    },
    features: Feature[],
}

interface RealFeature {
    input: string
    type: "REAL"
}
interface OneHotFeature {
    input: string
    type: "ONE_HOT"
    values: any[]
}
type Feature = RealFeature | OneHotFeature;

const SESSIONS: { [name: string]: Promise<InferenceSession> } = {};
function getInferenceSession(filename: string): Promise<InferenceSession> {
  if (!(filename in SESSIONS)) {
    SESSIONS[filename] = InferenceSession.create(`/emulator/model/${filename}`);
  }
  return SESSIONS[filename];
}

/**
 * Assemble inputs from multiple sources, combining them into a single
 * dictionary that can be indexed into by emulator model features.
 */
function assembleInputs(
    series: SeriesDefinition,
    baseline: DynamicFormData,
    intervention: DynamicFormData
): DynamicFormData {
    var inputs: DynamicFormData = {};

    inputs["intervention.name"] = series.id!;

    for (const [key, value] of Object.entries(baseline)) {
        inputs[`baseline.${key}`] = value;
    }

    for (const [key, value] of Object.entries(intervention)) {
        if (series.settings.indexOf(key) >= 0) {
            inputs[`intervention.${key}`] = value;
        } else {
            // When analysing the impact of an intervention, we render both the
            // intervention and control (no-intervention) series.
            //
            // Whether the intervention is enabled at all is controlled by the
            // `intervention.name` parameter, and then, when enabled, the
            // intervention's "intensity" is tuned with separate parameters
            // (represented here by `${key}`).
            //
            // In theory, the intervention intensity should be ignored by the
            // emulator when the intervention is completly disabled.
            // Unfortunately this doesn't seem to be the case, and the impact of
            // the intervention "leaks" into the control series. Setting the
            // intensity to 0 helps prevent that. This is because the models are
            // only ever trained on control data using a 0 intensity.
            inputs[`intervention.${key}`] = 0;
        }
    }

    return inputs;
}

/**
 * Preprocess a feature of type "REAL".
 *
 * This outputs a single float, either passed through directly from the value or
 * parsed from a string.
 */
function preprocessReal(feature: RealFeature, value: any): number[] {
    if (typeof value === "number") {
        return [value];
    } else if (typeof value == "string" && value.endsWith('%')) {
        // Some numerical inputs are expressed as percentages, with a trailing
        // '%' sign.
        return [Number.parseFloat(value.slice(0, -1)) / 100.];
    } else if (typeof value == "string") {
        return [Number.parseFloat(value)];
    } else {
        throw `bad REAL value for ${feature.input}`;
    }
}

/**
 * Preprocess a feature of type "ONE_HOT".
 *
 * The value is compared against the list of allowed values, as defined in the
 * feature configuration.
 *
 * Returns an array of integers. All values are set to 0, except for the index
 * matching the input value, which is set to 1.
 */
function preprocessOneHot(feature: OneHotFeature, value: any): number[] {
    let found = false;
    const index = feature.values.indexOf(value);
    if (index != -1) {
        const result = Array(feature.values.length).fill(0);
        result[index] = 1;
        return result;
    } else {
        throw `bad ONE_HOT value for ${feature.input}: ${value}`;
    }
}

/**
 * Preprocess a model's feature, according to its configuration.
 *
 * The feature configuration determines which of the inputs is used, and how it
 * should be transformed into something that may be consumed by the model.
 *
 * Returns one or more float values, depending on the feature type.
 */
function preprocessFeature(feature: Feature, inputs: DynamicFormData): number[] {
    const value = inputs[feature.input];
    switch (feature.type) {
        case 'REAL':
            return preprocessReal(feature, value);
        case 'ONE_HOT':
            return preprocessOneHot(feature, value);
        default:
            throw "invalid feature type";
    }
}

/**
 * Preprocess the emulators inputs, according to the model's configuration.
 */
function preprocessInputs(modelConfig: ModelConfig, inputs: DynamicFormData): Tensor {
    const values = [];
    for (const feature of modelConfig.features) {
        values.push(...preprocessFeature(feature, inputs));
    }
    return new Tensor(Float32Array.from(values), modelConfig.inputShape);
}

/**
 * Execute an already loaded emulator model against a set of input parameters.
 */
async function runModel(session: InferenceSession, modelConfig: ModelConfig, inputs: DynamicFormData): Promise<Tensor> {
    const inputTensor = preprocessInputs(modelConfig, inputs);
    const output = await session.run({"parameters": inputTensor});
    return output["prevalence"];
}

/**
 * Translate indices from the emulator's model back into the time domain.
 *
 * Emulator models outputs of a vector of floats, where each value corresponds
 * to prevalence at a given point in time. The vector's 0-based index may be
 * unsuitable for use on the X-axis of a graph and needs a bit of transformation
 * into something higher-level.
 *
 * Additionally, values at each end of the time range may be excluded, in which
 * case this function returns null.
 */
function convertTimeIndex(modelConfig: ModelConfig, index: number): number | null {
    let month = modelConfig.timerange.start + (index - modelConfig.timerange.offset)
    if (month < modelConfig.timerange.start || month >= modelConfig.timerange.end) {
        return null;
    } else {
        return month;
    }
}

/**
 * Returns true if the given series should be generated.
 *
 * Each series has a list of settings that enable it. If any of those settings
 * is zero, the series is excluded. This may, for example, correspond to an
 * intervention usage metric.
 *
 * This may need to be revisited in the future if there are series for which 0
 * is a valid parameter.
 */
function includeSeries(series: SeriesDefinition, intervention: DynamicFormData): boolean {
    for (const f of series.settings) {
        let value = intervention[f];
        if (typeof value === "string" && Number.parseFloat(value) == 0) {
            return false;
        }
    }
    return true;
}

/**
 * Format the output Tensor from the emulator model into something that can be
 * consumed by the graphing components.
 */
function formatOutputs(
    modelConfig: ModelConfig,
    graphConfig: Graph,
    series: SeriesDefinition,
    intervention: DynamicFormData,
    prevalence: Tensor
): Data {
    const result = [];
    for (let i = 0; i < prevalence.size ; i++) {
        const month = convertTimeIndex(modelConfig, i);
        if (month != null) {
            var v: any = {
                month: month,
                value: prevalence.data[i],
            };
            v[graphConfig.metadata.id_col] = series.id;

            // Copy the intervention parameters. The graphing components try to
            // filter the data against the user inputs. This is redundant when
            // using the emulator, as only the necessary data is generated.
            // However the filtering exists to accomodate mintr's static
            // data-sets, so this makes sure we play nice with it.
            for (var f of graphConfig.metadata.settings!) {
                if (series.settings.indexOf(f) >= 0) {
                    v[f] = intervention[f];
                } else {
                    // For control series, the intervention parameters are
                    // irrelevant. Using n/a makes sure the graphing layer
                    // renders it (as opposed to eg. using 0, which wouldn't
                    // match the user's inputs).
                    v[f] = "n/a";
                }
            }
            result.push(v);
        }
    }
    return result;
}

export async function generateData(
    modelConfig: ModelConfig,
    graphConfig: Graph,
    baseline: DynamicFormData,
    intervention: DynamicFormData
): Promise<Data> {
    const session = await getInferenceSession(modelConfig.filename);

    const result = [];
    for (const series of graphConfig.series) {
        if (!includeSeries(series, intervention)) {
            continue;
        }

        const inputs = assembleInputs(series, baseline, intervention);
        const prevalence = await runModel(session, modelConfig, inputs);
        const data = formatOutputs(modelConfig, graphConfig, series, intervention, prevalence);
        result.push(...data);

    }
    return result;
}
