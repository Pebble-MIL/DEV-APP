# PEBBLE — MASTER PROMPT PARA CONSTRUCCIÓN AUTÓNOMA DEL MVP

> Este documento es un prompt completo para un agente de IA de codificación (Claude Code, Cursor, etc.). Contiene todo el contexto de producto, arquitectura, modelo de datos, mecánica de juego y plan de ejecución necesario para construir el MVP de Pebble de punta a punta, sin ambigüedad. Ejecuta fase por fase, actualizando `PROGRESS_CHECKLIST.md` (ver sección 14) después de cada tarea completada.

---

## 1. Contexto y visión del producto

**Pebble** es una web app educativa enfocada en **MIL (Alfabetización Mediática e Informacional)** para niños. Ayuda a los usuarios a desarrollar pensamiento crítico sobre qué información comparten en línea, sin usar lenguaje de seguridad informática ni de riesgo explícito.

**El personaje central:** Pebble es un pingüino joven, influencer dentro de su colonia, todavía torpe y aprendiendo. El usuario es su ayudante — juntos construyen el primer nido de Pebble recolectando "piedritas" (pebbles). Cada piedrita representa una buena práctica de MIL aplicada correctamente.

**Principio de diseño no negociable:** todo el lenguaje de cara al usuario debe evitar términos de seguridad/riesgo ("vulnerabilidad", "amenaza", "exposición", "ataque"). En su lugar se usa el vocabulario del universo de Pebble: piedritas, nido, islas de hielo, pistas escondidas. Pebble nunca regaña; es torpe y necesita ayuda — el niño tiene un rol activo de mentor, no de evaluado.

**Público objetivo:** niños (target aproximado 8-13 años). Esto implica: tono cálido en todo momento, cero fricción tipo "formulario corporativo", contenido visual simple y expresivo, y cumplimiento estricto de la regla de nunca usar contenido real del usuario para el análisis de riesgo (ver sección 8).

---

## 2. Stack técnico obligatorio

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| IA | DeepSeek vía OpenRouter — analiza decisiones del checklist y simula la voz conversacional de Pebble |
| Base de datos + Auth + Storage | Firebase (Firestore + Firebase Auth + Firebase Storage) |
| Hosting (backend + frontend) | Cloud Run |
| Landing page | Firebase Static Hosting |
| Dominio | Spaceship |

No sustituir ninguna pieza de este stack sin justificación explícita al usuario. No introducir un ORM SQL — Firestore es NoSQL, el modelo de datos de la sección 5 está diseñado como documentos/colecciones, no tablas.

---

## 3. Arquitectura general

```
[Landing (Firebase Static Hosting)] → CTA "Comienza gratis" → [App React en Cloud Run]
                                                                      │
                                                    ┌─────────────────┴─────────────────┐
                                                    │                                     │
                                          [Firebase Auth]                      [FastAPI en Cloud Run]
                                                    │                                     │
                                                    │                     ┌───────────────┼───────────────┐
                                                    │                     │               │               │
                                            [Firestore]           [Firebase Storage]  [OpenRouter/DeepSeek]
                                        (usuarios, piedritas,     (assets del banco    (evaluación de
                                         escenarios, islas)        de práctica)         checklist + voz de Pebble)
```

- El frontend nunca llama directo a OpenRouter/DeepSeek — todo pasa por el backend FastAPI, que guarda la API key de OpenRouter como variable de entorno server-side.
- El frontend se autentica contra Firebase Auth (SDK cliente) y manda el ID token en cada request al backend; el backend lo valida con Firebase Admin SDK.
- El backend es el único que escribe en Firestore (para mantener consistencia del sistema de puntos y evitar manipulación de piedritas desde el cliente).

---

## 4. Modelo de datos (Firestore)

