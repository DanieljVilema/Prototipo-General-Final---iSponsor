'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Heart, Home, Shield, Users, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { setRolActual, rolActual } = useDemoStore();

  // Solo redireccionar si ya hay un rol activo
  useEffect(() => {
    if (rolActual === 'Donador') {
      router.push('/explorar');
    } else if (rolActual === 'CasaHogar') {
      router.push('/ch');
    } else if (rolActual === 'Admin') {
      router.push('/admin/usuarios');
    }
  }, [rolActual, router]);

  // Si no hay rol, mostrar página de bienvenida
  if (!rolActual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto py-12 px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">iS</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Bienvenido a <span className="text-blue-600">iSponsor</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conectamos corazones generosos con niños que necesitan apoyo. 
              Una plataforma segura y transparente para el apadrinamiento infantil.
            </p>
          </div>

          {/* Acciones principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              <LogIn size={24} />
              Iniciar Sesión
            </Link>
            <Link
              href="/registro"
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              <UserPlus size={24} />
              Crear Cuenta
            </Link>
          </div>

          {/* Características principales */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Para Donadores</h3>
              <p className="text-gray-600 mb-4">
                Apadrina un niño y sigue su progreso a través de informes regulares y transparentes.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Apadrinamiento personalizado</li>
                <li>• Informes mensuales</li>
                <li>• Pagos seguros</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Para Casas Hogar</h3>
              <p className="text-gray-600 mb-4">
                Registra a los niños bajo tu cuidado y gestiona las donaciones de manera eficiente.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Gestión de apadrinados</li>
                <li>• Seguimiento de donaciones</li>
                <li>• Reportes automáticos</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seguro y Transparente</h3>
              <p className="text-gray-600 mb-4">
                Plataforma verificada con auditorías completas y seguimiento en tiempo real.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Verificación de identidad</li>
                <li>• Auditoría completa</li>
                <li>• Transparencia total</li>
              </ul>
            </div>
          </div>

          {/* Acceso directo de demo */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Acceso Directo Demo</h2>
            <p className="text-gray-600 text-center mb-8">
              Explora la plataforma con diferentes roles de usuario para ver todas las funcionalidades
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => handleRoleAccess('Donador', '/explorar')}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <Heart className="mx-auto mb-3" size={32} />
                <h3 className="font-semibold text-lg">Donador</h3>
                <p className="text-sm opacity-90 mt-2">Explorar apadrinamientos</p>
              </button>

              <button
                onClick={() => handleRoleAccess('CasaHogar', '/ch')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <Home className="mx-auto mb-3" size={32} />
                <h3 className="font-semibold text-lg">Casa Hogar</h3>
                <p className="text-sm opacity-90 mt-2">Gestionar apadrinados</p>
              </button>

              <button
                onClick={() => handleRoleAccess('Admin', '/admin/usuarios')}
                className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white p-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <Shield className="mx-auto mb-3" size={32} />
                <h3 className="font-semibold text-lg">Administrador</h3>
                <p className="text-sm opacity-90 mt-2">Panel de control</p>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-gray-500">
            <p>© 2025 iSponsor - Prototipo Demo - Conectando corazones, transformando vidas</p>
          </div>
        </div>
      </div>
    );
  }

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
