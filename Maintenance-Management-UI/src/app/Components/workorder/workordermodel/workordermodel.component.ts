import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule,  ReactiveFormsModule,} from '@angular/forms';
import { Workorder } from '../../../Model/workorder.model';
import { Login } from '../../../Model/login.model';
import { UserService } from '../../../Service/user.service';
import { WorkOrderService } from '../../../Service/workorder.service';
import { Location } from '../../../Model/Location.model';
import { LocationService } from '../../../Service/location.service';
import { Asset } from '../../../Model/asset.model';
import { AssetsService } from '../../../Service/assets.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-workordermodel',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './workordermodel.component.html',
  styleUrl: './workordermodel.component.css',
})
export class WorkordermodelComponent implements OnInit {
  @Input() item!: Workorder;
  @Output() close = new EventEmitter<void>();
  workorder: Workorder = new Workorder();
  EditworkorderModalOpen = false;
  availableEmployees: Login[] = [];
  employeeList: Login[] = [];
  workorderlist!: Workorder[];
  employee: boolean = false;
  errorMessage: string = ''; // Error message for display
  location!: Location[];
  assets: Asset[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private workOrderService: WorkOrderService,
    private locationService: LocationService,
    private assetsService: AssetsService,
  ) {}

  ngOnInit(): void {
    if (this.item) {
      this.workorder = { ...this.item }; // Populate with selected item data for editing
      this.item.assignedTo = this.workorder.assignedTo;
      this.workorder.location = Number(this.workorder.location);
    } else {
      this.workorder.createdBy;
    }
    const role = localStorage.getItem('Role') || '';
    if (role == 'Employee') {
      this.employee = true;
    }

    const hadId = Number(localStorage.getItem('UserId'));
    this.locationService.Getlocation(hadId).subscribe((response) => {
      this.location = response;
    });
    this.assetsService.GetAssets(hadId).subscribe((response) => {
      this.assets = response;
    });
  }

  //Fetch Employee
  loadEmployees(start: string, end: string) {
    const hadId = Number(localStorage.getItem('UserId'));
    this.userService.getEmployees(start, end, hadId).subscribe((employees) => {
      this.availableEmployees = employees;
      if (this.availableEmployees.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'No Employees Available',
          text: 'There are no available employees to assign this task at the moment.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  //fetch available employee
  Checkavailable() {
    const start = this.item.startDate.toString();
    const end = this.item.dueDate.toString();
    if (start != undefined && end != undefined) {
      this.loadEmployees(start, end);
    }
  }

  //work order edit
  editworkorder() {
    const data = new Workorder();
    data.startDate = this.item.startDate;
    data.dueDate = this.item.dueDate;
    data.assignedTo = this.item.assignedTo;
    data.category = this.item.category;
    data.asset = this.item.asset;
    data.location = this.item.location;
    data.id = this.item.id;
    this.workOrderService.editworkorder(data).subscribe((response) => {
      Swal.fire({
        icon: 'success',
        title: 'Update Successfully',
        text: 'Work Order Update Successfully',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        // Close the modal after the user clicks "OK"
        this.closeModal();
      });
    });
  }

  //Close model
  closeModal() {
    this.close.emit(); // Emit close event
  }
}
