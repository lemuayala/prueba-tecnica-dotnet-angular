using AutoMapper;
using Microsoft.Extensions.Logging;
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
}