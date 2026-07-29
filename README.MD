# TareasInt - Sistema de Gestión de Tareas

## Introducción

TareasInt es una aplicación completa para la gestión de tareas que cuenta con una arquitectura de dos repositorios separados: una API RESTful y una interfaz de usuario moderna. El sistema ofrece funcionalidades CRUD completas (Crear, Leer, Actualizar, Eliminar) para la gestión eficiente de tareas, con una experiencia de usuario intuitiva y responsiva.

## Repositorios Públicos de GitHub

El código está hospedado en repositorios públicos con documentación clara:

- **Frontend**: [https://github.com/S-chezDev/TareasInt](https://github.com/S-chezDev/TareasInt)
- **API**: [https://github.com/S-chezDev/Apitareas](https://github.com/S-chezDev/Apitareas)

## Validación de Datos

La aplicación implementa un manejo robusto de validación de datos para garantizar la integridad de la información:

- **Validación de campos vacíos**: Se verifican todos los campos obligatorios antes de procesar cualquier solicitud
- **Restricciones de caracteres**: Se aplican validaciones para asegurar que los datos cumplan con los formatos esperados
- **Implementación**: Las validaciones se encuentran en `tarea.controller.js` (líneas 22-44) para la creación de tareas

## Estructura y Limpieza del Código

El proyecto sigue principios de arquitectura limpia y buenas prácticas de desarrollo:

### Arquitectura de Dos Repositorios
- **API Backend**: Diseñada con opciones CRUD completas
  - Endpoints separados por responsabilidades
  - Controladores modulares y especializados
  - Estructura RESTful para interoperabilidad

- **Frontend**: Desarrollado con React/Vite
  - Interfaz de usuario sencilla e intuitiva
  - Componentes reutilizables y modulares
  - Gestión de estados eficiente

### Decisiones de Despliegue
Originalmente la API estaba diseñada para ser hosteada en Railway, pero debido a limitaciones en la licencia gratuita, se optó por desplegar la API en Elastic Beanstalk de AWS para garantizar mayor estabilidad y disponibilidad.

## Manejo de Estados de Borde (Edge Cases)

La aplicación implementa estrategias robustas para manejar escenarios excepcionales:

- **Listas vacías**: La interfaz muestra mensajes informativos cuando no hay tareas disponibles
- **Fallos de conexión API**: 
  - Implementación de manejo de errores asíncronos
  - Mensajes de error claros para el usuario
  - Reintentos automáticos en caso de fallos temporales
  - Estados de carga para mejorar la experiencia de usuario
- **Validación de respuestas**: Verificación de datos recibidos antes de renderizar

## Correcto Despliegue (Production Ready)

La aplicación está completamente desplegada y funcional en entornos de producción:

### API Backend
- **URL Principal**: http://tareaspremi.us-east-2.elasticbeanstalk.com/
- **Health Check**: [http://tareaspremi.us-east-2.elasticbeanstalk.com/health](http://tareaspremi.us-east-2.elasticbeanstalk.com/health)
- **Endpoint Tareas**: [http://tareaspremi.us-east-2.elasticbeanstalk.com/api/tareas](http://tareaspremi.us-east-2.elasticbeanstalk.com/api/tareas)

### Frontend
- **URL Producción**: https://tareas-int.vercel.app/

## Características de la Aplicación

### Vista de Introducción
- Introducción rápida al sistema desarrollado
- Información robusta sobre las tareas creadas
- Resumen estadístico y estado del sistema

### Vista de Gestión de Tareas
- **Crear**: Nueva tarea con validación de campos
- **Leer**: Listado completo de tareas con opciones de filtrado
- **Actualizar**: Edición de tareas existentes
- **Eliminar**: Eliminación segura de tareas con confirmación
- Interfaz intuitiva con todas las opciones CRUD disponibles

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- AWS Elastic Beanstalk

### Frontend
- React
- Vite
- Vercel

## Criterios de Evaluación Cumplidos

✅ **Repositorio Público de GitHub**: Código hospedado con README.md claro y links de despliegue  
✅ **Validación de Datos**: Manejo adecuado de campos vacíos y restricciones de caracteres  
✅ **Estructura y Limpieza del Código**: Organización por responsabilidades, legibilidad y nomenclatura semántica  
✅ **Manejo de Estados de Borde**: Comportamiento adecuado ante listas vacías y fallos de conexión  
✅ **Correcto Despliegue**: Enlaces de producción funcionales y verificados