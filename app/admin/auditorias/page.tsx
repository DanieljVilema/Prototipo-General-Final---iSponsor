'use client';

import { useState } from 'react';
import { FileText, Filter, Calendar, User, Download } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { formatDateTime } from '@/lib/format';

export default function AdminAuditoriasPage() {
  const { auditoria, clearAudit } = useDemoStore();
  const [filterActor, setFilterActor] = useState<string>('');
  const [filterResultado, setFilterResultado] = useState<string>('');
  const [filterFecha, setFilterFecha] = useState<string>('');

  const filteredAuditoria = auditoria.filter((event) => {
    const actorMatch = !filterActor || event.actor === filterActor;
    const resultadoMatch = !filterResultado || event.resultado === filterResultado;
    const fechaMatch = !filterFecha || event.ts.startsWith(filterFecha);
    return actorMatch && resultadoMatch && fechaMatch;
  });

  const actores = Array.from(new Set(auditoria.map(e => e.actor)));
  const resultados = Array.from(new Set(auditoria.map(e => e.resultado)));

  const exportarAuditoria = () => {
    const csvData = [
      ['Fecha/Hora', 'Actor', 'Acción', 'Entidad', 'Resultado', 'Referencia'],
      ...filteredAuditoria.map(event => [
        formatDateTime(event.ts),
        event.actor,
        event.accion,
        event.entidad,
        event.resultado,
        event.ref || ''
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getResultadoColor = (resultado: string): string => {
    switch (resultado) {
      case 'Aprobado':
      case 'OK':
        return 'bg-green-100 text-green-800';
      case 'Rechazado':
      case 'Error':
        return 'bg-red-100 text-red-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Auditoría del Sistema</h1>
              <p className="text-gray-600">Historial completo de todas las acciones del sistema</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportarAuditoria}
                disabled={filteredAuditoria.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
              >
                <Download size={16} />
                Exportar CSV
              </button>
              <button
                onClick={clearAudit}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Limpiar auditoría
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{auditoria.length}</p>
                <p className="text-gray-600 text-sm">Total eventos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <User className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{actores.length}</p>
                <p className="text-gray-600 text-sm">Actores únicos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-purple-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {auditoria.length > 0 ? new Date(auditoria[auditoria.length - 1].ts).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-gray-600 text-sm">Último evento</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Filter className="text-orange-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredAuditoria.length}</p>
                <p className="text-gray-600 text-sm">Eventos filtrados</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Actor</label>
              <select
                value={filterActor}
                onChange={(e) => setFilterActor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los actores</option>
                {actores.map(actor => (
                  <option key={actor} value={actor}>{actor}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
              <select
                value={filterResultado}
                onChange={(e) => setFilterResultado(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los resultados</option>
                {resultados.map(resultado => (
                  <option key={resultado} value={resultado}>{resultado}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterActor('');
                  setFilterResultado('');
                  setFilterFecha('');
                }}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de auditoría */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-2">Fecha/Hora</div>
              <div className="col-span-2">Actor</div>
              <div className="col-span-3">Acción</div>
              <div className="col-span-2">Entidad</div>
              <div className="col-span-2">Resultado</div>
              <div className="col-span-1">Ref</div>
            </div>
          </div>

          {filteredAuditoria.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay eventos de auditoría</h3>
              <p className="text-gray-600">
                {auditoria.length === 0 
                  ? 'Aún no se han registrado eventos en el sistema'
                  : 'No hay eventos que coincidan con los filtros seleccionados'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {filteredAuditoria.slice().reverse().map((event, index) => (
                <div key={index} className="px-6 py-3 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center text-sm">
                    <div className="col-span-2">
                      <span className="text-gray-900">{formatDateTime(event.ts)}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="font-medium">{event.actor}</span>
                    </div>
                    
                    <div className="col-span-3">
                      <span className="text-gray-900">{event.accion}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-gray-600">{event.entidad}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getResultadoColor(event.resultado)}`}>
                        {event.resultado}
                      </span>
                    </div>
                    
                    <div className="col-span-1">
                      <span className="text-gray-500 text-xs">{event.ref || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Información de Auditoría</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Todos los eventos del sistema quedan registrados automáticamente</p>
            <p>• Los eventos incluyen acciones de usuarios, sistema y procesos automatizados</p>
            <p>• Puedes filtrar por actor, resultado o fecha para encontrar eventos específicos</p>
            <p>• Los datos se pueden exportar en formato CSV para análisis externo</p>
            <p>• La auditoría es crucial para compliance y resolución de problemas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
