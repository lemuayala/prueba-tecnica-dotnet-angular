using Microsoft.EntityFrameworkCore;
using TravelSharing.Domain.Entities;

namespace TravelSharing.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
         base.OnModelCreating(modelBuilder); 
         
         modelBuilder.Entity<User>(entity =>
         {
             entity.ToTable("Users");

             entity.HasKey(u => u.Id);
             
             entity.Property(u => u.Name)
                 .IsRequired()
                 .HasMaxLength(100);
             
             entity.Property(u => u.Email)
                 .IsRequired()
                 .HasMaxLength(256);
             entity.HasIndex(u => u.Email).IsUnique(); 
             
             entity.Property(u => u.PhoneNumber)
                 .HasMaxLength(20); 

             entity.Property(u => u.Reputation)
                 .HasDefaultValue(0.0); 
             
             entity.Property(u => u.VehicleDetails)
                 .HasMaxLength(500);

             entity.Property(u => u.PasswordHash)
               .IsRequired();

             entity.Property(u => u.PasswordSalt)
                 .IsRequired();

             entity.Property(u => u.Role)
                 .IsRequired()
                 .HasMaxLength(50);
         });


    }
}