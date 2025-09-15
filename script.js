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
        throw new Error('Por favor, ingrese la cantidad de errores corregidos por cada programador.');
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
        
        // Verificar que sea un número entero válido y no negativo (no puede haber errores negativos)
        if (isNaN(parsed) || !Number.isInteger(parsed) || parsed.toString() !== trimmed || parsed < 0) {
            invalidValues.push(trimmed);
        } else {
            numbers.push(parsed);
        }
    }

    if (invalidValues.length > 0) {
        throw new Error(`Los siguientes valores no son cantidades válidas de errores corregidos: ${invalidValues.join(', ')}. Debe ingresar números enteros no negativos.`);
    }

    if (numbers.length === 0) {
        throw new Error('No se encontraron cantidades válidas de errores corregidos.');
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
    const headers = ['Errores Corregidos', 'Programadores (fa)', 'Frecuencia Relativa (fr)', 
                    'Acumulado (Fa)', 'Acumulado Relativo (Fr)', 'Porcentaje (%)'];
    
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
    
    const labels = freqRows.map(row => `${row.value} errores`);
    const data = freqRows.map(row => row.fa);
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Número de Programadores',
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
                    text: 'Distribución de Errores Corregidos por Programador',
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
                        text: 'Número de Programadores'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Cantidad de Errores Corregidos'
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
    
    const labels = freqRows.map(row => `${row.value} errores`);
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
                    text: 'Distribución Porcentual de la Carga de Trabajo',
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
                                    const count = freqRows[i].fa;
                                    return {
                                        text: `${label}: ${percentage}% (${count} prog.)`,
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
                            const count = freqRows[context.dataIndex].fa;
                            return `${label}: ${value}% (${count} programadores)`;
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
 * Muestra el resumen estadístico específico para el análisis de errores
 * @param {Object} stats - Objeto con estadísticas calculadas
 * @param {string} containerId - ID del contenedor
 */
function renderSummary(stats, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    const statsData = [
        { label: 'Programadores evaluados', value: stats.n },
        { label: 'Total errores corregidos', value: stats.sum },
        { label: 'Mínimo errores (programador)', value: stats.min },
        { label: 'Máximo errores (programador)', value: stats.max },
        { label: 'Media de errores', value: stats.mean.toFixed(2) },
        { label: 'Mediana de errores', value: stats.median },
        { label: 'Moda de errores', value: stats.modeText }
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
 * Genera conclusiones específicas para el análisis de errores funcionales críticos
 * @param {Array} freqRows - Datos de frecuencias
 * @param {Object} stats - Estadísticas calculadas
 * @returns {string} HTML con conclusiones
 */
function generateAutomaticConclusions(freqRows, stats) {
    let conclusions = [];
    
    // === CONCLUSIONES DEL GRÁFICO DE BARRAS ===
    conclusions.push(`📊 <strong>Análisis de la Distribución de Errores (Gráfico de Barras):</strong>`);
    
    // Conclusión 1: Análisis de la carga de trabajo por cantidad de errores
    const maxFreq = Math.max(...freqRows.map(row => row.fa));
    const minFreq = Math.min(...freqRows.map(row => row.fa));
    const valuesWithMaxFreq = freqRows.filter(row => row.fa === maxFreq);
    
    if (maxFreq === minFreq) {
        conclusions.push(`🔹 <strong>Distribución uniforme de cargas:</strong> El gráfico de barras muestra que todas las cantidades de errores corregidos aparecen con la misma frecuencia (${maxFreq} programadores cada una), indicando que no hay concentración en niveles específicos de rendimiento. Esto sugiere una distribución equilibrada de las cargas de trabajo.`);
    } else {
        const mostCommonErrorCounts = valuesWithMaxFreq.map(row => row.value).join(', ');
        conclusions.push(`🔹 <strong>Concentración en niveles específicos:</strong> El gráfico de barras revela que ${valuesWithMaxFreq.length === 1 ? 'la cantidad más común de errores corregidos es' : 'las cantidades más comunes de errores corregidos son'} <span class="highlight">${mostCommonErrorCounts}</span>, con <span class="highlight">${maxFreq}</span> programadores en ${valuesWithMaxFreq.length === 1 ? 'este nivel' : 'estos niveles'}. Esto indica una tendencia del equipo hacia ciertos rangos de productividad.`);
    }
    
    // Conclusión 2: Análisis de patrones de rendimiento del equipo
    const orderedFreqs = freqRows.map(row => row.fa);
    const sortedErrorCounts = freqRows.map(row => row.value).sort((a, b) => a - b);
    const lowPerformers = freqRows.filter(row => row.value <= stats.mean * 0.7);
    const highPerformers = freqRows.filter(row => row.value >= stats.mean * 1.3);
    
    if (lowPerformers.length > 0 && highPerformers.length > 0) {
        conclusions.push(`🔹 <strong>Evidencia de disparidad en el rendimiento:</strong> Las barras del gráfico muestran una distribución polarizada con programadores de bajo rendimiento (≤${(stats.mean * 0.7).toFixed(1)} errores) y alto rendimiento (≥${(stats.mean * 1.3).toFixed(1)} errores), sugiriendo diferencias significativas en la capacidad de corrección de errores del equipo.`);
    } else if (Math.max(...sortedErrorCounts) - Math.min(...sortedErrorCounts) <= 3) {
        conclusions.push(`🔹 <strong>Rendimiento homogéneo del equipo:</strong> Las barras presentan alturas relativamente similares, con una variación máxima de ${Math.max(...sortedErrorCounts) - Math.min(...sortedErrorCounts)} errores entre programadores, indicando un rendimiento consistente y equilibrado en la corrección de errores funcionales.`);
    } else {
        conclusions.push(`🔹 <strong>Variabilidad moderada en el rendimiento:</strong> El gráfico muestra una distribución irregular de las barras, reflejando diferentes niveles de productividad en el equipo, con algunos programadores sobresaliendo en la corrección de errores mientras otros muestran un rendimiento más conservador.`);
    }
    
    // === CONCLUSIONES DEL GRÁFICO DE PASTEL ===
    conclusions.push(`🥧 <strong>Análisis de la Carga de Trabajo por Programador (Gráfico de Pastel):</strong>`);
    
    // Conclusión 1: Análisis de distribución de la carga total
    const maxPercentage = Math.max(...freqRows.map(row => row.percentage));
    const sectorsWithMaxPercentage = freqRows.filter(row => row.percentage === maxPercentage);
    
    if (maxPercentage >= 40) {
        const dominantErrorCount = sectorsWithMaxPercentage[0].value;
        const programmersInLevel = sectorsWithMaxPercentage[0].fa;
        conclusions.push(`🔹 <strong>Concentración significativa de la carga:</strong> El gráfico de pastel muestra que los programadores que corrigieron <span class="highlight">${dominantErrorCount}</span> errores representan <span class="highlight">${maxPercentage}%</span> del equipo (${programmersInLevel} de ${stats.n} programadores), indicando una concentración significativa en este nivel de rendimiento, lo que podría señalar un estándar de productividad esperado.`);
    } else {
        const distributedLevels = sectorsWithMaxPercentage.map(row => `${row.value} errores (${row.percentage}%)`).join(', ');
        conclusions.push(`🔹 <strong>Distribución balanceada de la carga:</strong> El gráfico de pastel revela que ningún nivel específico de errores corregidos domina significativamente al equipo. Los niveles más comunes son <span class="highlight">${distributedLevels}</span>, sugiriendo una distribución equilibrada de las capacidades y responsabilidades del equipo.`);
    }
    
    // Conclusión 2: Análisis de equilibrio del equipo y recomendaciones
    const minPercentage = Math.min(...freqRows.map(row => row.percentage));
    const percentageRange = maxPercentage - minPercentage;
    const cv = (stats.stdDev / stats.mean) * 100; // Coeficiente de variación
    
    if (cv <= 20) {
        conclusions.push(`🔹 <strong>Equipo bien equilibrado:</strong> Los sectores del gráfico muestran tamaños relativamente uniformes con un coeficiente de variación de ${cv.toFixed(1)}%, indicando que la carga de corrección de errores está bien distribuida. <span class="highlight">Recomendación:</span> Mantener las prácticas actuales de asignación de trabajo y considerar este equipo como referencia para otros grupos.`);
    } else if (cv <= 35) {
        conclusions.push(`🔹 <strong>Disparidad moderada identificada:</strong> El gráfico revela diferencias moderadas en los sectores con un coeficiente de variación de ${cv.toFixed(1)}%, sugiriendo algunas inconsistencias en la carga de trabajo. <span class="highlight">Recomendación:</span> Implementar sesiones de nivelación de conocimientos y revisar la asignación de tareas para equilibrar mejor la carga.`);
    } else {
        const lowPerformersCount = freqRows.filter(row => row.value < stats.mean * 0.8).reduce((sum, row) => sum + row.fa, 0);
        const highPerformersCount = freqRows.filter(row => row.value > stats.mean * 1.2).reduce((sum, row) => sum + row.fa, 0);
        conclusions.push(`🔹 <strong>Disparidad significativa detectada:</strong> Los sectores muestran un contraste marcado con un coeficiente de variación de ${cv.toFixed(1)}%, evidenciando desequilibrio en la carga de corrección de errores (${lowPerformersCount} programadores con bajo rendimiento vs ${highPerformersCount} con alto rendimiento). <span class="highlight">Recomendación:</span> Implementar programa de mentoring, redistributir tareas según experiencia y evaluar la necesidad de capacitación especializada.`);
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