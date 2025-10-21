# 🚀 Quick Start - Configuración Rápida

## Paso 1: Supabase (5 minutos)

1. **Crear proyecto en Supabase:**
   - Ve a https://app.supabase.com
   - "New Project" → Nombre: iSponsor
   - Espera 2 minutos mientras se crea

2. **Ejecutar SQL:**
   - SQL Editor → New Query
   - Copia/pega TODO el archivo `supabase-setup.sql`
   - Click "Run" (RUN)
   - Espera confirmación ✅

3. **Obtener credenciales:**
   - Settings ⚙️ → API
   - Copia:
     - `Project URL`
     - `anon/public key`

---

## Paso 2: Configurar Variables (1 minuto)

Edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=TU_URL_AQUI
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_KEY_AQUI
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Paso 3: Email Templates (2 minutos)

**Authentication → Email Templates en Supabase:**

### Confirm Signup:
```html
<h2>Verifica tu email - iSponsor</h2>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
```

### Reset Password:
```html
<h2>Recuperar Contraseña - iSponsor</h2>
<p><a href="{{ .ConfirmationURL }}">Restablecer</a></p>
```

---

## Paso 4: URLs (1 minuto)

**Authentication → URL Configuration:**

```
Site URL: http://localhost:3000

Redirect URLs:
http://localhost:3000/verificacion-email
http://localhost:3000/recuperar-password/reset
```

---

## Paso 5: Ejecutar (1 minuto)

```bash
npm run dev
```

Ve a: http://localhost:3000/registro

---

## ✅ Listo!

**Prueba:**
1. Registra un usuario
2. Revisa tu email
3. Verifica el email
4. Inicia sesión

**¿Problemas?** → Lee `AUTH_SETUP.md`

---

**Total: ~10 minutos** ⚡