```
users/{uid}
  - displayName: string
  - ageRange: string            // "8-10" | "11-13", sin pedir fecha de nacimiento exacta
  - parentEmail: string | null  // opcional, para reporte futuro (fuera de MVP, pero reservar el campo)
  - createdAt: timestamp
  - nestLevel: "playa" | "acantilado" | "glaciar"
  - totalPebbles: number
  - unlockedIslandIds: string[]

users/{uid}/quizResults/{quizId}
  - answers: [{ questionId: string, optionSelected: "A"|"B"|"C", points: number }]
  - totalScore: number           // 0-6
  - nestLevelAssigned: string
  - completedAt: timestamp

users/{uid}/pebbles/{pebbleId}
  - category: "privacidad" | "impulsividad" | "datos_sensibles"
  - colorCode: string            // mapea a paleta visual, ver sección 11
  - scenarioId: string           // referencia al escenario de origen
  - checklistAnswers: [{ question: string, userChoice: string }]
  - awardedByAI: boolean         // true si DeepSeek confirmó el otorgamiento
  - earnedAt: timestamp

scenarios/{scenarioId}
  - type: "photo" | "message"
  - nestLevelTarget: "playa" | "acantilado" | "glaciar"
  - mediaUrl: string             // Firebase Storage, SIEMPRE contenido de banco, nunca real
  - promptText: string           // el mensaje o contexto que Pebble presenta
  - hiddenClues: [{
      clueId: string,
      category: "privacidad" | "impulsividad" | "datos_sensibles",
      coordinates: { x: number, y: number, radius: number } | null,  // para type=photo
      textSpan: { start: number, end: number } | null,                // para type=message
      explanation: string        // lo que Pebble dice cuando el niño encuentra la pista
    }]
  - difficulty: number           // 1-3, correlaciona con nestLevelTarget

islands/{islandId}
  - name: string
  - order: number
  - requiredPebbles: number
  - unlockedContentId: string    // referencia a capítulo de historia/ilustración a desbloquear
```

---

## 5. Mecánica del juego, detallada paso a paso

### 5.1 Quiz de bienvenida (determina el nido inicial)

Tres preguntas fijas para el MVP, cada una con 3 opciones y puntaje asociado. Guion exacto a implementar:

**P1 — Exposición de información personal**
Pebble: "¡Encontré una roca brillante frente a mi cueva! Quiero mostrarla a todos mis amigos pingüinos. ¿Le tomo la foto donde se vea mi cueva también?"
- A) "¡Sí! Así todos ven dónde vives" → 0 pts
- B) "Mejor solo la roca, tu cueva es tuya" → 2 pts
- C) "No sé, ¿importa?" → 1 pt

**P2 — Pensar antes de compartir (impulsividad)**
Pebble: "¡Estoy MUY enojado! Otro pingüino me quitó mi pescado. Quiero contárselo a TODA la colonia ahora mismo. ¿Qué hago?"
- A) "Cuéntalo ya, que todos sepan" → 0 pts
- B) "Respira primero, y después decides si lo cuentas" → 2 pts
- C) "Cuéntaselo solo a tu mejor amigo" → 1 pt

**P3 — Detección de datos sensibles**
Pebble: "Un pingüino que no conozco me preguntó cómo me llamo, dónde queda mi nido y a qué hora salgo a nadar. ¡Qué amigable! ¿Le respondo todo?"
- A) "Sí, es de buena educación responder" → 0 pts
- B) "Puedes decirle tu nombre de juego, pero lo demás no" → 2 pts
- C) "Respóndele solo dónde nadas" → 0 pts

**Sistema de puntaje (rango 0-6):**
- 0-2 pts → **Nido de playa** (nivel inicial): piedritas grandes y fáciles de encontrar, escenarios muy explícitos.
- 3-4 pts → **Nido de acantilado** (nivel medio): piedritas medianas, escenarios con datos sensibles menos obvios (uniformes escolares, reflejos, metadatos visuales).
- 5-6 pts → **Nido de glaciar** (nivel avanzado): piedritas escondidas, escenarios con inferencia (info que combinada revela ubicación, patrones de rutina).

El resultado se guarda en `users/{uid}/quizResults` y define `nestLevel` en el documento del usuario, que a su vez filtra qué `scenarios` se sirven después.

### 5.2 Tutorial guiado

Antes del primer escenario "real" del nivel asignado, se corre **un escenario fijo de tutorial** (no cuenta para piedritas) donde el flujo completo se explica paso a paso con overlays: "Toca donde creas que hay una pista escondida", "Aquí Pebble te va a preguntar si hizo bien o mal", "Cada pista buena se convierte en una piedrita para tu nido". Este tutorial es obligatorio la primera vez que el usuario entra y se puede saltar en sesiones futuras.

### 5.3 Loop principal del juego (por escenario)

1. Backend sirve un escenario (`GET /api/scenarios/next`) filtrado por `nestLevel` del usuario, excluyendo los ya completados.
2. Frontend muestra la foto o el mensaje de práctica con el `promptText` de Pebble.
3. El niño toca zonas de la imagen (o selecciona fragmentos de texto en el mensaje) buscando pistas.
4. Cada toque se valida contra `hiddenClues` de ese escenario (por coordenadas con tolerancia de radio, o por rango de texto). Si acierta, Pebble reacciona con la `explanation` de esa pista.
5. Al terminar de buscar (todas las pistas encontradas o el niño decide continuar), se abre el **checklist antes de compartir**.

