export type Rol = "Donador" | "CasaHogar" | "Admin" | "Sistema" | "Pasarela";
export type EstadoCH = "Pendiente" | "Aprobada" | "Rechazada" | "Inactiva" | "Activa";
export type EstadoApadrinado = "Activo" | "Autosuficiente" | "Inactivo";
export type EstadoApadrinamiento = "Activo" | "Cancelado";
export type EstadoInforme = "Pendiente" | "Publicado" | "Rechazado" | "Borrador" | "Aprobado";

export type Usuario = { 
  id: string; 
  rol: "Donador" | "CasaHogar" | "Admin"; 
  nombre: string; 
  email: string; 
  estado?: EstadoCH;
};

export type Apadrinado = { 
  id: string; 
  nombre: string; 
  edad: number; 
  genero: "M" | "F"; 
  necesidad: string; 
  casaHogarId: string; 
  estado: EstadoApadrinado; 
  foto?: string;
};

export type CasaHogar = { 
  id: string; 
  nombre: string; 
  estado: EstadoCH; 
  ubicacion: string; 
  descripcion?: string;
  representante: string;
  fechaFundacion: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
};

export type MetodoPago = { 
  id: string; 
  donadorId: string; 
  brand: string; 
  last4: string; 
  token: string; 
  enUso: boolean;
};

export type Apadrinamiento = { 
  id: string; 
  donadorId: string; 
  apadrinadoId: string; 
  monto: number; 
  moneda: "USD"; 
  fechaPago: string; 
  estado: EstadoApadrinamiento;
};

export type Informe = { 
  id: string; 
  apadrinadoId: string; 
  titulo: string; 
  estado: EstadoInforme; 
  resumen?: string;
  tipo?: string;
  periodo?: string;
  fechaCreacion?: string;
  fechaEnvio?: string;
  contenido?: string;
  observaciones?: string;
  casaHogarId?: string;
  casaHogarNombre?: string;
  archivos?: string | null;
};

export type AuditEvent = {
  ts: string; 
  actor: Rol; 
  accion: string; 
  entidad: string; 
  resultado: "Aprobado" | "Rechazado" | "OK" | "Error" | "Pendiente"; 
  ref?: string;
};

export type DemoState = {
  rolActual: "Donador" | "CasaHogar" | "Admin" | null;
  pasarelaResultado: "Aprobado" | "Rechazado";
  accesoInformes: boolean;
  cuentaCHEstado: EstadoCH;
  bloqueoIntentos: boolean;
  cuentaUsuarioSuspendida: boolean;
  publicacionResultado: "Aprobar" | "Rechazar";
  apadrinadoEstado: EstadoApadrinado;
};
