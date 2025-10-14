'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Save, 
  Lock, 
  Eye, 
  EyeOff,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Heart
} from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function PerfilDonadorPage() {
  const router = useRouter();
  const { addAudit } = useDemoStore();
  
  // Datos simulados del donador actual
  const donadorActual = {
    id: 'u-don1',
    nombre: 'Ana',
    apellido: 'Pérez',
    email: 'ana@demo.com',
    telefono: '+1 (555) 123-4567',
    fechaNacimiento: '1985-03-15',
    fechaRegistro: '2024-01-15',
    apadrinamientosActivos: 2,
    totalDonado: 850
  };

  const [editando, setEditando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: donadorActual.nombre,
    apellido: donadorActual.apellido,
    email: donadorActual.email,
    telefono: donadorActual.telefono,
    fechaNacimiento: donadorActual.fechaNacimiento,
    
    // Configuración de cuenta
    passwordActual: '',
    passwordNuevo: '',
    passwordConfirmar: '',
    
    // Preferencias
    notificacionesEmail: true,
    notificacionesPush: false,
    visibilidadPerfil: 'privado',
    recibirNewsletters: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardarCambios = () => {
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.email.trim()) {
      showToast('Nombre, apellido y email son campos requeridos');
      return;
    }

    if (formData.passwordNuevo && formData.passwordNuevo !== formData.passwordConfirmar) {
      showToast('Las contraseñas nuevas no coinciden');
      return;
    }

    // Simular actualización
    addAudit({
      actor: 'Donador',
      accion: 'Actualizar perfil',
      entidad: 'Usuario',
      resultado: 'OK',
      ref: donadorActual.id
    });

    if (formData.passwordNuevo) {
      addAudit({
        actor: 'Donador',
        accion: 'Cambiar contraseña',
        entidad: 'Cuenta',
        resultado: 'OK',
        ref: donadorActual.id
      });
      showToast('✅ Perfil actualizado y contraseña cambiada exitosamente');
    } else {
      showToast('✅ Perfil actualizado exitosamente');
    }

    setEditando(false);
    
    // Limpiar campos de contraseña
    setFormData(prev => ({
      ...prev,
      passwordActual: '',
      passwordNuevo: '',
      passwordConfirmar: ''
    }));
  };

  const cancelarEdicion = () => {
    // Restaurar datos originales
    setFormData({
      nombre: donadorActual.nombre,
      apellido: donadorActual.apellido,
      email: donadorActual.email,
      telefono: donadorActual.telefono,
      fechaNacimiento: donadorActual.fechaNacimiento,
      passwordActual: '',
      passwordNuevo: '',
      passwordConfirmar: '',
      notificacionesEmail: true,
      notificacionesPush: false,
      visibilidadPerfil: 'privado',
      recibirNewsletters: true
    });
    setEditando(false);
  };


  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const { setRolActual } = useDemoStore();
  const handleLogout = async () => {
    setCerrandoSesion(true);
    await supabase.auth.signOut();
    setRolActual(undefined);
    showToast('Sesión cerrada correctamente');
    router.push('/');
    setCerrandoSesion(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
              <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
            </div>
            
            <div className="flex items-center gap-4">
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Edit size={16} />
                  Editar perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={cancelarEdicion}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGuardarCambios}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Save size={16} />
                    Guardar cambios
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Información básica */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos personales */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={20} />
                Información Personal
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Seguridad de cuenta */}
            {editando && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lock size={20} />
                  Seguridad de la Cuenta
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarPassword ? "text" : "password"}
                        name="passwordActual"
                        value={formData.passwordActual}
                        onChange={handleInputChange}
                        placeholder="Ingresa tu contraseña actual"
                        className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        name="passwordNuevo"
                        value={formData.passwordNuevo}
                        onChange={handleInputChange}
                        placeholder="Nueva contraseña (opcional)"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar nueva contraseña
                      </label>
                      <input
                        type="password"
                        name="passwordConfirmar"
                        value={formData.passwordConfirmar}
                        onChange={handleInputChange}
                        placeholder="Repite la nueva contraseña"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-yellow-800 text-sm">
                      Deja estos campos vacíos si no deseas cambiar tu contraseña.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Preferencias */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings size={20} />
                Preferencias
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificaciones por email</h3>
                    <p className="text-sm text-gray-600">Recibir actualizaciones de apadrinamientos</p>
                  </div>
                  <input
                    type="checkbox"
                    name="notificacionesEmail"
                    checked={formData.notificacionesEmail}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificaciones push</h3>
                    <p className="text-sm text-gray-600">Recibir alertas en tiempo real</p>
                  </div>
                  <input
                    type="checkbox"
                    name="notificacionesPush"
                    checked={formData.notificacionesPush}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Newsletter</h3>
                    <p className="text-sm text-gray-600">Recibir noticias y actualizaciones</p>
                  </div>
                  <input
                    type="checkbox"
                    name="recibirNewsletters"
                    checked={formData.recibirNewsletters}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                {editando && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacidad del perfil
                    </label>
                    <select
                      name="visibilidadPerfil"
                      value={formData.visibilidadPerfil}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="publico">Público</option>
                      <option value="limitado">Solo casas hogar</option>
                      <option value="privado">Privado</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Resumen de cuenta */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Resumen de Cuenta</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Miembro desde:</span>
                  <span className="text-gray-900">
                    {new Date(donadorActual.fechaRegistro).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Apadrinamientos activos:</span>
                  <span className="text-blue-600 font-semibold">{donadorActual.apadrinamientosActivos}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total donado:</span>
                  <span className="text-green-600 font-semibold">${donadorActual.totalDonado}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estado:</span>
                  <span className="text-green-600">Activo</span>
                </div>
              </div>
            </div>

            {/* Accesos rápidos y cerrar sesión */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Accesos Rápidos</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/mis-apadrinamientos')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Heart size={16} className="text-red-500" />
                  <span>Mis Apadrinamientos</span>
                </button>
                <button
                  onClick={() => router.push('/metodos')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CreditCard size={16} className="text-blue-500" />
                  <span>Métodos de Pago</span>
                </button>
                <button
                  onClick={() => router.push('/informes')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell size={16} className="text-green-500" />
                  <span>Informes Recibidos</span>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={cerrandoSesion}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-700 font-semibold"
                >
                  <Lock size={16} className="text-red-500" />
                  <span>{cerrandoSesion ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
                </button>
              </div>
            </div>

            {/* Información de seguridad */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-blue-600" />
                <h3 className="font-semibold text-blue-900">Información de Seguridad</h3>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• Mantén tu información actualizada para recibir comunicaciones importantes</p>
                <p>• Cambia tu contraseña regularmente</p>
                <p>• Revisa tu configuración de privacidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
