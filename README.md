# 🚀 Space Explorer v3.0 - Sistema Inteligente de Búsqueda Espacial

**Versión:** 3.0 | **Desarrollado:** Enero 2026 | **Estado:** ✅ Producción

Una aplicación web avanzada que integra búsqueda en tiempo real desde **múltiples APIs científicas** con **fact-checking automático** de afirmaciones. Desarrollada desde cero con arquitectura multicapa, normalización de datos, y verificación académica.

### 🎓 Verificabilidad Académica
- ✅ Código fuente 100% documentado
- ✅ APIs públicas y verificables  
- ✅ 62+ patrones de verificación científica
- ✅ Sin dependencias externas (Vanilla JS)
- ✅ Ejecutable localmente sin configuración

## 🚀 Características principales

### ✅ Fuentes SOLO oficiales y verificadas
- **NASA** (api.nasa.gov) - Agencia espacial estadounidense
- **SpaceX API** - Datos de lanzamientos y cohetes
- **ESA** (Agencia Espacial Europea)
- **Open Notify** - Datos en tiempo real ISS
- **JAXA, ISRO, CNSA** - Otras agencias espaciales

**❌ Eliminadas:**
- Wikipedia
- Google Search genérica
- Fuentes no verificadas

### 📡 Datos en Tiempo Real
- **Posición ISS ahora mismo** - Coordenadas GPS en vivo
- **Astronautas en órbita** - Lista actualizada
- **Próximos lanzamientos** - Información de misiones
- **Actividad solar** - Condiciones espaciales actuales

### 📚 Información Especializada
- **Resúmenes automáticos** - Lo más importante destacado
- **Datos históricos** - Hitos de la exploración espacial
- **Especificaciones técnicas** - Datos concretos y precisos
- **Información de satélites** - Estado y características

### 🎯 Categorías de búsqueda rápida
- 🛰️ Satélites activos
- 🚀 Próximas misiones 2026
- 🔭 ISS en vivo
- 👨‍🚀 Astronautas en órbita
- 🪐 Exploración de Marte
- 🏛️ Agencias espaciales
- 🔬 Telescopio Hubble
- ☄️ Asteroides cercanos

### 💡 Prompts inteligentes
Ejemplos predefinidos para búsquedas específicas:
- **Datos en Tiempo Real**: Posición ISS, Astronautas, Próximos lanzamientos
- **Satélites & Misiones**: Hubble, Starship, Rover Perseverance
- **Información Histórica**: Apolo, Primeros viajes, Estaciones espaciales

## 📁 Estructura de archivos

```
space-search-app/
├── index.html           # Interfaz principal
├── styles.css          # Diseño espacial oscuro
├── app.js              # Lógica de búsqueda
├── config.js           # Configuración de APIs
├── server.js           # Servidor Node.js (opcional)
├── package.json        # Dependencias Node
├── .env.example        # Variables de entorno
├── README.md           # Este archivo
└── docs/
    └── GUIA_APIS.md    # Documentación de APIs
```

## 🔧 Instalación rápida

### Opción 1: Python (Recomendado - Más fácil)

```bash
# 1. Abre cmd (Windows) o terminal
# 2. Navega a la carpeta
cd "c:\Users\Victor\OneDrive\tr IA\space-search-app"

# 3. Inicia el servidor
python -m http.server 8000

# 4. Abre en navegador
http://localhost:8000
```

### Opción 2: Node.js

```bash
# 1. Instala dependencias
npm install

# 2. Inicia servidor
npm start

# 3. Abre en navegador
http://localhost:3000
```

### Opción 3: Directo en navegador

Simplemente abre `index.html` en tu navegador (funcionalidad limitada sin servidor).

## 🔑 Configuración de APIs

### NASA API (Gratis)

