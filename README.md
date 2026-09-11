# SteelFlow - InduControl (Industria 4.0)
### Sistema de Soporte a la Decisión (DSS) basado en IA Generativa para Plantas de Fundición

Este proyecto fue desarrollado como una solución de vanguardia para la optimización de procesos en entornos de metalmecánica y fundición, integrando conceptos de **Ingeniería Industrial** con **Inteligencia Artificial de última generación**.

---

## 🎓 Ponencia: Seminario de Ingeniería - Universidad Distrital

Este software representa la convergencia entre el control estadístico de procesos tradicional y el paradigma de la **Industria 4.0**.

### 🧠 Innovaciones Principales
- **Análisis Predictivo de Stock:** Algoritmos que razonan sobre la carga de trabajo semanal para predecir faltantes antes de que ocurran.
- **Diagnóstico IA de Incidentes:** Análisis de impacto no-determinístico para evaluar retrasos en coladas y sugerir acciones correctivas inmediatas.
- **Control Estadístico Moderno:** Implementación digital de Diagramas de Pareto para la identificación de los "pocos vitales" en las fallas de planta.
- **Gestión de Recursos JIT:** Asignación dinámica de operarios y maquinaria basada en disponibilidad en tiempo real.

### 🛠️ Stack Tecnológico
- **Frontend:** Next.js 15 (App Router) + TypeScript (Tipado estricto para procesos críticos).
- **Estilos:** Tailwind CSS + Shadcn/UI (Diseño industrial moderno y responsivo).
- **Orquestación de IA:** Google Genkit.
- **Modelo de Lenguaje:** Google Gemini Pro 1.5.
- **Visualización:** Recharts (Análisis cuantitativo).

---

## 🚀 Cómo subir este proyecto a tu GitHub

Para presentar el código en tu ponencia, sigue estos pasos en tu terminal:

1. **Crear el repositorio en GitHub:** Ve a GitHub y crea un nuevo repositorio vacío (ej. `steelflow-inducontrol`).
2. **Inicializar y subir el código:**
   ```bash
   # Inicializar git
   git init

   # Añadir los archivos
   git add .

   # Realizar el primer commit
   git commit -m "Initial commit: SteelFlow InduControl MVP para Universidad Distrital"

   # Vincular con tu repositorio (reemplaza con tu URL)
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

   # Renombrar rama a main y subir
   git branch -M main
   git push -u origin main
   ```

---

## 💻 Desarrollo Local

1. Instalar dependencias: `npm install`
2. Configurar variables de entorno en `.env` (API Keys de Gemini).
3. Iniciar servidor de desarrollo: `npm run dev`
4. Iniciar entorno Genkit: `npm run genkit:dev`

---
*Desarrollado para la excelencia académica y la transformación digital industrial.*