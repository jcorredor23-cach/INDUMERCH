# SteelFlow - InduControl (Industria 4.0)
### Sistema de Soporte a la Decisión (DSS) basado en IA Generativa para Plantas de Fundición

SteelFlow es una plataforma integral para la optimización de procesos en entornos de metalmecánica y fundición, integrando control estadístico tradicional con Inteligencia Artificial de última generación.

## 🚀 Funcionalidades Principales
- **Análisis Predictivo de Stock:** Algoritmos que razonan sobre la carga de trabajo semanal para predecir faltantes mediante IA Generativa.
- **Diagnóstico IA de Incidentes:** Análisis de impacto no-determinístico para evaluar retrasos en coladas y sugerir acciones correctivas.
- **Control Estadístico Moderno:** Implementación de Diagramas de Pareto para la identificación de causas raíz en fallas de planta.
- **Gestión de Recursos JIT:** Asignación dinámica de operarios y maquinaria basada en disponibilidad en tiempo real.
- **Gestión de Proveedores:** Registro y vinculación de proveedores de mantenimiento y materia prima.

## 🛠️ Stack Tecnológico
- **Frontend:** Next.js 15 (App Router) + TypeScript.
- **Estilos:** Tailwind CSS + Shadcn/UI.
- **Orquestación de IA:** Google Genkit.
- **Modelo de Lenguaje:** Google Gemini Pro 1.5.
- **Visualización:** Recharts.

## 🤖 Desarrollo Agéntico (Claude Code)
Este proyecto está diseñado para flujos de trabajo con **IA Agéntica**. 
1. Extraer el código mediante descarga o Git.
2. Instalar dependencias: `npm install`.
3. Iniciar Claude Code: `npm install -g @anthropic-ai/claude-code` y luego ejecutar `claude`.

## 💻 Configuración Local
1. Instalar dependencias: `npm install`
2. Configurar variables de entorno en `.env` (API Keys de Gemini y Firebase).
3. Iniciar servidor de desarrollo: `npm run dev`
4. Iniciar entorno Genkit: `npm run genkit:dev`

---
*SteelFlow - Optimizando la eficiencia industrial mediante inteligencia predictiva.*
