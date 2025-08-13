'use client';

import { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useDemoStore } from '@/src/demo/use-demo-store';
import { showToast } from '@/lib/toast';

export function DemoBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    rolActual, setRolActual,
    pasarelaResultado, setPasarelaResultado,
    accesoInformes, setAccesoInformes,
    cuentaCHEstado, setCuentaCHEstado,
    bloqueoIntentos, setBloqueoIntentos,
    cuentaUsuarioSuspendida, setCuentaUsuarioSuspendida,
    publicacionResultado, setPublicacionResultado,
    apadrinadoEstado, setApadrinadoEstado,
  } = useDemoStore();

  const handleChange = (control: string, value: any) => {
    showToast(`Modo demo: ${control} = ${value} (simulado)`);
  };

  return (
    <div className="sticky top-0 z-50 bg-yellow-100 border-b border-yellow-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Settings size={16} />
            <span className="text-sm font-medium text-yellow-800">Controles de Demo</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-yellow-800 hover:text-yellow-900"
          >
            <span className="text-sm">
              {isExpanded ? 'Ocultar' : 'Mostrar'}
            </span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {isExpanded && (
          <div className="pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rol Actual */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-yellow-800">Rol Actual</label>
              <select
                value={rolActual}
                onChange={(e) => {
                  const value = e.target.value as typeof rolActual;
                  setRolActual(value);
                  handleChange('Rol Actual', value);
                }}
                className="w-full p-2 border border-yellow-300 rounded-md text-sm bg-white"
              >
                <option value="Donador">Donador</option>
                <option value="CasaHogar">Casa Hogar</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Pasarela Resultado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-yellow-800">Resultado Pasarela</label>
              <select
                value={pasarelaResultado}
                onChange={(e) => {
                  const value = e.target.value as typeof pasarelaResultado;
                  setPasarelaResultado(value);
                  handleChange('Resultado Pasarela', value);
                }}
                className="w-full p-2 border border-yellow-300 rounded-md text-sm bg-white"
              >
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>

            {/* Acceso Informes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-yellow-800">Acceso Informes</label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accesoInformes}
                  onChange={(e) => {
                    setAccesoInformes(e.target.checked);
                    handleChange('Acceso Informes', e.target.checked ? 'Habilitado' : 'Deshabilitado');
                  }}
                  className="rounded border-yellow-300"
                />
                <span className="text-sm text-yellow-700">
                  {accesoInformes ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </label>
            </div>

            {/* Estado Cuenta CH */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-yellow-800">Estado Cuenta CH</label>
              <select
                value={cuentaCHEstado}
                onChange={(e) => {
                  const value = e.target.value as typeof cuentaCHEstado;
                  setCuentaCHEstado(value);
                  handleChange('Estado Cuenta CH', value);
                }}
                className="w-full p-2 border border-yellow-300 rounded-md text-sm bg-white"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
                <option value="Inactiva">Inactiva</option>
                <option value="Activa">Activa</option>
              </select>
            </div>

            {/* Bloqueo Intentos */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-yellow-800">Bloqueo por Intentos</label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bloqueoIntentos}
                  onChange={(e) => {
                    setBloqueoIntentos(e.target.checked);
                    handleChange('Bloqueo Intentos', e.target.checked ? 'Activado' : 'Desactivado');
                  }}
                  className="rounded border-yellow-300"
                />
                <span className="text-sm text-yellow-700">
                  {bloqueoIntentos ? 'Activado' : 'Desactivado'}
                </span>
              </label>
            </div>

            {/* Usuario Suspendido */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-yellow-800">Usuario Suspendido</label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cuentaUsuarioSuspendida}
                  onChange={(e) => {
                    setCuentaUsuarioSuspendida(e.target.checked);
                    handleChange('Usuario Suspendido', e.target.checked ? 'Sí' : 'No');
                  }}
                  className="rounded border-yellow-300"
                />
                <span className="text-sm text-yellow-700">
                  {cuentaUsuarioSuspendida ? 'Sí' : 'No'}
                </span>
              </label>
            </div>

            {/* Resultado Publicación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-yellow-800">Resultado Publicación</label>
              <select
                value={publicacionResultado}
                onChange={(e) => {
                  const value = e.target.value as typeof publicacionResultado;
                  setPublicacionResultado(value);
                  handleChange('Resultado Publicación', value);
                }}
                className="w-full p-2 border border-yellow-300 rounded-md text-sm bg-white"
              >
                <option value="Aprobar">Aprobar</option>
                <option value="Rechazar">Rechazar</option>
              </select>
            </div>

            {/* Estado Apadrinado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-yellow-800">Estado Apadrinado</label>
              <select
                value={apadrinadoEstado}
                onChange={(e) => {
                  const value = e.target.value as typeof apadrinadoEstado;
                  setApadrinadoEstado(value);
                  handleChange('Estado Apadrinado', value);
                }}
                className="w-full p-2 border border-yellow-300 rounded-md text-sm bg-white"
              >
                <option value="Activo">Activo</option>
                <option value="Autosuficiente">Autosuficiente</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
