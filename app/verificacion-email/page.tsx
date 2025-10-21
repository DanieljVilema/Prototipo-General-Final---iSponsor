'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, RefreshCw, AlertCircle } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';
import { supabase } from '@/lib/supabaseClient';

export default function VerificacionEmailPage() {
  const { addAudit } = useDemoStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener email de sessionStorage o query params
    const email = sessionStorage.getItem('pendingVerificationEmail') || searchParams?.get('email') || '';
    setUserEmail(email);

    // Verificar si viene de un redirect con token de verificación
    const verified = searchParams?.get('verified');
    const type = searchParams?.get('type');
    
    if (verified === 'true' && type === 'signup') {
      // El usuario acaba de verificar su email exitosamente
      setVerified(true);
      sessionStorage.removeItem('pendingVerificationEmail');
      
      addAudit({
        actor: 'Sistema',
        accion: 'Email verificado exitosamente',
        entidad: 'Verificación',
        resultado: 'OK',
        ref: email
      });
      
      showToast('¡Email verificado exitosamente!');
    }

    // Verificar estado de sesión actual
    const checkVerificationStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email_confirmed_at) {
        setVerified(true);
        sessionStorage.removeItem('pendingVerificationEmail');
      }
      
      setLoading(false);
    };

    checkVerificationStatus();
  }, [addAudit, searchParams]);

  const handleResend = async () => {
    if (!userEmail) {
      showToast('No se encontró el email para reenviar');
      return;
    }

    if (resendCount >= 3) {
      showToast('Has alcanzado el límite de reenvíos. Contacta soporte si necesitas ayuda.');
      return;
    }

    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/verificacion-email?verified=true&type=signup`
        }
      });

      if (error) {
        console.error('Error al reenviar:', error);
        showToast('Error al reenviar el correo. Intenta de nuevo.');
      } else {
        setResendCount(prev => prev + 1);
        addAudit({
          actor: 'Sistema',
          accion: 'Reenvío de email de verificación',
          entidad: 'Verificación',
          resultado: 'OK',
          ref: `${userEmail} - Intento ${resendCount + 1}`
        });
        showToast('Email de verificación reenviado exitosamente');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      showToast('Error inesperado al reenviar');
    } finally {
      setIsResending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando estado...</p>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            ¡Email verificado!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tu cuenta ha sido activada exitosamente
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cuenta activada
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Tu email ha sido verificado correctamente. Ya puedes comenzar a usar iSponsor.
              </p>

              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Iniciar sesión
                </Link>

                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-green-900 mb-2">¡Bienvenido a iSponsor!</h4>
                  <ul className="text-sm text-green-800 space-y-1 text-left">
                    <li>• Tu cuenta está completamente activada</li>
                    <li>• Puedes explorar candidatos para apadrinar</li>
                    <li>• Configura tus métodos de pago</li>
                    <li>• Accede a informes de tus apadrinamientos</li>
                  </ul>
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Verifica tu email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hemos enviado un email de verificación a tu dirección
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Revisa tu bandeja de entrada
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Te enviamos un email con un enlace de verificación. Haz click en el enlace para activar tu cuenta.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <p className="text-sm text-blue-800">
                  <strong>Demo:</strong> Verificación automática en 5 segundos...
                </p>
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
                <p className="text-sm text-gray-600 mb-2">
                  ¿No recibiste el email?
                </p>
                <button
                  onClick={handleResend}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reenviar email ({resendCount > 0 ? `${resendCount} enviado${resendCount > 1 ? 's' : ''}` : 'Reenviar'})
                </button>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Consejos:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revisa tu carpeta de spam o correo no deseado</li>
                <li>• El email puede tardar unos minutos en llegar</li>
                <li>• Asegúrate de tener conexión a internet</li>
                <li>• Contacta soporte si no recibes el email en 10 minutos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
