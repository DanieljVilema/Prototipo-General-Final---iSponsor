'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MapPin, Calendar, User, FileText } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';

export default function DetallePage() {
  const params = useParams();
  const router = useRouter();
  const { apadrinados, casasHogar, informes, accesoInformes } = useDemoStore();
  
  const apadrinado = apadrinados.find(a => a.id === params.id);
  const casaHogar = apadrinado ? casasHogar.find(ch => ch.id === apadrinado.casaHogarId) : null;
  const informesApadrinado = informes.filter(inf => inf.apadrinadoId === params.id);

  if (!apadrinado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Candidato no encontrado</h1>
          <p className="text-gray-600 mb-4">El candidato que buscas no existe o ha sido removido</p>
          <button
            onClick={() => router.push('/explorar')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Volver a explorar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detalle del Candidato</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos Básicos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {apadrinado.nombre.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-semibold text-gray-900">{apadrinado.nombre}</h2>
                    <StateChip estado={apadrinado.estado} />
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{apadrinado.edad} años</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{apadrinado.genero === 'M' ? 'Niño' : 'Niña'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-red-500" />
                      <span>Necesidad principal: {apadrinado.necesidad}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TODO: Aquí iría más información detallada del apadrinado */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Información adicional</h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                  nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>

            {/* Casa Hogar */}
            {casaHogar && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Casa Hogar</h3>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{casaHogar.nombre}</h4>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <MapPin size={16} />
                      <span>{casaHogar.ubicacion}</span>
                    </div>
                    {casaHogar.descripcion && (
                      <p className="text-gray-600 mt-2">{casaHogar.descripcion}</p>
                    )}
                  </div>
                  <StateChip estado={casaHogar.estado} size="sm" />
                </div>
              </div>
            )}

            {/* Informes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={20} />
                Informes de progreso
              </h3>
              
              {!accesoInformes ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-gray-600">Sin acceso a informes (simulado)</p>
                </div>
              ) : informesApadrinado.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-gray-600">No hay informes disponibles aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {informesApadrinado.map((informe) => (
                    <div key={informe.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{informe.titulo}</h4>
                        <StateChip estado={informe.estado} size="sm" />
                      </div>
                      {informe.resumen && (
                        <p className="text-gray-600 text-sm">{informe.resumen}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Acciones */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Acciones</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/apadrinar/${apadrinado.id}`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Apadrinar
                </button>
                <button
                  onClick={() => router.push('/explorar')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Ver otros candidatos
                </button>
              </div>
            </div>

            {/* Información de Apadrinamiento */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">¿Cómo funciona?</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                  <span>Selecciona al candidato que deseas apadrinar</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                  <span>Configura el monto y método de pago</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                  <span>Recibe informes mensuales del progreso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