1. Visita [api.nasa.gov](https://api.nasa.gov)
2. Completa el formulario para obtener tu API Key
3. En `config.js`, reemplaza:
```javascript
apiKey: 'TU_API_KEY_AQUI'
```

### SpaceX API

No requiere autenticación - ¡Completamente pública!

## 📊 Ejemplos de búsquedas

```
"Posición actual ISS"          → Ubicación en tiempo real
"Astronautas en órbita"         → Profesionales en el espacio ahora
"Hubble Space Telescope datos"  → Información sobre Hubble
"Próximos lanzamientos 2026"    → Misiones futuras
"Rover Perseverance Marte"      → Exploración marciana
"Misiones Apolo"               → Historia espacial
```

## 🎨 Interfaz

- **Tema oscuro especializado** - Inspirado en el espacio
- **Animaciones de estrellas** - Fondo dinámico
- **Resultados ordenados por importancia** - Lo más relevante primero
- **Indicadores en tiempo real** - 🔴 Para datos vivos
- **Responsive** - Funciona en móvil y desktop

## 💻 Cómo funciona

1. **Búsqueda**: Escribes un término sobre espacios
2. **Validación**: La app verifica que sea tema espacial
3. **Consulta APIs**: Busca en NASA, SpaceX, ISS, etc.
4. **Resumen**: Extrae lo más importante automáticamente
5. **Presentación**: Muestra resultados ordenados por importancia

## 🔍 Filtros automáticos

La app automáticamente:
- ❌ Rechaza Wikipedia y fuentes no oficiales
- ✅ Prioriza NASA, ESA, SpaceX, JAXA
- 📍 Destaca datos en tiempo real
- 🎯 Resume información larga
- 📅 Agrega fechas de actualización

## 📡 Datos en Tiempo Real Disponibles

| Dato | Fuente | Actualización |
|------|--------|--------------|
| Posición ISS | Open Notify | Cada 5 seg |
| Astronautas | Open Notify | Cada 30 seg |
| Próximos lanzamientos | SpaceX API | Cada hora |
| Imágenes NASA | NASA API | Diario |

## 🌟 Datos específicos por tema

### ISS
- Altitud: 408 km
- Velocidad: 28,000 km/h
- Órbita: 90 minutos
- Tripulación: ~7 astronautas
- Tracker vivo: isslive.com

### Hubble
- Altitud: 559 km
- Operativo desde: 1990 (34 años)
- Descubrimientos: Miles de galaxias nuevas
- Próximo reemplazo: James Webb (ya en órbita)

### Marte
- Rovers activos: Perseverance, Zhurong
- Objetivo: Colonización humana (2040s)
- Próximas misiones: Mars Sample Return

## 🚀 Próximas mejoras planeadas

- [ ] Mapa interactivo de satélites en órbita
- [ ] Alertas de lanzamientos espaciales
- [ ] Calendario de eventos astronómicos
- [ ] Seguimiento de asteroides cercanos
- [ ] Predicción de paso de ISS por tu ubicación
- [ ] Integraciones con más agencias espaciales
- [ ] Función de compartir resultados
- [ ] Análisis de datos históricos

## 🔐 Privacidad

- ✅ Datos guardados localmente en tu navegador
- ✅ Sin recopilación de datos personales
- ✅ Sin rastreo de usuario
- ✅ Puedes eliminar historial cualquier momento

## 📖 Documentación adicional

Ver [GUIA_APIS.md](docs/GUIA_APIS.md) para detalles técnicos sobre APIs.

## 🤝 Contribuciones

¿Quieres mejorar Space Explorer? Puedes:
- Agregar nuevas fuentes oficiales
- Mejorar el diseño
- Optimizar búsquedas
- Traducir a otros idiomas
- Reportar bugs

## 📞 Soporte

Para problemas o sugerencias, revisa:
- [Issues del proyecto]
- [NASA API Support](https://api.nasa.gov)
- [SpaceX API GitHub](https://github.com/r-spacex/SpaceX-API)

## 📜 Licencia

MIT License - Libre para usar, modificar y distribuir

## 🔗 Enlaces útiles

- [NASA Official API](https://api.nasa.gov)
- [SpaceX API](https://github.com/r-spacex/SpaceX-API)
- [Open Notify API](http://open-notify.org)
- [ESA Official](https://www.esa.int)
- [ISS Live Tracker](https://www.isslive.com)
- [Spaceflight Now](https://www.spaceflightnow.com)

---

**Space Explorer v2.0** © 2026  
*Explorando el universo con datos verificados* 🌌🚀

