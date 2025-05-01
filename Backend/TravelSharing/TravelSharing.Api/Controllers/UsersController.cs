using Microsoft.AspNetCore.Mvc;
using TravelSharing.Application.DTOs.User;
using TravelSharing.Application.Interfaces;

namespace TravelSharing.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
   private readonly IUserService _userService;

   public UsersController(IUserService userService)
   {
      _userService = userService;
   }

   [HttpGet]
   public async Task<ActionResult<IEnumerable<UserDto>>> Get()
   {
      var users = await _userService.GetAllUsersAsync();
      return Ok(users); 
   }
   
   [HttpGet("{id}")]
   public async Task<ActionResult<UserDto>> GetUser(Guid id)
   {
      var user = await _userService.GetUserByIdAsync(id);
      if (user == null)
      {
         return NotFound();
      }
      return Ok(user);
   }
   
   [HttpPost]
   public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto createUserDto)
   {
      try
      {
         var newUser = await _userService.CreateUserAsync(createUserDto);
         return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
      }
      catch (Exception ex)
      {
         return BadRequest(ex.Message);
      }
   }
   
   [HttpPut("{id}")]
   public async Task<IActionResult> UpdateUser(Guid id, UpdateUserDto updateUserDto)
   {
      var success = await _userService.UpdateUserAsync(id, updateUserDto);
      if (!success)
      {
         return NotFound();
      }
      return NoContent();
   }
   
   [HttpDelete("{id}")]
   public async Task<IActionResult> DeleteUser(Guid id)
   {
      var success = await _userService.DeleteUserAsync(id);
      if (!success)
      {
         return NotFound();
      }
      return NoContent();
   }
}