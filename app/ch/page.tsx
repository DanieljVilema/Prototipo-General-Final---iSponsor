'use client';

import { useRouter } from 'next/navigation';
import { Home, Users, FileText, Plus, DollarSign } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';

export default function CasaHogarPage() {
  const router = useRouter();
  const { cuentaCHEstado, apadrinados, informes } = useDemoStore();

  // Filtrar datos de la casa hogar actual (simulado)
  const misApadrinados = apadrinados.filter(a => a.casaHogarId === 'u-ch1');
  const misInformes = informes.filter(inf => 
    misApadrinados.some(a => a.id === inf.apadrinadoId)
  );

  const informesPendientes = misInformes.filter(inf => inf.estado === 'Pendiente');

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Home size={32} className="text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel Casa Hogar</h1>
              <p className="text-gray-600">CH Rayito de Sol</p>
            </div>
          </div>
          <StateChip estado={cuentaCHEstado} size="lg" />
        </div>

        {/* Estado de la cuenta */}
        {cuentaCHEstado !== 'Aprobada' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-medium text-yellow-800">
                {cuentaCHEstado === 'Pendiente' && 'Tu cuenta está pendiente de aprobación'}
                {cuentaCHEstado === 'Rechazada' && 'Tu cuenta ha sido rechazada'}
                {cuentaCHEstado === 'Inactiva' && 'Tu cuenta está inactiva'}
              </span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Algunas funciones pueden estar limitadas hasta que tu cuenta sea aprobada.
            </p>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{misApadrinados.length}</p>
                <p className="text-gray-600 text-sm">Apadrinados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileText className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{misInformes.length}</p>
                <p className="text-gray-600 text-sm">Informes creados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileText className="text-yellow-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{informesPendientes.length}</p>
                <p className="text-gray-600 text-sm">Informes pendientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="text-purple-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600 text-sm">Donaciones registradas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold">Gestionar Apadrinados</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Registra nuevos apadrinados o edita la información existente
            </p>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/ch/apadrinados')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Ver todos
              </button>
              <button
                onClick={() => router.push('/ch/apadrinados/nuevo')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Registrar nuevo
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold">Informes de Progreso</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Crea informes sobre el progreso de tus apadrinados
            </p>
            <button
              onClick={() => router.push('/ch/informes/nuevo')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Crear informe
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold">Registrar Donación</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Registra donaciones recibidas de apadrinamientos
            </p>
            <button
              onClick={() => {
                // TODO: Implementar modal o página de registro de donación
                alert('Funcionalidad en desarrollo - Registro de donación (simulado)');
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Registrar donación (simulado)
            </button>
          </div>
        </div>

        {/* Apadrinados recientes */}
        {misApadrinados.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Apadrinados Recientes</h2>
                <button
                  onClick={() => router.push('/ch/apadrinados')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Ver todos
                </button>
              </div>
            </div>
            <div className="divide-y">
              {misApadrinados.slice(0, 3).map((apadrinado) => (
                <div key={apadrinado.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {apadrinado.nombre.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{apadrinado.nombre}</h3>
                        <p className="text-gray-600 text-sm">
                          {apadrinado.edad} años • {apadrinado.necesidad}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StateChip estado={apadrinado.estado} size="sm" />
                      <button
                        onClick={() => router.push(`/ch/apadrinados/${apadrinado.id}`)}
                        className="text-blue-600 hover:text-blue-700 text-sm mt-1 block"
                      >
                        Editar
                      </button>
                    </div>
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
