import type { Material, Client, Product, ProductionOrder, Incident, Operator, Machine } from './types';
import { getISOWeek } from 'date-fns';

const CURRENT_WEEK = getISOWeek(new Date());

export const initialClients: Client[] = [
  { id: 'C-001-MIN', name: 'Minería y Canteras (Agregados)', contact: 'Juan Pérez' },
  { id: 'C-002-SID', name: 'Siderúrgica Nacional', contact: 'Maria López' },
  { id: 'C-003-CON', name: 'Construcción e Infraestructura', contact: 'Carlos Gómez' },
  { id: 'C-004-OTR', name: 'Otras Industrias (Ladrilleras/Asfalto)', contact: 'Sofía Reyes' }
];

export const initialMaterials: Material[] = [
  { id: 'ChatarraAcero', name: 'Chatarra de Acero (Carga)', stock: 58, unit: 'ton', min_stock: 10 },
  { id: 'Manganeso', name: 'Acero al Manganeso (FeMn)', stock: 15000, unit: 'kg', min_stock: 500 },
  { id: 'AltoCromo', name: 'Acero al Alto Cromo (FeCr)', stock: 8000, unit: 'kg', min_stock: 400 },
  { id: 'Inoxidable', name: 'Acero Inoxidable (Chatarra)', stock: 15000, unit: 'kg', min_stock: 1000 },
  { id: 'HierroGris', name: 'Arrabio/Hierro Gris', stock: 45, unit: 'ton', min_stock: 5 },
  { id: 'ArenaMoldeo', name: 'Arena de Moldeo', stock: 25, unit: 'm3', min_stock: 5 }
];

export const initialOperators: Operator[] = [
    { id: 'OP-01', name: 'Luis Hernandez', role: 'Operador de Horno' },
    { id: 'OP-02', name: 'Ana Torres', role: 'Moldeador' },
    { id: 'OP-03', name: 'Pedro Ramirez', role: 'Acabado' },
    { id: 'OP-04', name: 'Carlos Martinez', role: 'Operador de Horno' },
];

export const initialMachines: Machine[] = [
    { id: 'HI-01', name: 'Horno de Inducción 1', type: 'Horno de Inducción', status: 'Disponible' },
    { id: 'HI-02', name: 'Horno de Inducción 2', type: 'Horno de Inducción', status: 'Disponible' },
    { id: 'MOLD-01', name: 'Moldeadora Automática', type: 'Moldeadora', status: 'Disponible' },
    { id: 'GRAN-01', name: 'Granalladora', type: 'Granalladora', status: 'En Mantenimiento' },
];


export const products: Product[] = [
    { group: 'Minería y Agregados', name: 'Martillo (Minería)' },
    { group: 'Minería y Agregados', name: 'Mandíbula (Minería)' },
    { group: 'Minería y Agregados', name: 'Cono (Minería)' },
    { group: 'Minería y Agregados', name: 'Blindaje (Minería)' },
    { group: 'Minería y Agregados', name: 'Rotor (Minería)' },
    { group: 'Minería y Agregados', name: 'Barra de Choque (Minería)' },
    { group: 'Minería y Agregados', name: 'Zaranda (Minería)' },
    { group: 'Siderúrgica', name: 'Retenedor (Siderúrgica)' },
    { group: 'Siderúrgica', name: 'Rueda Puente Grúa (Siderúrgica)' },
    { group: 'Siderúrgica', name: 'Barra para Parrilla (Siderúrgica)' },
    { group: 'Construcción y Otros', name: 'Brazo Mezclador (Construcción)' },
    { group: 'Construcción y Otros', name: 'Paleta (Construcción)' },
    { group: 'Construcción y Otros', name: 'Impulsor Bomba (Construcción)' },
    { group: 'Construcción y Otros', name: 'Caracol de Extrusión (Ladrillera)' },
    { group: 'Servicios', name: 'Mecanizado de Pieza' },
    { group: 'Servicios', name: 'Corte por Plasma' },
];

