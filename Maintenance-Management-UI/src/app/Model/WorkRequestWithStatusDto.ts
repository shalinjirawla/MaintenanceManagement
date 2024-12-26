import { Login } from "./login.model";
import { Request } from "./request.model";

export class WorkRequestWithStatusDto{
    workRequest!:Request;
    status!:number;
    body!:string;
    createdByUser!:Login;
}