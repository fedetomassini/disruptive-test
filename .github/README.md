# Disruptive - Test (Mediaverse)

Este proyecto es una aplicación frontend construida con **React** y **Vite**. Incluye funcionalidades de autenticación de usuarios, un sistema de gestión de categorías y contenidos, y una interfaz de usuario moderna utilizando **Tailwind CSS** y otros componentes de UI.

## Autor

**Federico Tomassini**  
[LinkedIn](https://www.linkedin.com/in/fedetomassini/)  
[Email](mailto:fedetomassini.dev@gmail.com)

## Tecnologías Utilizadas

- **React**: Biblioteca de JavaScript para la creación de interfaces de usuario.
- **Vite**: Herramienta de desarrollo rápida para aplicaciones web modernas.
- **Express**: Framework para crear APIs y manejar el backend.
- **Mongoose**: ODM para MongoDB.
- **Tailwind CSS**: Framework de CSS para diseño responsivo y estilos personalizados.
- **Sass**: Preprocesador CSS.
- **JWT (JSON Web Tokens)**: Para autenticación segura de usuarios.
- **Framer Motion**: Biblioteca de animaciones para React.

## Requisitos Previos

Asegúrate de tener instalados los siguientes elementos:

- **Node.js** (v14 o superior)
- **npm** (v6 o superior)

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/usuario/disruptive-test.git
   cd disruptive-test
   ```

2. Uso:

Para ejecutar el servidor de desarrollo, utiliza:

```bash
npm run start | yarn run start | pnpm run start | bun run start |
```

Esto iniciará tanto el servidor backend con nodemon como el cliente frontend con Vite de manera concurrente.

## Scripts Disponibles

- **`npm run start`**: Instala las dependencias del servidor y del cliente, construye el cliente, y luego inicia tanto el servidor backend como el cliente frontend de manera concurrente.
- **`npm run dev`**: Inicia el entorno de desarrollo, ejecutando el servidor backend y el cliente frontend de manera concurrente.
- **`npm run i-server`**: Instala las dependencias del servidor backend.
- **`npm run i-client`**: Instala las dependencias del cliente frontend.
- **`npm run server`**: Inicia el servidor backend utilizando Node.js.
- **`npm run client`**: Inicia el cliente frontend utilizando `bun`.
- **`npm run b-client`**: Construye la aplicación del cliente frontend para producción.

## Cuenta de ADMIN (test)

- **`admin@example.com`**
- **`admin`**

## Variables de entorno para testeo:

- **`NODE_DEV="development"`**
- **`DB_NETWORK="contentdb.lhn5w.mongodb.net"`**
- **`DB_USER="tester"`**
- **`DB_PASSWORD="wkU6O5v2v9JdZWnr"`**
- **`JWT_SECRET="asd090dfmsADSasdK"`**
