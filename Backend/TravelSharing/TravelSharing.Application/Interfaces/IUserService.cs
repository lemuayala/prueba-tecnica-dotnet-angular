

using TravelSharing.Application.DTOs.Auth;
using TravelSharing.Application.DTOs.User;

namespace TravelSharing.Application.Interfaces;

public interface IUserService
{
    /// <summary>
    /// Obtiene todos los usuarios.
    /// </summary>
    /// <returns>Una colección de DTOs de usuario.</returns>
    Task<IEnumerable<UserDto>> GetAllUsersAsync();

    /// <summary>
    /// Obtiene un usuario específico por su ID.
    /// </summary>
    /// <param name="id">El ID del usuario a buscar.</param>
    /// <returns>El DTO del usuario si se encuentra, o null si no.</returns>
    Task<UserDto?> GetUserByIdAsync(Guid id);

    /// <summary>
    /// Crea un nuevo usuario.
    /// </summary>
    /// <param name="createUserDto">Los datos para crear el nuevo usuario.</param>
    /// <returns>El DTO del usuario recién creado.</returns>
    Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);

    /// <summary>
    /// Actualiza un usuario existente.
    /// </summary>
    /// <param name="id">El ID del usuario a actualizar.</param>
    /// <param name="updateUserDto">Los datos actualizados del usuario.</param>
    /// <returns>True si la actualización fue exitosa, False si el usuario no se encontró.</returns>
    Task<bool> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto);

    /// <summary>
    /// Elimina un usuario por su ID.
    /// </summary>
    /// <param name="id">El ID del usuario a eliminar.</param>
    /// <returns>True si la eliminación fue exitosa, False si el usuario no se encontró.</returns>
    Task<bool> DeleteUserAsync(Guid id);

    /// <summary>
    /// Registro público de un usuario de la app
    /// </summary>
    /// <param name="registerUserDto"></param>
    /// <returns>El DTO del usuario recién creado.</returns>
    Task<UserDto> RegisterUserAsync(RegisterUserDto registerUserDto);

    /// <summary>
    /// Autentica a un usuario basado en sus credenciales.
    /// </summary>
    /// <param name="loginUserDto">DTO que contiene el email y la contraseña del usuario.</param>
    /// <returns>Un DTO con el token JWT y la información del usuario si la autenticación es exitosa.</returns>
    /// <exception cref="UnauthorizedAccessException">Se lanza si las credenciales son inválidas.</exception>
    Task<LoginResponseDto> LoginAsync(LoginUserDto loginUserDto);
}