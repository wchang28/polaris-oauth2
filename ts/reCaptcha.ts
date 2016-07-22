export type RenderTheme = 'dark' | 'light';
export type RenderType = 'audio' | 'image';
export type RenderSize = 'compact' | 'normal';
export type RenderCallback = (response:string) => void;
export type RenderExpireCallback = () => void;

export interface RenderParameters {
	sitekey: string;
	theme?: RenderTheme;
	type?: RenderType;
	size?: RenderSize;
	tabindex?: number;
	callback?: RenderCallback;
	'expired-callback'?: RenderExpireCallback;
}

export interface IreCaptcha {
	render: (container:string|HTMLElement, parameters: RenderParameters) => string;
	reset: (opt_widget_id?:string) => void;
	getResponse: (opt_widget_id?:string) => string;
}

export interface SiteVerifyRequest {
	secret:string;
	response:string;
	remoteip?:string;
}
 
export interface SiteVerifyResponse {
	success: boolean;
	challenge_ts: string;
	hostname: string;
	'error-codes'?: any[]
}