// ===========================
// FUNCIONES DE VALIDACIÓN Y PARSING
// ===========================

/**
 * Convierte string de entrada en array de enteros válidos
 * @param {string} inputString - String con datos separados por coma, espacio, punto y coma o salto de línea
 * @returns {number[]} Array de números enteros
 * @throws {Error} Si hay valores inválidos
 */
function parseInput(inputString) {
    if (!inputString || inputString.trim() === '') {
        throw new Error('Por favor, ingrese algunos datos para procesar.');
    }

    // Separar por diferentes delimitadores
    const rawValues = inputString
        .trim()
        .split(/[,;\s\n\r]+/)
        .filter(val => val.trim() !== '');

    if (rawValues.length === 0) {
        throw new Error('No se encontraron valores válidos en la entrada.');
    }

    const numbers = [];
    const invalidValues = [];

    for (let i = 0; i < rawValues.length; i++) {
        const trimmed = rawValues[i].trim();
        const parsed = parseInt(trimmed);
        
        // Verificar que sea un número entero válido
        if (isNaN(parsed) || !Number.isInteger(parsed) || parsed.toString() !== trimmed) {
            invalidValues.push(trimmed);
        } else {
            numbers.push(parsed);
        }
    }

    if (invalidValues.length > 0) {
        throw new Error(`Los siguientes valores no son números enteros válidos: ${invalidValues.join(', ')}`);
    }

    if (numbers.length === 0) {
        throw new Error('No se encontraron números enteros válidos en la entrada.');
    }

    return numbers;
}

// ===========================
// FUNCIONES DE CÁLCULOS ESTADÍSTICOS
// ===========================

/**
 * Calcula la media aritmética
 * @param {number[]} values - Array de valores
 * @returns {number} Media aritmética
 */
function calcMean(values) {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

/**
 * Calcula la mediana
 * @param {number[]} values - Array de valores
 * @returns {number} Mediana
 */
function calcMedian(values) {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
        return sorted[middle];
    }
}

/**
 * Calcula la moda (valor o valores más frecuentes)
 * @param {number[]} values - Array de valores
 * @returns {Object} Objeto con moda(s) y información adicional
 */
function calcMode(values) {
    if (values.length === 0) return { modes: [], frequency: 0, type: 'ninguna' };
    
    // Contar frecuencias
    const frequency = {};
    values.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1;
    });
    
    // Encontrar la frecuencia máxima
    const maxFreq = Math.max(...Object.values(frequency));
    
    // Encontrar todos los valores con frecuencia máxima
    const modes = Object.keys(frequency)
        .filter(key => frequency[key] === maxFreq)
        .map(key => parseInt(key))
        .sort((a, b) => a - b);
    
    let type;
    if (maxFreq === 1) {
        type = 'ninguna';
    } else if (modes.length === 1) {
        type = 'unimodal';
    } else if (modes.length === 2) {
        type = 'bimodal';
    } else {
        type = 'multimodal';
    }
    
    return {
        modes: modes,
        frequency: maxFreq,
        type: type
    };
}

/**
 * Calcula el rango
 * @param {number[]} values - Array de valores
 * @returns {number} Rango (máximo - mínimo)
 */
function calcRange(values) {
    if (values.length === 0) return 0;
    return Math.max(...values) - Math.min(...values);
}

/**
 * Calcula la varianza
 * @param {number[]} values - Array de valores
 * @param {boolean} population - true para varianza poblacional, false para muestral
 * @returns {number} Varianza
 */
function calcVariance(values, population = true) {
    if (values.length === 0) return 0;
    if (values.length === 1) return 0;
    
    const mean = calcMean(values);
    const sumSquaredDiffs = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    
    const divisor = population ? values.length : values.length - 1;
    return sumSquaredDiffs / divisor;
}

/**
 * Calcula la desviación estándar
 * @param {number[]} values - Array de valores
 * @param {boolean} population - true para desviación poblacional, false para muestral
 * @returns {number} Desviación estándar
 */
function calcStdDev(values, population = true) {
    return Math.sqrt(calcVariance(values, population));
}

// ===========================
// FUNCIONES DE TABLA DE FRECUENCIAS
// ===========================

