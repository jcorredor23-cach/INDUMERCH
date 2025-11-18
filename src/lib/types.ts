export interface Material {
  id: string;
  name: string;
  stock: number;
  unit: 'ton' | 'kg' | 'm3';
  min_stock: number;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
}

export interface Operator {
  id: string;
  name: string;
  role: 'Operador de Horno' | 'Moldeador' | 'Acabado';
}

export interface Machine {
  id: string;
  name: string;
  type: 'Horno de Inducción' | 'Moldeadora' | 'Granalladora';
  status: 'Disponible' | 'En Uso' | 'En Mantenimiento';
}

export type ProductionOrderStatus = 'Pendiente' | 'En Proceso' | 'Crítico' | 'Terminada';

export interface MaterialConsumption {
  materialId: string;
  consumption: number;
}

export interface ProductionOrder {
  id: string; // This will be the doc ID for manipulation
  op_id: string; // Human-readable ID e.g. COLADA-001
  status: ProductionOrderStatus;
  product: string;
  qty: number;
  materials: MaterialConsumption[];
  targetWeek: number;
  client_id: string;
  operator_id?: string;
  machine_id?: string;
  priority: 'Baja' | 'Media' | 'Alta';
  job_type: 'Normal Production' | 'Express/Small Job';
  start_time_est: number;
  end_time_est: number;
  start_time_real?: number;
  end_time_real?: number;
  createdAt: number;
  startWeek?: number;
  completionWeek?: number;
}

export interface Incident {
  id: string;
  type: 'Falla Equipo' | 'Error Humano' | 'Retraso MP' | 'Calidad' | 'Otro';
  description: string;
  op_id?: string;
  timestamp: number;
}

export interface Product {
    group: string;
    name: string;
}

    