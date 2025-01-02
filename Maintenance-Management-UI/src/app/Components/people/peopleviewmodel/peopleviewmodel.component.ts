import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Login } from '../../../Model/login.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-peopleviewmodel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './peopleviewmodel.component.html',
  styleUrl: './peopleviewmodel.component.css',
})
export class PeopleviewmodelComponent {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();

  //Close Model
  closeModal() {
    this.close.emit(); // Emit the close event after animation completes
  }
}
  