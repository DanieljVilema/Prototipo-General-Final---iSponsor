'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function MetodosPage() {
  const router = useRouter();
  const { metodosPago, removeMetodoPago, logAudit } = useDemoStore();
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  // Filtrar métodos del usuario actual (simulado)
  const misMetodos = metodosPago.filter(m => m.donadorId === 'u-don1');

  const handleAddMethod = () => {
    // Log audit
    logAudit({
      actor: 'Donador',
      accion: 'Iniciar agregar método de pago',
      entidad: 'metodo_pago',
      resultado: 'Pendiente'
    });

    router.push('/metodos/nuevo');
  };

  const handleDeleteMethod = (metodoId: string) => {
    const metodo = misMetodos.find(m => m.id === metodoId);
    
    if (metodo?.enUso) {
      showToast('Método en uso: eliminación bloqueada (simulado)');
      setShowDeleteModal(null);
      return;
    }

    // Eliminar método
    removeMetodoPago(metodoId);
    
    // Log audit
    logAudit({
      actor: 'Donador',
      accion: 'Eliminar método de pago',
      entidad: 'metodo_pago',
      resultado: 'OK',
      ref: metodoId
    });

    showToast('Método de pago eliminado (simulado)');
    setShowDeleteModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Métodos de Pago</h1>
          <p className="text-gray-600">Gestiona tus métodos de pago para apadrinamientos</p>
        </div>

        {/* Agregar método */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold mb-1">Agregar nuevo método</h2>
              <p className="text-gray-600 text-sm">Agrega una tarjeta de crédito o débito para tus apadrinamientos</p>
            </div>
            <button
              onClick={handleAddMethod}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Agregar método
            </button>
          </div>
        </div>

        {/* Lista de métodos */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Mis métodos de pago</h2>
          </div>

          {misMetodos.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes métodos de pago</h3>
              <p className="text-gray-600 mb-6">Agrega tu primer método de pago para poder realizar apadrinamientos</p>
              <button
                onClick={handleAddMethod}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
              >
                Agregar método
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {misMetodos.map((metodo) => (
                <div key={metodo.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                        <CreditCard className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{metodo.brand}</span>
                          <span className="text-gray-600">•••• •••• •••• {metodo.last4}</span>
                          {metodo.enUso && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              En uso
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Token: {metodo.token}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDeleteModal(metodo.id)}
                        className={`p-2 rounded-md transition-colors ${
                          metodo.enUso 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        }`}
                        disabled={metodo.enUso}
                        title={metodo.enUso ? 'No se puede eliminar: método en uso' : 'Eliminar método'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {metodo.enUso && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-blue-800 text-sm">
                        Este método está siendo usado en apadrinamientos activos y no se puede eliminar.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500" size={24} />
                <h3 className="text-lg font-semibold">Eliminar Método de Pago</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar este método de pago? Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteMethod(showDeleteModal)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información de seguridad */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Información de Seguridad</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Todos los datos de pago están encriptados y seguros</p>
            <p>• No almacenamos información completa de tarjetas</p>
            <p>• Los pagos son procesados de forma segura</p>
            <p>• Puedes cancelar o cambiar métodos en cualquier momento</p>
          </div>
        </div>
      </div>
    </div>
  );
}
