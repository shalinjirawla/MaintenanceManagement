import { Routes } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { LoginComponent } from './Components/login/login.component';
import { RequestComponent } from './Components/request/request.component';
import { LocationComponent } from './Components/location/location.component';
import { WorkorderComponent } from './Components/workorder/workorder.component';
import { RequesttrackingComponent } from './Components/requesttracking/requesttracking.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { PeopleComponent } from './Components/people/people.component';
import { FeedbackComponent } from './Components/feedback/feedback.component';
import { ComplaintComponent } from './Components/complaint/complaint.component';
import { SupportComponent } from './Components/support/support.component';
import { AssetsComponent } from './Components/assets/assets.component';
import { PreventivemaintenanceComponent } from './Components/preventivemaintenance/preventivemaintenance.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { PaymentsmanageComponent } from './Components/paymentsmanage/paymentsmanage.component';
import { InventoryComponent } from './Components/inventory/inventory.component';
import { PurchaseordersComponent } from './Components/purchaseorders/purchaseorders.component';
import { VendorsComponent } from './Components/vendors/vendors.component';
import { InventorycategoriesComponent } from './Components/inventorycategories/inventorycategories.component';
import { InventoryitemsComponent } from './Components/inventoryitems/inventoryitems.component';
import { AdminGuard } from './authenticatation/admin.guard';


export const routes: Routes = [

    { path : 'dashboard',component:DashboardComponent,data:{title:'Dashboard'},canActivate: [AdminGuard]},
    { path : 'layout', component:LayoutComponent},
    { path : 'login', component:LoginComponent},
    { path : 'location', component:LocationComponent, data: { title: 'Location' },canActivate: [AdminGuard]},
    { path : 'workorder', component:WorkorderComponent, data: { title: 'Work Orders' }},
    { path : 'request', component:RequestComponent, data: { title: 'Request' }},
    { path : 'requesttraking', component:RequesttrackingComponent, data: { title: 'Requests Tracking' },canActivate: [AdminGuard]},
    { path : 'people',component:PeopleComponent, data: { title: 'People' },canActivate: [AdminGuard]},
    { path : 'feedback',component:FeedbackComponent, data: { title: 'Feedback' }},
    { path : 'complaint', component:ComplaintComponent, data: { title: 'Complaint' }},
    { path : 'support', component:SupportComponent, data: { title: 'Support' }},
    { path : 'assets', component:AssetsComponent, data: { title: 'Assets' },canActivate: [AdminGuard]},
    { path : 'settings', component:SettingsComponent, data: { title: 'All Settings' },canActivate: [AdminGuard]},
    { path : 'preventive-maintenance', component:PreventivemaintenanceComponent,data:{title:'Preventive Maintenance'},canActivate: [AdminGuard]},
    { path : 'payments', component:PaymentsmanageComponent, data: { title: 'Payments' },canActivate: [AdminGuard]},
    { path : 'inventory', component:InventoryComponent, data: { title: 'Inventory' },canActivate: [AdminGuard]},
    { path : 'purchaseorder', component:PurchaseordersComponent, data: { title: 'Purchase Order' },canActivate: [AdminGuard]},
    { path : 'vendors', component:VendorsComponent, data: { title: 'Vendors' },canActivate: [AdminGuard]},
    { path : 'inventorycategory', component:InventorycategoriesComponent, data: { title: 'Inventory Category' },canActivate: [AdminGuard]},
    { path : 'inventoryitems', component:InventoryitemsComponent, data: { title: 'Inventory Items' },canActivate: [AdminGuard]},
];  
