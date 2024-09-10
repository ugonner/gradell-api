import { AppDataSource } from "./data-source";
import { AMQPService } from "./services/amqp.service";
import * as express from 'express';
import * as dotnev from 'dotenv';
import { ExceptionFilter } from "./middlewares/exception.filter";
import { Logger } from "./services/logger.service";
dotnev.config();
const app = express();

(
    async () => {
        try{
            await AppDataSource.initialize();
            await AMQPService.init();
            
        }catch(error){
            console.log("Error at connections", error.message);
        }
    }
)();
app.use(express.json());
app.use(ExceptionFilter.filter);
const port = process.env.PORT;
app.listen(port, () => Logger.info(`App running on port ${port}`));