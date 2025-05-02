# Proyecto Técnico: Sistema de Viajes Compartidos (Frontend - Angular)

¡Bienvenido/a! 👋 Este es el código fuente del frontend para nuestro sistema de compartición de viajes interurbanos. Está construido con **Angular 19**, usando **NgRx** para manejar el estado como un campeón y **PrimeNG** + **Tailwind CSS** para que se vea genial. ✨

## Descripción

Queremos crear una plataforma web moderna y fácil de usar donde puedas registrarte, buscar y ofrecer viajes entre ciudades. Empezamos con la gestión de usuarios, ¡pero pronto añadiremos todo lo necesario para compartir viajes! 🚀 Buscamos un look profesional pero atractivo.

## Características Actuales ✅

*   **Gestión de Usuarios:**
    *   Formulario de creación de usuarios (¡con validaciones!).
    *   Conexión con el backend para guardar los datos.
*   **Gestión de Estado (NgRx):**
    *   Manejo del estado de usuarios con `@ngrx/entity`.
    *   Integración de formularios reactivos con `ngrx-forms`.
    *   Gestión de llamadas API y otros efectos secundarios con `@ngrx/effects`.
*   **Interfaz de Usuario:** Componentes reutilizables de **PrimeNG** con estilos de **Tailwind CSS**.

## Características Planeadas 🎯

*   Listado de usuarios con filtros y paginación (Tabla PrimeNG).
*   Edición y eliminación de usuarios.
*   Gestión de Viajes (Crear, Buscar, Ver Detalles).
*   Sistema de Reservas.
*   Autenticación y Autorización de Usuarios.
*   Sistema de Reputación/Calificaciones.
*   Mejoras visuales y de experiencia de usuario.

## Tecnologías Utilizadas 🛠️

*   **Framework:** `Angular 19`
*   **Lenguaje:** `TypeScript`
*   **Gestión de Estado:**
    *   `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`
    *   `ngrx-forms` (¡Adiós al manejo manual del estado del formulario!)
*   **Componentes UI:** `PrimeNG`
*   **Estilos:** `Tailwind CSS` (configurado a través de `src/styles.css` y `tailwind.config.js`)
*   **Cliente HTTP:** `Angular HttpClient`
*   **Programación Reactiva:** `RxJS`

## Prerrequisitos 📋

*   Node.js (Versión LTS recomendada)
*   npm o yarn
*   Angular CLI (`npm install -g @angular/cli`)
*   ⚠️ ¡Importante! La API Backend debe estar ejecutándose. Revisa la configuración en `src/environments/environment.ts`.

## Instalación ⚙️

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/lemuayala/prueba-tecnica-dotnet-angular.git
    cd Frontend # O el nombre de tu carpeta frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    # o si usas yarn
    # yarn install
    ```

## Ejecución (Servidor de Desarrollo) ▶️

1.  Verifica que la URL de la API en `src/environments/environment.ts` sea la correcta y que tu backend esté activo.
2.  Ejecuta el siguiente comando:
    ```bash
    ng serve -o # El -o abre el navegador automáticamente
    # o
    # npm start
    ```
3.  La aplicación se abrirá automáticamente en tu navegador en `http://localhost:4200/`.

## Build (Producción) 📦

1.  Asegúrate de que la URL de la API en `src/environments/environment.prod.ts` sea la correcta para producción.
2.  Ejecuta el comando de build:
    ```bash
    ng build --configuration production
    ```
3.  Los archivos listos para desplegar estarán en la carpeta `dist/nombre-del-proyecto` (puedes verificar el nombre exacto en `angular.json`). ¡Listos para subir a tu servidor web!

## Estructura del Código (Resumen) 📁

*   **`src/app/core`**: Servicios y módulos principales (si aplica).
*   **`src/app/features`**: Módulos específicos de funcionalidades (ej. `users`, `trips`).
    *   **`features/users/components`**: Componentes relacionados con usuarios (formularios, listas).
    *   **`features/users/models`**: Interfaces y DTOs para usuarios.
    *   **`features/users/services`**: Servicios para interactuar con la API de usuarios.
    *   **`features/users/store`**: Lógica de NgRx para usuarios (actions, reducer, effects, selectors).
*   **`src/app/shared`**: Componentes, directivas o pipes reutilizables.
*   **`src/assets`**: Archivos estáticos (imágenes, etc.).
*   **`src/environments`**: Archivos de configuración para diferentes entornos (desarrollo, producción).

---
*Este README te da una visión general. ¡Explora el código y la documentación de las librerías para profundizar más! 😉*
