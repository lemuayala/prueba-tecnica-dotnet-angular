namespace TravelSharing.Application.DTOs.User;

public class UpdateUserDto
{
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? VehicleDetails { get; set; }
    public double? Reputation { get; set; } 
}