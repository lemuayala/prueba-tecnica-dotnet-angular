# Travel Sharing 🚗💨

¡Hola! 👋 Este es el repositorio del proyecto técnico para un **sistema de compartición de viajes interurbanos**. Una solución completa con un backend robusto y un frontend moderno y reactivo.

## Descripción

El objetivo es crear una plataforma funcional y atractiva donde los usuarios puedan ofrecer y encontrar viajes compartidos entre ciudades. Combina la potencia de .NET 9 en el backend con la flexibilidad de Angular 19 en el frontend.

## Tecnologías Utilizadas 🛠️

*   **Frontend:**
    *   `Angular 19`
    *   `PrimeNG` (Para componentes UI geniales ✨)
    *   `NgRx` (Gestión de estado)
    *   `Tailwind CSS` (Si lo estás usando, si no, quítalo o pon CSS/SCSS)
    *   `TypeScript`
*   **Backend:**
    *   `.NET 9`
    *   `Entity Framework Core` (ORM)
    *   `MySQL 8.0+` (Base de Datos)
    *   `FluentValidation` (Validaciones)
*   **Arquitectura Backend:**
    *   Patrón Repository
    *   Patrón Service

## Estructura del Proyecto 📁

El proyecto está organizado en dos carpetas principales:

```
/backend # Solución .NET 9
/frontend # Aplicación Angular 19
```

Cada carpeta tiene su propio `README.md` con detalles específicos.

## Requisitos Previos 📋

Asegúrate de tener instalado lo siguiente:

*   Node.js (v18 o superior)
*   .NET SDK (v9.0)
*   MySQL Server (v8.0 o superior)
*   Angular CLI (v19) (`npm install -g @angular/cli`)

## Configuración Inicial ⚙️

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/lemuayala/prueba-tecnica-dotnet-angular.git
    cd prueba-tecnica-dotnet-angular
    ```
2.  **Configura el Backend:**
    *   Navega a la carpeta `backend`.
    *   Sigue las instrucciones del `README.md` dentro de `/backend` para configurar la conexión a la base de datos MySQL y aplicar las migraciones.
3.  **Instala dependencias del Frontend:**
    *   Navega a la carpeta `frontend`.
    *   Ejecuta:
        ```bash
        npm install
        # o si usas yarn
        # yarn install
        ```

## Ejecución (Desarrollo) ▶️

Necesitas ejecutar ambos proyectos simultáneamente:

1.  **Iniciar Backend:**
    *   Abre una terminal en la carpeta `backend/TravelSharing.API` (o el nombre de tu proyecto API).
    *   Ejecuta:
        ```bash
        dotnet run
        ```
    *   La API debería estar escuchando (normalmente en `http://localhost:5000` o `https://localhost:5001`, revisa la configuración).

2.  **Iniciar Frontend:**
    *   Abre *otra* terminal en la carpeta `frontend`.
    *   Asegúrate de que la URL de la API en `src/environments/environment.ts` sea correcta.
    *   Ejecuta:
        ```bash
        ng serve -o
        # o
        # npm start
        ```
    *   La aplicación se abrirá en `http://localhost:4200/`.

## Características Implementadas ✅

*   ✔️ ABM (Altas, Bajas, Modificaciones) completo de Viajes.
*   ✔️ Gestión de estado centralizada con **NgRx** (Store, Effects, Entity, ngrx-forms).
*   ✔️ **Formularios Reactivos** en Angular con validaciones.
*   ✔️ Tabla de datos interactiva con filtros usando **PrimeNG**.
*   ✔️ Arquitectura Backend clara con **Patrón Repository** y **Patrón Service**.
*   ✔️ Validaciones robustas en el backend con **FluentValidation**.

## Próximos Pasos / Características Planeadas 🎯

*   (Autenticación, Reservas, Perfiles de usuario)
*   Mejoras en UI/UX.

---
*¡Explora las carpetas `backend` y `frontend` para más detalles específicos en sus respectivos READMEs! 😉*