export const initialProductionOrders: ProductionOrder[] = [
  {
    id: 'doc_1',
    op_id: 'COLADA-001',
    status: 'Terminada',
    product: 'Mandíbula (Minería)',
    qty: 50,
    materials: [{ materialId: 'ChatarraAcero', consumption: 10 }],
    targetWeek: CURRENT_WEEK - 1,
    client_id: 'C-001-MIN',
    operator_id: 'OP-01',
    machine_id: 'HI-01',
    priority: 'Media',
    job_type: 'Normal Production',
    start_time_est: new Date(new Date().setDate(new Date().getDate() - 7)).getTime(),
    end_time_est: new Date(new Date().setDate(new Date().getDate() - 7)).getTime() + 4 * 60 * 60 * 1000,
    start_time_real: new Date(new Date().setDate(new Date().getDate() - 7)).getTime() + 15 * 60 * 1000,
    end_time_real: new Date(new Date().setDate(new Date().getDate() - 7)).getTime() + 4 * 60 * 60 * 1000 + 30 * 60 * 1000,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 8)).getTime(),
    completionWeek: CURRENT_WEEK - 1,
  },
  {
    id: 'doc_2',
    op_id: 'COLADA-002',
    status: 'En Proceso',
    product: 'Martillo (Minería)',
    qty: 100,
    materials: [{ materialId: 'AltoCromo', consumption: 500 }],
    targetWeek: CURRENT_WEEK,
    client_id: 'C-002-SID',
    operator_id: 'OP-04',
    machine_id: 'HI-02',
    priority: 'Alta',
    job_type: 'Normal Production',
    start_time_est: new Date(new Date().setDate(new Date().getDate() - 1)).getTime(),
    end_time_est: new Date().getTime() + 2 * 60 * 60 * 1000,
    start_time_real: new Date(new Date().setDate(new Date().getDate() - 1)).getTime() + 5 * 60 * 1000,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).getTime(),
    startWeek: CURRENT_WEEK,
  },
  {
    id: 'doc_3',
    op_id: 'COLADA-003',
    status: 'Pendiente',
    product: 'Brazo Mezclador (Construcción)',
    qty: 20,
    materials: [{ materialId: 'HierroGris', consumption: 2 }],
    targetWeek: CURRENT_WEEK,
    client_id: 'C-003-CON',
    priority: 'Media',
    job_type: 'Normal Production',
    start_time_est: new Date().getTime() + 1 * 60 * 60 * 1000,
    end_time_est: new Date().getTime() + 5 * 60 * 60 * 1000,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).getTime(),
  },
  {
    id: 'doc_4',
    op_id: 'COLADA-004',
    status: 'Crítico',
    product: 'Rueda Puente Grúa (Siderúrgica)',
    qty: 4,
    materials: [{ materialId: 'Manganeso', consumption: 1500 }],
    targetWeek: CURRENT_WEEK,
    client_id: 'C-002-SID',
    operator_id: 'OP-01',
    machine_id: 'HI-01',
    priority: 'Alta',
    job_type: 'Express/Small Job',
    start_time_est: new Date(new Date().setDate(new Date().getDate() - 2)).getTime(),
    end_time_est: new Date(new Date().setDate(new Date().getDate() - 1)).getTime(),
    start_time_real: new Date(new Date().setDate(new Date().getDate() - 2)).getTime(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).getTime(),
    startWeek: CURRENT_WEEK,
  },
];

export const initialIncidents: Incident[] = [
    {
        id: 'inc_1',
        type: 'Falla Equipo',
        description: 'Horno de inducción principal sobrecalentado. Se detuvo la operación por 2 horas.',
        op_id: 'COLADA-004',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).getTime()
    },
    {
        id: 'inc_2',
        type: 'Calidad',
        description: 'Muestra de la primera colada del día arrojó composición fuera de especificaciones. Se requiere ajuste de aleación.',
        op_id: 'COLADA-002',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).getTime() + 2 * 60 * 60 * 1000
    }
];
