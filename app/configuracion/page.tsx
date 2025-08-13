'use client';

import { useState } from 'react';
import { Settings, User, Bell, Shield, Eye, Globe, Save, Check } from 'lucide-react';
import { showToast } from '@/lib/toast';

export default function ConfiguracionPage() {
  const [configuracion, setConfiguracion] = useState({
    // Preferencias de usuario
    nombre: 'Usuario Demo',
    email: 'usuario@demo.com',
    telefono: '+52 55 1234 5678',
    
    // Notificaciones
    notificacionesEmail: true,
    notificacionesSMS: false,
    informesNuevos: true,
    recordatoriosPago: true,
    actualizacionesCasaHogar: true,
    
    // Privacidad
    perfilPublico: false,
    mostrarDonaciones: false,
    permitirContactoCasasHogar: true,
    
    // Accesibilidad
    tamañoTexto: 'medio',
    contraste: 'normal',
    reducirAnimaciones: false,
    lecturaVoz: false,
    navegacionTeclado: false,
    
    // Idioma y región
    idioma: 'es',
    zona_horaria: 'America/Mexico_City',
    moneda: 'MXN'
  });

  const [guardando, setGuardando] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('perfil');

  const guardarConfiguracion = async () => {
    setGuardando(true);
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showToast('Configuración guardada exitosamente');
    setGuardando(false);
  };

  const actualizarConfiguracion = (campo: string, valor: any) => {
    setConfiguracion(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const secciones = [
    { id: 'perfil', nombre: 'Perfil', icono: User },
    { id: 'notificaciones', nombre: 'Notificaciones', icono: Bell },
    { id: 'privacidad', nombre: 'Privacidad', icono: Shield },
    { id: 'accesibilidad', nombre: 'Accesibilidad', icono: Eye },
    { id: 'idioma', nombre: 'Idioma y Región', icono: Globe }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia en iSponsor</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Navegación lateral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-1">
                {secciones.map(seccion => (
                  <button
                    key={seccion.id}
                    onClick={() => setSeccionActiva(seccion.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                      seccionActiva === seccion.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <seccion.icono size={20} />
                    {seccion.nombre}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Perfil */}
              {seccionActiva === 'perfil' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Información de Perfil</h2>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          value={configuracion.nombre}
                          onChange={(e) => actualizarConfiguracion('nombre', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correo electrónico
                        </label>
                        <input
                          type="email"
                          value={configuracion.email}
                          onChange={(e) => actualizarConfiguracion('email', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          value={configuracion.telefono}
                          onChange={(e) => actualizarConfiguracion('telefono', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-3">Foto de perfil</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="text-gray-400" size={32} />
                        </div>
                        <div>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                            Cambiar foto
                          </button>
                          <p className="text-sm text-gray-600 mt-1">JPG, PNG o GIF. Máximo 5MB.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notificaciones */}
              {seccionActiva === 'notificaciones' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Preferencias de Notificaciones</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Métodos de notificación</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.notificacionesEmail}
                            onChange={(e) => actualizarConfiguracion('notificacionesEmail', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Notificaciones por correo electrónico</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.notificacionesSMS}
                            onChange={(e) => actualizarConfiguracion('notificacionesSMS', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Notificaciones por SMS</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Tipos de notificación</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.informesNuevos}
                            onChange={(e) => actualizarConfiguracion('informesNuevos', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Nuevos informes de progreso</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.recordatoriosPago}
                            onChange={(e) => actualizarConfiguracion('recordatoriosPago', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Recordatorios de pago</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.actualizacionesCasaHogar}
                            onChange={(e) => actualizarConfiguracion('actualizacionesCasaHogar', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Actualizaciones de casa hogar</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacidad */}
              {seccionActiva === 'privacidad' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Configuración de Privacidad</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Visibilidad del perfil</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.perfilPublico}
                            onChange={(e) => actualizarConfiguracion('perfilPublico', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Perfil visible para otras casas hogar</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.mostrarDonaciones}
                            onChange={(e) => actualizarConfiguracion('mostrarDonaciones', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Mostrar historial de donaciones en perfil</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.permitirContactoCasasHogar}
                            onChange={(e) => actualizarConfiguracion('permitirContactoCasasHogar', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Permitir contacto directo de casas hogar</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-900 mb-2">Privacidad de datos</h4>
                      <p className="text-sm text-yellow-800 mb-3">
                        Tu información personal está protegida y nunca se comparte con terceros sin tu consentimiento.
                      </p>
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        Ver política de privacidad completa
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Accesibilidad */}
              {seccionActiva === 'accesibilidad' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Configuración de Accesibilidad</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Visualización</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tamaño de texto
                          </label>
                          <select
                            value={configuracion.tamañoTexto}
                            onChange={(e) => actualizarConfiguracion('tamañoTexto', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="pequeño">Pequeño</option>
                            <option value="medio">Medio</option>
                            <option value="grande">Grande</option>
                            <option value="extra-grande">Extra grande</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraste
                          </label>
                          <select
                            value={configuracion.contraste}
                            onChange={(e) => actualizarConfiguracion('contraste', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="normal">Normal</option>
                            <option value="alto">Alto contraste</option>
                            <option value="invertido">Colores invertidos</option>
                          </select>
                        </div>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.reducirAnimaciones}
                            onChange={(e) => actualizarConfiguracion('reducirAnimaciones', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Reducir animaciones y transiciones</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Asistencia</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.lecturaVoz}
                            onChange={(e) => actualizarConfiguracion('lecturaVoz', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Habilitar lectura por voz</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={configuracion.navegacionTeclado}
                            onChange={(e) => actualizarConfiguracion('navegacionTeclado', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2">Navegación mejorada por teclado</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Idioma y Región */}
              {seccionActiva === 'idioma' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Idioma y Configuración Regional</h2>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Idioma de la interfaz
                        </label>
                        <select
                          value={configuracion.idioma}
                          onChange={(e) => actualizarConfiguracion('idioma', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="es">Español</option>
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                          <option value="pt">Português</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Zona horaria
                        </label>
                        <select
                          value={configuracion.zona_horaria}
                          onChange={(e) => actualizarConfiguracion('zona_horaria', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                          <option value="America/Tijuana">Tijuana (GMT-8)</option>
                          <option value="America/Cancun">Cancún (GMT-5)</option>
                          <option value="America/New_York">Nueva York (GMT-5)</option>
                          <option value="Europe/Madrid">Madrid (GMT+1)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Moneda
                        </label>
                        <select
                          value={configuracion.moneda}
                          onChange={(e) => actualizarConfiguracion('moneda', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="MXN">Peso mexicano (MXN)</option>
                          <option value="USD">Dólar estadounidense (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                          <option value="CAD">Dólar canadiense (CAD)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón guardar */}
              <div className="mt-8 pt-6 border-t flex justify-end">
                <button
                  onClick={guardarConfiguracion}
                  disabled={guardando}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md transition-colors flex items-center gap-2"
                >
                  {guardando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
