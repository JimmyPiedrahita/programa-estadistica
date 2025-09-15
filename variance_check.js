// Verificación detallada del cálculo de varianza
const testData = [13, 9, 14, 11, 8, 11, 10, 8, 4, 11];
const mean = 9.9;

console.log('Verificación detallada de la varianza:');
console.log('Media:', mean);

let sumSquaredDiffs = 0;
testData.forEach((value, index) => {
    const diff = value - mean;
    const squaredDiff = diff * diff;
    console.log(`x[${index}] = ${value}, (x - μ) = ${diff.toFixed(2)}, (x - μ)² = ${squaredDiff.toFixed(4)}`);
    sumSquaredDiffs += squaredDiff;
});

console.log('\nSuma de diferencias cuadradas:', sumSquaredDiffs.toFixed(4));
console.log('n =', testData.length);

// Varianza poblacional
const variancePop = sumSquaredDiffs / testData.length;
console.log('Varianza poblacional:', variancePop.toFixed(4));
console.log('Desviación estándar poblacional:', Math.sqrt(variancePop).toFixed(4));

// Varianza muestral (para comparación)
const varianceSample = sumSquaredDiffs / (testData.length - 1);
console.log('Varianza muestral:', varianceSample.toFixed(4));
console.log('Desviación estándar muestral:', Math.sqrt(varianceSample).toFixed(4));

// Verificar si los valores esperados corresponden a varianza muestral
console.log('\n¿Los valores esperados (7.89, 2.81) corresponden a varianza muestral?');
console.log('Varianza muestral calculada:', varianceSample.toFixed(2));
console.log('Desviación muestral calculada:', Math.sqrt(varianceSample).toFixed(2));