'use client';

import { useState } from 'react';
import { FileText, X, Filter, Trash2 } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { formatDateTime } from '@/lib/format';
import { AuditEvent } from '@/src/demo/types';

export function AuditDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterActor, setFilterActor] = useState<string>('');
  const [filterResultado, setFilterResultado] = useState<string>('');
  
  const { auditoria, clearAudit } = useDemoStore();

  const filteredAuditoria = auditoria.filter((event) => {
    const actorMatch = !filterActor || event.actor === filterActor;
    const resultadoMatch = !filterResultado || event.resultado === filterResultado;
    return actorMatch && resultadoMatch;
  });

  const actores = Array.from(new Set(auditoria.map(e => e.actor)));
  const resultados = Array.from(new Set(auditoria.map(e => e.resultado)));

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Ver auditoría"
      >
        <FileText size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Auditoría del Sistema</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} />
              <span className="text-sm font-medium">Filtros</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <select
                value={filterActor}
                onChange={(e) => setFilterActor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">Todos los actores</option>
                {actores.map(actor => (
                  <option key={actor} value={actor}>{actor}</option>
                ))}
              </select>

              <select
                value={filterResultado}
                onChange={(e) => setFilterResultado(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">Todos los resultados</option>
                {resultados.map(resultado => (
                  <option key={resultado} value={resultado}>{resultado}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-600">
                {filteredAuditoria.length} de {auditoria.length} eventos
              </span>
              <button
                onClick={clearAudit}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 size={12} />
                Limpiar
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {filteredAuditoria.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FileText size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No hay eventos de auditoría</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredAuditoria.map((event, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getResultadoColor(event.resultado)}`}>
                        {event.resultado}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(event.ts)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{event.actor}</span>
                        <span className="text-gray-600"> → {event.accion}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Entidad: {event.entidad}
                        {event.ref && (
                          <span className="ml-2">Ref: {event.ref}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function getResultadoColor(resultado: AuditEvent['resultado']): string {
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
}
