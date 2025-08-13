'use client';

import { useState } from 'react';
import { MessageCircle, Send, User, Clock, Search, Filter, AlertCircle } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function MensajeriaPage() {
  const { mensajes, addMensaje, addAudit } = useDemoStore();
  
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    tipo: ''
  });
  const [moderacionActiva] = useState(true); // Simulando moderación activa

  // Agrupar mensajes por conversación
  const conversaciones = mensajes.reduce((acc: any, mensaje: any) => {
    const conversacionId = mensaje.conversacionId;
    if (!acc[conversacionId]) {
      acc[conversacionId] = [];
    }
    acc[conversacionId].push(mensaje);
    return acc;
  }, {});

  // Obtener lista de conversaciones con último mensaje
  const listaConversaciones = Object.keys(conversaciones).map(id => {
    const mensajesConv = conversaciones[id];
    const ultimoMensaje = mensajesConv[mensajesConv.length - 1];
    const noLeidos = mensajesConv.filter((m: any) => !m.leido && m.emisor !== 'Usuario').length;
    
    return {
      id,
      ultimoMensaje,
      mensajes: mensajesConv,
      noLeidos,
      participantes: [...new Set(mensajesConv.map((m: any) => m.emisor))]
    };
  });

  const conversacionesFiltradas = listaConversaciones.filter(conv => {
    const cumpleBusqueda = !filtros.busqueda || 
      conv.ultimoMensaje.contenido.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      conv.participantes.some((p: string) => p.toLowerCase().includes(filtros.busqueda.toLowerCase()));
    
    return cumpleBusqueda;
  });

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim() || !conversacionActiva) return;

    // Simular moderación
    const palabrasProhibidas = ['contacto', 'telefono', 'email', 'whatsapp', 'dirección'];
    const contienePalabraProhibida = palabrasProhibidas.some(palabra => 
      nuevoMensaje.toLowerCase().includes(palabra)
    );

    if (contienePalabraProhibida) {
      showToast('Mensaje bloqueado: No se permite compartir información de contacto personal');
      addAudit({
        ts: new Date().toISOString(),
        actor: 'Sistema Moderación',
        accion: 'Bloquear mensaje',
        entidad: 'Mensaje',
        resultado: 'BLOCKED',
        ref: conversacionActiva
      });
      return;
    }

    const mensaje = {
      id: `msg-${Date.now()}`,
      conversacionId: conversacionActiva,
      emisor: 'Usuario',
      receptor: 'Casa Hogar',
      contenido: nuevoMensaje,
      fecha: new Date().toISOString(),
      leido: false,
      moderado: true,
      tipo: 'texto'
    };

    addMensaje(mensaje);
    
    addAudit({
      ts: new Date().toISOString(),
      actor: 'Usuario',
      accion: 'Enviar mensaje',
      entidad: 'Mensaje',
      resultado: 'OK',
      ref: mensaje.id
    });

    setNuevoMensaje('');
    showToast('Mensaje enviado exitosamente');

    // Simular respuesta automática de la casa hogar
    setTimeout(() => {
      const respuesta = {
        id: `msg-${Date.now()}-resp`,
        conversacionId: conversacionActiva,
        emisor: 'Casa Hogar Esperanza',
        receptor: 'Usuario',
        contenido: 'Gracias por tu mensaje. Te responderemos pronto con más detalles.',
        fecha: new Date().toISOString(),
        leido: false,
        moderado: true,
        tipo: 'texto'
      };
      addMensaje(respuesta);
    }, 2000);
  };

  const iniciarConversacion = () => {
    const nuevaConversacion = `conv-${Date.now()}`;
    setConversacionActiva(nuevaConversacion);
    
    // Mensaje inicial del sistema
    const mensajeBienvenida = {
      id: `msg-${Date.now()}-bienvenida`,
      conversacionId: nuevaConversacion,
      emisor: 'Sistema',
      receptor: 'Usuario',
      contenido: 'Bienvenido al sistema de mensajería moderada. Puedes comunicarte con las casas hogar respetando las normas de uso.',
      fecha: new Date().toISOString(),
      leido: true,
      moderado: true,
      tipo: 'sistema'
    };
    
    addMensaje(mensajeBienvenida);
  };

  const mensajesConversacionActiva = conversacionActiva ? conversaciones[conversacionActiva] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensajería Moderada</h1>
          <p className="text-gray-600">Comunícate de forma segura con las casas hogar</p>
        </div>

        {/* Aviso de moderación */}
        {moderacionActiva && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Sistema de Moderación Activo</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Todos los mensajes son revisados automáticamente</p>
                  <p>• No se permite compartir información de contacto personal</p>
                  <p>• Las conversaciones están centradas en el bienestar de los niños</p>
                  <p>• Respuesta promedio: 24-48 horas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lista de conversaciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Conversaciones</h2>
                  <button
                    onClick={iniciarConversacion}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Nueva
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar conversaciones..."
                    value={filtros.busqueda}
                    onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {conversacionesFiltradas.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-gray-600 text-sm">No hay conversaciones</p>
                    <button
                      onClick={iniciarConversacion}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Iniciar primera conversación
                    </button>
                  </div>
                ) : (
                  conversacionesFiltradas.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => setConversacionActiva(conv.id)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        conversacionActiva === conv.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">{conv.participantes.join(', ')}</p>
                        {conv.noLeidos > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conv.noLeidos}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm truncate">{conv.ultimoMensaje.contenido}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={12} className="text-gray-400" />
                        <p className="text-xs text-gray-500">
                          {new Date(conv.ultimoMensaje.fecha).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Área de chat */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm h-96 flex flex-col">
              {!conversacionActiva ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="mx-auto mb-4 text-gray-300" size={64} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una conversación</h3>
                    <p className="text-gray-600 mb-4">Elige una conversación existente o inicia una nueva</p>
                    <button
                      onClick={iniciarConversacion}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Nueva conversación
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header del chat */}
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Conversación #{conversacionActiva.slice(-4)}</h3>
                    <p className="text-sm text-gray-600">Mensajería moderada activa</p>
                  </div>

                  {/* Mensajes */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mensajesConversacionActiva.map((mensaje: any) => (
                      <div
                        key={mensaje.id}
                        className={`flex ${mensaje.emisor === 'Usuario' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            mensaje.emisor === 'Usuario'
                              ? 'bg-blue-600 text-white'
                              : mensaje.tipo === 'sistema'
                              ? 'bg-gray-100 text-gray-700 text-center italic'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {mensaje.emisor !== 'Usuario' && mensaje.tipo !== 'sistema' && (
                            <div className="flex items-center gap-2 mb-1">
                              <User size={14} />
                              <span className="text-xs font-medium">{mensaje.emisor}</span>
                            </div>
                          )}
                          <p className="text-sm">{mensaje.contenido}</p>
                          <p className={`text-xs mt-1 ${
                            mensaje.emisor === 'Usuario' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(mensaje.fecha).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de mensaje */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                        placeholder="Escribe tu mensaje... (moderado automáticamente)"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={enviarMensaje}
                        disabled={!nuevoMensaje.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Send size={16} />
                        Enviar
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Los mensajes son moderados. No compartas información de contacto personal.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Normas de uso */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-amber-900 mb-3">Normas de Uso del Sistema de Mensajería</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-800">
            <div>
              <h4 className="font-medium mb-2">Permitido:</h4>
              <ul className="space-y-1">
                <li>• Preguntas sobre el progreso del niño</li>
                <li>• Consultas sobre necesidades específicas</li>
                <li>• Coordinar visitas autorizadas</li>
                <li>• Compartir mensajes de apoyo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">No permitido:</h4>
              <ul className="space-y-1">
                <li>• Intercambio de datos de contacto personal</li>
                <li>• Solicitudes de información privada</li>
                <li>• Comunicación fuera de la plataforma</li>
                <li>• Contenido inapropiado o ofensivo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
