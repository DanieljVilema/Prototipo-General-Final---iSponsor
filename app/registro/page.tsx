'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export default function RegistroPage() {
  const router = useRouter();
  const { addAudit } = useDemoStore();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    fechaNacimiento: '',
    terminos: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'Apellido es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Contraseña debe tener al menos 8 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono es requerido';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Fecha de nacimiento es requerida';
    if (!formData.terminos) newErrors.terminos = 'Debe aceptar los términos y condiciones';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simular proceso de registro
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% éxito

      if (isSuccess) {
        addAudit({
          ts: new Date().toISOString(),
          actor: 'Sistema',
          accion: 'Registro exitoso',
          entidad: 'Usuario',
          resultado: 'OK',
          ref: formData.email
        });

        showToast('Registro exitoso. Correo de verificación enviado (simulado)');
        router.push('/verificacion-email');
      } else {
        addAudit({
          ts: new Date().toISOString(),
          actor: 'Sistema',
          accion: 'Intento de registro fallido',
          entidad: 'Usuario',
          resultado: 'Error',
          ref: formData.email
        });

        setErrors({ general: 'Error en el registro. El email ya está en uso.' });
        showToast('Error: Email ya registrado en el sistema');
      }

      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">iS</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Crear cuenta de donador
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className={`pl-10 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombre ? 'border-red-300' : 'border-gray-300'}`}
                  />
                </div>
                {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <div className="mt-1">
                  <input
                    id="apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    className={`block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.apellido ? 'border-red-300' : 'border-gray-300'}`}
                  />
                </div>
                {errors.apellido && <p className="mt-1 text-xs text-red-600">{errors.apellido}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`pl-10 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`pl-10 pr-10 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`pl-10 pr-10 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <div className="mt-1">
                <input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className={`block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.telefono ? 'border-red-300' : 'border-gray-300'}`}
                />
              </div>
              {errors.telefono && <p className="mt-1 text-xs text-red-600">{errors.telefono}</p>}
            </div>

            <div>
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
                Fecha de nacimiento
              </label>
              <div className="mt-1">
                <input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                  className={`block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fechaNacimiento ? 'border-red-300' : 'border-gray-300'}`}
                />
              </div>
              {errors.fechaNacimiento && <p className="mt-1 text-xs text-red-600">{errors.fechaNacimiento}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="terminos"
                type="checkbox"
                checked={formData.terminos}
                onChange={(e) => setFormData({...formData, terminos: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terminos" className="ml-2 block text-sm text-gray-900">
                Acepto los{' '}
                <Link href="/terminos" className="text-blue-600 hover:text-blue-500">
                  términos y condiciones
                </Link>
              </label>
            </div>
            {errors.terminos && <p className="text-xs text-red-600">{errors.terminos}</p>}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
