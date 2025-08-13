'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Heart, Home, Shield, Users } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';

export default function HomePage() {
  const router = useRouter();
  const { setRolActual, rolActual } = useDemoStore();

  // Redirección automática según el rol
  useEffect(() => {
    if (rolActual === 'Donador') {
      router.push('/explorar');
    } else if (rolActual === 'CasaHogar') {
      router.push('/ch');
    } else if (rolActual === 'Admin') {
      router.push('/admin/usuarios');
    }
  }, [rolActual, router]);

  const handleRoleAccess = (role: 'Donador' | 'CasaHogar' | 'Admin', path: string) => {
    setRolActual(role);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <Heart className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a iSponsor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plataforma que conecta donadores con casas hogar para crear lazos de apadrinamiento 
            que transforman vidas y construyen futuros llenos de esperanza.
          </p>
          <div className="mt-6 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg inline-block">
            <p className="text-sm text-yellow-800">
              🚧 <strong>Prototipo Demo</strong> - Todas las funciones son simuladas
            </p>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Donador */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="text-green-600" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">Donador</h3>
            <p className="text-gray-600 text-center mb-4">
              Encuentra y apadrina a niños que necesitan tu apoyo
            </p>
            <button
              onClick={() => handleRoleAccess('Donador', '/explorar')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Entrar como Donador
            </button>
          </div>

          {/* Casa Hogar */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Home className="text-blue-600" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">Casa Hogar</h3>
            <p className="text-gray-600 text-center mb-4">
              Gestiona tus apadrinados y mantén informados a los donadores
            </p>
            <button
              onClick={() => handleRoleAccess('CasaHogar', '/ch')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Entrar como Casa Hogar
            </button>
          </div>

          {/* Admin */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Shield className="text-purple-600" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">Administrador</h3>
            <p className="text-gray-600 text-center mb-4">
              Supervisa la plataforma y gestiona usuarios y procesos
            </p>
            <button
              onClick={() => handleRoleAccess('Admin', '/admin/usuarios')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Entrar como Admin
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Funcionalidades del Prototipo</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Para Donadores</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Explorar y filtrar candidatos a apadrinamiento</li>
                <li>• Gestionar métodos de pago</li>
                <li>• Ver informes de progreso</li>
                <li>• Cancelar apadrinamientos</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Para Casas Hogar</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Registrar y gestionar apadrinados</li>
                <li>• Crear informes de progreso</li>
                <li>• Registrar donaciones recibidas</li>
                <li>• Actualizar estados de niños</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Para Administradores</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Aprobar/rechazar casas hogar</li>
                <li>• Moderar informes</li>
                <li>• Gestionar usuarios</li>
                <li>• Ver auditoría del sistema</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Sistema Demo</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Pasarela de pagos simulada</li>
                <li>• Notificaciones por correo simuladas</li>
                <li>• Auditoría de todas las acciones</li>
                <li>• Controles de demo configurables</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <Users size={16} />
            iSponsor Demo v1.0 - Prototipo navegable
          </p>
        </div>
      </div>
    </div>
  );
}
