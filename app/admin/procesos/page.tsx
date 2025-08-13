'use client';

import { useState } from 'react';
import { FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';
import { showToast } from '@/lib/toast';

export default function AdminProcesosPage() {
  const { 
    informes, 
    apadrinados, 
    updateInforme, 
    publicacionResultado,
    logAudit 
  } = useDemoStore();
  
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);

  const informesPendientes = informes.filter(inf => inf.estado === 'Pendiente');
  const informesPublicados = informes.filter(inf => inf.estado === 'Publicado');
  const informesRechazados = informes.filter(inf => inf.estado === 'Rechazado');

  const getApadrinado = (id: string) => apadrinados.find(a => a.id === id);

  const handlePublicar = (informeId: string) => {
    const resultado = publicacionResultado === 'Aprobar' ? 'Publicado' : 'Rechazado';
    
    updateInforme(informeId, { estado: resultado as any });
    
    logAudit({
      actor: 'Admin',
      accion: resultado === 'Publicado' ? 'Publicar informe' : 'Rechazar informe',
      entidad: 'informe',
      resultado: resultado === 'Publicado' ? 'Aprobado' : 'Rechazado',
      ref: informeId
    });

    if (resultado === 'Publicado') {
      showToast('Informe publicado (simulado)');
      setTimeout(() => {
        showToast('Notificación enviada a donadores (simulado)');
      }, 1000);
    } else {
      showToast('Informe rechazado (simulado)');
      setTimeout(() => {
        showToast('Correo a Casa Hogar con motivos (simulado)');
      }, 1000);
    }
  };

  const handleRechazar = (informeId: string) => {
    updateInforme(informeId, { estado: 'Rechazado' });
    
    logAudit({
      actor: 'Admin',
      accion: 'Rechazar informe',
      entidad: 'informe',
      resultado: 'Rechazado',
      ref: informeId
    });

    showToast('Informe rechazado (simulado)');
    setTimeout(() => {
      showToast('Correo a Casa Hogar con motivos (simulado)');
    }, 1000);
  };

  const informeDetalle = showDetailModal ? informes.find(i => i.id === showDetailModal) : null;
  const apadrinadoDetalle = informeDetalle ? getApadrinado(informeDetalle.apadrinadoId) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Procesos</h1>
          <p className="text-gray-600">Administra informes, fallos y procesos del sistema</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{informesPendientes.length}</p>
                <p className="text-gray-600 text-sm">Informes pendientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{informesPublicados.length}</p>
                <p className="text-gray-600 text-sm">Informes publicados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{informesRechazados.length}</p>
                <p className="text-gray-600 text-sm">Informes rechazados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{informes.length}</p>
                <p className="text-gray-600 text-sm">Total informes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informes pendientes */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock size={20} className="text-yellow-600" />
              Informes Pendientes de Revisión
            </h2>
          </div>

          {informesPendientes.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay informes pendientes</h3>
              <p className="text-gray-600">Todos los informes han sido procesados</p>
            </div>
          ) : (
            <div className="divide-y">
              {informesPendientes.map((informe) => {
                const apadrinado = getApadrinado(informe.apadrinadoId);
                return (
                  <div key={informe.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{informe.titulo}</h3>
                          <StateChip estado={informe.estado} size="sm" />
                        </div>
                        
                        {apadrinado && (
                          <p className="text-gray-600 text-sm mb-1">
                            Apadrinado: {apadrinado.nombre} ({apadrinado.edad} años)
                          </p>
                        )}
                        
                        {informe.resumen && (
                          <p className="text-gray-700 text-sm">{informe.resumen}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setShowDetailModal(informe.id)}
                          className="p-2 text-blue-600 hover:text-blue-700 rounded"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button
                          onClick={() => handlePublicar(informe.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                        >
                          {publicacionResultado === 'Aprobar' ? 'Publicar' : 'Rechazar'}
                        </button>
                        
                        <button
                          onClick={() => handleRechazar(informe.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Historial de informes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Historial de Informes</h2>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto">
            {[...informesPublicados, ...informesRechazados].map((informe) => {
              const apadrinado = getApadrinado(informe.apadrinadoId);
              return (
                <div key={informe.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium">{informe.titulo}</span>
                        <StateChip estado={informe.estado} size="sm" />
                      </div>
                      {apadrinado && (
                        <p className="text-gray-600 text-sm">
                          {apadrinado.nombre} - {informe.resumen}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setShowDetailModal(informe.id)}
                      className="p-1 text-gray-600 hover:text-blue-600 rounded"
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal de detalles */}
        {showDetailModal && informeDetalle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Detalles del Informe</h3>
                <button
                  onClick={() => setShowDetailModal(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Título</h4>
                  <p className="text-gray-700">{informeDetalle.titulo}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Estado</h4>
                  <StateChip estado={informeDetalle.estado} />
                </div>

                {apadrinadoDetalle && (
                  <div>
                    <h4 className="font-medium mb-1">Apadrinado</h4>
                    <p className="text-gray-700">
                      {apadrinadoDetalle.nombre} - {apadrinadoDetalle.edad} años
                      <br />
                      <span className="text-sm text-gray-600">
                        Necesidad: {apadrinadoDetalle.necesidad}
                      </span>
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-1">Resumen</h4>
                  <p className="text-gray-700">{informeDetalle.resumen}</p>
                </div>

                {/* TODO: Aquí iría el contenido detallado del informe */}
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">
                    [Contenido detallado del informe - Por implementar]
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cerrar
                </button>
                
                {informeDetalle.estado === 'Pendiente' && (
                  <>
                    <button
                      onClick={() => {
                        handlePublicar(informeDetalle.id);
                        setShowDetailModal(null);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      Publicar
                    </button>
                    <button
                      onClick={() => {
                        handleRechazar(informeDetalle.id);
                        setShowDetailModal(null);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
