'use client';

import { useState } from 'react';
import { Heart, FileText, X, AlertCircle, Mail, MessageSquare } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';
import { formatCurrency } from '@/lib/format';
import { showToast } from '@/lib/toast';

export default function MisApadrinamientosPage() {
  const { 
    apadrinamientos, 
    apadrinados, 
    casasHogar, 
    informes, 
    accesoInformes,
    updateApadrinamiento,
    addAudit 
  } = useDemoStore();
  
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [cancelData, setCancelData] = useState({
    motivo: '',
    detalles: '',
    confirmacion: false
  });

  // Filtrar apadrinamientos del usuario actual (simulado)
  const misApadrinamientos = apadrinamientos.filter(ap => ap.donadorId === 'u-don1');

  const getApadrinado = (id: string) => apadrinados.find(a => a.id === id);
  const getCasaHogar = (id: string) => casasHogar.find(ch => ch.id === id);
  const getInformes = (apadrinadoId: string) => informes.filter(inf => inf.apadrinadoId === apadrinadoId);

  const handleCancelApadrinamiento = () => {
    if (!showCancelModal) return;

    // Validar datos del modal
    if (!cancelData.motivo || !cancelData.confirmacion) {
      showToast('Complete todos los campos requeridos');
      return;
    }

    // Actualizar estado del apadrinamiento
    updateApadrinamiento(showCancelModal, { estado: 'Cancelado' });
    
        // Log audit
    addAudit({
      actor: 'Donador',
      accion: 'Cancelar apadrinamiento',
      entidad: 'apadrinamiento',
      resultado: 'OK',
      ref: showCancelModal
    });

    // Simular envío de correos
    showToast('Apadrinamiento cancelado exitosamente');
    
    setTimeout(() => {
      showToast('📧 Correo de confirmación enviado al donador (simulado)');
    }, 1000);
    
    setTimeout(() => {
      showToast('📧 Notificación enviada a Casa Hogar (simulado)');
    }, 2000);
    
    setTimeout(() => {
      showToast('📧 Comprobante de cancelación generado (simulado)');
    }, 3000);

    // Cerrar modal y resetear datos
    setShowCancelModal(null);
    setCancelData({ motivo: '', detalles: '', confirmacion: false });
  };

  const openCancelModal = (apadrinamientoId: string) => {
    setShowCancelModal(apadrinamientoId);
    setCancelData({ motivo: '', detalles: '', confirmacion: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Apadrinamientos</h1>
          <p className="text-gray-600">Gestiona tus apadrinamientos activos y ve el progreso de los niños</p>
        </div>

        {misApadrinamientos.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Heart className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes apadrinamientos</h3>
            <p className="text-gray-600 mb-6">Explora candidatos y comienza a hacer la diferencia</p>
            <a
              href="/explorar"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors inline-block"
            >
              Explorar candidatos
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {misApadrinamientos.map((apadrinamiento) => {
              const apadrinado = getApadrinado(apadrinamiento.apadrinadoId);
              const casaHogar = apadrinado ? getCasaHogar(apadrinado.casaHogarId) : null;
              const informesApadrinado = getInformes(apadrinamiento.apadrinadoId);

              if (!apadrinado) return null;

              return (
                <div key={apadrinamiento.id} className="bg-white rounded-lg shadow-sm">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                          {apadrinado.nombre.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{apadrinado.nombre}</h3>
                          <p className="text-gray-600">{apadrinado.edad} años • {apadrinado.necesidad}</p>
                          {casaHogar && (
                            <p className="text-gray-500 text-sm">{casaHogar.nombre}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <StateChip estado={apadrinamiento.estado} />
                        <p className="text-sm text-gray-600 mt-1">
                          {formatCurrency(apadrinamiento.monto)} mensuales
                        </p>
                        <p className="text-xs text-gray-500">
                          Pago: {apadrinamiento.fechaPago}
                        </p>
                      </div>
                    </div>

                    {/* Informes */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileText size={16} />
                          Informes de progreso
                        </h4>
                        {apadrinamiento.estado === 'Activo' && (
                          <button
                            onClick={() => openCancelModal(apadrinamiento.id)}
                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                          >
                            <X size={16} />
                            Cancelar
                          </button>
                        )}
                      </div>

                      {!accesoInformes ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                          <p className="text-yellow-800 text-sm">Sin acceso a informes (simulado)</p>
                        </div>
                      ) : informesApadrinado.length === 0 ? (
                        <div className="bg-gray-50 rounded-md p-3">
                          <p className="text-gray-600 text-sm">No hay informes disponibles aún</p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-3">
                          {informesApadrinado.map((informe) => (
                            <div key={informe.id} className="border rounded-md p-3">
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="font-medium text-sm">{informe.titulo}</h5>
                                <StateChip estado={informe.estado} size="sm" />
                              </div>
                              {informe.resumen && (
                                <p className="text-gray-600 text-xs">{informe.resumen}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de cancelación */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500" size={24} />
                <h3 className="text-lg font-semibold">Cancelar Apadrinamiento</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Para cancelar el apadrinamiento, necesitamos conocer el motivo. Esta información 
                nos ayuda a mejorar nuestros servicios.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de cancelación *
                  </label>
                  <select
                    value={cancelData.motivo}
                    onChange={(e) => setCancelData({...cancelData, motivo: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar motivo</option>
                    <option value="situacion-economica">Cambio en situación económica</option>
                    <option value="cambio-prioridades">Cambio de prioridades</option>
                    <option value="falta-comunicacion">Falta de comunicación/informes</option>
                    <option value="mudanza">Mudanza/relocation</option>
                    <option value="problema-casa-hogar">Problema con la casa hogar</option>
                    <option value="otro">Otro motivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detalles adicionales (opcional)
                  </label>
                  <textarea
                    value={cancelData.detalles}
                    onChange={(e) => setCancelData({...cancelData, detalles: e.target.value})}
                    placeholder="Comparte más detalles si lo deseas..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="confirmacion"
                    type="checkbox"
                    checked={cancelData.confirmacion}
                    onChange={(e) => setCancelData({...cancelData, confirmacion: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="confirmacion" className="ml-2 block text-sm text-gray-900">
                    Confirmo que deseo cancelar este apadrinamiento
                  </label>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <h4 className="font-medium text-gray-900">Proceso de cancelación:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="text-blue-500" size={16} />
                    <p className="text-gray-700">Recibirás correo de confirmación</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-green-500" size={16} />
                    <p className="text-gray-700">Se notificará a la casa hogar</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-purple-500" size={16} />
                    <p className="text-gray-700">Se generará comprobante de cancelación</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCancelApadrinamiento}
                  disabled={!cancelData.motivo || !cancelData.confirmacion}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors disabled:cursor-not-allowed"
                >
                  Confirmar cancelación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