/**
 * Genera la tabla de frecuencias
 * @param {number[]} values - Array de valores
 * @returns {Array} Array de objetos con información de frecuencias
 */
function getFrequencyTable(values) {
    if (values.length === 0) return [];
    
    // Contar frecuencias absolutas
    const frequency = {};
    values.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1;
    });
    
    // Ordenar valores únicos
    const uniqueValues = Object.keys(frequency)
        .map(key => parseInt(key))
        .sort((a, b) => a - b);
    
    const n = values.length;
    let cumulativeFreq = 0;
    let cumulativeRelFreq = 0;
    
    // Crear tabla de frecuencias
    const freqTable = uniqueValues.map(value => {
        const fa = frequency[value]; // Frecuencia absoluta
        const fr = fa / n; // Frecuencia relativa
        cumulativeFreq += fa; // Frecuencia absoluta acumulada
        cumulativeRelFreq += fr; // Frecuencia relativa acumulada
        const percentage = fr * 100; // Porcentaje
        
        return {
            value: value,
            fa: fa,
            fr: parseFloat(fr.toFixed(4)),
            Fa: cumulativeFreq,
            Fr: parseFloat(cumulativeRelFreq.toFixed(4)),
            percentage: parseFloat(percentage.toFixed(2))
        };
    });
    
    return freqTable;
}

/**
 * Construye la tabla de frecuencias en el DOM
 * @param {Array} freqRows - Array con datos de frecuencias
 * @param {string} containerId - ID del contenedor donde insertar la tabla
 */
function buildFreqTableDOM(freqRows, containerId) {
    const container = document.getElementById(containerId);
    if (!container || freqRows.length === 0) return;
    
    const table = document.createElement('table');
    table.className = 'frequency-table';
    
    // Crear encabezados
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Valor (xᵢ)', 'Frecuencia Absoluta (fa)', 'Frecuencia Relativa (fr)', 
                    'Frecuencia Abs. Acumulada (Fa)', 'Frecuencia Rel. Acumulada (Fr)', 'Porcentaje (%)'];
    
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');
    freqRows.forEach(row => {
        const tr = document.createElement('tr');
        
        // Valor
        const tdValue = document.createElement('td');
        tdValue.textContent = row.value;
        tr.appendChild(tdValue);
        
        // Frecuencia absoluta
        const tdFa = document.createElement('td');
        tdFa.textContent = row.fa;
        tr.appendChild(tdFa);
        
        // Frecuencia relativa
        const tdFr = document.createElement('td');
        tdFr.textContent = row.fr;
        tr.appendChild(tdFr);
        
        // Frecuencia absoluta acumulada
        const tdFa_acc = document.createElement('td');
        tdFa_acc.textContent = row.Fa;
        tr.appendChild(tdFa_acc);
        
        // Frecuencia relativa acumulada
        const tdFr_acc = document.createElement('td');
        tdFr_acc.textContent = row.Fr;
        tr.appendChild(tdFr_acc);
        
        // Porcentaje
        const tdPercentage = document.createElement('td');
        tdPercentage.textContent = row.percentage + '%';
        tr.appendChild(tdPercentage);
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
}

// Variables globales para los gráficos
let barChart = null;
let pieChart = null;

// ===========================
// FUNCIONES DE GRÁFICOS
// ===========================

/**
 * Dibuja gráfico de barras
 * @param {string} canvasId - ID del canvas
 * @param {Array} freqRows - Datos de frecuencias
 */
function drawBarChart(canvasId, freqRows) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (barChart) {
        barChart.destroy();
    }
    
    const labels = freqRows.map(row => row.value.toString());
    const data = freqRows.map(row => row.fa);
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frecuencia Absoluta',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución de Frecuencias',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Frecuencia Absoluta'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Valores'
                    }
                }
            }
        }
    });
}

/**
 * Dibuja gráfico de pastel
 * @param {string} canvasId - ID del canvas
 * @param {Array} freqRows - Datos de frecuencias
 */
