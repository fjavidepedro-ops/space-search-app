# 🚀 SETUP - Cómo Ejecutar Space Explorer

## Requisitos Mínimos
- Python 3.x (generalmente incluido en Windows 10+)
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexión a Internet (para APIs externas)

---

## Opción 1: Línea de Comandos (RECOMENDADO)

### Paso 1: Abrir Terminal/PowerShell
```powershell
# En Windows, presiona: Win + R
# Escribe: powershell
# O abre terminal en carpeta: Shift + Click Derecho
```

### Paso 2: Navegar a la Carpeta
```powershell
cd "c:\Users\Victor\OneDrive\tr IA\space-search-app"
```

### Paso 3: Iniciar Servidor Python
```powershell
python -m http.server 8000
```

**Resultado esperado:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### Paso 4: Abrir en Navegador
```
http://localhost:8000
```

---

## Opción 2: Doble-click (Windows)

### Paso 1: Crear archivo `run.bat` en la carpeta
Contenido:
```batch
@echo off
cd /d "%~dp0"
python -m http.server 8000
pause
```

### Paso 2: Doble-click en `run.bat`
- Se abrirá terminal
- Irá a `http://localhost:8000` automáticamente

---

## Opción 3: VS Code

### Paso 1: Abrir carpeta en VS Code
```
File > Open Folder > Seleccionar carpeta del proyecto
```

### Paso 2: Abrir Terminal (Ctrl + `)
```
Escribir: python -m http.server 8000
```

### Paso 3: Click en URL que aparece
O ir a `http://localhost:8000` en navegador

---

## ¿No funciona? Solucionar Problemas

### Problema: "python no reconocido"
**Solución 1:** Usar `python3`
```powershell
python3 -m http.server 8000
```

**Solución 2:** Usar ruta completa
```powershell
"C:\Program Files\Python310\python.exe" -m http.server 8000
```

**Solución 3:** Instalar Python
- Descargar de python.org
- Marcar "Add Python to PATH"
- Reiniciar terminal

### Problema: Puerto 8000 ya en uso
**Solución:** Usar otro puerto
```powershell
python -m http.server 8001  # o 8002, 8003, etc
# Luego ir a http://localhost:8001
```

### Problema: "No puedo abrir localhost"
**Solución:** Esperar 2-3 segundos después de ejecutar comando
- A veces tarda en arrancar
- Intenta `http://127.0.0.1:8000` en lugar de `localhost`

### Problema: App carga pero sin estilos
**Solución:** Limpiar caché del navegador
- Presionar Ctrl + Shift + Delete
- Seleccionar "Caché" y "Cookies"
- Limpiar
- Recargar página

### Problema: APIs no funcionan
**Solución:** Verificar conexión a Internet
```powershell
# Desde PowerShell
ping 8.8.8.8

# Si responde, las APIs deberían funcionar
```

---

## Archivos Necesarios

La carpeta debe contener:
```
space-search-app/
├── index.html          ✓
├── styles.css          ✓
├── app.js              ✓
├── README.md           ✓
├── PROYECTO.md         ✓
├── GUIA_PRESENTACION.md ✓
├── CHANGELOG.md        ✓
└── CHECKLIST_PROFESOR.md ✓
```

Si falta alguno, la app no funcionará correctamente.

---

## Verificar que Funciona

Después de abrir `http://localhost:8000`, verificar:

1. **Page carga** (no da error 404)
2. **Estilos se ven** (colores, fuentes)
3. **Botones son clickeables**
4. **Buscador funciona**
5. **Console no tiene errores** (F12 → Console)

---

## Parar el Servidor

Para detener el servidor Python:
```powershell
# En la terminal donde está corriendo
Presionar: Ctrl + C

# Debería mostrar:
# KeyboardInterrupt
```

Luego puedes cerrar la terminal.

---

## Para Presentación en Clase

### Setup Sugerido
```powershell
# 1. Abrir terminal 5 minutos antes
python -m http.server 8000

# 2. Dejar corriendo mientras presentas
# (No cierre la terminal)

# 3. Durante presentación
# Abrir http://localhost:8000 en navegador

# 4. Al terminar
# Ctrl + C en terminal para detener
```

### Alternativa Offline (si WiFi falla)
- La app funciona sin internet EXCEPTO:
  - Búsqueda (necesita APIs)
  - Fact-checker externo (necesita APIs)
- Pero la UI y fact-checker local sí funcionan

---

## Información Técnica

### Puerto 8000
- Estándar para desarrollo
- Si no disponible, prueba: 8001, 8002, 8003, etc.

### Localhost vs 127.0.0.1
- `http://localhost:8000` - Recomendado
- `http://127.0.0.1:8000` - Alternativa si localhost no funciona
- Ambos van al mismo servidor local

### Python HTTP Server
- Servidor web simple incluido en Python
- Perfecto para desarrollo
- Sirve archivos estáticos

---

## ¿Preguntas?

Si algo no funciona, verificar:

1. ✓ Python está instalado: `python --version`
2. ✓ Carpeta correcta: `cd` a carpeta del proyecto
3. ✓ Comando correcto: `python -m http.server 8000`
4. ✓ Servidor inició: Ver "Serving HTTP on..." en terminal
5. ✓ URL correcta: `http://localhost:8000` en navegador
6. ✓ Esperar: A veces tarda 2-3 segundos en cargar

---

**¿Lista para presentación? ¡Adelante! 🚀**

