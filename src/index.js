/**
 * Calculadora de Tarifas de Agua - México
 * @author Gerardo Lucero
 * @license MIT
 */

// Base de datos de tarifas por municipio (simplificada para el ejemplo)
const TARIFAS_MUNICIPIOS = {
  guadalajara: {
    estado: 'jalisco',
    domestico: {
      tarifaBase: 180.50, // Primeros 10 m³
      bloques: [
        { min: 0, max: 10, tarifa: 0 }, // Incluido en tarifa base
        { min: 11, max: 20, tarifa: 8.50 },
        { min: 21, max: 30, tarifa: 12.30 },
        { min: 31, max: 50, tarifa: 15.80 },
        { min: 51, max: Infinity, tarifa: 18.90 }
      ],
      drenaje: 0.30, // 30%
      subsidio: 0.15 // 15% de descuento para consumos bajos
    },
    comercial: {
      tarifaBase: 350.00,
      bloques: [
        { min: 0, max: 10, tarifa: 0 },
        { min: 11, max: Infinity, tarifa: 22.50 }
      ],
      drenaje: 0.30,
      iva: 0.16
    },
    industrial: {
      tarifaBase: 500.00,
      bloques: [
        { min: 0, max: 20, tarifa: 0 },
        { min: 21, max: Infinity, tarifa: 18.00 }
      ],
      drenaje: 0.35,
      iva: 0.16
    }
  },
  monterrey: {
    estado: 'nuevo-leon',
    domestico: {
      tarifaBase: 165.00,
      bloques: [
        { min: 0, max: 10, tarifa: 0 },
        { min: 11, max: 25, tarifa: 9.20 },
        { min: 26, max: 40, tarifa: 13.50 },
        { min: 41, max: Infinity, tarifa: 16.80 }
      ],
      drenaje: 0.25,
      subsidio: 0.12
    },
    comercial: {
      tarifaBase: 400.00,
      bloques: [
        { min: 0, max: 15, tarifa: 0 },
        { min: 16, max: Infinity, tarifa: 24.00 }
      ],
      drenaje: 0.25,
      iva: 0.16
    }
  },
  cdmx: {
    estado: 'ciudad-de-mexico',
    domestico: {
      tarifaBase: 220.00,
      bloques: [
        { min: 0, max: 12, tarifa: 0 },
        { min: 13, max: 25, tarifa: 10.50 },
        { min: 26, max: 40, tarifa: 14.20 },
        { min: 41, max: Infinity, tarifa: 17.90 }
      ],
      drenaje: 0.35,
      subsidio: 0.20
    },
    comercial: {
      tarifaBase: 450.00,
      bloques: [
        { min: 0, max: 10, tarifa: 0 },
        { min: 11, max: Infinity, tarifa: 26.50 }
      ],
      drenaje: 0.35,
      iva: 0.16
    }
  }
};

/**
 * Calcula la tarifa de agua potable
 */
export function calcularTarifaAgua(opciones) {
  const {
    municipio,
    tipoServicio = 'domestico',
    consumoM3,
    mesesMora = 0,
    aplicarSubsidios = true,
    tasaInteresMoratorio = 0.02
  } = opciones;

  // Validaciones
  if (!municipio || !consumoM3) {
    throw new Error('Municipio y consumo en m³ son requeridos');
  }

  if (consumoM3 < 0) {
    throw new Error('El consumo no puede ser negativo');
  }

  // Obtener tarifas del municipio
  const tarifasMunicipio = TARIFAS_MUNICIPIOS[municipio.toLowerCase()];
  if (!tarifasMunicipio) {
    throw new Error(`Municipio ${municipio} no encontrado en la base de datos`);
  }

  const tarifaServicio = tarifasMunicipio[tipoServicio];
  if (!tarifaServicio) {
    throw new Error(`Tipo de servicio ${tipoServicio} no disponible para ${municipio}`);
  }

  // Calcular costo por bloques
  let costoConsumo = 0;
  const desglose = [];
  let consumoRestante = consumoM3;

  for (const bloque of tarifaServicio.bloques) {
    if (consumoRestante <= 0) break;

    const consumoBloque = Math.min(
      consumoRestante,
      bloque.max === Infinity ? consumoRestante : bloque.max - bloque.min + 1
    );

    const costoBloque = consumoBloque * bloque.tarifa;
    costoConsumo += costoBloque;

    if (costoBloque > 0) {
      desglose.push({
        rango: `${bloque.min}-${bloque.max === Infinity ? '+' : bloque.max} m³`,
        consumo: consumoBloque,
        tarifa: bloque.tarifa,
        costo: costoBloque
      });
    }

    consumoRestante -= consumoBloque;
  }

  // Calcular subtotal
  let subtotal = tarifaServicio.tarifaBase + costoConsumo;

  // Aplicar subsidio si corresponde
  let subsidio = 0;
  if (aplicarSubsidios && tarifaServicio.subsidio && tipoServicio === 'domestico' && consumoM3 <= 20) {
    subsidio = subtotal * tarifaServicio.subsidio;
    subtotal -= subsidio;
  }

  // Calcular drenaje
  const drenaje = subtotal * tarifaServicio.drenaje;

  // Calcular IVA
  const iva = tarifaServicio.iva ? (subtotal + drenaje) * tarifaServicio.iva : 0;

  // Total antes de mora
  let total = subtotal + drenaje + iva;

  // Calcular recargos por mora
  let recargoMora = 0;
  if (mesesMora > 0) {
    recargoMora = total * (tasaInteresMoratorio * mesesMora);
    total += recargoMora;
  }

  return {
    municipio: municipio.charAt(0).toUpperCase() + municipio.slice(1),
    estado: tarifasMunicipio.estado,
    tipoServicio,
    consumoM3,
    tarifaBase: tarifaServicio.tarifaBase,
    costoConsumo,
    subtotal: subtotal + subsidio, // Subtotal antes de subsidio
    subsidio,
    subtotalConSubsidio: subtotal,
    drenaje,
    iva,
    recargoMora,
    mesesMora,
    total: Math.round(total * 100) / 100,
    desglose,
    aplicaSubsidio: subsidio > 0,
    exentoIVA: !tarifaServicio.iva
  };
}

