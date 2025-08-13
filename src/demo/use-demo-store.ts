import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DemoState, Usuario, Apadrinado, CasaHogar, MetodoPago, Apadrinamiento, Informe, AuditEvent } from './types';
import { SEEDS } from './demo-data';

interface DemoStore extends DemoState {
  // Data
  usuarios: Usuario[];
  apadrinados: Apadrinado[];
  casasHogar: CasaHogar[];
  metodosPago: MetodoPago[];
  apadrinamientos: Apadrinamiento[];
  informes: Informe[];
  auditoria: AuditEvent[];

  // Actions
  setRolActual: (rol: DemoState['rolActual']) => void;
  setPasarelaResultado: (resultado: DemoState['pasarelaResultado']) => void;
  setAccesoInformes: (acceso: boolean) => void;
  setCuentaCHEstado: (estado: DemoState['cuentaCHEstado']) => void;
  setBloqueoIntentos: (bloqueo: boolean) => void;
  setCuentaUsuarioSuspendida: (suspendida: boolean) => void;
  setPublicacionResultado: (resultado: DemoState['publicacionResultado']) => void;
  setApadrinadoEstado: (estado: DemoState['apadrinadoEstado']) => void;

  // Utilities
  addUsuario: (usuario: Usuario) => void;
  updateUsuario: (id: string, data: Partial<Usuario>) => void;
  removeUsuario: (id: string) => void;
  getUsuarioById: (id: string) => Usuario | undefined;

  addApadrinado: (apadrinado: Apadrinado) => void;
  updateApadrinado: (id: string, data: Partial<Apadrinado>) => void;
  removeApadrinado: (id: string) => void;
  getApadrinadoById: (id: string) => Apadrinado | undefined;

  addMetodoPago: (metodo: MetodoPago) => void;
  updateMetodoPago: (id: string, data: Partial<MetodoPago>) => void;
  removeMetodoPago: (id: string) => void;
  getMetodoPagoById: (id: string) => MetodoPago | undefined;

  addApadrinamiento: (apadrinamiento: Apadrinamiento) => void;
  updateApadrinamiento: (id: string, data: Partial<Apadrinamiento>) => void;
  removeApadrinamiento: (id: string) => void;
  getApadrinamientoById: (id: string) => Apadrinamiento | undefined;

  addInforme: (informe: Informe) => void;
  updateInforme: (id: string, data: Partial<Informe>) => void;
  removeInforme: (id: string) => void;
  getInformeById: (id: string) => Informe | undefined;

  // Casa Hogar utilities
  addCasaHogar: (casaHogar: CasaHogar) => void;
  updateCasaHogar: (id: string, data: Partial<CasaHogar>) => void;
  removeCasaHogar: (id: string) => void;
  getCasaHogarById: (id: string) => CasaHogar | undefined;

  // Audit
  logAudit: (event: Omit<AuditEvent, 'ts'>) => void;
  addAudit: (event: Omit<AuditEvent, 'ts'>) => void;
  clearAudit: () => void;

  // Reset
  resetData: () => void;
}

