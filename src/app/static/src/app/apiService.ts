import axios, {AxiosError, AxiosResponse} from "axios";
import {ActionContext, Commit} from "vuex";
import {freezer, isMINTResponseFailure} from "./utils";
import {RootState} from "./store";
import {ResponseSuccess, ResponseFailure} from "./generated";
import {RootMutation} from "./mutations";

declare let appUrl: string;

export interface ResponseWithType<T> extends ResponseSuccess {
    data: T
}

export interface APIError {
    error: string;
    detail: string | null;
}

export interface API<S, E> {

    withError: (type: E) => API<S, E>
    withSuccess: (type: S) => API<S, E>
    ignoreErrors: () => API<S, E>
    ignoreSuccess: () => API<S, E>

    postAndReturn<T>(url: string, data: any): Promise<void | ResponseWithType<T>>

    get<T>(url: string): Promise<void | ResponseWithType<T>>
}

export class APIService<S extends string, E extends string> implements API<S, E> {

    private readonly _commit: Commit;
    private readonly _headers: any;

    constructor(context: ActionContext<RootState, RootState>) {
        this._commit = context.commit;
    }

    // appUrl will be set as a jest global during testing
    private readonly _baseUrl = typeof appUrl !== "undefined" ? appUrl : "";

    private _buildFullUrl = (url: string) => {
        return this._baseUrl + url
    };

    private _ignoreErrors = false;
    private _ignoreSuccess = false;
    private _freezeResponse = false;

    static getFirstErrorFromFailure = (failure: ResponseFailure) => {
        if (failure.errors.length == 0) {
            return APIService
                .createError("API response failed but did not contain any error information. Please contact support.");
        }
        return failure.errors[0];
    };

    static createError(detail: string) {
        return {
            error: "MALFORMED_RESPONSE",
            detail: detail
        }
    }

    private _onError: ((failure: ResponseFailure) => void) | null = null;

    private _onSuccess: ((success: ResponseSuccess) => void) | null = null;

    freezeResponse = () => {
        this._freezeResponse = true;
        return this;
    };

    withError = (type: E) => {
        this._onError = (failure: ResponseFailure) => {
            this._commit(type, APIService.getFirstErrorFromFailure(failure));
        };
        return this
    };

    ignoreErrors = () => {
        this._ignoreErrors = true;
        return this;
    };

    ignoreSuccess = () => {
        this._ignoreSuccess = true;
        return this;
    };

    withSuccess = (type: S) => {
        this._onSuccess = (data: any) => {
            const finalData = this._freezeResponse ? freezer.deepFreeze(data) : data;
            this._commit(type, finalData);
        };
        return this;
    };

    private _handleAxiosResponse(promise: Promise<AxiosResponse>) {
        return promise.then((axiosResponse: AxiosResponse) => {
            const success = axiosResponse && axiosResponse.data;
            const data = success.data;
            if (this._onSuccess) {
                this._onSuccess(data);
            }
            return axiosResponse.data;
        }).catch((e: AxiosError) => {
            return this._handleError(e)
        });
    }

    private _handleError = (e: AxiosError) => {
        console.log(e.response && e.response.data || e);
        if (this._ignoreErrors) {
            return
        }

        const failure = e.response && e.response.data;

        if (!isMINTResponseFailure(failure)) {
            this._commitError(APIService.createError("Could not parse API response. Please contact support."));
        } else if (this._onError) {
            this._onError(failure);
        } else {
            this._commitError(APIService.getFirstErrorFromFailure(failure));
        }
    };

    private _commitError = (error: APIError) => {
        this._commit(RootMutation.AddError, error);
    };

    private _verifyHandlers(url: string) {
        if (this._onError == null && !this._ignoreErrors) {
            console.warn(`No error handler registered for request ${url}.`)
        }
        if (this._onSuccess == null && !this._ignoreSuccess) {
            console.warn(`No success handler registered for request ${url}.`)
        }
    }

    async get<T>(url: string): Promise<void | ResponseWithType<T>> {
        this._verifyHandlers(url);
        const fullUrl = this._buildFullUrl(url);
        return this._handleAxiosResponse(axios.get(fullUrl, {headers: this._headers}));
    }

    async postAndReturn<T>(url: string, data?: any): Promise<void | ResponseWithType<T>> {
        this._verifyHandlers(url);
        const fullUrl = this._buildFullUrl(url);

        // this allows us to pass data of type FormData in both the browser and
        // in node for testing, using the "form-data" package in the latter case
        const headers = data && typeof data.getHeaders == "function" ?
            {...this._headers, ...data.getHeaders()}
            : this._headers;

        return this._handleAxiosResponse(axios.post(fullUrl, data, {headers}));
    }

}

export const api =
    <S extends string, E extends string>(context: ActionContext<RootState, RootState>) => new APIService<S, E>(context);
