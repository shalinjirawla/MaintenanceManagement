using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DataDbContext;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.Repository
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly AppDbContext _context;

        public PaymentRepository(AppDbContext context)
        {
            _context = context;
        }

        //Add Transaction history 
        public async Task<int> AddTransaction(Payment payment)
        {
            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();
            return payment.Id;
        }

        // Get Transaction history
        public async Task<List<Payment>> getPayment(int id)
        {
            var data = await (id == 1? _context.Payments.ToListAsync() // If id is 1, fetch all records
        : (from payment in _context.Payments
           join user in _context.Users on payment.Email equals user.Email
           where user.HadAdminId == id // Filter by HadAdminId when id is not 1
           select payment).ToListAsync());

            return data;
        }

        
    }
}
