TUTORIAL_SCENARIO = {
    "id": "tutorial_01",
    "type": "photo",
    "nestLevelTarget": "playa",
    "mediaUrl": "",
    "promptText": "¡Mira esta foto que tomé! Quiero compartirla con la colonia. ¿Puedes ayudarme a encontrar qué cosas deberíamos revisar antes de publicarla?",
    "hiddenClues": [
        {
            "clueId": "tutorial_clue_1",
            "category": "privacidad",
            "coordinates": {"x": 180, "y": 218, "radius": 30},
            "textSpan": None,
            "explanation": "¡Aquí hay una ventana! Si se ve mi cueva, otros pingüinos sabrían dónde vivo. Mejor asegurarme de que no se vea.",
        }
    ],
    "difficulty": 1,
}

SCENARIOS = [
    {
        "id": "playa_01",
        "type": "photo",
        "nestLevelTarget": "playa",
        "mediaUrl": "",
        "promptText": "¡Encontré una roca brillante! ¿Le tomo la foto donde se vea mi cueva también?",
        "hiddenClues": [
            {
                "clueId": "playa_01_clue_1",
                "category": "privacidad",
                "coordinates": {"x": 160, "y": 260, "radius": 55},
                "textSpan": None,
                "explanation": "¡Oh! Ahí está mi cueva de fondo. Si la foto muestra dónde vivo, cualquier pingüino podría venir. ¿Mejor no mostrarla, verdad?",
            }
        ],
        "difficulty": 1,
    },
    {
        "id": "playa_02",
        "type": "message",
        "nestLevelTarget": "playa",
        "mediaUrl": "",
        "promptText": "Un pingüino nuevo me preguntó cómo me llamo. ¿Le digo mi nombre completo?",
        "hiddenClues": [
            {
                "clueId": "playa_02_clue_1",
                "category": "datos_sensibles",
                "coordinates": None,
                "textSpan": {"start": 10, "end": 35},
                "explanation": "¡Espera! No conocemos bien a ese pingüino. Decirle nuestro nombre completo a un desconocido no es buena idea. Mejor solo mi nombre de juego.",
            }
        ],
        "difficulty": 1,
    },
    {
        "id": "playa_03",
        "type": "photo",
        "nestLevelTarget": "playa",
        "mediaUrl": "",
        "promptText": "Mirá este selfie que me saqué con mi nuevo sombrero. ¿Está bien para subirlo?",
        "hiddenClues": [
            {
                "clueId": "playa_03_clue_1",
                "category": "privacidad",
                "coordinates": {"x": 440, "y": 135, "radius": 40},
                "textSpan": None,
                "explanation": "¡Veo el nombre de mi escuela en el fondo! Eso también es información privada. No quiero que sepan dónde paso mis días.",
            }
        ],
        "difficulty": 1,
    },
    {
        "id": "acantilado_01",
        "type": "photo",
        "nestLevelTarget": "acantilado",
        "mediaUrl": "",
        "promptText": "¡Miren! Me probé el uniforme nuevo del equipo de hockey. ¿Qué opinan de la foto?",
        "hiddenClues": [
            {
                "clueId": "acantilado_01_clue_1",
                "category": "datos_sensibles",
                "coordinates": {"x": 190, "y": 230, "radius": 50},
                "textSpan": None,
                "explanation": "El uniforme tiene el nombre de mi equipo y escuela. Sin darme cuenta, estoy diciendo dónde paso mis tardes. ¡Qué pista importante!",
            },
            {
                "clueId": "acantilado_01_clue_2",
                "category": "privacidad",
                "coordinates": {"x": 420, "y": 300, "radius": 40},
                "textSpan": None,
                "explanation": "El reflejo en el hielo muestra mi casa. ¡Dos pistas en una foto! Menos mal que las encontramos.",
            },
        ],
        "difficulty": 2,
    },
    {
        "id": "acantilado_02",
        "type": "message",
        "nestLevelTarget": "acantilado",
        "mediaUrl": "",
        "promptText": "¡Estoy muy enojado! Otro pingüino me quitó mi pescado. Quiero contarlo ya mismo en el grupo de la colonia.",
        "hiddenClues": [
            {
                "clueId": "acantilado_02_clue_1",
                "category": "impulsividad",
                "coordinates": None,
                "textSpan": {"start": 0, "end": 18},
                "explanation": "Cuando estamos enojados a veces decimos cosas que después lamentamos. Mejor respirar hondo y pensar antes de publicar.",
            },
            {
                "clueId": "acantilado_02_clue_2",
                "category": "datos_sensibles",
                "coordinates": None,
                "textSpan": {"start": 35, "end": 55},
                "explanation": "Contar esto a toda la colonia es demasiado. Si necesito ayuda, mejor hablo con un pingüino de confianza.",
            },
        ],
        "difficulty": 2,
    },
    {
        "id": "acantilado_03",
        "type": "photo",
        "nestLevelTarget": "acantilado",
        "mediaUrl": "",
        "promptText": "¡Terminé mi tarea! Le saqué una foto a mi cuaderno para mostrárselo a mis amigos.",
        "hiddenClues": [
            {
                "clueId": "acantilado_03_clue_1",
                "category": "datos_sensibles",
                "coordinates": {"x": 200, "y": 295, "radius": 60},
                "textSpan": None,
                "explanation": "¡Ahí se ve mi nombre completo y el de mi profesora! Esa información no debería estar visible para todo el mundo.",
            }
        ],
        "difficulty": 2,
    },
    {
        "id": "glaciar_01",
        "type": "photo",
        "nestLevelTarget": "glaciar",
        "mediaUrl": "",
        "promptText": "¡Qué día tan divertido! Miren todas las fotos que tomé hoy en la excursión.",
        "hiddenClues": [
            {
                "clueId": "glaciar_01_clue_1",
                "category": "datos_sensibles",
                "coordinates": {"x": 85, "y": 218, "radius": 20},
                "textSpan": None,
                "explanation": "El reloj que uso tiene el logo de mi club. Si varios pingüinos comparten fotos juntos, podrían deducir dónde nos juntamos cada semana.",
            },
            {
                "clueId": "glaciar_01_clue_2",
                "category": "privacidad",
                "coordinates": {"x": 475, "y": 208, "radius": 35},
                "textSpan": None,
                "explanation": "El cartel detrás de nosotros dice el nombre del lugar exacto. Esa info combinada con el horario del reloj... ¡cualquiera sabría nuestra rutina!",
            },
            {
                "clueId": "glaciar_01_clue_3",
                "category": "impulsividad",
                "coordinates": None,
                "textSpan": {"start": 0, "end": 15},
                "explanation": "Publicar todo de golpe sin revisar es tentador, pero cada foto cuenta algo de nosotros. Mejor revisar una por una.",
            },
        ],
        "difficulty": 3,
    },
    {
        "id": "glaciar_02",
        "type": "message",
        "nestLevelTarget": "glaciar",
        "mediaUrl": "",
        "promptText": "Mira lo que me contaron: el pingüino mayor dijo que mañana van a inspeccionar todos los nidos del sector norte. ¡Corre la voz!",
        "hiddenClues": [
            {
                "clueId": "glaciar_02_clue_1",
                "category": "impulsividad",
                "coordinates": None,
                "textSpan": {"start": 0, "end": 20},
                "explanation": "Esta info me la contaron, pero no estoy seguro si es cierta. Compartir algo que no verificamos puede causar preocupación innecesaria en la colonia.",
            },
            {
                "clueId": "glaciar_02_clue_2",
                "category": "datos_sensibles",
                "coordinates": None,
                "textSpan": {"start": 50, "end": 75},
                "explanation": "El sector norte es donde vivo. Si esto fuera cierto, no querría que todos sepan exactamente dónde buscar. Pero además, ¡ni siquiera sé si es verdad!",
            },
        ],
        "difficulty": 3,
    },
    {
        "id": "glaciar_03",
        "type": "photo",
        "nestLevelTarget": "glaciar",
        "mediaUrl": "",
        "promptText": "¡Mi primer día de clases! Acá estoy con mis nuevos amigos. ¿La comparto?",
        "hiddenClues": [
            {
                "clueId": "glaciar_03_clue_1",
                "category": "datos_sensibles",
                "coordinates": {"x": 430, "y": 90, "radius": 40},
                "textSpan": None,
                "explanation": "El horario de clases está pegado en la pared detrás de nosotros. Con eso sabrían cuándo no hay nadie en mi casa.",
            },
            {
                "clueId": "glaciar_03_clue_2",
                "category": "privacidad",
                "coordinates": {"x": 220, "y": 260, "radius": 60},
                "textSpan": None,
                "explanation": "Mis nuevos amigos también salen en la foto. Debería preguntarles si están de acuerdo en compartirla. No solo es mi privacidad, también la de ellos.",
            },
        ],
        "difficulty": 3,
    },
]

ISLANDS = [
    {"id": "isla_bahia_calma", "name": "Bahía Calma", "order": 1, "requiredPebbles": 0, "unlockedContentId": "intro_story"},
    {"id": "isla_bosque_dorado", "name": "Bosque Dorado", "order": 2, "requiredPebbles": 3, "unlockedContentId": "bosque_story"},
    {"id": "isla_cima_viento", "name": "Cima del Viento", "order": 3, "requiredPebbles": 6, "unlockedContentId": "cima_story"},
    {"id": "isla_laguna_espejo", "name": "Laguna Espejo", "order": 4, "requiredPebbles": 10, "unlockedContentId": "laguna_story"},
    {"id": "isla_glaciar_eterno", "name": "Glaciar Eterno", "order": 5, "requiredPebbles": 15, "unlockedContentId": "final_story"},
]
