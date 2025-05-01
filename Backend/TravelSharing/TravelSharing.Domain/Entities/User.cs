namespace TravelSharing.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public double Reputation { get; set; } = 0.0;
    public string? VehicleDetails { get; set; } 
}