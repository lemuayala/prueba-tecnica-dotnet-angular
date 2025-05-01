using Microsoft.EntityFrameworkCore;
using TravelSharing.Domain.Entities;

namespace TravelSharing.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<User>().Property(u => u.Email).IsRequired().HasMaxLength(256);

        base.OnModelCreating(modelBuilder);
    }
}