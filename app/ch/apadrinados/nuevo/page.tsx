'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Save, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function NuevoApadrinadoPage() {
  const router = useRouter();
  const { addApadrinado, addAudit } = useDemoStore();
  
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    genero: '',
    fechaNacimiento: '',
    necesidad: '',
    descripcion: '',
    historia: '',
    condicionMedica: '',
    escolaridad: '',
    gustos: '',
    foto: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.edad) {
      newErrors.edad = 'La edad es obligatoria';
    } else if (parseInt(formData.edad) < 0 || parseInt(formData.edad) > 18) {
      newErrors.edad = 'La edad debe estar entre 0 y 18 años';
    }

    if (!formData.genero) {
      newErrors.genero = 'El género es obligatorio';
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }

    if (!formData.necesidad.trim()) {
      newErrors.necesidad = 'La necesidad principal es obligatoria';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 50) {
      newErrors.descripcion = 'La descripción debe tener al menos 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Por favor corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);

    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));

      const nuevoApadrinado = {
        id: `ap-${Date.now()}`,
        nombre: formData.nombre,
        edad: parseInt(formData.edad),
        genero: formData.genero,
        fechaNacimiento: formData.fechaNacimiento,
        necesidad: formData.necesidad,
        descripcion: formData.descripcion,
        historia: formData.historia,
        condicionMedica: formData.condicionMedica,
        escolaridad: formData.escolaridad,
        gustos: formData.gustos,
        foto: formData.foto || `https://ui-avatars.com/api/?name=${formData.nombre}&background=random`,
        estado: 'Disponible',
        casaHogarId: 'u-ch1', // Casa hogar actual
        fechaRegistro: new Date().toISOString(),
        donadorId: null
      };

      addApadrinado(nuevoApadrinado);

      addAudit({
        ts: new Date().toISOString(),
        actor: 'Casa Hogar',
        accion: 'Registrar apadrinado',
        entidad: 'Apadrinado',
        resultado: 'OK',
        ref: nuevoApadrinado.id
      });

      showToast('¡Apadrinado registrado exitosamente!');
      router.push('/ch/apadrinados/gestion');

    } catch (error) {
      showToast('Error al registrar el apadrinado');
      addAudit({
        ts: new Date().toISOString(),
        actor: 'Casa Hogar',
        accion: 'Registrar apadrinado',
        entidad: 'Apadrinado',
        resultado: 'ERROR',
        ref: 'N/A'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/ch/apadrinados/gestion"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver a gestión
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Nuevo Apadrinado</h1>
          <p className="text-gray-600">Complete la información del niño que será agregado a su casa hogar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Información Básica</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Juan Carlos Pérez"
                />
                {errors.nombre && (
                  <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad (años) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="18"
                  value={formData.edad}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.edad ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 8"
                />
                {errors.edad && (
                  <p className="text-red-600 text-sm mt-1">{errors.edad}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género *
                </label>
                <select
                  value={formData.genero}
                  onChange={(e) => handleInputChange('genero', e.target.value)}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.genero ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar género</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
                {errors.genero && (
                  <p className="text-red-600 text-sm mt-1">{errors.genero}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de nacimiento *
                </label>
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fechaNacimiento && (
                  <p className="text-red-600 text-sm mt-1">{errors.fechaNacimiento}</p>
                )}
              </div>
            </div>
          </div>

          {/* Necesidades y situación */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Necesidades y Situación</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Necesidad principal *
                </label>
                <input
                  type="text"
                  value={formData.necesidad}
                  onChange={(e) => handleInputChange('necesidad', e.target.value)}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.necesidad ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Educación y útiles escolares"
                />
                {errors.necesidad && (
                  <p className="text-red-600 text-sm mt-1">{errors.necesidad}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción general *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  rows={4}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.descripcion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descripción detallada de la situación del niño, sus necesidades y personalidad (mínimo 50 caracteres)..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.descripcion && (
                    <p className="text-red-600 text-sm">{errors.descripcion}</p>
                  )}
                  <p className="text-gray-500 text-sm ml-auto">
                    {formData.descripcion.length} caracteres
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Historia personal
                </label>
                <textarea
                  value={formData.historia}
                  onChange={(e) => handleInputChange('historia', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Historia y contexto familiar del niño (opcional)..."
                />
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Información Adicional</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condición médica
                </label>
                <input
                  type="text"
                  value={formData.condicionMedica}
                  onChange={(e) => handleInputChange('condicionMedica', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Ninguna, Asma, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel escolar
                </label>
                <input
                  type="text"
                  value={formData.escolaridad}
                  onChange={(e) => handleInputChange('escolaridad', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 3er grado primaria"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gustos e intereses
                </label>
                <textarea
                  value={formData.gustos}
                  onChange={(e) => handleInputChange('gustos', e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe los gustos, hobbies e intereses del niño..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de fotografía
                </label>
                <div className="flex gap-4">
                  <input
                    type="url"
                    value={formData.foto}
                    onChange={(e) => handleInputChange('foto', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/foto.jpg (opcional)"
                  />
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Camera size={20} />
                    Subir
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Si no se proporciona, se generará una imagen automáticamente
                </p>
              </div>
            </div>
          </div>

          {/* Aviso importante */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex gap-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Información Importante</h3>
                <div className="space-y-1 text-sm text-amber-800">
                  <p>• El ID del apadrinado se generará automáticamente y no podrá modificarse</p>
                  <p>• La información básica debe ser precisa ya que será visible para los donadores</p>
                  <p>• El estado inicial será "Disponible" para apadrinamiento</p>
                  <p>• Asegúrate de tener consentimiento para publicar la información del menor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6">
            <Link
              href="/ch/apadrinados/gestion"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md transition-colors text-center"
            >
              Cancelar
            </Link>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Registrar Apadrinado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
