using System.ComponentModel.DataAnnotations;

namespace TravelSharing.Application.DTOs.Auth
{
    public class RegisterUserDto
    {
        [Required(ErrorMessage = "El nombre completo es requerido.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo electrónico es requerido.")]
        [EmailAddress(ErrorMessage = "Formato de correo electrónico inválido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "El número de teléfono es requerido.")]
        [Phone(ErrorMessage = "Formato de número de teléfono inválido.")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string Password { get; set; } = string.Empty;

        public string? VehicleDetails { get; set; }
    }
}
