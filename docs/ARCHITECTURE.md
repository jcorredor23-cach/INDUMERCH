# Especificación Técnica: SteelFlow - InduControl

## 1. Visión General
**SteelFlow** es una plataforma de gestión industrial diseñada para la optimización de procesos en fundiciones y metalmecánica. Integra Inteligencia Artificial para la toma de decisiones proactiva y gestión eficiente de recursos.

## 2. Stack Tecnológico
- **Frontend:** Next.js 15 (App Router), React 18, TypeScript.
- **Estilos:** Tailwind CSS con sistema de diseño Shadcn/UI.
- **IA Engine:** Google Genkit + Gemini Pro 1.5 (LLM).
- **Gráficos:** Recharts (Análisis Estadístico).

## 3. Arquitectura de Software
### 3.1. Server-Side Logic (Genkit Flows)
Los procesos de IA están desacoplados de la interfaz mediante **Genkit Flows**. Esto permite:
- **Encapsulamiento:** La lógica de predicción y análisis reside en flujos definidos (`predictiveStockAlerts`, `exceptionImpactAnalysis`).
- **Validación de Esquemas:** Uso de **Zod** para garantizar la integridad de los datos industriales.

### 3.2. Estrategia de UI/UX
- **Diseño Atómico:** Componentes reutilizables que aseguran consistencia visual y mantenibilidad.
- **Reactividad:** Gestión de estados complejos para inventario, órdenes e incidentes en tiempo real.

## 4. Conceptos Industriales Implementados
- **Control Estadístico de Procesos (CEP):** Gráficos de Pareto para identificación de causas raíz.
- **Gestión de Inventarios JIT (Just-In-Time):** Alertas predictivas de reorden basadas en demanda planificada.
- **Teoría de Restricciones (TOC):** Identificación de cuellos de botella mediante estados críticos y tablero Kanban.

## 5. Roadmap de Evolución
- Integración con sensores **IoT** para captura de datos en tiempo real de hornos.
- Módulo de mantenimiento preventivo basado en horas de uso de maquinaria.
- Optimización de rutas de logística para proveedores vinculados.
