'use client';

import { useState } from 'react';
import { FileCheck, FileX, User, Calendar, Shield, Search, Filter, AlertCircle } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function GestionSolicitudesPage() {
  const { solicitudesCasasHogar, aprobarSolicitudCasaHogar, rechazarSolicitudCasaHogar, addAudit } = useDemoStore();
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<any>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showRechazoModal, setShowRechazoModal] = useState(false);

  const solicitudesFiltradas = solicitudesCasasHogar.filter((solicitud: any) => {
    const cumpleBusqueda = !filtros.busqueda || 
      solicitud.nombreOrganizacion.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      solicitud.representante.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const cumpleEstado = !filtros.estado || solicitud.estado === filtros.estado;
    
    return cumpleBusqueda && cumpleEstado;
  });

  const aprobarSolicitud = (solicitudId: string) => {
    aprobarSolicitudCasaHogar(solicitudId);
    
    addAudit({
      ts: new Date().toISOString(),
      actor: 'Administrador',
      accion: 'Aprobar solicitud Casa Hogar',
      entidad: 'Solicitud',
      resultado: 'OK',
      ref: solicitudId
    });

    showToast('✅ Solicitud aprobada. Se ha enviado notificación a la Casa Hogar.');
    setShowDetalleModal(false);
  };

  const rechazarSolicitudConMotivo = () => {
    if (!motivoRechazo.trim()) {
      showToast('Debe ingresar un motivo de rechazo');
      return;
    }

    rechazarSolicitudCasaHogar(solicitudSeleccionada.id, motivoRechazo);
    
    addAudit({
      ts: new Date().toISOString(),
      actor: 'Administrador',
      accion: 'Rechazar solicitud Casa Hogar',
      entidad: 'Solicitud',
      resultado: 'OK',
      ref: solicitudSeleccionada.id
    });

    showToast('❌ Solicitud rechazada. Se ha enviado notificación con el motivo.');
    setShowRechazoModal(false);
    setShowDetalleModal(false);
    setMotivoRechazo('');
  };

  const estadisticas = {
    pendientes: solicitudesCasasHogar.filter((s: any) => s.estado === 'Pendiente').length,
    aprobadas: solicitudesCasasHogar.filter((s: any) => s.estado === 'Aprobada').length,
    rechazadas: solicitudesCasasHogar.filter((s: any) => s.estado === 'Rechazada').length,
    total: solicitudesCasasHogar.length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Solicitudes de Casas Hogar</h1>
          <p className="text-gray-600">Aprobar o rechazar solicitudes de registro de nuevas instituciones</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={24} />
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
                <p className="text-2xl font-bold text-gray-900">{estadisticas.aprobadas}</p>
                <p className="text-gray-600 text-sm">Aprobadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileX className="text-red-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.rechazadas}</p>
                <p className="text-gray-600 text-sm">Rechazadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Shield className="text-blue-600" size={24} />
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
                  placeholder="Buscar por organización o representante..."
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
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFiltros({busqueda: '', estado: '', fechaDesde: '', fechaHasta: ''})}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de solicitudes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Organización</div>
              <div className="col-span-2">Representante</div>
              <div className="col-span-2">Fecha Solicitud</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-3">Acciones</div>
            </div>
          </div>

          {solicitudesFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <FileCheck className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay solicitudes</h3>
              <p className="text-gray-600">No hay solicitudes que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="divide-y">
              {solicitudesFiltradas.map((solicitud: any) => (
                <div key={solicitud.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <p className="font-medium text-gray-900">{solicitud.nombreOrganizacion}</p>
                      <p className="text-sm text-gray-500">{solicitud.correo}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="font-medium">{solicitud.representante}</p>
                      <p className="text-sm text-gray-600">{solicitud.documento}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <p className="text-sm">{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        solicitud.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        solicitud.estado === 'Aprobada' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {solicitud.estado}
                      </span>
                    </div>
                    
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSolicitudSeleccionada(solicitud);
                            setShowDetalleModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors text-sm"
                        >
                          Ver detalles
                        </button>
                        
                        {solicitud.estado === 'Pendiente' && (
                          <>
                            <button
                              onClick={() => aprobarSolicitud(solicitud.id)}
                              className="text-green-600 hover:text-green-700 px-3 py-1 rounded-md hover:bg-green-50 transition-colors text-sm"
                            >
                              Aprobar
                            </button>
                            
                            <button
                              onClick={() => {
                                setSolicitudSeleccionada(solicitud);
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
        {showDetalleModal && solicitudSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Detalles de la Solicitud</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Organización</p>
                    <p className="text-gray-900">{solicitudSeleccionada.nombreOrganizacion}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Representante</p>
                    <p className="text-gray-900">{solicitudSeleccionada.representante}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Documento</p>
                    <p className="text-gray-900">{solicitudSeleccionada.documento}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Teléfono</p>
                    <p className="text-gray-900">{solicitudSeleccionada.telefono}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700">Correo</p>
                    <p className="text-gray-900">{solicitudSeleccionada.correo}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700">Dirección</p>
                    <p className="text-gray-900">{solicitudSeleccionada.direccion}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700">Documentación</p>
                    <p className="text-blue-600 hover:text-blue-700 cursor-pointer">{solicitudSeleccionada.documentacion}</p>
                  </div>
                </div>

                {solicitudSeleccionada.estado === 'Pendiente' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => aprobarSolicitud(solicitudSeleccionada.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      Aprobar Solicitud
                    </button>
                    
                    <button
                      onClick={() => setShowRechazoModal(true)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                    >
                      Rechazar Solicitud
                    </button>
                  </div>
                )}
              </div>

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
              <h3 className="text-lg font-semibold mb-4">Rechazar Solicitud</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo de rechazo *
                  </label>
                  <textarea
                    value={motivoRechazo}
                    onChange={(e) => setMotivoRechazo(e.target.value)}
                    placeholder="Ingrese el motivo detallado del rechazo..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                  onClick={rechazarSolicitudConMotivo}
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
