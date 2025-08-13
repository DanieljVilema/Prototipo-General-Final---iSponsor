'use client';

import { useState } from 'react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { Apadrinado } from '@/src/demo/types';
import { StateChip } from '@/app/components/StateChips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ExplorarPage() {
  const { apadrinados, casasHogar } = useDemoStore();
  
  const [filtros, setFiltros] = useState({
    tipo: '',
    edad: '',
    genero: '',
    necesidad: '',
    busqueda: ''
  });

  const limpiarFiltros = () => {
    setFiltros({
      tipo: '',
      edad: '',
      genero: '',
      necesidad: '',
      busqueda: ''
    });
  };

  const apadrinadosFiltrados = apadrinados.filter((apadrinado: Apadrinado) => {
    if (filtros.genero && apadrinado.genero !== filtros.genero) return false;
    if (filtros.edad) {
      const rangoEdad = filtros.edad;
      if (rangoEdad === '5-8' && (apadrinado.edad < 5 || apadrinado.edad > 8)) return false;
      if (rangoEdad === '9-12' && (apadrinado.edad < 9 || apadrinado.edad > 12)) return false;
      if (rangoEdad === '13-17' && (apadrinado.edad < 13 || apadrinado.edad > 17)) return false;
    }
    if (filtros.necesidad && !apadrinado.necesidad.toLowerCase().includes(filtros.necesidad.toLowerCase())) return false;
    if (filtros.busqueda && !apadrinado.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false;
    
    return apadrinado.estado === 'Activo';
  });

  const getCasaHogar = (casaHogarId: string) => {
    return casasHogar.find(ch => ch.id === casaHogarId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explorar Candidatos
          </h1>
          <p className="text-gray-600">
            Encuentra el candidato ideal para apadrinar
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Búsqueda</label>
                <Input
                  placeholder="Buscar por nombre..."
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Género</label>
                <Select value={filtros.genero} onValueChange={(value) => setFiltros({ ...filtros, genero: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Edad</label>
                <Select value={filtros.edad} onValueChange={(value) => setFiltros({ ...filtros, edad: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="5-8">5-8 años</SelectItem>
                    <SelectItem value="9-12">9-12 años</SelectItem>
                    <SelectItem value="13-17">13-17 años</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Necesidad</label>
                <Input
                  placeholder="Ej: alimentación, educación..."
                  value={filtros.necesidad}
                  onChange={(e) => setFiltros({ ...filtros, necesidad: e.target.value })}
                />
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={limpiarFiltros} className="w-full">
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            {apadrinadosFiltrados.length} candidatos encontrados
          </p>
        </div>

        {apadrinadosFiltrados.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay resultados
              </h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros para encontrar candidatos
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apadrinadosFiltrados.map((apadrinado) => {
              const casaHogar = getCasaHogar(apadrinado.casaHogarId);
              
              return (
                <Card key={apadrinado.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {apadrinado.foto ? (
                      <img 
                        src={apadrinado.foto} 
                        alt={apadrinado.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl">👦</div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{apadrinado.nombre}</h3>
                      <StateChip estado={apadrinado.estado} />
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{apadrinado.edad} años</span>
                        <Badge variant="outline" className="ml-auto">
                          {apadrinado.genero === 'M' ? 'Masculino' : 'Femenino'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{casaHogar?.nombre || 'Casa Hogar'}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Necesidad:</span> {apadrinado.necesidad}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link href={`/detalle/${apadrinado.id}`}>
                        <Button variant="outline" className="w-full">
                          Ver detalles
                        </Button>
                      </Link>
                      
                      <Link href={`/apadrinar/${apadrinado.id}`}>
                        <Button className="w-full">
                          <Heart className="h-4 w-4 mr-2" />
                          Apadrinar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
