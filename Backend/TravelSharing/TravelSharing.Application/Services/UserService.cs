using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TravelSharing.Application.DTOs.Auth;
using TravelSharing.Application.DTOs.User;
using TravelSharing.Application.Interfaces;
using TravelSharing.Domain.Entities;
using TravelSharing.Domain.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace TravelSharing.Application.Services;

public class UserService : IUserService
{

    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UserService>? _logger;
    private readonly IConfiguration _configuration;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration configuration, ILogger<UserService>? logger = null)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
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

    public async Task<LoginResponseDto> LoginAsync(LoginUserDto loginUserDto)
    {
        _logger?.LogInformation("Attempting to login user with email: {UserEmail}", loginUserDto.Email);

        var userEntity = await _unitOfWork.Users.GetByEmailAsync(loginUserDto.Email);

        if (userEntity == null)
        {
            _logger?.LogWarning("Login failed. User with email {UserEmail} not found.", loginUserDto.Email);
            throw new UnauthorizedAccessException("Credenciales inválidas.");
        }

        // Verificar la contraseña
        if (!VerifyPasswordHash(loginUserDto.Password, userEntity.PasswordHash, userEntity.PasswordSalt))
        {
            _logger?.LogWarning("Login failed. Invalid password for user {UserEmail}.", loginUserDto.Email);
            throw new UnauthorizedAccessException("Credenciales inválidas.");
        }

        _logger?.LogInformation("User {UserEmail} authenticated successfully. Generating JWT.", loginUserDto.Email);

        // Generar Token JWT
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT Key is not configured."));

        var claims = new List<Claim>
            {
                new (JwtRegisteredClaimNames.Sub, userEntity.Id.ToString()), // Subject (ID del usuario)
                new (JwtRegisteredClaimNames.Email, userEntity.Email),
                new (JwtRegisteredClaimNames.Name, userEntity.Name),
                new (ClaimTypes.Role, userEntity.Role), // Rol del usuario
                new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // JWT ID, para unicidad
            };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["Jwt:DurationInHours"] ?? "1")), // Duración del token
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return new LoginResponseDto
        {
            Token = tokenString,
            Expiration = tokenDescriptor.Expires ?? DateTime.UtcNow.AddHours(1),
            UserId = userEntity.Id.ToString(),
            Email = userEntity.Email,
            Name = userEntity.Name,
            Role = userEntity.Role
        };
    }

    private static bool VerifyPasswordHash(string password, string storedHash, string storedSalt)
    {
        byte[] saltBytes = Convert.FromBase64String(storedSalt);
        var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000, HashAlgorithmName.SHA256);
        byte[] hashBytes = pbkdf2.GetBytes(32); // 256 bits
        var computedHash = Convert.ToBase64String(hashBytes);

        return computedHash == storedHash;
    }
}