### 5.4 Checklist antes de compartir (número de preguntas variable)

La cantidad de preguntas del checklist es igual a la cantidad de pistas/datos sensibles detectados en ese escenario (no un número fijo). Cada pregunta la formula Pebble en primera persona, pensando en voz alta, y el niño lo ayuda a decidir si esa decisión estuvo bien o mal:

Ejemplo de patrón (una pregunta por cada pista encontrada):
> Pebble: "Encontré que en esta foto se ve el reflejo de mi cueva en el hielo. Si la comparto así, ¿crees que hice bien o mal?"
> Opciones: "Hiciste bien" / "Mejor edítala antes" / "No sé, explícame"

El backend envía las respuestas del niño para cada pregunta (`POST /api/checklist/evaluate`), que dispara la llamada a DeepSeek (ver sección 7) para generar la reacción conversacional de Pebble y decidir si se otorga la piedrita.

### 5.5 Otorgamiento de piedritas y crecimiento del nido

Cada pista bien manejada en el checklist se convierte en una piedrita (`users/{uid}/pebbles`), con color según su categoría. La vista del nido (`GET /api/nest/{uid}`) agrega piedritas por categoría y calcula progreso hacia la siguiente isla. Al alcanzar `requiredPebbles` de una isla, se desbloquea (`POST /api/islands/unlock-check`) y se revela el siguiente capítulo de la historia.

---

## 6. Backend — Endpoints FastAPI

```
POST   /api/auth/verify              → valida el ID token de Firebase, crea el doc de usuario si no existe
POST   /api/quiz/submit              → recibe respuestas del quiz, calcula score y nestLevel, guarda resultado
GET    /api/scenarios/next           → retorna el siguiente escenario según nestLevel del usuario
POST   /api/scenarios/{id}/attempt   → valida un toque/selección contra hiddenClues, retorna acierto/error + explicación
POST   /api/checklist/evaluate       → recibe respuestas del checklist, llama a DeepSeek, retorna feedback + otorgamiento de piedrita
GET    /api/nest/{uid}               → retorna piedritas agrupadas por categoría + islas desbloqueadas + progreso
POST   /api/islands/unlock-check     → verifica si se cumple el umbral de piedritas y desbloquea la siguiente isla
GET    /api/tutorial/scenario        → retorna el escenario fijo de tutorial (no otorga piedritas)
```

Todos los endpoints (excepto `/api/tutorial/scenario`) requieren header `Authorization: Bearer {firebase_id_token}`, validado con Firebase Admin SDK como dependencia de FastAPI.

---

## 7. Integración de IA (DeepSeek vía OpenRouter)

**Uso 1 — Evaluar el checklist y decidir el otorgamiento de la piedrita.**
**Uso 2 — Generar la reacción conversacional de Pebble en primera persona** (no una respuesta genérica de sistema).

System prompt base para el servicio de IA (mantener como constante versionada en el backend, no hardcodeado inline en cada llamada):

```
Eres Pebble, un pingüino joven, torpe y curioso, ayudante en aprender sobre buen uso
de información en línea. Hablas siempre en primera persona, con calidez, nunca regañas.
Tu tono es el de alguien aprendiendo junto al niño, no el de un evaluador.

Reglas estrictas:
- Nunca uses palabras como "riesgo", "peligro", "vulnerabilidad", "amenaza", "exposición".
- Usa el vocabulario del universo Pebble: piedritas, nido, pistas, colonia, hielo.
- Si la decisión del niño en el checklist fue correcta, celebra de forma breve y específica
  (qué hizo bien, no solo "bien hecho").
- Si la decisión fue incorrecta, no la señales como error — ofrece una alternativa
  ("la próxima vez podríamos intentar...") y NO otorgues la piedrita en ese caso.
- Responde siempre en JSON estructurado, nunca en prosa libre fuera del JSON.
- Nunca menciones que eres una IA, un modelo de lenguaje, o que esto es una evaluación.
```

Formato de salida esperado (structured output / function calling contra el endpoint de OpenRouter):

```json
{
  "award_pebble": true,
  "pebble_color_category": "privacidad",
  "pebble_feedback_text": "¡Qué bien pensado! Guardaste tu cueva en secreto, como hacen los pingüinos sabios.",
  "tone": "celebratory"
}
```

El backend nunca expone la API key de OpenRouter al frontend; toda llamada pasa por un servicio interno (`services/ai_pebble.py` o equivalente) que centraliza el system prompt, maneja reintentos, y sanea la salida antes de devolverla al cliente.

---

## 8. Banco de contenido (escenarios de práctica)

