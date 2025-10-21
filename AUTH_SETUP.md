# 🔐 Sistema de Autenticación Real con Supabase - iSponsor

## ✅ Sistema Implementado

Este proyecto ahora cuenta con un **sistema de autenticación completo y real** usando Supabase:

### Funcionalidades Implementadas

- ✅ **Registro de usuarios** con validación de emails duplicados
- ✅ **Login seguro** con verificación de email
- ✅ **Verificación de email** con confirmación por correo
- ✅ **Recuperación de contraseña** con tokens seguros
- ✅ **Bloqueo de cuenta** después de 5 intentos fallidos
- ✅ **Prevención de duplicados** - No permite registrar el mismo email dos veces
- ✅ **Roles de usuario** (Donador, Casa Hogar, Admin)
- ✅ **Auditoría completa** de todas las acciones
- ✅ **Row Level Security (RLS)** en Supabase

---

## 🚀 Pasos para Configurar

### 1. Crear Proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota las credenciales del proyecto

### 2. Ejecutar el Script SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el contenido completo de [`supabase-setup.sql`](./supabase-setup.sql)
4. Ejecuta el script (Run)

Este script creará:
- ✅ Todas las tablas necesarias (perfiles, casas_hogar, apadrinados, etc.)
- ✅ Políticas de seguridad (RLS)
- ✅ Triggers automáticos para crear perfiles
- ✅ Funciones de utilidad

### 3. Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` y agrega tus credenciales de Supabase:

```env
# Obtén estas credenciales de: Settings > API en tu proyecto de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui

# URL de tu aplicación (en producción cambiar)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Dónde encontrar las credenciales:**
- Ve a tu proyecto en Supabase
- Clic en **Settings** (⚙️) en el menú izquierdo
- Clic en **API**
- Copia:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Configurar Email Templates en Supabase

1. Ve a **Authentication** > **Email Templates** en Supabase
2. Personaliza los templates:

#### **Confirm signup** (Verificación de email)
```html
<h2>¡Bienvenido a iSponsor!</h2>
<p>Gracias por registrarte. Haz clic en el botón para confirmar tu correo:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar mi email</a></p>
<p>O copia este enlace: {{ .ConfirmationURL }}</p>
```

#### **Reset password** (Recuperar contraseña)
```html
<h2>Recuperar contraseña - iSponsor</h2>
<p>Recibimos una solicitud para restablecer tu contraseña.</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer contraseña</a></p>
<p>O copia este enlace: {{ .ConfirmationURL }}</p>
<p>Si no solicitaste esto, ignora este correo.</p>
```

### 5. Configurar Redirect URLs

1. Ve a **Authentication** > **URL Configuration** en Supabase
2. Agrega las siguientes URLs permitidas:

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs:**
```
http://localhost:3000/verificacion-email
http://localhost:3000/recuperar-password/reset
http://localhost:3000/login
```

**Para producción, agrega también:**
```
https://tu-dominio.com/verificacion-email
https://tu-dominio.com/recuperar-password/reset
https://tu-dominio.com/login
```

### 6. Instalar Dependencias y Ejecutar

```bash
# Instalar dependencias (si no lo has hecho)
npm install
# o
pnpm install

# Ejecutar en modo desarrollo
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Probar el Sistema

### 1. Registro de Usuario

