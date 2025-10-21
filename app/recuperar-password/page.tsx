'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';
import { supabase } from '@/lib/supabaseClient';

export default function RecuperarPasswordPage() {
  const { addAudit } = useDemoStore();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'sent'>('request');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Enviar correo de recuperación con Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recuperar-password/reset`,
      });

      if (error) {
        console.error('Error al enviar correo:', error);
        
        // Registrar auditoría de intento fallido
        addAudit({
          actor: 'Sistema',
          accion: 'Solicitud de recuperación fallida',
          entidad: 'Autenticación',
          resultado: 'Error',
          ref: email
        });

        // No revelar si el email existe o no (seguridad)
        setErrors({ 
          email: 'Si este correo está registrado, recibirás un enlace de recuperación.' 
        });
        showToast('Verifica que el correo esté registrado');
        setIsSubmitting(false);
        return;
      }

      // Registrar auditoría de solicitud exitosa
      addAudit({
        actor: 'Sistema',
        accion: 'Solicitud de recuperación de contraseña',
        entidad: 'Autenticación',
        resultado: 'OK',
        ref: email
      });

      showToast('Correo de recuperación enviado exitosamente');
      setStep('sent');

    } catch (error: any) {
      console.error('Error inesperado:', error);
      setErrors({ general: 'Error inesperado. Por favor, intenta de nuevo.' });
      showToast('Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setStep('request');
    setErrors({});
    setEmail('');
  };

  if (step === 'sent') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Enlace enviado
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hemos enviado un enlace de recuperación a tu email
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Revisa tu email
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Enviamos un enlace de recuperación a <strong>{email}</strong>. 
                El enlace expirará en 60 minutos.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <div className="ml-3 text-left">
                    <p className="text-sm text-blue-800">
                      <strong>Importante:</strong> Si no recibes el correo en unos minutos, revisa tu carpeta de spam o correo no deseado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => window.open('mailto:', '_blank')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Abrir aplicación de email
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿No recibiste el email?{' '}
                    <button
                      onClick={handleRetry}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Enviar de nuevo
                    </button>
                  </p>
                </div>

                <div className="text-center pt-4">
                  <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-500">
                    Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            </div>
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
          Recuperar contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email registrado
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="flex items-center">
              <ArrowLeft className="h-4 w-4 text-gray-400 mr-2" />
              <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">¿Problemas para acceder?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Verifica que el email esté escrito correctamente</li>
              <li>• Revisa tu carpeta de spam o correo no deseado</li>
              <li>• El enlace será válido por 15 minutos</li>
              <li>• Contacta soporte si persisten los problemas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
