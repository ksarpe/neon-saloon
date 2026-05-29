// Centralne dane identyfikacyjne firmy / operatora serwisu.
// Wykorzystywane w Regulaminie i Polityce prywatności, żeby trzymać je w JEDNYM miejscu.
//
// Puste pola (np. brak adresu/REGON) są automatycznie pomijane w dokumentach.
// ⚠️ UWAGA: przy sprzedaży konsumentom adres kontaktowy sprzedawcy jest co do zasady
//    wymagany prawnie — uzupełnij `address`/`postalCode`/`city` przed startem płatności.

export const COMPANY = {
  /** Marka / nazwa handlowa serwisu. */
  brand: 'Last Rodeo',
  /** Domena bez protokołu. */
  domain: 'lastrodeo.pl',
  /** Pełny adres serwisu. */
  url: 'https://lastrodeo.pl',

  /** Pełna nazwa firmy (zgodna z CEIDG). */
  legalName: 'Kasper Janowski AKN Software',
  /** Imię i nazwisko przedsiębiorcy. */
  ownerName: 'Kasper Janowski',
  /** Forma prawna. */
  legalForm: 'jednoosobowa działalność gospodarcza wpisana do CEIDG',

  // ── Dane rejestrowe ─────────────────────────────────────────────────────
  nip: '7272900394',
  /** REGON — publiczny w CEIDG; uzupełnij, jeśli chcesz go podać. */
  regon: '',
  /** Adres działalności / do korespondencji. WYMAGANY przy sprzedaży konsumentom. */
  address: 'Maczka 8',
  postalCode: '94-328',
  city: 'Łódź',

  // ── Kontakt ─────────────────────────────────────────────────────────────
  email: 'kasper@aknsoftware.com',
  /** Opcjonalnie — zostaw puste, jeśli nie chcesz podawać. */
  phone: '',

  /** Data ostatniej aktualizacji dokumentów. */
  lastUpdated: '29 maja 2026',
} as const

/** Jednolinijkowy adres pocztowy „ul. X, 00-000 Miasto" — pusty, gdy brak danych. */
export const COMPANY_ADDRESS_LINE = [
  COMPANY.address,
  [COMPANY.postalCode, COMPANY.city].filter(Boolean).join(' '),
]
  .filter(Boolean)
  .join(', ')
