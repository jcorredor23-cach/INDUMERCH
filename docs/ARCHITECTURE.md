# Especificación Técnica: SteelFlow - InduControl

## 1. Visión General
**SteelFlow** es una plataforma de gestión industrial diseñada para la optimización de procesos en fundiciones y metalmecánica. Integra Inteligencia Artificial para la toma de decisiones proactiva.

## 2. Stack Tecnológico
- **Frontend:** Next.js 15 (App Router), React 18, TypeScript.
- **Estilos:** Tailwind CSS con sistema de diseño Shadcn/UI.
- **IA Engine:** Google Genkit + Gemini Pro 1.5 (LLM).
- **Gráficos:** Recharts (Análisis Estadístico).

## 3. Arquitectura de Software
### 3.1. Server-Side Logic (Genkit Flows)
Los procesos de IA están desacoplados de la interfaz mediante **Genkit Flows**. Esto permite:
- **Encapsulamiento:** La lógica de predicción y análisis reside en flujos definidos (`predictiveStockAlerts`, `exceptionImpactAnalysis`).
- **Validación de Esquemas:** Uso de **Zod** para garantizar que los datos de entrada y salida de la IA cumplan con los estándares industriales.

### 3.2. Estrategia de UI/UX
- **Diseño Atómico:** Componentes reutilizables que aseguran consistencia visual.
- **Reactividad:** Uso de Hooks personalizados para la gestión de estados complejos (inventario, órdenes, incidentes).

## 4. Conceptos de Ingeniería Industrial Aplicados
- **Control Estadístico de Procesos (CEP):** Implementación de Gráficos de Pareto para identificar el 20% de las causas que generan el 80% de los retrasos.
- **Gestión de Inventarios JIT (Just-In-Time):** Alertas predictivas que calculan el punto de reorden basado en la carga de trabajo planificada.
- **Teoría de Restricciones (TOC):** Identificación visual de cuellos de botella mediante estados críticos en el tablero Kanban.

## 5. Escalabilidad y Futuro
El sistema está diseñado para integrarse con sensores **IoT (Internet of Things)** para capturar datos en tiempo real de los hornos y máquinas, alimentando el modelo de IA con datos vivos del piso de planta.
