'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, Calendar, CreditCard, Plus } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';
import { showToast } from '@/lib/toast';

export default function ApadrinarPage() {
  const params = useParams();
  const router = useRouter();
  const { 
    apadrinados, 
    casasHogar, 
    metodosPago, 
    addApadrinamiento,
    logAudit 
  } = useDemoStore();
  
  const [formData, setFormData] = useState({
    monto: '25',
    fechaPago: '15',
    metodoId: ''
  });

  const apadrinado = apadrinados.find(a => a.id === params.id);
  const casaHogar = apadrinado ? casasHogar.find(ch => ch.id === apadrinado.casaHogarId) : null;
  const metodosDisponibles = metodosPago.filter(m => m.donadorId === 'u-don1'); // TODO: Usuario actual

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.metodoId) {
      showToast('Selecciona un método de pago');
      return;
    }

    // Log audit
    logAudit({
      actor: 'Donador',
      accion: 'Iniciar apadrinamiento',
      entidad: 'apadrinamiento',
      resultado: 'Pendiente',
      ref: apadrinado?.id
    });

    // Crear URL de pasarela
    const pasarelaUrl = `/pasarela?context=apadrinamiento&id=${params.id}&monto=${formData.monto}&fechaPago=${formData.fechaPago}&metodoId=${formData.metodoId}`;
    
    showToast('Redirigiendo a pasarela de pago...');
    router.push(pasarelaUrl);
  };

  if (!apadrinado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Candidato no encontrado</h1>
          <button
            onClick={() => router.push('/explorar')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Volver a explorar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Configurar Apadrinamiento</h1>
        </div>

        {/* Información del candidato */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Candidato seleccionado</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {apadrinado.nombre.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-semibold">{apadrinado.nombre}</h3>
                <StateChip estado={apadrinado.estado} size="sm" />
              </div>
              <p className="text-gray-600">{apadrinado.edad} años • {apadrinado.necesidad}</p>
              {casaHogar && (
                <p className="text-gray-500 text-sm">{casaHogar.nombre} - {casaHogar.ubicacion}</p>
              )}
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Configuración de apadrinamiento</h2>
          
          <div className="space-y-6">
            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto mensual (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  min="10"
                  max="1000"
                  step="5"
                  value={formData.monto}
                  onChange={(e) => setFormData({...formData, monto: e.target.value})}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Monto mínimo: $10 USD</p>
            </div>

            {/* Fecha de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de pago mensual
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={formData.fechaPago}
                  onChange={(e) => setFormData({...formData, fechaPago: e.target.value})}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1 de cada mes</option>
                  <option value="5">5 de cada mes</option>
                  <option value="10">10 de cada mes</option>
                  <option value="15">15 de cada mes</option>
                  <option value="20">20 de cada mes</option>
                  <option value="25">25 de cada mes</option>
                  <option value="30">Último día del mes</option>
                </select>
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Método de pago
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/metodos')}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <Plus size={16} />
                  Agregar método
                </button>
              </div>
              
              {metodosDisponibles.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <CreditCard className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-gray-600 mb-3">No tienes métodos de pago registrados</p>
                  <button
                    type="button"
                    onClick={() => router.push('/metodos')}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Agregar método de pago
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {metodosDisponibles.map((metodo) => (
                    <label key={metodo.id} className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="metodo"
                        value={metodo.id}
                        checked={formData.metodoId === metodo.id}
                        onChange={(e) => setFormData({...formData, metodoId: e.target.value})}
                        className="text-blue-600"
                      />
                      <CreditCard size={20} className="text-gray-400" />
                      <div className="flex-1">
                        <span className="font-medium">{metodo.brand}</span>
                        <span className="text-gray-600"> •••• {metodo.last4}</span>
                        {metodo.enUso && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            En uso
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resumen */}
          {formData.metodoId && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-900 mb-2">Resumen del apadrinamiento</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>Candidato: {apadrinado.nombre}</p>
                <p>Monto: ${formData.monto} USD mensuales</p>
                <p>Fecha de pago: {formData.fechaPago} de cada mes</p>
                <p>Método: {metodosDisponibles.find(m => m.id === formData.metodoId)?.brand} •••• {metodosDisponibles.find(m => m.id === formData.metodoId)?.last4}</p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.metodoId || !formData.monto}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md transition-colors"
            >
              Pagar ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
