import { Usuario, Apadrinado, CasaHogar, MetodoPago, Apadrinamiento, Informe, AuditEvent } from './types';

export const SEEDS = {
  usuarios: [
    { id: "u-don1", rol: "Donador" as const, nombre: "Ana Pérez", email: "ana@demo.com" },
    { id: "u-ch1", rol: "CasaHogar" as const, nombre: "CH Rayito de Sol", email: "contacto@rayito.org", estado: "Aprobada" as const },
    { id: "u-ch2", rol: "CasaHogar" as const, nombre: "CH Caminos", email: "hola@caminos.org", estado: "Pendiente" as const },
    { id: "u-admin", rol: "Admin" as const, nombre: "Admin iSponsor", email: "admin@isponsor.org" }
  ] as Usuario[],
  
  apadrinados: [
    { id: "a1", nombre: "Lucas", edad: 8, genero: "M" as const, necesidad: "Útiles escolares", casaHogarId: "u-ch1", estado: "Activo" as const },
    { id: "a2", nombre: "María", edad: 10, genero: "F" as const, necesidad: "Alimentación", casaHogarId: "u-ch1", estado: "Activo" as const },
    { id: "a3", nombre: "Diego", edad: 12, genero: "M" as const, necesidad: "Salud", casaHogarId: "u-ch2", estado: "Activo" as const }
  ] as Apadrinado[],
  
  casasHogar: [
    { 
      id: "u-ch1", 
      nombre: "CH Rayito de Sol", 
      estado: "Aprobada" as const, 
      ubicacion: "Quito, Ecuador", 
      descripcion: "Atención integral a niños en situación de riesgo social.",
      representante: "María Elena Vásquez",
      fechaFundacion: "2015-03-15",
      telefono: "+593-2-234-5678",
      email: "contacto@rayitodesol.org",
      sitioWeb: "https://rayitodesol.org"
    },
    { 
      id: "u-ch2", 
      nombre: "CH Caminos de Esperanza", 
      estado: "Pendiente" as const, 
      ubicacion: "Guayaquil, Ecuador", 
      descripcion: "Programas de inclusión social y educación para menores.",
      representante: "Carlos Alberto Mendoza",
      fechaFundacion: "2018-08-22",
      telefono: "+593-4-567-8901",
      email: "admin@caminosesperanza.org"
    }
  ] as CasaHogar[],
  
  metodosPago: [
    { id: "mp1", donadorId: "u-don1", brand: "Visa", last4: "4242", token: "tok_demo_1", enUso: true }
  ] as MetodoPago[],
  
  apadrinamientos: [
    { id: "ap1", donadorId: "u-don1", apadrinadoId: "a1", monto: 25, moneda: "USD" as const, fechaPago: "15 de cada mes", estado: "Activo" as const }
  ] as Apadrinamiento[],
  
  informes: [
    { id: "inf1", apadrinadoId: "a1", titulo: "Informe Mayo", estado: "Publicado" as const, resumen: "Uniformes y cuadernos." },
    { id: "inf2", apadrinadoId: "a2", titulo: "Informe Junio", estado: "Pendiente" as const, resumen: "Despensas." }
  ] as Informe[],
  
  auditoria: [] as AuditEvent[]
};
