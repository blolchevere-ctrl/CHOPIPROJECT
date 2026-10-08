// Problems keyed by course -> category -> topic title
// Each problem: { question, options: string[], answer: index, explanation }

export const problemsData = {
  'matematica': {
    'algebra': {
      'Leyes de Exponentes y Ecuaciones Exponenciales': [
        { question: 'Simplifica: (x³)² · x⁴', options: ['x¹⁰', 'x⁹', 'x²⁴', 'x⁷'], answer: 0, explanation: '(x³)² = x⁶, luego x⁶ · x⁴ = x¹⁰' },
        { question: 'Resuelve: 2ˣ = 32', options: ['x = 4', 'x = 5', 'x = 6', 'x = 3'], answer: 1, explanation: '32 = 2⁵, entonces x = 5' },
        { question: '¿Cuánto vale x⁰ para x ≠ 0?', options: ['x', '0', '1', 'Indefinido'], answer: 2, explanation: 'Cualquier número distinto de cero elevado a la potencia 0 es 1' },
      ],
      'Polinomios y Métodos de División (Horner/Ruffini)': [
        { question: 'Divide (x² + 3x + 2) ÷ (x + 1) usando Ruffini. ¿Cuál es el cociente?', options: ['x + 2', 'x + 1', 'x + 3', 'x − 2'], answer: 0, explanation: 'Raíz en x = −1. Cociente: x + 2, residuo 0' },
        { question: 'Si P(x) = x³ − 2x² + x − 1, ¿cuánto es P(2)?', options: ['1', '0', '−1', '3'], answer: 0, explanation: '8 − 8 + 2 − 1 = 1' },
      ],
      'Factorización y Productos Notables': [
        { question: 'Factoriza: x² − 9', options: ['(x−3)(x+3)', '(x−3)²', '(x−9)(x+1)', '(x+3)²'], answer: 0, explanation: 'Es diferencia de cuadrados: (x−3)(x+3)' },
        { question: 'Desarrolla: (x + 2)²', options: ['x² + 4x + 4', 'x² + 4', 'x² + 2x + 4', 'x² + 4x + 2'], answer: 0, explanation: '(a+b)² = a² + 2ab + b² = x² + 4x + 4' },
        { question: 'Factoriza: x² + 5x + 6', options: ['(x+2)(x+3)', '(x+1)(x+6)', '(x+5)(x+6)', '(x−2)(x−3)'], answer: 0, explanation: 'Buscamos dos números que sumen 5 y multipliquen 6: 2 y 3' },
      ],
      'Inecuaciones (1er/2do Grado y Puntos Críticos)': [
        { question: 'Resuelve: 2x − 6 > 0', options: ['x > 3', 'x < 3', 'x > −3', 'x < −3'], answer: 0, explanation: '2x > 6 → x > 3' },
        { question: 'Resuelve: x² − 4 < 0', options: ['−2 < x < 2', 'x < −2 o x > 2', 'x < 2', 'x > −2'], answer: 0, explanation: 'x² < 4 → −2 < x < 2' },
      ],
      'Valor Absoluto y Radicación': [
        { question: '¿Cuánto vale |−7|?', options: ['7', '−7', '0', '±7'], answer: 0, explanation: 'El valor absoluto siempre es positivo: |−7| = 7' },
        { question: 'Simplifica: √81', options: ['9', '±9', '3', '81'], answer: 0, explanation: '√81 = 9 (la raíz principal es positiva)' },
        { question: 'Resuelve: |x| = 5', options: ['x = ±5', 'x = 5', 'x = −5', 'x = 25'], answer: 0, explanation: '|x| = 5 → x = 5 o x = −5' },
      ],
      'Números Complejos': [
        { question: '¿Cuánto vale i²?', options: ['−1', '1', 'i', '−i'], answer: 0, explanation: 'i² = −1 por definición' },
        { question: 'Suma: (2 + 3i) + (1 − i)', options: ['3 + 2i', '3 + 4i', '1 + 2i', '2 + i'], answer: 0, explanation: 'Partes reales: 2+1=3, imaginarias: 3i−i=2i' },
      ],
      'Funciones y Logaritmos': [
        { question: 'Si f(x) = 2x + 3, ¿cuánto vale f(4)?', options: ['11', '7', '10', '14'], answer: 0, explanation: 'f(4) = 2(4)+3 = 11' },
        { question: 'Calcula: log₂(8)', options: ['3', '2', '4', '8'], answer: 0, explanation: '2³ = 8, entonces log₂(8) = 3' },
        { question: '¿Cuál es el dominio de f(x) = √x?', options: ['x ≥ 0', 'x > 0', 'Todos los reales', 'x ≠ 0'], answer: 0, explanation: 'La raíz cuadrada requiere argumento no negativo' },
      ],
    },
    'aritmetica': {
      'Teoría de Conjuntos': [
        { question: 'Si A = {1,2,3} y B = {2,3,4}, ¿cuánto vale A ∩ B?', options: ['{2,3}', '{1,2,3,4}', '{1,4}', '{}'], answer: 0, explanation: 'La intersección son los elementos comunes: {2,3}' },
        { question: 'Si A = {1,2} y B = {2,3}, ¿cuánto vale A ∪ B?', options: ['{1,2,3}', '{2}', '{1,3}', '{1,2,2,3}'], answer: 0, explanation: 'La unión agrupa todos los elementos sin repetir: {1,2,3}' },
      ],
      'Números Enteros y Divisibilidad (MCD y MCM)': [
        { question: '¿Cuál es el MCD de 12 y 18?', options: ['6', '3', '36', '2'], answer: 0, explanation: 'Los divisores comunes son 1,2,3,6. El mayor es 6' },
        { question: '¿Cuál es el MCM de 4 y 6?', options: ['12', '24', '2', '10'], answer: 0, explanation: 'Múltiplos de 4: 4,8,12... de 6: 6,12... El menor común es 12' },
        { question: '¿Cuál de estos números es primo?', options: ['17', '15', '21', '9'], answer: 0, explanation: '17 solo tiene como divisores 1 y 17' },
      ],
      'Números Racionales y Decimales': [
        { question: 'Convierte 3/4 a decimal', options: ['0.75', '0.34', '0.43', '1.33'], answer: 0, explanation: '3 ÷ 4 = 0.75' },
        { question: 'Suma: 1/2 + 1/4', options: ['3/4', '2/6', '1/6', '1/8'], answer: 0, explanation: '2/4 + 1/4 = 3/4' },
      ],
      'Razones, Proporciones y Promedios': [
        { question: 'Si 4 lápices cuestan S/20, ¿cuánto cuestan 7 lápices?', options: ['S/35', 'S/28', 'S/30', 'S/40'], answer: 0, explanation: 'Cada lápiz cuesta S/5, 7 × 5 = S/35' },
        { question: 'Calcula el promedio de 10, 14, 18, 20', options: ['15.5', '14', '16', '13'], answer: 0, explanation: '(10+14+18+20)/4 = 62/4 = 15.5' },
      ],
      'Magnitudes Proporcionales y Reparto': [
        { question: 'Reparte S/120 en razón 2:3. ¿Cuánto recibe la mayor parte?', options: ['S/72', 'S/48', 'S/60', 'S/80'], answer: 0, explanation: 'Total partes = 5. Mayor = 3/5 × 120 = S/72' },
        { question: 'Si 3 obreros tardan 10 días, ¿cuánto tardarán 5 obreros?', options: ['6 días', '15 días', '8 días', '12 días'], answer: 0, explanation: 'Inversamente proporcional: 3×10/5 = 6 días' },
      ],
      'Tanto por Ciento': [
        { question: '¿Cuánto es el 15% de 200?', options: ['30', '15', '45', '20'], answer: 0, explanation: '200 × 0.15 = 30' },
        { question: 'Si un producto de S/80 tiene 25% de descuento, ¿cuánto pagas?', options: ['S/60', 'S/55', 'S/65', 'S/70'], answer: 0, explanation: 'Descuento = S/20, precio final = S/60' },
      ],
      'Regla de Tres (Simple y Compuesta)': [
        { question: 'Si 5 obreros hacen un muro en 12 días, ¿cuántos días tardarán 3 obreros?', options: ['20 días', '8 días', '15 días', '18 días'], answer: 0, explanation: 'Inversa: 5×12/3 = 20 días' },
        { question: 'Si 3 máquinas producen 600 unidades en 2 horas, ¿cuánto producen 5 máquinas en 4 horas?', options: ['2000', '1500', '1200', '1800'], answer: 0, explanation: '600/3/2 = 100 por máquina/hora. 5×4×100 = 2000' },
      ],
      'Estadística Básica': [
        { question: '¿Cuál es la moda de: 3, 5, 5, 7, 8, 5, 2?', options: ['5', '3', '7', '2'], answer: 0, explanation: 'El 5 aparece 3 veces, más que cualquier otro' },
      ],
    },
    'geometria': {
      'Segmentos y Ángulos': [
        { question: 'Dos ángulos suplementarios suman:', options: ['180°', '90°', '360°', '270°'], answer: 0, explanation: 'Los ángulos suplementarios siempre suman 180°' },
        { question: 'Si un ángulo mide 35°, ¿cuánto mide su complemento?', options: ['55°', '45°', '65°', '145°'], answer: 0, explanation: '90° − 35° = 55°' },
      ],
      'Triángulos y Congruencia': [
        { question: 'En un triángulo equilátero, cada ángulo interno mide:', options: ['60°', '90°', '45°', '30°'], answer: 0, explanation: '180°/3 = 60°' },
        { question: '¿Cuál es el criterio de congruencia que requiere dos lados y el ángulo entre ellos?', options: ['SAS', 'SSS', 'ASA', 'AAA'], answer: 0, explanation: 'SAS: Lado-Ángulo-Lado' },
      ],
      'Polígonos y Cuadriláteros': [
        { question: '¿Cuánto suman los ángulos internos de un pentágono?', options: ['540°', '360°', '720°', '180°'], answer: 0, explanation: '(5−2)×180 = 540°' },
        { question: 'En un cuadrado, si el lado mide 5, ¿cuánto mide el perímetro?', options: ['20', '25', '10', '15'], answer: 0, explanation: '4 × 5 = 20' },
      ],
      'Circunferencia': [
        { question: 'Si el radio es 3, ¿cuál es la longitud de la circunferencia?', options: ['6π', '3π', '9π', '12π'], answer: 0, explanation: 'C = 2πr = 2π(3) = 6π' },
        { question: '¿Cuál es el área de un círculo de radio 5?', options: ['25π', '10π', '5π', '100π'], answer: 0, explanation: 'A = πr² = π(25) = 25π' },
      ],
      'Proporcionalidad y Semejanza (Thales)': [
        { question: 'En el teorema de Thales, si tres rectas paralelas cortan a dos transversales, los segmentos correspondientes son:', options: ['Proporcionales', 'Iguales', 'Perpendiculares', 'Paralelos'], answer: 0, explanation: 'Thales dice que los segmentos son proporcionales' },
      ],
      'Relaciones Métricas y Pitágoras': [
        { question: 'En un triángulo rectángulo con catetos 3 y 4, ¿cuánto vale la hipotenusa?', options: ['5', '7', '6', '√7'], answer: 0, explanation: 'h² = 9 + 16 = 25, h = 5' },
        { question: 'Si la hipotenusa es 10 y un cateto es 6, ¿cuánto vale el otro cateto?', options: ['8', '4', '6', '√64'], answer: 0, explanation: '100 − 36 = 64, √64 = 8' },
      ],
      'Áreas de Regiones Planas': [
        { question: '¿Cuál es el área de un triángulo con base 6 y altura 4?', options: ['12', '24', '10', '20'], answer: 0, explanation: 'A = (b×h)/2 = (6×4)/2 = 12' },
        { question: '¿Cuál es el área de un rectángulo de 7 por 3?', options: ['21', '10', '14', '24'], answer: 0, explanation: 'A = base × altura = 7 × 3 = 21' },
      ],
      'Geometría del Espacio y Poliedros': [
        { question: '¿Cuánto vale el volumen de un cubo de arista 3?', options: ['27', '9', '12', '81'], answer: 0, explanation: 'V = a³ = 3³ = 27' },
        { question: '¿Cuántas caras tiene un cubo?', options: ['6', '4', '8', '12'], answer: 0, explanation: 'Un cubo tiene 6 caras cuadradas' },
      ],
    },
    'trigonometria': {
      'Sistemas de Medición Angular y Sector Circular': [
        { question: 'Convierte 90° a radianes', options: ['π/2', 'π', 'π/3', 'π/4'], answer: 0, explanation: '90° × π/180 = π/2' },
        { question: 'Convierte π/3 radianes a grados', options: ['60°', '90°', '45°', '30°'], answer: 0, explanation: 'π/3 × 180/π = 60°' },
      ],
      'Razones Trigonométricas de Ángulos Agudos': [
        { question: '¿Cuánto vale sen(30°)?', options: ['1/2', '√3/2', '√2/2', '1'], answer: 0, explanation: 'sen(30°) = 1/2' },
        { question: '¿Cuánto vale cos(60°)?', options: ['1/2', '√3/2', '√2/2', '0'], answer: 0, explanation: 'cos(60°) = 1/2' },
        { question: '¿Cuánto vale tan(45°)?', options: ['1', '√3', '0', '√2'], answer: 0, explanation: 'tan(45°) = sen/cos = 1' },
      ],
      'Razones de Ángulos en Posición Normal': [
        { question: '¿En qué cuadrante sen θ < 0 y cos θ > 0?', options: ['IV', 'III', 'II', 'I'], answer: 0, explanation: 'En el IV cuadrante cos es positivo y sen es negativo' },
      ],
      'Identidades Trigonométricas (Simples, Compuestas, Doble/Mitad)': [
        { question: 'Simplifica: sen²θ + cos²θ', options: ['1', '0', '2sen²θ', 'tan²θ'], answer: 0, explanation: 'Identidad pitagórica fundamental: sen²θ + cos²θ = 1' },
        { question: '¿Cuánto vale sen(2θ)?', options: ['2senθ·cosθ', 'sen²θ', 'cos²θ', '2cosθ'], answer: 0, explanation: 'Fórmula del ángulo doble: sen(2θ) = 2senθcosθ' },
      ],
      'Ecuaciones Trigonométricas': [
        { question: 'Resuelve: sen θ = 0, para 0 ≤ θ < 2π', options: ['θ = 0, π', 'θ = π/2', 'θ = 0', 'θ = π/2, 3π/2'], answer: 0, explanation: 'sen θ = 0 en θ = 0 y θ = π dentro del intervalo' },
      ],
      'Resolución de Triángulos Oblicuángulos': [
        { question: '¿Qué ley se usa cuando se conocen dos lados y el ángulo opuesto?', options: ['Ley de Senos', 'Ley de Cosenos', 'Ley de Tangentes', 'Pitágoras'], answer: 0, explanation: 'La ley de senos relaciona lados con senos de ángulos opuestos' },
      ],
    },
  },
  'fisica': {
    'clasica': {
      'Vectores y Análisis Dimensional': [
        { question: '¿Cuál es la unidad de fuerza en el SI?', options: ['Newton (N)', 'Joule (J)', 'Watt (W)', 'Pascal (Pa)'], answer: 0, explanation: 'La fuerza se mide en Newtons: 1 N = 1 kg·m/s²' },
        { question: '¿Cuáles son las dimensiones de velocidad?', options: ['L/T', 'L·T', 'L/T²', 'L²/T'], answer: 0, explanation: 'Velocidad = longitud/tiempo = L/T' },
      ],
      'Cinemática (MRU, MRUV, Parabólico, MCU)': [
        { question: 'Un auto viaja a 20 m/s durante 5 s. ¿Qué distancia recorre?', options: ['100 m', '25 m', '4 m', '200 m'], answer: 0, explanation: 'd = v × t = 20 × 5 = 100 m' },
        { question: 'Si parte del reposo y acelera a 2 m/s² durante 3 s, ¿cuál es su velocidad final?', options: ['6 m/s', '5 m/s', '3 m/s', '8 m/s'], answer: 0, explanation: 'v = v₀ + at = 0 + 2(3) = 6 m/s' },
      ],
      'Dinámica y Leyes de Newton': [
        { question: '¿Qué fuerza neta se necesita para acelerar 4 kg a 3 m/s²?', options: ['12 N', '7 N', '1.33 N', '4 N'], answer: 0, explanation: 'F = ma = 4 × 3 = 12 N' },
        { question: 'La primera ley de Newton se conoce como:', options: ['Ley de Inercia', 'Ley de Acción-Reacción', 'Ley de Gravedad', 'Ley de Fuerza'], answer: 0, explanation: 'La primera ley dice que un cuerpo mantiene su estado de movimiento (inercia)' },
      ],
      'Estática y DCL': [
        { question: 'Para que un cuerpo esté en equilibrio estático, la suma de fuerzas debe ser:', options: ['Cero', 'Positiva', 'Negativa', 'Máxima'], answer: 0, explanation: 'En equilibrio: ΣF = 0 y ΣM = 0' },
      ],
      'Trabajo, Potencia y Energía Mecánica': [
        { question: 'Calcula el trabajo de una fuerza de 10 N que desplaza un objeto 5 m en su dirección.', options: ['50 J', '2 J', '15 J', '5 J'], answer: 0, explanation: 'W = F × d = 10 × 5 = 50 J' },
        { question: '¿Cuál es la energía cinética de un cuerpo de 2 kg que viaja a 3 m/s?', options: ['9 J', '6 J', '3 J', '12 J'], answer: 0, explanation: 'Ec = ½mv² = ½(2)(9) = 9 J' },
      ],
      'Calorimetría y Cambios de Fase': [
        { question: '¿Cuánto calor se necesita para elevar 2 kg de agua 10°C? (c = 4186 J/kg°C)', options: ['83720 J', '41860 J', '8372 J', '4186 J'], answer: 0, explanation: 'Q = mcΔT = 2 × 4186 × 10 = 83720 J' },
      ],
      'Electromagnetismo (Campo Eléctrico, Circuitos, Campo Magnético)': [
        { question: '¿Cuál es la unidad de resistencia eléctrica?', options: ['Ohm (Ω)', 'Voltio (V)', 'Amperio (A)', 'Vatio (W)'], answer: 0, explanation: 'La resistencia se mide en Ohmios (Ω)' },
        { question: 'Si V = 12 V y R = 4 Ω, ¿cuál es la corriente?', options: ['3 A', '48 A', '0.33 A', '8 A'], answer: 0, explanation: 'I = V/R = 12/4 = 3 A (Ley de Ohm)' },
      ],
      'Óptica (Reflexión, Refracción y Lentes)': [
        { question: 'El ángulo de incidencia es igual al ángulo de:', options: ['Reflexión', 'Refracción', 'Crítico', 'Desviación'], answer: 0, explanation: 'Ley de la reflexión: ángulo de incidencia = ángulo de reflexión' },
      ],
    },
    'moderna': {
      'Radiación de Cuerpo Negro': [
        { question: 'La radiación de cuerpo negro fue explicada por:', options: ['Planck', 'Einstein', 'Bohr', 'Heisenberg'], answer: 0, explanation: 'Max Planck propuso que la energía se emite en cuantos discretos' },
      ],
      'Efecto Fotoeléctrico': [
        { question: 'El efecto fotoeléctrico fue explicado por:', options: ['Einstein', 'Planck', 'Bohr', 'Newton'], answer: 0, explanation: 'Einstein explicó el efecto fotoeléctrico usando cuantos de luz (fotones)' },
      ],
      'Ondas de Materia': [
        { question: '¿Quién propuso que las partículas tienen propiedades de onda?', options: ['de Broglie', 'Heisenberg', 'Schrödinger', 'Bohr'], answer: 0, explanation: 'de Broglie propuso la dualidad onda-partícula' },
      ],
      'Relatividad Especial': [
        { question: 'Según la relatividad especial, nada puede superar la velocidad de:', options: ['La luz', 'El sonido', 'La gravedad', 'El viento'], answer: 0, explanation: 'c es la velocidad límite del universo' },
        { question: 'La famosa ecuación E = mc² fue propuesta por:', options: ['Einstein', 'Newton', 'Planck', 'Bohr'], answer: 0, explanation: 'Einstein dedujo E = mc² de la relatividad especial' },
      ],
      'Radiactividad y Física/Fisión Nuclear': [
        { question: '¿Qué partícula tiene mayor poder de penetración?', options: ['Rayo gamma', 'Partícula alfa', 'Partícula beta', 'Neutrón'], answer: 0, explanation: 'Los rayos gamma son radiación electromagnética de alta energía, la más penetrante' },
      ],
    },
  },
  'quimica': {
    'inorganica': {
      'Materia y sus Propiedades': [
        { question: '¿Cuál es un cambio químico?', options: ['Combustión de madera', 'Fusión de hielo', 'Evaporación de agua', 'Disolver sal en agua'], answer: 0, explanation: 'La combustión produce nuevas sustancias (cambio químico)' },
        { question: '¿Cuál es una propiedad intensiva de la materia?', options: ['Densidad', 'Masa', 'Volumen', 'Peso'], answer: 0, explanation: 'La densidad no depende de la cantidad de materia (propiedad intensiva)' },
      ],
      'Estructura Atómica y Números Cuánticos': [
        { question: 'El número atómico de un elemento equivale a:', options: ['Número de protones', 'Número de neutrones', 'Número de electrones de valencia', 'Número de isótopos'], answer: 0, explanation: 'El número atómico Z = número de protones' },
        { question: '¿Cuántos electrones caben máximo en el tercer nivel?', options: ['18', '8', '2', '32'], answer: 0, explanation: '2n² = 2(3²) = 18 electrones' },
      ],
      'Tabla Periódica y Propiedades Periódicas': [
        { question: 'Los gases nobles están en el grupo:', options: ['18 (VIIIA)', '1 (IA)', '17 (VIIA)', '2 (IIA)'], answer: 0, explanation: 'Los gases nobles (He, Ne, Ar...) están en el grupo 18' },
        { question: '¿Cuál es el elemento más electronegativo?', options: ['Flúor', 'Oxígeno', 'Cloro', 'Nitrógeno'], answer: 0, explanation: 'El flúor tiene la mayor electronegatividad (3.98)' },
      ],
      'Enlace Químico (Iónico, Covalente, Intermolecular)': [
        { question: 'El NaCl es un compuesto de enlace:', options: ['Iónico', 'Covalente', 'Metálico', 'Puente de hidrógeno'], answer: 0, explanation: 'Na transfiere un electrón a Cl, formando un enlace iónico' },
        { question: 'En el enlace covalente, los átomos:', options: ['Comparten electrones', 'Transfieren electrones', 'No interactúan', 'Comparten protones'], answer: 0, explanation: 'El enlace covalente consiste en compartir pares de electrones' },
      ],
      'Nomenclatura Inorgánica IUPAC': [
        { question: '¿Cuál es la fórmula del óxido de calcio?', options: ['CaO', 'Ca₂O', 'CaO₂', 'Ca₃O'], answer: 0, explanation: 'Ca tiene valencia +2, O tiene −2, se neutralizan: CaO' },
        { question: 'El nombre IUPAC de HCl es:', options: ['Cloruro de hidrógeno', 'Ácido clorhídrico', 'Clorina', 'Hidruro de cloro'], answer: 0, explanation: 'HCl como compuesto puro se llama cloruro de hidrógeno' },
      ],
      'Reacciones Químicas y Redox': [
        { question: 'En una reacción de oxidación, el agente que se oxida:', options: ['Pierde electrones', 'Gana electrones', 'No cambia', 'Gana protones'], answer: 0, explanation: 'Oxidación = pérdida de electrones' },
        { question: 'Balancea: H₂ + O₂ → H₂O. ¿Cuál es el coeficiente de O₂?', options: ['½', '1', '2', '3'], answer: 0, explanation: '2H₂ + O₂ → 2H₂O, el coeficiente de O₂ es 1 (o ½ si no se usa el mínimo entero)' },
      ],
      'Unidades Químicas de Masa y Estequiometría': [
        { question: '¿Cuál es la masa molar del agua (H₂O)?', options: ['18 g/mol', '16 g/mol', '20 g/mol', '17 g/mol'], answer: 0, explanation: '2(1) + 16 = 18 g/mol' },
        { question: '¿Cuántos moles hay en 36 g de agua?', options: ['2 mol', '1 mol', '0.5 mol', '3 mol'], answer: 0, explanation: '36/18 = 2 mol' },
      ],
      'Leyes de los Gases': [
        { question: 'A presión constante, si la temperatura de un gas aumenta, su volumen:', options: ['Aumenta', 'Disminuye', 'No cambia', 'Se duplica exactamente'], answer: 0, explanation: 'Ley de Charles: V ∝ T a presión constante' },
        { question: 'La ley de Boyle relaciona:', options: ['Presión y volumen', 'Volumen y temperatura', 'Presión y temperatura', 'Cantidad y volumen'], answer: 0, explanation: 'Boyle: P ∝ 1/V a temperatura constante' },
      ],
    },
    'organica': {
      'El Átomo de Carbono e Hibridación': [
        { question: '¿Qué hibridación tiene el carbono en un alcano?', options: ['sp³', 'sp²', 'sp', 'sp⁴'], answer: 0, explanation: 'Los enlaces simples usan hibridación sp³ (tetraédrica)' },
        { question: '¿Cuántos enlaces puede formar un átomo de carbono?', options: ['4', '3', '2', '6'], answer: 0, explanation: 'El carbono tiene 4 electrones de valencia, forma 4 enlaces' },
      ],
      'Hidrocarburos (Alcanos, Alquenos, Alquinos, Aromáticos)': [
        { question: 'El eteno (C₂H₄) es un:', options: ['Alqueno', 'Alcano', 'Alquino', 'Aromático'], answer: 0, explanation: 'Tiene un doble enlace C=C, por lo tanto es un alqueno' },
        { question: 'La fórmula general de los alcanos es:', options: ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'], answer: 0, explanation: 'Los alcanos siguen CₙH₂ₙ₊₂' },
      ],
      'Compuestos Oxigenados (Alcoholes, Aldehídos, Cetonas, Ácidos)': [
        { question: 'El grupo funcional de los alcoholes es:', options: ['−OH', '−CHO', '−COOH', '−CO'], answer: 0, explanation: 'El grupo hidroxilo (−OH) caracteriza a los alcoholes' },
        { question: 'El grupo de los ácidos carboxílicos es:', options: ['−COOH', '−OH', '−CHO', '−CO'], answer: 0, explanation: 'El grupo carboxilo (−COOH) define a los ácidos carboxílicos' },
      ],
      'Compuestos Nitrogenados (Aminas, Amidas, Aminoácidos)': [
        { question: 'El grupo funcional de las amidas es:', options: ['−CONH₂', '−NH₂', '−NO₂', '−CN'], answer: 0, explanation: 'Las amidas tienen el grupo −CONH₂' },
      ],
      'Isomería': [
        { question: 'El butano y el isobutano son ejemplos de:', options: ['Isomería estructural', 'Isomería geométrica', 'Isomería óptica', 'Mismo compuesto'], answer: 0, explanation: 'Tienen la misma fórmula pero distinta conectividad: isomería estructural' },
      ],
    },
  },
  'estadistica': {
    'descriptiva': {
      'Introducción a la Estadística y Tipos de Datos': [
        { question: 'La altura de estudiantes es una variable:', options: ['Continua', 'Discreta', 'Cualitativa', 'Ordinal'], answer: 0, explanation: 'La altura puede tomar cualquier valor en un rango (continua)' },
        { question: 'El color de ojos es una variable:', options: ['Cualitativa nominal', 'Cuantitativa continua', 'Cuantitativa discreta', 'Cualitativa ordinal'], answer: 0, explanation: 'El color de ojos no tiene orden numérico: cualitativa nominal' },
      ],
      'Tablas de Frecuencia y Gráficos Estadísticos': [
        { question: 'En una tabla de frecuencias, la frecuencia acumulada del último intervalo debe ser:', options: ['Igual al total de datos', '0', '1', 'Igual a la frecuencia simple'], answer: 0, explanation: 'La frecuencia acumulada suma todas las anteriores hasta llegar al total' },
      ],
      'Medidas de Tendencia Central (Media, Mediana, Moda)': [
        { question: 'Calcula la mediana de: 2, 4, 6, 8, 10', options: ['6', '5', '4', '8'], answer: 0, explanation: 'Con datos ordenados impares, la mediana es el valor central: 6' },
        { question: 'Calcula la media de: 4, 6, 8', options: ['6', '4', '8', '18'], answer: 0, explanation: '(4+6+8)/3 = 18/3 = 6' },
      ],
      'Medidas de Dispersión (Rango, Varianza, Desviación Estándar)': [
        { question: '¿Cuál es el rango de: 3, 7, 2, 9, 1?', options: ['8', '5', '9', '3'], answer: 0, explanation: 'Rango = máximo − mínimo = 9 − 1 = 8' },
        { question: 'Si la varianza es 16, ¿cuál es la desviación estándar?', options: ['4', '8', '16', '256'], answer: 0, explanation: 'Desviación estándar = √varianza = √16 = 4' },
      ],
      'Medidas de Posición (Cuantiles, Percentiles)': [
        { question: 'El percentil 50 equivale a:', options: ['La mediana', 'La media', 'La moda', 'El rango'], answer: 0, explanation: 'El percentil 50 (P50) es la mediana' },
      ],
    },
    'inferencial': {
      'Probabilidad Básica y Regla de Laplace': [
        { question: 'Al lanzar un dado, ¿cuál es la probabilidad de obtener un 3?', options: ['1/6', '1/3', '1/2', '3/6'], answer: 0, explanation: '1 caso favorable / 6 casos posibles = 1/6' },
        { question: 'Al lanzar una moneda dos veces, ¿cuál es la probabilidad de dos caras?', options: ['1/4', '1/2', '1/8', '2/4'], answer: 0, explanation: '4 resultados posibles, 1 favorable (CC) = 1/4' },
        { question: 'En una baraja de 52 cartas, ¿cuál es la probabilidad de sacar un as?', options: ['1/13', '1/4', '1/52', '4/13'], answer: 0, explanation: '4 ases / 52 cartas = 4/52 = 1/13' },
      ],
      'Distribuciones de Probabilidad (Binomial, Normal)': [
        { question: 'La distribución normal es:', options: ['Simétrica y acampanada', 'Asimétrica positiva', 'Uniforme', 'Bimodal'], answer: 0, explanation: 'La distribución normal es simétrica con forma de campana' },
        { question: 'En la distribución normal, ¿qué porcentaje está dentro de ±1 desviación estándar?', options: ['≈68%', '≈95%', '≈99%', '≈50%'], answer: 0, explanation: 'La regla 68-95-99.7: ±1σ ≈ 68%' },
      ],
      'Teorema del Límite Central': [
        { question: 'El teorema del límite central dice que la distribución muestral de la media tiende a:', options: ['Normal', 'Uniforme', 'Binomial', 'Exponencial'], answer: 0, explanation: 'Sin importar la distribución original, la media muestral tiende a normal' },
      ],
      'Estimación por Intervalos de Confianza': [
        { question: 'Un intervalo de confianza del 95% significa que:', options: ['El 95% de los intervalos contienen el parámetro', 'El parámetro está al 95% del valor real', 'Hay 95% de certeza en un único cálculo', 'El error es del 5%'], answer: 0, explanation: 'Si repetimos el muestreo, el 95% de los intervalos contendrán el parámetro real' },
      ],
      'Pruebas de Hipótesis (Paramétricas)': [
        { question: 'Si el valor p < 0.05, se:', options: ['Rechaza la hipótesis nula', 'Acepta la hipótesis nula', 'No se decide', 'Se repite el experimento'], answer: 0, explanation: 'Un valor p menor que α significa evidencia significativa para rechazar H₀' },
      ],
      'Regresión Lineal y Correlación': [
        { question: 'Un coeficiente de correlación de −0.9 indica:', options: ['Correlación negativa fuerte', 'Correlación positiva fuerte', 'Sin correlación', 'Correlación perfecta positiva'], answer: 0, explanation: 'El signo negativo indica relación inversa y |0.9| indica fuerza alta' },
      ],
    },
  },
};

// Returns a random problem for a given course/category/topic
export function getProblemForTopic(courseId, categoryId, topicTitle) {
  const courseProblems = problemsData[courseId];
  if (!courseProblems) return null;
  const categoryProblems = courseProblems[categoryId];
  if (!categoryProblems) return null;
  const problems = categoryProblems[topicTitle];
  if (!problems || problems.length === 0) return null;
  return problems[Math.floor(Math.random() * problems.length)];
}
