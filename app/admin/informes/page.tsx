'use client';

import { useState } from 'react';
import { FileCheck, FileX, FileText, Eye, Calendar, Search, Filter } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function RevisionInformesPage() {
  const { informesPendientes, aprobarInforme, rechazarInforme, addAudit } = useDemoStore();
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    casaHogar: '',
    fechaDesde: ''
  });
  const [informeSeleccionado, setInformeSeleccionado] = useState<any>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showRechazoModal, setShowRechazoModal] = useState(false);

  const informesFiltrados = informesPendientes.filter((informe: any) => {
    const cumpleBusqueda = !filtros.busqueda || 
      informe.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      informe.apadrinadoId.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const cumpleEstado = !filtros.estado || informe.estado === filtros.estado;
    const cumpleCasaHogar = !filtros.casaHogar || informe.casaHogarId === filtros.casaHogar;
    
    return cumpleBusqueda && cumpleEstado && cumpleCasaHogar;
  });

  const aprobarInformeSeleccionado = () => {
    aprobarInforme(informeSeleccionado.id);
    
    addAudit({
      ts: new Date().toISOString(),
      actor: 'Administrador',
      accion: 'Aprobar informe',
      entidad: 'Informe',
      resultado: 'OK',
      ref: informeSeleccionado.id
    });

    showToast('✅ Informe aprobado y publicado. Se ha notificado a los donadores.');
    setShowDetalleModal(false);
  };

  const rechazarInformeConMotivo = () => {
    if (!motivoRechazo.trim()) {
      showToast('Debe ingresar un motivo de rechazo');
      return;
    }

    rechazarInforme(informeSeleccionado.id, motivoRechazo);
    
    addAudit({
      ts: new Date().toISOString(),
      actor: 'Administrador',
      accion: 'Rechazar informe',
      entidad: 'Informe',
      resultado: 'OK',
      ref: informeSeleccionado.id
    });

    showToast('❌ Informe rechazado. Se ha notificado a la Casa Hogar.');
    setShowRechazoModal(false);
    setShowDetalleModal(false);
    setMotivoRechazo('');
  };

  const estadisticas = {
    pendientes: informesPendientes.filter((i: any) => i.estado === 'Pendiente').length,
    aprobados: informesPendientes.filter((i: any) => i.estado === 'Aprobado').length,
    rechazados: informesPendientes.filter((i: any) => i.estado === 'Rechazado').length,
    total: informesPendientes.length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Revisión de Informes</h1>
          <p className="text-gray-600">Aprobar o rechazar informes enviados por las Casas Hogar</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileText className="text-yellow-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.pendientes}</p>
                <p className="text-gray-600 text-sm">Pendientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileCheck className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.aprobados}</p>
                <p className="text-gray-600 text-sm">Aprobados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileX className="text-red-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.rechazados}</p>
                <p className="text-gray-600 text-sm">Rechazados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                <p className="text-gray-600 text-sm">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por título o apadrinado..."
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Casa Hogar</label>
              <select
                value={filtros.casaHogar}
                onChange={(e) => setFiltros({...filtros, casaHogar: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las casas hogar</option>
                <option value="u-ch1">Casa Hogar Esperanza</option>
                <option value="u-ch2">Hogar San José</option>
                <option value="u-ch3">Casa de los Niños</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFiltros({busqueda: '', estado: '', casaHogar: '', fechaDesde: ''})}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de informes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Título</div>
              <div className="col-span-2">Casa Hogar</div>
              <div className="col-span-2">Apadrinado</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-2">Acciones</div>
            </div>
          </div>

          {informesFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay informes</h3>
              <p className="text-gray-600">No hay informes que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="divide-y">
              {informesFiltrados.map((informe: any) => (
                <div key={informe.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <p className="font-medium text-gray-900">{informe.titulo}</p>
                      <p className="text-sm text-gray-500">{informe.tipo}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="font-medium">{informe.casaHogarNombre}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="font-medium">{informe.apadrinadoId}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <p className="text-sm">{new Date(informe.fechaEnvio).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        informe.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        informe.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {informe.estado}
                      </span>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setInformeSeleccionado(informe);
                            setShowDetalleModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors text-sm flex items-center gap-1"
                        >
                          <Eye size={14} />
                          Ver
                        </button>
                        
                        {informe.estado === 'Pendiente' && (
                          <>
                            <button
                              onClick={() => aprobarInformeSeleccionado()}
                              className="text-green-600 hover:text-green-700 px-3 py-1 rounded-md hover:bg-green-50 transition-colors text-sm"
                            >
                              Aprobar
                            </button>
                            
                            <button
                              onClick={() => {
                                setInformeSeleccionado(informe);
                                setShowRechazoModal(true);
                              }}
                              className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors text-sm"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de detalles */}
        {showDetalleModal && informeSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold">{informeSeleccionado.titulo}</h3>
                  <p className="text-gray-600">{informeSeleccionado.tipo}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  informeSeleccionado.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  informeSeleccionado.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {informeSeleccionado.estado}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-3">Información del Informe</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Casa Hogar</p>
                      <p className="text-gray-900">{informeSeleccionado.casaHogarNombre}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Apadrinado</p>
                      <p className="text-gray-900">{informeSeleccionado.apadrinadoId}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fecha de envío</p>
                      <p className="text-gray-900">{new Date(informeSeleccionado.fechaEnvio).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Período del informe</p>
                      <p className="text-gray-900">{informeSeleccionado.periodo}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Metadatos</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">ID del informe</p>
                      <p className="text-gray-900 font-mono text-sm">{informeSeleccionado.id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Archivos adjuntos</p>
                      <p className="text-gray-900">{informeSeleccionado.archivos || 'Ninguno'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tamaño</p>
                      <p className="text-gray-900">{informeSeleccionado.tamaño || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Contenido del Informe</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-line">
                    {informeSeleccionado.contenido || informeSeleccionado.resumen || 'No hay contenido disponible para previsualización.'}
                  </p>
                </div>
              </div>

              {informeSeleccionado.estado === 'Pendiente' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={aprobarInformeSeleccionado}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    ✅ Aprobar y Publicar
                  </button>
                  
                  <button
                    onClick={() => setShowRechazoModal(true)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    ❌ Rechazar Informe
                  </button>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetalleModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de rechazo */}
        {showRechazoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Rechazar Informe</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo de rechazo *
                  </label>
                  <textarea
                    value={motivoRechazo}
                    onChange={(e) => setMotivoRechazo(e.target.value)}
                    placeholder="Ingrese el motivo detallado del rechazo del informe..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-yellow-800 text-sm">
                    La Casa Hogar recibirá una notificación con el motivo del rechazo y podrá reenviar el informe corregido.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRechazoModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={rechazarInformeConMotivo}
                  disabled={!motivoRechazo.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
