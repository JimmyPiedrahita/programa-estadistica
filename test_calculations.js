// Script de prueba para verificar los cálculos estadísticos
// Datos del caso de prueba: 13,9,14,11,8,11,10,8,4,11

const testData = [13, 9, 14, 11, 8, 11, 10, 8, 4, 11];

console.log('=== VERIFICACIÓN DE CÁLCULOS ESTADÍSTICOS ===');
console.log('Datos de prueba:', testData);
console.log('n =', testData.length);

// Media
const sum = testData.reduce((acc, val) => acc + val, 0);
const mean = sum / testData.length;
console.log('Suma:', sum);
console.log('Media:', mean.toFixed(2)); // Debe ser ≈ 9.9

// Mediana
const sorted = [...testData].sort((a, b) => a - b);
console.log('Datos ordenados:', sorted);
const median = sorted.length % 2 === 0 
    ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2 
    : sorted[Math.floor(sorted.length/2)];
console.log('Mediana:', median); // Debe ser 10.5

// Moda
const frequency = {};
testData.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
});
console.log('Frecuencias:', frequency);
const maxFreq = Math.max(...Object.values(frequency));
const modes = Object.keys(frequency)
    .filter(key => frequency[key] === maxFreq)
    .map(key => parseInt(key));
console.log('Moda:', modes); // Debe ser [11]

// Rango
const min = Math.min(...testData);
const max = Math.max(...testData);
const range = max - min;
console.log('Mínimo:', min, 'Máximo:', max, 'Rango:', range); // Debe ser 10

// Varianza
const variance = testData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / testData.length;
console.log('Varianza:', variance.toFixed(4)); // Debe ser ≈ 7.89

// Desviación estándar
const stdDev = Math.sqrt(variance);
console.log('Desviación estándar:', stdDev.toFixed(4)); // Debe ser ≈ 2.81

// Tabla de frecuencias esperada
console.log('\n=== TABLA DE FRECUENCIAS ===');
const uniqueValues = [...new Set(testData)].sort((a, b) => a - b);
let cumulativeFreq = 0;
uniqueValues.forEach(value => {
    const fa = frequency[value];
    const fr = fa / testData.length;
    cumulativeFreq += fa;
    const Fr = cumulativeFreq / testData.length;
    const percentage = fr * 100;
    
    console.log(`Valor: ${value}, fa: ${fa}, fr: ${fr.toFixed(4)}, Fa: ${cumulativeFreq}, Fr: ${Fr.toFixed(4)}, %: ${percentage.toFixed(2)}`);
});