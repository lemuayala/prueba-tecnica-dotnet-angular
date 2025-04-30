# Travel Sharing 🚗💨

Proyecto técnico que implementa un sistema para compartir viajes interurbanos, desarrollado con:
- **Frontend**: Angular 19 + PrimeNG + NGRX
- **Backend**: .NET 9 + Entity Framework Core + MySQL

## Estructura del Proyecto
```
/backend # Solución .NET 9
/frontend # Aplicación Angular 19
```
## Requisitos Previos
- Node.js 18+
- .NET SDK 9.0
- MySQL 8.0+
- Angular CLI 19

## Configuración Inicial
1. Clonar el repositorio
2. Configurar la base de datos (ver README en /backend)
3. Iniciar ambos proyectos (ver READMEs específicos)

## Despliegue
```bash
# Backend
cd backend/TravelSharing.API
dotnet run

# Frontend
cd frontend
ng serve
```

## Características Implementadas

✔ ABM completo de viajes 
✔ Integración con NGRX
✔ Formularios reactivos
✔ Tabla con filtros (PrimeNG)
✔ Patrón Repository y Service
✔ Validaciones con FluentValidation