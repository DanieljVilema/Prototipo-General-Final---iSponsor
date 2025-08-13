'use client';

import { useState } from 'react';
import { AlertTriangle, RotateCcw, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';
import { showToast } from '@/lib/toast';

interface Fallo {
  id: string;
  tipo: string;
  descripcion: string;
  estado: 'Pendiente' | 'Resuelto' | 'Error';
  fecha: string;
  referencia?: string;
}

// Datos simulados de fallos
const fallosSimulados: Fallo[] = [
  {
    id: 'f1',
    tipo: 'Pago rechazado',
    descripcion: 'Error en procesamiento de pago mensual para apadrinamiento AP001',
    estado: 'Pendiente',
    fecha: '2024-01-15',
    referencia: 'ap1'
  },
  {
    id: 'f2',
    tipo: 'Notificación no enviada',
    descripcion: 'Fallo en el envío de correo de confirmación para nuevo registro',
    estado: 'Pendiente',
    fecha: '2024-01-14',
    referencia: 'u-ch2'
  },
  {
    id: 'f3',
    tipo: 'Error de validación',
    descripcion: 'Documento subido no pudo ser validado automáticamente',
    estado: 'Resuelto',
    fecha: '2024-01-12',
    referencia: 'a3'
  }
];

export default function AdminFallosPage() {
  const { logAudit } = useDemoStore();
  const [fallos, setFallos] = useState<Fallo[]>(fallosSimulados);

  const handleReintentar = (falloId: string) => {
    setFallos(prev => prev.map(f => 
      f.id === falloId 
        ? { ...f, estado: 'Resuelto' as const }
        : f
    ));

    logAudit({
      actor: 'Admin',
      accion: 'Reintentar proceso',
      entidad: 'fallo',
      resultado: 'OK',
      ref: falloId
    });

    showToast('Proceso reintentado (simulado)');
  };

  const handleMarcarResuelto = (falloId: string) => {
    setFallos(prev => prev.map(f => 
      f.id === falloId 
        ? { ...f, estado: 'Resuelto' as const }
        : f
    ));

    logAudit({
      actor: 'Admin',
      accion: 'Marcar fallo como resuelto',
      entidad: 'fallo',
      resultado: 'OK',
      ref: falloId
    });

    showToast('Fallo marcado como resuelto (simulado)');
  };

  const fallosPendientes = fallos.filter(f => f.estado === 'Pendiente');
  const fallosResueltos = fallos.filter(f => f.estado === 'Resuelto');

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Fallos</h1>
          <p className="text-gray-600">Monitorea y resuelve fallos del sistema</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{fallosPendientes.length}</p>
                <p className="text-gray-600 text-sm">Fallos pendientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{fallosResueltos.length}</p>
                <p className="text-gray-600 text-sm">Fallos resueltos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{fallos.length}</p>
                <p className="text-gray-600 text-sm">Total fallos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fallos pendientes */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-600" />
              Fallos Pendientes
            </h2>
          </div>

          {fallosPendientes.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay fallos pendientes</h3>
              <p className="text-gray-600">Todos los fallos han sido resueltos</p>
            </div>
          ) : (
            <div className="divide-y">
              {fallosPendientes.map((fallo) => (
                <div key={fallo.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{fallo.tipo}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          fallo.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          fallo.estado === 'Resuelto' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {fallo.estado}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-2">{fallo.descripcion}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Fecha: {fallo.fecha}</span>
                        {fallo.referencia && (
                          <span>Referencia: {fallo.referencia}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleReintentar(fallo.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                      >
                        <RotateCcw size={12} />
                        Reintentar
                      </button>
                      
                      <button
                        onClick={() => handleMarcarResuelto(fallo.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                      >
                        <CheckCircle size={12} />
                        Marcar resuelto
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial de fallos */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Historial de Fallos</h2>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto">
            {fallosResueltos.map((fallo) => (
              <div key={fallo.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">{fallo.tipo}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        fallo.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        fallo.estado === 'Resuelto' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {fallo.estado}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">{fallo.descripcion}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Resuelto: {fallo.fecha}</span>
                      {fallo.referencia && (
                        <span>Ref: {fallo.referencia}</span>
                      )}
                    </div>
                  </div>
                  <CheckCircle className="text-green-600" size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Información */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Gestión de Fallos</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Los fallos se detectan automáticamente por el sistema</p>
            <p>• Puedes reintentar procesos automáticamente o marcarlos como resueltos manualmente</p>
            <p>• Todas las acciones quedan registradas en la auditoría</p>
            <p>• Los fallos críticos requieren intervención inmediata</p>
          </div>
        </div>
      </div>
    </div>
  );
}
