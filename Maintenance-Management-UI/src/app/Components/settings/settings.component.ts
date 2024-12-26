import { Component, ViewChild } from '@angular/core';
import {  NgxStripeModule,  StripeCardComponent,  StripeCardNumberComponent,  StripeFactoryService,  StripeInstance,  StripeService,} from 'ngx-stripe';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subscription, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InventorycategoriesComponent } from '../inventorycategories/inventorycategories.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { InventoryitemsComponent } from '../inventoryitems/inventoryitems.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {


}