const initialState: DemoState = {
  rolActual: null,
  pasarelaResultado: "Aprobado",
  accesoInformes: true,
  cuentaCHEstado: "Aprobada",
  bloqueoIntentos: false,
  cuentaUsuarioSuspendida: false,
  publicacionResultado: "Aprobar",
  apadrinadoEstado: "Activo",
};

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      usuarios: SEEDS.usuarios,
      apadrinados: SEEDS.apadrinados,
      casasHogar: SEEDS.casasHogar,
      metodosPago: SEEDS.metodosPago,
      apadrinamientos: SEEDS.apadrinamientos,
      informes: SEEDS.informes,
      auditoria: SEEDS.auditoria,

      // Demo state setters
      setRolActual: (rol) => set({ rolActual: rol }),
      setPasarelaResultado: (resultado) => set({ pasarelaResultado: resultado }),
      setAccesoInformes: (acceso) => set({ accesoInformes: acceso }),
      setCuentaCHEstado: (estado) => set({ cuentaCHEstado: estado }),
      setBloqueoIntentos: (bloqueo) => set({ bloqueoIntentos: bloqueo }),
      setCuentaUsuarioSuspendida: (suspendida) => set({ cuentaUsuarioSuspendida: suspendida }),
      setPublicacionResultado: (resultado) => set({ publicacionResultado: resultado }),
      setApadrinadoEstado: (estado) => set({ apadrinadoEstado: estado }),

      // Usuario utilities
      addUsuario: (usuario) => set((state) => ({ usuarios: [...state.usuarios, usuario] })),
      updateUsuario: (id, data) => set((state) => ({
        usuarios: state.usuarios.map(u => u.id === id ? { ...u, ...data } : u)
      })),
      removeUsuario: (id) => set((state) => ({ usuarios: state.usuarios.filter(u => u.id !== id) })),
      getUsuarioById: (id) => get().usuarios.find(u => u.id === id),

      // Apadrinado utilities
      addApadrinado: (apadrinado) => set((state) => ({ apadrinados: [...state.apadrinados, apadrinado] })),
      updateApadrinado: (id, data) => set((state) => ({
        apadrinados: state.apadrinados.map(a => a.id === id ? { ...a, ...data } : a)
      })),
      removeApadrinado: (id) => set((state) => ({ apadrinados: state.apadrinados.filter(a => a.id !== id) })),
      getApadrinadoById: (id) => get().apadrinados.find(a => a.id === id),

      // MetodoPago utilities
      addMetodoPago: (metodo) => set((state) => ({ metodosPago: [...state.metodosPago, metodo] })),
      updateMetodoPago: (id, data) => set((state) => ({
        metodosPago: state.metodosPago.map(m => m.id === id ? { ...m, ...data } : m)
      })),
      removeMetodoPago: (id) => set((state) => ({ metodosPago: state.metodosPago.filter(m => m.id !== id) })),
      getMetodoPagoById: (id) => get().metodosPago.find(m => m.id === id),

      // Apadrinamiento utilities
      addApadrinamiento: (apadrinamiento) => set((state) => ({ apadrinamientos: [...state.apadrinamientos, apadrinamiento] })),
      updateApadrinamiento: (id, data) => set((state) => ({
        apadrinamientos: state.apadrinamientos.map(a => a.id === id ? { ...a, ...data } : a)
      })),
      removeApadrinamiento: (id) => set((state) => ({ apadrinamientos: state.apadrinamientos.filter(a => a.id !== id) })),
      getApadrinamientoById: (id) => get().apadrinamientos.find(a => a.id === id),

      // Informe utilities
      addInforme: (informe) => set((state) => ({ informes: [...state.informes, informe] })),
      updateInforme: (id, data) => set((state) => ({
        informes: state.informes.map(i => i.id === id ? { ...i, ...data } : i)
      })),
      removeInforme: (id) => set((state) => ({ informes: state.informes.filter(i => i.id !== id) })),
      getInformeById: (id) => get().informes.find(i => i.id === id),

      // Casa Hogar utilities
      addCasaHogar: (casaHogar) => set((state) => ({ casasHogar: [...state.casasHogar, casaHogar] })),
      updateCasaHogar: (id, data) => set((state) => ({
        casasHogar: state.casasHogar.map(ch => ch.id === id ? { ...ch, ...data } : ch)
      })),
      removeCasaHogar: (id) => set((state) => ({ casasHogar: state.casasHogar.filter(ch => ch.id !== id) })),
      getCasaHogarById: (id) => get().casasHogar.find(ch => ch.id === id),

      // Audit
      logAudit: (event) => set((state) => ({
        auditoria: [...state.auditoria, { ...event, ts: new Date().toISOString() }]
      })),
      addAudit: (event) => set((state) => ({
        auditoria: [...state.auditoria, { ...event, ts: new Date().toISOString() }]
      })),
      clearAudit: () => set({ auditoria: [] }),

      // Reset
      resetData: () => set({
        ...initialState,
        usuarios: SEEDS.usuarios,
        apadrinados: SEEDS.apadrinados,
        casasHogar: SEEDS.casasHogar,
        metodosPago: SEEDS.metodosPago,
        apadrinamientos: SEEDS.apadrinamientos,
        informes: SEEDS.informes,
        auditoria: SEEDS.auditoria,
      }),
    }),
    {
      name: 'isponsor_demo_v1',
    }
  )
);
