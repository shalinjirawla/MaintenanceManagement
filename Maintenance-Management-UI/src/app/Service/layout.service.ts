import { Injectable } from '@angular/core';
import { NavItem } from '../Model/navitem.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private navItems: NavItem[] = [  
    { label: 'Dashboard', mobileLabel: 'Dashboard', icon: 'la la-tachometer-alt', route: '/dashboard', module: 'Dashboard' },
    { label: 'Work Orders', mobileLabel: 'WO', icon: 'la la-clipboard-list', route: '/workorder', module: 'Work orders' },
    { label: 'Preventive Maintenance', mobileLabel: 'PM', icon: 'la la-calendar-day', route: '/preventive-maintenance', module: 'Preventive maintenance' },
    { label: 'Requests', mobileLabel: 'Requests', icon: 'la la-paper-plane', route: '/request', module: 'Requests' },
    { label: 'Request Tracking', mobileLabel: 'Request Tracking', icon: 'la la-paper-plane', route: '/requesttraking', module: 'Request Tracking' },
    { label: 'Locations', mobileLabel: 'Locations', icon: 'la la-map-marker-alt', route: '/location', module: 'Locations' },
    { label: 'Assets', mobileLabel: 'Assets', icon: 'la las la-boxes', route: '/assets', module: 'Assets' },
    { label: 'Parts & Inventory', mobileLabel: 'Parts', icon: 'la la-truck-loading', route: ' ', module: 'Parts & Inventory',
      children: [
        { label: 'Inventory', mobileLabel: 'Parts', icon: 'fa fa-circle fa-sm', route: 'inventory', module: 'Inventory' },
        { label: 'Category', mobileLabel: 'Category', icon: 'fa fa-circle fa-sm', route: 'inventorycategory', module: 'Category' },
        { label: 'Items', mobileLabel: 'Items', icon: 'fa fa-circle fa-sm', route: 'inventoryitems', module: 'Items' }
      ],  
      isCollapsed: true 
     },
    { label: 'Purchase Orders', mobileLabel: 'PO', icon: 'la la-shopping-cart', route: '/purchaseorder', module: 'Purchase Orders' },     
    { label: 'Vendors', mobileLabel: 'Vendors', icon: 'la la-people-carry', route: '/vendors', module: 'Vendors' },     
    { label: 'People', mobileLabel: 'People', icon: 'la la-user-friends', route: '/people', module: 'People' },
    { label: 'Payments', mobileLabel: 'Payments', icon: 'la la-credit-card', route: '/payments', module: 'Payments' },    
    { label: 'Support', mobileLabel: 'Support', icon: 'la la-life-ring  ', route: '/support', module: 'Support' },
    { label: 'Settings', mobileLabel: 'Settings', icon: 'la la-cog', route: '/settings', module: 'Settings' },
    // { label: 'Reports', mobileLabel: 'Reports', icon: 'fas fa-chart-line', route: '/reports', module: 'Reports' },
  ];

  getNavItems(): NavItem[] {
    return this.navItems;
  }

  getMobileLabel(module: string): string | undefined {
    const item = this.navItems.find(i => i.module === module);
    return item?.mobileLabel;
  }
  getFilteredNavItems(): NavItem[] {
    const rights = localStorage.getItem('Rights'); // Get rights from local storage
    const rightsArray = rights ? rights.split(',') : []; // Convert rights string to an array

    // Filter navItems based on rights
    return this.navItems.filter(item => rightsArray.includes(item.label));
  }
}
