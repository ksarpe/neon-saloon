export interface HighLowQuestion {
  id: string
  text: string
  answer: number
  unit: string // e.g. "par", "zł", "km"
  hint?: string // shown after reveal
}

export const HIGHLOW_QUESTIONS: HighLowQuestion[] = [
  {
    id: 'hl1',
    text: 'Ile małżeństw zawarto w Polsce w 2023 roku?',
    answer: 140000,
    unit: 'par',
    hint: 'Dane GUS 2023',
  },
  {
    id: 'hl2',
    text: 'Ile złotych kosztuje przeciętne wesele w Polsce?',
    answer: 50000,
    unit: 'zł',
    hint: 'Łącznie z przyjęciem, sukienką i dekoracjami',
  },
  {
    id: 'hl3',
    text: 'Ile kilometrów ma rzeka Wisła?',
    answer: 1047,
    unit: 'km',
  },
  {
    id: 'hl4',
    text: 'Ile metrów n.p.m. mają Rysy — najwyższy szczyt Polski?',
    answer: 2499,
    unit: 'm n.p.m.',
  },
  {
    id: 'hl5',
    text: 'Ile dni trwa ciąża u człowieka?',
    answer: 280,
    unit: 'dni',
  },
  {
    id: 'hl6',
    text: 'Ile gramów waży przeciętne ludzkie serce?',
    answer: 300,
    unit: 'g',
  },
  {
    id: 'hl7',
    text: 'Ile lat ma przeciętna panna młoda biorąca ślub w Polsce?',
    answer: 29,
    unit: 'lat',
    hint: 'Średnia z danych GUS',
  },
  {
    id: 'hl8',
    text: 'Ile złotych wydaje się przeciętnie na prezent ślubny w Polsce?',
    answer: 500,
    unit: 'zł',
  },
  {
    id: 'hl9',
    text: 'Ile mieszkańców liczy Kraków?',
    answer: 780000,
    unit: 'osób',
  },
  {
    id: 'hl10',
    text: 'Ile kalorii ma lampka białego wina (150 ml)?',
    answer: 125,
    unit: 'kcal',
  },
  {
    id: 'hl11',
    text: 'Ile procent Polaków posiada własne mieszkanie lub dom?',
    answer: 85,
    unit: '%',
  },
  {
    id: 'hl12',
    text: 'Ile kilometrów przejdzie człowiek w ciągu całego życia?',
    answer: 160000,
    unit: 'km',
  },
  {
    id: 'hl13',
    text: 'Ile razy bije serce człowieka na minutę w spoczynku?',
    answer: 70,
    unit: 'razy/min',
  },
  {
    id: 'hl14',
    text: 'Ile złotych kosztuje przeciętnie butelka prosecco w polskim sklepie?',
    answer: 45,
    unit: 'zł',
  },
  {
    id: 'hl15',
    text: 'Ile procent kobiet w Polsce wychodzi za mąż przed 30. urodzinami?',
    answer: 68,
    unit: '%',
  },
  {
    id: 'hl16',
    text: 'Ile cm wzrostu ma przeciętna Polka?',
    answer: 165,
    unit: 'cm',
  },
  {
    id: 'hl17',
    text: 'Ile km/h może osiągnąć koń w pełnym galopie?',
    answer: 70,
    unit: 'km/h',
  },
  {
    id: 'hl18',
    text: 'Ile złotych kosztuje przeciętna suknia ślubna w Polsce?',
    answer: 3500,
    unit: 'zł',
  },
  {
    id: 'hl19',
    text: 'Ile gości zaprasza się na przeciętne polskie wesele?',
    answer: 120,
    unit: 'osób',
  },
  {
    id: 'hl20',
    text: 'Ile procent małżeństw w Polsce kończy się rozwodem?',
    answer: 33,
    unit: '%',
    hint: 'Co trzecia para się rozstaje',
  },
]
