using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IPaymentRepository
    {
        //Add Transaction history 
        Task<int> AddTransaction(Payment payment);

        // Get Transaction history
        Task<List<Payment>> getPayment(int id);
    }
}
