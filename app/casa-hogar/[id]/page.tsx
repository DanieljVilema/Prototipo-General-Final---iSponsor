'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Users, Heart, Star, Phone, Mail, Globe, User } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { StateChip } from '@/app/components/StateChips';

export default function CasaHogarDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { casasHogar, apadrinados } = useDemoStore();
  
  const casaHogar = casasHogar.find(ch => ch.id === params.id);
  
  if (!casaHogar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Casa Hogar no encontrada</h2>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-500"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  const candidatosCH = apadrinados.filter(a => a.casaHogarId === casaHogar.id);
  const apadrinadosActivos = candidatosCH.filter(a => a.estado === 'Apadrinado');
  const candidatosDisponibles = candidatosCH.filter(a => a.estado === 'Disponible');

  // Calcular antigüedad
  const fechaFundacion = new Date(casaHogar.fechaFundacion);
  const hoy = new Date();
  const antiguedadAnios = Math.floor((hoy.getTime() - fechaFundacion.getTime()) / (1000 * 60 * 60 * 24 * 365));

  // Estadísticas simuladas
  const estadisticas = {
    totalDonacionesRecibidas: candidatosCH.length * 1200 + Math.floor(Math.random() * 10000),
    totalDonadoresActivos: apadrinadosActivos.length + Math.floor(Math.random() * 15),
    proyectosActivos: Math.floor(Math.random() * 5) + 2,
    tasaExito: Math.floor(Math.random() * 20) + 75
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
        </div>

        {/* Información principal */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative h-full flex items-end p-6">
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{casaHogar.nombre}</h1>
                <p className="text-blue-100">{casaHogar.descripcion}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Información básica */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Información General</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Representante Legal</p>
                      <p className="font-medium">{casaHogar.representante}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Ubicación</p>
                      <p className="font-medium">{casaHogar.ubicacion}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Fundación</p>
                      <p className="font-medium">
                        {fechaFundacion.toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} 
                        <span className="text-blue-600 ml-2">({antiguedadAnios} años)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium">{casaHogar.telefono}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{casaHogar.email}</p>
                    </div>
                  </div>

                  {casaHogar.sitioWeb && (
                    <div className="flex items-center gap-3">
                      <Globe className="text-gray-500" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Sitio Web</p>
                        <a 
                          href={casaHogar.sitioWeb} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          {casaHogar.sitioWeb}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Estado y acciones */}
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Estado</h3>
                  <StateChip state={casaHogar.estado} />
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-500" size={16} />
                      <span className="text-sm">Verificada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Activa</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Contactar Casa Hogar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{candidatosCH.length}</p>
                <p className="text-gray-600 text-sm">Total Candidatos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Heart className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{apadrinadosActivos.length}</p>
                <p className="text-gray-600 text-sm">Apadrinados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{candidatosDisponibles.length}</p>
                <p className="text-gray-600 text-sm">Disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-purple-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{antiguedadAnios}</p>
                <p className="text-gray-600 text-sm">Años Activa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas adicionales */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas de Impacto</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Donaciones</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total recibido</span>
                  <span className="font-semibold">${estadisticas.totalDonacionesRecibidas.toLocaleString()} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Donadores activos</span>
                  <span className="font-semibold">{estadisticas.totalDonadoresActivos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Promedio mensual</span>
                  <span className="font-semibold">${Math.floor(estadisticas.totalDonacionesRecibidas / 12).toLocaleString()} MXN</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Gestión</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Proyectos activos</span>
                  <span className="font-semibold">{estadisticas.proyectosActivos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasa de éxito</span>
                  <span className="font-semibold">{estadisticas.tasaExito}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reportes enviados</span>
                  <span className="font-semibold">{Math.floor(Math.random() * 50) + 20}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Candidatos de esta casa hogar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Candidatos</h2>
            <span className="text-sm text-gray-500">{candidatosCH.length} total</span>
          </div>

          {candidatosCH.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto mb-4 text-gray-300" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay candidatos registrados</h3>
              <p className="text-gray-600">Esta casa hogar aún no ha registrado candidatos.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidatosCH.map((candidato) => (
                <div key={candidato.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={candidato.foto}
                      alt={candidato.nombre}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{candidato.nombre}</h3>
                      <p className="text-sm text-gray-600">{candidato.edad} años</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <StateChip state={candidato.estado} />
                  </div>
                  
                  <button
                    onClick={() => router.push(`/detalle/${candidato.id}`)}
                    className="w-full text-sm bg-blue-50 text-blue-700 py-2 px-3 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Ver detalle
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