**Regla no negociable:** todas las fotos y mensajes usados en el juego son ilustraciones o ejemplos ficticios pre-cargados en Firebase Storage y catalogados en `scenarios`. Nunca se solicita ni se procesa una foto real del niño ni datos reales de terceros. Esto elimina de raíz cualquier preocupación de privacidad de datos de menores y simplifica el cumplimiento (COPPA y equivalentes) porque el sistema nunca recibe ni analiza contenido personal identificable.

Para el MVP, el banco mínimo necesario es:
- 3 escenarios tipo "playa" (nivel inicial, pistas grandes y explícitas)
- 3 escenarios tipo "acantilado" (nivel medio)
- 3 escenarios tipo "glaciar" (nivel avanzado, pistas por inferencia)
- 1 escenario fijo de tutorial

Cada escenario necesita su documento en `scenarios` con `hiddenClues` ya anotadas (coordenadas o spans de texto) antes de lanzar — este es contenido curado manualmente, no generado en tiempo real por la IA en el MVP.

---

## 9. Pantallas del MVP

1. **Landing page** (Firebase Static Hosting, separada de la app):
   - Hero con Pebble y la promesa central ("ayuda a Pebble a construir su nido mientras aprendes a cuidar tu información")
   - Sección de problema/visión (MIL para niños, sin mencionar "seguridad" en el copy)
   - Cómo funciona (3-4 pasos ilustrados: conoce a Pebble → busca pistas → construye tu nido → desbloquea islas)
   - Sección "sobre el proyecto" (breve, tono de propósito educativo)
   - CTA "Comienza gratis" → redirige a la app (Cloud Run)
   - Footer simple

2. **Onboarding**: introducción a Pebble (animación/ilustración estática está bien para MVP) → quiz de 3 preguntas → revelación del tipo de nido asignado

3. **Tutorial**: escenario fijo guiado paso a paso con overlays explicativos

4. **Pantalla de juego**: escenario (foto/mensaje) + interacción de buscar pistas + reacciones de Pebble

5. **Checklist antes de compartir**: preguntas dinámicas (una por pista encontrada) con las opciones de decisión

6. **Vista del nido**: colección visual de piedritas agrupadas por categoría/color + mapa de islas de hielo desbloqueadas + progreso hacia la siguiente

---

## 10. Sistema de diseño visual (dirección, no implementación pixel-perfect en MVP)

- Paleta fría pero cálida: azules/blancos de hielo como base, con acentos cálidos (coral, amarillo) para las piedritas y momentos de celebración — evitar que se sienta clínico o corporativo.
- Tipografía redondeada, amigable, legible para niños (peso medium/bold en títulos, nunca condensada).
- Ilustraciones planas, sin fotorrealismo — Pebble es un personaje ilustrado, no un render 3D.
- Ningún ícono ni copy de seguridad informática (candados, escudos, alertas rojas) en ninguna pantalla.
- Micro-animaciones simples (piedrita que "vuela" al nido, Pebble reaccionando) — usar CSS transitions, no librerías pesadas de animación en el MVP.

---

## 11. Autenticación y privacidad

- Firebase Auth para login — para el público infantil, evaluar login simplificado (código/PIN provisto por un adulto, o cuenta vinculada a email de un padre) en vez de email/password propio del niño. Para el MVP mínimo, Firebase Auth anónimo o con email del adulto responsable es aceptable.
- Campo `parentEmail` reservado en el modelo de datos aunque no se use activamente en el MVP (para reporte futuro, fuera de alcance ahora).
- Ningún dato biométrico, foto real, o ubicación real del dispositivo se solicita o almacena en ningún punto del MVP.
- Firebase Storage solo almacena los assets del banco de práctica (curados por el equipo), nunca uploads de usuarios.

---

## 12. Deployment

- **Backend (FastAPI)**: Dockerfile estándar, desplegado en Cloud Run, variables de entorno (`OPENROUTER_API_KEY`, credenciales de Firebase Admin SDK) gestionadas como secrets de Cloud Run, no en el repo.
- **Frontend (React + Vite)**: build estático servido también en Cloud Run (o alternativamente Firebase Static Hosting si se prefiere simplificar — decidir uno y documentarlo en el checklist).
- **Landing page**: Firebase Static Hosting, separada del bundle de la app para mantener el tiempo de carga inicial mínimo.
- **Dominio**: comprado en Spaceship, apuntado vía DNS a Cloud Run (backend/app) y Firebase Hosting (landing) según corresponda — documentar los registros DNS exactos usados una vez configurados.

---

## 13. Fuera de alcance del MVP (v2, no construir ahora)

