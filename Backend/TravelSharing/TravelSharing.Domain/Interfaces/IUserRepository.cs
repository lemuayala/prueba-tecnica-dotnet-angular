using System.Linq.Expressions;
using TravelSharing.Domain.Entities;

namespace TravelSharing.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<IEnumerable<User>> GetAllAsync();
    Task<IEnumerable<User>> FindAsync(Expression<Func<User, bool>> predicate);
    Task AddAsync(User entity);
    void Update(User entity);
    void Delete(User entity); 
}