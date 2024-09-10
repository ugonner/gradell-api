export interface IError {
        message: string;
        source: string;
        stack?: string;
        path?: string;
        method?: string;
}