using AutoMapper;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using TravelSharing.Application.DTOs.Auth;
using TravelSharing.Application.DTOs.User;
using TravelSharing.Application.Interfaces;
using TravelSharing.Domain.Entities;
using TravelSharing.Domain.Interfaces;

namespace TravelSharing.Application.Services;

public class UserService : IUserService
{

    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UserService>? _logger;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper
    , ILogger<UserService>? logger = null)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger;
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid id)
    {
        _logger?.LogInformation("Attempting to get user entity with ID: {UserId}", id);
        var userEntity = await _unitOfWork.Users.GetByIdAsync(id);

        if (userEntity == null)
        {
            _logger?.LogWarning("User entity with ID: {UserId} not found.", id);
            return null;
        }

        _logger?.LogInformation("Mapping User entity to UserDto for ID: {UserId}", id);
        var userDto = _mapper.Map<UserDto>(userEntity);

        return userDto;
    }
    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        _logger?.LogInformation("Attempting to get all user entities.");
        var userEntities = await _unitOfWork.Users.GetAllAsync();
        _logger?.LogInformation("Mapping {UserCount} User entities to UserDto list.", userEntities.Count());

        var userDtos = _mapper.Map<IEnumerable<UserDto>>(userEntities);
        return userDtos;
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        _logger?.LogInformation("Mapping CreateUserDto to User entity for email: {UserEmail}", createUserDto.Email);

        var userEntity = _mapper.Map<User>(createUserDto);

        _logger?.LogInformation("Attempting to add new user entity.");
        await _unitOfWork.Users.AddAsync(userEntity);
        await _unitOfWork.CompleteAsync();
        _logger?.LogInformation("User entity created with ID: {UserId}. Mapping back to UserDto.", userEntity.Id);

        var createdUserDto = _mapper.Map<UserDto>(userEntity);
        return createdUserDto;
    }

    public async Task<bool> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto)
    {
        _logger?.LogInformation("Attempting to get user entity with ID: {UserId} for update.", id);
        var existingUserEntity = await _unitOfWork.Users.GetByIdAsync(id);

        if (existingUserEntity == null)
        {
            _logger?.LogWarning("Update failed. User entity with ID: {UserId} not found.", id);
            return false;
        }

        _logger?.LogInformation("Mapping UpdateUserDto over existing User entity with ID: {UserId}", id);

        _mapper.Map(updateUserDto, existingUserEntity);

        _logger?.LogInformation("Attempting to save updated user entity with ID: {UserId}", id);
        await _unitOfWork.CompleteAsync();
        _logger?.LogInformation("User entity with ID: {UserId} updated successfully.", id);
        return true;
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        _logger?.LogInformation("Attempting to get user entity with ID: {UserId} for deletion.", id);
        var userToDelete = await _unitOfWork.Users.GetByIdAsync(id);

        if (userToDelete == null)
        {
            _logger?.LogWarning("Delete failed. User entity with ID: {UserId} not found.", id);
            return false;
        }

        _logger?.LogInformation("Attempting to delete user entity with ID: {UserId}", id);
        _unitOfWork.Users.Delete(userToDelete);
        await _unitOfWork.CompleteAsync();
        _logger?.LogInformation("User entity with ID: {UserId} deleted successfully.", id);
        return true;
    }

    public async Task<UserDto> RegisterUserAsync(RegisterUserDto registerUserDto)
    {
        _logger?.LogInformation("Attempting to register new user with email: {UserEmail}", registerUserDto.Email);

        // Validar si el email ya existe
        var existingUser = await _unitOfWork.Users.GetByEmailAsync(registerUserDto.Email);
        if (existingUser != null)
        {
            _logger?.LogWarning("Registration failed. Email {UserEmail} already exists.", registerUserDto.Email);
            throw new ArgumentException($"El correo electrónico '{registerUserDto.Email}' ya está en uso.");
        }

        // Hashear la contraseña
        // ADVERTENCIA: Este es un ejemplo MUY BÁSICO de hashing.
        // Para producción, usariamos BCrypt.Net o ASP.NET Core Identity.
        byte[] saltBytes = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }
        var salt = Convert.ToBase64String(saltBytes);

        var pbkdf2 = new Rfc2898DeriveBytes(registerUserDto.Password, saltBytes, 10000, HashAlgorithmName.SHA256);
        byte[] hashBytes = pbkdf2.GetBytes(32); // 256 bits
        var hashedPassword = Convert.ToBase64String(hashBytes);

        // Mapear DTO a Entidad
        var userEntity = _mapper.Map<User>(registerUserDto);

        // Asignar propiedades adicionales
        userEntity.PasswordHash = hashedPassword;
        userEntity.PasswordSalt = salt;
        userEntity.Reputation = 0.0; // Valor inicial por defecto

        // Determinar el rol
        userEntity.Role = string.IsNullOrWhiteSpace(registerUserDto.VehicleDetails) ? "Passenger" : "Driver";
        _logger?.LogInformation("User {UserEmail} will be registered with role: {UserRole}", registerUserDto.Email, userEntity.Role);


        // Guardar en la BD
        await _unitOfWork.Users.AddAsync(userEntity);
        await _unitOfWork.CompleteAsync();
        _logger?.LogInformation("User entity created with ID: {UserId} for email: {UserEmail}", userEntity.Id, userEntity.Email);

        //Mapear a UserDto y retornar
        var createdUserDto = _mapper.Map<UserDto>(userEntity);
        return createdUserDto;
    }
}