'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { 
  Home, 
  Search, 
  Heart, 
  CreditCard, 
  LayoutDashboard, 
  Users, 
  Settings, 
  AlertTriangle,
  FileText,
  Building,
  User
} from 'lucide-react';

export function RoleNavigation() {
  const { rolActual } = useDemoStore();
  const pathname = usePathname();

  // Si no hay rol activo, no mostrar navegación
  if (!rolActual) {
    return null;
  }

  const donadorLinks = [
    { href: '/explorar', label: 'Explorar', icon: Search },
    { href: '/mis-apadrinamientos', label: 'Mis Apadrinamientos', icon: Heart },
    { href: '/metodos', label: 'Métodos de Pago', icon: CreditCard },
    { href: '/perfil', label: 'Mi Perfil', icon: User },
  ];

  const casaHogarLinks = [
    { href: '/ch', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/ch/apadrinados', label: 'Apadrinados', icon: Users },
    { href: '/ch/perfil', label: 'Mi Perfil', icon: User },
  ];

  const adminLinks = [
    { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
    { href: '/admin/procesos', label: 'Procesos', icon: Settings },
    { href: '/admin/fallos', label: 'Fallos', icon: AlertTriangle },
    { href: '/admin/auditorias', label: 'Auditorías', icon: FileText },
  ];

  const getLinks = () => {
    switch (rolActual) {
      case 'CasaHogar':
        return casaHogarLinks;
      case 'Admin':
        return adminLinks;
      default:
        return donadorLinks;
    }
  };

  const isLinkActive = (href: string) => {
    if (href === '/explorar') {
      return pathname === '/explorar' || (pathname === '/' && rolActual === 'Donador');
    }
    if (href === '/') {
      return pathname === '/' && rolActual !== 'Donador';
    }
    return pathname.startsWith(href);
  };

  const getRoleIcon = () => {
    switch (rolActual) {
      case 'CasaHogar':
        return Building;
      case 'Admin':
        return Settings;
      default:
        return Home;
    }
  };

  const RoleIcon = getRoleIcon();
  const links = getLinks();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Rol */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">iS</span>
              </div>
              <span className="font-bold text-xl text-gray-900">iSponsor</span>
            </Link>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
              <RoleIcon size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {rolActual === 'CasaHogar' ? 'Casa Hogar' : rolActual}
              </span>
            </div>
          </div>

          {/* Enlaces de navegación */}
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = isLinkActive(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Indicador de estado */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-500">En línea</span>
          </div>
        </div>
      </div>
    </nav>
  );
}