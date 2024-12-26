import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { LayoutService } from '../../Service/layout.service';
import { NavItem } from '../../Model/navitem.model';
import { RouterOutlet } from '@angular/router';
import { LoginService } from '../../Service/login.service';
import { filter } from 'rxjs';
import { NotificationService } from '../../Service/notification.service';
import { Notification } from '../../Model/notification.model';
import { ProfilemodelComponent } from './profilemodel/profilemodel.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ProfilemodelComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  isSidebarCollapsed = false; // Initial state of sidebar
  isMobileView: boolean = false;
  activeModule: string = ''; // Default active module
  navItems: NavItem[] = [];
  prenavItems: NavItem[] = [];
  showLoginModal: boolean = false;
  title: string = '';
  profilemodel: boolean = false;
  username!: string;
  notifications: Notification[] = [];

  isCollapsed = true;
  constructor(
    private layoutService: LayoutService,
    private loginService: LoginService,
    private route: Router,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleClose() {
    this.isCollapsed = true;
  }
  ngOnInit() {
    if (typeof window !== 'undefined') {
      const savedModule = localStorage.getItem('activeModule');
      if (savedModule) {
        this.activeModule = savedModule; // Set active module from localStorage
      }
      else{
        this.activeModule='Dashboard';
      }
      this.isMobileView = window.innerWidth < 768; // Initial check for mobile view
      this.updateNavItems();
      this.checkLogin();

      // Subscribe to router events to update the title when navigating
      this.route.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.updateTitle(); // Update title on navigation
        });

      // Set the title initially
      this.updateTitle();
      const UserId = Number(localStorage.getItem('UserId'));
      this.notificationService.GetMessage(UserId).subscribe((response) => {
        this.notifications = response;
      });
    }
  }
  showNotifications() {
    this.notifications.forEach((notification, index) => {
      // Show the notification
      notification.isRead = true;
      notification.message = notification.message;
      notification.senderName = notification.senderName;
      // Hide after 3 seconds
      setTimeout(() => {
        notification.isRead = false;
        this.cdr.detectChanges();
      }, 5000); // 3 seconds timeout to hide the notification
    });
  }

  ignoreRequest(notificationId: number) {
    // Alternatively, you could mark it as hidden instead of removing it completely:
    let ignoredNotification = this.notifications.find(
      (notification) => notification.id === notificationId
    );
    if (ignoredNotification) {
      ignoredNotification.isRead = false; // Mark it as hidden
    }
  }

  markasread(notificationId: number) {
    this.notificationService
      .markadread(notificationId)
      .subscribe((response) => {
        //this.notifications=response;
      });
  }

  checkLogin() {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const token = localStorage.getItem('token');
    if (token && tokenExpiration) {
      const expirationTime = parseInt(tokenExpiration, 10);
      const currentTime = Date.now();
      if (!token || currentTime > expirationTime) {
        this.showLoginModal = true; // Show login modal if no valid token
      } else {
        const name = localStorage.getItem('Username') || '';
        this.username = name.charAt(0).toUpperCase();
      }
    }
  }

  updateNavItems() {
    this.navItems = this.layoutService.getFilteredNavItems(); // Get filtered nav items
  }
  updateTitle() {
    const routeData = this.activatedRoute.snapshot.firstChild?.data;
    this.title = routeData ? routeData['title'] || '' : ''; // Accessing title using bracket notation
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileView = window.innerWidth < 768; // Adjust the threshold as needed
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectModule(module: string) {
 
    this.activeModule = module; // Set the active module
    localStorage.setItem('activeModule', module); // Save to localStorage
    this.toggleClose();
  }
  selectModules(module: string) {
    this.activeModule = module; // Set the active module
    localStorage.setItem('activeModule', module); 
  }
  isChildActive(children: any[] | undefined): boolean {
    if (!children) {
      return false; // If no children, return false
    }
    return children.some((child) => this.activeModule === child.module);
  }

  openprofilemodel() {
    this.profilemodel = true;
  }
  closeModal() {
    this.profilemodel = false;
  }
  Logout() {
    this.loginService.logout().subscribe({
      next: (response) => {
        console.log(response.message); // Optional: log the message from the server
        // Remove all items from local storage
        localStorage.clear();
        // Navigate to login or another page
        this.route.navigate(['/']); // Adjust this route as needed
        location.reload();
      },
      error: (error) => {
        console.error('Logout failed', error); // Optional: handle errors
      },
    });
  }
}
