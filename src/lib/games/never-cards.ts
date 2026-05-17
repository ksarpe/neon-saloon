import type { GameCard } from '@/lib/store'

export const NEVER_TITLE = 'Nigdy przenigdy'

export const NEVER_CARDS: Omit<GameCard, 'id'>[] = [
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie urwałam się z domu przez okno.',
  },
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie wysłałam wiadomości do byłego po alkoholu.',
  },
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie tańczyłam na barze lub stole.',
  },
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie pocałowałam kogoś z obecnych na imprezie.',
  },
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie podglądałam profilu byłego po rozstaniu.',
  },
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie kłamałam na temat swojego wieku.',
  },
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie płakałam po alkoholu bez powodu.',
  },
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie udawałam choroby, żeby nie iść do pracy.',
  },
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie rozmawiałam z byłym przez zamkniętą toaletę.',
  },
  {
    type: 'NEVER',
    description: 'Nigdy przenigdy nie zrobiłam czegoś, czego się wstydzę, na imprezie.',
  },
]