- Historia ramificada más larga con múltiples mentores/personajes adicionales a Pebble
- Modo para padres/docentes con reporte de progreso
- Contenido generado dinámicamente por IA (los escenarios del MVP son curados manualmente)
- Extensión de navegador o bloqueo real de redes sociales
- Sistema de notificaciones push
- Multijugador o comparación social entre nidos

---

## 14. Plan de ejecución por fases (mantener `PROGRESS_CHECKLIST.md` actualizado)

Crear en la raíz del repo un archivo `PROGRESS_CHECKLIST.md` con estas fases como checklist marcable. Actualizar el estado de cada tarea (`[ ]` → `[x]`) inmediatamente después de completarla, no al final de la sesión.

```
- [ ] Fase 0 — Setup de infraestructura
      - [ ] Proyecto de Firebase creado (Firestore + Auth + Storage habilitados)
      - [ ] Repo con estructura backend/ y frontend/
      - [ ] Cuenta de OpenRouter + API key de DeepSeek configurada
      - [ ] Dominio comprado en Spaceship

- [ ] Fase 1 — Backend skeleton
      - [ ] FastAPI app inicial con estructura de carpetas (routers, services, models)
      - [ ] Middleware de validación de Firebase ID token
      - [ ] Conexión a Firestore vía Firebase Admin SDK

- [ ] Fase 2 — Modelo de datos y contenido semilla
      - [ ] Colecciones de Firestore creadas según sección 5
      - [ ] Banco mínimo de escenarios cargado (3 playa + 3 acantilado + 3 glaciar + 1 tutorial)
      - [ ] Islas de hielo definidas con sus umbrales de piedritas

- [ ] Fase 3 — Integración de IA
      - [ ] Servicio ai_pebble.py con system prompt versionado
      - [ ] Endpoint /api/checklist/evaluate funcional con salida JSON estructurada
      - [ ] Manejo de errores/reintentos ante fallos de OpenRouter

- [ ] Fase 4 — Frontend skeleton
      - [ ] Proyecto Vite + React + Tailwind inicial
      - [ ] Routing entre pantallas (onboarding, tutorial, juego, checklist, nido)
      - [ ] Cliente de Firebase Auth integrado

- [ ] Fase 5 — Onboarding
      - [ ] Pantalla de bienvenida a Pebble
      - [ ] Quiz de 3 preguntas con lógica de puntaje
      - [ ] Asignación visual del nido inicial

- [ ] Fase 6 — Loop principal del juego
      - [ ] Pantalla de escenario (foto/mensaje) con interacción de búsqueda de pistas
      - [ ] Validación de toques/selecciones contra hiddenClues
      - [ ] Checklist dinámico antes de compartir
      - [ ] Otorgamiento de piedritas conectado al backend

- [ ] Fase 7 — Vista del nido
      - [ ] Visualización de piedritas por categoría/color
      - [ ] Mapa de islas con progreso y desbloqueo

- [ ] Fase 8 — Landing page
      - [ ] Hero, problema/visión, cómo funciona, CTA
      - [ ] Deploy en Firebase Static Hosting

- [ ] Fase 9 — Deployment final
      - [ ] Backend y frontend desplegados en Cloud Run
      - [ ] DNS de Spaceship apuntando correctamente
      - [ ] Variables de entorno/secrets configurados en producción

- [ ] Fase 10 — QA contra criterios de aceptación (sección 15)
```

---

## 15. Criterios de aceptación del MVP

El MVP se considera completo cuando:

1. Un usuario nuevo puede completar el quiz de bienvenida y recibir un nivel de nido asignado correctamente según el puntaje.
2. El tutorial guiado corre sin errores y no otorga piedritas.
3. Al menos un escenario de cada nivel (playa/acantilado/glaciar) es jugable de principio a fin: búsqueda de pistas → checklist → otorgamiento de piedrita.
4. La reacción de Pebble en el checklist es generada por DeepSeek en tiempo real (no texto hardcodeado) y respeta el tono definido en la sección 7.
5. El nido visualiza correctamente las piedritas acumuladas por categoría y desbloquea al menos una isla al alcanzar el umbral.
6. Ninguna pantalla del producto usa lenguaje de seguridad/riesgo explícito en el copy visible al usuario.
7. Ningún flujo del producto solicita o procesa una foto o dato real del niño.
8. La landing page está desplegada y accesible desde el dominio de Spaceship, con el CTA funcional hacia la app.

---

*Fin del master prompt. Ejecutar fase por fase, confirmando cada criterio de la sección 15 antes de dar el MVP por terminado.*