function drawPieChart(canvasId, freqRows) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (pieChart) {
        pieChart.destroy();
    }
    
    const labels = freqRows.map(row => `Valor ${row.value}`);
    const data = freqRows.map(row => row.percentage);
    
    // Generar colores dinámicamente
    const colors = generateColors(freqRows.length);
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución Porcentual',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const percentage = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${percentage}%`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: data.datasets[0].borderWidth,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Genera colores para los gráficos
 * @param {number} count - Número de colores a generar
 * @returns {Object} Objeto con arrays de colores de fondo y borde
 */
function generateColors(count) {
    const baseColors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(245, 87, 108, 0.8)',
        'rgba(79, 172, 254, 0.8)',
        'rgba(240, 147, 251, 0.8)',
        'rgba(129, 236, 236, 0.8)',
        'rgba(255, 195, 18, 0.8)',
        'rgba(255, 107, 107, 0.8)',
        'rgba(130, 88, 159, 0.8)',
        'rgba(54, 215, 183, 0.8)',
        'rgba(255, 159, 67, 0.8)'
    ];
    
    const borderColors = [
        'rgba(102, 126, 234, 1)',
        'rgba(245, 87, 108, 1)',
        'rgba(79, 172, 254, 1)',
        'rgba(240, 147, 251, 1)',
        'rgba(129, 236, 236, 1)',
        'rgba(255, 195, 18, 1)',
        'rgba(255, 107, 107, 1)',
        'rgba(130, 88, 159, 1)',
        'rgba(54, 215, 183, 1)',
        'rgba(255, 159, 67, 1)'
    ];
    
    const background = [];
    const border = [];
    
    for (let i = 0; i < count; i++) {
        background.push(baseColors[i % baseColors.length]);
        border.push(borderColors[i % borderColors.length]);
    }
    
    return { background, border };
}

// ===========================
// FUNCIONES DE RESUMEN Y CONCLUSIONES
// ===========================

/**
 * Muestra el resumen estadístico
 * @param {Object} stats - Objeto con estadísticas calculadas
 * @param {string} containerId - ID del contenedor
 */
function renderSummary(stats, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    const statsData = [
        { label: 'Tamaño de muestra (n)', value: stats.n },
        { label: 'Suma total', value: stats.sum },
        { label: 'Mínimo', value: stats.min },
        { label: 'Máximo', value: stats.max },
        { label: 'Media aritmética', value: stats.mean.toFixed(2) },
        { label: 'Mediana', value: stats.median },
        { label: 'Moda', value: stats.modeText },
        { label: 'Rango', value: stats.range },
        { label: 'Varianza', value: stats.variance.toFixed(4) },
        { label: 'Desviación estándar', value: stats.stdDev.toFixed(4) }
    ];
    
    statsData.forEach(stat => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        
        const title = document.createElement('h3');
        title.textContent = stat.label;
        
        const value = document.createElement('div');
        value.className = 'value';
        value.textContent = stat.value;
        
        card.appendChild(title);
        card.appendChild(value);
        container.appendChild(card);
    });
}

/**
 * Genera conclusiones automáticas en lenguaje natural
 * @param {Array} freqRows - Datos de frecuencias
 * @param {Object} stats - Estadísticas calculadas
 * @returns {string} HTML con conclusiones
 */
