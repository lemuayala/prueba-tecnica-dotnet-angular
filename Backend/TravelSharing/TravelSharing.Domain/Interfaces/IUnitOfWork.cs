namespace TravelSharing.Domain.Interfaces;

public interface IUnitOfWork : IDisposable

{
    IUserRepository Users { get; }

    /// <summary>
    /// Guarda todos los cambios realizados en este contexto en la base de datos.
    /// </summary>
    /// <returns>El número de objetos de estado escritos en la base de datos.</returns>
    Task<int> CompleteAsync();
}