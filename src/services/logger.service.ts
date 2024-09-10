import { IError } from "../utils/typings/error.typings"

export class Logger {
    
    static info(message: string){
        console.log(`INFO: - ${message}`)
    }

    static error(error: IError){
        const {message, source} = error;
        console.error(`ERROR: ${new Date()} [${source}] - ${message}`)
    }

    static warn(message: string){
        console.log(`WARN: - ${message}`)
    }
}