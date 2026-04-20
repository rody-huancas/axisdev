<div align="center">
  <img src="public/axisdev.webp" alt="AxisDev" height="52" />

  <br />
  <br />

  <p>
    <strong>Tu centro de mando para Google Workspace.</strong><br />
    Consolida Drive, Calendar, Gmail y Tasks en una sola interfaz: menos pestañas, más contexto.
  </p>

  <br />

  ![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

  <br />
  <br />
</div>

---

## Tabla de contenidos

- [Vista previa](#vista-previa)
- [¿Qué es AxisDev?](#qué-es-axisdev)
- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Instalación y uso local](#instalación-y-uso-local)
- [Variables de entorno](#variables-de-entorno)
- [Configurar Google Cloud (OAuth + APIs)](#configurar-google-cloud-oauth--apis)
- [Comandos](#comandos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Licencia](#licencia)

## Vista previa

| Landing | Dashboard |
| --- | --- |
| ![Landing](public/readme/landing.png) | ![Dashboard](public/readme/dashboard.png) |

---

## ¿Qué es AxisDev?

AxisDev es un panel de control que funciona como una **capa superior sobre Google Workspace**. Su objetivo es reducir la fatiga de pestañas, centralizando información y acciones frecuentes (archivos, agenda, correo y tareas) en una sola vista.

> "El centro de mando para tu Google Workspace: convierte el desorden de múltiples pestañas en una interfaz inteligente, accionable y rápida."

---

## Funcionalidades

- **Drive**: archivos recientes, navegación por carpetas y flujos de trabajo rápidos.
- **Calendar**: vista consolidada del día y reuniones.
- **Gmail**: lectura y estado de correos pendientes.
- **Tasks**: gestión de pendientes sincronizados.
- **OAuth 2.0 (Auth.js / NextAuth v5)**: sesión JWT y refresh de token.
- **Supabase**: persistencia y datos de usuario.

---

## Stack tecnológico

| Categoría | Tecnología |
| --- | --- |
| Framework | Next.js 16.2.3 (App Router) |
| Lenguaje | TypeScript |
| UI | Tailwind CSS v4 |
| Auth | Auth.js / NextAuth v5 (Google) |
| DB | Supabase (JS SDK) |
| Estado | Zustand |
| Formularios | React Hook Form + Zod |
| Gráficos | Recharts |
| Calendario | React Big Calendar |
| Package manager | pnpm |

---

## Instalación y uso local

### Prerrequisitos

- Node.js 18+ (recomendado 20+)
- pnpm
- Google Cloud Console (OAuth + APIs)
- Proyecto en Supabase

### 1) Clonar

```bash
git clone https://github.com/rody-huancas/axisdev.git
cd axisdev
```

### 2) Instalar dependencias

```bash
pnpm install
```

### 3) Variables de entorno

```bash
cp .env.example .env.local
```

Completa `.env.local` (referencia: `.env.example`).

### 4) Ejecutar

```bash
pnpm dev
```

Abre `http://localhost:3000`.

---

## Variables de entorno

AxisDev lee variables desde `lib/env.ts` y `.env.example`.

| Variable | Uso |
| --- | --- |
| `AUTH_SECRET` | Secreto de Auth.js / NextAuth (firma de tokens/sesión). Alternativa soportada: `NEXTAUTH_SECRET` |
| `NEXTAUTH_URL` | URL base de la app (local: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | OAuth Client ID (Google) |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret (Google) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Key pública (publishable/anon) de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Key de servicio (server-only). Alternativa soportada: `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` |
| `NEXT_PUBLIC_GOOGLE_API` | Base de scopes de Google (p. ej. `https://www.googleapis.com`) |
| `NEXT_PUBLIC_GOOGLE_API_CALENDAR` | Endpoint/URL para Calendar API |
| `NEXT_PUBLIC_GOOGLE_API_DRIVE` | Endpoint/URL para Drive API |
| `NEXT_PUBLIC_GOOGLE_API_DRIVE_UPLOAD` | Endpoint/URL para subida a Drive |
| `NEXT_PUBLIC_GOOGLE_API_TASKS_LIST` | Endpoint/URL para TaskLists (si aplica) |
| `NEXT_PUBLIC_GOOGLE_API_TASKS` | Endpoint/URL para Tasks |
| `NEXT_PUBLIC_GOOGLE_API_GMAIL` | Endpoint/URL para Gmail API |

Notas:

- Por seguridad, usa `SUPABASE_SERVICE_ROLE_KEY` sin el prefijo `NEXT_PUBLIC_`.
- No subas `.env.local` al repositorio.

---

## Configurar Google Cloud (OAuth + APIs)

1. Entra a `https://console.cloud.google.com/`.
2. Crea/selecciona un proyecto.
3. Habilita APIs:
   - Google Drive API
   - Google Calendar API
   - Gmail API
   - Google Tasks API
4. Configura la pantalla de consentimiento OAuth.
5. Crea credenciales OAuth 2.0 (Aplicación web) y define:
   - Orígenes autorizados: `http://localhost:3000`
   - URI de redirección autorizada: `http://localhost:3000/api/auth/callback/google`
6. Copia el Client ID/Secret a `.env.local`.

---

## Comandos

```bash
pnpm dev      # desarrollo
pnpm build    # build de producción
pnpm start    # servidor de producción
```

Nota: existe `pnpm lint`, pero en este repo se evita correr linters/formatters salvo que sea solicitado explícitamente.

---

## Estructura del proyecto

```text
axisdev/
  actions/          # Server Actions (Next.js)
  app/              # Rutas y layouts (App Router)
  components/       # UI reutilizable
  constants/        # Constantes compartidas
  hooks/            # Hooks custom
  lib/              # Configuración y utilidades
  public/           # Assets estáticos
  services/         # Integración con APIs de Google
  stores/           # Estado global (Zustand)
  styles/           # Estilos globales
  supabase/         # SQL/migraciones/config (si aplica)
  types/            # Tipos TypeScript
  auth.ts           # Configuración Auth.js
  .env.example      # Variables de entorno de ejemplo
```

---

## Licencia

MIT © [Rody Huancas](https://rody-huancas.vercel.app/)