function generateAutomaticConclusions(freqRows, stats) {
    let conclusions = [];
    
    // Interpretación de la media
    conclusions.push(`📊 <strong>Análisis de tendencia central:</strong> En promedio, los datos presentan un valor de <span class="highlight">${stats.mean.toFixed(2)}</span>. Esto significa que el valor típico o esperado en esta distribución se encuentra alrededor de este número.`);
    
    // Interpretación de la moda
    const modeInfo = stats.modeInfo;
    if (modeInfo.type === 'ninguna') {
        conclusions.push(`📈 <strong>Análisis de la moda:</strong> No existe moda en estos datos, ya que todos los valores aparecen con la misma frecuencia. Esto indica una distribución uniforme.`);
    } else if (modeInfo.type === 'unimodal') {
        const modePercentage = freqRows.find(row => row.value === modeInfo.modes[0])?.percentage || 0;
        conclusions.push(`📈 <strong>Análisis de la moda:</strong> El valor más frecuente es <span class="highlight">${modeInfo.modes[0]}</span>, apareciendo ${modeInfo.frequency} veces (${modePercentage}% de los datos). Este es el valor más representativo de la muestra.`);
    } else {
        const modesList = modeInfo.modes.join(', ');
        conclusions.push(`📈 <strong>Análisis de la moda:</strong> Esta distribución es ${modeInfo.type}, con los valores <span class="highlight">${modesList}</span> apareciendo cada uno ${modeInfo.frequency} veces. Esto indica múltiples picos en la distribución.`);
    }
    
    // Valores extremos
    conclusions.push(`🔢 <strong>Valores extremos:</strong> El valor mínimo es <span class="highlight">${stats.min}</span> y el máximo es <span class="highlight">${stats.max}</span>, lo que resulta en un rango de <span class="highlight">${stats.range}</span> unidades.`);
    
    // Valores con mayor porcentaje
    const maxPercentage = Math.max(...freqRows.map(row => row.percentage));
    const maxPercentageValues = freqRows.filter(row => row.percentage === maxPercentage);
    
    if (maxPercentageValues.length === 1) {
        conclusions.push(`💯 <strong>Valor más representativo:</strong> El valor <span class="highlight">${maxPercentageValues[0].value}</span> representa el <span class="highlight">${maxPercentage}%</span> de todos los datos, siendo el más significativo en la muestra.`);
    } else {
        const valuesList = maxPercentageValues.map(row => row.value).join(', ');
        conclusions.push(`💯 <strong>Valores más representativos:</strong> Los valores <span class="highlight">${valuesList}</span> comparten el mayor porcentaje con <span class="highlight">${maxPercentage}%</span> cada uno.`);
    }
    
    // Análisis de dispersión
    const cv = (stats.stdDev / stats.mean) * 100; // Coeficiente de variación
    let dispersionAnalysis;
    
    if (cv < 15) {
        dispersionAnalysis = `📊 <strong>Análisis de dispersión:</strong> Los datos muestran <span class="highlight">baja variabilidad</span> (coeficiente de variación: ${cv.toFixed(2)}%). Con una desviación estándar de ${stats.stdDev.toFixed(2)}, los valores están relativamente concentrados alrededor de la media, indicando homogeneidad en la distribución.`;
    } else if (cv < 30) {
        dispersionAnalysis = `📊 <strong>Análisis de dispersión:</strong> Los datos presentan <span class="highlight">variabilidad moderada</span> (coeficiente de variación: ${cv.toFixed(2)}%). La desviación estándar de ${stats.stdDev.toFixed(2)} sugiere una dispersión equilibrada de los valores.`;
    } else {
        dispersionAnalysis = `📊 <strong>Análisis de dispersión:</strong> Los datos muestran <span class="highlight">alta variabilidad</span> (coeficiente de variación: ${cv.toFixed(2)}%). Con una desviación estándar de ${stats.stdDev.toFixed(2)}, existe considerable dispersión entre los valores, indicando heterogeneidad en la distribución.`;
    }
    
    conclusions.push(dispersionAnalysis);
    
    // Análisis de la mediana
    if (Math.abs(stats.mean - stats.median) < 0.1) {
        conclusions.push(`⚖️ <strong>Simetría de los datos:</strong> La media (${stats.mean.toFixed(2)}) y la mediana (${stats.median}) son muy similares, lo que sugiere que la distribución es aproximadamente simétrica.`);
    } else if (stats.mean > stats.median) {
        conclusions.push(`⚖️ <strong>Asimetría de los datos:</strong> La media (${stats.mean.toFixed(2)}) es mayor que la mediana (${stats.median}), indicando una distribución con sesgo hacia la derecha (valores altos más dispersos).`);
    } else {
        conclusions.push(`⚖️ <strong>Asimetría de los datos:</strong> La media (${stats.mean.toFixed(2)}) es menor que la mediana (${stats.median}), indicando una distribución con sesgo hacia la izquierda (valores bajos más dispersos).`);
    }
    
    return conclusions.map(conclusion => `<p>${conclusion}</p>`).join('');
}

// ===========================
// FUNCIONES PRINCIPALES Y UTILIDADES
// ===========================

