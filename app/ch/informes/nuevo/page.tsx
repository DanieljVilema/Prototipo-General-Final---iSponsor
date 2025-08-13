'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Send } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function NuevoInformePage() {
  const router = useRouter();
  const { apadrinados, addInforme, logAudit } = useDemoStore();
  
  const [formData, setFormData] = useState({
    apadrinadoId: '',
    titulo: '',
    resumen: '',
    contenido: ''
  });

  // Filtrar apadrinados de la casa hogar actual (simulado)
  const misApadrinados = apadrinados.filter(a => a.casaHogarId === 'u-ch1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.apadrinadoId || !formData.titulo || !formData.resumen) {
      showToast('Por favor completa todos los campos obligatorios');
      return;
    }

    const nuevoInforme = {
      id: `inf${Date.now()}`,
      apadrinadoId: formData.apadrinadoId,
      titulo: formData.titulo,
      estado: 'Pendiente' as const,
      resumen: formData.resumen
    };

    // Guardar informe
    addInforme(nuevoInforme);

    // Log audit
    logAudit({
      actor: 'CasaHogar',
      accion: 'Crear informe',
      entidad: 'informe',
      resultado: 'Pendiente',
      ref: nuevoInforme.id
    });

    showToast('Informe enviado a revisión (simulado)');
    
    // Simular notificación
    setTimeout(() => {
      showToast('Notificación enviada a administradores (simulado)');
    }, 1000);

    router.push('/ch');
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Informe</h1>
          <p className="text-gray-600">Reporta el progreso de uno de tus apadrinados</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Selección de apadrinado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apadrinado *
              </label>
              <select
                value={formData.apadrinadoId}
                onChange={(e) => setFormData({...formData, apadrinadoId: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona un apadrinado</option>
                {misApadrinados.map((apadrinado) => (
                  <option key={apadrinado.id} value={apadrinado.id}>
                    {apadrinado.nombre} - {apadrinado.edad} años ({apadrinado.necesidad})
                  </option>
                ))}
              </select>
            </div>

            {/* Título del informe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del informe *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Informe mensual de Enero 2024"
                required
              />
            </div>

            {/* Resumen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resumen del progreso *
              </label>
              <textarea
                value={formData.resumen}
                onChange={(e) => setFormData({...formData, resumen: e.target.value})}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Breve resumen de los logros y actividades realizadas"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Este resumen será visible para los donadores</p>
            </div>

            {/* Contenido detallado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido detallado
              </label>
              <textarea
                value={formData.contenido}
                onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe en detalle el progreso, actividades realizadas, uso de recursos, etc."
              />
              <p className="text-xs text-gray-500 mt-1">Opcional: información adicional para revisión interna</p>
            </div>

            {/* Información del proceso */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FileText size={16} />
                Proceso de revisión
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>1. Tu informe será enviado a revisión por el equipo administrativo</p>
                <p>2. Una vez aprobado, será publicado y visible para los donadores</p>
                <p>3. Si es rechazado, recibirás comentarios para realizar ajustes</p>
                <p>4. Los donadores serán notificados cuando el informe esté disponible</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Enviar a revisión
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-6 bg-yellow-50 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Consejos para un buen informe</h3>
          <div className="space-y-2 text-sm text-yellow-800">
            <p>• Incluye logros específicos y medibles del apadrinado</p>
            <p>• Menciona cómo se utilizaron los recursos recibidos</p>
            <p>• Describe actividades educativas, de salud o desarrollo realizadas</p>
            <p>• Sé honesto sobre los desafíos y necesidades futuras</p>
            <p>• Incluye detalles que ayuden al donador a entender el impacto</p>
          </div>
        </div>
      </div>
    </div>
  );
}
