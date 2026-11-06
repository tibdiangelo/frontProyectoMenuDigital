# Squisita - Menú Digital

Aplicación web hecha con React + Vite para mostrar el menú de una pizzería y
gestionar el inicio de sesión y el registro de usuarios.

## Requisitos

- Node.js 20 o superior
- npm

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
npm run lint     # revisar el código con ESLint
```

## Estructura

```
src/
├── assets/              Imágenes del proyecto
├── components/
│   ├── Display.jsx      Layout con la navegación
│   └── display.css
├── pages/
│   ├── Home.jsx         Menú de pizzas y sodas
│   ├── Login.jsx        Formulario de inicio de sesión
│   ├── Registro.jsx     Formulario de registro
│   ├── ErrorPage.jsx    Página 404
│   └── *.css            Estilos aislados por página
├── router/
│   └── enrutador.jsx    Definición de rutas
├── index.css            Estilos globales
└── main.jsx             Punto de entrada
```

## Rutas

| Ruta        | Página                    |
| ----------- | ------------------------- |
| `/`         | Menú (Home)               |
| `/login`    | Inicio de sesión          |
| `/registro` | Registro de usuario       |
| `*`         | Página no encontrada      |

## Alias

El alias `@` apunta a `src/`, por lo que se puede importar así:

```js
import Home from '@/pages/Home'
```

Está configurado en `vite.config.js` y `jsconfig.json`.
