export interface CategoryQuestion {
  text: string
  answer: string
  options: string[]
}

export interface QuestionCategory {
  id: string
  name: string
  description: string
  color: string
  border: string
  bg: string
  questions: CategoryQuestion[]
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  //anatomy
  {
    id: 'anatomy',
    name: 'Anatomia ciała',
    description: 'Pytania o ludzkie ciało i jak działa od środka',
    color: 'var(--neon-pink)',
    border: 'rgba(221,84,162,0.5)',
    bg: 'rgba(221,84,162,0.07)',
    questions: [
      {
        text: 'Który narząd odpowiada za pompowanie krwi?',
        answer: 'Serce',
        options: ['Płuca', 'Serce', 'Wątroba', 'Nerki'],
      },
      {
        text: 'Ile kości ma dorosły człowiek?',
        answer: '206',
        options: ['186', '206', '250', '312'],
      },
      {
        text: 'Jak długie jest jelito cienkie człowieka?',
        answer: 'Około 6 metrów',
        options: ['Około 1 metra', 'Około 3 metrów', 'Około 6 metrów', 'Około 12 metrów'],
      },
      {
        text: 'Który narząd wytwarza insulinę?',
        answer: 'Trzustka',
        options: ['Wątroba', 'Śledziona', 'Trzustka', 'Nerka'],
      },
      {
        text: 'Jak nazywa się największa kość w ciele człowieka?',
        answer: 'Kość udowa',
        options: ['Kość piszczelowa', 'Kość biodrowa', 'Kość udowa', 'Kość ramienna'],
      },
      {
        text: 'Która grupa krwi jest dawcą uniwersalnym?',
        answer: '0 Rh-',
        options: ['A+', 'AB+', '0 Rh-', 'B-'],
      },
      {
        text: 'Ile zębów ma dorosły człowiek (z zębami mądrości)?',
        answer: '32',
        options: ['28', '30', '32', '36'],
      },
      {
        text: 'Który narząd odpowiada za produkcję żółci?',
        answer: 'Wątroba',
        options: ['Nerki', 'Trzustka', 'Wątroba', 'Śledziona'],
      },
      {
        text: 'Ile litrów krwi ma przeciętny dorosły człowiek?',
        answer: 'Około 5 litrów',
        options: ['Około 2 litrów', 'Około 3 litrów', 'Około 5 litrów', 'Około 8 litrów'],
      },
      {
        text: 'Jak nazywa się najmniejsza kość w ciele człowieka?',
        answer: 'Strzemiączko',
        options: ['Młoteczek', 'Strzemiączko', 'Kowadełko', 'Kość grochowata'],
      },
    ],
  },
]
