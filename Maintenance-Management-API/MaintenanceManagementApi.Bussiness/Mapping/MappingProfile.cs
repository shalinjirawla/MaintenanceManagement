using AutoMapper;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Common.ViewModel;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            // User Mappings
            CreateMap<UserDto, User>().ReverseMap(); // Map User to UserDto and vice versa
            CreateMap<RegisterUserDto, User>(); // Map RegisterUserDto to User (for registration)

            // Role Mappings
            CreateMap<RoleDto, Role>().ReverseMap(); // Map Role to RoleDto and vice versa

            // Right Mappings
            CreateMap<RightDto, Right>().ReverseMap(); // Map Right to RightDto and vice versa

            // RoleRight Mappings
            CreateMap<RoleRightDto, RoleRight>().ReverseMap();
            CreateMap<RequestDto, WorkRequest>().ReverseMap();
            CreateMap<EmailPayloadDto, Quotation>().ReverseMap();
            //CreateMap<WorkRequestWithStatusDto, WorkRequestWithStatus>().ReverseMap();

            CreateMap<WorkRequestWithStatus, WorkRequestWithStatusDto>()
           .ForMember(dest => dest.WorkRequest, opt => opt.MapFrom(src => new WorkRequestDto
           {
               Id = src.WorkRequest.Id,
               Title = src.WorkRequest.Title,
               Description = src.WorkRequest.Description,
               Priority = src.WorkRequest.Priority,
               Image = src.WorkRequest.Image,
               Status = src.WorkRequest.Status,
               CreatedBy = src.WorkRequest.CreatedBy,
               CreatedDate = src.WorkRequest.CreatedDate,
               EstimatedCost = src.WorkRequest.EstimatedCost
               // Map other properties as necessary
           }))
           .ForMember(dest => dest.CreatedByUser, opt => opt.MapFrom(src => new UserDto
           {
               UserID = src.CreatedByUser.UserID,
               Username = src.CreatedByUser.Username,
               Email = src.CreatedByUser.Email
           }))
           .ReverseMap(); // Reverse mapping

            CreateMap<EmployeeDto, User>().ReverseMap();
            CreateMap<WorkOrderDto, WorkOrder>().ReverseMap();
            CreateMap<CompletedWorkOrderDto, CompletedWorkOrder>().ReverseMap();
            CreateMap<CustomerFeedbackDto, CustomerFeedback>().ReverseMap();
            CreateMap<ComplaintDto, Complaint>().ReverseMap();
            CreateMap<AssetDto, Asset>().ReverseMap();
            CreateMap<PreventiveMaintenanceDto, PreventiveMaintenance>().ReverseMap();
            CreateMap<PreventiveMaintenanceDto, PMSchedule>().ReverseMap();
            CreateMap<PMScheduleDto, PMSchedule>().ReverseMap();
            CreateMap<LocationDto, Location>().ReverseMap();
            CreateMap<NotificationDto, Notification>().ReverseMap();
            CreateMap<PaymentDto, Payment>().ReverseMap();
            CreateMap<VendorDto, Vendor>().ReverseMap();
            CreateMap<InventoryCategoryDto, InventoryCategory>().ReverseMap();
            CreateMap<InventoryItemDto, InventoryItem>().ReverseMap();
            CreateMap<PurchaseOrderDto, PurchaseOrder>().ReverseMap();
            CreateMap<PurchaseOrderItemDto, PurchaseOrderItem>().ReverseMap();
            CreateMap<MaintenanceItemDto, MaintenanceItem>().ReverseMap();
        }    
    }
}