/**
 * Obtiene las tarifas oficiales de un municipio
 */
export function obtenerTarifasMunicipio(municipio, estado = null) {
  const tarifasMunicipio = TARIFAS_MUNICIPIOS[municipio.toLowerCase()];
  
  if (!tarifasMunicipio) {
    throw new Error(`Municipio ${municipio} no encontrado`);
  }

  if (estado && tarifasMunicipio.estado !== estado.toLowerCase()) {
    throw new Error(`El municipio ${municipio} no pertenece al estado ${estado}`);
  }

  return {
    municipio: municipio.charAt(0).toUpperCase() + municipio.slice(1),
    estado: tarifasMunicipio.estado,
    tarifas: { ...tarifasMunicipio }
  };
}

/**
 * Calcula el consumo basado en lecturas del medidor
 */
export function calcularConsumo(lecturaAnterior, lecturaActual) {
  if (typeof lecturaAnterior !== 'number' || typeof lecturaActual !== 'number') {
    throw new Error('Las lecturas deben ser números');
  }

  if (lecturaActual < lecturaAnterior) {
    throw new Error('La lectura actual no puede ser menor que la anterior');
  }

  const consumo = lecturaActual - lecturaAnterior;

  return {
    lecturaAnterior,
    lecturaActual,
    consumoM3: consumo,
    consumoLitros: consumo * 1000,
    fechaCalculo: new Date().toISOString().split('T')[0]
  };
}

/**
 * Obtiene la lista de municipios disponibles por estado
 */
export function obtenerMunicipiosDisponibles(estado = null) {
  const municipios = Object.keys(TARIFAS_MUNICIPIOS);
  
  if (!estado) {
    return municipios.map(m => m.charAt(0).toUpperCase() + m.slice(1));
  }

  return municipios
    .filter(municipio => TARIFAS_MUNICIPIOS[municipio].estado === estado.toLowerCase())
    .map(m => m.charAt(0).toUpperCase() + m.slice(1));
}

/**
 * Compara tarifas entre múltiples municipios
 */
export function compararTarifas(opciones) {
  const { municipios, tipoServicio = 'domestico', consumoM3 } = opciones;

  if (!Array.isArray(municipios) || municipios.length < 2) {
    throw new Error('Se requieren al menos 2 municipios para comparar');
  }

  const comparaciones = municipios.map(municipio => {
    try {
      const tarifa = calcularTarifaAgua({
        municipio,
        tipoServicio,
        consumoM3
      });
      return { ...tarifa, error: null };
    } catch (error) {
      return {
        municipio: municipio.charAt(0).toUpperCase() + municipio.slice(1),
        error: error.message,
        total: null
      };
    }
  });

  // Ordenar por total (menor a mayor)
  const validas = comparaciones.filter(c => !c.error);
  const ordenadas = validas.sort((a, b) => a.total - b.total);

  return {
    parametros: { tipoServicio, consumoM3 },
    comparaciones,
    masEconomico: ordenadas[0] || null,
    masCaro: ordenadas[ordenadas.length - 1] || null,
    diferenciaPrecio: ordenadas.length >= 2 ? 
      ordenadas[ordenadas.length - 1].total - ordenadas[0].total : 0
  };
}

/**
 * Obtiene estadísticas de la base de datos
 */
export function getEstadisticasAgua() {
  const municipios = Object.keys(TARIFAS_MUNICIPIOS);
  const estados = [...new Set(Object.values(TARIFAS_MUNICIPIOS).map(t => t.estado))];
  
  return {
    totalMunicipios: municipios.length,
    totalEstados: estados.length,
    municipios: municipios.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
    estados: estados.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
    tiposServicio: ['domestico', 'comercial', 'industrial', 'publico'],
    version: '1.0.0',
    ultimaActualizacion: '2024-09-26'
  };
}

// Exportación por defecto
export default {
  calcularTarifaAgua,
  obtenerTarifasMunicipio,
  calcularConsumo,
  obtenerMunicipiosDisponibles,
  compararTarifas,
  getEstadisticasAgua
};
