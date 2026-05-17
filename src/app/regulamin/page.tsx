import { LegalPage } from '@/components/LegalPage'
import type { LegalSection } from '@/components/LegalPage'

const sections: LegalSection[] = [
  {
    id: 'postanowienia-ogolne',
    heading: '§1 Postanowienia ogólne',
    content: (
      <div className="space-y-3">
        <p>
          Niniejszy Regulamin określa zasady korzystania z serwisu internetowego{' '}
          <strong>Last Rodeo</strong>, dostępnego pod adresem <strong>lastrodeo.pl</strong> (dalej:
          „Serwis"), prowadzonego przez AKN Software (dalej: „Operator").
        </p>
        <p>
          Korzystanie z Serwisu jest równoznaczne z akceptacją niniejszego Regulaminu w całości.
          Jeśli nie zgadzasz się z którymkolwiek z jego postanowień, prosimy o zaprzestanie
          korzystania z Serwisu.
        </p>
        <p>
          Operator zastrzega sobie prawo do zmiany Regulaminu w dowolnym czasie. O istotnych
          zmianach Użytkownicy zostaną poinformowani za pośrednictwem adresu e-mail podanego przy
          rejestracji lub poprzez komunikat w Serwisie.
        </p>
      </div>
    ),
  },
  {
    id: 'definicje',
    heading: '§2 Definicje',
    content: (
      <ul className="space-y-2">
        {[
          ['Serwis', 'platforma internetowa Last Rodeo dostępna pod adresem lastrodeo.pl'],
          ['Użytkownik', 'każda osoba fizyczna korzystająca z Serwisu'],
          [
            'Konto',
            'indywidualne konto Użytkownika umożliwiające dostęp do płatnych funkcji Serwisu',
          ],
          ['Plan', 'model subskrypcji określający zakres dostępnych funkcji i cen'],
          [
            'Sesja',
            'jednorazowa rozgrywka tworzona przez hosta i dostępna dla dołączających graczy',
          ],
          ['Operator', 'AKN Software, podmiot prowadzący i zarządzający Serwisem'],
        ].map(([term, def]) => (
          <li key={term} className="flex gap-2">
            <span className="shrink-0 font-bold" style={{ color: 'var(--sheriff-pink)' }}>
              {term}:
            </span>
            <span>{def}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'konto',
    heading: '§3 Konto użytkownika',
    content: (
      <div className="space-y-3">
        <p>
          Korzystanie z podstawowych funkcji Serwisu nie wymaga rejestracji. Dostęp do
          zaawansowanych funkcji i płatnych planów wymaga założenia Konta.
        </p>
        <p>
          Podczas rejestracji Użytkownik zobowiązany jest podać prawdziwe dane. Podanie fałszywych
          danych może skutkować usunięciem Konta.
        </p>
        <p>
          Użytkownik jest odpowiedzialny za zachowanie poufności hasła i wszelkie działania
          podejmowane za pośrednictwem jego Konta. W przypadku podejrzenia nieuprawnionego dostępu
          należy niezwłocznie skontaktować się z Operatorem.
        </p>
        <p>
          Operator zastrzega sobie prawo do usunięcia Konta, które narusza niniejszy Regulamin lub
          przepisy prawa powszechnie obowiązującego.
        </p>
      </div>
    ),
  },
  {
    id: 'uslugi-plany',
    heading: '§4 Usługi i plany',
    content: (
      <div className="space-y-3">
        <p>
          Serwis oferuje bezpłatny plan podstawowy oraz płatne plany rozszerzone. Szczegółowy opis
          funkcji dostępnych w poszczególnych planach znajdziesz na stronie cennika.
        </p>
        <p>
          Operator zastrzega sobie prawo do zmiany zakresu poszczególnych planów, dodawania nowych
          funkcji lub ich usuwania, z zachowaniem odpowiedniego okresu wyprzedzenia dla aktywnych
          subskrybentów.
        </p>
        <p>
          W przypadku awarii lub przerw technicznych Operator dołoży wszelkich starań, aby
          przywrócić działanie Serwisu w możliwie najkrótszym czasie. Planowane przerwy będą
          komunikowane z wyprzedzeniem.
        </p>
      </div>
    ),
  },
  {
    id: 'platnosci',
    heading: '§5 Płatności i subskrypcje',
    content: (
      <div className="space-y-3">
        <p>
          Opłaty za płatne plany są pobierane z góry za wybrany okres rozliczeniowy (miesięczny lub
          roczny). Szczegółowe ceny podane są w serwisie i mogą ulec zmianie; zmiana ceny nie
          dotyczy aktywnych subskrypcji do końca opłaconego okresu.
        </p>
        <p>
          Subskrypcja odnawia się automatycznie, chyba że Użytkownik ją anuluje przed końcem
          bieżącego okresu rozliczeniowego. Anulowanie można przeprowadzić w ustawieniach Konta.
        </p>
        <p>
          Zgodnie z art. 38 pkt 13 ustawy o prawach konsumenta, prawo do odstąpienia od umowy nie
          przysługuje w przypadku dostarczania treści cyfrowych, jeżeli spełnianie świadczenia
          rozpoczęło się za wyraźną zgodą konsumenta.
        </p>
        <p>
          W przypadku problemów z płatnością prosimy o kontakt pod adresem:{' '}
          <strong>kontakt@aknsoftware.com</strong>.
        </p>
      </div>
    ),
  },
  {
    id: 'prawa-obowiazki',
    heading: '§6 Prawa i obowiązki użytkownika',
    content: (
      <div className="space-y-3">
        <p>Użytkownik zobowiązuje się do:</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>korzystania z Serwisu zgodnie z jego przeznaczeniem i obowiązującym prawem,</li>
          <li>
            niepodejmowania działań zakłócających działanie Serwisu lub naruszających prawa innych
            Użytkowników,
          </li>
          <li>
            nieudostępniania treści obraźliwych, niezgodnych z prawem lub naruszających prawa osób
            trzecich,
          </li>
          <li>nieudostępniania danych logowania osobom trzecim.</li>
        </ul>
        <p>
          Użytkownik ma prawo do korzystania ze wszystkich funkcji dostępnych w ramach wybranego
          planu, do wsparcia technicznego ze strony Operatora oraz do informacji o wszelkich
          zmianach w Serwisie.
        </p>
      </div>
    ),
  },
  {
    id: 'odpowiedzialnosc',
    heading: '§7 Odpowiedzialność',
    content: (
      <div className="space-y-3">
        <p>
          Operator nie ponosi odpowiedzialności za szkody wynikłe z nieprawidłowego korzystania z
          Serwisu przez Użytkownika, działania siły wyższej ani przerw technicznych spowodowanych
          czynnikami niezależnymi od Operatora.
        </p>
        <p>
          Serwis jest dostarczany w stanie „takim, jaki jest". Operator nie gwarantuje
          nieprzerwanego i bezbłędnego działania Serwisu, choć dołoży wszelkich starań, aby zapewnić
          jak najwyższą jakość usługi.
        </p>
        <p>
          Operator odpowiada za szkody wynikłe z jego zawinionych działań wyłącznie do wysokości
          opłat uiszczonych przez Użytkownika w ciągu ostatnich 12 miesięcy.
        </p>
      </div>
    ),
  },
  {
    id: 'postanowienia-koncowe',
    heading: '§8 Postanowienia końcowe',
    content: (
      <div className="space-y-3">
        <p>
          Regulamin podlega prawu polskiemu. Wszelkie spory wynikłe z korzystania z Serwisu będą
          rozstrzygane przez sąd właściwy miejscowo dla siedziby Operatora, chyba że przepisy prawa
          stanowią inaczej.
        </p>
        <p>
          W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy Kodeksu
          cywilnego, ustawy o świadczeniu usług drogą elektroniczną oraz innych właściwych aktów
          prawnych.
        </p>
        <p>
          Wszelkie pytania i uwagi dotyczące Regulaminu prosimy kierować na adres:{' '}
          <strong>kontakt@aknsoftware.com</strong>.
        </p>
      </div>
    ),
  },
]

export const metadata = {
  title: 'Regulamin – Last Rodeo',
  description: 'Regulamin serwisu Last Rodeo — zasady korzystania, plany, płatności.',
}

export default function RegulaминPage() {
  return (
    <LegalPage
      title="Regulamin"
      subtitle="Zasady korzystania z serwisu Last Rodeo"
      lastUpdated="15 maja 2026"
      sections={sections}
    />
  )
}
