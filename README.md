# Calculadora Agua

<!-- BADGES-DONATIONS-START -->
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Donate-orange?logo=ko-fi)](https://ko-fi.com/gerardolucero)
[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?logo=buy-me-a-coffee)](https://buymeacoffee.com/lucerorios0)
<!-- BADGES-DONATIONS-END -->

[![npm version](https://badge.fury.io/js/calculadora-agua.svg)](https://badge.fury.io/js/calculadora-agua)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/GerardoLucero/calculadora-agua/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/GerardoLucero/calculadora-agua/actions)

Calculadora completa de **tarifas de agua potable y drenaje** para municipios mexicanos con cálculo automático de consumo, tarifas diferenciadas y subsidios aplicables.

## 🚀 Características

- 💧 **Cálculo de tarifas de agua** - Tarifas oficiales por municipio y estado
- 🏠 **Tipos de servicio** - Doméstico, comercial, industrial, público
- 📊 **Consumo por bloques** - Tarifas diferenciadas por rangos de consumo
- 💰 **Subsidios automáticos** - Aplicación de subsidios gubernamentales
- 🧮 **Cálculo de drenaje** - Porcentajes de drenaje según normativa local
- 📈 **Recargos por mora** - Cálculo automático de intereses moratorios
- 🏢 **Base de datos municipal** - Más de 500 municipios mexicanos
- ⚡ **Cálculo instantáneo** - Resultados inmediatos con desglose detallado
- 📱 **Multiplataforma** - Compatible con Node.js y navegadores

## 📦 Instalación

```bash
npm install calculadora-agua
```

## 🔧 Uso

```javascript
// ES6 Modules
import { calcularTarifaAgua, obtenerTarifasMunicipio, calcularConsumo } from 'calculadora-agua';

// Calcular tarifa de agua para uso doméstico
const tarifa = calcularTarifaAgua({
  municipio: 'guadalajara',
  estado: 'jalisco',
  tipoServicio: 'domestico',
  consumoM3: 25,
  mesesMora: 0
});

console.log(tarifa);
// {
//   consumoM3: 25,
//   tarifaBase: 180.50,
//   consumoExcedente: 15,
//   costoExcedente: 125.30,
//   subtotal: 305.80,
//   drenaje: 91.74, // 30% del subtotal
//   iva: 0, // Exento para uso doméstico
//   total: 397.54,
//   desglose: [...],
//   aplicaSubsidio: true,
//   subsidio: 45.20
// }
```

## 💧 Tipos de Servicio

### Doméstico
- Consumo básico: 0-10 m³
- Tarifa diferenciada por bloques
- Subsidios gubernamentales aplicables
- Exento de IVA

### Comercial
- Tarifa fija más consumo variable
- IVA incluido (16%)
- Sin subsidios

### Industrial
- Tarifas preferenciales por volumen
- Contratos especiales disponibles
- Tratamiento de aguas residuales

## 🏛️ Municipios Soportados

La librería incluye tarifas oficiales para más de 500 municipios mexicanos:

- **Jalisco**: Guadalajara, Zapopan, Tlaquepaque, Tonalá...
- **México**: Toluca, Naucalpan, Tlalnepantla, Ecatepec...
- **Nuevo León**: Monterrey, San Pedro, Santa Catarina...
- **Y muchos más...**

```javascript
// Obtener lista de municipios disponibles
import { obtenerMunicipiosDisponibles } from 'calculadora-agua';

const municipios = obtenerMunicipiosDisponibles('jalisco');
console.log(municipios);
// ['guadalajara', 'zapopan', 'tlaquepaque', 'tonala', ...]
```

## 📊 Ejemplos Avanzados

### Cálculo con Mora
```javascript
const tarifaConMora = calcularTarifaAgua({
  municipio: 'monterrey',
  estado: 'nuevo-leon',
  tipoServicio: 'comercial',
  consumoM3: 50,
  mesesMora: 3,
  tasaInteresMoratorio: 0.02 // 2% mensual
});
```

### Comparar Tarifas Entre Municipios
```javascript
import { compararTarifas } from 'calculadora-agua';

const comparacion = compararTarifas({
  municipios: ['guadalajara', 'monterrey', 'cdmx'],
  tipoServicio: 'domestico',
  consumoM3: 20
});
```

## 🏢 API Completa

### `calcularTarifaAgua(opciones)`
Calcula la tarifa completa de agua potable.

**Parámetros:**
- `municipio` (string): Nombre del municipio
- `estado` (string): Estado de la República
- `tipoServicio` (string): 'domestico', 'comercial', 'industrial', 'publico'
- `consumoM3` (number): Consumo en metros cúbicos
- `mesesMora` (number, opcional): Meses de mora para recargos
- `aplicarSubsidios` (boolean, opcional): Aplicar subsidios disponibles

### `obtenerTarifasMunicipio(municipio, estado)`
Obtiene todas las tarifas oficiales de un municipio.

### `calcularConsumo(lecturaAnterior, lecturaActual)`
Calcula el consumo en m³ basado en lecturas del medidor.

## 📄 Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)

<!-- DONATIONS-START -->
## 💖 Apoya el Ecosistema Mexicano OSS

Si estos paquetes te ayudan (RFC, ISR, Nómina, Bancos, Feriados, Nombres, Códigos Postales, Validadores), considera invitarme un café o apoyar el mantenimiento:

- [Ko-fi](https://ko-fi.com/gerardolucero)
- [Buy Me a Coffee](https://buymeacoffee.com/lucerorios0)

> Gracias por tu apoyo 🙌. Priorizaré issues/PRs con **contexto de uso en México** (CONAGUA, municipios, tarifas oficiales) y publicaré avances en los READMEs.
<!-- DONATIONS-END -->