1. Ve a [http://localhost:3000/registro](http://localhost:3000/registro)
2. Completa el formulario
3. Haz clic en "Crear cuenta"
4. **Revisa tu email** (puede estar en spam)
5. Haz clic en el enlace de verificación

**Protección contra duplicados:** Si intentas registrar el mismo email dos veces, verás un error claro indicando que el correo ya está registrado.

### 2. Verificación de Email

- Después del registro, se redirige a `/verificacion-email`
- Revisa tu bandeja de entrada
- Haz clic en el enlace del email
- Serás redirigido a la confirmación exitosa

### 3. Login

1. Ve a [http://localhost:3000/login](http://localhost:3000/login)
2. Ingresa email y contraseña
3. Si el email no está verificado, verás un error
4. Después de 5 intentos fallidos, la cuenta se bloquea temporalmente

### 4. Recuperar Contraseña

1. En login, haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa tu email
3. **Revisa tu email** para el enlace de recuperación
4. Haz clic en el enlace (válido por 60 minutos)
5. Ingresa tu nueva contraseña
6. Inicia sesión con la nueva contraseña

---

## 📋 Características de Seguridad Implementadas

### ✅ Prevención de Duplicados
- Verifica si el email existe antes de permitir registro
- Unique constraint en la base de datos
- Mensajes claros al usuario

### ✅ Validaciones
- **Password:** Mínimo 8 caracteres, mayúsculas, minúsculas, números
- **Email:** Formato válido
- **Campos requeridos:** Nombre, apellido, teléfono, fecha de nacimiento

### ✅ Seguridad
- **Row Level Security (RLS)** en todas las tablas
- **Tokens JWT** manejados por Supabase
- **Email verification** obligatoria
- **Rate limiting** en recuperación de contraseña
- **Bloqueo temporal** después de 5 intentos fallidos

### ✅ Auditoría
- Registro de todos los eventos de autenticación
- Tracking de intentos fallidos
- Logs de recuperación de contraseña
- Histórico de accesos

---

## 🗂️ Estructura de Tablas

### `perfiles`
- Información básica del usuario
- Rol (Donador, CasaHogar, Admin)
- Relación 1:1 con `auth.users`

### `casas_hogar`
- Datos específicos de Casas Hogar
- Estado de aprobación
- Relación con usuario

### `apadrinados`
- Niños/personas a apadrinar
- Pertenecen a una casa hogar
- Estado activo/inactivo

### `apadrinamientos`
- Relación donador-apadrinado
- Historial de contribuciones
- Estado activo/cancelado

### `auditoria`
- Registro de todas las acciones
- Usuario, acción, entidad, resultado
- Timestamps

---

## 🔍 Solución de Problemas

### No recibo emails de verificación

1. **Verifica tu carpeta de spam**
2. **Revisa Supabase Logs:**
   - Ve a **Logs** > **Auth Logs** en Supabase
   - Busca errores de envío de email
3. **Verifica la configuración SMTP:**
   - Por defecto, Supabase usa su propio SMTP (limitado en plan gratuito)
   - Para producción, configura tu propio SMTP en **Settings** > **Auth** > **SMTP Settings**

### Error "Email not confirmed"

- El usuario debe verificar su email antes de hacer login
- Reenvía el email desde `/verificacion-email`
- O verifica manualmente en Supabase: **Authentication** > **Users** > Editar usuario > Marcar como verificado

### Variables de entorno no se cargan

1. Asegúrate de que el archivo se llama `.env.local` (no `.env`)
2. Reinicia el servidor de desarrollo
3. Verifica que las variables empiecen con `NEXT_PUBLIC_`

### RLS bloquea las queries

- Asegúrate de que ejecutaste TODO el script SQL
- Verifica las políticas en **Database** > **Policies**
- Para debug temporal, puedes deshabilitar RLS (NO recomendado en producción)

---

## 📚 Recursos Adicionales

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js con Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎯 Próximos Pasos

Ahora que tienes autenticación real:

1. ✅ Integra las demás funcionalidades con datos reales
2. ✅ Conecta las páginas de donador, casa hogar y admin con Supabase
3. ✅ Implementa gestión de apadrinamientos real
4. ✅ Configura pasarela de pagos (Stripe/PayPal)
5. ✅ Implementa notificaciones por email
6. ✅ Agrega 2FA (autenticación de dos factores)

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en la consola del navegador
2. Revisa los logs en Supabase Dashboard
3. Verifica que todas las variables de entorno estén configuradas
4. Asegúrate de haber ejecutado el script SQL completo

---

**¡Listo! Tu sistema de autenticación real está configurado y funcionando. 🎉**
