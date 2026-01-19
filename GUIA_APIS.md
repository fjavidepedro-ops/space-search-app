# Guía de APIs - Space Explorer v2.0

Documentación detallada sobre las APIs utilizadas y cómo obtener acceso.

## 🌐 APIs Incluidas

### 1. NASA API (api.nasa.gov) - GRATIS ⭐

La API más completa para datos espaciales.

#### Características
- Imágenes de todo el universo
- Datos de asteroides cercanos
- Foto del día (APOD)
- Datos de Marte
- Información de satélites

#### Endpoints principales

```javascript
// Búsqueda de imágenes
GET https://images-api.nasa.gov/search?q=satellite

// Asteroides cercanos
GET https://api.nasa.gov/neo/rest/v1/feed?api_key=KEY

// Foto del día
GET https://api.nasa.gov/planetary/apod?api_key=KEY

// Datos de Marte
GET https://api.nasa.gov/planetary/mars-photos/api/v1/rovers/perseverance/photos
```

#### Registro
1. Visita: https://api.nasa.gov
2. Completa el formulario
3. Recibirás tu API Key por email
4. Usa `DEMO_KEY` para pruebas (limitado)

#### Límites
- 1000 solicitudes por hora
- Perfecto para aplicaciones personales

---

### 2. SpaceX API - GRATIS y SIN AUTENTICACIÓN ✅

Datos públicos sobre todos los lanzamientos de SpaceX.

#### Características
- Información de todos los lanzamientos (pasados y futuros)
- Datos de cohetes (Falcon 9, Falcon Heavy, Starship)
- Información de cápsulas (Dragon)
- Historial de misiones

#### Endpoints principales

```javascript
// Todos los lanzamientos
GET https://api.spacexdata.com/v4/launches

// Lanzamientos futuros
GET https://api.spacexdata.com/v4/launches/upcoming

// Información de cohetes
GET https://api.spacexdata.com/v4/rockets

// Últimas misiones
GET https://api.spacexdata.com/v4/launches/latest

// Historias
GET https://api.spacexdata.com/v4/history
```

#### Características de respuesta

```json
{
  "id": "5e9d4592a3c193335e8b456e",
  "name": "Falcon 9 Block 5 Full Flow Stage Combustion System Test Fire",
  "date_utc": "2020-04-20T22:30:00.000Z",
  "date_precision": "hour",
  "success": true,
  "rocket": "5e9d0d95eda69955f578fda8",
  "details": "Falcon 9 static fire test in preparation for In-Flight Abort Test"
}
```

#### No requiere autenticación
- Usar directamente sin API key
- Límites generosos
- Documentación completa en GitHub

---

### 3. Open Notify API - GRATIS ✅

Datos en tiempo real sobre la ISS y astronautas.

#### Características
- Posición actual de la ISS
- Astronautas en órbita ahora
- Predicción de pasos de ISS

#### Endpoints principales

```javascript
// Posición ISS EN VIVO
GET http://api.open-notify.org/iss-now.json

// Astronautas en órbita AHORA
GET http://api.open-notify.org/astros.json

// Próximos pasos de ISS por ubicación
GET http://api.open-notify.org/iss-pass.json?lat=40.7&lon=-74.0
```

#### Ejemplos de respuesta

**Posición ISS:**
```json
{
  "message": "success",
  "iss_position": {
    "latitude": "25.7482",
    "longitude": "-26.5901"
  },
  "timestamp": 1705510615
}
```

**Astronautas:**
```json
{
  "number": 7,
  "people": [
    {"name": "Oleg Kononenko", "craft": "ISS"},
    {"name": "Nikolai Chub", "craft": "ISS"}
  ],
  "message": "success"
}
```

#### Sin autenticación
- API completamente pública
- Actualizaciones en vivo
- Perfecto para datos en tiempo real

---

### 4. ESA API - EN DESARROLLO

Agencia Espacial Europea - Datos sobre misiones europeas.

#### Sitio: https://api.esa.int

Actualmente limitado pero en expansión.

---

## 🔐 Claves API - Cómo obtenerlas

### NASA API Key

```
1. Visita: https://api.nasa.gov
2. Completa el formulario con:
   - Tu nombre
   - Email
   - Organización (opcional)
3. Acepta términos
4. Recibirás email con tu clave
5. Copia la clave y usa en config.js
```

