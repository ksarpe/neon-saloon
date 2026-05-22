import type { LegalSection } from '@/components/LegalPage'
import { LegalPage } from '@/components/LegalPage'
import { COMPANY, COMPANY_ADDRESS_LINE } from '@/config/company'

const sections: LegalSection[] = [
  {
    id: 'administrator',
    heading: 'Administrator danych',
    content: (
      <div className="space-y-3">
        <p>Administratorem Twoich danych osobowych jest:</p>
        <p className="leading-relaxed">
          <strong>{COMPANY.legalName}</strong>
          <br />
          {COMPANY.legalForm}
          {COMPANY_ADDRESS_LINE && (
            <>
              <br />
              Adres: {COMPANY_ADDRESS_LINE}
            </>
          )}
          <br />
          NIP: {COMPANY.nip}
          {COMPANY.regon && <> &nbsp;•&nbsp; REGON: {COMPANY.regon}</>}
          <br />
          E-mail: <strong>{COMPANY.email}</strong>
          {COMPANY.phone && (
            <>
              <br />
              Telefon: {COMPANY.phone}
            </>
          )}
        </p>
        <p>
          Administrator nie wyznaczył inspektora ochrony danych. We wszystkich sprawach dotyczących
          danych osobowych możesz kontaktować się pod adresem <strong>{COMPANY.email}</strong>.
        </p>
        <p>
          Przetwarzanie odbywa się zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE)
          2016/679 (RODO) oraz przepisami krajowymi.
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
            ['Dane konta', 'adres e-mail, opcjonalna nazwa (nick) oraz hasło przechowywane w postaci zahaszowanej'],
            ['Treści użytkownika', 'pytania, odpowiedzi i ustawienia rozgrywki zapisywane na koncie'],
            ['Dane rozgrywki', 'pseudonim (nick) i awatar wybierane przez graczy w trakcie sesji — przechowywane tymczasowo'],
            ['Dane płatności i subskrypcji', 'identyfikatory klienta i subskrypcji u dostawcy płatności, status i okres subskrypcji; pełnych danych karty nie przechowujemy'],
            ['Dane rozliczeniowe', 'dane podane do faktury, jeżeli jej zażądasz'],
            ['Dane techniczne', 'adres IP, typ przeglądarki i urządzenia, logi zdarzeń i błędów — zbierane automatycznie'],
            ['Dane bezpieczeństwa', 'informacje z mechanizmu ochrony przed botami (Cloudflare Turnstile) oraz dane wykorzystywane do limitowania liczby zapytań'],
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
    heading: 'Cele i podstawy prawne przetwarzania',
    content: (
      <div className="space-y-3">
        <p>Twoje dane przetwarzamy w następujących celach:</p>
        <ul className="list-inside list-disc space-y-1.5 pl-2">
          <li>
            <strong>Świadczenie usług</strong> — prowadzenie konta, tworzenie i dołączanie do sesji,
            zapisywanie treści (podstawa: wykonanie umowy — art. 6 ust. 1 lit. b RODO).
          </li>
          <li>
            <strong>Obsługa płatności i subskrypcji</strong> — realizacja zamówień, odnawianie i
            anulowanie subskrypcji (art. 6 ust. 1 lit. b RODO).
          </li>
          <li>
            <strong>Obowiązki prawne</strong> — wystawianie i przechowywanie faktur, rozpatrywanie
            reklamacji (art. 6 ust. 1 lit. c RODO).
          </li>
          <li>
            <strong>Bezpieczeństwo Serwisu</strong> — ochrona przed botami i nadużyciami, limitowanie
            zapytań, diagnostyka błędów (prawnie uzasadniony interes — art. 6 ust. 1 lit. f RODO).
          </li>
          <li>
            <strong>Komunikacja</strong> — odpowiadanie na zapytania i informowanie o istotnych
            zmianach w Serwisie (art. 6 ust. 1 lit. b oraz f RODO).
          </li>
          <li>
            <strong>Ustalenie i dochodzenie roszczeń</strong> lub obrona przed nimi (prawnie
            uzasadniony interes — art. 6 ust. 1 lit. f RODO).
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
        <p>Przechowujemy dane przez okres niezbędny do realizacji celów, dla których je zebrano:</p>
        <ul className="list-inside list-disc space-y-1.5 pl-2">
          <li>Dane konta i treści użytkownika — do czasu usunięcia konta przez Użytkownika lub Operatora.</li>
          <li>Dane sesji rozgrywki — przez czas trwania sesji, usuwane automatycznie po jej zakończeniu (nie dłużej niż 24 godziny).</li>
          <li>Dane płatności i faktury — przez okres wymagany przepisami podatkowymi (co do zasady 5 lat od końca roku, w którym dokonano transakcji).</li>
          <li>Dane techniczne i logi bezpieczeństwa — co do zasady do 90 dni, następnie usuwane lub anonimizowane.</li>
          <li>Dane przetwarzane na potrzeby roszczeń — do upływu okresów przedawnienia.</li>
        </ul>
        <p>Po upływie okresu przechowywania dane są trwale usuwane lub anonimizowane.</p>
      </div>
    ),
  },
  {
    id: 'odbiorcy',
    heading: 'Odbiorcy danych i podmioty przetwarzające',
    content: (
      <div className="space-y-3">
        <p>
          Powierzamy dane zaufanym dostawcom usług, którzy przetwarzają je w naszym imieniu na
          podstawie umów powierzenia, wyłącznie w zakresie niezbędnym do świadczenia usług:
        </p>
        <ul className="space-y-2">
          {[
            ['Vercel', 'hosting aplikacji i serwerów Serwisu', 'https://vercel.com/legal/privacy-policy'],
            ['Neon', 'hostowana baza danych PostgreSQL (dane konta, treści użytkownika)', 'https://neon.tech/privacy-policy'],
            ['Appwrite Cloud (Frankfurt, UE)', 'infrastruktura sesji rozgrywki w czasie rzeczywistym', 'https://appwrite.io/privacy'],
            ['Stripe', 'obsługa płatności i subskrypcji', 'https://stripe.com/privacy'],
            ['Resend (Irlandia, UE)', 'wysyłka wiadomości e-mail (np. reset hasła)', 'https://resend.com/legal/privacy-policy'],
            ['Upstash (Frankfurt, UE)', 'baza Redis do limitowania liczby zapytań (m.in. adres IP)', 'https://upstash.com/trust/privacy.pdf'],
            ['Cloudflare', 'ochrona przed botami (Turnstile)', 'https://www.cloudflare.com/privacypolicy/'],
          ].map(([term, def, url]) => (
            <li key={term} className="flex gap-2">
              <span className="shrink-0 font-bold" style={{ color: 'var(--sheriff-pink)' }}>
                {term}:
              </span>
              <span>
                {def}
                {url && (
                  <>
                    {' '}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      style={{ color: 'var(--neon-pink)' }}
                    >
                      (polityka prywatności)
                    </a>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
        <p>
          <strong>Płatności.</strong> Płatności obsługuje Stripe. Dane karty podajesz bezpośrednio w
          bezpiecznym środowisku Stripe — nie przechodzą przez nasze serwery i ich nie
          przechowujemy. W zakresie danych płatniczych Stripe występuje jako{' '}
          <strong>odrębny administrator</strong> i przetwarza je zgodnie z własną polityką
          prywatności:{' '}
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--neon-pink)' }}
          >
            stripe.com/privacy
          </a>
          .
        </p>
        <p>
          Dane mogą być również udostępnione podmiotom uprawnionym na podstawie przepisów prawa (np.
          organom państwowym) oraz — w razie potrzeby — doradcom prawnym i księgowym Operatora.
        </p>
      </div>
    ),
  },
  {
    id: 'transfer-eog',
    heading: 'Przekazywanie danych poza EOG',
    content: (
      <div className="space-y-3">
        <p>
          Tam, gdzie to możliwe, wybraliśmy przetwarzanie danych w Unii Europejskiej — sesje
          rozgrywki (Appwrite, Frankfurt), limitowanie zapytań (Upstash, Frankfurt) oraz wysyłka
          e-maili (Resend, Irlandia) odbywają się w EOG.
        </p>
        <p>
          Część dostawców to jednak podmioty z USA lub korzystające z globalnej infrastruktury (m.in.
          Stripe, Cloudflare, Vercel, Neon), co może wiązać się z przekazaniem danych poza EOG. W
          takich przypadkach przekazanie odbywa się na podstawie odpowiednich zabezpieczeń
          przewidzianych w RODO, w szczególności:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>standardowych klauzul umownych (SCC) zatwierdzonych przez Komisję Europejską, lub</li>
          <li>uczestnictwa dostawcy w programie Data Privacy Framework (EU–US), jeśli ma zastosowanie.</li>
        </ul>
        <p>
          Możesz uzyskać więcej informacji o stosowanych zabezpieczeniach, kontaktując się pod
          adresem <strong>{COMPANY.email}</strong>.
        </p>
      </div>
    ),
  },
  {
    id: 'cookies',
    heading: 'Pliki cookies i podobne technologie',
    content: (
      <div className="space-y-3">
        <p>
          Serwis wykorzystuje pliki cookies oraz podobne technologie (np. pamięć lokalną
          przeglądarki). Stosujemy następujące rodzaje:
        </p>
        <ul className="space-y-2">
          {[
            ['Niezbędne', 'wymagane do działania Serwisu — uwierzytelnianie, utrzymanie sesji, bezpieczeństwo (m.in. Cloudflare Turnstile); nie wymagają zgody'],
            ['Funkcjonalne', 'zapamiętują preferencje Użytkownika, np. ustawienia muzyki w grze'],
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
          Serwis korzysta z <strong>Cloudflare Turnstile</strong> w celu ochrony przed botami i
          nadużyciami (m.in. przy rejestracji i tworzeniu lobby, także w trybie niewidocznym). W tym
          celu Cloudflare przetwarza tzw. Sygnały, takie jak: adres IP klienta, odcisk TLS (TLS
          fingerprint), nagłówek User-Agent oraz identyfikator witryny (Sitekey) wraz z powiązaną
          domeną. Według Cloudflare na podstawie tych Sygnałów nie można bezpośrednio zidentyfikować
          osoby (w tym po adresie IP), a dane są wykorzystywane wyłącznie do wykrywania i blokowania
          botów — nie do profilowania ani targetowania.
        </p>
        <p>Cloudflare pełni przy tym dwie role:</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>
            w zakresie ochrony naszego Serwisu — jako <strong>podmiot przetwarzający</strong>{' '}
            działający w naszym imieniu; administratorem jest wówczas Operator, a podstawą
            przetwarzania nasz prawnie uzasadniony interes (bezpieczeństwo Serwisu, art. 6 ust. 1
            lit. f RODO);
          </li>
          <li>
            w zakresie ulepszania własnych algorytmów wykrywania botów — jako{' '}
            <strong>odrębny administrator</strong>, na podstawie własnego prawnie uzasadnionego
            interesu; przetwarzanie to reguluje Dodatek prywatności Turnstile oraz Polityka
            prywatności Cloudflare.
          </li>
        </ul>
        <p>
          Sygnały Turnstile są ściśle niezbędne do działania zabezpieczenia, dlatego nie wymagają
          zgody. Szczegóły znajdziesz w{' '}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--neon-pink)' }}
          >
            Polityce prywatności Cloudflare
          </a>{' '}
          oraz w{' '}
          <a
            href="https://www.cloudflare.com/turnstile-privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--neon-pink)' }}
          >
            Dodatku prywatności Turnstile
          </a>
          . Pytania dotyczące przetwarzania danych przez Cloudflare w roli administratora można
          kierować do inspektora ochrony danych Cloudflare: dpo@cloudflare.com.
        </p>
        <p>
          Obecnie Serwis <strong>nie korzysta z analitycznych ani marketingowych narzędzi
          śledzących</strong> (np. Google Analytics) i nie profiluje Użytkowników w celach
          reklamowych. W razie wprowadzenia takich narzędzi w przyszłości zaktualizujemy niniejszą
          Politykę i — jeśli będzie to wymagane — poprosimy o zgodę.
        </p>
        <p>
          Ustawieniami cookies możesz zarządzać w swojej przeglądarce. Wyłączenie cookies niezbędnych
          może uniemożliwić prawidłowe działanie Serwisu.
        </p>
      </div>
    ),
  },
  {
    id: 'profilowanie',
    heading: 'Zautomatyzowane decyzje i profilowanie',
    content: (
      <div className="space-y-3">
        <p>
          Twoje dane nie są wykorzystywane do podejmowania decyzji w sposób w pełni zautomatyzowany,
          które wywoływałyby wobec Ciebie skutki prawne lub w podobny sposób istotnie na Ciebie
          wpływały (art. 22 RODO).
        </p>
      </div>
    ),
  },
  {
    id: 'prawa-uzytkownika',
    heading: 'Twoje prawa',
    content: (
      <div className="space-y-3">
        <p>W związku z przetwarzaniem danych przysługują Ci następujące prawa:</p>
        <ul className="list-inside list-disc space-y-1.5 pl-2">
          <li>
            <strong>dostępu</strong> do danych i uzyskania ich kopii,
          </li>
          <li>
            <strong>sprostowania</strong> danych nieprawidłowych lub niekompletnych,
          </li>
          <li>
            <strong>usunięcia</strong> danych („prawo do bycia zapomnianym”),
          </li>
          <li>
            <strong>ograniczenia przetwarzania</strong>,
          </li>
          <li>
            <strong>przenoszenia danych</strong> w ustrukturyzowanym, powszechnie używanym formacie,
          </li>
          <li>
            <strong>sprzeciwu</strong> wobec przetwarzania opartego na prawnie uzasadnionym interesie,
          </li>
          <li>
            <strong>cofnięcia zgody</strong> w dowolnym momencie, jeżeli przetwarzanie odbywa się na
            podstawie zgody (bez wpływu na zgodność z prawem przetwarzania sprzed cofnięcia).
          </li>
        </ul>
        <p>
          Aby skorzystać z praw, napisz na <strong>{COMPANY.email}</strong>. Odpowiadamy w terminie
          do 30 dni. Masz również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych
          (ul. Stawki 2, 00-193 Warszawa).
        </p>
      </div>
    ),
  },
  {
    id: 'dobrowolnosc',
    heading: 'Dobrowolność podania danych',
    content: (
      <div className="space-y-3">
        <p>
          Podanie danych jest dobrowolne, lecz niezbędne do skorzystania z określonych funkcji. Brak
          podania adresu e-mail uniemożliwia założenie konta, a brak danych płatności — zakup planu
          płatnego. Do udziału w sesji jako gracz wystarczy pseudonim.
        </p>
      </div>
    ),
  },
  {
    id: 'bezpieczenstwo',
    heading: 'Bezpieczeństwo danych',
    content: (
      <div className="space-y-3">
        <p>
          Stosujemy odpowiednie środki techniczne i organizacyjne chroniące dane przed
          nieuprawnionym dostępem, utratą lub zmianą — m.in. szyfrowanie połączeń (HTTPS),
          haszowanie haseł, ograniczanie dostępu oraz ochronę przed botami i nadużyciami.
        </p>
      </div>
    ),
  },
  {
    id: 'dzieci',
    heading: 'Dane dzieci',
    content: (
      <div className="space-y-3">
        <p>
          Konta i funkcje płatne przeznaczone są dla osób pełnoletnich. Serwis nie jest kierowany do
          dzieci i nie zbieramy świadomie danych osób poniżej 16. roku życia bez zgody opiekuna.
          Jeżeli uznasz, że przetwarzamy dane dziecka bez właściwej podstawy, skontaktuj się z nami —
          niezwłocznie je usuniemy.
        </p>
      </div>
    ),
  },
  {
    id: 'zmiany',
    heading: 'Zmiany polityki prywatności',
    content: (
      <div className="space-y-3">
        <p>
          Politykę możemy aktualizować w razie zmian prawnych, technicznych lub organizacyjnych.
          Aktualna wersja jest zawsze dostępna w Serwisie, a o istotnych zmianach poinformujemy
          Użytkowników posiadających konto.
        </p>
      </div>
    ),
  },
  {
    id: 'kontakt',
    heading: 'Kontakt',
    content: (
      <div className="space-y-3">
        <p>W sprawach związanych z ochroną danych osobowych skontaktuj się z nami:</p>
        <p>
          <strong>{COMPANY.legalName}</strong>
          {COMPANY_ADDRESS_LINE && (
            <>
              <br />
              {COMPANY_ADDRESS_LINE}
            </>
          )}
          <br />
          E-mail: <strong>{COMPANY.email}</strong>
        </p>
      </div>
    ),
  },
]

export const metadata = {
  title: 'Polityka prywatności',
  description: `Polityka prywatności serwisu ${COMPANY.brand} — jak przetwarzamy dane osobowe zgodnie z RODO.`,
}

export default function PolitykaPrywatnosci() {
  return (
    <LegalPage
      title="Polityka prywatności"
      subtitle="Jak dbamy o Twoje dane osobowe"
      lastUpdated={COMPANY.lastUpdated}
      sections={sections}
    />
  )
}
