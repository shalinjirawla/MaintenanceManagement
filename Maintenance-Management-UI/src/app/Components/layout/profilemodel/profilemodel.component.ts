import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Login } from '../../../Model/login.model';

@Component({
  selector: 'app-profilemodel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profilemodel.component.html',
  styleUrl: './profilemodel.component.css'
})
export class ProfilemodelComponent {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  userdata!:Login;

  constructor(){
    this.userdata = new Login();  // Ensure userdata is initialized before use
    this.userdata.userID=Number(localStorage.getItem("UserId") || '');
    this.userdata.username = localStorage.getItem("Username") || ''; 
    this.userdata.email=localStorage.getItem("UserEmail") || '';
    this.userdata.roleName=localStorage.getItem("Role") || '';    
    
  }
  getFirstLetter(username: string): string {
    if (!username) return '';  // Handles the case if username is empty or null
    return username.charAt(0).toUpperCase();
  }
  

  closeModal() {    
    this.close.emit(); // Emit close event
    this.item = null; // Reset item
  }
}
