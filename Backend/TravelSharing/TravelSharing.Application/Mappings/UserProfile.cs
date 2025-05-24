using AutoMapper;
using TravelSharing.Application.DTOs.Auth;
using TravelSharing.Application.DTOs.User;
using TravelSharing.Domain.Entities;

namespace TravelSharing.Application.Mappings;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<CreateUserDto, User>();
        CreateMap<UpdateUserDto, User>();

        CreateMap<RegisterUserDto, User>();
    }
}