/**
 * Tests para Calculadora de Agua
 */

import { 
  calcularTarifaAgua,
  obtenerTarifasMunicipio,
  calcularConsumo,
  obtenerMunicipiosDisponibles,
  compararTarifas,
  getEstadisticasAgua
} from './index.js';

describe('Calculadora de Agua', () => {
  
  describe('calcularTarifaAgua', () => {
    test('debe calcular tarifa doméstica para Guadalajara correctamente', () => {
      const tarifa = calcularTarifaAgua({
        municipio: 'guadalajara',
        tipoServicio: 'domestico',
        consumoM3: 25
      });
      
      expect(tarifa.municipio).toBe('Guadalajara');
      expect(tarifa.estado).toBe('jalisco');
      expect(tarifa.tipoServicio).toBe('domestico');
      expect(tarifa.consumoM3).toBe(25);
      expect(tarifa.tarifaBase).toBe(180.50);
      expect(typeof tarifa.total).toBe('number');
      expect(tarifa.total).toBeGreaterThan(0);
      expect(tarifa.exentoIVA).toBe(true);
    });

    test('debe aplicar subsidio para consumo doméstico bajo', () => {
      const tarifa = calcularTarifaAgua({
        municipio: 'guadalajara',
        tipoServicio: 'domestico',
        consumoM3: 15,
        aplicarSubsidios: true
      });
      
      expect(tarifa.aplicaSubsidio).toBe(true);
      expect(tarifa.subsidio).toBeGreaterThan(0);
    });

    test('debe calcular tarifa comercial con IVA', () => {
      const tarifa = calcularTarifaAgua({
        municipio: 'guadalajara',
        tipoServicio: 'comercial',
        consumoM3: 30
      });
      
      expect(tarifa.tipoServicio).toBe('comercial');
      expect(tarifa.iva).toBeGreaterThan(0);
      expect(tarifa.exentoIVA).toBe(false);
    });

    test('debe calcular recargos por mora', () => {
      const tarifaSinMora = calcularTarifaAgua({
        municipio: 'monterrey',
        tipoServicio: 'domestico',
        consumoM3: 20,
        mesesMora: 0
      });

      const tarifaConMora = calcularTarifaAgua({
        municipio: 'monterrey',
        tipoServicio: 'domestico',
        consumoM3: 20,
        mesesMora: 2
      });
      
      expect(tarifaConMora.mesesMora).toBe(2);
      expect(tarifaConMora.recargoMora).toBeGreaterThan(0);
      expect(tarifaConMora.total).toBeGreaterThan(tarifaSinMora.total);
    });

    test('debe incluir desglose detallado por bloques', () => {
      const tarifa = calcularTarifaAgua({
        municipio: 'guadalajara',
        tipoServicio: 'domestico',
        consumoM3: 35
      });
      
      expect(Array.isArray(tarifa.desglose)).toBe(true);
      expect(tarifa.desglose.length).toBeGreaterThan(0);
      
      tarifa.desglose.forEach(bloque => {
        expect(bloque).toHaveProperty('rango');
        expect(bloque).toHaveProperty('consumo');
        expect(bloque).toHaveProperty('tarifa');
        expect(bloque).toHaveProperty('costo');
      });
    });

    test('debe lanzar error para municipio no encontrado', () => {
      expect(() => {
        calcularTarifaAgua({
          municipio: 'municipio-inexistente',
          tipoServicio: 'domestico',
          consumoM3: 20
        });
      }).toThrow('no encontrado en la base de datos');
    });

    test('debe lanzar error para consumo negativo', () => {
      expect(() => {
        calcularTarifaAgua({
          municipio: 'guadalajara',
          tipoServicio: 'domestico',
          consumoM3: -5
        });
      }).toThrow('El consumo no puede ser negativo');
    });

    test('debe lanzar error para parámetros faltantes', () => {
      expect(() => {
        calcularTarifaAgua({
          tipoServicio: 'domestico'
        });
      }).toThrow('Municipio y consumo en m³ son requeridos');
    });
  });

  describe('obtenerTarifasMunicipio', () => {
    test('debe retornar tarifas completas de un municipio', () => {
      const tarifas = obtenerTarifasMunicipio('guadalajara');
      
      expect(tarifas.municipio).toBe('Guadalajara');
      expect(tarifas.estado).toBe('jalisco');
      expect(tarifas.tarifas).toHaveProperty('domestico');
      expect(tarifas.tarifas).toHaveProperty('comercial');
      expect(tarifas.tarifas).toHaveProperty('industrial');
    });

    test('debe validar el estado del municipio', () => {
      expect(() => {
        obtenerTarifasMunicipio('guadalajara', 'nuevo-leon');
      }).toThrow('no pertenece al estado');
    });

    test('debe lanzar error para municipio inexistente', () => {
      expect(() => {
        obtenerTarifasMunicipio('municipio-falso');
      }).toThrow('no encontrado');
    });
  });

  describe('calcularConsumo', () => {
    test('debe calcular consumo correctamente', () => {
      const consumo = calcularConsumo(1250, 1275);
      
      expect(consumo.lecturaAnterior).toBe(1250);
      expect(consumo.lecturaActual).toBe(1275);
      expect(consumo.consumoM3).toBe(25);
      expect(consumo.consumoLitros).toBe(25000);
      expect(consumo.fechaCalculo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('debe manejar lecturas iguales (consumo cero)', () => {
      const consumo = calcularConsumo(1000, 1000);
      
      expect(consumo.consumoM3).toBe(0);
      expect(consumo.consumoLitros).toBe(0);
    });

    test('debe lanzar error para lectura actual menor', () => {
      expect(() => {
        calcularConsumo(1275, 1250);
      }).toThrow('La lectura actual no puede ser menor que la anterior');
    });

    test('debe lanzar error para lecturas no numéricas', () => {
      expect(() => {
        calcularConsumo('abc', 1275);
      }).toThrow('Las lecturas deben ser números');
    });
  });

  describe('obtenerMunicipiosDisponibles', () => {
    test('debe retornar todos los municipios disponibles', () => {
      const municipios = obtenerMunicipiosDisponibles();
      
      expect(Array.isArray(municipios)).toBe(true);
      expect(municipios.length).toBeGreaterThan(0);
      expect(municipios).toContain('Guadalajara');
      expect(municipios).toContain('Monterrey');
      expect(municipios).toContain('Cdmx');
    });

    test('debe filtrar municipios por estado', () => {
      const municipiosJalisco = obtenerMunicipiosDisponibles('jalisco');
      
      expect(Array.isArray(municipiosJalisco)).toBe(true);
      expect(municipiosJalisco).toContain('Guadalajara');
      expect(municipiosJalisco).not.toContain('Monterrey');
    });

    test('debe retornar array vacío para estado sin municipios', () => {
      const municipiosInexistentes = obtenerMunicipiosDisponibles('estado-falso');
      
      expect(Array.isArray(municipiosInexistentes)).toBe(true);
      expect(municipiosInexistentes.length).toBe(0);
    });
  });

  describe('compararTarifas', () => {
    test('debe comparar tarifas entre múltiples municipios', () => {
      const comparacion = compararTarifas({
        municipios: ['guadalajara', 'monterrey'],
        tipoServicio: 'domestico',
        consumoM3: 20
      });
      
      expect(comparacion.parametros.tipoServicio).toBe('domestico');
      expect(comparacion.parametros.consumoM3).toBe(20);
      expect(Array.isArray(comparacion.comparaciones)).toBe(true);
      expect(comparacion.comparaciones.length).toBe(2);
      expect(comparacion.masEconomico).toBeTruthy();
      expect(comparacion.masCaro).toBeTruthy();
      expect(typeof comparacion.diferenciaPrecio).toBe('number');
    });

    test('debe manejar municipios con errores en la comparación', () => {
      const comparacion = compararTarifas({
        municipios: ['guadalajara', 'municipio-falso'],
        tipoServicio: 'domestico',
        consumoM3: 20
      });
      
      expect(comparacion.comparaciones.length).toBe(2);
      
      const municipioValido = comparacion.comparaciones.find(c => c.municipio === 'Guadalajara');
      const municipioInvalido = comparacion.comparaciones.find(c => c.municipio === 'Municipio-falso');
      
      expect(municipioValido.error).toBeNull();
      expect(municipioInvalido.error).toBeTruthy();
    });

    test('debe lanzar error para menos de 2 municipios', () => {
      expect(() => {
        compararTarifas({
          municipios: ['guadalajara'],
          tipoServicio: 'domestico',
          consumoM3: 20
        });
      }).toThrow('Se requieren al menos 2 municipios para comparar');
    });
  });

  describe('getEstadisticasAgua', () => {
    test('debe retornar estadísticas completas de la base de datos', () => {
      const stats = getEstadisticasAgua();
      
      expect(stats).toHaveProperty('totalMunicipios');
      expect(stats).toHaveProperty('totalEstados');
      expect(stats).toHaveProperty('municipios');
      expect(stats).toHaveProperty('estados');
      expect(stats).toHaveProperty('tiposServicio');
      expect(stats).toHaveProperty('version');
      expect(stats).toHaveProperty('ultimaActualizacion');
      
      expect(typeof stats.totalMunicipios).toBe('number');
      expect(stats.totalMunicipios).toBeGreaterThan(0);
      expect(Array.isArray(stats.municipios)).toBe(true);
      expect(Array.isArray(stats.estados)).toBe(true);
      expect(Array.isArray(stats.tiposServicio)).toBe(true);
      
      expect(stats.tiposServicio).toContain('domestico');
      expect(stats.tiposServicio).toContain('comercial');
      expect(stats.tiposServicio).toContain('industrial');
    });
  });

  describe('Validaciones de estructura de datos', () => {
    test('todas las tarifas deben tener estructura válida', () => {
      const municipios = obtenerMunicipiosDisponibles();
      
      municipios.forEach(municipio => {
        const tarifas = obtenerTarifasMunicipio(municipio.toLowerCase());
        
        expect(tarifas.tarifas.domestico).toHaveProperty('tarifaBase');
        expect(tarifas.tarifas.domestico).toHaveProperty('bloques');
        expect(tarifas.tarifas.domestico).toHaveProperty('drenaje');
        expect(Array.isArray(tarifas.tarifas.domestico.bloques)).toBe(true);
      });
    });

    test('los cálculos deben ser consistentes', () => {
      const tarifa1 = calcularTarifaAgua({
        municipio: 'guadalajara',
        tipoServicio: 'domestico',
        consumoM3: 15
      });

      const tarifa2 = calcularTarifaAgua({
        municipio: 'guadalajara',
        tipoServicio: 'domestico',
        consumoM3: 15
      });
      
      expect(tarifa1.total).toBe(tarifa2.total);
    });
  });

  describe('Casos extremos', () => {
    test('debe manejar consumo muy alto', () => {
      const tarifa = calcularTarifaAgua({
        municipio: 'guadalajara',
        tipoServicio: 'comercial',
        consumoM3: 1000
      });
      
      expect(tarifa.total).toBeGreaterThan(0);
      expect(tarifa.desglose.length).toBeGreaterThan(0);
    });

    test('debe manejar consumo mínimo', () => {
      const tarifa = calcularTarifaAgua({
        municipio: 'guadalajara',
        tipoServicio: 'domestico',
        consumoM3: 1
      });
      
      expect(tarifa.total).toBeGreaterThan(0);
      expect(tarifa.consumoM3).toBe(1);
      expect(tarifa.tarifaBase).toBe(180.50);
    });

    test('debe manejar municipios con diferentes configuraciones', () => {
      const municipios = ['guadalajara', 'monterrey', 'cdmx'];
      
      municipios.forEach(municipio => {
        const tarifa = calcularTarifaAgua({
          municipio,
          tipoServicio: 'domestico',
          consumoM3: 20
        });
        
        expect(tarifa.total).toBeGreaterThan(0);
        expect(tarifa.municipio).toBeTruthy();
        expect(tarifa.estado).toBeTruthy();
      });
    });
  });
});
