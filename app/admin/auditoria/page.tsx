'use client';

import { useState } from 'react';
import { AlertTriangle, FileText, Users, Calendar, Search, Filter, Eye, Download } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';

export default function AuditoriaPage() {
  const { auditLogs, usuarios, solicitudesRecuperacion } = useDemoStore();
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipoEvento: '',
    resultado: '',
    fechaDesde: '',
    fechaHasta: '',
    actor: ''
  });

  const [seccionActiva, setSeccionActiva] = useState('fallos');

  // Filtrar logs de auditoría
  const logsFiltrados = auditLogs.filter((log: any) => {
    const cumpleBusqueda = !filtros.busqueda || 
      log.accion.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      log.entidad.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const cumpleTipo = !filtros.tipoEvento || log.accion.includes(filtros.tipoEvento);
    const cumpleResultado = !filtros.resultado || log.resultado === filtros.resultado;
    const cumpleActor = !filtros.actor || log.actor.includes(filtros.actor);
    
    return cumpleBusqueda && cumpleTipo && cumpleResultado && cumpleActor;
  });

  // Separar logs por tipo
  const fallosDelSistema = logsFiltrados.filter((log: any) => 
    log.resultado === 'ERROR' || log.accion.includes('Error') || log.accion.includes('Fallo')
  );

  const solicitudesRecuperacionFiltradas = solicitudesRecuperacion.filter((solicitud: any) => {
    return !filtros.busqueda || 
      solicitud.email.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      solicitud.ip.includes(filtros.busqueda);
  });

  const marcarComoResuelto = (logId: string) => {
    // Aquí se marcaría como resuelto en el store
    console.log('Marcando como resuelto:', logId);
  };

  const estadisticas = {
    totalEventos: auditLogs.length,
    errores: fallosDelSistema.length,
    exitosos: logsFiltrados.filter((l: any) => l.resultado === 'OK').length,
    solicitudesRecuperacion: solicitudesRecuperacion.length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auditoría y Monitoreo del Sistema</h1>
          <p className="text-gray-600">Revisar fallos, errores y solicitudes de recuperación</p>
        </div>

        {/* Navegación de secciones */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setSeccionActiva('fallos')}
                className={`py-3 border-b-2 transition-colors ${
                  seccionActiva === 'fallos'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Fallos del Sistema
              </button>
              <button
                onClick={() => setSeccionActiva('recuperacion')}
                className={`py-3 border-b-2 transition-colors ${
                  seccionActiva === 'recuperacion'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Recuperación de Contraseñas
              </button>
              <button
                onClick={() => setSeccionActiva('auditoria')}
                className={`py-3 border-b-2 transition-colors ${
                  seccionActiva === 'auditoria'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Log de Auditoría Completo
              </button>
            </nav>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalEventos}</p>
                <p className="text-gray-600 text-sm">Total eventos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.errores}</p>
                <p className="text-gray-600 text-sm">Errores/Fallos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.exitosos}</p>
                <p className="text-gray-600 text-sm">Exitosos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Users className="text-yellow-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.solicitudesRecuperacion}</p>
                <p className="text-gray-600 text-sm">Recuperaciones</p>
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
          
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de evento</label>
              <select
                value={filtros.tipoEvento}
                onChange={(e) => setFiltros({...filtros, tipoEvento: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="Login">Login</option>
                <option value="Apadrinamiento">Apadrinamiento</option>
                <option value="Registro">Registro</option>
                <option value="Error">Errores</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
              <select
                value={filtros.resultado}
                onChange={(e) => setFiltros({...filtros, resultado: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="OK">Exitoso</option>
                <option value="ERROR">Error</option>
                <option value="BLOCKED">Bloqueado</option>
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
                onClick={() => setFiltros({busqueda: '', tipoEvento: '', resultado: '', fechaDesde: '', fechaHasta: '', actor: ''})}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Contenido basado en sección activa */}
        {seccionActiva === 'fallos' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-red-50 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-red-900">Fallos y Errores del Sistema</h3>
            </div>

            {fallosDelSistema.length === 0 ? (
              <div className="p-12 text-center">
                <AlertTriangle className="mx-auto mb-4 text-gray-300" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay fallos registrados</h3>
                <p className="text-gray-600">El sistema está funcionando correctamente</p>
              </div>
            ) : (
              <div className="divide-y">
                {fallosDelSistema.map((log: any, index: number) => (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="text-red-500" size={16} />
                          <h4 className="font-semibold text-red-900">{log.accion}</h4>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            {log.resultado}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Actor</p>
                            <p className="font-medium">{log.actor}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Entidad</p>
                            <p className="font-medium">{log.entidad}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Fecha/Hora</p>
                            <p className="font-medium">{new Date(log.ts).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {log.ref && (
                          <div className="mt-2">
                            <p className="text-gray-600 text-sm">Referencia: {log.ref}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => marcarComoResuelto(log.id)}
                          className="text-green-600 hover:text-green-700 px-3 py-1 rounded-md hover:bg-green-50 transition-colors text-sm"
                        >
                          Marcar resuelto
                        </button>
                        
                        <button className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors text-sm">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {seccionActiva === 'recuperacion' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-50 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-blue-900">Solicitudes de Recuperación de Contraseña</h3>
            </div>

            {solicitudesRecuperacionFiltradas.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto mb-4 text-gray-300" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay solicitudes</h3>
                <p className="text-gray-600">No hay solicitudes de recuperación registradas</p>
              </div>
            ) : (
              <div className="divide-y">
                {solicitudesRecuperacionFiltradas.map((solicitud: any, index: number) => (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Usuario</p>
                        <p className="font-medium">{solicitud.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">IP de origen</p>
                        <p className="font-medium">{solicitud.ip}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Fecha/Hora</p>
                        <p className="font-medium">{new Date(solicitud.fecha).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Estado</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          solicitud.estado === 'Enviado' ? 'bg-green-100 text-green-800' :
                          solicitud.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {solicitud.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {seccionActiva === 'auditoria' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-green-50 px-6 py-3 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-green-900">Log de Auditoría Completo</h3>
                <button className="flex items-center gap-2 text-green-600 hover:text-green-700 px-3 py-1 rounded-md hover:bg-green-50 transition-colors text-sm">
                  <Download size={16} />
                  Exportar CSV
                </button>
              </div>
            </div>

            <div className="divide-y max-h-96 overflow-y-auto">
              {logsFiltrados.map((log: any, index: number) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${
                          log.resultado === 'OK' ? 'bg-green-500' :
                          log.resultado === 'ERROR' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></span>
                        <p className="font-medium">{log.accion}</p>
                        <span className="text-xs text-gray-500">{log.actor}</span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span>{log.entidad}</span>
                        {log.ref && <span className="ml-2">• {log.ref}</span>}
                        <span className="ml-2">• {new Date(log.ts).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.resultado === 'OK' ? 'bg-green-100 text-green-800' :
                      log.resultado === 'ERROR' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.resultado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
