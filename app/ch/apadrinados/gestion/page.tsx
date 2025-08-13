'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Users, Search, Filter } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';
import { showToast } from '@/lib/toast';

export default function GestionApadrinadosPage() {
  const { apadrinados, updateApadrinado, removeApadrinado, addAudit } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  // Filtrar apadrinados de la casa hogar actual (simulado - ch1)
  const apadrinadosCH = apadrinados.filter((a: any) => a.casaHogarId === 'u-ch1');
  
  const filteredApadrinados = apadrinadosCH.filter((apadrinado: any) => {
    const matchesSearch = apadrinado.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || apadrinado.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDesasociar = (apadrinadoId: string) => {
    updateApadrinado(apadrinadoId, { estado: 'Inactivo' });
    
    addAudit({
      ts: new Date().toISOString(),
      actor: 'Casa Hogar',
      accion: 'Desasociar apadrinado',
      entidad: 'Apadrinado',
      resultado: 'OK',
      ref: apadrinadoId
    });

    showToast('Apadrinado desasociado exitosamente');
    showToast('📧 Notificación enviada al donador (simulado)');
    
    setShowDeleteModal(null);
  };

  const handleInactivar = (apadrinadoId: string) => {
    updateApadrinado(apadrinadoId, { estado: 'Inactivo' });
    
    addAudit({
      ts: new Date().toISOString(),
      actor: 'Casa Hogar',
      accion: 'Inactivar apadrinado',
      entidad: 'Apadrinado',
      resultado: 'OK',
      ref: apadrinadoId
    });

    showToast('Apadrinado inactivado exitosamente');
    setShowDeleteModal(null);
  };

  const estadisticas = {
    total: apadrinadosCH.length,
    activos: apadrinadosCH.filter((a: any) => a.estado === 'Apadrinado').length,
    disponibles: apadrinadosCH.filter((a: any) => a.estado === 'Disponible').length,
    inactivos: apadrinadosCH.filter((a: any) => a.estado === 'Inactivo').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Apadrinados</h1>
              <p className="text-gray-600">Administra la información de los niños en tu casa hogar</p>
            </div>
            <Link
              href="/ch/apadrinados/nuevo"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Registrar nuevo
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                <p className="text-gray-600 text-sm">Total registrados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.activos}</p>
                <p className="text-gray-600 text-sm">Apadrinados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.disponibles}</p>
                <p className="text-gray-600 text-sm">Disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.inactivos}</p>
                <p className="text-gray-600 text-sm">Inactivos</p>
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
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="Disponible">Disponible</option>
                <option value="Apadrinado">Apadrinado</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de apadrinados */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Nombre</div>
              <div className="col-span-2">Edad/Género</div>
              <div className="col-span-3">Necesidad</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2">Acciones</div>
            </div>
          </div>

          {filteredApadrinados.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {apadrinadosCH.length === 0 ? 'No hay apadrinados registrados' : 'No hay resultados'}
              </h3>
              <p className="text-gray-600 mb-4">
                {apadrinadosCH.length === 0 
                  ? 'Comienza registrando el primer niño de tu casa hogar'
                  : 'No hay apadrinados que coincidan con los filtros seleccionados'
                }
              </p>
              {apadrinadosCH.length === 0 && (
                <Link
                  href="/ch/apadrinados/nuevo"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                  Registrar primer apadrinado
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredApadrinados.map((apadrinado: any) => (
                <div key={apadrinado.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={apadrinado.foto || `https://ui-avatars.com/api/?name=${apadrinado.nombre}&background=random`}
                          alt={apadrinado.nombre}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{apadrinado.nombre}</p>
                          <p className="text-sm text-gray-500">ID: {apadrinado.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="font-medium">{apadrinado.edad} años</p>
                      <p className="text-sm text-gray-600">{apadrinado.genero === 'M' ? 'Masculino' : 'Femenino'}</p>
                    </div>
                    
                    <div className="col-span-3">
                      <p className="text-gray-900">{apadrinado.necesidad}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <StateChip state={apadrinado.estado} />
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/ch/apadrinados/${apadrinado.id}`}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Link>
                        
                        <button
                          onClick={() => setShowDeleteModal(apadrinado.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Desasociar/Inactivar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de confirmación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirmar acción</h3>
              
              <p className="text-gray-600 mb-6">
                ¿Qué acción deseas realizar con este apadrinado?
              </p>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleDesasociar(showDeleteModal)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors text-left"
                >
                  <div>
                    <p className="font-medium">Desasociar</p>
                    <p className="text-sm text-orange-100">Remover de apadrinamiento activo (notifica al donador)</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleInactivar(showDeleteModal)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors text-left"
                >
                  <div>
                    <p className="font-medium">Inactivar</p>
                    <p className="text-sm text-red-100">Marcar como inactivo (no disponible para apadrinamiento)</p>
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Información de Gestión</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>ID no modificable:</strong> Una vez asignado, el ID del apadrinado no puede cambiarse</p>
            <p>• <strong>Desasociar:</strong> Rompe el vínculo con donador actual, permite reasignación</p>
            <p>• <strong>Inactivar:</strong> Marca como no disponible para apadrinamiento</p>
            <p>• <strong>Editar:</strong> Permite modificar información personal y necesidades</p>
            <p>• <strong>Estados:</strong> Disponible → Apadrinado → Inactivo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
