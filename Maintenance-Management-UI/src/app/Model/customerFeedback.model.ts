import { Request } from "./request.model";

export class CustomerFeedback {
  id!: number;
  customerID!: number;
  requesterUser?: string; // Assuming requesterUser is a username or ID; change the type as necessary
  workRequestID!: number;
  comments?: string;
  resolvedStatus?: number;
  resolutionNotes?: string;
  WorkRequest?: Request;
  satisfied!: string;
  inFuture!: string;
  feedbackDate!:Date;
  }
  