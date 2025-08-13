'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, User, Download, Filter, Search, Plus, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function DonacionesCasaHogarPage() {
  const { apadrinamientos, apadrinados, addAudit } = useDemoStore();
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    apadrinado: '',
    metodo: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  
  const [showRegistroModal, setShowRegistroModal] = useState(false);
  const [registroDonacion, setRegistroDonacion] = useState({
    apadrinadoId: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    metodo: '',
    referencia: '',
    notas: ''
  });

  // Simular donaciones de la casa hogar actual
  const misApadrinados = apadrinados.filter(a => a.casaHogarId === 'u-ch1');
  const misApadrinamientos = apadrinamientos.filter(ap => 
    misApadrinados.some(a => a.id === ap.apadrinadoId)
  );

  // Generar historial de donaciones simulado
  const generarDonaciones = () => {
    const donaciones: any[] = [];
    misApadrinamientos.forEach(ap => {
      const apadrinado = misApadrinados.find(a => a.id === ap.apadrinadoId);
      const mesesHistorial = 6;
      
      for (let i = 0; i < mesesHistorial; i++) {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - i);
        
        // Simular algunas donaciones perdidas ocasionalmente
        const recibida = Math.random() > 0.1; // 90% de probabilidad de recibir donación
        
        donaciones.push({
          id: `don-${ap.id}-${i}`,
          apadrinadoId: ap.apadrinadoId,
          apadrinadoNombre: apadrinado?.nombre || 'N/A',
          donadorId: ap.donadorId,
          monto: ap.monto,
          fechaProgramada: fecha.toISOString(),
          fechaRecibida: recibida ? fecha.toISOString() : null,
          estado: recibida ? 'Recibida' : 'Pendiente',
          metodo: ['Transferencia', 'Tarjeta de Crédito', 'PayPal'][Math.floor(Math.random() * 3)],
          referencia: recibida ? `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
          notas: recibida ? null : 'Donación no recibida en la fecha programada'
        });
      }
    });
    
    return donaciones.sort((a, b) => new Date(b.fechaProgramada).getTime() - new Date(a.fechaProgramada).getTime());
  };

  const donaciones = generarDonaciones();

  const donacionesFiltradas = donaciones.filter(donacion => {
    const cumpleBusqueda = !filtros.busqueda || 
      donacion.apadrinadoNombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      donacion.referencia?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const cumpleEstado = !filtros.estado || donacion.estado === filtros.estado;
    const cumpleApadrinado = !filtros.apadrinado || donacion.apadrinadoId === filtros.apadrinado;
    const cumpleMetodo = !filtros.metodo || donacion.metodo === filtros.metodo;
    
    return cumpleBusqueda && cumpleEstado && cumpleApadrinado && cumpleMetodo;
  });

  const calcularEstadisticas = () => {
    const totalRecibido = donaciones
      .filter(d => d.estado === 'Recibida')
      .reduce((sum, d) => sum + d.monto, 0);
    
    const totalPendiente = donaciones
      .filter(d => d.estado === 'Pendiente')
      .reduce((sum, d) => sum + d.monto, 0);
    
    const donacionesRecibidas = donaciones.filter(d => d.estado === 'Recibida').length;
    const donacionesPendientes = donaciones.filter(d => d.estado === 'Pendiente').length;
    
    const fechaActual = new Date();
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const donacionesEsteMes = donaciones.filter(d => 
      d.estado === 'Recibida' && new Date(d.fechaRecibida) >= primerDiaMes
    );
    const totalEsteMes = donacionesEsteMes.reduce((sum, d) => sum + d.monto, 0);
    
    return {
      totalRecibido,
      totalPendiente,
      donacionesRecibidas,
      donacionesPendientes,
      totalEsteMes,
      totalDonaciones: donaciones.length
    };
  };

  const estadisticas = calcularEstadisticas();

  const registrarDonacionManual = () => {
    if (!registroDonacion.apadrinadoId || !registroDonacion.monto || !registroDonacion.fecha) {
      showToast('Complete todos los campos requeridos');
      return;
    }

    const apadrinado = misApadrinados.find(a => a.id === registroDonacion.apadrinadoId);
    
    // Simular registro de donación manual
    addAudit({
      actor: 'CasaHogar',
      accion: 'Registrar donación manual',
      entidad: 'Donación',
      resultado: 'OK',
      ref: `${registroDonacion.apadrinadoId} - $${registroDonacion.monto}`
    });

    showToast(`✅ Donación de $${registroDonacion.monto} registrada para ${apadrinado?.nombre}`);
    
    setRegistroDonacion({
      apadrinadoId: '',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      metodo: '',
      referencia: '',
      notas: ''
    });
    setShowRegistroModal(false);
  };

  const exportarReporte = () => {
    addAudit({
      actor: 'CasaHogar',
      accion: 'Exportar reporte donaciones',
      entidad: 'Reporte',
      resultado: 'OK',
      ref: 'donaciones'
    });

    showToast('📊 Generando reporte de donaciones...');
    
    // Simular descarga
    setTimeout(() => {
      showToast('📁 Reporte descargado exitosamente');
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Seguimiento de Donaciones</h1>
              <p className="text-gray-600">Monitorea y administra las donaciones recibidas</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportarReporte}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={20} />
                Exportar reporte
              </button>
              <button
                onClick={() => setShowRegistroModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Registrar donación
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.totalRecibido)}</p>
                <p className="text-gray-600 text-sm">Total recibido</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.totalPendiente)}</p>
                <p className="text-gray-600 text-sm">Pendientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas.totalEsteMes)}</p>
                <p className="text-gray-600 text-sm">Este mes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-purple-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.donacionesRecibidas}</p>
                <p className="text-gray-600 text-sm">Donaciones recibidas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de apadrinamientos activos */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Resumen de Apadrinamientos Activos</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {misApadrinamientos.slice(0, 3).map(ap => {
              const apadrinado = misApadrinados.find(a => a.id === ap.apadrinadoId);
              const donacionesApadrinado = donaciones.filter(d => d.apadrinadoId === ap.apadrinadoId);
              const recibidas = donacionesApadrinado.filter(d => d.estado === 'Recibida').length;
              const pendientes = donacionesApadrinado.filter(d => d.estado === 'Pendiente').length;
              
              return (
                <div key={ap.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {apadrinado?.nombre.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{apadrinado?.nombre}</h3>
                      <p className="text-sm text-gray-600">{formatCurrency(ap.monto)} mensuales</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recibidas:</span>
                      <span className="text-green-600 font-medium">{recibidas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pendientes:</span>
                      <span className="text-yellow-600 font-medium">{pendientes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Próximo pago:</span>
                      <span className="text-gray-900 text-xs">{ap.fechaPago}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {misApadrinamientos.length > 3 && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Y {misApadrinamientos.length - 3} apadrinamientos más...
              </p>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Apadrinado o referencia..."
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="Recibida">Recibida</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apadrinado</label>
              <select
                value={filtros.apadrinado}
                onChange={(e) => setFiltros({...filtros, apadrinado: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                {misApadrinados.map(apadrinado => (
                  <option key={apadrinado.id} value={apadrinado.id}>
                    {apadrinado.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
              <select
                value={filtros.metodo}
                onChange={(e) => setFiltros({...filtros, metodo: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFiltros({busqueda: '', estado: '', apadrinado: '', metodo: '', fechaDesde: '', fechaHasta: ''})}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Historial de donaciones */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Apadrinado</div>
              <div className="col-span-2">Monto</div>
              <div className="col-span-2">Fecha programada</div>
              <div className="col-span-2">Método</div>
              <div className="col-span-2">Referencia</div>
              <div className="col-span-1">Estado</div>
            </div>
          </div>

          {donacionesFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay donaciones</h3>
              <p className="text-gray-600">No hay donaciones que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {donacionesFiltradas.map((donacion) => (
                <div key={donacion.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium">{donacion.apadrinadoNombre}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="font-semibold text-green-600">{formatCurrency(donacion.monto)}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm">
                          {new Date(donacion.fechaProgramada).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">{donacion.metodo}</span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-sm font-mono text-gray-800">
                        {donacion.referencia || '-'}
                      </span>
                    </div>
                    
                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        donacion.estado === 'Recibida' ? 'bg-green-100 text-green-800' :
                        donacion.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {donacion.estado}
                      </span>
                    </div>
                  </div>
                  
                  {donacion.notas && (
                    <div className="mt-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      {donacion.notas}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de registro manual */}
        {showRegistroModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Registrar Donación Manual</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apadrinado *
                  </label>
                  <select
                    value={registroDonacion.apadrinadoId}
                    onChange={(e) => setRegistroDonacion({...registroDonacion, apadrinadoId: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar apadrinado</option>
                    {misApadrinados.map(apadrinado => (
                      <option key={apadrinado.id} value={apadrinado.id}>
                        {apadrinado.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto *
                  </label>
                  <input
                    type="number"
                    value={registroDonacion.monto}
                    onChange={(e) => setRegistroDonacion({...registroDonacion, monto: e.target.value})}
                    placeholder="0.00"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de recepción *
                  </label>
                  <input
                    type="date"
                    value={registroDonacion.fecha}
                    onChange={(e) => setRegistroDonacion({...registroDonacion, fecha: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de pago
                  </label>
                  <select
                    value={registroDonacion.metodo}
                    onChange={(e) => setRegistroDonacion({...registroDonacion, metodo: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar método</option>
                    <option value="Transferencia">Transferencia bancaria</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referencia/Número de transacción
                  </label>
                  <input
                    type="text"
                    value={registroDonacion.referencia}
                    onChange={(e) => setRegistroDonacion({...registroDonacion, referencia: e.target.value})}
                    placeholder="Número de referencia"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas adicionales
                  </label>
                  <textarea
                    value={registroDonacion.notas}
                    onChange={(e) => setRegistroDonacion({...registroDonacion, notas: e.target.value})}
                    rows={2}
                    placeholder="Información adicional sobre la donación..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRegistroModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={registrarDonacionManual}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Registrar donación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Información sobre el seguimiento de donaciones</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Donaciones automáticas:</strong> Se registran automáticamente cuando los donadores procesan sus pagos</p>
            <p>• <strong>Registro manual:</strong> Use esta opción para donaciones recibidas por otros medios (efectivo, cheque, etc.)</p>
            <p>• <strong>Alertas:</strong> Recibirá notificaciones cuando haya retrasos en los pagos programados</p>
            <p>• <strong>Reportes:</strong> Genere reportes mensuales para llevar control contable de las donaciones</p>
          </div>
        </div>
      </div>
    </div>
  );
}
