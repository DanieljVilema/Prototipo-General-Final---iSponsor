#!/bin/bash

# Script para verificar la configuración de Supabase

echo "🔍 Verificando configuración de iSponsor + Supabase..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar .env.local
echo "1️⃣  Verificando archivo .env.local..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✅ Archivo .env.local encontrado${NC}"
    
    # Verificar variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=https://" .env.local; then
        echo -e "${GREEN}   ✅ NEXT_PUBLIC_SUPABASE_URL configurada${NC}"
    else
        echo -e "${RED}   ❌ NEXT_PUBLIC_SUPABASE_URL no configurada o inválida${NC}"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ" .env.local; then
        echo -e "${GREEN}   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurada${NC}"
    else
        echo -e "${RED}   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no configurada${NC}"
    fi
else
    echo -e "${RED}❌ Archivo .env.local NO encontrado${NC}"
    echo -e "${YELLOW}   Crea el archivo copiando .env.example:${NC}"
    echo "   cp .env.example .env.local"
fi

echo ""

# Verificar node_modules
echo "2️⃣  Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ Dependencias NO instaladas${NC}"
    echo -e "${YELLOW}   Ejecuta: npm install o pnpm install${NC}"
fi

echo ""

# Verificar @supabase/supabase-js
echo "3️⃣  Verificando Supabase client..."
if [ -d "node_modules/@supabase/supabase-js" ]; then
    echo -e "${GREEN}✅ @supabase/supabase-js instalado${NC}"
else
    echo -e "${RED}❌ @supabase/supabase-js NO instalado${NC}"
    echo -e "${YELLOW}   Ejecuta: npm install @supabase/supabase-js${NC}"
fi

echo ""

# Verificar archivos clave
echo "4️⃣  Verificando archivos de autenticación..."
files=(
    "lib/supabaseClient.ts"
    "app/login/page.tsx"
    "app/registro/page.tsx"
    "app/recuperar-password/page.tsx"
    "app/recuperar-password/reset/page.tsx"
    "app/verificacion-email/page.tsx"
    "supabase-setup.sql"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}   ✅ $file${NC}"
    else
        echo -e "${RED}   ❌ $file${NC}"
        all_files_exist=false
    fi
done

echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f .env.local ] && [ -d "node_modules" ] && [ "$all_files_exist" = true ]; then
    echo -e "${GREEN}✅ Configuración básica completa${NC}"
    echo ""
    echo "📝 SIGUIENTE PASO:"
    echo "1. Verifica que tus credenciales en .env.local sean correctas"
    echo "2. Ejecuta el script SQL en Supabase (supabase-setup.sql)"
    echo "3. Configura los Email Templates en Supabase"
    echo "4. Inicia el servidor: npm run dev o pnpm dev"
    echo ""
    echo "📚 Lee AUTH_SETUP.md para instrucciones detalladas"
else
    echo -e "${RED}❌ Configuración incompleta${NC}"
    echo ""
    echo "🔧 PASOS PARA SOLUCIONAR:"
    if [ ! -f .env.local ]; then
        echo "   • Crea .env.local: cp .env.example .env.local"
    fi
    if [ ! -d "node_modules" ]; then
        echo "   • Instala dependencias: npm install"
    fi
    echo ""
    echo "📚 Consulta AUTH_SETUP.md para más detalles"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
