-- ============================================
-- SETUP COMPLETO DE SUPABASE PARA iSPONSOR
-- ============================================
-- Ejecuta este script en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query

-- ============================================
-- 1. TABLA DE PERFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  rol TEXT NOT NULL CHECK (rol IN ('Donador', 'CasaHogar', 'Admin')) DEFAULT 'Donador',
  nombre TEXT NOT NULL,
  apellido TEXT,
  telefono TEXT,
  fecha_nacimiento DATE,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_perfiles_email ON public.perfiles(email);
CREATE INDEX IF NOT EXISTS idx_perfiles_rol ON public.perfiles(rol);

-- ============================================
-- 2. TABLA DE CASAS HOGAR
-- ============================================
CREATE TABLE IF NOT EXISTS public.casas_hogar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  nombre TEXT NOT NULL,
  representante TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  descripcion TEXT,
  telefono TEXT,
  email TEXT NOT NULL,
  sitio_web TEXT,
  fecha_fundacion DATE,
  estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada', 'Inactiva')),
  razon_rechazo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_casas_hogar_user_id ON public.casas_hogar(user_id);
CREATE INDEX IF NOT EXISTS idx_casas_hogar_estado ON public.casas_hogar(estado);

-- ============================================
-- 3. TABLA DE APADRINADOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.apadrinados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  casa_hogar_id UUID REFERENCES public.casas_hogar(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  edad INTEGER NOT NULL CHECK (edad >= 0 AND edad <= 100),
  genero TEXT NOT NULL CHECK (genero IN ('M', 'F', 'Otro')),
  necesidad TEXT NOT NULL,
  historia TEXT,
  estado TEXT NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Autosuficiente', 'Inactivo')),
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apadrinados_casa_hogar ON public.apadrinados(casa_hogar_id);
CREATE INDEX IF NOT EXISTS idx_apadrinados_estado ON public.apadrinados(estado);

-- ============================================
-- 4. TABLA DE MÉTODOS DE PAGO
-- ============================================
CREATE TABLE IF NOT EXISTS public.metodos_pago (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donador_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  last4 TEXT NOT NULL,
  token TEXT NOT NULL,
  expiry_month INTEGER,
  expiry_year INTEGER,
  en_uso BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metodos_pago_donador ON public.metodos_pago(donador_id);

-- ============================================
-- 5. TABLA DE APADRINAMIENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.apadrinamientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donador_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  apadrinado_id UUID REFERENCES public.apadrinados(id) ON DELETE CASCADE,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  moneda TEXT NOT NULL DEFAULT 'USD',
  frecuencia_pago TEXT NOT NULL CHECK (frecuencia_pago IN ('Mensual', 'Trimestral', 'Anual', 'Unico')),
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin DATE,
  estado TEXT NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Pausado', 'Cancelado', 'Completado')),
  metodo_pago_id UUID REFERENCES public.metodos_pago(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apadrinamientos_donador ON public.apadrinamientos(donador_id);
CREATE INDEX IF NOT EXISTS idx_apadrinamientos_apadrinado ON public.apadrinamientos(apadrinado_id);
CREATE INDEX IF NOT EXISTS idx_apadrinamientos_estado ON public.apadrinamientos(estado);

-- ============================================
-- 6. TABLA DE TRANSACCIONES
-- ============================================
CREATE TABLE IF NOT EXISTS public.transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apadrinamiento_id UUID REFERENCES public.apadrinamientos(id) ON DELETE CASCADE,
  monto DECIMAL(10,2) NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'USD',
  estado TEXT NOT NULL CHECK (estado IN ('Pendiente', 'Completada', 'Fallida', 'Reembolsada')),
  metodo_pago_id UUID REFERENCES public.metodos_pago(id),
  referencia_externa TEXT,
  mensaje_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transacciones_apadrinamiento ON public.transacciones(apadrinamiento_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_estado ON public.transacciones(estado);

-- ============================================
-- 7. TABLA DE INFORMES
-- ============================================
CREATE TABLE IF NOT EXISTS public.informes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apadrinado_id UUID REFERENCES public.apadrinados(id) ON DELETE CASCADE,
  casa_hogar_id UUID REFERENCES public.casas_hogar(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Mensual', 'Trimestral', 'Anual', 'Especial')),
  contenido TEXT NOT NULL,
  observaciones TEXT,
  periodo TEXT,
  estado TEXT NOT NULL DEFAULT 'Borrador' CHECK (estado IN ('Borrador', 'Pendiente', 'Aprobado', 'Publicado', 'Rechazado')),
  fotos JSONB DEFAULT '[]'::jsonb,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_publicacion TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_informes_apadrinado ON public.informes(apadrinado_id);
CREATE INDEX IF NOT EXISTS idx_informes_casa_hogar ON public.informes(casa_hogar_id);
CREATE INDEX IF NOT EXISTS idx_informes_estado ON public.informes(estado);

-- ============================================
-- 8. TABLA DE AUDITORÍA
-- ============================================
CREATE TABLE IF NOT EXISTS public.auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor TEXT NOT NULL,
  accion TEXT NOT NULL,
  entidad TEXT NOT NULL,
  entidad_id UUID,
  resultado TEXT NOT NULL,
  detalles JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_auditoria_user_id ON public.auditoria(user_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_ts ON public.auditoria(ts DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_entidad ON public.auditoria(entidad, entidad_id);

-- ============================================
-- 9. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casas_hogar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apadrinados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metodos_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apadrinamientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.informes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 10. POLÍTICAS DE SEGURIDAD - PERFILES
-- ============================================
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.perfiles;
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.perfiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.perfiles;
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.perfiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin puede ver todos los perfiles" ON public.perfiles;
CREATE POLICY "Admin puede ver todos los perfiles" ON public.perfiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'Admin'
    )
  );

-- ============================================
-- 11. POLÍTICAS DE SEGURIDAD - CASAS HOGAR
-- ============================================
DROP POLICY IF EXISTS "Casas hogar aprobadas son visibles para todos" ON public.casas_hogar;
CREATE POLICY "Casas hogar aprobadas son visibles para todos" ON public.casas_hogar
  FOR SELECT USING (estado = 'Aprobada' OR user_id = auth.uid());

DROP POLICY IF EXISTS "Casas hogar pueden actualizar su perfil" ON public.casas_hogar;
CREATE POLICY "Casas hogar pueden actualizar su perfil" ON public.casas_hogar
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admin puede gestionar casas hogar" ON public.casas_hogar;
CREATE POLICY "Admin puede gestionar casas hogar" ON public.casas_hogar
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'Admin'
    )
  );

-- ============================================
-- 12. POLÍTICAS DE SEGURIDAD - APADRINADOS
-- ============================================
DROP POLICY IF EXISTS "Apadrinados activos son visibles para donadores" ON public.apadrinados;
CREATE POLICY "Apadrinados activos son visibles para donadores" ON public.apadrinados
  FOR SELECT USING (
    estado = 'Activo' OR
    casa_hogar_id IN (
      SELECT id FROM public.casas_hogar WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Casas hogar pueden gestionar sus apadrinados" ON public.apadrinados;
CREATE POLICY "Casas hogar pueden gestionar sus apadrinados" ON public.apadrinados
  FOR ALL USING (
    casa_hogar_id IN (
      SELECT id FROM public.casas_hogar WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 13. POLÍTICAS DE SEGURIDAD - MÉTODOS DE PAGO
-- ============================================
DROP POLICY IF EXISTS "Usuarios ven solo sus métodos de pago" ON public.metodos_pago;
CREATE POLICY "Usuarios ven solo sus métodos de pago" ON public.metodos_pago
  FOR SELECT USING (donador_id = auth.uid());

DROP POLICY IF EXISTS "Usuarios gestionan sus métodos de pago" ON public.metodos_pago;
CREATE POLICY "Usuarios gestionan sus métodos de pago" ON public.metodos_pago
  FOR ALL USING (donador_id = auth.uid());

-- ============================================
-- 14. POLÍTICAS DE SEGURIDAD - APADRINAMIENTOS
-- ============================================
DROP POLICY IF EXISTS "Donadores ven sus apadrinamientos" ON public.apadrinamientos;
CREATE POLICY "Donadores ven sus apadrinamientos" ON public.apadrinamientos
  FOR SELECT USING (
    donador_id = auth.uid() OR
    apadrinado_id IN (
      SELECT id FROM public.apadrinados WHERE casa_hogar_id IN (
        SELECT id FROM public.casas_hogar WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Donadores crean apadrinamientos" ON public.apadrinamientos;
CREATE POLICY "Donadores crean apadrinamientos" ON public.apadrinamientos
  FOR INSERT WITH CHECK (donador_id = auth.uid());

DROP POLICY IF EXISTS "Donadores actualizan sus apadrinamientos" ON public.apadrinamientos;
CREATE POLICY "Donadores actualizan sus apadrinamientos" ON public.apadrinamientos
  FOR UPDATE USING (donador_id = auth.uid());

-- ============================================
-- 15. POLÍTICAS DE SEGURIDAD - INFORMES
-- ============================================
DROP POLICY IF EXISTS "Donadores ven informes de sus apadrinados" ON public.informes;
CREATE POLICY "Donadores ven informes de sus apadrinados" ON public.informes
  FOR SELECT USING (
    estado = 'Publicado' AND apadrinado_id IN (
      SELECT apadrinado_id FROM public.apadrinamientos WHERE donador_id = auth.uid()
    ) OR
    casa_hogar_id IN (
      SELECT id FROM public.casas_hogar WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Casas hogar gestionan sus informes" ON public.informes;
CREATE POLICY "Casas hogar gestionan sus informes" ON public.informes
  FOR ALL USING (
    casa_hogar_id IN (
      SELECT id FROM public.casas_hogar WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 16. POLÍTICAS DE SEGURIDAD - AUDITORÍA
-- ============================================
DROP POLICY IF EXISTS "Solo admins ven auditoría" ON public.auditoria;
CREATE POLICY "Solo admins ven auditoría" ON public.auditoria
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'Admin'
    )
  );

DROP POLICY IF EXISTS "Sistema puede insertar en auditoría" ON public.auditoria;
CREATE POLICY "Sistema puede insertar en auditoría" ON public.auditoria
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 17. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.perfiles (id, rol, nombre, apellido, email, telefono, fecha_nacimiento)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'Donador'),
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    NEW.raw_user_meta_data->>'apellido',
    NEW.email,
    NEW.raw_user_meta_data->>'telefono',
    (NEW.raw_user_meta_data->>'fechaNacimiento')::date
  );

  -- Si es Casa Hogar, crear registro en casas_hogar
  IF COALESCE(NEW.raw_user_meta_data->>'tipo', 'Donador') = 'CasaHogar' THEN
    INSERT INTO public.casas_hogar (user_id, nombre, representante, ubicacion, email, telefono, estado)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'nombre', 'Casa Hogar'),
      CONCAT(
        COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
        ' ',
        COALESCE(NEW.raw_user_meta_data->>'apellido', '')
      ),
      COALESCE(NEW.raw_user_meta_data->>'ubicacion', 'No especificado'),
      NEW.email,
      NEW.raw_user_meta_data->>'telefono',
      'Pendiente'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================
-- 18. TRIGGER PARA EJECUTAR LA FUNCIÓN
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 19. FUNCIÓN PARA ACTUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Aplicar a tablas relevantes
DROP TRIGGER IF EXISTS set_updated_at ON public.perfiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.casas_hogar;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.casas_hogar
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.apadrinados;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.apadrinados
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.apadrinamientos;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.apadrinamientos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.informes;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.informes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 20. FUNCIÓN PARA PREVENIR DUPLICADOS EN REGISTRO
-- ============================================
-- Esta función verifica si un email ya existe antes del registro
CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check TEXT)
RETURNS TABLE (email_exists BOOLEAN, is_verified BOOLEAN)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) > 0 as email_exists,
    BOOL_OR(COALESCE(au.email_confirmed_at IS NOT NULL, false)) as is_verified
  FROM auth.users au
  WHERE au.email = email_to_check;
END;
$$;

-- ============================================
-- SETUP COMPLETADO
-- ============================================
-- Ahora necesitas:
-- 1. Configurar Email Templates en Supabase
-- 2. Configurar redirect URLs
-- 3. Agregar tus credenciales en .env.local
