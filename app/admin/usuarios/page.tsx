'use client';

import { useState } from 'react';
import { Users, CheckCircle, XCircle, Pause, Play, Trash2, AlertCircle, Search, Plus, Edit, Lock, Unlock, UserCheck } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';
import { showToast } from '@/lib/toast';

export default function AdminUsuariosPage() {
  const { 
    usuarios, 
    casasHogar, 
    updateUsuario, 
    cuentaUsuarioSuspendida,
    logAudit 
  } = useDemoStore();
  
  const [showConfirmModal, setShowConfirmModal] = useState<{
    action: string;
    userId: string;
    userName: string;
  } | null>(null);

  // Filtrar solo Casas Hogar
  const casasHogarUsuarios = usuarios.filter(u => u.rol === 'CasaHogar');

  const handleAprobar = (userId: string) => {
    updateUsuario(userId, { estado: 'Aprobada' });
    
    logAudit({
      actor: 'Admin',
      accion: 'Aprobar Casa Hogar',
      entidad: 'usuario',
      resultado: 'Aprobado',
      ref: userId
    });

    showToast('Casa Hogar aprobada (simulado)');
    setTimeout(() => {
      showToast('Correo de confirmación enviado (simulado)');
    }, 1000);
    
    setShowConfirmModal(null);
  };

  const handleRechazar = (userId: string) => {
    updateUsuario(userId, { estado: 'Rechazada' });
    
    logAudit({
      actor: 'Admin',
      accion: 'Rechazar Casa Hogar',
      entidad: 'usuario',
      resultado: 'Rechazado',
      ref: userId
    });

    showToast('Casa Hogar rechazada (simulado)');
    setTimeout(() => {
      showToast('Correo con motivos enviado (simulado)');
    }, 1000);
    
    setShowConfirmModal(null);
  };

  const handleSuspender = (userId: string) => {
    updateUsuario(userId, { estado: 'Inactiva' });
    
    logAudit({
      actor: 'Admin',
      accion: 'Suspender usuario',
      entidad: 'usuario',
      resultado: 'OK',
      ref: userId
    });

    showToast('Usuario suspendido (simulado)');
    setTimeout(() => {
      showToast('Correo de notificación enviado (simulado)');
    }, 1000);
    
    setShowConfirmModal(null);
  };

  const handleDesbloquear = (userId: string) => {
    updateUsuario(userId, { estado: 'Aprobada' });
    
    logAudit({
      actor: 'Admin',
      accion: 'Desbloquear usuario',
      entidad: 'usuario',
      resultado: 'OK',
      ref: userId
    });

    showToast('Usuario desbloqueado (simulado)');
    setTimeout(() => {
      showToast('Correo de reactivación enviado (simulado)');
    }, 1000);
    
    setShowConfirmModal(null);
  };

  const handleEliminar = (userId: string) => {
    if (!cuentaUsuarioSuspendida) {
      showToast('Solo se pueden eliminar usuarios suspendidos (simulado)');
      return;
    }

    // En un caso real, aquí se eliminaría el usuario
    logAudit({
      actor: 'Admin',
      accion: 'Eliminar usuario',
      entidad: 'usuario',
      resultado: 'OK',
      ref: userId
    });

    showToast('Usuario eliminado (simulado)');
    setShowConfirmModal(null);
  };

  const confirmAction = (action: string, userId: string, userName: string) => {
    setShowConfirmModal({ action, userId, userName });
  };

  const executeAction = () => {
    if (!showConfirmModal) return;

    const { action, userId } = showConfirmModal;
    
    switch (action) {
      case 'aprobar':
        handleAprobar(userId);
        break;
      case 'rechazar':
        handleRechazar(userId);
        break;
      case 'suspender':
        handleSuspender(userId);
        break;
      case 'desbloquear':
        handleDesbloquear(userId);
        break;
      case 'eliminar':
        handleEliminar(userId);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra las Casas Hogar registradas en la plataforma</p>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{casasHogarUsuarios.length}</p>
                <p className="text-gray-600 text-sm">Total Casas Hogar</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {casasHogarUsuarios.filter(u => u.estado === 'Aprobada').length}
                </p>
                <p className="text-gray-600 text-sm">Aprobadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {casasHogarUsuarios.filter(u => u.estado === 'Pendiente').length}
                </p>
                <p className="text-gray-600 text-sm">Pendientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {casasHogarUsuarios.filter(u => u.estado === 'Rechazada' || u.estado === 'Inactiva').length}
                </p>
                <p className="text-gray-600 text-sm">Inactivas/Rechazadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Casa Hogar</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-4">Acciones</div>
            </div>
          </div>

          <div className="divide-y">
            {casasHogarUsuarios.map((usuario) => (
              <div key={usuario.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {usuario.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{usuario.nombre}</p>
                        <p className="text-xs text-gray-500">ID: {usuario.id}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <span className="text-gray-900">{usuario.email}</span>
                  </div>
                  
                  <div className="col-span-2">
                    <StateChip estado={usuario.estado || 'Pendiente'} size="sm" />
                  </div>
                  
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      {usuario.estado === 'Pendiente' && (
                        <>
                          <button
                            onClick={() => confirmAction('aprobar', usuario.id, usuario.nombre)}
                            className="p-1 text-green-600 hover:text-green-700 rounded"
                            title="Aprobar"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => confirmAction('rechazar', usuario.id, usuario.nombre)}
                            className="p-1 text-red-600 hover:text-red-700 rounded"
                            title="Rechazar"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      
                      {usuario.estado === 'Aprobada' && (
                        <button
                          onClick={() => confirmAction('suspender', usuario.id, usuario.nombre)}
                          className="p-1 text-yellow-600 hover:text-yellow-700 rounded"
                          title="Suspender"
                        >
                          <Pause size={16} />
                        </button>
                      )}
                      
                      {usuario.estado === 'Inactiva' && (
                        <button
                          onClick={() => confirmAction('desbloquear', usuario.id, usuario.nombre)}
                          className="p-1 text-green-600 hover:text-green-700 rounded"
                          title="Desbloquear"
                        >
                          <Play size={16} />
                        </button>
                      )}
                      
                      {cuentaUsuarioSuspendida && usuario.estado === 'Inactiva' && (
                        <button
                          onClick={() => confirmAction('eliminar', usuario.id, usuario.nombre)}
                          className="p-1 text-red-600 hover:text-red-700 rounded"
                          title="Eliminar (solo si suspendida)"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal de confirmación */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-orange-500" size={24} />
                <h3 className="text-lg font-semibold">Confirmar Acción</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas <strong>{showConfirmModal.action}</strong> a{' '}
                <strong>{showConfirmModal.userName}</strong>?
              </p>

              {showConfirmModal.action === 'aprobar' && (
                <div className="bg-green-50 p-3 rounded mb-4">
                  <p className="text-green-800 text-sm">
                    📧 Se enviará correo de confirmación (simulado)
                  </p>
                </div>
              )}

              {showConfirmModal.action === 'rechazar' && (
                <div className="bg-red-50 p-3 rounded mb-4">
                  <p className="text-red-800 text-sm">
                    📧 Se enviará correo con motivos del rechazo (simulado)
                  </p>
                </div>
              )}

              {(showConfirmModal.action === 'suspender' || showConfirmModal.action === 'desbloquear') && (
                <div className="bg-blue-50 p-3 rounded mb-4">
                  <p className="text-blue-800 text-sm">
                    📧 Se enviará correo de notificación (simulado)
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeAction}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
