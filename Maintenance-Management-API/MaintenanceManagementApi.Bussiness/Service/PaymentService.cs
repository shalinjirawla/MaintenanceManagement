using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class PaymentService:IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;

        public PaymentService(IPaymentRepository paymentRepository,IMapper mapper)
        {
            _paymentRepository = paymentRepository;
            _mapper = mapper;
        }

        //Add Transaction history 
        public async Task<int> AddTransaction(PaymentDto payment)
        {
            if (payment == null)
            {
                throw new ArgumentNullException(nameof(payment));
            }
            var data = _mapper.Map<Payment>(payment);
            return await _paymentRepository.AddTransaction(data);
        }

        // Get Transaction history
        public async Task<List<PaymentDto>> GetPayment(int id)
        {
            var data = await _paymentRepository.getPayment(id);
            return _mapper.Map<List<PaymentDto>>(data);
        }
    }
}
