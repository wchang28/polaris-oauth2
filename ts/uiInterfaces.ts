export interface ILoginParams {
    username: string;
    password: string;
    signUpUserForApp: boolean;
}

export interface ILoginResult {
    redirect_url: string;
}