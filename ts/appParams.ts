// application parameters that get passed to the browser app
export interface IAppParams {
    client_id: string;
    redirect_uri: string;
    response_type: string;
    time_stamp: Date;
    state?: string;
}

export interface IAppSettings {
	companyName: string
	,reCaptchaSiteKey: string
}