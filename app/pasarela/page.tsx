'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Shield, ArrowLeft } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function PasarelaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pasarelaResultado, logAudit } = useDemoStore();
  
  const [localResultado, setLocalResultado] = useState<'Aprobado' | 'Rechazado'>(pasarelaResultado);
  const [processing, setProcessing] = useState(false);

  const context = searchParams.get('context');
  const id = searchParams.get('id');
  const monto = searchParams.get('monto');
  const fechaPago = searchParams.get('fechaPago');
  const metodoId = searchParams.get('metodoId');

  useEffect(() => {
    // Log audit al entrar a la pasarela
    logAudit({
      actor: 'Sistema',
      accion: 'Intento de cobro',
      entidad: context || 'unknown',
      resultado: 'Pendiente',
      ref: id || undefined
    });
  }, []);

  const handleConfirm = () => {
    setProcessing(true);
    
    // Simular procesamiento
    setTimeout(() => {
      // Log audit del resultado
      logAudit({
        actor: 'Pasarela',
        accion: 'Resultado pasarela',
        entidad: context || 'unknown',
        resultado: localResultado,
        ref: id || undefined
      });

      setProcessing(false);
      
      // Construir URL de callback
      const callbackParams = new URLSearchParams({
        resultado: localResultado,
        context: context || '',
        ...(id && { id }),
        ...(monto && { monto }),
        ...(fechaPago && { fechaPago }),
        ...(metodoId && { metodoId })
      });
      
      router.push(`/callback/pago?${callbackParams.toString()}`);
    }, 2000);
  };

  const handleCancel = () => {
    showToast('Operación cancelada');
    router.back();
  };

  const getContextTitle = () => {
    switch (context) {
      case 'apadrinamiento':
        return 'Procesar Apadrinamiento';
      case 'metodo_pago':
        return 'Registrar Método de Pago';
      default:
        return 'Procesar Pago';
    }
  };

  const getContextDescription = () => {
    switch (context) {
      case 'apadrinamiento':
        return `Procesando pago de $${monto} USD para apadrinamiento`;
      case 'metodo_pago':
        return 'Registrando nuevo método de pago';
      default:
        return 'Procesando transacción';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Volver a iSponsor
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Pasarela de Pagos</h1>
            <p className="text-gray-600">Simulación de pasarela externa</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Información de la transacción */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-2">{getContextTitle()}</h2>
            <p className="text-gray-600 text-sm">{getContextDescription()}</p>
            
            {context === 'apadrinamiento' && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Monto:</span> ${monto} USD</p>
                  <p><span className="font-medium">Frecuencia:</span> Mensual</p>
                  <p><span className="font-medium">Fecha de pago:</span> {fechaPago} de cada mes</p>
                </div>
              </div>
            )}
          </div>

          {/* Configuración demo */}
          <div className="p-6 bg-yellow-50 border-b">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-yellow-600" />
              <span className="font-medium text-yellow-800">Configuración Demo</span>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="resultado"
                  value="Aprobado"
                  checked={localResultado === 'Aprobado'}
                  onChange={(e) => setLocalResultado(e.target.value as 'Aprobado')}
                  className="text-green-600"
                />
                <span className="text-sm">Aprobado - Transacción exitosa</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="resultado"
                  value="Rechazado"
                  checked={localResultado === 'Rechazado'}
                  onChange={(e) => setLocalResultado(e.target.value as 'Rechazado')}
                  className="text-red-600"
                />
                <span className="text-sm">Rechazado - Error en el pago</span>
              </label>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              Esta configuración simula el resultado de la pasarela real
            </p>
          </div>

          {/* Información de seguridad simulada */}
          <div className="p-6 border-b">
            <h3 className="font-medium mb-3">Información de Pago (Simulado)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tarjeta:</span>
                <span>•••• •••• •••• 4242</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span>Visa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Procesador:</span>
                <span>iSponsor Payments (Demo)</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="p-6">
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-md transition-colors font-medium"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </span>
                ) : (
                  'Confirmar y volver a iSponsor'
                )}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={processing}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md transition-colors"
              >
                Cancelar y volver
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield size={12} />
              <span>Transacción segura y encriptada (simulado)</span>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Esta es una simulación de pasarela de pagos</p>
          <p>No se procesarán pagos reales</p>
        </div>
      </div>
    </div>
  );
}
