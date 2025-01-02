import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Request } from '../../../Model/request.model';
import { Workorder } from '../../../Model/workorder.model';
import { Quotation } from '../../../Model/quotation.model';
import { RequestService } from '../../../Service/request.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '../../../Model/login.model';
import { UserService } from '../../../Service/user.service';
import { WorkOrderService } from '../../../Service/workorder.service';
import { WorkRequestWithStatusDto } from '../../../Model/WorkRequestWithStatusDto';
import { Notification } from '../../../Model/notification.model';
import { NotificationService } from '../../../Service/notification.service';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { LocationService } from '../../../Service/location.service';
import { Location } from '../../../Model/Location.model';
import { AssetsService } from '../../../Service/assets.service';
import { Asset } from '../../../Model/asset.model';

@Component({
  selector: 'app-requesttrackingmodel',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './requesttrackingmodel.component.html',
  styleUrl: './requesttrackingmodel.component.css',
})
export class RequesttrackingmodelComponent implements OnInit {
  @Input() item: any; // Input to receive the selected item for editing
  @Output() close = new EventEmitter<void>();

  isEditing = false;
  workorder: Workorder = new Workorder();
  workorderlist!: Workorder[];
  quotation: Quotation = new Quotation();
  WorkorderModalOpen = false;
  declineModalOpen = false;
  declineReason: string = '';
  workrequest: Request = new Request();
  WorkRequest!: WorkRequestWithStatusDto[];
  filteredWorkRequests!: WorkRequestWithStatusDto[];
  minDateTime: string;
  availableEmployees: Login[] = [];
  errorMessage: string = '';
  location!: Location[];
  assets: Asset[] = [];  

  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private locationService: LocationService,
    private assetsService: AssetsService,
    private workOrderService: WorkOrderService,
    private notificationService: NotificationService
  ) {
    const today = new Date();
    this.minDateTime = this.formatDateTime(today);
  }

  ngOnInit(): void { 
   
    this.WorkorderModalOpen = true;
    if (this.item) {
      this.workorder = { ...this.item.workRequest }; // Populate with selected item data for editing
      this.quotation.email = this.item.createdByUser?.email ?? ''; // Use an empty string if email is undefined
      this.isEditing = true;
      const bodyString = this.item.body;
      // Use regular expressions or split methods to extract cost and time
      const estimatedCostMatch = bodyString.match(/Estimated Cost:\s?(\d+)/); // Capture the cost
      const estimatedTimeMatch = bodyString.match(
        /Estimated Time:\s?(\d+\s?(?:hr|days))/
      );

      // Assign the extracted values to the quotation object
      if (estimatedTimeMatch) {
        this.quotation.time = estimatedTimeMatch[1]; // Assign time
      }
      if (estimatedCostMatch) {
        this.quotation.cost = estimatedCostMatch[1]; // Assign cost
      }
      this.workorder.category = '';      
      this.workorder.asset = '';
      this.workorder.assignedTo = 0;
    } else {
      this.workorder.createdBy;
    }
    const id = Number(localStorage.getItem('UserId'));
    //this.loadEmployees();
    this.locationService.Getlocation(id).subscribe((response) => {
      this.location = response;
    });
    this.assetsService.GetAssets(id).subscribe((response) => {
      this.assets = response;
    });
  }

  loadEmployees(start: string, end: string) {
    const hadId = Number(localStorage.getItem('UserId'));
    this.userService.getEmployees(start, end, hadId).subscribe((employees) => {
      this.availableEmployees = employees;
      if (this.availableEmployees.length == 0) {
        // this.errorMessage = 'No available employees to assign this task.';
        Swal.fire({
          icon: 'error',
          title: 'No Employees Available',
          text: 'There are no available employees to assign this task at the moment.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }
  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  onStartDateTimeChange() {
    // Ensure dueDateTime is updated if it becomes invalid
    if (new Date(this.workorder.dueDate) < new Date(this.workorder.startDate)) {
      // this.workorder.dueDate = '';
    }
  }
  closeModal() {
    this.close.emit(); // Emit close event
    this.item = null; // Reset item
  }
  Checkawailable() {
    const start = this.workorder.startDate.toString();
    const end = this.workorder.dueDate.toString();
    if (start != undefined && end != undefined) {
      this.loadEmployees(start, end);
    }
  }

  approveRequest() {    
    this.workorder.requestedId = this.workorder.id;
    this.workorder.id = 0;
    this.workorder.additionalWorkers = 'team';
    this.workorder.status = 'Open';
   
    // this.workorder.asset = formData.asset.toString();
    if (
      !this.workorder.startDate ||
      !this.workorder.dueDate ||
      !this.workorder.assignedTo ||
      !this.workorder.category ||
      !this.workorder.location
    ) {
      this.errorMessage = 'Please fill out all required fields.';
    } else {
      this.workOrderService
        .createWorkOrder(this.workorder)
        .subscribe((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Work Order Generated Successfully',
            text: 'Request accepted and work order successfully assigned.',
            confirmButtonColor: '#3085d6',
          });

          let taskTitle = this.workorder.title;
          let dueDate = this.workorder.dueDate;
          let formattedDate = format(dueDate, 'dd-MM-yyyy');
          const data = new Notification();
          data.id = 0;
          data.message = `You have been assigned a new work order. Task: ${taskTitle}. Due date: ${formattedDate}.`;
          data.isRead = false;
          data.senderID = Number(localStorage.getItem('UserId'));
          data.reciverId = this.workorder.assignedTo;
          this.notificationService.SendMessage(data).subscribe((response) => {
            console.log(response);
          });
          this.closeModal();
        });
    }
  }

}
