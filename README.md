# calculadora-agua

Calculadora completa de tarifas de agua potable y drenaje para municipios mexicanos con cálculo automático de consumo, tarifas diferenciadas y subsidios aplicables.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/gerardolucero)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucerorios0)
[![GitHub Stars](https://img.shields.io/github/stars/GerardoLucero/calculadora-agua?style=social)](https://github.com/GerardoLucero/calculadora-agua)
[![npm version](https://badge.fury.io/js/calculadora-agua.svg)](https://badge.fury.io/js/calculadora-agua)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/GerardoLucero/calculadora-agua/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/GerardoLucero/calculadora-agua/actions)

## Features

- **Cálculo de tarifas de agua** — tarifas oficiales por municipio y estado
- **Tipos de servicio** — doméstico, comercial, industrial, público
- **Consumo por bloques** — tarifas diferenciadas por rangos de consumo
- **Subsidios automáticos** — aplicación de subsidios gubernamentales
- **Cálculo de drenaje** — porcentajes de drenaje según normativa local
- **Recargos por mora** — cálculo automático de intereses moratorios
- **Base de datos municipal** — más de 500 municipios mexicanos
- **Multiplataforma** — compatible con Node.js y navegadores

## Instalación

```bash
npm install calculadora-agua
```

## Uso

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

## Tipos de servicio

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

## Municipios soportados

La librería incluye tarifas oficiales para más de 500 municipios mexicanos:

- **Jalisco**: Guadalajara, Zapopan, Tlaquepaque, Tonalá...
- **México**: Toluca, Naucalpan, Tlalnepantla, Ecatepec...
- **Nuevo León**: Monterrey, San Pedro, Santa Catarina...

```javascript
// Obtener lista de municipios disponibles
import { obtenerMunicipiosDisponibles } from 'calculadora-agua';

const municipios = obtenerMunicipiosDisponibles('jalisco');
console.log(municipios);
// ['guadalajara', 'zapopan', 'tlaquepaque', 'tonala', ...]
```

## Ejemplos avanzados

### Cálculo con mora

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

### Comparar tarifas entre municipios

```javascript
import { compararTarifas } from 'calculadora-agua';

const comparacion = compararTarifas({
  municipios: ['guadalajara', 'monterrey', 'cdmx'],
  tipoServicio: 'domestico',
  consumoM3: 20
});
```

## API

### `calcularTarifaAgua(opciones)`

Calcula la tarifa completa de agua potable.

**Parámetros:**
- `municipio` (string): Nombre del municipio
- `estado` (string): Estado de la República
- `tipoServicio` (string): `'domestico'`, `'comercial'`, `'industrial'`, `'publico'`
- `consumoM3` (number): Consumo en metros cúbicos
- `mesesMora` (number, opcional): Meses de mora para recargos
- `aplicarSubsidios` (boolean, opcional): Aplicar subsidios disponibles

### `obtenerTarifasMunicipio(municipio, estado)`

Obtiene todas las tarifas oficiales de un municipio.

### `calcularConsumo(lecturaAnterior, lecturaActual)`

Calcula el consumo en m³ basado en lecturas del medidor.

## Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)
