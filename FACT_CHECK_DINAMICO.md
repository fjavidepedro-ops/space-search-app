# 🔍 FACT-CHECK DINÁMICO - Guía Rápida

## ¿QUÉ ES?
El **Fact-Checker dinámico** ahora analiza automáticamente el tema que buscas y verifica las afirmaciones encontradas, sin necesidad de escribir manualmente cada claim.

## ANTES vs AHORA

### ❌ ANTES (Versión antigua):
```
1. Buscas: "mareas"
2. Recibes resultados
3. Presionas: 🔍 Fact-Checker
4. Modal aparece con una afirmación hardcodeada: "luna se aleja 3.8 cm"
   ↓ Problema: NO estaba relacionada con tu búsqueda de "mareas"
```

### ✅ AHORA (Versión nueva):
```
1. Buscas: "mareas"
2. Recibes resultados específicos sobre mareas
3. Presionas: 🔍 Fact-Checker del Tema
   ↓
4. El sistema AUTOMÁTICAMENTE:
   - Extrae claims del tema (luna, océanos, etc)
   - Verifica MÚLTIPLES afirmaciones
   - Muestra resultados específicos sobre MAREAS
```

---

## 🚀 FLUJO DE USO

### Paso 1: Realiza una búsqueda
```
Entrada en caja de búsqueda: "mareas luna"
↓
Se guarda automáticamente en variables:
  lastSearchQuery = "mareas luna"
  lastSearchResults = [contenido completo de resultados]
```

### Paso 2: Haz clic en 🔍 Fact-Checker del Tema
```
Botón: onclick="displayFactCheck();"
  ↓ (sin argumentos = busca en última búsqueda)
```

### Paso 3: Sistema analiza automáticamente
```
La función displayDynamicFactCheck():
  1. Lee lastSearchQuery ("mareas")
  2. Lee lastSearchResults (contenido HTML)
  3. Extrae claims relacionados con MAREAS
  4. Verifica cada uno contra la base de datos
  5. Muestra modal con múltiples resultados
```

### Paso 4: Ves verificación detallada
```
Modal muestra:
┌─────────────────────────────────────┐
│ 🔍 VERIFICACIÓN: MAREAS LUNA         │
│ 📊 Analizando 3 afirmación(es)...    │
│                                     │
│ ✅ "luna causa mareas"               │
│    VERIFICADO | Confianza: 98%      │
│    📖 NOAA Tidal Theory (2024)       │
│                                     │
│ ✅ "luna se aleja 3.8 cm cada año"   │
│    VERIFICADO | Confianza: 99%      │
│    📖 NASA LRO data (2024)           │
│                                     │
│ ⚠️ "bahía de fundy 16 metros"        │
│    VERIFICADO | Confianza: 95%      │
│    📖 NOAA (2024)                    │
│                                     │
│          [✕ Cerrar]                 │
└─────────────────────────────────────┘
```

---

## 📋 CLAIMS DETECTADOS POR TEMA

### LUNA
- ✅ "luna se aleja 3.8 cm cada año" → NASA LRO
- ✅ "luna causa mareas" → NOAA
- ✅ "luna se aleja de la tierra" → NASA

### MARTE
- ✅ "perseverance 28 km" → NASA JPL
- ✅ "gravedad marte 38%" → NASA

### GRAVEDAD
- ✅ "gravedad mercurio 3.7" → NASA
- ✅ "gravedad júpiter 24.79" → NASA
- ✅ "gravedad tierra 9.81" → NASA

### HUBBLE
- ✅ "hubble 30 años operativo" → NASA
- ✅ "hubble observa ultravioleta" → NASA

### JAMES WEBB
- ✅ "JWST costó 10 mil millones" → NASA
- ✅ "JWST observa infrarrojo" → NASA

### SENTINEL-2
- ✅ "Sentinel-2 resolución 10 metros" → ESA
- ✅ "Sentinel-2 datos LIBRES" → ESA

### MAREAS
- ✅ "luna causa mareas" → NOAA
- ✅ "bahía de fundy 16 metros" → NOAA
- ✅ "ciclo semidiurno 12.4 horas" → NOAA

---

## 🔧 CÓMO FUNCIONA (Técnicamente)

### Variable Global 1: `lastSearchQuery`
```javascript
Guarda: "mareas luna"
Se actualiza en performSearch()
```

### Variable Global 2: `lastSearchResults`
```javascript
Guarda: Contenido HTML completo del resultado
Se actualiza después de recibir respuesta
```

### Función 1: `extractVerifiableClaims(text, topic)`
```javascript
Entrada: (texto de resultados, tema buscado)
Salida: Array de claims encontrados

Proceso:
1. Lee el texto completo
2. Busca patrones regex para cada tema
3. Si encuentra coincidencia → agrega claim
4. Elimina duplicados
5. Retorna array de claims únicos
```

