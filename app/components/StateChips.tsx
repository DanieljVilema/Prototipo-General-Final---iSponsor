'use client';

import { EstadoCH, EstadoApadrinado, EstadoApadrinamiento, EstadoInforme } from '@/src/demo/types';

interface StateChipProps {
  estado: EstadoCH | EstadoApadrinado | EstadoApadrinamiento | EstadoInforme;
  size?: 'sm' | 'md' | 'lg';
}

export function StateChip({ estado, size = 'md' }: StateChipProps) {
  const { color, text } = getEstadoStyle(estado);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${color} ${sizeClasses[size]}`}>
      {text}
    </span>
  );
}

function getEstadoStyle(estado: string): { color: string; text: string } {
  switch (estado) {
    case 'Pendiente':
      return {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Pendiente'
      };
    case 'Aprobada':
    case 'Aprobado':
      return {
        color: 'bg-green-100 text-green-800',
        text: 'Aprobada'
      };
    case 'Rechazada':
    case 'Rechazado':
      return {
        color: 'bg-red-100 text-red-800',
        text: 'Rechazada'
      };
    case 'Activa':
    case 'Activo':
      return {
        color: 'bg-blue-100 text-blue-800',
        text: 'Activo'
      };
    case 'Inactiva':
    case 'Inactivo':
      return {
        color: 'bg-gray-100 text-gray-800',
        text: 'Inactivo'
      };
    case 'Autosuficiente':
      return {
        color: 'bg-purple-100 text-purple-800',
        text: 'Autosuficiente'
      };
    case 'Cancelado':
      return {
        color: 'bg-red-100 text-red-800',
        text: 'Cancelado'
      };
    case 'Publicado':
      return {
        color: 'bg-green-100 text-green-800',
        text: 'Publicado'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800',
        text: estado
      };
  }
}
