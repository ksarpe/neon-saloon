import { LegalPage } from '@/components/LegalPage'
import type { LegalSection } from '@/components/LegalPage'

const sections: LegalSection[] = [
  {
    id: 'administrator',
    heading: 'Administrator danych',
    content: (
      <div className="space-y-3">
        <p>
          Administratorem Twoich danych osobowych jest <strong>AKN Software</strong>, kontakt:{' '}
          <strong>kontakt@aknsoftware.com</strong>.
        </p>
        <p>
          Dokładamy wszelkich starań, aby przetwarzanie danych osobowych odbywało się zgodnie z
          Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO) oraz przepisami
          krajowymi.
        </p>
      </div>
    ),
  },
  {
    id: 'dane-zbierane',
    heading: 'Jakie dane zbieramy',
    content: (
      <div className="space-y-3">
        <p>W zależności od sposobu korzystania z Serwisu przetwarzamy następujące dane:</p>
        <ul className="space-y-2">
          {[
            ['Dane konta', 'adres e-mail, pseudonim (nick) podany przy rejestracji'],
            [
              'Dane rozgrywki',
              'nazwy graczy i awatary wybierane w trakcie sesji (przechowywane tymczasowo)',
            ],
            [
              'Dane płatności',
              'obsługiwane przez zewnętrznego dostawcę płatności; nie przechowujemy danych karty',
            ],
            [
              'Dane techniczne',
              'adres IP, typ przeglądarki, logi błędów — zbierane automatycznie w celach diagnostycznych',
            ],
            ['Cookies', 'szczegóły w sekcji „Pliki cookies"'],
          ].map(([term, def]) => (
            <li key={term} className="flex gap-2">
              <span className="shrink-0 font-bold" style={{ color: 'var(--sheriff-pink)' }}>
                {term}:
              </span>
              <span>{def}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'cel-przetwarzania',
    heading: 'Cel i podstawa przetwarzania',
    content: (
      <div className="space-y-3">
        <p>Twoje dane przetwarzamy w następujących celach:</p>
        <ul className="list-inside list-disc space-y-1.5 pl-2">
          <li>
            <strong>Świadczenie usług</strong> — umożliwienie korzystania z Serwisu, w tym tworzenia
            i dołączania do sesji rozgrywki (podstawa: wykonanie umowy, art. 6 ust. 1 lit. b RODO).
          </li>
          <li>
            <strong>Obsługa płatności i subskrypcji</strong> — realizacja i rozliczanie zamówień
            (podstawa: wykonanie umowy, art. 6 ust. 1 lit. b RODO).
          </li>
          <li>
            <strong>Komunikacja</strong> — odpowiadanie na zapytania, wysyłanie powiadomień o
            zmianach w Serwisie (podstawa: prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO).
          </li>
          <li>
            <strong>Bezpieczeństwo i diagnostyka</strong> — wykrywanie nadużyć, analiza błędów
            (podstawa: prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO).
          </li>
          <li>
            <strong>Obowiązki prawne</strong> — np. przechowywanie faktur (podstawa: obowiązek
            prawny, art. 6 ust. 1 lit. c RODO).
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'okres-przechowywania',
    heading: 'Okres przechowywania danych',
    content: (
      <div className="space-y-3">
        <p>
          Przechowujemy dane przez okres niezbędny do realizacji celów, dla których zostały zebrane:
        </p>
        <ul className="list-inside list-disc space-y-1.5 pl-2">
          <li>Dane konta — do czasu usunięcia konta przez Użytkownika lub przez Operatora.</li>
          <li>
            Dane sesji rozgrywki — usuwane automatycznie po zakończeniu sesji lub po upływie 24
            godzin.
          </li>
          <li>
            Dane płatności i faktury — przez 5 lat od końca roku podatkowego, w którym dokonano
            transakcji.
          </li>
          <li>Logi techniczne — do 90 dni, następnie anonimizowane lub usuwane.</li>
        </ul>
        <p>Po upływie okresu przechowywania dane są trwale usuwane lub anonimizowane.</p>
      </div>
    ),
  },
  {
    id: 'cookies',
    heading: 'Pliki cookies',
    content: (
      <div className="space-y-3">
        <p>
          Serwis wykorzystuje pliki cookies (ciasteczka) — małe pliki tekstowe zapisywane w
          przeglądarce Użytkownika. Korzystamy z następujących rodzajów cookies:
        </p>
        <ul className="space-y-2">
          {[
            [
              'Niezbędne',
              'wymagane do działania Serwisu (sesja, uwierzytelnienie); nie mogą być wyłączone',
            ],
            ['Funkcjonalne', 'zapamiętują preferencje Użytkownika (np. ustawienia muzyki)'],
            [
              'Analityczne',
              'pomagają nam zrozumieć, jak Użytkownicy korzystają z Serwisu (dane zagregowane i anonimowe)',
            ],
          ].map(([term, def]) => (
            <li key={term} className="flex gap-2">
              <span className="shrink-0 font-bold" style={{ color: 'var(--sheriff-pink)' }}>
                {term}:
              </span>
              <span>{def}</span>
            </li>
          ))}
        </ul>
        <p>
          Możesz zarządzać ustawieniami cookies w swojej przeglądarce. Wyłączenie niezbędnych
          cookies może uniemożliwić prawidłowe działanie Serwisu.
        </p>
      </div>
    ),
  },
  {
    id: 'prawa-uzytkownika',
    heading: 'Twoje prawa',
    content: (
      <div className="space-y-3">
        <p>Na podstawie RODO przysługują Ci następujące prawa:</p>
        <ul className="list-inside list-disc space-y-1.5 pl-2">
          <li>
            <strong>Prawo dostępu</strong> — możesz zażądać kopii swoich danych osobowych.
          </li>
          <li>
            <strong>Prawo do sprostowania</strong> — możesz poprawić nieprawidłowe lub niekompletne
            dane.
          </li>
          <li>
            <strong>Prawo do usunięcia</strong> — możesz zażądać usunięcia danych („prawo do bycia
            zapomnianym").
          </li>
          <li>
            <strong>Prawo do ograniczenia przetwarzania</strong> — możesz zażądać ograniczenia
            przetwarzania Twoich danych.
          </li>
          <li>
            <strong>Prawo do przenoszenia danych</strong> — możesz otrzymać dane w ustrukturyzowanym
            formacie.
          </li>
          <li>
            <strong>Prawo do sprzeciwu</strong> — możesz sprzeciwić się przetwarzaniu na podstawie
            prawnie uzasadnionego interesu.
          </li>
        </ul>
        <p>
          Aby skorzystać z powyższych praw, skontaktuj się z nami pod adresem:{' '}
          <strong>kontakt@aknsoftware.com</strong>. Masz również prawo wniesienia skargi do Prezesa
          Urzędu Ochrony Danych Osobowych (UODO).
        </p>
      </div>
    ),
  },
  {
    id: 'kontakt',
    heading: 'Kontakt',
    content: (
      <div className="space-y-3">
        <p>W sprawach związanych z ochroną danych osobowych prosimy o kontakt:</p>
        <p>
          <strong>AKN Software</strong>
          <br />
          E-mail: <strong>kontakt@aknsoftware.com</strong>
        </p>
        <p>
          Odpowiadamy na zapytania dotyczące danych osobowych w ciągu 30 dni od ich otrzymania,
          zgodnie z wymogami RODO.
        </p>
      </div>
    ),
  },
]

export const metadata = {
  title: 'Polityka prywatności – Last Rodeo',
  description:
    'Polityka prywatności serwisu Last Rodeo — jak zbieramy i przetwarzamy dane osobowe.',
}

export default function PolitykaPrywatnosci() {
  return (
    <LegalPage
      title="Polityka prywatności"
      subtitle="Jak dbamy o Twoje dane osobowe"
      lastUpdated="15 maja 2026"
      sections={sections}
    />
  )
}
