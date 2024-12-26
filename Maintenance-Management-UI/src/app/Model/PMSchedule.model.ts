import { PreventiveMaintenance } from "./PreventiveMaintenance.model";

export class PMSchedule {
    id!: number;
    scheduleType!: string;
    frequencyInterval?: number;
    frequencyType?: string;
    daysOfWeek?: string;
    workOrderDue!: number;
    advanceCreationPeriod!: string;
    nextDueDate?: Date;
    lastGeneratedDate?: Date;
    pmId!: number;
    preventiveMaintenance?: PreventiveMaintenance;
    woId?: number;
}