/**
 * Función principal que valida y procesa los datos
 */
function validateAndProcess() {
    const inputElement = document.getElementById('dataInput');
    const errorContainer = document.getElementById('errorContainer');
    const resultsSection = document.getElementById('resultsSection');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Limpiar errores previos
    errorContainer.style.display = 'none';
    errorContainer.innerHTML = '';
    
    try {
        // Parsear y validar datos
        const values = parseInput(inputElement.value);
        
        // Calcular estadísticas
        const stats = {
            n: values.length,
            sum: values.reduce((acc, val) => acc + val, 0),
            min: Math.min(...values),
            max: Math.max(...values),
            mean: calcMean(values),
            median: calcMedian(values),
            modeInfo: calcMode(values),
            range: calcRange(values),
            variance: calcVariance(values, true),
            stdDev: calcStdDev(values, true)
        };
        
        // Formatear texto de moda
        if (stats.modeInfo.type === 'ninguna') {
            stats.modeText = 'No hay moda';
        } else if (stats.modeInfo.modes.length === 1) {
            stats.modeText = stats.modeInfo.modes[0].toString();
        } else {
            stats.modeText = stats.modeInfo.modes.join(', ');
        }
        
        // Generar tabla de frecuencias
        const freqTable = getFrequencyTable(values);
        
        // Mostrar resultados
        renderSummary(stats, 'summaryContainer');
        buildFreqTableDOM(freqTable, 'frequencyTableContainer');
        drawBarChart('barChart', freqTable);
        drawPieChart('pieChart', freqTable);
        
        // Generar conclusiones
        const conclusions = generateAutomaticConclusions(freqTable, stats);
        document.getElementById('conclusionsContainer').innerHTML = conclusions;
        
        // Mostrar sección de resultados
        resultsSection.style.display = 'block';
        
        // Habilitar botón de descarga
        downloadBtn.disabled = false;
        
        // Guardar datos para exportación
        window.currentData = { values, stats, freqTable };
        
    } catch (error) {
        // Mostrar error
        errorContainer.innerHTML = `<strong>❌ Error:</strong> ${error.message}`;
        errorContainer.style.display = 'block';
        
        // Ocultar resultados
        resultsSection.style.display = 'none';
        downloadBtn.disabled = true;
    }
}

/**
 * Carga el ejemplo de datos
 */
function loadExample() {
    const inputElement = document.getElementById('dataInput');
    inputElement.value = '13,9,14,11,8,11,10,8,4,11';
    
    // Procesar automáticamente
    validateAndProcess();
}

/**
 * Descarga los resultados en formato CSV
 */
function downloadCSV() {
    if (!window.currentData) return;
    
    const { freqTable, stats } = window.currentData;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Agregar resumen estadístico
    csvContent += 'RESUMEN ESTADÍSTICO\n';
    csvContent += 'Medida,Valor\n';
    csvContent += `Tamaño de muestra (n),${stats.n}\n`;
    csvContent += `Suma total,${stats.sum}\n`;
    csvContent += `Mínimo,${stats.min}\n`;
    csvContent += `Máximo,${stats.max}\n`;
    csvContent += `Media aritmética,${stats.mean.toFixed(4)}\n`;
    csvContent += `Mediana,${stats.median}\n`;
    csvContent += `Moda,${stats.modeText}\n`;
    csvContent += `Rango,${stats.range}\n`;
    csvContent += `Varianza,${stats.variance.toFixed(4)}\n`;
    csvContent += `Desviación estándar,${stats.stdDev.toFixed(4)}\n\n`;
    
    // Agregar tabla de frecuencias
    csvContent += 'TABLA DE FRECUENCIAS\n';
    csvContent += 'Valor (xi),Frecuencia Absoluta (fa),Frecuencia Relativa (fr),Frecuencia Abs. Acumulada (Fa),Frecuencia Rel. Acumulada (Fr),Porcentaje (%)\n';
    
    freqTable.forEach(row => {
        csvContent += `${row.value},${row.fa},${row.fr},${row.Fa},${row.Fr},${row.percentage}\n`;
    });
    
    // Crear y descargar archivo
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `analisis_estadistico_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}