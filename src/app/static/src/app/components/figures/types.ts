// TODO these should all be rolled into the mintr schemas and derived from generated types
export interface SeriesDefinition {
    x?: any[]
    y?: any[],
    id?: string,
    name?: string,
    type?: string
    [propName: string]: any;
}

export interface LongFormatSeriesMetadata {
    y_col: string,
    x_col: string,
    id_col: string
    format: "long"
}

export interface WideFormatSeriesMetadata {
    cols: string[],
    id_col: string
    format: "wide"
}

export type SeriesMetadata = LongFormatSeriesMetadata | WideFormatSeriesMetadata

export interface GraphDefinition {
    metadata?: SeriesMetadata
    series: SeriesDefinition[]
    layout: any
    config?: any
}
