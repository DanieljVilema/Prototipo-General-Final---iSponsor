'use client';

import { useRouter } from 'next/navigation';
import { Users, Plus, Edit, Eye } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';

export default function ApadrinadosPage() {
  const router = useRouter();
  const { apadrinados } = useDemoStore();

  // Filtrar apadrinados de la casa hogar actual (simulado)
  const misApadrinados = apadrinados.filter(a => a.casaHogarId === 'u-ch1');

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Apadrinados</h1>
              <p className="text-gray-600">Administra la información de todos tus apadrinados</p>
            </div>
            <button
              onClick={() => router.push('/ch/apadrinados/nuevo')}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Registrar nuevo
            </button>
          </div>
        </div>

        {misApadrinados.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Users className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay apadrinados registrados</h3>
            <p className="text-gray-600 mb-6">Comienza registrando tu primer apadrinado</p>
            <button
              onClick={() => router.push('/ch/apadrinados/nuevo')}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors"
            >
              Registrar primer apadrinado
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header de tabla */}
            <div className="bg-gray-50 px-6 py-3 border-b">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-3">Nombre</div>
                <div className="col-span-2">Edad</div>
                <div className="col-span-1">Género</div>
                <div className="col-span-3">Necesidad</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-1">Acciones</div>
              </div>
            </div>

            {/* Filas */}
            <div className="divide-y">
              {misApadrinados.map((apadrinado) => (
                <div key={apadrinado.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {apadrinado.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{apadrinado.nombre}</p>
                          <p className="text-xs text-gray-500">ID: {apadrinado.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-gray-900">{apadrinado.edad} años</span>
                    </div>
                    
                    <div className="col-span-1">
                      <span className="text-gray-600">
                        {apadrinado.genero === 'M' ? 'Niño' : 'Niña'}
                      </span>
                    </div>
                    
                    <div className="col-span-3">
                      <span className="text-gray-900">{apadrinado.necesidad}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <StateChip estado={apadrinado.estado} size="sm" />
                    </div>
                    
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/detalle/${apadrinado.id}`)}
                          className="p-1 text-gray-600 hover:text-blue-600 rounded"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => router.push(`/ch/apadrinados/${apadrinado.id}`)}
                          className="p-1 text-gray-600 hover:text-green-600 rounded"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Gestión de Apadrinados</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Registra nuevos apadrinados con toda su información</p>
            <p>• Actualiza el estado de los apadrinados (Activo, Autosuficiente, Inactivo)</p>
            <p>• Sube medios y documentos relacionados</p>
            <p>• Todas las acciones quedan registradas en la auditoría</p>
          </div>
        </div>
      </div>
    </div>
  );
}
