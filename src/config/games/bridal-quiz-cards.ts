import type { GameCard } from '@/lib/store'

export const BRIDAL_QUIZ_TITLE = 'Quiz o Pannie Młodej'

export const BRIDAL_QUIZ_CARDS: Omit<GameCard, 'id'>[] = [
  {
    type: 'QUIZ',
    description: 'Jak miała na imię jej pierwsza miłość?',
    answer: 'Adam',
    options: ['Tomek', 'Marcin', 'Adam', 'Robert'],
  },
  {
    type: 'QUIZ',
    description: 'Jaki jest dokładny rozmiar stopy Panny Młodej?',
    answer: '37',
    options: ['36', '36,5', '37', '38'],
  },
  {
    type: 'QUIZ',
    description: 'Co najczęściej zamawia do jedzenia?',
    answer: 'Sushi',
    options: ['Sushi', 'Shoarma', 'Burger', 'Pizza'],
  },
  {
    type: 'QUIZ',
    description: 'Co robi, kiedy jest mocno zestresowana?',
    answer: 'Wyżywa się na Marcinie',
    options: ['Płacze', 'Obgryza paznokcie', 'Wyżywa się na Marcinie', 'Idzie na zakupy'],
  },
  {
    type: 'QUIZ',
    description: 'O czym marzyła jako mała dziewczynka?',
    answer: 'O byciu rolnikiem',
    options: [
      'O byciu rolnikiem',
      'O byciu żoną męża',
      'O byciu bizneswoman',
      'O własnym salonie beauty',
    ],
  },
  {
    type: 'QUIZ',
    description: 'Gdzie miał miejsce ich pierwszy pocałunek?',
    answer: 'Wrocław, mieszkanie',
    options: ['Bełchatów, spacer', 'Wrocław, klub', 'Wrocław, mieszkanie', 'Bełchatów, wesele'],
  },
  {
    type: 'QUIZ',
    description: 'Co na samym początku najbardziej nie pasowało jej w Marcinie?',
    answer: 'Ubiór',
    options: ['Miejsce zamieszkania', 'Praca', 'Ubiór', 'Wzrost'],
  },
  {
    type: 'QUIZ',
    description: 'Najbardziej żenująca sytuacja z przyszłym mężem to...?',
    answer: 'Lunatykowanie podczas pierwszej nocy u Marcina',
    options: [
      'Seks na weselu Magdy',
      'Obrzyganie płaszcza',
      'Lunatykowanie podczas pierwszej nocy u Marcina',
      'Pierd podczas minetki',
    ],
  },
  {
    type: 'QUIZ',
    description: 'Ile osób pocałowała na imprezie w jedną noc? (Rekord)',
    answer: '3',
    options: ['1', '2', '3', '4'],
  },
  {
    type: 'QUIZ',
    description: 'Jej ulubiona pozycja seksualna to?',
    answer: 'Odwrócony kowboj',
    options: ['Na pieska', '69', 'Na misjonarza', 'Odwrócony kowboj'],
  },
  {
    type: 'QUIZ',
    description: 'Czy zdarzyło jej się potajemnie sprawdzać telefon Marcina?',
    answer: 'Tak',
    options: ['Tak', 'Nie'],
  },
  {
    type: 'QUIZ',
    description: 'Jakie imię by wybrała, gdyby miała mieć córkę?',
    answer: 'Liliana',
    options: ['Aurelia', 'Liliana', 'Zofia', 'Oliwia'],
  },
  {
    type: 'QUIZ',
    description: 'Jakie imię by wybrała, gdyby miała mieć syna?',
    answer: 'Ignacy',
    options: ['Franek', 'Staś', 'Ignacy', 'Antoś'],
  },
  {
    type: 'QUIZ',
    description: 'Czego za żadne skarby świata nie chciałaby na swoim weselu?',
    answer: 'Pijanych dram i awantur',
    options: [
      'By ktoś założył białą sukienkę',
      'Pijanych dram i awantur',
      'Żenujących zabaw z podtekstem',
      'Krzyczenia „Gorzko, gorzko” co 5 minut',
    ],
  },
  {
    type: 'QUIZ',
    description: 'Jakie było jej największe kłamstwo w tym związku?',
    answer: 'Mam naturalne usta',
    options: [
      'Jestem dziewicą',
      'Mam naturalne usta',
      'Nie palę papierosów',
      'Nie stalkowałam twojej byłej',
    ],
  },
  {
    type: 'QUIZ',
    description: 'Jaka była najbardziej pikantna wiadomość, którą mu wysłała?',
    answer: 'Całe nagie foto',
    options: [
      'Gołe zdjęcie cyców',
      'Całe nagie foto',
      'Tekst: „Mam na ciebie ochotę”',
      'Tekst: „Przyjedź, natychmiast”',
    ],
  },
  {
    type: 'QUIZ',
    description: 'O co ta dwójka najczęściej się kłóci?',
    answer: 'O sprzątanie',
    options: ['O sprzątanie', 'O granie Marcina', 'O zazdrość', 'O brak czasu'],
  },
]
