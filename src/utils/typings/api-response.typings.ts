export interface IGenericResponse<T> {
    status: "Success" | "Error";
    statusCode: number;
    message: string;
    data?: T;
    error?: unknown
}