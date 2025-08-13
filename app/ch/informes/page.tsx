'use client';

import { useState } from 'react';
import { FileText, Upload, Send, Eye, Edit, Trash2, Calendar, User, CheckCircle, Clock, XCircle, Filter, Search, Plus } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { EstadoInforme } from '@/src/demo/types';
import { showToast } from '@/lib/toast';

export default function InformesCasaHogarPage() {
  const { informes, apadrinados, addInforme, updateInforme, removeInforme, addAudit } = useDemoStore();
  
  const [vistaActual, setVistaActual] = useState<'lista' | 'crear' | 'editar'>('lista');
  const [informeSeleccionado, setInformeSeleccionado] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    apadrinado: '',
    tipo: '',
    fechaDesde: ''
  });

  // Form data para crear/editar informe
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Progreso Académico',
    apadrinadoId: '',
    periodo: '',
    contenido: '',
    observaciones: '',
    archivos: [] as File[]
  });

  // Simular informes de la casa hogar actual
  const misApadrinados = apadrinados.filter(a => a.casaHogarId === 'u-ch1');
  const misInformes = informes.filter(inf => 
    misApadrinados.some(a => a.id === inf.apadrinadoId)
  );

  const informesFiltrados = misInformes.filter(informe => {
    const cumpleBusqueda = !filtros.busqueda || 
      informe.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      informe.apadrinadoId.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const cumpleEstado = !filtros.estado || informe.estado === filtros.estado;
    const cumpleApadrinado = !filtros.apadrinado || informe.apadrinadoId === filtros.apadrinado;
    const cumpleTipo = !filtros.tipo || informe.tipo === filtros.tipo;
    
    return cumpleBusqueda && cumpleEstado && cumpleApadrinado && cumpleTipo;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, archivos: Array.from(e.target.files || []) }));
    }
  };

  const crearInforme = () => {
    if (!formData.titulo.trim() || !formData.apadrinadoId || !formData.contenido.trim()) {
      showToast('Complete todos los campos requeridos');
      return;
    }

    const nuevoInforme = {
      id: `inf-${Date.now()}`,
      titulo: formData.titulo,
      tipo: formData.tipo,
      apadrinadoId: formData.apadrinadoId,
      casaHogarId: 'u-ch1',
      casaHogarNombre: 'CH Rayito de Sol',
      periodo: formData.periodo,
      contenido: formData.contenido,
      observaciones: formData.observaciones,
      estado: 'Pendiente' as EstadoInforme,
      fechaCreacion: new Date().toISOString(),
      fechaEnvio: new Date().toISOString(),
      archivos: formData.archivos.length > 0 ? `${formData.archivos.length} archivo(s)` : null
    };

    addInforme(nuevoInforme);

    addAudit({
      actor: 'CasaHogar',
      accion: 'Crear informe',
      entidad: 'Informe',
      resultado: 'OK',
      ref: nuevoInforme.id
    });

    showToast('✅ Informe creado exitosamente');
    resetForm();
    setVistaActual('lista');
  };

  const editarInforme = () => {
    if (!informeSeleccionado || !formData.titulo.trim() || !formData.contenido.trim()) {
      showToast('Complete todos los campos requeridos');
      return;
    }

    updateInforme(informeSeleccionado.id, {
      titulo: formData.titulo,
      tipo: formData.tipo,
      periodo: formData.periodo,
      contenido: formData.contenido,
      observaciones: formData.observaciones,
      fechaEnvio: new Date().toISOString()
    });

    addAudit({
      actor: 'CasaHogar',
      accion: 'Editar informe',
      entidad: 'Informe',
      resultado: 'OK',
      ref: informeSeleccionado.id
    });

    showToast('✅ Informe actualizado exitosamente');
    resetForm();
    setVistaActual('lista');
  };

  const enviarInforme = (informeId: string) => {
    updateInforme(informeId, { 
      estado: 'Pendiente',
      fechaEnvio: new Date().toISOString()
    });

    addAudit({
      actor: 'CasaHogar',
      accion: 'Enviar informe',
      entidad: 'Informe',
      resultado: 'OK',
      ref: informeId
    });

    showToast('📤 Informe enviado para revisión del administrador');
  };

  const eliminarInforme = () => {
    if (!showDeleteModal) return;

    removeInforme(showDeleteModal);

    addAudit({
      actor: 'CasaHogar',
      accion: 'Eliminar informe',
      entidad: 'Informe',
      resultado: 'OK',
      ref: showDeleteModal
    });

    showToast('🗑️ Informe eliminado');
    setShowDeleteModal(null);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      tipo: 'Progreso Académico',
      apadrinadoId: '',
      periodo: '',
      contenido: '',
      observaciones: '',
      archivos: []
    });
    setInformeSeleccionado(null);
  };

  const prepararEdicion = (informe: any) => {
    setInformeSeleccionado(informe);
    setFormData({
      titulo: informe.titulo,
      tipo: informe.tipo,
      apadrinadoId: informe.apadrinadoId,
      periodo: informe.periodo,
      contenido: informe.contenido,
      observaciones: informe.observaciones || '',
      archivos: []
    });
    setVistaActual('editar');
  };

  const estadisticas = {
    total: misInformes.length,
    pendientes: misInformes.filter(i => i.estado === 'Pendiente').length,
    aprobados: misInformes.filter(i => i.estado === 'Aprobado').length,
    borradores: misInformes.filter(i => i.estado === 'Borrador').length
  };

  const tiposInforme = [
    'Progreso Académico',
    'Estado de Salud',
    'Desarrollo Personal',
    'Actividades Recreativas',
    'Necesidades Específicas',
    'Informe Mensual',
    'Informe Especial'
  ];

  if (vistaActual === 'crear' || vistaActual === 'editar') {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => {
                resetForm();
                setVistaActual('lista');
              }}
              className="text-blue-600 hover:text-blue-700 mb-4"
            >
              ← Volver a la lista
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {vistaActual === 'crear' ? 'Crear Nuevo Informe' : 'Editar Informe'}
            </h1>
            <p className="text-gray-600">
              {vistaActual === 'crear' 
                ? 'Complete la información del informe de progreso' 
                : 'Modifique los datos del informe seleccionado'
              }
            </p>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título del informe *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Ej: Informe mensual de progreso - Marzo 2024"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de informe *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {tiposInforme.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apadrinado *
                  </label>
                  <select
                    name="apadrinadoId"
                    value={formData.apadrinadoId}
                    onChange={handleInputChange}
                    disabled={vistaActual === 'editar'}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">Seleccionar apadrinado</option>
                    {misApadrinados.map(apadrinado => (
                      <option key={apadrinado.id} value={apadrinado.id}>
                        {apadrinado.nombre} - {apadrinado.edad} años
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período del informe
                  </label>
                  <input
                    type="text"
                    name="periodo"
                    value={formData.periodo}
                    onChange={handleInputChange}
                    placeholder="Ej: Marzo 2024, Trimestre 1, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido del informe *
                </label>
                <textarea
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleInputChange}
                  rows={8}
                  placeholder="Describa detalladamente el progreso, actividades realizadas, logros alcanzados, desafíos enfrentados..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones adicionales
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Comentarios adicionales, recomendaciones, notas especiales..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Archivos adjuntos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Archivos adjuntos
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Subir archivos</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </label>
                      <p className="pl-1">o arrastrar aquí</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG hasta 10MB
                    </p>
                  </div>
                </div>
                {formData.archivos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {formData.archivos.length} archivo(s) seleccionado(s)
                    </p>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    resetForm();
                    setVistaActual('lista');
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={vistaActual === 'crear' ? crearInforme : editarInforme}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors"
                >
                  {vistaActual === 'crear' ? 'Crear informe' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Informes</h1>
              <p className="text-gray-600">Crear y administrar informes de progreso de apadrinados</p>
            </div>
            <button
              onClick={() => setVistaActual('crear')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Nuevo informe
            </button>
          </div>
        </div>

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
              <Clock className="text-yellow-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.pendientes}</p>
                <p className="text-gray-600 text-sm">Pendientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.aprobados}</p>
                <p className="text-gray-600 text-sm">Aprobados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Edit className="text-gray-600" size={24} />
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
          
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por título..."
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
                <option value="">Todos</option>
                <option value="Borrador">Borrador</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apadrinado</label>
              <select
                value={filtros.apadrinado}
                onChange={(e) => setFiltros({...filtros, apadrinado: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                {misApadrinados.map(apadrinado => (
                  <option key={apadrinado.id} value={apadrinado.id}>
                    {apadrinado.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={filtros.tipo}
                onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                {tiposInforme.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFiltros({busqueda: '', estado: '', apadrinado: '', tipo: '', fechaDesde: ''})}
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
              <div className="col-span-4">Título</div>
              <div className="col-span-2">Apadrinado</div>
              <div className="col-span-2">Tipo</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1">Acciones</div>
            </div>
          </div>

          {informesFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay informes</h3>
              <p className="text-gray-600 mb-6">Comienza creando tu primer informe de progreso</p>
              <button
                onClick={() => setVistaActual('crear')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Crear primer informe
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {informesFiltrados.map((informe) => {
                const apadrinado = misApadrinados.find(a => a.id === informe.apadrinadoId);
                
                return (
                  <div key={informe.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <p className="font-medium text-gray-900">{informe.titulo}</p>
                        <p className="text-sm text-gray-500">{informe.periodo}</p>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="font-medium">{apadrinado?.nombre || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <span className="text-sm text-gray-600">{informe.tipo}</span>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm">
                            {informe.fechaCreacion ? new Date(informe.fechaCreacion).toLocaleDateString() : 'No disponible'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          informe.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                          informe.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          informe.estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {informe.estado}
                        </span>
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => prepararEdicion(informe)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          
                          {informe.estado === 'Borrador' && (
                            <button
                              onClick={() => enviarInforme(informe.id)}
                              className="text-green-600 hover:text-green-700 p-1"
                              title="Enviar"
                            >
                              <Send size={16} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => setShowDeleteModal(informe.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
              
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar este informe? Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={eliminarInforme}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Consejos para crear informes efectivos</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Sea específico:</strong> Include detalles concretos sobre el progreso y actividades</p>
            <p>• <strong>Use evidencias:</strong> Adjunte fotos, documentos o trabajos del apadrinado</p>
            <p>• <strong>Mantenga regularidad:</strong> Envíe informes de manera consistente</p>
            <p>• <strong>Sea transparente:</strong> Incluya tanto logros como desafíos enfrentados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
