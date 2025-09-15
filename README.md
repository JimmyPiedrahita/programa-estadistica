# 📊 Programa de Análisis Estadístico Descriptivo

## Descripción
Aplicación web desarrollada en HTML, CSS y JavaScript puro para el análisis estadístico descriptivo de variables cuantitativas discretas no agrupadas. La aplicación procesa datos numéricos, genera medidas estadísticas, tablas de frecuencias, gráficos y conclusiones automáticas en lenguaje natural.

## 🚀 Características

### ✅ Funcionalidades Implementadas
- **Validación de datos**: Acepta números enteros separados por coma, espacio, punto y coma o salto de línea
- **Cálculos estadísticos completos**:
  - Tamaño de muestra (n)
  - Suma total
  - Valores mínimo y máximo
  - Media aritmética
  - Mediana
  - Moda (unimodal, bimodal, multimodal o sin moda)
  - Rango
  - Varianza poblacional
  - Desviación estándar poblacional

### 📋 Tabla de Frecuencias
- Valor (xᵢ)
- Frecuencia absoluta (fa)
- Frecuencia relativa (fr)
- Frecuencia absoluta acumulada (Fa)
- Frecuencia relativa acumulada (Fr)
- Porcentaje (%)

### 📊 Visualizaciones
- **Gráfico de barras**: Distribución de frecuencias absolutas
- **Gráfico de pastel**: Distribución porcentual con colores dinámicos

### 🤖 Conclusiones Automáticas
- Interpretación de la media en lenguaje natural
- Análisis de la moda y su significado
- Identificación de valores extremos
- Comentarios sobre dispersión y homogeneidad
- Análisis de simetría de la distribución

### 🔧 Funcionalidades Adicionales
- **Botón "Cargar Ejemplo"**: Carga automáticamente el dataset de prueba
- **Exportación CSV**: Descarga de resultados completos
- **Validación robusta**: Mensajes de error claros y específicos
- **Interfaz responsiva**: Adaptable a diferentes tamaños de pantalla

## 🧪 Caso de Prueba Verificado

Con los datos del ejemplo: `13,9,14,11,8,11,10,8,4,11`

### Resultados Obtenidos:
- **Media**: 9.90 ✅
- **Mediana**: 10.5 ✅
- **Moda**: 11 ✅
- **Rango**: 10 ✅
- **Varianza poblacional**: 7.29
- **Desviación estándar poblacional**: 2.70

## 🛠️ Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con gradientes y animaciones
- **JavaScript ES6+**: Lógica de aplicación modular
- **Chart.js**: Biblioteca para gráficos interactivos (vía CDN)

## 📁 Estructura del Proyecto
```
Programa-estadistica/
│
├── index.html          # Página principal con interfaz
├── styles.css          # Hoja de estilos responsiva
├── script.js           # Lógica de la aplicación
├── test_calculations.js # Script de verificación
├── variance_check.js    # Verificación detallada
└── README.md           # Documentación
```

## 🚦 Cómo Usar

1. **Abrir la aplicación**: Abra `index.html` en cualquier navegador moderno
2. **Ingresar datos**: Escriba números enteros en el área de texto (separados por coma, espacio, punto y coma o salto de línea)
3. **Procesar**: Haga clic en "🔄 Procesar Datos"
4. **Ver resultados**: Revise el resumen estadístico, tabla de frecuencias, gráficos y conclusiones
5. **Exportar**: Use "💾 Descargar CSV" para guardar los resultados

### Ejemplo de entrada válida:
```
13,9,14,11,8,11,10,8,4,11
```
o
```
13 9 14 11 8 11 10 8 4 11
```
o
```
13;9;14;11;8;11;10;8;4;11
```

## 🎯 Funciones JavaScript Principales

### Validación y Parsing
- `parseInput(inputString)`: Convierte string en array de enteros válidos

### Cálculos Estadísticos
- `calcMean(values)`: Media aritmética
- `calcMedian(values)`: Mediana
- `calcMode(values)`: Moda(s) con tipo de distribución
- `calcRange(values)`: Rango
- `calcVariance(values, population)`: Varianza
- `calcStdDev(values, population)`: Desviación estándar

### Tabla de Frecuencias
- `getFrequencyTable(values)`: Genera datos de frecuencias
- `buildFreqTableDOM(freqRows, containerId)`: Construye tabla HTML

### Visualización
- `drawBarChart(canvasId, freqRows)`: Gráfico de barras
- `drawPieChart(canvasId, freqRows)`: Gráfico de pastel
- `generateColors(count)`: Genera paleta de colores

### Interfaz y Utilidades
- `renderSummary(stats, containerId)`: Muestra resumen estadístico
- `generateAutomaticConclusions(freqRows, stats)`: Genera conclusiones
- `validateAndProcess()`: Función principal de procesamiento
- `loadExample()`: Carga datos de ejemplo
- `downloadCSV()`: Exporta resultados

## 🎨 Características de Diseño
- **Diseño moderno**: Gradientes y sombras suaves
- **Tarjetas informativas**: Estadísticas en formato visual atractivo
- **Colores dinámicos**: Paleta automática para gráficos
- **Animaciones sutiles**: Transiciones suaves
- **Tipografía clara**: Fuentes legibles y jerarquía visual

## ✅ Validaciones Implementadas
- Verificación de números enteros válidos
- Detección de valores no numéricos
- Mensajes de error específicos y útiles
- Prevención de procesamiento con datos vacíos
- Manejo de diferentes separadores de datos

## 🔍 Análisis de Dispersión Automático
La aplicación calcula automáticamente el coeficiente de variación y proporciona interpretaciones:
- **Baja variabilidad** (CV < 15%): Datos homogéneos
- **Variabilidad moderada** (CV 15-30%): Dispersión equilibrada  
- **Alta variabilidad** (CV > 30%): Datos heterogéneos

## 📈 Análisis de Simetría
Compara automáticamente media y mediana para determinar:
- **Distribución simétrica**: Media ≈ Mediana
- **Sesgo derecho**: Media > Mediana
- **Sesgo izquierdo**: Media < Mediana

## 🌐 Compatibilidad
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Opera 47+

## 📝 Licencia
Este proyecto fue desarrollado para fines educativos en análisis estadístico descriptivo.

---
**Desarrollado con ❤️ para el aprendizaje de estadística descriptiva**