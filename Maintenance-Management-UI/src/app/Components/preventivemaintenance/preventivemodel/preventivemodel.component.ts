import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PreventivemaintananceService } from '../../../Service/preventivemaintanance.service';
import { AssetsService } from '../../../Service/assets.service';
import { Asset } from '../../../Model/asset.model';
import { UserService } from '../../../Service/user.service';
import { Login } from '../../../Model/login.model';
import { LocationService } from '../../../Service/location.service';
import { Location } from '../../../Model/Location.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preventivemodel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './preventivemodel.component.html',
  styleUrl: './preventivemodel.component.css',
})
export class PreventivemodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  errorMessage: string = '';
  preventiveForm: FormGroup;
  selectedTab = 'details';
  selectedStructure: string = 'Calendar'; // Default selection
  selectedOption: number = 1; // Default to first radio button selected
  selectedscheduletype!: string | 'Regular Inter'; // Variable to store selected option
  selectedFrequencyType!: string | 'Day(s)'; // Default value for Frequency Type
  selectedadvanceCreationPeriod!: string | 'Day(s)'; // Default value for Frequency Type
  isCalanderScheduleAdded = false;
  daysOfWeek: string[] = []; // Array to hold the days of the week
  selectedDays: string[] = []; // To store selected days for the week
  assets: Asset[] = [];
  location!: Location[];
  employee!: Login[];
  minDateTime!: string;
  dueDateMin!: string;
  isedit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private assetsService: AssetsService,
    private locationService: LocationService,
    private preventiveMaintenanceService: PreventivemaintananceService
  ) {
    this.selectedscheduletype = 'Regular Inter';
    this.selectedFrequencyType = 'Day(s)';
    this.selectedadvanceCreationPeriod = 'Day(s)';
    this.preventiveForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      priority: ['', Validators.required],
      category: ['', Validators.required],
      asset: [null, Validators.required],
      location: [null, Validators.required],
      assignTo: [null, Validators.required],
      startDate: [null, Validators.required],
      dueDate: [null],
      description: ['', Validators.required],
      createdBy: [],
      wos: [],

      // Additional fields
      scheduleType: [''],
      frequencyInterval: [null, Validators.required], // Optional, so no Validators.required
      frequencyType: [null],
      daysOfWeek: [null],
      workOrderDue: [null, Validators.required],
      advanceCreationPeriod: [''],
    });
  }

  ngOnInit(): void {
    if (this.item) {
      this.isedit = true;
      this.preventiveForm.patchValue(this.item);
      const scheduleType = this.item.scheduleType?.split(' - ')[0]; // Extract 'Calendar' or 'Meter'
      if (scheduleType === 'Calendar') {
        // If the scheduleType is 'Calendar', check the Calendar radio button
        this.preventiveForm.controls['structure']?.setValue('Calendar');
        this.addcalanderSchedule();
        const scheduleType = this.item.scheduleType?.split(' - ')[1];
        // Check if the scheduleType matches the dropdown options
        if (scheduleType) {
          this.selectedscheduletype = scheduleType; // Set the selected value
        }
        this.selectedFrequencyType = this.item.frequencyType;
        if (this.selectedFrequencyType === 'week(s)') {
          this.daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        }
        this.selectedadvanceCreationPeriod = this.item.advanceCreationPeriod;
      }
      // else if (scheduleType === 'Meter') {

      //   this.preventiveForm.controls['structure']?.setValue('Meter readings');
      // }
    }
    const id = Number(localStorage.getItem('UserId'));
    this.assetsService.GetAssets(id).subscribe((response) => {
      this.assets = response;
    });
    this.userService.getEmployeesAll(id).subscribe((response) => {
      this.employee = response.filter((emp) => emp.roleID === 4);
    });
    this.locationService.Getlocation(id).subscribe((response) => {
      this.location = response;
    });

    const today = new Date();
    this.minDateTime = this.formatDateTime(today);
  }
  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  onStartDateChange(event: any): void {
    const startDate = new Date(event.target.value);
    startDate.setMinutes(startDate.getMinutes() + 1); // Ensure due date is after start date
    this.dueDateMin = this.formatDateTime(startDate);
  }
  addcalanderSchedule() {
    this.isCalanderScheduleAdded = true; // Hide the second card and show the first one
  }
  // addmeterSchedule() {
  //   this.isMeterScheduleAdded = true; // Hide the second card and show the first one
  // }
  cancelcalanderSchedule() {
    this.isCalanderScheduleAdded = false;
  }
  // cancelmeterSchedule() {
  //   this.isMeterScheduleAdded = false;
  // }

  selectOption(option: string) {
    this.selectedscheduletype = option; // Update the selected option
    if (this.preventiveForm) {
      this.preventiveForm.get('frequencyInterval')?.setValue('');
      this.preventiveForm.get('workOrderDue')?.setValue('');
    }
  }
  // Method to update the selected frequency type
  selectFrequencyType(type: string) {
    this.selectedFrequencyType = type;
    if (this.selectedFrequencyType === 'Week(s)') {
      this.daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    } else {
      this.daysOfWeek = []; // Clear the days if any other option is selected
    }
  }
  toggleDay(day: string) {
    const index = this.selectedDays.indexOf(day);
    if (index === -1) {
      this.selectedDays.push(day); // Add day if not selected
    } else {
      this.selectedDays.splice(index, 1); // Remove day if already selected
    }
  }
  selectadvancecreation(option: string) {
    this.selectedadvanceCreationPeriod = option;
  }

  // Method to update selected structure
  // onStructureChange(structure: string) {
  //   this.selectedStructure = structure;
  // }
  onSubmit() {
    if (this.preventiveForm.valid) {
      let scheduleTypeValue = this.selectedStructure;
      if (this.selectedStructure === 'Calendar' && this.selectedscheduletype) {
        scheduleTypeValue += ` - ${this.selectedscheduletype}`;
      }
      const daysString = this.selectedDays.join(', ');

      // Patch form values
      this.preventiveForm.patchValue({
        scheduleType: scheduleTypeValue,
        frequencyType: this.selectedFrequencyType,
        advanceCreationPeriod: this.selectedadvanceCreationPeriod,
        daysOfWeek: daysString,
        createdBy: Number(localStorage.getItem('UserId')),
      });

      this.preventiveMaintenanceService
        .addMaintenance(this.preventiveForm.value)
        .subscribe((Response) => {
          Swal.fire({
            icon: 'success',
            title: this.preventiveForm.value.id > 0 ? 'PM Updated Successfully' : 'PM Created Successfully',
            text:  `Preventive Maintenance Schedule ${
              this.preventiveForm.value.id  > 0 ? 'updated' : 'created'
            }.`,
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"
            this.closeviewModal();
          });
        });
    }
  }
  closeviewModal() {
    this.close.emit(); // Emit close event
  }
}
