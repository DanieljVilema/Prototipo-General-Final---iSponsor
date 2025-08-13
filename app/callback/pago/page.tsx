'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, CreditCard, Heart, RotateCcw, Settings } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function CallbackPagoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addApadrinamiento, addMetodoPago, logAudit } = useDemoStore();

  const resultado = searchParams.get('resultado') as 'Aprobado' | 'Rechazado' | null;
  const context = searchParams.get('context');
  const id = searchParams.get('id');
  const monto = searchParams.get('monto');
  const fechaPago = searchParams.get('fechaPago');
  const metodoId = searchParams.get('metodoId');
  const cardData = searchParams.get('cardData');

  useEffect(() => {
    if (resultado === 'Aprobado') {
      // Log confirmación del sistema
      logAudit({
        actor: 'Sistema',
        accion: 'Confirmación sistema',
        entidad: context || 'unknown',
        resultado: 'OK',
        ref: id || undefined
      });

      // Procesar según el contexto
      if (context === 'apadrinamiento' && id && monto && fechaPago) {
        // Crear apadrinamiento
        const nuevoApadrinamiento = {
          id: `ap${Date.now()}`,
          donadorId: 'u-don1', // Usuario actual simulado
          apadrinadoId: id,
          monto: parseInt(monto),
          moneda: 'USD' as const,
          fechaPago: `${fechaPago} de cada mes`,
          estado: 'Activo' as const
        };
        
        addApadrinamiento(nuevoApadrinamiento);
      } else if (context === 'metodo_pago') {
        // Crear método de pago con datos reales o por defecto
        let brand = 'Visa';
        let last4 = '4242';
        
        if (cardData) {
          try {
            const parsedData = JSON.parse(decodeURIComponent(cardData));
            brand = parsedData.brand || 'Visa';
            last4 = parsedData.last4 || '4242';
          } catch (e) {
            // Usar valores por defecto si hay error
          }
        }
        
        const nuevoMetodo = {
          id: `mp${Date.now()}`,
          donadorId: 'u-don1',
          brand,
          last4,
          token: `tok_demo_${Date.now()}`,
          enUso: false
        };
        
        addMetodoPago(nuevoMetodo);
      }
    }
  }, [resultado, context, id, monto, fechaPago, addApadrinamiento, addMetodoPago, logAudit]);

  const isAprobado = resultado === 'Aprobado';
  const isRechazado = resultado === 'Rechazado';

  if (!resultado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">No se pudo procesar la respuesta</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header con resultado */}
          <div className={`p-6 text-center ${isAprobado ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isAprobado ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isAprobado ? (
                <CheckCircle className="text-green-600" size={32} />
              ) : (
                <XCircle className="text-red-600" size={32} />
              )}
            </div>
            
            <h1 className={`text-xl font-bold mb-2 ${
              isAprobado ? 'text-green-900' : 'text-red-900'
            }`}>
              {isAprobado ? 'Pago Exitoso' : 'Pago Rechazado'}
            </h1>
            
            <p className={`text-sm ${
              isAprobado ? 'text-green-700' : 'text-red-700'
            }`}>
              {isAprobado ? 
                getSuccessMessage(context) : 
                'Pago rechazado (simulado) — Reintentar o cambiar método'
              }
            </p>
          </div>

          {/* Detalles */}
          <div className="p-6">
            {context === 'apadrinamiento' && (
              <div className="space-y-3 mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                  <Heart size={16} />
                  Detalles del Apadrinamiento
                </h2>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                  <p><span className="font-medium">Monto:</span> ${monto} USD mensuales</p>
                  <p><span className="font-medium">Fecha de pago:</span> {fechaPago} de cada mes</p>
                  <p><span className="font-medium">Estado:</span> {isAprobado ? 'Activo' : 'Pendiente'}</p>
                </div>
              </div>
            )}

            {context === 'metodo_pago' && (
              <div className="space-y-3 mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                  <CreditCard size={16} />
                  Método de Pago
                </h2>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p>{isAprobado ? 'Token guardado (simulado)' : 'Error al guardar método'}</p>
                </div>
              </div>
            )}

            {/* Notificaciones simuladas */}
            {isAprobado && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Notificaciones enviadas:</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>📧 Correo de confirmación enviado (simulado)</p>
                  {context === 'apadrinamiento' && (
                    <p>📧 Notificación a Casa Hogar (simulado)</p>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-3">
              {isAprobado ? (
                <>
                  {context === 'apadrinamiento' && (
                    <button
                      onClick={() => router.push('/mis-apadrinamientos')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors"
                    >
                      Ir a Mis Apadrinamientos
                    </button>
                  )}
                  
                  {context === 'metodo_pago' && (
                    <button
                      onClick={() => router.push('/metodos')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors"
                    >
                      Ver Métodos de Pago
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.back()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Reintentar pago
                  </button>
                  
                  <button
                    onClick={() => router.push('/metodos')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings size={16} />
                    Cambiar método
                  </button>
                </>
              )}
              
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>ID de transacción: TXN_{Date.now()}</p>
          <p>Todas las operaciones son simuladas</p>
        </div>
      </div>
    </div>
  );
}

function getSuccessMessage(context: string | null): string {
  switch (context) {
    case 'apadrinamiento':
      return 'Apadrinamiento registrado (simulado)';
    case 'metodo_pago':
      return 'Token guardado (simulado)';
    default:
      return 'Operación exitosa (simulado)';
  }
}
