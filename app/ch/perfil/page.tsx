'use client';

import { useState } from 'react';
import { Building2, User, Mail, Phone, Globe, MapPin, Calendar, Save, Edit, Lock, Eye, EyeOff } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function PerfilCasaHogarPage() {
  const { casasHogar, updateCasaHogar, addAudit } = useDemoStore();
  
  // Simular casa hogar actual
  const casaHogarActual = casasHogar.find(ch => ch.id === 'u-ch1') || casasHogar[0];
  
  const [editando, setEditando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: casaHogarActual?.nombre || '',
    representante: casaHogarActual?.representante || '',
    email: casaHogarActual?.email || '',
    telefono: casaHogarActual?.telefono || '',
    sitioWeb: casaHogarActual?.sitioWeb || '',
    ubicacion: casaHogarActual?.ubicacion || '',
    descripcion: casaHogarActual?.descripcion || '',
    fechaFundacion: casaHogarActual?.fechaFundacion || '',
    
    // Campos adicionales para el perfil
    direccion: '',
    codigoPostal: '',
    registroLegal: '',
    capacidadMaxima: '',
    serviciosOfrecidos: '',
    misionVision: '',
    
    // Configuración de cuenta
    passwordActual: '',
    passwordNuevo: '',
    passwordConfirmar: '',
    notificacionesEmail: true,
    visibilidadPerfil: 'publico'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!formData.nombre.trim() || !formData.email.trim()) {
      showToast('Nombre y email son campos requeridos');
      return;
    }

    if (formData.passwordNuevo && formData.passwordNuevo !== formData.passwordConfirmar) {
      showToast('Las contraseñas nuevas no coinciden');
      return;
    }

    // Actualizar información básica
    updateCasaHogar(casaHogarActual.id, {
      nombre: formData.nombre,
      representante: formData.representante,
      email: formData.email,
      telefono: formData.telefono,
      sitioWeb: formData.sitioWeb,
      ubicacion: formData.ubicacion,
      descripcion: formData.descripcion,
      fechaFundacion: formData.fechaFundacion
    });

    // Log audit
    addAudit({
      actor: 'CasaHogar',
      accion: 'Actualizar perfil',
      entidad: 'Casa Hogar',
      resultado: 'OK',
      ref: casaHogarActual.id
    });

    if (formData.passwordNuevo) {
      addAudit({
        actor: 'CasaHogar',
        accion: 'Cambiar contraseña',
        entidad: 'Cuenta',
        resultado: 'OK',
        ref: casaHogarActual.id
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
      nombre: casaHogarActual?.nombre || '',
      representante: casaHogarActual?.representante || '',
      email: casaHogarActual?.email || '',
      telefono: casaHogarActual?.telefono || '',
      sitioWeb: casaHogarActual?.sitioWeb || '',
      ubicacion: casaHogarActual?.ubicacion || '',
      descripcion: casaHogarActual?.descripcion || '',
      fechaFundacion: casaHogarActual?.fechaFundacion || '',
      direccion: '',
      codigoPostal: '',
      registroLegal: '',
      capacidadMaxima: '',
      serviciosOfrecidos: '',
      misionVision: '',
      passwordActual: '',
      passwordNuevo: '',
      passwordConfirmar: '',
      notificacionesEmail: true,
      visibilidadPerfil: 'publico'
    });
    setEditando(false);
  };

  const fechaFundacion = new Date(casaHogarActual?.fechaFundacion || Date.now());
  const antiguedad = Math.floor((Date.now() - fechaFundacion.getTime()) / (1000 * 60 * 60 * 24 * 365));

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{casaHogarActual?.nombre}</h1>
                <p className="text-gray-600">Gestión de perfil y configuración de cuenta</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Fundada en {fechaFundacion.getFullYear()} ({antiguedad} años)
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    casaHogarActual?.estado === 'Aprobada' ? 'bg-green-100 text-green-800' :
                    casaHogarActual?.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {casaHogarActual?.estado}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
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
            {/* Datos generales */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 size={20} />
                Información General
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Casa Hogar *
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
                    Representante Legal
                  </label>
                  <input
                    type="text"
                    name="representante"
                    value={formData.representante}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email de contacto *
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sitio web
                  </label>
                  <input
                    type="url"
                    name="sitioWeb"
                    value={formData.sitioWeb}
                    onChange={handleInputChange}
                    disabled={!editando}
                    placeholder="https://ejemplo.com"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de fundación
                  </label>
                  <input
                    type="date"
                    name="fechaFundacion"
                    value={formData.fechaFundacion}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  disabled={!editando}
                  placeholder="Ciudad, País"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de la Casa Hogar
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  disabled={!editando}
                  rows={4}
                  placeholder="Describe la misión, visión y servicios de tu casa hogar..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Información Adicional
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección completa
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    disabled={!editando}
                    placeholder="Calle, número, sector..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código postal
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registro legal/RUC
                  </label>
                  <input
                    type="text"
                    name="registroLegal"
                    value={formData.registroLegal}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacidad máxima
                  </label>
                  <input
                    type="number"
                    name="capacidadMaxima"
                    value={formData.capacidadMaxima}
                    onChange={handleInputChange}
                    disabled={!editando}
                    placeholder="Número de niños"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicios ofrecidos
                </label>
                <textarea
                  name="serviciosOfrecidos"
                  value={formData.serviciosOfrecidos}
                  onChange={handleInputChange}
                  disabled={!editando}
                  rows={3}
                  placeholder="Educación, alimentación, salud, recreación..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                        placeholder="Mínimo 8 caracteres"
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
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Estado de la cuenta */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Estado de la Cuenta</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    casaHogarActual?.estado === 'Aprobada' ? 'bg-green-100 text-green-800' :
                    casaHogarActual?.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {casaHogarActual?.estado}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Registro:</span>
                  <span className="text-gray-900">Verificado</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Último acceso:</span>
                  <span className="text-gray-900 text-sm">Hoy</span>
                </div>
              </div>
            </div>

            {/* Configuración de privacidad */}
            {editando && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold mb-4">Configuración de Privacidad</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibilidad del perfil
                    </label>
                    <select
                      name="visibilidadPerfil"
                      value={formData.visibilidadPerfil}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="publico">Público</option>
                      <option value="limitado">Solo donadores</option>
                      <option value="privado">Privado</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notificacionesEmail"
                      checked={formData.notificacionesEmail}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">
                      Recibir notificaciones por email
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Información de ayuda */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">¿Necesitas ayuda?</h3>
              <p className="text-blue-800 text-sm mb-4">
                Si tienes problemas para actualizar tu perfil o necesitas asistencia técnica, contáctanos.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm">
                Contactar soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
