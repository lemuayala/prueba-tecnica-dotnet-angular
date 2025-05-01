# TravelSharing API Backend

Este es el backend para la aplicación TravelSharing, desarrollado utilizando ASP.NET Core. Proporciona una API RESTful para gestionar usuarios, viajes (futuro) y otras funcionalidades de la plataforma.

## Tecnologías Utilizadas

*   **Framework:** ASP.NET Core (.NET 9)
*   **Lenguaje:** C# 13
*   **Base de Datos:** MySQL
*   **ORM:** Entity Framework Core (EF Core)
    *   **Configuración del Modelo:** Se utiliza **Fluent API** para definir explícitamente el esquema de la base de datos, relaciones y restricciones en el código.
    *   **Migraciones:** EF Core Migrations para gestionar y aplicar cambios en el esquema de la base de datos.
*   **Mapeo de Objetos:** AutoMapper para facilitar la conversión entre entidades de dominio y DTOs (Data Transfer Objects).
*   **Documentación API:** Swashbuckle (Swagger/OpenAPI) para generar documentación interactiva de la API y permitir pruebas directamente desde el navegador.
*   **Contenedor de Inyección de Dependencias:** El contenedor de DI integrado en ASP.NET Core.

## Arquitectura y Patrones

El proyecto sigue una arquitectura limpia por capas (Domain, Application, Infrastructure, API) y utiliza los siguientes patrones de diseño:

*   **Repository Pattern:** Abstrae el acceso a los datos. Cada entidad principal tiene su propio repositorio (ej., `IUserRepository`).
*   **Unit of Work Pattern:** Gestiona las transacciones de la base de datos y coordina los repositorios (`IUnitOfWork`). Asegura que múltiples operaciones de repositorio se completen en una única transacción.
*   **Service Layer:** Contiene la lógica de negocio principal y orquesta las llamadas a los repositorios a través de la Unit of Work (ej., `IUserService`).
*   **DTO (Data Transfer Object):** Se usan para transferir datos entre la capa de API y la capa de servicio/aplicación, evitando exponer directamente las entidades del dominio.

## Configuración del Proyecto

1.  **Clonar el Repositorio:**
    ```bash
    git clone <tu-url-del-repositorio>
    cd <nombre-del-repositorio>/backend
    ```
2.  **Configurar la Cadena de Conexión:**
    *   Asegúrate de tener un servidor MySQL en ejecución.
    *   Modifica la cadena de conexión `DefaultConnection` en el archivo `backend/TravelSharing.Api/appsettings.Development.json` (o `appsettings.json`) con los detalles de tu base de datos MySQL:
        ```json
        {
          "ConnectionStrings": {
            "DefaultConnection": "Server=localhost;Port=3306;Database=travelsharing_db;User ID=travelsharing_user;Password=tu_contraseña_mysql;SslMode=Preferred;"
          },
          // ... otras configuraciones
        }
        ```
3.  **Instalar Dependencias:**
    (Asegúrate de tener instalado el SDK de .NET 9 o superior)
    ```bash
    dotnet restore
    ```
4.  **Aplicar Migraciones de Base de Datos:**
    Desde la carpeta raíz del repositorio (`<nombre-del-repositorio>`) o la carpeta `backend`:
    ```bash
    dotnet ef database update --project backend/TravelSharing.Api --startup-project backend/TravelSharing.Api
    ```
    Esto creará la base de datos (si no existe) y aplicará las migraciones pendientes definidas en el proyecto de Infraestructura.

## Ejecutar la Aplicación

1.  Navega a la carpeta del proyecto API:
    ```bash
    cd backend/TravelSharing.Api
    ```
2.  Ejecuta la aplicación:
    ```bash
    dotnet run
    ```
    La API estará escuchando en las URLs especificadas en `launchSettings.json` (generalmente `https://localhost:PORT` y `http://localhost:PORT`).

## Documentación de la API (Swagger)

Una vez que la aplicación esté en ejecución:

1.  Abre tu navegador web.
2.  Navega a la ruta `/swagger` de tu aplicación (ej., `https://localhost:7123/swagger` o `http://localhost:5123/swagger`).

Verás la interfaz de usuario de Swagger, que documenta todos los endpoints disponibles y te permite probarlos directamente.

## Próximos Pasos / Mejoras Pendientes

*   **Implementar FluentValidation:** Añadir validaciones más robustas y declarativas para los DTOs de entrada utilizando la librería FluentValidation.
*   **Autenticación y Autorización:** Implementar un sistema de seguridad (ej. JWT Bearer tokens).
*   **Logging:** Mejorar y configurar el logging para producción.
*   **Testing:** Añadir pruebas unitarias y de integración.
*   **Gestión de Errores:** Implementar un middleware global de manejo de excepciones.