**Clave de demostración:**
```
DEMO_KEY
```
(Limitada a 40 solicitudes/hora)

### SpaceX API

```
¡NO REQUIERE CLAVE!
Usa directamente
```

### Open Notify API

```
¡NO REQUIERE CLAVE!
Usa directamente
```

---

## 💻 Cómo usar las APIs en Space Explorer

### En `config.js`:

```javascript
const RELIABLE_APIS = {
    nasa: {
        images: 'https://images-api.nasa.gov/search',
        neo: 'https://api.nasa.gov/neo/rest/v1/feed',
        apiKey: 'TU_CLAVE_AQUI' // Reemplaza con tu clave
    },
    spacex: 'https://api.spacexdata.com/v4',
    openNotify: 'http://api.open-notify.org'
};
```

### En `app.js`:

```javascript
// Buscar en NASA
async function searchNASA(query) {
    const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`
    );
    return response.json();
}

// Buscar en SpaceX
async function searchSpaceX(query) {
    const response = await fetch('https://api.spacexdata.com/v4/launches');
    return response.json();
}

// Datos ISS en tiempo real
async function getISSPosition() {
    const response = await fetch('http://api.open-notify.org/iss-now.json');
    return response.json();
}
```

---

## 📊 Ejemplos de búsquedas por API

### NASA - Búsqueda de imágenes
```javascript
const query = 'satellite';
const url = `https://images-api.nasa.gov/search?q=${query}`;
fetch(url).then(r => r.json()).then(data => {
    console.log(data.collection.items);
});
```

### SpaceX - Próximos lanzamientos
```javascript
const url = 'https://api.spacexdata.com/v4/launches/upcoming';
fetch(url).then(r => r.json()).then(launches => {
    launches.forEach(launch => {
        console.log(`${launch.name} - ${launch.date_utc}`);
    });
});
```

### Open Notify - ISS en vivo
```javascript
const url = 'http://api.open-notify.org/iss-now.json';
fetch(url).then(r => r.json()).then(data => {
    console.log(`ISS en: ${data.iss_position.latitude}, ${data.iss_position.longitude}`);
});
```

---

## 🚨 Límites y consideraciones

| API | Límite | Autenticación | Tiempo Real |
|-----|--------|---------------|------------|
| NASA | 1000/hora | Sí (gratuita) | No (actualizaciones diarias) |
| SpaceX | Generoso | No | Parcialmente (datos actuales) |
| Open Notify | Generoso | No | **SÍ** (cada 5 segundos) |
| ESA | Limitado | Sí | No |

---

## ⚠️ Errores comunes

### Error 429 - Too Many Requests
```
Causa: Excediste el límite de solicitudes
Solución: Espera o usa NASA_DEMO_KEY para pruebas
```

### Error 404 - Not Found
```
Causa: URL de API incorrecta
Solución: Verifica el endpoint en la documentación oficial
```

### CORS Error
```
Causa: Restricción de origen cruzado
Solución: Usa un servidor proxy o backend
```

---

## 🔄 Actualización de datos

- **NASA**: Nuevas imágenes cada día
- **SpaceX**: Información actualizada en tiempo real
- **Open Notify**: Posición ISS cada 5 segundos
- **ESA**: Actualizaciones semanales

---

## 📚 Documentación oficial

- [NASA API Docs](https://api.nasa.gov)
- [SpaceX API GitHub](https://github.com/r-spacex/SpaceX-API)
- [Open Notify API](http://open-notify.org)
- [ESA API](https://api.esa.int)

---

## 🎯 Casos de uso recomendados

### Aplicaciones en tiempo real
- Usar: **Open Notify API**
- Razón: Actualizaciones cada 5 segundos

### Información histórica
- Usar: **NASA API**, **SpaceX API**
- Razón: Datos completos y verificados

### Misiones futuras
- Usar: **SpaceX API**
- Razón: Calendario completo de lanzamientos

### Imágenes y multimedia
- Usar: **NASA API**
- Razón: Millones de imágenes de alta calidad

---

**Space Explorer v2.0** © 2026 - Fuentes oficiales verificadas 🚀
