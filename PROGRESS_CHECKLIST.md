# PROGRESS CHECKLIST — Pebble MVP

> Actualizar estado de cada tarea inmediatamente después de completarla.

- [x] **Fase 0 — Setup de infraestructura**
  - [x] Proyecto con estructura `backend/` y `frontend/`
  - [x] Sistema de diseño implementado (Tactile Physicality System)
  - [ ] Proyecto de Firebase creado (Firestore + Auth + Storage habilitados)
  - [ ] Cuenta de OpenRouter + API key de DeepSeek configurada
  - [ ] Dominio comprado en Spaceship

- [x] **Fase 1 — Backend skeleton**
  - [x] FastAPI app con estructura de carpetas (routers, services, models)
  - [x] Middleware de validación de Firebase ID token
  - [x] Conexión a Firestore vía Firebase Admin SDK (con fallback en memoria)
  - [x] Servicio de IA (DeepSeek vía OpenRouter) con fallback local

- [x] **Fase 2 — Modelo de datos y contenido semilla**
  - [x] Schemas Pydantic definidos (usuarios, piedritas, escenarios, islas)
  - [x] Banco mínimo de escenarios cargado (3 playa + 3 acantilado + 3 glaciar + 1 tutorial)
  - [x] Islas de hielo definidas con sus umbrales de piedritas

- [x] **Fase 3 — Integración de IA**
  - [x] Servicio `ai_pebble.py` con system prompt versionado
  - [x] Endpoint `/api/checklist/evaluate` funcional con salida JSON estructurada
  - [x] Manejo de errores/reintentos ante fallos de OpenRouter (fallback local)

- [x] **Fase 4 — Frontend skeleton**
  - [x] Proyecto Vite + React + Tailwind inicial con sistema de diseño completo
  - [x] Routing entre pantallas (onboarding, tutorial, juego, checklist, nido)
  - [x] Cliente de Firebase Auth integrado (con dev mode)

- [x] **Fase 5 — Onboarding**
  - [x] Pantalla de bienvenida a Pebble
  - [x] Quiz de 3 preguntas con lógica de puntaje
  - [x] Asignación visual del nido inicial (playa/acantilado/glaciar)

- [x] **Fase 6 — Loop principal del juego**
  - [x] Pantalla de escenario con interacción de búsqueda de pistas (tocar imagen)
  - [x] Validación de toques contra coordenadas con tolerancia de radio
  - [x] Checklist dinámico antes de compartir (preguntas variables según pistas)
  - [x] Otorgamiento de piedritas conectado al backend

- [x] **Fase 7 — Vista del nido**
  - [x] Visualización de piedritas por categoría/color (privacidad, impulsividad, datos_sensibles)
  - [x] Mapa de islas con progreso y desbloqueo

- [x] **Fase 8 — Landing page**
  - [x] Hero, problema/visión, cómo funciona, CTA
  - [x] Stats, features grid, footer

- [ ] **Fase 9 — Deployment final**
  - [ ] Backend y frontend desplegados en Cloud Run
  - [ ] DNS de Spaceship apuntando correctamente
  - [ ] Variables de entorno/secrets configurados en producción

- [ ] **Fase 10 — QA contra criterios de aceptación**
  - [ ] Quiz → nivel asignado correctamente
  - [ ] Tutorial sin errores (no otorga piedritas)
  - [ ] Escenario jugable: búsqueda → checklist → piedrita
  - [ ] Reacción de Pebble por DeepSeek (o fallback local)
  - [ ] Nido visualiza piedritas y desbloquea islas
  - [ ] Sin lenguaje de seguridad/riesgo
  - [ ] Sin procesamiento de fotos reales del niño
  - [ ] Landing desplegada con CTA funcional
