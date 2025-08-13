'use client';

import { useState } from 'react';
import { FileText, Filter, Search, AlertCircle, Download, Calendar, Eye } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';

export default function InformesPage() {
  const { informes, casasHogar } = useDemoStore();
  
  const [filtros, setFiltros] = useState({
    tipo: '',
    estado: '',
    casaHogar: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });

  const [accesoInformes] = useState(false); // Simulando falta de acceso
  
  const informesFiltrados = informes.filter((informe: any) => {
    const cumpleTipo = !filtros.tipo || informe.tipo === filtros.tipo;
    const cumpleEstado = !filtros.estado || informe.estado === filtros.estado;
    const cumpleCasaHogar = !filtros.casaHogar || informe.casaHogarId === filtros.casaHogar;
    const cumpleBusqueda = !filtros.busqueda || 
      informe.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      (informe.resumen && informe.resumen.toLowerCase().includes(filtros.busqueda.toLowerCase()));
    
    return cumpleTipo && cumpleEstado && cumpleCasaHogar && cumpleBusqueda;
  });

  const tiposInforme = ['Progreso mensual', 'Reporte médico', 'Reporte académico', 'Actividades', 'Otro'];
  
  const estadisticas = {
    total: informes.length,
    publicados: informes.filter((i: any) => i.estado === 'Publicado').length,
    borradores: informes.filter((i: any) => i.estado === 'Borrador').length,
    revision: informes.filter((i: any) => i.estado === 'En revisión').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Informes Publicados</h1>
          <p className="text-gray-600">Consulta los informes de progreso de todos los apadrinamientos</p>
        </div>

        {/* Verificación de acceso */}
        {!accesoInformes ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-yellow-600" size={64} />
            <h2 className="text-2xl font-bold text-yellow-900 mb-2">Acceso Restringido</h2>
            <p className="text-yellow-800 mb-6">
              Para acceder a los informes detallados, necesitas tener al menos un apadrinamiento activo.
              Los informes contienen información personal y confidencial de los niños.
            </p>
            <div className="bg-yellow-100 rounded-md p-4 text-left">
              <h3 className="font-semibold text-yellow-900 mb-2">Requisitos de acceso:</h3>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Tener al menos un apadrinamiento activo</li>
                <li>• Verificación de identidad completada</li>
                <li>• Aceptación de términos de confidencialidad</li>
                <li>• Pagos al día en tus apadrinamientos</li>
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="/explorar"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors inline-block"
              >
                Explorar candidatos para apadrinamiento
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                    <p className="text-gray-600 text-sm">Total informes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.publicados}</p>
                    <p className="text-gray-600 text-sm">Publicados</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.revision}</p>
                    <p className="text-gray-600 text-sm">En revisión</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.borradores}</p>
                    <p className="text-gray-600 text-sm">Borradores</p>
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
                      placeholder="Buscar informes..."
                      value={filtros.busqueda}
                      onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={filtros.tipo}
                    onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los tipos</option>
                    {tiposInforme.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={filtros.estado}
                    onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los estados</option>
                    <option value="Publicado">Publicado</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Borrador">Borrador</option>
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
                    {casasHogar.map((casa: any) => (
                      <option key={casa.id} value={casa.id}>{casa.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
                  <input
                    type="date"
                    value={filtros.fechaDesde}
                    onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
                  <input
                    type="date"
                    value={filtros.fechaHasta}
                    onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFiltros({tipo: '', estado: '', casaHogar: '', fechaDesde: '', fechaHasta: '', busqueda: ''})}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de informes */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {informesFiltrados.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="mx-auto mb-4 text-gray-300" size={64} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay informes</h3>
                  <p className="text-gray-600">No se encontraron informes que coincidan con los filtros seleccionados</p>
                </div>
              ) : (
                <div className="divide-y">
                  {informesFiltrados.map((informe: any) => {
                    const casaHogar = casasHogar.find((c: any) => c.id === informe.casaHogarId);
                    
                    return (
                      <div key={informe.id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{informe.titulo}</h3>
                              <StateChip estado={informe.estado} />
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-600">Tipo</p>
                                <p className="font-medium">{informe.tipo}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-600">Casa Hogar</p>
                                <p className="font-medium">{casaHogar?.nombre || 'N/A'}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-600">Fecha</p>
                                <p className="font-medium flex items-center gap-1">
                                  <Calendar size={14} />
                                  {informe.fecha}
                                </p>
                              </div>
                            </div>
                            
                            {informe.resumen && (
                              <p className="text-gray-700 mb-3">{informe.resumen}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                Apadrinado: {informe.apadrinadoId}
                              </span>
                              {informe.tags && (
                                <div className="flex gap-1">
                                  {informe.tags.map((tag: string, index: number) => (
                                    <span 
                                      key={index}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors">
                              <Eye size={16} />
                              Ver
                            </button>
                            
                            <button className="flex items-center gap-1 text-green-600 hover:text-green-700 px-3 py-2 rounded-md hover:bg-green-50 transition-colors">
                              <Download size={16} />
                              Descargar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Información sobre informes */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Información sobre Informes</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="mb-2"><strong>Frecuencia:</strong> Los informes se publican mensualmente</p>
              <p className="mb-2"><strong>Contenido:</strong> Progreso académico, desarrollo personal, salud y actividades</p>
              <p><strong>Privacidad:</strong> Solo visibles para donadores con apadrinamientos activos</p>
            </div>
            <div>
              <p className="mb-2"><strong>Proceso:</strong> Las casas hogar envían informes que son revisados antes de publicarse</p>
              <p className="mb-2"><strong>Formato:</strong> PDF descargable con fotos y detalles del progreso</p>
              <p><strong>Notificación:</strong> Se envía correo cuando hay nuevos informes disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
