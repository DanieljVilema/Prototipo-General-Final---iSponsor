'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function LoginPage() {
  const router = useRouter();
  const { addAudit, setRolActual } = useDemoStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bloqueado) {
      showToast('Cuenta bloqueada por intentos fallidos. Contacte soporte.');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

            const { data: signInData, error } = await supabase.auth.signInWithPassword({
      try {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) {
          setIntentos((prev) => {
            const nuevosIntentos = prev + 1;
            if (nuevosIntentos >= 5) setBloqueado(true);
            return nuevosIntentos;
          });
          setErrors({ general: error.message });
          setIsSubmitting(false);
          return;
        }
        // Determinar rol basado en metadata de Supabase
        let rol: 'Donador' | 'CasaHogar' | 'Admin' = 'Donador';
        if (signInData?.user?.user_metadata?.tipo === 'CasaHogar') {
          rol = 'CasaHogar';
        } else if (signInData?.user?.user_metadata?.tipo === 'Admin') {
          rol = 'Admin';
        } else if (signInData?.user?.user_metadata?.tipo === 'Donador') {
          rol = 'Donador';
        }
        addAudit({
          actor: 'Sistema',
          accion: 'Inicio de sesión exitoso',
          entidad: 'Autenticación',
          resultado: 'OK',
          ref: `${formData.email} - Rol: ${rol}`
        });
        setRolActual(rol);
        showToast(`Bienvenido como ${rol}`);
        // Redirigir según rol
        if (rol === 'CasaHogar') {
          router.push('/ch');
        } else if (rol === 'Admin') {
          router.push('/admin/usuarios');
        } else {
          router.push('/explorar');
        }
      } catch (err) {
        setErrors({ general: 'Error inesperado al iniciar sesión.' });
      }
      setIsSubmitting(false);
      }

      setIsSubmitting(false);
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        setIntentos((prev) => {
          const nuevosIntentos = prev + 1;
          if (nuevosIntentos >= 5) setBloqueado(true);
          return nuevosIntentos;
        });
        setErrors({ general: error.message });
        setIsSubmitting(false);
        return;
      }
      // Determinar rol basado en metadata de Supabase
      let rol: 'Donador' | 'CasaHogar' | 'Admin' = 'Donador';
      if (signInData?.user?.user_metadata?.tipo === 'CasaHogar') {
        rol = 'CasaHogar';
      } else if (signInData?.user?.user_metadata?.tipo === 'Admin') {
        rol = 'Admin';
      }
      addAudit({
        actor: 'Sistema',
        accion: 'Inicio de sesión exitoso',
        entidad: 'Autenticación',
        resultado: 'OK',
        ref: `${formData.email} - Rol: ${rol}`
      });
      setRolActual(rol);
      showToast(`Bienvenido como ${rol}`);
      // Redirigir según rol
      if (rol === 'CasaHogar') {
        router.push('/ch');
      } else if (rol === 'Admin') {
        router.push('/admin/usuarios');
      } else {
        router.push('/explorar');
      }
      setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4">
        <Link href="/" className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium shadow">
          ← Volver a inicio
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">iS</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Inicia sesión en tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Estado de bloqueo */}
          {bloqueado && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Cuenta bloqueada</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Tu cuenta ha sido bloqueada por exceso de intentos fallidos. 
                    Contacta soporte o usa la opción de recuperar contraseña.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de error general */}
          {errors.general && !bloqueado && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          {/* Indicador de intentos */}
          {intentos > 0 && !bloqueado && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    Intentos fallidos: {intentos}/5. La cuenta se bloqueará después de 5 intentos.
                  </p>
                </div>
              </div>
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`pl-10 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`pl-10 pr-10 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link href="/recuperar-password" className="font-medium text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || bloqueado}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Google (Demo)
              </button>
              <button
                type="button"
                disabled
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Facebook (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
