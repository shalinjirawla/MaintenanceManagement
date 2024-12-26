using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace MaintenanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IPaymentService _paymentService;
        private readonly string _stripeSecretKey;

        public PaymentController(IConfiguration configuration, IPaymentService paymentService)
        {
            _configuration = configuration;
            _paymentService = paymentService;
            _stripeSecretKey = _configuration["Stripe:SecretKey"];
            StripeConfiguration.ApiKey = _stripeSecretKey;
        }

        //Stripe transaction
        [HttpPost("create-payment-intent")]
        public IActionResult CreatePaymentIntent([FromBody] PaymentRequestDto request)
        {
            try
            {
                var customerService = new CustomerService();
                var customer =  customerService.Create(new CustomerCreateOptions
                {
                    Email = request.Email                    
                });

                var options = new PaymentIntentCreateOptions
                {
                    Amount = request.Amount * 100,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" },
                    Customer = customer.Id
                };
                var service = new PaymentIntentService();
                PaymentIntent paymentIntent = service.Create(options);

                return Ok(new { client_secret = paymentIntent.ClientSecret });
            }
            catch (StripeException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        //Add Transaction history 
        [HttpPost("addtransaction")]
        public async Task<IActionResult> AddPaymentTransaction([FromBody] PaymentDto payment)
        {
            if (payment == null)
            {
                throw new ArgumentNullException(nameof(payment));
            }
            else
            {
               var data=  await _paymentService.AddTransaction(payment);
                return Ok(data);
            }
          
        }


        // Get Transaction history
        [HttpGet("getpayment/{id}")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPaymenthistory(int id)
        {

            var data = await _paymentService.GetPayment(id);
            if (data == null)
            {
                return NotFound(); // Return 404 if not found
            }

            return Ok(data); // Return 200 OK with the work order data
        }
    }
}
