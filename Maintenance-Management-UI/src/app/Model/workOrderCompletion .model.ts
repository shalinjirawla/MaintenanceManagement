export class WorkOrderCompletion {
    id!: string;
    workOrderId!: number;
    status!: string;
    notesComments?: string;
    proofOfCompletion?: string;
    adminReviewStatus?: string;
    descriptionOfOccurrence?: string;
    challengesEncountered?: string;
    sparePartsMaterialsUsed?: string;
    extraWorkDetails?: string;
    planDeviations?: string;
    actualLaborHours!: number;
    workHours?: string;
  
  }
  