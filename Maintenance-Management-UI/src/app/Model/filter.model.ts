export class Filter{
    id?:number;
    title?:string;
    dueDate?:Date;
    startDate?:Date;  
    priority?:string;
    assignedTo?: string;
    status?: string;

    createdBy?:number;
    createdDate?:Date;

    username?:string;
    email?:string;
    role?:string;
    
    assetName?: string; 
    model?: string;
    serialNumber?: string;
    category?: string;
    location?: string;

    name?:string;
    scheduleType?:string;
   
    description?:string;
    sku?:string;
    unit?:string;
    companyname?:string;
    contact?:number;

    paymentId?:string;
    amount?:number;
    requestId?:number;
    workorderId?:number;

    totalcost?:number;
    vendor?:string;
    ponumber?:string;

  }