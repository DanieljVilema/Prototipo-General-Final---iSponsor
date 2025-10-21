'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { showToast } from '@/lib/toast';
import { useDemoStore } from '@/src/demo/use-demo-store';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { addAudit } = useDemoStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar que hay una sesión válida de recuperación
    const checkRecoverySession = async () => {
      // Primero, verificar si hay un hash fragment con access_token
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      // Si hay un access_token de tipo recovery, es válido
      if (accessToken && type === 'recovery') {
        setIsValidToken(true);
        setLoading(false);
        return;
      }

      // Si no hay token en el hash, verificar la sesión actual
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        // No hay sesión válida, mantener en la página pero marcar como inválido
        setIsValidToken(false);
        setLoading(false);
        showToast('Enlace inválido o expirado. Solicita uno nuevo.');
        return;
      }

      setIsValidToken(true);
      setLoading(false);
    };

    checkRecoverySession();
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.password = 'Debe contener al menos una letra minúscula';
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = 'Debe contener al menos una letra mayúscula';
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.password = 'Debe contener al menos un número';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Error al actualizar contraseña:', error);
        setErrors({ general: 'Error al actualizar la contraseña. Intenta de nuevo.' });
        showToast('Error al actualizar contraseña');
        setIsSubmitting(false);
        return;
      }

      // Registrar auditoría
      if (data.user) {
        await supabase.from('auditoria').insert({
          user_id: data.user.id,
          actor: data.user.email || 'Usuario',
          accion: 'Contraseña restablecida',
          entidad: 'Autenticación',
          entidad_id: data.user.id,
          resultado: 'OK'
        });

        addAudit({
          actor: 'Sistema',
          accion: 'Contraseña restablecida exitosamente',
          entidad: 'Autenticación',
          resultado: 'OK',
          ref: data.user.id
        });
      }

      showToast('¡Contraseña actualizada exitosamente!');
      
      // Esperar 2 segundos antes de redirigir
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Error inesperado:', error);
      setErrors({ general: 'Error inesperado. Por favor, intenta de nuevo.' });
      showToast('Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Enlace inválido
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            El enlace de recuperación ha expirado o es inválido
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <p className="text-sm text-gray-600 mb-6">
              Los enlaces de recuperación expiran después de 60 minutos por razones de seguridad.
            </p>
            <Link
              href="/recuperar-password"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">iS</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Restablecer contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresa tu nueva contraseña
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
              
              {/* Indicadores de fortaleza de contraseña */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs">
                  <CheckCircle
                    className={`h-4 w-4 mr-1 ${
                      password.length >= 8 ? 'text-green-500' : 'text-gray-300'
                    }`}
                  />
                  <span className={password.length >= 8 ? 'text-green-700' : 'text-gray-500'}>
                    Al menos 8 caracteres
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle
                    className={`h-4 w-4 mr-1 ${
                      /(?=.*[a-z])/.test(password) ? 'text-green-500' : 'text-gray-300'
                    }`}
                  />
                  <span
                    className={/(?=.*[a-z])/.test(password) ? 'text-green-700' : 'text-gray-500'}
                  >
                    Una letra minúscula
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle
                    className={`h-4 w-4 mr-1 ${
                      /(?=.*[A-Z])/.test(password) ? 'text-green-500' : 'text-gray-300'
                    }`}
                  />
                  <span
                    className={/(?=.*[A-Z])/.test(password) ? 'text-green-700' : 'text-gray-500'}
                  >
                    Una letra mayúscula
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle
                    className={`h-4 w-4 mr-1 ${
                      /(?=.*\d)/.test(password) ? 'text-green-500' : 'text-gray-300'
                    }`}
                  />
                  <span className={/(?=.*\d)/.test(password) ? 'text-green-700' : 'text-gray-500'}>
                    Un número
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar nueva contraseña
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 pr-10 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirma tu contraseña"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Actualizando contraseña...' : 'Restablecer contraseña'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
