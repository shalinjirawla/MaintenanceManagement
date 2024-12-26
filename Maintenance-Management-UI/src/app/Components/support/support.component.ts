import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
})
export class SupportComponent {
  supportTypes = [
    {
      id: 'technical',
      title: 'Technical Support',
      description: 'Troubleshoot and get help',
      icon: 'fa fa-life-ring',
    },
    {
      id: 'complaints',
      title: 'Customer Complaints',
      route: '/complaint',
      description: 'Submit a complaint',
      icon: 'fa fa-comments',
    },
    {
      id: 'knowledge-base',
      title: 'Knowledge Base',
      route: '/complaint',
      description: 'Browse help articles',
      icon: 'fa fa-book',
    },
    // Add more as needed
  ];
  constructor() {
    const role = localStorage.getItem('Role');
    if (role === 'Admin') {
      this.supportTypes.push({
        id: 'feedback',
        title: 'Feedback',
        route: '/feedback',
        description: 'Review and respond to customer feedback',
        icon: 'fa fa-star',
      });
    }
  }
}
