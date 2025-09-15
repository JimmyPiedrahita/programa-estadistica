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
 * Genera conclusiones automáticas enfocadas en los gráficos
 * @param {Array} freqRows - Datos de frecuencias
 * @param {Object} stats - Estadísticas calculadas
 * @returns {string} HTML con conclusiones
 */
function generateAutomaticConclusions(freqRows, stats) {
    let conclusions = [];
    
    // === CONCLUSIONES DEL GRÁFICO DE BARRAS ===
    conclusions.push(`📊 <strong>Análisis del Gráfico de Barras:</strong>`);
    
    // Conclusión 1: Análisis de altura de barras y distribución
    const maxFreq = Math.max(...freqRows.map(row => row.fa));
    const minFreq = Math.min(...freqRows.map(row => row.fa));
    const valuesWithMaxFreq = freqRows.filter(row => row.fa === maxFreq);
    
    if (maxFreq === minFreq) {
        conclusions.push(`� <strong>Distribución uniforme:</strong> En el gráfico de barras se observa que todas las barras tienen la misma altura (frecuencia = ${maxFreq}), lo que indica una distribución perfectamente uniforme donde todos los valores aparecen con la misma frecuencia.`);
    } else {
        const tallestBars = valuesWithMaxFreq.map(row => row.value).join(', ');
        conclusions.push(`� <strong>Barras dominantes:</strong> El gráfico de barras muestra que ${valuesWithMaxFreq.length === 1 ? 'la barra más alta corresponde al valor' : 'las barras más altas corresponden a los valores'} <span class="highlight">${tallestBars}</span> con una frecuencia de <span class="highlight">${maxFreq}</span>, destacándose claramente sobre las demás barras del gráfico.`);
    }
    
    // Conclusión 2: Análisis de patrón de distribución
    const orderedFreqs = freqRows.map(row => row.fa);
    const isIncreasing = orderedFreqs.every((freq, i) => i === 0 || freq >= orderedFreqs[i-1]);
    const isDecreasing = orderedFreqs.every((freq, i) => i === 0 || freq <= orderedFreqs[i-1]);
    
    if (isIncreasing && !isDecreasing) {
        conclusions.push(`� <strong>Patrón creciente:</strong> Las barras del gráfico muestran un patrón ascendente, donde las frecuencias tienden a aumentar conforme avanzan los valores, creando una forma creciente en la distribución.`);
    } else if (isDecreasing && !isIncreasing) {
        conclusions.push(`🔹 <strong>Patrón decreciente:</strong> Las barras del gráfico presentan un patrón descendente, donde las frecuencias disminuyen progresivamente, formando una distribución decreciente.`);
    } else {
        const uniqueFreqs = [...new Set(orderedFreqs)].length;
        if (uniqueFreqs === 1) {
            conclusions.push(`� <strong>Altura uniforme:</strong> Todas las barras mantienen la misma altura en el gráfico, indicando que no hay valores predominantes en la distribución.`);
        } else {
            conclusions.push(`🔹 <strong>Distribución irregular:</strong> Las barras del gráfico no siguen un patrón específico, presentando alturas variables que crean una distribución irregular con picos y valles a lo largo de los diferentes valores.`);
        }
    }
    
    // === CONCLUSIONES DEL GRÁFICO DE PASTEL ===
    conclusions.push(`🥧 <strong>Análisis del Gráfico de Pastel:</strong>`);
    
    // Conclusión 1: Análisis de sectores dominantes
    const maxPercentage = Math.max(...freqRows.map(row => row.percentage));
    const sectorsWithMaxPercentage = freqRows.filter(row => row.percentage === maxPercentage);
    
    if (maxPercentage >= 50) {
        const dominantValue = sectorsWithMaxPercentage[0].value;
        conclusions.push(`� <strong>Sector dominante:</strong> En el gráfico de pastel se observa que el sector correspondiente al valor <span class="highlight">${dominantValue}</span> ocupa más de la mitad del círculo (<span class="highlight">${maxPercentage}%</span>), dominando visualmente la distribución y evidenciando su alta representatividad en los datos.`);
    } else {
        const largestSectors = sectorsWithMaxPercentage.map(row => `${row.value} (${row.percentage}%)`).join(', ');
        conclusions.push(`� <strong>Sectores principales:</strong> El gráfico de pastel muestra que ${sectorsWithMaxPercentage.length === 1 ? 'el sector más grande corresponde al valor' : 'los sectores más grandes corresponden a los valores'} <span class="highlight">${largestSectors}</span>, aunque ningún sector individual domina completamente el círculo.`);
    }
    
    // Conclusión 2: Análisis de equilibrio de sectores
    const minPercentage = Math.min(...freqRows.map(row => row.percentage));
    const percentageRange = maxPercentage - minPercentage;
    
    if (percentageRange === 0) {
        conclusions.push(`� <strong>Sectores equilibrados:</strong> Todos los sectores del gráfico de pastel tienen exactamente el mismo tamaño (${maxPercentage}% cada uno), creando una distribución perfectamente equilibrada donde cada valor tiene la misma importancia visual.`);
    } else if (percentageRange <= 20) {
        conclusions.push(`� <strong>Distribución balanceada:</strong> Los sectores del gráfico de pastel presentan tamaños relativamente similares, con una diferencia máxima de ${percentageRange.toFixed(1)} puntos porcentuales entre el sector más grande y el más pequeño, lo que indica una distribución bastante equilibrada.`);
    } else {
        const smallestSectors = freqRows.filter(row => row.percentage === minPercentage);
        conclusions.push(`🔹 <strong>Contraste marcado:</strong> El gráfico de pastel revela un fuerte contraste entre sectores, donde los más pequeños (${smallestSectors.map(row => `${row.value}: ${row.percentage}%`).join(', ')}) contrastan notablemente con los más grandes, creando una distribución visualmente desigual.`);
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
        
        // Guardar datos para posible uso futuro
        window.currentData = { values, stats, freqTable };
        
    } catch (error) {
        // Mostrar error
        errorContainer.innerHTML = `<strong>❌ Error:</strong> ${error.message}`;
        errorContainer.style.display = 'block';
        
        // Ocultar resultados
        resultsSection.style.display = 'none';
    }
}