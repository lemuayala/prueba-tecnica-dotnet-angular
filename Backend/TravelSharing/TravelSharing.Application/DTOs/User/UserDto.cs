namespace TravelSharing.Application.DTOs.User;

public class UserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public double Reputation { get; set; }
    public string? VehicleDetails { get; set; }
    public string Role { get; set; } = string.Empty;
}