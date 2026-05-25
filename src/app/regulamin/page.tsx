import type { LegalSection } from '@/components/LegalPage'
import { LegalPage } from '@/components/LegalPage'
import { COMPANY, COMPANY_ADDRESS_LINE } from '@/config/company'

const sections: LegalSection[] = [
  {
    id: 'postanowienia-ogolne',
    heading: '§1 Postanowienia ogólne',
    content: (
      <div className="space-y-3">
        <p>
          Niniejszy Regulamin określa zasady korzystania z serwisu internetowego{' '}
          <strong>{COMPANY.brand}</strong>, dostępnego pod adresem <strong>{COMPANY.domain}</strong>{' '}
          (dalej: „Serwis”).
        </p>
        <p>Operatorem i sprzedawcą jest:</p>
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
          Dalej Operator zwany jest „Operatorem”, „Usługodawcą” lub „Sprzedawcą”. Regulamin jest
          udostępniany nieodpłatnie w sposób umożliwiający jego pozyskanie, odtworzenie i utrwalenie
          w każdym czasie.
        </p>
        <p>
          Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu. Jeżeli nie zgadzasz się z
          którymkolwiek z postanowień, prosimy o zaprzestanie korzystania z Serwisu.
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
          [
            'Serwis',
            `platforma internetowa ${COMPANY.brand} dostępna pod adresem ${COMPANY.domain}`,
          ],
          ['Operator / Usługodawca / Sprzedawca', COMPANY.legalName],
          [
            'Użytkownik',
            'osoba fizyczna, prawna lub jednostka organizacyjna korzystająca z Serwisu',
          ],
          [
            'Konsument',
            'Użytkownik będący osobą fizyczną dokonujący czynności niezwiązanej bezpośrednio z jego działalnością gospodarczą lub zawodową',
          ],
          [
            'Przedsiębiorca na prawach konsumenta',
            'osoba fizyczna zawierająca umowę bezpośrednio związaną z jej działalnością gospodarczą, gdy umowa nie ma dla niej charakteru zawodowego',
          ],
          [
            'Konto',
            'indywidualny, zabezpieczony hasłem zbiór zasobów Użytkownika w Serwisie, umożliwiający m.in. zapisywanie własnych pytań i dostęp do planów płatnych',
          ],
          ['Host', 'Użytkownik tworzący i prowadzący Sesję rozgrywki'],
          [
            'Gracz',
            'osoba dołączająca do Sesji za pomocą kodu PIN, bez konieczności posiadania Konta',
          ],
          [
            'Sesja',
            'jednorazowa rozgrywka utworzona przez Hosta i dostępna dla dołączających Graczy',
          ],
          [
            'Treści Użytkownika',
            'pytania, odpowiedzi i inne materiały tworzone lub wprowadzane przez Użytkownika',
          ],
          ['Plan', 'określony zakres funkcji i warunków świadczenia usług (bezpłatny lub płatny)'],
          ['Subskrypcja', 'płatny Plan rozliczany cyklicznie i odnawiany automatycznie'],
          [
            'Dostęp dożywotni',
            'płatny Plan udostępniany w zamian za jednorazową opłatę, bez cyklicznych płatności',
          ],
          [
            'Umowa',
            'umowa o świadczenie usług drogą elektroniczną zawierana między Użytkownikiem a Operatorem na zasadach Regulaminu',
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
    ),
  },
  {
    id: 'wymagania-techniczne',
    heading: '§3 Wymagania techniczne',
    content: (
      <div className="space-y-3">
        <p>Do prawidłowego korzystania z Serwisu niezbędne są:</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>urządzenie z dostępem do sieci Internet,</li>
          <li>
            aktualna wersja przeglądarki internetowej (np. Chrome, Firefox, Safari, Edge) z włączoną
            obsługą JavaScript i plików cookies,
          </li>
          <li>aktywne konto poczty elektronicznej (wymagane do założenia Konta),</li>
          <li>
            stabilne łącze internetowe — funkcje rozgrywki na żywo wymagają połączenia w czasie
            rzeczywistym.
          </li>
        </ul>
        <p>
          Operator nie odpowiada za nieprawidłowe działanie Serwisu wynikające z niespełnienia
          powyższych wymagań przez Użytkownika.
        </p>
      </div>
    ),
  },
  {
    id: 'uslugi',
    heading: '§4 Rodzaje i zakres usług',
    content: (
      <div className="space-y-3">
        <p>Operator świadczy za pośrednictwem Serwisu następujące usługi drogą elektroniczną:</p>
        <ul className="list-inside list-disc space-y-1.5 pl-2">
          <li>
            <strong>Rozgrywka bez rejestracji</strong> — dołączanie do Sesji jako Gracz nie wymaga
            zakładania Konta, jednakże{' '}
            <strong>jest dozwolone wyłącznie dla osób pełnoletnich</strong>.
          </li>
          <li>
            <strong>Konto Użytkownika</strong> — zapisywanie własnych pytań, ustawień rozgrywki i
            zarządzanie planem.
          </li>
          <li>
            <strong>Plany płatne (premium)</strong> — rozszerzony zakres funkcji dostępny w modelu
            Subskrypcji lub Dostępu dożywotniego (§7).
          </li>
        </ul>
        <p>
          Szczegółowy, aktualny zakres funkcji poszczególnych Planów prezentowany jest w Serwisie
          (cennik). Operator może rozwijać Serwis, dodawać i modyfikować funkcje, z poszanowaniem
          praw nabytych Użytkowników płatnych Planów w opłaconym okresie.
        </p>
        <p>
          Umowa o korzystanie z funkcji bezpłatnych zawierana jest z chwilą rozpoczęcia korzystania
          z Serwisu i ma charakter jednorazowy lub ciągły (do zaprzestania korzystania). Umowa o
          Konto zawierana jest z chwilą jego założenia.
        </p>
      </div>
    ),
  },
  {
    id: 'konto',
    heading: '§5 Konto użytkownika',
    content: (
      <div className="space-y-3">
        <p>
          Założenie Konta wymaga podania adresu e-mail i ustawienia hasła oraz akceptacji
          Regulaminu. Ze względu na charakter udostępnianianych Treści, z Serwisu mogą korzystać{' '}
          <strong>wyłącznie osoby pełnoletnie</strong> (które ukończyły 18 lat), posiadające pełną
          zdolność do czynności prawnych. Zakładając Konto, Użytkownik oświadcza, że spełnia to
          kryterium.
        </p>
        <p>
          Użytkownik zobowiązuje się podać dane prawdziwe i aktualne. Podanie danych nieprawdziwych
          może skutkować zawieszeniem lub usunięciem Konta.
        </p>
        <p>
          Użytkownik odpowiada za zachowanie poufności hasła oraz za działania podejmowane za
          pośrednictwem jego Konta. W razie podejrzenia nieuprawnionego dostępu należy niezwłocznie
          skontaktować się z Operatorem pod adresem <strong>{COMPANY.email}</strong>.
        </p>
        <p>
          Hasła przechowywane są w postaci zahaszowanej. Operator nie ma dostępu do hasła
          Użytkownika w postaci jawnej.
        </p>
      </div>
    ),
  },
  {
    id: 'sesje-tresci',
    heading: '§6 Sesje i treści użytkownika',
    content: (
      <div className="space-y-3">
        <p>
          Host może tworzyć Sesje i zapraszać Graczy za pomocą kodu PIN. Gracze dołączają, podając
          wybrany pseudonim (nick). Operator nie wymaga od Graczy podawania danych osobowych do
          udziału w Sesji.
        </p>
        <p>
          Użytkownik może wprowadzać Treści Użytkownika (np. własne pytania i odpowiedzi).
          Użytkownik oświadcza, że posiada prawa do wprowadzanych treści i ponosi za nie pełną
          odpowiedzialność.
        </p>
        <p>Zabronione jest wprowadzanie i rozpowszechnianie treści:</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>
            niezgodnych z prawem, obraźliwych, wulgarnych, dyskryminujących lub nawołujących do
            nienawiści,
          </li>
          <li>
            naruszających prawa osób trzecich (w tym prawa autorskie, dobra osobiste, dane osobowe),
          </li>
          <li>o charakterze reklamowym lub spamu, bez zgody Operatora,</li>
          <li>
            szkodliwych technicznie (złośliwe oprogramowanie, skrypty zakłócające działanie
            Serwisu).
          </li>
        </ul>
        <p>
          Wprowadzając Treści Użytkownika do Serwisu, Użytkownik udziela Operatorowi niewyłącznej,
          nieodpłatnej licencji na ich przechowywanie i przetwarzanie w zakresie niezbędnym do
          świadczenia usług (np. wyświetlenie pytania w trakcie Sesji). Licencja wygasa z chwilą
          usunięcia treści lub Konta, z wyjątkiem kopii niezbędnych do wypełnienia obowiązków
          prawnych.
        </p>
        <p>
          Operator może usunąć Treści Użytkownika naruszające Regulamin lub prawo, a w razie
          rażących lub powtarzających się naruszeń — zawiesić lub usunąć Konto.
        </p>
      </div>
    ),
  },
  {
    id: 'plany-platnosci',
    heading: '§7 Plany, ceny i płatności',
    content: (
      <div className="space-y-3">
        <p>
          Serwis oferuje bezpłatny Plan podstawowy oraz Plany płatne. Plany płatne dostępne są w
          dwóch modelach:
        </p>
        <ul className="list-inside list-disc space-y-1.5 pl-2">
          <li>
            <strong>Subskrypcja</strong> — opłata cykliczna (miesięczna lub roczna), pobierana z
            góry za dany okres rozliczeniowy; subskrypcja odnawia się automatycznie na kolejny
            okres, chyba że zostanie wcześniej anulowana.
          </li>
          <li>
            <strong>Dostęp dożywotni</strong> — jednorazowa opłata za bezterminowy dostęp do funkcji
            objętych Planem, bez płatności cyklicznych.
          </li>
        </ul>
        <p>
          Ceny podawane w Serwisie są cenami brutto (zawierają należne podatki) i wyrażone w walucie
          wskazanej w cenniku. Wiążąca jest cena prezentowana w chwili złożenia zamówienia.
        </p>
        <p>
          Płatności obsługuje zewnętrzny dostawca usług płatniczych <strong>Stripe</strong>. Dane
          karty wprowadzasz bezpośrednio w środowisku Stripe — Operator nie przechowuje pełnych
          danych kart płatniczych. W zakresie danych płatniczych Stripe występuje jako odrębny
          administrator i przetwarza je zgodnie z własną polityką prywatności (
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--neon-pink)' }}
          >
            stripe.com/privacy
          </a>
          ). Realizacja płatności podlega regulaminowi dostawcy płatności.
        </p>
        <p>
          Subskrypcję można anulować w każdej chwili w ustawieniach Konta; anulowanie odnosi skutek
          z końcem bieżącego, opłaconego okresu rozliczeniowego — dostęp do funkcji premium
          pozostaje aktywny do tego czasu. Zmiana ceny Subskrypcji nie dotyczy okresu już
          opłaconego.
        </p>
        <p>
          Na żądanie Użytkownika Operator wystawia fakturę. W tym celu należy podać dane do faktury
          przy zakupie lub skontaktować się pod adresem <strong>{COMPANY.email}</strong>.
        </p>
      </div>
    ),
  },
  {
    id: 'odstapienie',
    heading: '§8 Prawo odstąpienia od umowy (konsument)',
    content: (
      <div className="space-y-3">
        <p>
          Konsument oraz przedsiębiorca na prawach konsumenta, który zawarł umowę na odległość, może
          co do zasady odstąpić od niej w terminie <strong>14 dni</strong> bez podawania przyczyny,
          składając oświadczenie (np. e-mailem na <strong>{COMPANY.email}</strong>).
        </p>
        <p>
          Świadczenie usług w Serwisie (dostęp do funkcji cyfrowych) rozpoczyna się co do zasady
          niezwłocznie po zawarciu umowy. Przy zakupie Użytkownik proszony jest o:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>
            wyraźną zgodę na rozpoczęcie spełniania świadczenia przed upływem terminu odstąpienia,
            oraz
          </li>
          <li>
            przyjęcie do wiadomości, że w związku z tym utraci prawo odstąpienia po pełnym wykonaniu
            usługi.
          </li>
        </ul>
        <p>
          Zgodnie z art. 38 ustawy o prawach konsumenta prawo odstąpienia nie przysługuje m.in. w
          odniesieniu do umów o dostarczanie treści cyfrowych niedostarczanych na nośniku
          materialnym, za które konsument jest zobowiązany do zapłaty, jeżeli spełnianie świadczenia
          rozpoczęło się za uprzednią, wyraźną zgodą konsumenta i po poinformowaniu go o utracie
          prawa odstąpienia, a Operator przekazał potwierdzenie zawarcia umowy.
        </p>
        <p>
          Jeżeli świadczenie nie rozpoczęło się jeszcze za zgodą Konsumenta, prawo odstąpienia
          przysługuje na zasadach ogólnych, a Operator zwraca otrzymane płatności w terminie 14 dni.
        </p>
      </div>
    ),
  },
  {
    id: 'reklamacje',
    heading: '§9 Zgodność usługi z umową i reklamacje',
    content: (
      <div className="space-y-3">
        <p>
          Operator zobowiązany jest dostarczyć usługę cyfrową zgodną z umową. Do umów o dostarczanie
          treści i usług cyfrowych zawieranych z Konsumentami stosuje się przepisy rozdziału 5b
          ustawy o prawach konsumenta dotyczące zgodności świadczenia z umową.
        </p>
        <p>
          Reklamacje można składać na adres e-mail <strong>{COMPANY.email}</strong> lub pisemnie na
          adres siedziby Operatora. W reklamacji prosimy podać: dane Użytkownika, opis problemu oraz
          oczekiwany sposób rozpatrzenia.
        </p>
        <p>
          Operator rozpatruje reklamację i udziela odpowiedzi w terminie <strong>14 dni</strong> od
          jej otrzymania. Brak odpowiedzi w tym terminie oznacza uznanie reklamacji Konsumenta.
        </p>
        <p>
          W razie niezgodności usługi cyfrowej z umową Konsumentowi przysługują uprawnienia
          przewidziane w ustawie (m.in. doprowadzenie do zgodności, obniżenie ceny lub odstąpienie
          od umowy na warunkach ustawowych).
        </p>
      </div>
    ),
  },
  {
    id: 'prawa-obowiazki',
    heading: '§10 Prawa i obowiązki użytkownika',
    content: (
      <div className="space-y-3">
        <p>Użytkownik zobowiązuje się do:</p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>korzystania z Serwisu zgodnie z prawem, dobrymi obyczajami i Regulaminem,</li>
          <li>
            niepodejmowania działań zakłócających działanie Serwisu lub naruszających prawa innych
            osób,
          </li>
          <li>
            nieobchodzenia zabezpieczeń, niestosowania botów ani automatów bez zgody Operatora,
          </li>
          <li>nieudostępniania danych logowania osobom trzecim,</li>
          <li>niewykorzystywania Serwisu do rozsyłania treści bezprawnych lub niezamówionych.</li>
        </ul>
        <p>
          Użytkownik ma prawo do korzystania z funkcji objętych jego Planem, do wsparcia w zakresie
          działania Serwisu oraz do informacji o istotnych zmianach.
        </p>
        <p>
          Zakazane jest dostarczanie przez Użytkownika treści o charakterze bezprawnym (art. 8 ust.
          3 ustawy o świadczeniu usług drogą elektroniczną).
        </p>
      </div>
    ),
  },
  {
    id: 'wlasnosc-intelektualna',
    heading: '§11 Własność intelektualna',
    content: (
      <div className="space-y-3">
        <p>
          Serwis oraz jego elementy (oprogramowanie, interfejs, grafiki, logotypy, nazwa{' '}
          {COMPANY.brand}, treści przygotowane przez Operatora) podlegają ochronie prawnej i
          stanowią własność Operatora lub jego licencjodawców.
        </p>
        <p>
          Operator udziela Użytkownikowi niewyłącznego, nieprzenoszalnego prawa do korzystania z
          Serwisu wyłącznie na własny użytek, w zakresie wynikającym z Regulaminu i wybranego Planu.
        </p>
        <p>
          Zabronione jest kopiowanie, modyfikowanie, dekompilacja, odsprzedaż lub inne
          wykorzystywanie Serwisu wykraczające poza dozwolony użytek, bez uprzedniej pisemnej zgody
          Operatora.
        </p>
      </div>
    ),
  },
  {
    id: 'odpowiedzialnosc',
    heading: '§12 Odpowiedzialność',
    content: (
      <div className="space-y-3">
        <p>
          Operator dokłada starań, aby Serwis działał poprawnie i nieprzerwanie, jednak nie
          gwarantuje całkowitego braku przerw — w szczególności wynikających z konserwacji,
          aktualizacji, działania siły wyższej lub czynników niezależnych od Operatora. Planowane
          przerwy będą w miarę możliwości zapowiadane.
        </p>
        <p>
          Operator nie ponosi odpowiedzialności za skutki korzystania z Serwisu niezgodnie z
          Regulaminem ani za treści wprowadzane przez Użytkowników.
        </p>
        <p>
          Wobec Użytkowników niebędących Konsumentami odpowiedzialność Operatora z tytułu umowy
          ograniczona jest do wysokości opłat uiszczonych przez Użytkownika w okresie 12 miesięcy
          poprzedzających zdarzenie, oraz wyłączona w zakresie utraconych korzyści — w granicach
          dopuszczalnych prawem. Ograniczenia te nie dotyczą Konsumentów ani przedsiębiorców na
          prawach konsumenta i nie wyłączają odpowiedzialności, której zgodnie z prawem wyłączyć nie
          można.
        </p>
        <p>
          <strong>Zastrzeżenie dotyczące zdrowia i bezpieczeństwa:</strong> Serwis i dostępne w nim
          Treści (np. gry imprezowe) mają charakter wyłącznie rozrywkowy. Operator nie zachęca do
          nadmiernego spożywania alkoholu ani do podejmowania jakichkolwiek działań ryzykownych lub
          niezgodnych z prawem. Decyzja o wykonywaniu zadań czy odpowiadaniu na pytania podczas
          Sesji należy wyłącznie do Użytkownika. Operator nie ponosi żadnej odpowiedzialności za
          szkody na zdrowiu, mieniu lub szkody niemajątkowe wynikające z zachowania Użytkowników
          podczas korzystania z Serwisu, zarówno w świecie rzeczywistym, jak i wirtualnym.
        </p>
      </div>
    ),
  },
  {
    id: 'rozwiazanie',
    heading: '§13 Czas trwania i rozwiązanie umowy',
    content: (
      <div className="space-y-3">
        <p>
          Umowa o prowadzenie Konta zawierana jest na czas nieoznaczony. Użytkownik może w każdej
          chwili rozwiązać umowę, usuwając Konto lub przesyłając żądanie na{' '}
          <strong>{COMPANY.email}</strong>.
        </p>
        <p>
          Operator może wypowiedzieć umowę lub zawiesić Konto z ważnych przyczyn, w szczególności w
          razie istotnego naruszenia Regulaminu lub prawa, z zachowaniem proporcjonalności i — o ile
          to możliwe — po uprzednim wezwaniu do zaprzestania naruszeń.
        </p>
        <p>
          Rozwiązanie umowy o Konto nie wpływa na rozliczenia za usługi już wykonane. Skutki dla
          aktywnej Subskrypcji opisuje §7.
        </p>
      </div>
    ),
  },
  {
    id: 'dane-osobowe',
    heading: '§14 Dane osobowe',
    content: (
      <div className="space-y-3">
        <p>
          Administratorem danych osobowych Użytkowników jest Operator. Zasady przetwarzania danych
          oraz prawa osób, których dane dotyczą, opisano w{' '}
          <a
            href="/polityka-prywatnosci"
            className="underline"
            style={{ color: 'var(--neon-pink)' }}
          >
            Polityce prywatności
          </a>
          .
        </p>
      </div>
    ),
  },
  {
    id: 'spory',
    heading: '§15 Pozasądowe rozwiązywanie sporów',
    content: (
      <div className="space-y-3">
        <p>
          Konsument ma możliwość skorzystania z pozasądowych sposobów rozpatrywania reklamacji i
          dochodzenia roszczeń, m.in. przez:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li>powiatowego (miejskiego) rzecznika konsumentów lub organizacje konsumenckie,</li>
          <li>wojewódzkie inspektoraty Inspekcji Handlowej,</li>
          <li>
            unijną platformę ODR dostępną pod adresem{' '}
            <a
              href="https://ec.europa.eu/consumers/odr"
              className="underline"
              style={{ color: 'var(--neon-pink)' }}
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </li>
        </ul>
        <p>
          Skorzystanie z metod pozasądowych jest dobrowolne i wymaga zgody obu stron. Szczegółowe
          informacje dostępne są m.in. na stronach Urzędu Ochrony Konkurencji i Konsumentów (UOKiK).
        </p>
      </div>
    ),
  },
  {
    id: 'zmiany',
    heading: '§16 Zmiany regulaminu',
    content: (
      <div className="space-y-3">
        <p>
          Operator może zmienić Regulamin z ważnych przyczyn (np. zmiana przepisów, zakresu usług,
          warunków technicznych). O zmianach Użytkownicy posiadający Konto będą informowani z
          wyprzedzeniem — pocztą e-mail lub komunikatem w Serwisie.
        </p>
        <p>
          Zmiany wchodzą w życie w terminie wskazanym w powiadomieniu (nie krótszym niż 14 dni dla
          umów ciągłych). Brak akceptacji zmian uprawnia Użytkownika do rozwiązania umowy przed datą
          ich wejścia w życie. Do zamówień złożonych przed zmianą stosuje się Regulamin w
          dotychczasowym brzmieniu.
        </p>
      </div>
    ),
  },
  {
    id: 'koncowe',
    heading: '§17 Postanowienia końcowe',
    content: (
      <div className="space-y-3">
        <p>
          W sprawach nieuregulowanych Regulaminem zastosowanie mają przepisy prawa polskiego, w
          szczególności Kodeksu cywilnego, ustawy o świadczeniu usług drogą elektroniczną oraz
          ustawy o prawach konsumenta. Wybór prawa polskiego nie pozbawia Konsumenta ochrony
          wynikającej z bezwzględnie obowiązujących przepisów państwa jego zwykłego pobytu.
        </p>
        <p>
          Spory z udziałem Konsumenta rozstrzyga sąd właściwy według przepisów ogólnych. Spory z
          Użytkownikami niebędącymi Konsumentami rozstrzyga sąd właściwy dla siedziby Operatora.
        </p>
        <p>
          Jeżeli którekolwiek postanowienie Regulaminu okaże się nieważne, pozostałe postanowienia
          zachowują moc.
        </p>
        <p>
          Kontakt z Operatorem: <strong>{COMPANY.email}</strong>
          {COMPANY.phone ? `, tel. ${COMPANY.phone}` : ''}.
        </p>
      </div>
    ),
  },
]

export const metadata = {
  title: 'Regulamin',
  description: `Regulamin serwisu ${COMPANY.brand} — zasady korzystania, plany, płatności, prawo odstąpienia i reklamacje.`,
}

export default function RegulaminPage() {
  return (
    <LegalPage
      title="Regulamin"
      subtitle={`Zasady korzystania z serwisu ${COMPANY.brand}`}
      lastUpdated={COMPANY.lastUpdated}
      sections={sections}
    />
  )
}