### Función 2: `displayDynamicFactCheck()`
```javascript
Entrada: (nada - usa variables globales)
Salida: Modal con múltiples fact-checks

Proceso:
1. Verifica si lastSearchQuery existe
2. Si no → alert "Primero realiza una búsqueda"
3. Si sí → extrae claims
4. Para cada claim → ejecuta factCheckAssertion()
5. Construye HTML del modal
6. Muestra resultado
```

### Función 3: `displayFactCheck()` [MEJORADA]
```javascript
// SIN argumentos = DINÁMICO (nuevo)
displayFactCheck();
  ↓
  if (!assertion && lastSearchQuery) {
    displayDynamicFactCheck(); // ← Usa tema buscado
  }

// CON argumentos = MANUAL (antiguo, sigue funcionando)
displayFactCheck('luna se aleja 3.8 cm');
  ↓
  Verifica solo esa afirmación específica
```

---

## 🎯 CASOS DE USO

### CASO 1: Estudiante escribiendo sobre Mareas
```
1. Busca: "mareas"
2. Obtiene: 50 líneas sobre mareas
3. Clic: 🔍 Fact-Checker
   ↓
   Obtiene: ✅✅✅ 3 afirmaciones verificadas
   Cita: NOAA Tidal Theory 2024
```

### CASO 2: Investigador sobre Marte
```
1. Busca: "perseverance rover marte"
2. Obtiene: Ficha técnica Perseverance
3. Clic: 🔍 Fact-Checker
   ↓
   Obtiene: ✅✅ 2 afirmaciones verificadas
   Cita: NASA JPL 2026
```

### CASO 3: Periodista verificando datos
```
1. Busca: "gravedad planetas"
2. Obtiene: Tabla de gravedad
3. Clic: 🔍 Fact-Checker
   ↓
   Obtiene: ✅✅✅ 3+ afirmaciones verificadas
   Cita: NASA Planetary Fact Sheets 2024
```

---

## ⚙️ CONFIGURACIÓN RECOMENDADA

### Para máxima efectividad:
1. ✅ Realiza búsqueda específica (ej: "mareas", no "espacio")
2. ✅ Lee los resultados
3. ✅ Presiona 🔍 Fact-Checker del Tema
4. ✅ Verifica claims directamente relacionados
5. ✅ Usa las citas para tu trabajo

### Búsquedas que funcionan mejor:
- ✅ "mareas" (tema específico)
- ✅ "gravedad marte" (tema + aspecto)
- ✅ "perseverance descubrimientos" (misión + logros)
- ❌ "espacio" (demasiado genérico - sin claims específicos)

---

## 🐛 TROUBLESHOOTING

### Problema: Presiono Fact-Checker pero aparece alerta
```
⚠️ "Primero realiza una búsqueda"

Solución:
1. Primero haz clic en un botón de búsqueda
2. O escribe algo en caja de búsqueda y presiona "Buscar"
3. LUEGO presiona 🔍 Fact-Checker
```

### Problema: No aparecen claims verificables
```
⚠️ "No se encontraron afirmaciones verificables"

Solución:
1. Tu búsqueda fue muy genérica (ej: "espacio")
2. Intenta con temas específicos:
   - "mareas"
   - "gravedad"
   - "perseverance"
   - "hubble"
   - "jwst"
```

### Problema: Aparece modal vacío
```
Modal sin claims

Solución:
1. Presiona F12 (abrir consola)
2. Verifica console.log en desarrollador
3. Abre issue con screenshot
```

---

## 📊 ESTADÍSTICAS

- **Claims en base de datos**: 9
- **Temas cubiertos**: 7 (luna, marte, gravedad, hubble, jwst, sentinel, mareas)
- **Confianza promedio**: 97.5%
- **Fuentes**: NASA, ESA, NOAA, USGS
- **Año de datos**: 2024-2026

---

## 🚀 PRÓXIMAS MEJORAS (v4.0)

- [ ] Expandir base de claims a 50+
- [ ] Agregar claims de arXiv
- [ ] Detectar automáticamente tema de búsqueda
- [ ] Exportar fact-check como PDF
- [ ] Mostrar fuentes primarias con links
- [ ] Análisis de confianza de fuentes

---

## 💡 TIP PRO

**Combo efectivo:**
```
1. Busca tema específico
   Ej: "mareas luna océanos"
   
2. Lee resultados (50+ líneas)
   
3. Presiona 🔍 Fact-Checker
   ↓
   Obtiene 3-5 claims verificados
   
4. Presiona 📄 Exportar APA
   ↓
   Descarga referencias en APA
   
5. Listo para trabajo académico ✅
   - Contenido ✓
   - Verificaciones ✓
   - Referencias ✓
```

---

**¡Comienza a usar el Fact-Checker dinámico ahora!** 🚀
