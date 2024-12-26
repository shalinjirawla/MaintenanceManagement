import { Injectable } from '@angular/core';
import { RequestService } from './request.service'; // Adjust the path as necessary
import { WorkRequestWithStatusDto } from '../Model/WorkRequestWithStatusDto';
import { Workorder } from '../Model/workorder.model';
import { Asset } from '../Model/asset.model';
import { PreventiveMaintenance } from '../Model/PreventiveMaintenance.model';
import { Location } from '../Model/Location.model';
import { Login } from '../Model/login.model';
import { Vendor } from '../Model/vendor.model';
import { Inventorycategories } from '../Model/InventoryCategory.model';
import { InventoryItem } from '../Model/InventoryItem.model';
import { PurchaseOrder } from '../Model/purchaseOrder.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private requestService: RequestService) {}

  getRequests(userId: number) {
    return this.requestService.GetByIdRequest(userId);
  }

  // Reusable filter method
  filter<T>(items: T[], searchTerm: string, fields: string[]) {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return items.filter(item => 
        fields.some(field => this.searchInField(item, field, term))
      );
    }
    return items;
  }
  // Reusable search function for different models
  private searchInField(item: any, field: string, term: string) {
    const value = this.getNestedValue(item, field)?.toString().toLowerCase() || '';
    return value.includes(term);
  }

  // Reusable function to get nested values (if any)
  private getNestedValue(item: any, field: string): any {
    return field.split('.').reduce((acc, part) => acc?.[part], item);
  }

  // Reusable sort method
  sort<T>(items: T[], sortColumn: string, sortOrder: 'asc' | 'desc') {
    if (!sortColumn) return items;
    return items.sort((a, b) => {
      const aValue = this.getNestedValue(a, sortColumn);
      const bValue = this.getNestedValue(b, sortColumn);
      return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * (sortOrder === 'asc' ? 1 : -1);
    });
  }

    // Filtering and Sorting functions for specific models

  filterWorkRequest(workRequests: WorkRequestWithStatusDto[], searchTerm: string) {
    return this.filter(workRequests, searchTerm, [
      'workRequest.title',
      'workRequest.status',
      'workRequest.priority',
      'workRequest.createdDate',
      'createdByUser.username'
    ]);
  }

  sortWorkRequest(workRequests: WorkRequestWithStatusDto[], sortColumn: string, sortOrder: 'asc' | 'desc') {
    return this.sort(workRequests, sortColumn, sortOrder);
  }

  filterWorkOrder(workOrders: Workorder[], searchTerm: string) {
    return this.filter(workOrders, searchTerm, [
      'id', 'title', 'status', 'priority', 'startDate', 'dueDate', 'assignedToUser.username'
    ]);
  }

  sortWorkOrder(workOrders: Workorder[], sortColumn: string, sortOrder: 'asc' | 'desc') {
    return this.sort(workOrders, sortColumn, sortOrder);
  }

  filterAsset(assets: Asset[], searchTerm: string) {
    return this.filter(assets, searchTerm, [
      'id', 'assetName', 'location', 'category', 'serialNumber'
    ]);
  }

  sortAsset(assets: Asset[], sortColumn: string, sortOrder: 'asc' | 'desc') {
    return this.sort(assets, sortColumn, sortOrder);
  }

  filterPM(assets: PreventiveMaintenance[], searchTerm: string) {
    return this.filter(assets, searchTerm, [
      'id', 'title', 'assetName', 'assignToName', 'priority', 'category','scheduleType'
    ]);
  }

  sortPM(assets: PreventiveMaintenance[], sortColumn: string, sortOrder: 'asc' | 'desc') {
    return this.sort(assets, sortColumn, sortOrder);
  }

  filterLocation(locations: Location[], searchTerm: string) {
    return this.filter(locations, searchTerm, ['name', 'description']);
  }
  filterPeople(people:Login[],searchTerm:string){
    return this.filter(people,searchTerm,['username','roleName','email']);
  }
  filterVendor(vendor:Vendor[],searchTerm:string){
    return this.filter(vendor,searchTerm,['name','CompanyName','email','contact','contactPerson']);
  }
  filterInventoryCategory(vendor:Inventorycategories[],searchTerm:string){
    return this.filter(vendor,searchTerm,['categoryName','description','isActive']);
  }
  filterInventoryItem(vendor:InventoryItem[],searchTerm:string){
    return this.filter(vendor,searchTerm,['name','sku','unit','isActive']);
  }
  sortInventoryItem(InventoryItem: InventoryItem[], sortColumn: string, sortOrder: 'asc' | 'desc') {
    return this.sort(InventoryItem, sortColumn, sortOrder);
  }
  filterPurchaseOrder(purchaseOrder: PurchaseOrder[], searchTerm: string) {
    return this.filter(purchaseOrder, searchTerm, [
      'title', 'orderNumber', 'vendorname', 'dateCreated', 'items', 'quantity','totalAmount','status'
    ]);
  }

}
