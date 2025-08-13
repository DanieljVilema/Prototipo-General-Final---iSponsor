'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Upload, Lock } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';
import { showToast } from '@/lib/toast';

export default function EditarApadrinadoPage() {
  const params = useParams();
  const router = useRouter();
  const { apadrinados, updateApadrinado, logAudit } = useDemoStore();
  
  const apadrinado = apadrinados.find(a => a.id === params.id);
  
  const [formData, setFormData] = useState({
    nombre: apadrinado?.nombre || '',
    edad: apadrinado?.edad.toString() || '',
    genero: apadrinado?.genero || 'M' as 'M' | 'F',
    necesidad: apadrinado?.necesidad || '',
    estado: apadrinado?.estado || 'Activo'
  });

  const [foto, setFoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apadrinado) return;

    const datosActualizados = {
      nombre: formData.nombre,
      edad: parseInt(formData.edad),
      genero: formData.genero,
      necesidad: formData.necesidad,
      estado: formData.estado as any,
      foto: foto ? `foto_${apadrinado.id}_updated.jpg` : apadrinado.foto
    };

    // Actualizar apadrinado
    updateApadrinado(apadrinado.id, datosActualizados);

    // Log audit
    logAudit({
      actor: 'CasaHogar',
      accion: 'Editar apadrinado',
      entidad: 'apadrinado',
      resultado: 'OK',
      ref: apadrinado.id
    });

    showToast('Apadrinado actualizado exitosamente (simulado)');
    router.push('/ch/apadrinados');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        showToast('El archivo es muy grande. Máximo 5MB');
        return;
      }
      setFoto(file);
      showToast('Foto cargada (simulado)');
    }
  };

  if (!apadrinado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Apadrinado no encontrado</h1>
          <button
            onClick={() => router.push('/ch/apadrinados')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Volver a la lista
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
          <h1 className="text-3xl font-bold text-gray-900">Editar Apadrinado</h1>
          <p className="text-gray-600">Actualiza la información de {apadrinado.nombre}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* ID bloqueado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del apadrinado
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={apadrinado.id}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <p className="text-xs text-gray-500 mt-1">El ID no se puede modificar</p>
            </div>

            {/* Información básica */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={20} />
                Información Básica
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edad *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={formData.edad}
                    onChange={(e) => setFormData({...formData, edad: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Género *
                  </label>
                  <select
                    value={formData.genero}
                    onChange={(e) => setFormData({...formData, genero: e.target.value as 'M' | 'F'})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Autosuficiente">Autosuficiente</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Necesidad principal *
                </label>
                <select
                  value={formData.necesidad}
                  onChange={(e) => setFormData({...formData, necesidad: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Alimentación">Alimentación</option>
                  <option value="Educación">Educación</option>
                  <option value="Salud">Salud</option>
                  <option value="Útiles escolares">Útiles escolares</option>
                  <option value="Vestimenta">Vestimenta</option>
                  <option value="Vivienda">Vivienda</option>
                </select>
              </div>
            </div>

            {/* Estado actual */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estado actual:</span>
                <StateChip estado={formData.estado as any} />
              </div>
            </div>

            {/* Foto */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload size={20} />
                Medios
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <label className="block">
                    <span className="text-sm text-gray-600">
                      {foto ? `Nuevo archivo: ${foto.name}` : 
                       apadrinado.foto ? `Archivo actual: ${apadrinado.foto}` : 
                       'Subir foto del apadrinado (opcional)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md cursor-pointer transition-colors">
                      {foto || apadrinado.foto ? 'Cambiar foto' : 'Seleccionar archivo'}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Máximo 5MB - JPG, PNG, GIF</p>
                </div>
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
