// Treść i wersja zgody konsumenta na rozpoczęcie świadczenia treści cyfrowych
// przed upływem terminu odstąpienia (art. 38 ustawy o prawach konsumenta).
//
// JEDNO źródło prawdy: ta sama treść jest wyświetlana użytkownikowi i zapisywana
// w bazie przy zakupie. Zmieniając brzmienie zgody, PODBIJ wersję (data) —
// dzięki temu w rejestrze widać, na jaką dokładnie treść zgodził się użytkownik.

export const PURCHASE_CONSENT_VERSION = '2026-05-29'

export const PURCHASE_CONSENT_TEXT =
  'Wyrażam zgodę na rozpoczęcie świadczenia (dostępu PRO) natychmiast po zakupie, ' +
  'przed upływem 14-dniowego terminu odstąpienia, i przyjmuję do wiadomości, że z chwilą ' +
  'rozpoczęcia świadczenia tracę prawo odstąpienia od umowy. Akceptuję Regulamin ' +
  'i Politykę prywatności.'

// Dobrowolna (opt-in) zgoda marketingowa — pokazywana przy rejestracji i w ustawieniach konta.
// Domyślnie NIEZAZNACZONA; brak zgody nie blokuje założenia konta.
export const MARKETING_CONSENT_TEXT =
  'Chcę otrzymywać na podany adres e-mail informacje marketingowe o nowościach, nowych ' +
  'taliach kart i promocjach w Last Rodeo. Zgoda jest dobrowolna i mogę ją w każdej chwili ' +
  'wycofać (np. w ustawieniach konta lub klikając link w wiadomości).'
