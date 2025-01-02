using MaintenanceManagementApi.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IPaymentService
    {
        //Add Transaction history 
        Task<int> AddTransaction(PaymentDto payment);

        // Get Transaction history
        Task<List<PaymentDto>> GetPayment(int id);

    }
}
