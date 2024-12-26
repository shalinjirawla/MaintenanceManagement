import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../Service/dashboard.service';
import { CommonModule } from '@angular/common';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend,registerables  } from 'chart.js';
import { DashboardCounts } from '../../Model/DashboardCounts.model';
import { response } from 'express';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  employeeCount = 0;
  feedbackCount = 0;
  complaintCount = 0;
  workorderCount = 0;
  requestCount = 0;
  paymentChart: any;
  inventoryChart: any;
  chart: any;

  circumference = 2 * Math.PI * 45;

  completedWorkOrders = 0;
  woprogressPercentage = 0;
  currentProgress = 0;

  pendingrequest = 0;
  reqprogressPercentage = 0;
  currentreqProgress = 0;

  satisfiedcustomer = 0;
  satcusrogressPercentage = 0;
  currentsatcusProgress = 0;
  inventoryData!:DashboardCounts[];

  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {
    const AdminId = Number(localStorage.getItem('UserId'));
    // Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
    Chart.register(...registerables);
    // Fetch and assign all counts
    this.fetchCounts(AdminId);
    this.dashboardService.getPaymentStats(AdminId).subscribe((data) => {
      const completedPayments = data.totalCount;
      const pendingPayments = data.countingCount;
      this.loadPaymentChart(completedPayments, pendingPayments);
    });
    this.dashboardService.getInventory(AdminId).subscribe(response=> {    
     this.inventoryData=response;
     // Prepare the data
     const labels = this.inventoryData.map(item => item.name);
     const totalQuantities = this.inventoryData.map(item => item.totalCount);    
     const remainingQuantities = this.inventoryData.map(item => item.countingCount);
     this.createBarChart(labels, totalQuantities, remainingQuantities);
    });    
  }

      // Create the chart   
      createBarChart(labels: string[], total: number[], remaining: number[]): void {
        const ctx = document.getElementById('inventoryChart') as HTMLCanvasElement; 
        this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels, // Item names
          datasets: [
            {
              label: 'Total Quantity',
              data: total, // Total quantity for each item
              backgroundColor: 'rgba(33, 150, 243, 0.7)', // Blue color for the full bottle
              borderColor: 'rgba(33, 150, 243, 1)',
              borderWidth: 1,
              barThickness: 20, // Set the thickness of the bars
            },
            {
              label: 'Remaining Quantity',
              data: remaining, // Remaining quantity for each item
              backgroundColor: 'rgba(76, 175, 80, 0.7)', // Green color for the liquid (remaining)
              borderColor: 'rgba(76, 175, 80, 1)',
              borderWidth: 1,
              barThickness: 20, // Same thickness for the overlay bar
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true, // Start Y-axis at zero
              ticks: {
                callback: function (value) {
                  return value; // Show the exact value on the Y-axis (height of the bar)
                }
              }
            },
            x: {
              stacked: false, // Do not stack bars
              grid: {
                offset: true // Allows for no space between bars
              },
              ticks: {
                // Adjust padding for the x-axis labels to reduce spacing
                padding: 0
              }         
            },  
          },
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Show dataset value in tooltip
                }
              }
            }
          },
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 10
            }
          },
        }
      });
    }
  
  fetchCounts(adminId: number): void {
    this.dashboardService.getPeopleAllcount(adminId).subscribe((response) => {
      this.employeeCount = response;
    });

    this.dashboardService.Getfeedbackcount(adminId).subscribe((response) => {
      this.feedbackCount = response.totalCount;
      this.satisfiedcustomer = response.countingCount;
      this.updateProgressValues();
    });

    this.dashboardService.GetComplaintcount(adminId).subscribe((response) => {
      this.complaintCount = response;
    });

    this.dashboardService
      .GetAllWorkOrdercount(adminId)
      .subscribe((response) => {
        this.workorderCount = response.totalCount;
        this.completedWorkOrders = response.countingCount;
        this.updateProgressValues();
      });

    this.dashboardService.GetAllRequestscount(adminId).subscribe((response) => {
      this.requestCount = response.totalCount;
      this.pendingrequest = response.countingCount;
      this.updateProgressValues();
    });
  }
  loadPaymentChart(completedPayments:number, pendingPayments:number) {

    this.paymentChart = new Chart('paymentChart', {
      type: 'doughnut', // Choose chart type (e.g., bar, line, pie, doughnut)
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            label: 'Payments',
            data: [completedPayments, pendingPayments], // Data array
            backgroundColor: ['#ace7af', '#efb7b7'], // Green for completed, Red for pending
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) =>
                `${tooltipItem.label}: ${tooltipItem.raw} payments`,
            },
          },
        },
      },
    });
  }
  // Animate progress from 0 to final percentage
  updateProgressValues(): void {
    this.woprogressPercentage = this.calculatePercentage(
      this.completedWorkOrders,
      this.workorderCount
    );
    this.reqprogressPercentage = this.calculatePercentage(
      this.pendingrequest,
      this.requestCount
    );
    this.satcusrogressPercentage = this.calculatePercentage(
      this.satisfiedcustomer,
      this.feedbackCount
    );

    this.animateProgress('currentProgress', 'woprogressPercentage');
    this.animateProgress('currentreqProgress', 'reqprogressPercentage');
    this.animateProgress('currentsatcusProgress', 'satcusrogressPercentage');
  }

  calculatePercentage(part: number, total: number): number {
    return total > 0 ? (part / total) * 100 : 0;
  }
  // Animate progress from 0 to progressPercentage
  animateProgress(currentProp: string, targetProp: string): void {
    const interval = setInterval(() => {
      if ((this as any)[currentProp] < (this as any)[targetProp]) {
        (this as any)[currentProp]++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  }
}
