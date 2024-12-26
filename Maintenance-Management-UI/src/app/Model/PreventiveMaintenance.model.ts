import { PMSchedule } from "./PMSchedule.model";

export class PreventiveMaintenance {
    id!: number;
    title!: string;
    priority!: string;
    category!: string;
    asset!: number;
    assetName?:string;
    assignToName?:string;
    location!: number;
    assignTo!: number;
    startDate!: Date;
    dueDate?: Date;
    description!: string;
    createdBy!:number
    pmSchedules?: PMSchedule[];
    selected?: boolean;
    locationname?:string;


   
    scheduleType!: string;
    frequencyInterval?: number;
    frequencyType?: string;
    daysOfWeek?: string;
    workOrderDue!: number;
    advanceCreationPeriod!: string;    
    preventiveMaintenance?: PreventiveMaintenance;
    
}