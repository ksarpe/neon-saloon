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
  {
    id: 'anatomy',
    name: '🍑 Intymna anatomia',
    description: 'Fakty o ciałach, których nie było na biologii',
    color: '#dd54a2',
    border: 'rgba(221,84,162,0.5)',
    bg: 'rgba(221,84,162,0.07)',
    questions: [
      // ── ŁECHTACZKA ──────────────────────────────────────────────────────────
      {
        text: 'Ile zakończeń nerwowych posiada łechtaczka?',
        answer: '8 000',
        options: ['2 000', '4 000', '8 000', '15 000'],
      },
      {
        text: 'Jaka jest szacowana długość wewnętrznej części łechtaczki (ramiona + ciało)?',
        answer: 'Około 9–11 cm',
        options: ['Około 2–3 cm', 'Około 5–6 cm', 'Około 9–11 cm', 'Ponad 20 cm'],
      },
      {
        text: 'Która lekarka jako pierwsza dokładnie zmapowała pełną anatomię łechtaczki w 1998 roku?',
        answer: 'Helen O\'Connell',
        options: ['Virginia Johnson', 'Helen O\'Connell', 'Shere Hite', 'Mary Calderone'],
      },
      {
        text: 'Czym jest łechtaczka pod względem embriologicznym?',
        answer: 'Odpowiednikiem żołędzi penisa',
        options: ['Samodzielnym narządem bez odpowiednika', 'Odpowiednikiem napletka', 'Odpowiednikiem żołędzi penisa', 'Odpowiednikiem jądra'],
      },
      {
        text: 'O ile procent może zwiększyć się łechtaczka podczas pobudzenia seksualnego?',
        answer: 'O 50–300%',
        options: ['O 5–10%', 'O 20–30%', 'O 50–300%', 'Nie zmienia rozmiaru'],
      },
      {
        text: 'Jaka tkanka buduje ciało łechtaczki?',
        answer: 'Tkanka jamista (corpus cavernosum)',
        options: ['Tkanka chrzęstna', 'Tkanka tłuszczowa', 'Tkanka jamista (corpus cavernosum)', 'Tkanka mięśniowa gładka'],
      },
      {
        text: 'Co to jest napletek łechtaczki (prepucjum)?',
        answer: 'Fałd skóry pokrywający żołądź łechtaczki',
        options: ['Wewnętrzna ściana pochwy', 'Fałd skóry pokrywający żołądź łechtaczki', 'Gruczoł wydzielający śluz', 'Mięsień dna miednicy'],
      },
      {
        text: 'Jak się nazywają ramiona łechtaczki?',
        answer: 'Crura clitoridis (odnogi łechtaczki)',
        options: ['Bulbus vestibuli', 'Crura clitoridis (odnogi łechtaczki)', 'Frenulum clitoridis', 'Corpus spongiosum'],
      },
      {
        text: 'Jaką jedyną biologiczną funkcję pełni łechtaczka?',
        answer: 'Wyłącznie przyjemność seksualna',
        options: ['Odprowadzanie moczu', 'Ochrona wejścia do pochwy', 'Wyłącznie przyjemność seksualna', 'Regulacja hormonów'],
      },
      {
        text: 'Co to są opuszki przedsionkowe (vestibular bulbs)?',
        answer: 'Tkanka erekcyjna otaczająca wejście do pochwy',
        options: ['Gruczoły nawilżające przedsionek pochwy', 'Tkanka erekcyjna otaczająca wejście do pochwy', 'Wewnętrzne fałdy skórne sromu', 'Mięśnie dna miednicy wokół pochwy'],
      },
      {
        text: 'Jaka część łechtaczki jest widoczna gołym okiem na zewnątrz ciała?',
        answer: 'Zaledwie 10–20%',
        options: ['Ponad 80%', 'Dokładnie połowa', 'Około 40%', 'Zaledwie 10–20%'],
      },
      {
        text: 'Od jakiego greckiego słowa pochodzi termin "łechtaczka"?',
        answer: 'Od "kleitoris" – oznaczającego "klucz" lub "zamykać"',
        options: ['Od "kleos" – sława', 'Od "kleitoris" – oznaczającego "klucz" lub "zamykać"', 'Od "klima" – szczyt', 'Od "klinein" – leżeć'],
      },
      {
        text: 'Co powoduje cofnięcie żołędzi łechtaczki tuż przed orgazmem?',
        answer: 'Odruch ochronny – tkanka chowa się pod napletkiem',
        options: ['Skurcz mięśni macicy', 'Odruch ochronny – tkanka chowa się pod napletkiem', 'Spadek ciśnienia krwi', 'Działanie hormonów'],
      },
      {
        text: 'Czym jest clitoromegalia?',
        answer: 'Powiększenie łechtaczki powyżej normy',
        options: ['Brak łechtaczki od urodzenia', 'Powiększenie łechtaczki powyżej normy', 'Stan zapalny łechtaczki', 'Podwojenie łechtaczki'],
      },
      {
        text: 'Ile razy więcej zakończeń nerwowych na mm² ma żołądź łechtaczki niż opuszki palców?',
        answer: 'Kilkakrotnie więcej',
        options: ['Mniej więcej tyle samo', 'Dwa razy więcej', 'Kilkakrotnie więcej', 'Palce mają więcej nerwów'],
      },
      {
        text: 'Jak łechtaczka połączona jest anatomicznie z pochwą?',
        answer: 'Przez opuszki przedsionkowe otaczające wejście do pochwy',
        options: ['Bezpośrednim kanałem nerwowym prowadzącym do mózgu', 'Przez opuszki przedsionkowe otaczające wejście do pochwy', 'Przez tkankę łączną przedniej ściany pochwy', 'Przez więzadło wieszadłowe miednicy'],
      },
      {
        text: 'Co to jest frenulum łechtaczki?',
        answer: 'Fałd skóry łączący wargi sromowe z żołędzią łechtaczki',
        options: ['Fałd skóry pokrywający żołądź łechtaczki', 'Fałd oddzielający wargi sromowe większe', 'Fałd skóry łączący wargi sromowe z żołędzią łechtaczki', 'Fałd błony śluzowej przedniej ściany pochwy'],
      },
      {
        text: 'W którym roku anatomia łechtaczki zaczęła pojawiać się wyczerpująco w podręcznikach medycznych?',
        answer: 'W pierwszej dekadzie lat 2000.',
        options: ['Już w latach 50. XX wieku', 'Już w latach 70. XX wieku', 'W pierwszej dekadzie lat 2000.', 'Dokładnie już w XIX wieku'],
      },
      {
        text: 'Czy rozmiar żołędzi łechtaczki koreluje z intensywnością orgazmu?',
        answer: 'Badania wykazują słabą i niejednoznaczną korelację',
        options: ['Tak – większa = silniejszy orgazm', 'Nie – rozmiar jest bez znaczenia', 'Badania wykazują słabą i niejednoznaczną korelację', 'Mniejsza łechtaczka = silniejszy orgazm'],
      },
      {
        text: 'Czym jest "złota trójkąt" w kontekście łechtaczki (triangle of pleasure)?',
        answer: 'Bogato unerwiony obszar między łechtaczką a pochwą',
        options: ['Trzy punkty G rozmieszczone na ścianie pochwy', 'Bogato unerwiony obszar między łechtaczką a pochwą', 'Trójkąt widoczny na obrazie USG pochwy', 'Przestrzeń między wargami sromowymi mniejszymi'],
      },

      // ── PENIS ────────────────────────────────────────────────────────────────
      {
        text: 'Jaka jest średnia długość penisa w erekcji na świecie? (Badanie BJUI 2015, n = 15 521)',
        answer: '13,1 cm',
        options: ['9,5 cm', '11,0 cm', '13,1 cm', '16,5 cm'],
      },
      {
        text: 'Jaka jest średnia długość penisa w stanie spoczynku wg metaanalizy BJUI 2015?',
        answer: 'Około 9,16 cm',
        options: ['Około 5,5 cm', 'Około 7,0 cm', 'Około 9,16 cm', 'Około 12,0 cm'],
      },
      {
        text: 'Jaki jest średni obwód penisa w erekcji wg BJUI 2015?',
        answer: '11,66 cm',
        options: ['7,5 cm', '9,5 cm', '11,66 cm', '14,5 cm'],
      },
      {
        text: 'Czy rozmiar buta lub dłoni koreluje z długością penisa?',
        answer: 'Nie ma naukowych dowodów na żadną korelację',
        options: ['Tak – rozmiar buta 45+ = penis 18+ cm', 'Tak – długość dłoni jest dokładnym wskaźnikiem', 'Nie ma naukowych dowodów na żadną korelację', 'Tak, ale tylko u mężczyzn powyżej 185 cm'],
      },
      {
        text: 'Co to jest choroba Peyroniego?',
        answer: 'Skrzywienie penisa wskutek bliznowacenia tkanki',
        options: ['Stan zapalny napletka i żołędzi', 'Skrzywienie penisa wskutek bliznowacenia tkanki', 'Wrodzony zbyt mały rozmiar penisa', 'Ból podczas erekcji bez zmian anatomicznych'],
      },
      {
        text: 'Czy penis może doznać "złamania"?',
        answer: 'Tak – pęknięcie osłonki białawej podczas erekcji',
        options: ['Nie – penis nie ma kości ani chrząstki do złamania', 'Tak – pęknięcie osłonki białawej podczas erekcji', 'Tylko u starszych mężczyzn po urazie', 'Jedynie przy współistniejącej chorobie Peyroniego'],
      },
      {
        text: 'Co to jest wędzidełko prącia (frenulum)?',
        answer: 'Wrażliwy fałd skóry pod żołędzią',
        options: ['Wystająca krawędź żołędzi penisa', 'Więzadło łączące penis z moszną', 'Wrażliwy fałd skóry pod żołędzią', 'Tkanki jamiste wnętrza penisa'],
      },
      {
        text: 'Jaki procent mężczyzn jest obrzezanych na świecie?',
        answer: 'Około 37–38%',
        options: ['Około 10%', 'Około 20%', 'Około 37–38%', 'Ponad 60%'],
      },
      {
        text: 'Ile zakończeń nerwowych szacunkowo zawiera napletek?',
        answer: 'Około 20 000',
        options: ['Około 200', 'Około 2 000', 'Około 20 000', 'Około 100 000'],
      },
      {
        text: 'Co to jest stulejka (fimosis)?',
        answer: 'Zbyt ciasny napletek utrudniający odsłonięcie żołędzi',
        options: ['Stan zapalny żołędzi i napletka', 'Bolesne skrzywienie penisa w erekcji', 'Zbyt ciasny napletek utrudniający odsłonięcie żołędzi', 'Brak wytrysku mimo orgazmu'],
      },
      {
        text: 'Jak szybko przebiega wytrysk?',
        answer: 'Około 45 km/h',
        options: ['Około 5 km/h', 'Około 20 km/h', 'Około 45 km/h', 'Ponad 200 km/h'],
      },
      {
        text: 'Jaki procent ssaków posiada kość w penisie (baculum)?',
        answer: 'Około 95%',
        options: ['Około 10%', 'Około 40%', 'Około 95%', 'Około 70%'],
      },
      {
        text: 'Co powoduje poranną erekcję?',
        answer: 'Fazy snu REM',
        options: ['Wysoki poranny poziom testosteronu', 'Ucisk od pełnego pęcherza moczowego', 'Fazy snu REM', 'Poranny wyrzut kortyzolu'],
      },
      {
        text: 'Co to jest zapalenie żołędzi (balanitis)?',
        answer: 'Stan zapalny żołędzi prącia',
        options: ['Ból odczuwany przy erekcji', 'Stan zapalny żołędzi prącia', 'Bolesne skrzywienie żołędzi', 'Powiększenie żołędzi powyżej normy'],
      },
      {
        text: 'Jaki procent mężczyzn ma mikropenis (< 7 cm w erekcji)?',
        answer: 'Około 0,6%',
        options: ['Około 0,6%', 'Około 5%', 'Około 15%', 'Ponad 20%'],
      },
      {
        text: 'Które więzadło przymocowuje penis do kości łonowej?',
        answer: 'Więzadło wieszadłowe prącia',
        options: ['Więzadło łonowo-pęcherzowe', 'Więzadło wieszadłowe prącia', 'Więzadło mosznowo-jądrowe', 'Rozcięgno mięśnia biodrowego'],
      },
      {
        text: 'Co to jest wytrysk wsteczny (retrograde ejaculation)?',
        answer: 'Nasienie cofa się do pęcherza zamiast wychodzić na zewnątrz',
        options: ['Wytrysk bez uczucia orgazmu', 'Nasienie cofa się do pęcherza zamiast wychodzić na zewnątrz', 'Brak płynu podczas ejakulacji', 'Podwójny wytrysk'],
      },
      {
        text: 'Który kontynent ma statystycznie największy średni rozmiar penisa wg badań?',
        answer: 'Afryka',
        options: ['Ameryka Łacińska', 'Afryka', 'Europa Wschodnia', 'Azja Południowo-Wschodnia'],
      },
      {
        text: 'Ile razy przeciętny mężczyzna doświadcza nocnej erekcji (NPT) podczas snu?',
        answer: '3–5 razy na noc',
        options: ['Nigdy', 'Raz na noc', '3–5 razy na noc', 'Ponad 10 razy'],
      },
      {
        text: 'Jaki procent mężczyzn ma penisa dłuższego niż 18 cm w erekcji?',
        answer: 'Około 2%',
        options: ['Około 2%', 'Około 15%', 'Około 30%', 'Ponad połowa'],
      },

      // ── POCHWA / SROM ────────────────────────────────────────────────────────
      {
        text: 'Jakie jest normalne pH pochwy u zdrowej kobiety w wieku rozrodczym?',
        answer: '3,8–4,5 (kwaśne)',
        options: ['1,0–2,0 (bardzo kwaśne)', '3,8–4,5 (kwaśne)', '6,5–7,0 (obojętne)', '8,0–9,0 (zasadowe)'],
      },
      {
        text: 'Które bakterie są kluczowe dla utrzymania zdrowia pochwy?',
        answer: 'Pałeczki kwasu mlekowego (Lactobacillus)',
        options: ['Staphylococcus epidermidis', 'Escherichia coli', 'Pałeczki kwasu mlekowego (Lactobacillus)', 'Streptococcus agalactiae'],
      },
      {
        text: 'Czym są gruczoły Bartholina?',
        answer: 'Gruczoły nawilżające wejście do pochwy',
        options: ['Gruczoły produkujące komórki jajowe', 'Gruczoły nawilżające wejście do pochwy', 'Gruczoły limfatyczne okolic sromu', 'Gruczoły regulujące pH pochwy'],
      },
      {
        text: 'Czym są gruczoły Skenego?',
        answer: 'Żeński odpowiednik gruczołu krokowego',
        options: ['Gruczoły macicy produkujące hormony', 'Żeński odpowiednik gruczołu krokowego', 'Gruczoły produkujące śluz szyjkowy', 'Gruczoły potowe okolic sromu'],
      },
      {
        text: 'Czym jest błona dziewicza (hymen)?',
        answer: 'Cienka błona częściowo pokrywająca wejście do pochwy',
        options: ['Szczelna bariera całkowicie zamykająca pochwę', 'Cienka błona częściowo pokrywająca wejście do pochwy', 'Tkanka łączna budująca szyjkę macicy', 'Mięsień dna miednicy zamykający pochwę'],
      },
      {
        text: 'Jaka jest spoczynkowa długość pochwy u dorosłej kobiety?',
        answer: '7–10 cm',
        options: ['2–3 cm', '4–6 cm', '7–10 cm', '15–20 cm'],
      },
      {
        text: 'Jak głęboko sięga pochwa podczas pobudzenia seksualnego?',
        answer: '10–15 cm',
        options: ['3–5 cm', '7–9 cm', '10–15 cm', '18–22 cm'],
      },
      {
        text: 'Co to jest pochwica (vaginismus)?',
        answer: 'Mimowolne skurcze mięśni utrudniające penetrację',
        options: ['Przewlekłe zakażenie grzybicze pochwy', 'Mimowolne skurcze mięśni utrudniające penetrację', 'Nadmierna suchość pochwy po menopauzie', 'Przewlekłe zapalenie szyjki macicy'],
      },
      {
        text: 'Czym są wargi sromowe mniejsze (labia minora)?',
        answer: 'Wewnętrzne fałdy skórne sromu',
        options: ['Zewnętrzne przetłuszczone fałdy sromu', 'Wewnętrzne fałdy skórne sromu', 'Element układu limfatycznego sromu', 'Tkanka otaczająca cewkę moczową'],
      },
      {
        text: 'Czym są wargi sromowe większe (labia majora)?',
        answer: 'Zewnętrzne fałdy skóry sromu z tkanką tłuszczową',
        options: ['Zewnętrzne fałdy skóry sromu z tkanką tłuszczową', 'Przednia część osłonki łechtaczki', 'Mięśnie dna miednicy wokół sromu', 'Wewnętrzna wyściółka ścian pochwy'],
      },
      {
        text: 'Gdzie dokładnie zlokalizowany jest punkt G na ścianie pochwy?',
        answer: '5–8 cm wgłąb, na przedniej ścianie pochwy',
        options: ['Tuż przy wejściu do pochwy, na głębokości 1–2 cm', '5–8 cm wgłąb, na przedniej ścianie pochwy', 'Na tylnej ścianie pochwy, na głębokości 10 cm', 'Bezpośrednio na szyjce macicy'],
      },
      {
        text: 'Co to są marszczenia pochwy (rugae vaginalis)?',
        answer: 'Podłużne fałdy błony śluzowej pochwy',
        options: ['Drobne brodawki na błonie śluzowej pochwy', 'Podłużne fałdy błony śluzowej pochwy', 'Skupiska gruczołów wydzielających śluz', 'Blizny powstałe po porodzie'],
      },
      {
        text: 'Skąd pochodzi naturalne nawilżenie pochwy podczas pobudzenia?',
        answer: 'Z przesiąkania osocza krwi przez ściany pochwy',
        options: ['Głównie z gruczołów Bartholina', 'Z wydzieliny gruczołów macicznych', 'Z przesiąkania osocza krwi przez ściany pochwy', 'Z wydzieliny śluzowej szyjki macicy'],
      },
      {
        text: 'Co to jest gardnereloza / bakteryjna waginoza (BV)?',
        answer: 'Zaburzenie równowagi flory bakteryjnej pochwy',
        options: ['Grzybicze zakażenie błony śluzowej pochwy', 'Wirusowe zakażenie przenoszone drogą płciową', 'Zaburzenie równowagi flory bakteryjnej pochwy', 'Pasożytnicze zakażenie dróg rodnych'],
      },
      {
        text: 'Co to jest srom (vulva)?',
        answer: 'Zewnętrzne narządy płciowe kobiety',
        options: ['Inna nazwa wnętrza pochwy', 'Zewnętrzne narządy płciowe kobiety', 'Szyjka macicy wraz z pochwą', 'Jajniki wraz z jajowodami'],
      },
      {
        text: 'Co to jest dyspareunia?',
        answer: 'Bolesne stosunki płciowe u kobiet lub mężczyzn',
        options: ['Brak orgazmu mimo stymulacji', 'Bolesne stosunki płciowe u kobiet lub mężczyzn', 'Nadmierne pobudzenie seksualne', 'Stan zapalny szyjki macicy'],
      },
      {
        text: 'Jaki jest związek między odległością łechtaczka–cewka moczowa a orgazmem pochwowym?',
        answer: 'Mniejsza odległość zwiększa szansę na orgazm pochwowy',
        options: ['Nie ma między nimi żadnej korelacji', 'Mniejsza odległość zwiększa szansę na orgazm pochwowy', 'Większa odległość ułatwia osiągnięcie orgazmu', 'Odległość wpływa tylko na ból, nie na orgazm'],
      },
      {
        text: 'Skąd pochodzi ciecz wydzielana podczas squirtingu?',
        answer: 'Z gruczołów Skenego i częściowo z pęcherza moczowego',
        options: ['Wyłącznie z pochwy', 'Wyłącznie z pęcherza moczowego', 'Z gruczołów Skenego i częściowo z pęcherza moczowego', 'Z szyjki macicy'],
      },
      {
        text: 'Czy pochwa oczyszcza się sama?',
        answer: 'Tak – naturalna wydzielina odprowadza martwe komórki i bakterie',
        options: ['Nie – wymaga codziennego irygowania od wewnątrz', 'Tak – naturalna wydzielina odprowadza martwe komórki i bakterie', 'Tylko bezpośrednio po miesiączce', 'Tak, ale wyłącznie przy stosowaniu probiotyków'],
      },
      {
        text: 'Czym jest vulvodynia?',
        answer: 'Przewlekły ból sromu bez wyraźnej przyczyny',
        options: ['Grzybicze zakażenie skóry sromu', 'Przewlekły ból sromu bez wyraźnej przyczyny', 'Stan zapalny gruczołów Bartholina', 'Alergia kontaktowa na lateks'],
      },

      // ── JĄDRA / PROSTATA ─────────────────────────────────────────────────────
      {
        text: 'Dlaczego lewe jądro zwisa zazwyczaj niżej niż prawe?',
        answer: 'Lewa żyła nasienna ma dłuższą drogę spływu krwi',
        options: ['Lewe jądro jest po prostu cięższe', 'Lewa żyła nasienna ma dłuższą drogę spływu krwi', 'Moszna jest asymetrycznie zbudowana', 'To tylko mit – jądra są na tym samym poziomie'],
      },
      {
        text: 'W jakiej temperaturze przebiega spermatogeneza?',
        answer: '2–4°C poniżej temperatury ciała (34–35°C)',
        options: ['W temperaturze ciała (37°C)', '1°C poniżej temperatury ciała', '2–4°C poniżej temperatury ciała (34–35°C)', '6–8°C poniżej temperatury ciała'],
      },
      {
        text: 'Ile trwa pełny cykl spermatogenezy – od komórki macierzystej do dojrzałego plemnika?',
        answer: '64–74 dni',
        options: ['7–10 dni', '24–30 dni', '64–74 dni', 'Ponad 6 miesięcy'],
      },
      {
        text: 'Jak długi byłby najądrze, gdyby go rozwinąć?',
        answer: 'Około 6 metrów',
        options: ['Około 30 cm', 'Około 1 metra', 'Około 6 metrów', 'Ponad 20 metrów'],
      },
      {
        text: 'Co to jest wnętrostwo (kryptorchizm)?',
        answer: 'Niezstąpienie jądra do moszny',
        options: ['Całkowity brak produkcji nasienia', 'Niezstąpienie jądra do moszny', 'Bolesny stan zapalny jąder', 'Powiększenie jąder powyżej normy'],
      },
      {
        text: 'Co produkuje gruczoł krokowy (prostata)?',
        answer: 'Zasadowy płyn – ok. 30% objętości nasienia',
        options: ['Testosteron i inne androgeny', 'Zasadowy płyn – ok. 30% objętości nasienia', 'Większość plemników w nasieniu', 'Fruktozę odżywiającą plemniki'],
      },
      {
        text: 'Jaki rozmiar porównuje się do prostaty u zdrowego mężczyzny?',
        answer: 'Orzech włoski',
        options: ['Ziarno grochu', 'Orzech włoski', 'Jajko kurze', 'Piłka golfowa'],
      },
      {
        text: 'Co to jest PSA i do czego służy?',
        answer: 'Marker białkowy stosowany w diagnostyce raka prostaty',
        options: ['Białko w nasieniu odpowiedzialne za ruchliwość', 'Marker białkowy stosowany w diagnostyce raka prostaty', 'Hormon jąder regulujący spermatogenezę', 'Enzym rozkładający plemniki po zapłodnieniu'],
      },
      {
        text: 'Co produkują pęcherzyki nasienne?',
        answer: 'Płyn z fruktozą – 60–70% objętości nasienia',
        options: ['Hormony regulujące popęd płciowy', 'Płyn z fruktozą – 60–70% objętości nasienia', 'Przeciwciała chroniące plemniki', 'Enzymy rozkładające komórkę jajową'],
      },
      {
        text: 'W jakim przedziale wiekowym najczęściej pojawia się rak jąder?',
        answer: '15–35 lat',
        options: ['0–5 lat (wczesne dzieciństwo)', '15–35 lat', '50–65 lat', 'Powyżej 70. roku życia'],
      },
      {
        text: 'Co to są żylaki powrózka nasiennego (varicocele)?',
        answer: 'Poszerzenie żył odprowadzających krew z jądra',
        options: ['Zapalenie jąder będące powikłaniem świnki', 'Wypełniona płynem torbiel najądrza', 'Poszerzenie żył odprowadzających krew z jądra', 'Złośliwy nowotwór tkanki jądra'],
      },
      {
        text: 'Gdzie dokładnie w ciele znajduje się gruczoł krokowy?',
        answer: 'Pod pęcherzem moczowym, otaczając cewkę moczową',
        options: ['Między jądrami a cewką moczową', 'Wewnątrz moszny, powyżej jąder', 'Pod pęcherzem moczowym, otaczając cewkę moczową', 'Za odbytem, poza miednicą'],
      },
      {
        text: 'Ile procent testosteronu u mężczyzny produkują jądra?',
        answer: 'Około 95%',
        options: ['Około 50%', 'Około 70%', 'Około 95%', 'Około 100%'],
      },
      {
        text: 'Ile ważą oba jądra razem?',
        answer: 'Około 30–40 g łącznie',
        options: ['Około 5–10 g', 'Około 15–20 g', 'Około 30–40 g łącznie', 'Ponad 100 g'],
      },
      {
        text: 'Co to jest zapalenie jąder (orchitis) i jaką ma najczęstszą przyczynę u dorosłych?',
        answer: 'Stan zapalny jąder – najczęściej jako powikłanie świnki',
        options: ['Stan zapalny jąder – najczęściej wskutek alergii na środki higieny', 'Stan zapalny jąder – najczęściej jako powikłanie świnki', 'Stan zapalny jąder – najczęściej z powodu przegrzania moszny', 'Stan zapalny jąder – najczęściej przy niedoborze testosteronu'],
      },

      // ── ORGAZM ──────────────────────────────────────────────────────────────
      {
        text: 'Ile trwa orgazm u przeciętnej kobiety?',
        answer: '20–35 sekund',
        options: ['3–5 sekund', '8–10 sekund', '20–35 sekund', 'Ponad 2 minuty'],
      },
      {
        text: 'Ile trwa orgazm u przeciętnego mężczyzny?',
        answer: '3–15 sekund',
        options: ['Mniej niż sekundę', '3–15 sekund', '30–45 sekund', 'Ponad minutę'],
      },
      {
        text: 'Co się dzieje z korą przedczołową mózgu podczas orgazmu?',
        answer: 'Ulega szerokiej dezaktywacji',
        options: ['Aktywuje się na maksymalnym poziomie', 'Ulega szerokiej dezaktywacji', 'Nie zmienia swojej aktywności', 'Aktywują się tylko obszary słuchowe'],
      },
      {
        text: 'Co to jest "orgasm gap"?',
        answer: 'Różnica w częstości osiągania orgazmu między płciami',
        options: ['Różnica w długości trwania orgazmu między płciami', 'Różnica w częstości osiągania orgazmu między płciami', 'Całkowity brak orgazmu u jednego z partnerów', 'Różnica w głośności partnerów podczas orgazmu'],
      },
      {
        text: 'Jaki procent kobiet osiąga orgazm wyłącznie ze stosunku penetracyjnego?',
        answer: 'Około 18–25%',
        options: ['Poniżej 5%', 'Około 18–25%', 'Około 50%', 'Ponad 75%'],
      },
      {
        text: 'Ile skurczów mięśni pochwy i miednicy zachodzi podczas kobiecego orgazmu?',
        answer: '8–15 skurczów co 0,8 sekundy',
        options: ['2–3 skurcze', '8–15 skurczów co 0,8 sekundy', '25–40 skurczów', 'Ciągły skurcz bez przerw'],
      },
      {
        text: 'Czy orgazm działa przeciwbólowo?',
        answer: 'Tak – próg bólu wzrasta nawet o ponad 100%',
        options: ['Nie – nie ma wpływu na odczuwanie bólu', 'Tak – próg bólu wzrasta nawet o ponad 100%', 'Działa przeciwbólowo tylko u kobiet', 'Tak, ale łagodzi wyłącznie ból głowy'],
      },
      {
        text: 'Co to jest ejaculatory inevitability ("punkt bez powrotu")?',
        answer: 'Moment, po którym mężczyzna nie może zatrzymać wytrysku',
        options: ['Drugi orgazm bez przerwy', 'Moment, po którym mężczyzna nie może zatrzymać wytrysku', 'Ból przy wytrysku', 'Stan po którym następuje refrakcja'],
      },
      {
        text: 'Jakie neurochemikalia są uwalniane podczas orgazmu?',
        answer: 'Dopamina, oksytocyna, endorfiny i serotonina',
        options: ['Wyłącznie adrenalina i noradrenalina', 'Kortyzol, testosteron i adrenalina', 'Dopamina, oksytocyna, endorfiny i serotonina', 'Wyłącznie endorfiny i melatonina'],
      },
      {
        text: 'Czy mężczyźni mogą osiągać wielokrotne orgazmy?',
        answer: 'Tak – dzięki technikom zatrzymania wytrysku',
        options: ['Nie – jest to biologicznie niemożliwe', 'Tak – dzięki technikom zatrzymania wytrysku', 'Tak, ale dopiero po 50. roku życia', 'Tylko przy bardzo niskim poziomie prolaktyny'],
      },
      {
        text: 'Jaki hormon uwalniany po orgazmie wywołuje uczucie senności i relaksu?',
        answer: 'Prolaktyna',
        options: ['Kortyzol', 'Adrenalina', 'Prolaktyna', 'Melatonina'],
      },
      {
        text: 'Co to jest post-coital dysphoria (PCD)?',
        answer: 'Uczucie smutku lub niepokoju pojawiające się po orgazmie',
        options: ['Ból fizyczny odczuwany po stosunku', 'Uczucie smutku lub niepokoju pojawiające się po orgazmie', 'Niemożność osiągnięcia orgazmu mimo stymulacji', 'Dyskomfort odczuwany podczas stosunku'],
      },
      {
        text: 'Ile procent kobiet nigdy nie osiągnęło orgazmu w życiu (anorgazmia pierwotna)?',
        answer: 'Około 5–10%',
        options: ['Poniżej 0,5%', 'Około 5–10%', 'Około 30%', 'Ponad połowa'],
      },
      {
        text: 'Jak często kobiety osiągają orgazm podczas seksu oralnego vs penetracyjnego?',
        answer: 'Około 80% przy oralnym vs 25% przy samej penetracji',
        options: ['Tak samo często (~50% w obu)', 'Rzadziej przy oralnym niż penetracyjnym', 'Około 80% przy oralnym vs 25% przy samej penetracji', 'Oralny nie powoduje orgazmu'],
      },
      {
        text: 'Czy można doświadczyć orgazmu przez sen?',
        answer: 'Tak – zdarzają się nocne orgazmy',
        options: ['Nie – sen całkowicie uniemożliwia orgazm', 'Tak – zdarzają się nocne orgazmy', 'Tylko u mężczyzn, nie u kobiet', 'Tylko u osób przed 25. rokiem życia'],
      },
      {
        text: 'Co to jest orgazm wielokrotny?',
        answer: 'Kilka orgazmów pod rząd bez pełnego powrotu do stanu wyjściowego',
        options: ['Orgazm trwający ponad 5 minut', 'Kilka orgazmów pod rząd bez pełnego powrotu do stanu wyjściowego', 'Orgazm angażujący całe ciało', 'Orgazm z wieloma partnerami jednocześnie'],
      },
      {
        text: 'Co to jest anorgazmia?',
        answer: 'Niemożność osiągnięcia orgazmu mimo stymulacji',
        options: ['Ból odczuwany w trakcie orgazmu', 'Zbyt szybkie osiąganie orgazmu', 'Niemożność osiągnięcia orgazmu mimo stymulacji', 'Orgazm pozbawiony fizycznej przyjemności'],
      },
      {
        text: 'Jaki procent kobiet przyznaje, że symuluje orgazm?',
        answer: 'Ponad 50%',
        options: ['Około 5%', 'Około 20%', 'Około 35%', 'Ponad 50%'],
      },
      {
        text: 'Jak orgazm wpływa na układ odpornościowy?',
        answer: 'Przejściowo podnosi poziom przeciwciał IgA i komórek NK',
        options: ['Osłabia odporność na około dobę', 'Nie ma żadnego wpływu na odporność', 'Przejściowo podnosi poziom przeciwciał IgA i komórek NK', 'Zwiększa liczbę białych krwinek na tydzień'],
      },
      {
        text: 'Jak szybko może wzrosnąć tętno podczas orgazmu?',
        answer: 'Do 150–180 uderzeń na minutę',
        options: ['Do 80 uderzeń na minutę', 'Do 100 uderzeń na minutę', 'Do 150–180 uderzeń na minutę', 'Ponad 250 uderzeń na minutę'],
      },
      {
        text: 'Jaka rola pudendal nerve (nerwu sromowego) w orgazmie?',
        answer: 'Jest głównym nerwem czuciowym narządów płciowych',
        options: ['Kontroluje wyłącznie odczuwanie bólu', 'Jest głównym nerwem czuciowym narządów płciowych', 'Reguluje poziom hormonów płciowych', 'Łączy mózg bezpośrednio z jajnikami'],
      },

      // ── HORMONY ─────────────────────────────────────────────────────────────
      {
        text: 'Który hormon w największym stopniu napędza popęd seksualny kobiet?',
        answer: 'Testosteron',
        options: ['Estrogen', 'Progesteron', 'Testosteron', 'Oksytocyna'],
      },
      {
        text: 'Kiedy testosteron jest najwyższy u kobiet w trakcie cyklu?',
        answer: 'W okolicach owulacji (środek cyklu)',
        options: ['W pierwszym dniu miesiączki', 'W okolicach owulacji (środek cyklu)', 'W fazie lutealnej cyklu', 'Poziom jest stały przez cały cykl'],
      },
      {
        text: 'Jaką rolę pełni oksytocyna w życiu seksualnym?',
        answer: 'Wzmacnia więź emocjonalną po stosunku',
        options: ['Napędza pożądanie seksualne', 'Reguluje cykl miesiączkowy', 'Wzmacnia więź emocjonalną po stosunku', 'Stymuluje owulację'],
      },
      {
        text: 'Co robi estrogen dla zdrowia pochwy?',
        answer: 'Utrzymuje elastyczność i nawilżenie pochwy',
        options: ['Reguluje popęd seksualny', 'Utrzymuje elastyczność i nawilżenie pochwy', 'Zwiększa produkcję plemników', 'Hamuje owulację'],
      },
      {
        text: 'Jaka jest rola prolaktyny po orgazmie mężczyzny?',
        answer: 'Wywołuje znużenie i okres refrakcji',
        options: ['Stymuluje natychmiastową kolejną erekcję', 'Wywołuje znużenie i okres refrakcji', 'Reguluje poziom testosteronu', 'Wpływa na jakość nasienia'],
      },
      {
        text: 'O ile procent spada testosteron u mężczyzn po 30. roku życia rocznie?',
        answer: 'Około 1% rocznie',
        options: ['Około 0,1% rocznie', 'Około 1% rocznie', 'Około 5% rocznie', 'Ponad 10% rocznie'],
      },
      {
        text: 'Jak progesteron wpływa na libido?',
        answer: 'Generalnie je obniża',
        options: ['Znacznie zwiększa libido', 'Generalnie je obniża', 'Nie ma żadnego wpływu na libido', 'Zwiększa je tylko u kobiet po menopauzie'],
      },
      {
        text: 'Co to jest FSH i jaką pełni funkcję?',
        answer: 'Hormon folikulotropowy – stymuluje produkcję komórek rozrodczych',
        options: ['Hormon stresu wydzielany przez nadnercza', 'Hormon folikulotropowy – stymuluje produkcję komórek rozrodczych', 'Hormon tarczycy regulujący libido', 'Hormon przysadki odpowiedzialny za więź'],
      },
      {
        text: 'Jak przewlekły stres wpływa na libido?',
        answer: 'Kortyzol obniża produkcję hormonów płciowych',
        options: ['Zwiększa libido poprzez wyrzut adrenaliny', 'Kortyzol obniża produkcję hormonów płciowych', 'Nie ma żadnego wpływu na hormony płciowe', 'Krótkoterminowo zwiększa poziom testosteronu'],
      },
      {
        text: 'Co się dzieje z poziomem estrogenów podczas menopauzy?',
        answer: 'Drastycznie spada przez cały okres menopauzy',
        options: ['Rośnie, by skompensować brak owulacji', 'Pozostaje na stałym poziomie jak wcześniej', 'Drastycznie spada przez cały okres menopauzy', 'Najpierw rośnie, potem spada niemal do zera'],
      },
      {
        text: 'Co to jest andropauza?',
        answer: 'Stopniowy, wieloletni spadek testosteronu u mężczyzn',
        options: ['Nagłe całkowite zatrzymanie produkcji testosteronu', 'Nagły hormonalny odpowiednik kobiecej menopauzy', 'Stopniowy, wieloletni spadek testosteronu u mężczyzn', 'Całkowity brak erekcji po 65. roku życia'],
      },
      {
        text: 'Jak niedoczynność tarczycy wpływa na życie seksualne?',
        answer: 'Obniża libido i może powodować zaburzenia erekcji',
        options: ['Nie ma żadnego wpływu na seks', 'Zauważalnie zwiększa libido', 'Obniża libido i może powodować zaburzenia erekcji', 'Wpływa tylko na miesiączkę, nie na seks'],
      },
      {
        text: 'Jak trening siłowy wpływa na poziom testosteronu?',
        answer: 'Krótkoterminowo go podnosi, zwłaszcza ćwiczenia wielostawowe',
        options: ['Drastycznie obniża go po każdym treningu', 'Krótkoterminowo go podnosi, zwłaszcza ćwiczenia wielostawowe', 'Nie wpływa w żaden sposób na testosteron', 'Podnosi go tylko po 50. roku życia'],
      },
      {
        text: 'Co to są fitoestrogeny?',
        answer: 'Roślinne związki o budowie podobnej do estrogenów',
        options: ['Syntetyczne estrogeny z tabletek antykoncepcyjnych', 'Roślinne związki o budowie podobnej do estrogenów', 'Estrogeny produkowane przez tarczycę', 'Hormony regulujące popęd u mężczyzn'],
      },
      {
        text: 'Jak alkohol przewlekle wpływa na poziom testosteronu?',
        answer: 'Długotrwałe spożycie obniża testosteron i jakość nasienia',
        options: ['Podnosi testosteron – stąd agresja mężczyzn po alkoholu', 'Długotrwałe spożycie obniża testosteron i jakość nasienia', 'Nie ma żadnego wpływu na gospodarkę hormonalną', 'Działa jak naturalny booster testosteronu'],
      },
      {
        text: 'Jaką rolę odgrywa serotonina w życiu seksualnym?',
        answer: 'Generalnie hamuje – dlatego leki SSRI obniżają libido',
        options: ['Napędza pożądanie i ułatwia erekcję', 'Nie ma żadnego związku z seksem', 'Generalnie hamuje – dlatego leki SSRI obniżają libido', 'Zwiększa libido u kobiet, obniża u mężczyzn'],
      },

      // ── NASIENIE / SPERMA ────────────────────────────────────────────────────
      {
        text: 'Ile plemników produkuje zdrowy mężczyzna każdego dnia?',
        answer: 'Około 300 milionów',
        options: ['Około 1 miliona', 'Około 10 milionów', 'Około 300 milionów', 'Ponad 5 miliardów'],
      },
      {
        text: 'Jaki procent nasienia stanowią faktycznie plemniki?',
        answer: 'Około 2–5%',
        options: ['Ponad 50%', 'Około 25%', 'Około 10%', 'Około 2–5%'],
      },
      {
        text: 'Co stanowi większość objętości nasienia?',
        answer: 'Płyn z pęcherzyków nasiennych i prostaty',
        options: ['Przede wszystkim same plemniki', 'Wydzielina gromadzona w najądrzach', 'Płyn z pęcherzyków nasiennych i prostaty', 'Woda i enzymy z cewki moczowej'],
      },
      {
        text: 'Jakie jest pH nasienia?',
        answer: '7,2–8,0 (lekko zasadowe)',
        options: ['4,0–5,0 (kwaśne)', '6,5–7,0 (obojętne)', '7,2–8,0 (lekko zasadowe)', '9,0–10,0 (silnie zasadowe)'],
      },
      {
        text: 'Ile wynosi średnia objętość jednego ejakulatu? (WHO Laboratory Manual)',
        answer: '3–5 ml',
        options: ['0,5 ml', '1–2 ml', '3–5 ml', '10 ml'],
      },
      {
        text: 'Co kieruje plemnikiami w stronę komórki jajowej?',
        answer: 'Reakcja na substancje chemiczne i temperaturę',
        options: ['Działająca na nie siła grawitacji', 'Wewnętrzny magnetyzm biologiczny', 'Reakcja na substancje chemiczne i temperaturę', 'Prądy elektryczne ścian macicy'],
      },
      {
        text: 'Co to jest azoospermia?',
        answer: 'Całkowity brak plemników w ejakulacie',
        options: ['Zbyt mała objętość ejakulatu', 'Całkowity brak plemników w ejakulacie', 'Zdeformowane plemniki', 'Nieruchliwe plemniki'],
      },
      {
        text: 'Co to jest oligospermia?',
        answer: 'Zbyt niska liczba plemników w nasieniu',
        options: ['Zbyt niska liczba plemników w nasieniu', 'Zbyt duża objętość ejakulatu', 'Obecność krwi w nasieniu', 'Całkowity brak ruchliwości plemników'],
      },
      {
        text: 'Jaką ruchliwość plemników WHO uważa za normę?',
        answer: 'Ponad 42% plemników z ruchem postępowym',
        options: ['100% (wszystkie muszą być ruchliwe)', 'Ponad 70%', 'Ponad 42% plemników z ruchem postępowym', 'Wystarczy 10%'],
      },
      {
        text: 'Co niszczy jakość nasienia?',
        answer: 'Ciepło, palenie, alkohol i sterydy anaboliczne',
        options: ['Witaminy C i E oraz cynk', 'Ciepło, palenie, alkohol i sterydy anaboliczne', 'Regularne ćwiczenia fizyczne', 'Dieta bogata w warzywa i owoce'],
      },
      {
        text: 'Jak szybko może płynąć pojedynczy plemnik?',
        answer: 'Około 3 mm/minutę',
        options: ['Około 0,01 mm/minutę', 'Około 3 mm/minutę', 'Około 30 mm/minutę', 'Ponad 10 cm/minutę'],
      },
      {
        text: 'Co to jest pojemność nasienia (sperm capacitation)?',
        answer: 'Aktywacja biochemiczna plemnika w żeńskich drogach rodnych',
        options: ['Całkowita liczba plemników w jednym ejakulacie', 'Laboratoryjna ocena zdolności nasienia do zapłodnienia', 'Aktywacja biochemiczna plemnika w żeńskich drogach rodnych', 'Zawartość fruktozy w płynie nasiennym'],
      },
      {
        text: 'Ile plemników z całego ejakulatu dociera do komórki jajowej?',
        answer: 'Tylko 10–100 z setek milionów',
        options: ['Kilka milionów plemników', 'Kilkadziesiąt tysięcy plemników', 'Tylko 10–100 z setek milionów', 'Mniej więcej połowa ejakulatu'],
      },
      {
        text: 'Co zawiera fruktoza w nasieniu i po co?',
        answer: 'Jest głównym źródłem energii dla poruszających się plemników',
        options: ['Reguluje pH nasienia', 'Jest głównym źródłem energii dla poruszających się plemników', 'Chroni plemniki przed odpornością kobiety', 'Pomaga plemnikom przejść przez błonę jajową'],
      },
      {
        text: 'Co sprawia, że nasienie jest początkowo gęste, a potem się upłynnia?',
        answer: 'Proteazy prostaty rozkładają białka koagulujące nasienia',
        options: ['Upłynnienie wywołuje temperatura ciała', 'Proteazy prostaty rozkładają białka koagulujące nasienia', 'Upłynnia je kontakt z kwaśnym pH pochwy', 'Odpowiadają za to enzymy z najądrza'],
      },
      {
        text: 'Co to jest hiperspermia?',
        answer: 'Zbyt duża objętość ejakulatu',
        options: ['Zbyt szybki, przedwczesny wytrysk', 'Zbyt duża objętość ejakulatu', 'Nadmiar plemników powyżej normy', 'Wielokrotny wytrysk podczas stosunku'],
      },
      {
        text: 'Jak długo plemniki przeżywają w kobiecych drogach rodnych?',
        answer: 'Do 5 dni (najczęściej 2–3 dni)',
        options: ['Kilka minut', 'Kilka godzin', 'Do 5 dni (najczęściej 2–3 dni)', 'Do 3 tygodni'],
      },

      // ── POBUDZENIE SEKSUALNE ─────────────────────────────────────────────────
      {
        text: 'Jak szybko zaczyna się nawilżanie pochwy po pobudzeniu seksualnym?',
        answer: 'W ciągu 10–30 sekund od pobudzenia',
        options: ['Po kilku minutach', 'Dopiero po penetracji', 'W ciągu 10–30 sekund od pobudzenia', 'Po ok. 5 minutach intensywnej stymulacji'],
      },
      {
        text: 'Skąd fizycznie pochodzi nawilżenie pochwy podczas pobudzenia?',
        answer: 'Osocze krwi przenika przez ściany pochwy (transudacja)',
        options: ['Głównie z gruczołów Bartholina przy wejściu', 'Z wydzieliny śluzowej szyjki macicy', 'Osocze krwi przenika przez ściany pochwy (transudacja)', 'Z dojrzewających pęcherzyków jajnikowych'],
      },
      {
        text: 'Co to jest strefa erogenna?',
        answer: 'Obszar ciała szczególnie wrażliwy na stymulację seksualną',
        options: ['Obszar ciała pokryty błoną śluzową', 'Obszar ciała szczególnie wrażliwy na stymulację seksualną', 'Tylko okolice narządów płciowych', 'Obszar ciała reagujący bólem na dotyk'],
      },
      {
        text: 'Co to jest "podwójny model kontroli seksualnej" (dual control model)?',
        answer: 'Równowaga między układem pobudzenia a układem hamowania',
        options: ['Aktywacja obu półkul mózgu podczas seksu', 'Równowaga między układem pobudzenia a układem hamowania', 'Synchronizacja orgazmu obojga partnerów', 'Kontrola oddechu i tętna podczas stosunku'],
      },
      {
        text: 'Dlaczego brodawki sutkowe mogą erekować podczas pobudzenia?',
        answer: 'Skurcz mięśni gładkich brodawki pod wpływem oksytocyny',
        options: ['Miejscowy wzrost temperatury ciała', 'Skurcz mięśni gładkich brodawki pod wpływem oksytocyny', 'Rozszerzenie naczyń krwionośnych brodawek', 'Wydzielanie estrogenów do tkanki piersi'],
      },
      {
        text: 'Co to jest rumieniec seksualny (sex flush)?',
        answer: 'Zaczerwienienie skóry klatki piersiowej i szyi',
        options: ['Wzmożone pocenie się podczas seksu', 'Zaczerwienienie skóry klatki piersiowej i szyi', 'Uczucie gorąca od wysiłku fizycznego', 'Objawy reakcji alergicznej skóry'],
      },
      {
        text: 'Jaka jest rola dopaminy w pobudzeniu seksualnym?',
        answer: 'Napędza motywację i pożądanie',
        options: ['Wywołuje fizyczną erekcję', 'Reguluje poziom nawilżenia pochwy', 'Napędza motywację i pożądanie', 'Hamuje nadmierne pobudzenie'],
      },
      {
        text: 'Co to jest tumescencja?',
        answer: 'Powiększenie narządów płciowych wypełnionych krwią',
        options: ['Ból narządów płciowych po długiej stymulacji', 'Powiększenie narządów płciowych wypełnionych krwią', 'Bolesny skurcz mięśni pochwy', 'Wzmożone wydzielanie śluzu szyjkowego'],
      },
      {
        text: 'Który obszar mózgu przetwarza emocjonalne bodźce seksualne i reaguje na strach?',
        answer: 'Ciało migdałowate',
        options: ['Móżdżek', 'Kora ruchowa', 'Ciało migdałowate', 'Zakręt czołowy środkowy'],
      },
      {
        text: 'Kiedy libido kobiety jest statystycznie najwyższe w trakcie cyklu?',
        answer: 'Wokół owulacji (dzień 12–16)',
        options: ['Podczas miesiączki', 'Wokół owulacji (dzień 12–16)', 'W fazie lutealnej (tydzień 3–4)', 'Libido jest stałe przez cały cykl'],
      },
      {
        text: 'Co to jest efekt Coolidge\'a?',
        answer: 'Powrót podniecenia przy nowym partnerze mimo nasycenia',
        options: ['Stopniowy wzrost podniecenia w długim związku', 'Powrót podniecenia przy nowym partnerze mimo nasycenia', 'Obniżenie libido po wieloletnim związku', 'Brak zainteresowania seksem u osób starszych'],
      },
      {
        text: 'Jak stymulacja wizualna wpływa na pobudzenie seksualne u mężczyzn i kobiet?',
        answer: 'Obie płci reagują, choć w nieco inny sposób',
        options: ['Wyłącznie mężczyźni reagują na bodźce wzrokowe', 'Kobiety reagują wyraźnie silniej niż mężczyźni', 'Obie płci reagują, choć w nieco inny sposób', 'Wzrok nie wpływa na pobudzenie seksualne'],
      },
      {
        text: 'Co to jest vomeronasal organ (narząd lemieszkowy) u ludzi?',
        answer: 'Szczątkowy narząd wykrywający feromony',
        options: ['Narząd w nosie odpowiedzialny za słuch', 'Szczątkowy narząd wykrywający feromony', 'Receptor smaku ważny dla orgazmu', 'Gruczoł wydzielający feromony na szyi'],
      },
      {
        text: 'Co to jest seksualne wstręt (sexual disgust)?',
        answer: 'Ewolucyjny mechanizm chroniący przed szkodliwym kontaktem',
        options: ['Kliniczne zaburzenie – awersja do wszystkiego co seksualne', 'Ewolucyjny mechanizm chroniący przed szkodliwym kontaktem', 'Całkowita niemożność pobudzenia seksualnego', 'Fobia seksualna wymagająca leczenia'],
      },
      {
        text: 'Co się dzieje z tętnicami w narządach płciowych podczas pobudzenia?',
        answer: 'Rozszerzają się, a napływ krwi powoduje wzwód',
        options: ['Zwężają się dla lepszego ukrwienia', 'Rozszerzają się, a napływ krwi powoduje wzwód', 'Nie zmieniają się – to tylko efekt nerwowy', 'Pulsują szybciej bez zmiany średnicy'],
      },

      // ── REKORDY / CIEKAWOSTKI ────────────────────────────────────────────────
      {
        text: 'Ile orgazmów osiągnęła kobieta w ciągu 1 godziny w badaniach laboratoryjnych (Kinsey Institute, lata 50.)?',
        answer: '134',
        options: ['12', '47', '134', 'Ponad 500'],
      },
      {
        text: 'Do czego pierwotnie służył wibrator wynaleziony w XIX wieku?',
        answer: 'Do lekarskiego "masażu" leczącego "histerię"',
        options: ['Do masażu pleców po pracy fizycznej', 'Do lekarskiego "masażu" leczącego "histerię"', 'Do badań fizjologicznych mięśni', 'Do leczenia bólu głowy stymulacją elektryczną'],
      },
      {
        text: 'Kiedy pierwszy elektryczny wibrator trafił do powszechnej sprzedaży?',
        answer: 'Około 1902 roku (Hamilton Beach)',
        options: ['W latach 1860.', 'Około 1902 roku (Hamilton Beach)', 'W 1945 roku', 'Dopiero w latach 60. XX w.'],
      },
      {
        text: 'Jakie zwierzę ma proporcjonalnie największy penis w królestwie zwierząt?',
        answer: 'Pąkla (skorupiak)',
        options: ['Słoń', 'Humbak (wieloryb)', 'Pąkla (skorupiak)', 'Goryl'],
      },
      {
        text: 'Co to jest "blue balls" (epididymal hypertension)?',
        answer: 'Dyskomfort w jądrach po długim pobudzeniu bez orgazmu',
        options: ['Mit medyczny bez podstaw naukowych', 'Choroba przenoszona drogą płciową', 'Dyskomfort w jądrach po długim pobudzeniu bez orgazmu', 'Zapalenie najądrzy po przeziębieniu'],
      },
      {
        text: 'Ile razy szacunkowo przeciętna osoba uprawia seks w ciągu całego życia?',
        answer: 'Około 5 000–6 000 razy',
        options: ['Około 500 razy', 'Około 1 000 razy', 'Około 5 000–6 000 razy', 'Ponad 50 000 razy'],
      },
      {
        text: 'Który kraj jako pierwszy zdelegalizował homoseksualizm jako przestępstwo?',
        answer: 'Francja',
        options: ['Holandia', 'Francja', 'Szwecja', 'USA'],
      },
      {
        text: 'Jaki związek chemiczny w czekoladzie naśladuje uczucie zakochania?',
        answer: 'Fenyloetyloamina (PEA)',
        options: ['Teofilina', 'Kofeina', 'Fenyloetyloamina (PEA)', 'Serotonina z kakao'],
      },
      {
        text: 'Jaką najczęstszą fantazję seksualną mają kobiety wg badań?',
        answer: 'Seks z nieznajomym lub w nietypowym miejscu',
        options: ['Seks ze znaną gwiazdą filmową', 'Seks z nieznajomym lub w nietypowym miejscu', 'Seks z inną kobietą (u hetero)', 'Fantazje z motywami BDSM'],
      },
      {
        text: 'Które zwierzę jest uważane za symbol monogamii seksualnej wśród naczelnych?',
        answer: 'Gibon',
        options: ['Szympans', 'Goryl', 'Gibon', 'Makak'],
      },
      {
        text: 'Co to jest "beer goggles effect" – potwierdzony naukowo?',
        answer: 'Postrzeganie innych jako atrakcyjniejszych po alkoholu',
        options: ['Zamazane, nieostre widzenie po alkoholu', 'Postrzeganie innych jako atrakcyjniejszych po alkoholu', 'Uczucie przyjemnego ciepła po piwie', 'Stopniowy wzrost tolerancji na alkohol'],
      },
      {
        text: 'Ile kalorii spala przeciętny stosunek seksualny? (PLoS ONE 2013)',
        answer: 'Około 69–100 kcal',
        options: ['Około 5 kcal', 'Około 30 kcal', 'Około 69–100 kcal', 'Ponad 400 kcal'],
      },
      {
        text: 'Który starożytny grecki lekarz jako pierwszy szczegółowo opisał kobiecy orgazm?',
        answer: 'Galen z Pergamonu',
        options: ['Hipokrates', 'Arystoteles', 'Galen z Pergamonu', 'Sokrates'],
      },
      {
        text: 'Jaka jest najczęstsza pozycja seksualna na świecie wg badań?',
        answer: 'Misjonarz',
        options: ['Jeździec', 'Doggy style', 'Misjonarz', 'Łyżeczka'],
      },
      {
        text: 'Ile procent badanych przez Kinsey kobiet przyznało się do masturbacji?',
        answer: 'Około 62–70%',
        options: ['Około 5%', 'Około 20%', 'Około 62–70%', 'Prawie 100%'],
      },
      {
        text: 'Który lekarz jako pierwszy opisał punkt G w publikacji naukowej (1950)?',
        answer: 'Ernst Gräfenberg',
        options: ['Sigmund Freud', 'Alfred Kinsey', 'William Masters', 'Ernst Gräfenberg'],
      },

      // ── ZDROWIE INTYMNE ──────────────────────────────────────────────────────
      {
        text: 'Co to jest HPV?',
        answer: 'Ludzki wirus brodawczaka – może powodować raka szyjki macicy',
        options: ['Wirus wywołujący opryszczkę narządów płciowych', 'Ludzki wirus brodawczaka – może powodować raka szyjki macicy', 'Wirus HIV w formie utajonej', 'Zakażenie grzybicze narządów płciowych'],
      },
      {
        text: 'Który środek jest najskuteczniejszy w zapobieganiu przenoszeniu STI?',
        answer: 'Prawidłowo stosowana prezerwatywa',
        options: ['Antykoncepcja hormonalna', 'Prawidłowo stosowana prezerwatywa', 'Wkładka domaciczna (IUD)', 'Wstrzemięźliwość przez kilka dni'],
      },
      {
        text: 'Co wywołuje grzybicę pochwy?',
        answer: 'Nadmierny przerost drożdżaków Candida albicans',
        options: ['Bakteria Gardnerella vaginalis', 'Wirus HSV-2', 'Nadmierny przerost drożdżaków Candida albicans', 'Pasożyt Trichomonas vaginalis'],
      },
      {
        text: 'Co to jest endometrioza?',
        answer: 'Tkanka podobna do śluzówki macicy rośnie poza macicą',
        options: ['Złośliwy rak błony śluzowej macicy', 'Tkanka podobna do śluzówki macicy rośnie poza macicą', 'Pogrubienie śluzówki macicy po menopauzie', 'Zapalenie macicy wywołane bakterią'],
      },
      {
        text: 'Co to jest PCOS (zespół policystycznych jajników)?',
        answer: 'Zaburzenie hormonalne z nieregularną owulacją i cystami',
        options: ['Złośliwy nowotwór jajnika', 'Zaburzenie hormonalne z nieregularną owulacją i cystami', 'Bakteryjne zapalenie jajowodów', 'Przedwczesna menopauza przed 40. rokiem'],
      },
      {
        text: 'Które STI można przenieść bez penetracji, przez sam kontakt skóry?',
        answer: 'Opryszczka (HSV) i HPV',
        options: ['Chlamydia', 'HIV', 'Opryszczka (HSV) i HPV', 'Kiła (tylko przez krew)'],
      },
      {
        text: 'Jaki środek zapobiega najczęstszym typom HPV powodującym raka szyjki macicy?',
        answer: 'Szczepionka HPV (Gardasil 9)',
        options: ['Antybiotyk przyjmowany profilaktycznie', 'Szczepionka HPV (Gardasil 9)', 'Regularnie wykonywana cytologia', 'Antykoncepcja hormonalna'],
      },
      {
        text: 'Co to jest rzęsistkowica (trichomoniasis)?',
        answer: 'Pasożytnicze STI wywołane przez Trichomonas vaginalis',
        options: ['Grzybicze zakażenie błony śluzowej pochwy', 'Wirusowe STI powodujące brodawki płciowe', 'Pasożytnicze STI wywołane przez Trichomonas vaginalis', 'Bakteryjne zapalenie błony śluzowej pochwy'],
      },
      {
        text: 'Jakie lubrykanty są bezpieczne do stosowania z prezerwatywami lateksowymi?',
        answer: 'Na bazie wody lub silikonu',
        options: ['Na bazie oleju kokosowego', 'Na bazie wazeliny', 'Na bazie wody lub silikonu', 'Zwykły krem nawilżający do ciała'],
      },
      {
        text: 'Jak antybiotyki wpływają na florę bakteryjną pochwy?',
        answer: 'Mogą zaburzyć równowagę flory i wywołać grzybicę',
        options: ['Wyraźnie poprawiają florę bakteryjną pochwy', 'Mogą zaburzyć równowagę flory i wywołać grzybicę', 'Nie mają żadnego wpływu na florę pochwy', 'Skutecznie leczą infekcje grzybicze pochwy'],
      },
      {
        text: 'Co to jest PrEP?',
        answer: 'Codzienny lek zapobiegający zakażeniu HIV',
        options: ['Szczepionka na HPV podawana po kontakcie', 'Codzienny lek zapobiegający zakażeniu HIV', 'Antykoncepcja awaryjna dla kobiet', 'Domowy test wykrywający zakażenie HIV'],
      },
      {
        text: 'Jaki jest objaw pierwotny kiły (syfilisu)?',
        answer: 'Bezbolesny twardy wrzód w miejscu zakażenia',
        options: ['Ropna wydzielina z narządów płciowych', 'Swędzenie i pieczenie pochwy', 'Bezbolesny twardy wrzód w miejscu zakażenia', 'Wysypka krostkowa narządów płciowych'],
      },
      {
        text: 'Jaki jest problem z gonorrhea (rzeżączką) w XXI wieku?',
        answer: 'Narastająca oporność na antybiotyki',
        options: ['Nie istnieje skuteczna diagnostyka', 'Narastająca oporność na antybiotyki', 'Brak szczepionki i brak leczenia', 'Choroba sama ustępuje bez leczenia'],
      },
      {
        text: 'Do czego służy cytologia (wymaz Pap smear)?',
        answer: 'Wykrywanie zmian przedrakowych szyjki macicy',
        options: ['Badanie pH wydzieliny pochwy', 'Diagnoza infekcji grzybiczych pochwy', 'Wykrywanie zmian przedrakowych szyjki macicy', 'Kontrola poziomu hormonu ciążowego'],
      },
      {
        text: 'Jaką rolę pełnią probiotyki dla zdrowia pochwy?',
        answer: 'Wspomagają odbudowę flory i obniżają ryzyko infekcji',
        options: ['Całkowicie zastępują antybiotyki w leczeniu STI', 'Wspomagają odbudowę flory i obniżają ryzyko infekcji', 'Skutecznie leczą endometriozę', 'Nie mają udowodnionego wpływu na pochwę'],
      },

      // ── MÓZG I SEKS ─────────────────────────────────────────────────────────
      {
        text: 'Jaką rolę pełni podwzgórze w życiu seksualnym?',
        answer: 'Kontroluje wydzielanie hormonów płciowych',
        options: ['Przetwarza erotyczne bodźce wzrokowe', 'Kontroluje wydzielanie hormonów płciowych', 'Odpowiada za fizyczny wzwód', 'Jest centrum doznań zmysłowych'],
      },
      {
        text: 'Co to jest jądro półleżące (nucleus accumbens) i jakie ma znaczenie w seksie?',
        answer: 'Centrum nagrody aktywowane przez orgazm',
        options: ['Centrum bólu regulujące narządy płciowe', 'Centrum nagrody aktywowane przez orgazm', 'Część układu limbicznego odpowiedzialna za strach', 'Obszar kontrolujący ruch podczas stosunku'],
      },
      {
        text: 'Jaką rolę pełni wyspa (insula) podczas seksu?',
        answer: 'Przetwarza świadomość własnego ciała i intensywność wrażeń fizycznych',
        options: ['Kontroluje ruch mimowolny podczas orgazmu', 'Przetwarza świadomość własnego ciała i intensywność wrażeń fizycznych', 'Reguluje tętno i oddech podczas stosunku', 'Odpowiada za pamięć seksualnych doświadczeń'],
      },
      {
        text: 'Co to jest seksualny imprinting?',
        answer: 'Wczesne doświadczenia i środowisko kształtujące preferencje i pociągi seksualne',
        options: ['Genetycznie zakodowane preferencje seksualne', 'Wczesne doświadczenia i środowisko kształtujące preferencje i pociągi seksualne', 'Fizjologiczne uwarunkowanie orgazmu', 'Hormonalne programowanie płci w macicy'],
      },
      {
        text: 'Jak SSRIs (antydepresanty serotoninowe) wpływają na seksualność?',
        answer: 'Często redukują libido, opóźniają orgazm i mogą powodować anorgazmię',
        options: ['Zwiększają libido u kobiet z depresją', 'Często redukują libido, opóźniają orgazm i mogą powodować anorgazmię', 'Nie mają wpływu na seksualność', 'Powodują przedwczesny wytrysk'],
      },
      {
        text: 'Czy fantazje seksualne aktywują te same obszary mózgu co rzeczywisty seks?',
        answer: 'Tak – obszary wizualne, limbiczne i nagrody reagują podobnie',
        options: ['Nie – mózg wyraźnie odróżnia fikcję od rzeczywistości', 'Tak – obszary wizualne, limbiczne i nagrody reagują podobnie', 'Tylko u mężczyzn', 'Tylko wtedy gdy są bardzo realistyczne'],
      },
      {
        text: 'Co to jest HSDD (Hypoactive Sexual Desire Disorder)?',
        answer: 'Klinicznie niskie lub nieobecne pożądanie seksualne',
        options: ['Nadmierne, niekontrolowane pożądanie seksualne', 'Klinicznie niskie lub nieobecne pożądanie seksualne', 'Uporczywe zaburzenie erekcji', 'Ból odczuwany podczas stosunku'],
      },
      {
        text: 'Jak stres niszczy popęd seksualny na poziomie neurobiologicznym?',
        answer: 'Kortyzol hamuje oś podwzgórze-przysadka-gonady',
        options: ['Stres bezpośrednio uszkadza narządy płciowe', 'Kortyzol hamuje oś podwzgórze-przysadka-gonady', 'Adrenalina blokuje wrażliwość nerwową genitaliów', 'Stres nie ma udowodnionego wpływu na libido'],
      },
      {
        text: 'Jaka jest rola endorfin podczas seksu i orgazmu?',
        answer: 'Działają przeciwbólowo i wywołują euforię',
        options: ['Regulują poziom estrogenów we krwi', 'Powodują skurcze mięśni niezbędne do orgazmu', 'Działają przeciwbólowo i wywołują euforię', 'Są głównym neuroprzekaźnikiem pożądania'],
      },
      {
        text: 'Czy regularny seks wpływa na funkcje poznawcze?',
        answer: 'Badania sugerują poprawę pamięci i neurogenezę',
        options: ['Nie ma żadnych badań na ten temat', 'Pogarsza koncentrację z powodu hormonów', 'Badania sugerują poprawę pamięci i neurogenezę', 'Działa tak tylko u kobiet po 50. roku życia'],
      },
      {
        text: 'Co to jest warunkowanie seksualne (sexual conditioning)?',
        answer: 'Kojarzenie neutralnych bodźców z pobudzeniem',
        options: ['Genetyczne programowanie preferencji seksualnych', 'Terapia seksualna oparta na behawioryzmie', 'Kojarzenie neutralnych bodźców z pobudzeniem', 'Trening kontroli orgazmu w terapii par'],
      },
      {
        text: 'Jak uzależnienie od pornografii wpływa na mózg wg badań neuroobrazowania?',
        answer: 'Stępienie układu nagrody – potrzeba silniejszych bodźców',
        options: ['Trwałe uszkodzenie kory wzrokowej', 'Stępienie układu nagrody – potrzeba silniejszych bodźców', 'Nadaktywność obszarów odpowiedzialnych za pamięć', 'Zmniejszenie objętości hipokampa'],
      },
      {
        text: 'Co to jest neuroplastyczność a seksualność?',
        answer: 'Preferencje seksualne i podniecający repertuar mogą ewoluować pod wpływem nowych doświadczeń',
        options: ['Niezmienność orientacji seksualnej po ukształtowaniu', 'Preferencje seksualne i podniecający repertuar mogą ewoluować pod wpływem nowych doświadczeń', 'Zdolność mózgu do odczuwania wielu orgazmów', 'Mechanizm adaptacji do bólu seksualnego'],
      },
      {
        text: 'Jaka jest różnica między pożądaniem a pobudzeniem seksualnym na poziomie mózgu?',
        answer: 'Pożądanie – szlaki dopaminowe (chcenie); pobudzenie – aktywacja autonomiczna (lubienie/odczuwanie)',
        options: ['Są identyczne neurologicznie – to jedno i to samo', 'Pożądanie – szlaki dopaminowe (chcenie); pobudzenie – aktywacja autonomiczna (lubienie/odczuwanie)', 'Pożądanie zależy od hormonów, pobudzenie od nerwów sensorycznych', 'Różnią się tylko intensywnością, nie rodzajem'],
      },
      {
        text: 'Czy mózg może doświadczyć orgazmu bez fizycznej stymulacji genitalnej?',
        answer: 'Tak – np. nocne orgazmy lub orgazmy podczas hipnozy',
        options: ['Nie – orgazm wymaga bezwzględnie stymulacji fizycznej', 'Tak – np. nocne orgazmy lub orgazmy podczas hipnozy', 'Tylko u kobiet, nie u mężczyzn', 'Jedynie u osób z zaburzeniami neurologicznymi'],
      },

      // ── DODATKOWE FAKTY ──────────────────────────────────────────────────────
      {
        text: 'Co to jest libido?',
        answer: 'Popęd seksualny napędzany hormonami i psychiką',
        options: ['Hormon produkowany wyłącznie przez jajniki', 'Popęd seksualny napędzany hormonami i psychiką', 'Zdolność do osiągania orgazmu', 'Poziom nawilżenia pochwy przy pobudzeniu'],
      },
      {
        text: 'Który nerw jest głównym "nerwem przyjemności" narządów płciowych u obu płci?',
        answer: 'Nerw sromowy (nervus pudendus)',
        options: ['Nerw błędny (vagus)', 'Nerw sromowy (nervus pudendus)', 'Nerw biodrowy', 'Nerw kulszowy'],
      },
      {
        text: 'Jak wiele procent par doświadcza tzw. "desire discrepancy" (różnic w popędzie seksualnym)?',
        answer: 'Ponad 80% par',
        options: ['Około 10% par', 'Około 30% par', 'Ponad 80% par', 'Poniżej 5% par'],
      },
      {
        text: 'Ile wynosi typowy obwód pochwy w spoczynku?',
        answer: 'Około 5–7 cm',
        options: ['Około 1 cm', 'Około 3 cm', 'Około 5–7 cm', 'Ponad 15 cm'],
      },
      {
        text: 'Co to jest oksytocyna i dlaczego nazywana jest "hormonem przytulania"?',
        answer: 'Hormon wydzielany przy dotyku, orgazmie i karmieniu',
        options: ['Hormon wydzielany wyłącznie podczas ciąży', 'Hormon wydzielany przy dotyku, orgazmie i karmieniu', 'Neuroprzekaźnik napędzający pożądanie seksualne', 'Enzym regulujący nawilżenie pochwy'],
      },
      {
        text: 'Ile procent par stosuje regularnie jakąś formę antykoncepcji?',
        answer: 'Około 57% par',
        options: ['Około 10% par', 'Około 35% par', 'Około 57% par', 'Ponad 90% par'],
      },
      {
        text: 'Jak długo trwa ejakulacja (sam akt wyrzutu nasienia) u mężczyzny?',
        answer: 'Kilka sekund (zwykle 3–10)',
        options: ['Zaledwie ułamek sekundy', 'Kilka sekund (zwykle 3–10)', 'Około jednej minuty', 'Tak długo jak orgazm – 3–15 sekund'],
      },
      {
        text: 'Co to jest menstruacja retrograde (wsteczna miesiączka)?',
        answer: 'Krew miesiączkowa cofa się przez jajowody do otrzewnej',
        options: ['Miesiączka trwająca ponad 10 dni', 'Brak krwawienia mimo trwającego cyklu', 'Krew miesiączkowa cofa się przez jajowody do otrzewnej', 'Nieregularne, nieprzewidywalne miesiączkowanie'],
      },
      {
        text: 'Ile plemników zdrowego mężczyzny jest morfologicznie "normalnych" wg WHO?',
        answer: 'Wystarczy 4% prawidłowych',
        options: ['Co najmniej 90%', 'Co najmniej 50%', 'Co najmniej 20%', 'Wystarczy 4% prawidłowych'],
      },
      {
        text: 'Co to jest ginekomastia?',
        answer: 'Powiększenie tkanki gruczołowej piersi u mężczyzn',
        options: ['Złośliwy rak piersi u mężczyzn', 'Powiększenie tkanki gruczołowej piersi u mężczyzn', 'Nadmiar estrogenów powodujący impotencję', 'Stan zapalny piersi u kobiet po porodzie'],
      },
      {
        text: 'Co to jest refleks erekcji (reflex erection) vs psychogenna erekcja?',
        answer: 'Refleksowa – wywołana fizycznym dotykiem; psychogenna – wywołana myślami i fantazjami',
        options: ['Obydwa typy są identyczne neurologicznie', 'Refleksowa – wywołana fizycznym dotykiem; psychogenna – wywołana myślami i fantazjami', 'Psychogenna dotyczy tylko kobiet', 'Refleksowa erekcja nie istnieje u dorosłych'],
      },
      {
        text: 'Jak wiek wpływa na refrakcję (czas między orgazmami) u mężczyzn?',
        answer: 'Wydłuża się z wiekiem – od minut do nawet doby',
        options: ['Skraca się z wiekiem dzięki doświadczeniu', 'Wydłuża się z wiekiem – od minut do nawet doby', 'Pozostaje stała przez całe życie', 'Zależy wyłącznie od diety, nie od wieku'],
      },
      {
        text: 'Ile kosztuje energetycznie jeden spermatogon (komórka macierzysta plemnika) na drodze do gotowego plemnika?',
        answer: 'Dojrzewanie trwa 64–74 dni; organizm tworzy ~1500/s',
        options: ['Każdy jest produkowany osobno w ciągu 1 dnia', 'Dojrzewanie trwa 64–74 dni; organizm tworzy ~1500/s', 'Produkcja jest jednorazowa – zasoby na całe życie', 'Jeden cykl trwa 7 dni i daje 1 mln komórek'],
      },
    ],
  },
  {
    id: 'stats',
    name: '📊 Statystyki łóżkowe',
    description: 'Ile, jak często i jak długo – seks w liczbach',
    color: '#a78bfa',
    border: 'rgba(167,139,250,0.5)',
    bg: 'rgba(167,139,250,0.07)',
    questions: [
      // ── CZĘSTOTLIWOŚĆ ────────────────────────────────────────────────────────
      {
        text: 'Ile razy tygodniowo przeciętna para w stałym związku uprawia seks?',
        answer: '1–2 razy',
        options: ['Codziennie', '3–4 razy', '1–2 razy', 'Raz na miesiąc'],
      },
      {
        text: 'Według sondaży Durex – który kraj ma statystycznie największą częstotliwość seksu tygodniowo?',
        answer: 'Grecja',
        options: ['Brazylia', 'Francja', 'Grecja', 'USA'],
      },
      {
        text: 'Ile razy rocznie przeciętny dorosły Europejczyk uprawia seks?',
        answer: 'Około 54 razy rocznie',
        options: ['Około 5 razy', 'Około 20 razy', 'Około 54 razy rocznie', 'Ponad 300 razy'],
      },
      {
        text: 'W jakim dniu tygodnia Europejczycy najczęściej uprawiają seks wg badań?',
        answer: 'Sobota',
        options: ['Piątek', 'Sobota', 'Niedziela', 'Środa'],
      },
      {
        text: 'O której godzinie najczęściej odbywa się stosunek seksualny?',
        answer: 'Między 22:00 a 23:00',
        options: ['Między 6:00 a 8:00', 'Między 14:00 a 16:00', 'Między 22:00 a 23:00', 'Między 2:00 a 4:00'],
      },
      {
        text: 'Jak zmienia się częstotliwość seksu po urodzeniu pierwszego dziecka?',
        answer: 'Spada o ok. 40% w pierwszym roku po porodzie',
        options: ['Nie zmienia się znacząco', 'Rośnie – para spędza więcej czasu razem', 'Spada o ok. 40% w pierwszym roku po porodzie', 'Całkowicie zanika na 2 lata'],
      },
      {
        text: 'Ile procent par w długim związku deklaruje seks rzadziej niż raz w miesiącu?',
        answer: 'Około 15–20%',
        options: ['Poniżej 1%', 'Około 5%', 'Około 15–20%', 'Ponad 60%'],
      },
      {
        text: 'Jak pandemia COVID-19 wpłynęła globalnie na aktywność seksualną par?',
        answer: 'U większości spadek – z powodu stresu i zmęczenia',
        options: ['Wzrost aktywności u prawie wszystkich par', 'U większości spadek – z powodu stresu i zmęczenia', 'Brak wpływu – aktywność była identyczna', 'Zmianę zauważyły tylko pary bez dzieci'],
      },
      {
        text: 'Ile procent singli uprawia seks regularnie (co najmniej raz w miesiącu)?',
        answer: 'Około 20–30%',
        options: ['Prawie wszyscy – ~90%', 'Około 60%', 'Około 20–30%', 'Poniżej 5%'],
      },
      {
        text: 'Ile czasu w ciągu dorosłego życia przeciętna osoba spędza uprawiając seks?',
        answer: 'Około 1%',
        options: ['Około 10%', 'Około 5%', 'Około 1%', 'Mniej niż 0,1%'],
      },

      // ── CZAS TRWANIA ─────────────────────────────────────────────────────────
      {
        text: 'Ile trwa penetracja mierzona stoperem wg badania BJUI 2005?',
        answer: '5,4 minuty',
        options: ['1 minuta', '5,4 minuty', '20 minut', '45 minut'],
      },
      {
        text: 'Co seksuolodzy uznają za "za krótko" w czasie trwania penetracji?',
        answer: 'Poniżej 1–2 minut',
        options: ['Poniżej 1–2 minut', 'Poniżej 10 minut', 'Poniżej 30 minut', 'Seksuolodzy nie wyznaczają minimów'],
      },
      {
        text: 'Co seksuolodzy uznają za "odpowiednio długo" w czasie trwania penetracji?',
        answer: '3–7 minut',
        options: ['30 sekund–1 minuta', '3–7 minut', '20–30 minut', 'Ponad godzina'],
      },
      {
        text: 'Co seksuolodzy uznają za "pożądany" czas trwania stosunku?',
        answer: '7–13 minut',
        options: ['2–3 minuty', '7–13 minut', '30–45 minut', 'Ponad 1,5 godziny'],
      },
      {
        text: 'Ile trwa typowe preludium (foreplay) wg badań par heteroseksualnych?',
        answer: 'Około 11–20 minut',
        options: ['Mniej niż 1 minuta', 'Około 3–5 minut', 'Około 11–20 minut', 'Ponad 1 godzina'],
      },
      {
        text: 'Ile trwa typowa sesja seksualna łącznie z preludium?',
        answer: 'Około 30–45 minut',
        options: ['Około 3 minut', 'Około 10 minut', 'Około 30–45 minut', 'Ponad 2 godziny'],
      },
      {
        text: 'Jak SSRI (antydepresanty serotoninowe) wpływają na czas do wytrysku?',
        answer: 'Znacznie go wydłużają',
        options: ['Wyraźnie skracają czas do wytrysku', 'Nie mają żadnego wpływu', 'Znacznie go wydłużają', 'Całkowicie blokują wytrysk'],
      },
      {
        text: 'Ile procent mężczyzn doświadcza przedwczesnego wytrysku (czas penetracji < 2 min)? (ISSM)',
        answer: 'Około 20–30%',
        options: ['Poniżej 1%', 'Około 5%', 'Około 20–30%', 'Ponad 60%'],
      },

      // ── ORGAZM W LICZBACH ────────────────────────────────────────────────────
      {
        text: 'Jaki procent kobiet regularnie osiąga orgazm podczas seksu z partnerem?',
        answer: 'Około 65%',
        options: ['Około 20%', 'Około 40%', 'Około 65%', 'Ponad 95%'],
      },
      {
        text: 'Jaki procent mężczyzn regularnie osiąga orgazm podczas seksu z partnerem?',
        answer: 'Około 95%',
        options: ['Około 50%', 'Około 70%', 'Około 85%', 'Około 95%'],
      },
      {
        text: 'Jaki procent kobiet regularnie osiąga orgazm wyłącznie podczas stosunku penetracyjnego?',
        answer: 'Około 18–25%',
        options: ['Poniżej 5%', 'Około 18–25%', 'Około 50%', 'Ponad 75%'],
      },
      {
        text: 'Ile procent kobiet przyznaje, że symuluje orgazm?',
        answer: 'Ponad 50%',
        options: ['Około 5%', 'Około 20%', 'Około 35%', 'Ponad 50%'],
      },
      {
        text: 'Ile procent mężczyzn przyznaje, że symuluje orgazm?',
        answer: 'Około 25–28%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–28%', 'Ponad 60%'],
      },
      {
        text: 'Jak duże jest "orgasm gap" między kobietami lesbijkami a heteroseksualnymi?',
        answer: 'Lesbijki ~86% vs heteroseksualne kobiety ~65%',
        options: ['Brak różnicy – obie grupy około 65%', 'Lesbijki ~86% vs heteroseksualne kobiety ~65%', 'Heteroseksualne kobiety osiągają orgazm częściej', 'Różnica wynosi zaledwie 2%'],
      },
      {
        text: 'W jakiej pozycji kobiety najczęściej osiągają orgazm wg badań?',
        answer: 'Jeździec (cowgirl)',
        options: ['Misjonarz', 'Doggy style', 'Jeździec (cowgirl)', 'Łyżeczka'],
      },
      {
        text: 'Ile minut stymulacji potrzebuje przeciętna kobieta do osiągnięcia orgazmu?',
        answer: '13–15 minut',
        options: ['1–2 minuty', '5–7 minut', '13–15 minut', 'Ponad 45 minut'],
      },
      {
        text: 'Ile procent kobiet osiąga orgazm wyłącznie ze stymulacji łechtaczki (bez penetracji)?',
        answer: 'Ponad 70%',
        options: ['Około 5%', 'Około 25%', 'Około 50%', 'Ponad 70%'],
      },
      {
        text: 'Jak masturbacja wpływa na zdolność do osiągania orgazmu z partnerem?',
        answer: 'Zwiększa szansę na orgazm z partnerem',
        options: ['Zmniejsza wrażliwość na dotyk partnera', 'Nie ma żadnego wpływu na orgazm', 'Zwiększa szansę na orgazm z partnerem', 'Zmniejsza szansę na orgazm z partnerem'],
      },
      {
        text: 'Jaki procent kobiet twierdzi, że doświadczyła orgazmu wielokrotnego?',
        answer: 'Około 43%',
        options: ['Około 3%', 'Około 15%', 'Około 43%', 'Ponad 90%'],
      },

      // ── PARTNERZY SEKSUALNI ──────────────────────────────────────────────────
      {
        text: 'Jaka jest średnia liczba partnerów seksualnych w życiu u kobiet w krajach zachodnich?',
        answer: 'Około 7–8',
        options: ['Około 1–2', 'Około 4–5', 'Około 7–8', 'Ponad 20'],
      },
      {
        text: 'Jaka jest średnia liczba partnerów seksualnych w życiu u mężczyzn w krajach zachodnich?',
        answer: 'Około 7–10',
        options: ['Około 1–2', 'Około 4–5', 'Około 7–10', 'Ponad 50'],
      },
      {
        text: 'Ile procent dorosłych miało w życiu tylko jednego partnera seksualnego?',
        answer: 'Około 20–25%',
        options: ['Poniżej 1%', 'Około 5%', 'Około 20–25%', 'Ponad 60%'],
      },
      {
        text: 'Dlaczego mężczyźni statystycznie podają wyższe liczby partnerów niż kobiety?',
        answer: 'Mężczyźni zawyżają, a kobiety zaniżają liczby',
        options: ['Bo faktycznie mają więcej partnerów', 'Mężczyźni zawyżają, a kobiety zaniżają liczby', 'Bo inaczej rozumieją pojęcie "partner"', 'To mit – podają identyczne liczby'],
      },
      {
        text: 'Ile procent dorosłych miało więcej niż 10 partnerów seksualnych?',
        answer: 'Około 20–30%',
        options: ['Poniżej 1%', 'Około 5%', 'Około 20–30%', 'Ponad 70%'],
      },
      {
        text: 'Jaki procent dorosłych przyznaje się do relacji pozamałżeńskiej (zdrady)?',
        answer: 'Około 15–25%',
        options: ['Poniżej 1%', 'Około 5%', 'Około 15–25%', 'Ponad 60%'],
      },
      {
        text: 'Ile procent pierwszych stosunków odbywa się jako "przypadkowy seks" (one-night stand)?',
        answer: 'Około 30–40%',
        options: ['Poniżej 5%', 'Około 15%', 'Około 30–40%', 'Ponad 80%'],
      },
      {
        text: 'Ile procent randek przez aplikacje (Tinder, Bumble) prowadzi do kontaktu seksualnego?',
        answer: 'Około 30–40%',
        options: ['Poniżej 5%', 'Około 15%', 'Około 30–40%', 'Prawie 100%'],
      },

      // ── WIEK INICJACJI ───────────────────────────────────────────────────────
      {
        text: 'W jakim wieku statystyczna Polka inicjuje życie seksualne? (CBOS)',
        answer: 'Około 18 lat',
        options: ['Około 14 lat', 'Około 16 lat', 'Około 18 lat', 'Około 22 lata'],
      },
      {
        text: 'W jakim wieku statystyczny Polak inicjuje życie seksualne? (CBOS)',
        answer: 'Około 17–18 lat',
        options: ['Około 13–14 lat', 'Około 15–16 lat', 'Około 17–18 lat', 'Około 21–22 lata'],
      },
      {
        text: 'Które kraje mają statystycznie najniższy wiek inicjacji seksualnej?',
        answer: 'Islandia i kraje skandynawskie',
        options: ['Francja i Włochy', 'Islandia i kraje skandynawskie', 'Brazylia i Argentyna', 'USA i Kanada'],
      },
      {
        text: 'W jakim wieku kobiety mają statystycznie największe libido wg badań?',
        answer: 'W okolicach 27–33 lat',
        options: ['W wieku 18–20 lat', 'W okolicach 27–33 lat', 'W okolicach 45–50 lat', 'Libido jest stałe przez całe życie'],
      },
      {
        text: 'Jak wiek inicjacji koreluje z późniejszą liczbą partnerów?',
        answer: 'Wcześniejsza inicjacja = statystycznie więcej partnerów',
        options: ['Nie ma między nimi żadnej korelacji', 'Wcześniejsza inicjacja = statystycznie więcej partnerów', 'Późniejsza inicjacja = więcej partnerów', 'Wiek inicjacji wpływa tylko na płeć partnera'],
      },
      {
        text: 'Jaki procent nastolatków 15-letnich w Polsce jest aktywnych seksualnie?',
        answer: 'Około 10–15%',
        options: ['Poniżej 1%', 'Około 10–15%', 'Około 50%', 'Ponad 70%'],
      },

      // ── POZYCJE I PREFERENCJE ────────────────────────────────────────────────
      {
        text: 'Jaka pozycja seksualna jest najczęściej wybierana na świecie?',
        answer: 'Misjonarz',
        options: ['Jeździec', 'Doggy style', 'Misjonarz', 'Łyżeczka'],
      },
      {
        text: 'Ile procent par regularnie eksperymentuje z nowymi pozycjami seksualnymi?',
        answer: 'Około 50%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 50%', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Ile procent dorosłych uprawiało seks w samochodzie?',
        answer: 'Około 55–65%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 55–65%', 'Prawie wszyscy'],
      },
      {
        text: 'Ile procent par regularnie praktykuje elementy BDSM (wiązanie, dominacja)?',
        answer: 'Około 5–10% regularnie',
        options: ['Poniżej 0,5% dorosłych', 'Około 5–10% regularnie', 'Ponad 60% dorosłych', 'Wyłącznie mężczyźni praktykują BDSM'],
      },
      {
        text: 'Ile procent dorosłych przyznaje się do odgrywania ról (role-playing) w seksie?',
        answer: 'Około 30–40%',
        options: ['Poniżej 2%', 'Około 10%', 'Około 30–40%', 'Ponad 80%'],
      },
      {
        text: 'Ile procent dorosłych przyznaje się do seksu w miejscu publicznym?',
        answer: 'Około 30–35%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–35%', 'Ponad 70%'],
      },
      {
        text: 'Jaka jest najpopularniejsza fantazja seksualna na świecie wg badań Justin Lehmiller (2018)?',
        answer: 'Seks wieloosobowy (grupowy)',
        options: ['BDSM i dominacja', 'Seks ze znanym celebrytą', 'Seks wieloosobowy (grupowy)', 'Transwestytyzm'],
      },
      {
        text: 'Ile procent kobiet przyznaje, że fantazjuje podczas stosunku z partnerem?',
        answer: 'Około 60–70%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 60–70%', 'Prawie 100%'],
      },
      {
        text: 'Ile kalorii spala przeciętny stosunek seksualny? (PLoS ONE 2013)',
        answer: 'Około 69–100 kcal',
        options: ['Około 5 kcal', 'Około 30 kcal', 'Około 69–100 kcal', 'Ponad 400 kcal'],
      },

      // ── MASTURBACJA ──────────────────────────────────────────────────────────
      {
        text: 'Ile procent mężczyzn masturbuje się regularnie?',
        answer: 'Około 80–90%',
        options: ['Około 10%', 'Około 40%', 'Około 80–90%', '100%'],
      },
      {
        text: 'Ile procent kobiet masturbuje się regularnie (przynajmniej raz w miesiącu)?',
        answer: 'Około 50–60%',
        options: ['Około 5%', 'Około 25%', 'Około 50–60%', 'Ponad 95%'],
      },
      {
        text: 'Ile procent kobiet nigdy nie masturbowało się?',
        answer: 'Około 25–30%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–30%', 'Ponad 70%'],
      },
      {
        text: 'Ile procent mężczyzn nigdy nie masturbowało się?',
        answer: 'Około 5–10%',
        options: ['Poniżej 0,1%', 'Około 5–10%', 'Około 30%', 'Ponad 50%'],
      },
      {
        text: 'W jakim wieku typowo mężczyźni zaczynają masturbować się?',
        answer: 'Zwykle 12–14 lat',
        options: ['6–8 lat', 'Zwykle 12–14 lat', '18–20 lat', 'Dopiero po inicjacji seksualnej'],
      },
      {
        text: 'W jakim wieku typowo kobiety zaczynają masturbować się?',
        answer: 'Zwykle 13–16 lat',
        options: ['6–8 lat', 'Zwykle 13–16 lat', 'Dopiero po inicjacji seksualnej', 'Nie ma typowego wieku – bardzo zróżnicowany'],
      },
      {
        text: 'Ile procent kobiet używa wibratora podczas masturbacji?',
        answer: 'Około 52–60%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 52–60%', 'Prawie wszystkie'],
      },
      {
        text: 'Jak często przeciętny mężczyzna masturbuje się?',
        answer: 'Około 1–3 razy tygodniowo',
        options: ['Raz na miesiąc', 'Raz w tygodniu', 'Około 1–3 razy tygodniowo', 'Kilka razy dziennie'],
      },

      // ── SEKS ORALNY I ANALNY ─────────────────────────────────────────────────
      {
        text: 'Ile procent dorosłych uprawiało kiedykolwiek seks oralny?',
        answer: 'Około 75–80%',
        options: ['Około 10%', 'Około 40%', 'Około 75–80%', 'Prawie 100%'],
      },
      {
        text: 'Jaki procent kobiet osiąga orgazm podczas seksu oralnego?',
        answer: 'Około 80%',
        options: ['Około 10%', 'Około 35%', 'Około 80%', 'Prawie wszystkie – ~99%'],
      },
      {
        text: 'Ile procent dorosłych przyznało się do seksu analnego?',
        answer: 'Około 30–35%',
        options: ['Poniżej 5%', 'Około 15%', 'Około 30–35%', 'Ponad 70%'],
      },
      {
        text: 'Ile procent kobiet twierdzi, że regularnie osiąga orgazm podczas seksu analnego?',
        answer: 'Około 17%',
        options: ['Poniżej 1%', 'Około 17%', 'Około 50%', 'Prawie wszystkie'],
      },
      {
        text: 'Ile procent par regularnie uprawia wzajemny seks oralny?',
        answer: 'Około 60–65%',
        options: ['Około 5%', 'Około 25%', 'Około 60–65%', 'Prawie wszystkie pary'],
      },
      {
        text: 'Ile procent par stosuje lubrykanty seksualne?',
        answer: 'Około 30–40%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–40%', 'Prawie wszystkie pary'],
      },
      {
        text: 'Jaki stosunek kobiet inicjuje seks oralny u partnera?',
        answer: 'Około 50–55%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 50–55%', 'Prawie wszystkie'],
      },

      // ── PORNOGRAFIA ──────────────────────────────────────────────────────────
      {
        text: 'Ile procent mężczyzn regularnie ogląda pornografię?',
        answer: 'Około 70%',
        options: ['Około 10%', 'Około 30%', 'Około 70%', 'Prawie 100%'],
      },
      {
        text: 'Ile procent kobiet regularnie ogląda pornografię?',
        answer: 'Około 30–35%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–35%', 'Tyle samo co mężczyźni – ~70%'],
      },
      {
        text: 'Ile odwiedzin miesięcznie notuje serwis Pornhub?',
        answer: 'Ponad 5 miliardów miesięcznie',
        options: ['Kilkadziesiąt tysięcy', 'Kilka milionów', 'Kilkaset milionów', 'Ponad 5 miliardów miesięcznie'],
      },
      {
        text: 'Ile procent nastolatków 13–17-letnich oglądało pornografię wg badań brytyjskich?',
        answer: 'Ponad 70%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 50%', 'Ponad 70%'],
      },
      {
        text: 'Jak regularne oglądanie pornografii wpływa na satysfakcję seksualną w związku?',
        answer: 'U części par wiąże się ze spadkiem satysfakcji',
        options: ['Zawsze poprawia satysfakcję w związku', 'U części par wiąże się ze spadkiem satysfakcji', 'Nie ma żadnego związku z satysfakcją', 'Zawsze niszczy każdy związek'],
      },
      {
        text: 'Jaka jest najpopularniejsza kategoria pornografii wśród kobiet wg danych Pornhub?',
        answer: '"Lesbian" i "romantic"',
        options: ['"Hardcore" i "gangbang"', '"Lesbian" i "romantic"', '"BDSM" i "bondage"', '"Amateur" i "casting"'],
      },

      // ── ZABAWKI EROTYCZNE ────────────────────────────────────────────────────
      {
        text: 'Ile procent kobiet regularnie używa wibratora lub gadżetu erotycznego?',
        answer: 'Około 52%',
        options: ['Około 5%', 'Około 20%', 'Około 52%', 'Ponad 90%'],
      },
      {
        text: 'Ile procent par używa zabawek erotycznych razem podczas seksu?',
        answer: 'Około 25–30%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–30%', 'Ponad 80%'],
      },
      {
        text: 'Ile wynosi globalny rynek sex toys rocznie (szacunki 2023)?',
        answer: 'Ponad 30 miliardów USD',
        options: ['Kilka milionów USD', 'Około 500 milionów USD', 'Około 5 miliardów USD', 'Ponad 30 miliardów USD'],
      },
      {
        text: 'W jakim roku sprzedaż zabawek erotycznych online gwałtownie wzrosła?',
        answer: '2020 – podczas lockdownów pandemii COVID-19',
        options: ['1998 – po rewolucji internetu', '2007 – wraz z rozwojem smartfonów', '2020 – podczas lockdownów pandemii COVID-19', '2023 – po TikToku'],
      },
      {
        text: 'Ile procent kobiet, które używają wibratorów, łatwiej osiąga orgazm niż bez nich?',
        answer: 'Ponad 90%',
        options: ['Około 20%', 'Około 50%', 'Około 70%', 'Ponad 90%'],
      },

      // ── ANTYKONCEPCJA ────────────────────────────────────────────────────────
      {
        text: 'Jaka jest najczęściej stosowana metoda antykoncepcji na świecie?',
        answer: 'Sterylizacja żeńska',
        options: ['Prezerwatywa', 'Pigułka hormonalna', 'Sterylizacja żeńska', 'Wkładka domaciczna (IUD)'],
      },
      {
        text: 'Ile procent ciąż na świecie jest nieplanowanych wg WHO?',
        answer: 'Około 45%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 45%', 'Ponad 80%'],
      },
      {
        text: 'Jak skuteczna jest prezerwatywa przy prawidłowym i konsekwentnym stosowaniu?',
        answer: '98%',
        options: ['Około 50%', 'Około 75%', '98%', '100%'],
      },
      {
        text: 'Jak skuteczna jest pigułka antykoncepcyjna przy prawidłowym stosowaniu (perfect use)?',
        answer: '99,7%',
        options: ['Około 70%', 'Około 85%', 'Około 95%', '99,7%'],
      },
      {
        text: 'Ile procent kobiet w Polsce stosuje pigułkę antykoncepcyjną?',
        answer: 'Około 25–30%',
        options: ['Poniżej 2%', 'Około 10%', 'Około 25–30%', 'Ponad 70%'],
      },
      {
        text: 'Ile procent kobiet stosujących pigułkę skarży się na obniżone libido?',
        answer: 'Około 15–20%',
        options: ['Poniżej 1%', 'Około 5%', 'Około 15–20%', 'Ponad 60%'],
      },
      {
        text: 'Jak skuteczna jest wkładka domaciczna (IUD) jako metoda antykoncepcji?',
        answer: 'Ponad 99%',
        options: ['Około 70%', 'Około 85%', 'Około 95%', 'Ponad 99%'],
      },

      // ── ZDROWIE SEKSUALNE W LICZBACH ─────────────────────────────────────────
      {
        text: 'Co jest najpowszechniejszym STI na świecie?',
        answer: 'HPV',
        options: ['Chlamydia', 'Kiła (syfilis)', 'HPV', 'HIV'],
      },
      {
        text: 'Ile nowych zakażeń HIV notuje się rocznie na świecie?',
        answer: 'Około 1,5 miliona',
        options: ['Kilkaset tysięcy', 'Około 1,5 miliona', 'Około 50 milionów', 'Ponad 200 milionów'],
      },
      {
        text: 'Ile osób na świecie żyje aktualnie z HIV?',
        answer: 'Około 39 milionów',
        options: ['Kilkaset tysięcy', 'Około 5 milionów', 'Około 39 milionów', 'Ponad 500 milionów'],
      },
      {
        text: 'Ile procent osób chorych na chlamydię nie ma żadnych objawów?',
        answer: 'Około 70–80%',
        options: ['Poniżej 5%', 'Około 30%', 'Około 70–80%', 'Prawie wszystkie – ~99%'],
      },
      {
        text: 'W jakim przedziale wiekowym najczęściej diagnozuje się chlamydię?',
        answer: '15–24 lata',
        options: ['0–14 lat', '15–24 lata', '35–45 lat', 'Powyżej 65 lat'],
      },
      {
        text: 'Ile procent przypadków HIV na świecie przenosi się drogą seksualną?',
        answer: 'Około 80%',
        options: ['Około 10%', 'Około 40%', 'Około 80%', 'Prawie 100%'],
      },
      {
        text: 'Jaki procent kobiet na świecie doświadczyło przemocy seksualnej? (WHO)',
        answer: 'Około 27–30%',
        options: ['Poniżej 1%', 'Około 5%', 'Około 27–30%', 'Ponad 70%'],
      },
      {
        text: 'Ile procent zakażeń HPV ustępuje samoistnie w ciągu 2 lat?',
        answer: 'Około 90%',
        options: ['Około 10%', 'Około 40%', 'Około 70%', 'Około 90%'],
      },

      // ── SEKS A ZDROWIE ───────────────────────────────────────────────────────
      {
        text: 'Ile ejakulacji miesięcznie u mężczyzn koreluje z niższym ryzykiem raka prostaty? (Giovannucci 2004)',
        answer: '≥ 21 ejakulacji miesięcznie',
        options: ['1–2 ejakulacje miesięcznie', '5–7 ejakulacji miesięcznie', '≥ 21 ejakulacji miesięcznie', 'Brak ejakulacji – celibat chroni prostatę'],
      },
      {
        text: 'Jak seks uprawiany 2× tygodniowo wpływa na układ sercowo-naczyniowy? (Am. J. Cardiology)',
        answer: 'Zmniejsza ryzyko zawału serca u mężczyzn',
        options: ['Zwiększa ryzyko zawału z powodu obciążenia serca', 'Nie ma żadnego wpływu na serce', 'Zmniejsza ryzyko zawału serca u mężczyzn', 'Poprawia pracę serca tylko u kobiet'],
      },
      {
        text: 'Jak orgazm wpływa na jakość snu?',
        answer: 'Uwalnia hormony ułatwiające zasypianie',
        options: ['Utrudnia zasypianie z powodu adrenaliny', 'Nie ma żadnego wpływu na sen', 'Uwalnia hormony ułatwiające zasypianie', 'Skraca czas zasypiania tylko u mężczyzn'],
      },
      {
        text: 'O ile podnosi się poziom immunoglobuliny A (IgA) przy seksie 1–2× tygodniowo? (Wilkes Univ.)',
        answer: 'O około 30%',
        options: ['Spada – wysiłek osłabia odporność', 'O około 5%', 'O około 30%', 'Ponad 10-krotnie'],
      },
      {
        text: 'Jaki procent osób z migreną doświadcza jej złagodzenia podczas seksu/orgazmu?',
        answer: 'Około 60%',
        options: ['Poniżej 1%', 'Około 20%', 'Około 60%', 'Seks zawsze nasila ból głowy'],
      },
      {
        text: 'Jak seks wpływa na poziom kortyzolu (hormonu stresu)?',
        answer: 'Po stosunku poziom kortyzolu i ciśnienie krwi istotnie spadają',
        options: ['Podnosi kortyzol z powodu wysiłku fizycznego', 'Nie zmienia poziomu kortyzolu', 'Po stosunku poziom kortyzolu i ciśnienie krwi istotnie spadają', 'Wpływa tylko na adrenalinę, nie kortyzol'],
      },
      {
        text: 'Ile kalorii spala przeciętna para rocznie uprawiając seks?',
        answer: 'Około 5 000–6 000 kcal',
        options: ['Około 100 kcal', 'Około 500 kcal', 'Około 5 000–6 000 kcal', 'Ponad 50 000 kcal'],
      },

      // ── ZWIĄZKI I SEKS ───────────────────────────────────────────────────────
      {
        text: 'Ile procent par w długim związku jest zadowolonych ze swojego życia seksualnego?',
        answer: 'Około 50–60%',
        options: ['Poniżej 10%', 'Około 30%', 'Około 50–60%', 'Ponad 95%'],
      },
      {
        text: 'Jak długo trwa "etap miesiąca miodowego" wysokiej częstotliwości seksu?',
        answer: 'Około 1–2 lata od początku związku',
        options: ['Kilka tygodni', 'Około 1–2 lata od początku związku', 'Dokładnie 7 lat', 'Trwa przez cały czas trwania związku'],
      },
      {
        text: 'Co jest najczęstszą przyczyną problemów seksualnych w związkach wg terapeutów?',
        answer: 'Stres, zmęczenie i brak komunikacji',
        options: ['Poważne fizyczne problemy zdrowotne', 'Całkowity brak pociągu fizycznego', 'Stres, zmęczenie i brak komunikacji', 'Zbyt częste oglądanie pornografii'],
      },
      {
        text: 'Jak komunikacja seksualna w parze wpływa na satysfakcję?',
        answer: 'Otwarta komunikacja zwiększa satysfakcję o ~50%',
        options: ['Nie ma żadnego mierzalnego wpływu', 'Zmniejsza satysfakcję – "magia" zanika', 'Otwarta komunikacja zwiększa satysfakcję o ~50%', 'Wpływa wyłącznie na kobiety'],
      },
      {
        text: 'Do jakiej częstotliwości seksu wzrasta szczęście w związku, po czym plateau? (Muise et al. 2016)',
        answer: 'Raz w tygodniu – więcej nie zwiększa dalej szczęścia',
        options: ['Im więcej seksu, tym wyższe szczęście – bez plateau', 'Raz w tygodniu – więcej nie zwiększa dalej szczęścia', 'Trzy razy tygodniowo', 'Codziennie jest optymalne'],
      },
      {
        text: 'Ile procent par przyznaje się do otwartego związku (consensual non-monogamy)?',
        answer: 'Około 4–5%',
        options: ['Poniżej 0,1%', 'Około 4–5%', 'Około 30%', 'Ponad 50%'],
      },

      // ── MITY I FAKTY ────────────────────────────────────────────────────────
      {
        text: 'Czy mężczyźni myślą o seksie co 7 sekund?',
        answer: 'To mit – średnio około 19 razy dziennie',
        options: ['Tak – zostało to potwierdzone naukowo', 'To mit – średnio około 19 razy dziennie', 'Tak, ale tylko mężczyźni przed 30. rokiem życia', 'Tak, lecz tylko przy braku partnerki'],
      },
      {
        text: 'Ile procent kobiet ocenia swój pierwszy seks z nowym partnerem jako rozczarowujący?',
        answer: 'Około 55%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 55%', 'Prawie wszystkie – ~90%'],
      },
      {
        text: 'Czy seks przed zawodami sportowymi osłabia wyniki sportowe?',
        answer: 'Nie – badania nie wykazują wpływu na wyniki',
        options: ['Tak – znacząco osłabia siłę i wytrzymałość', 'Tak, ale efekt dotyczy tylko mężczyzn', 'Nie – badania nie wykazują wpływu na wyniki', 'Tak – zbyt mocno podwyższa testosteron'],
      },
      {
        text: 'Czy seks podczas menstruacji jest medycznie niebezpieczny?',
        answer: 'Nie – jest bezpieczny dla obojga partnerów',
        options: ['Tak – grozi poważnymi infekcjami', 'Tak – jest bolesny dla obu stron', 'Nie – jest bezpieczny dla obojga partnerów', 'Tak – uniemożliwia przyjemność seksualną'],
      },
      {
        text: 'Ile procent badanych kobiet deklaruje, że rozmiar penisa partnera nie ma dla nich znaczenia?',
        answer: 'Około 85%',
        options: ['Około 10%', 'Około 40%', 'Około 85%', 'Prawie 100%'],
      },
      {
        text: 'Ile procent dorosłych miało seks z kimś z pracy?',
        answer: 'Około 36–40%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 36–40%', 'Ponad 80%'],
      },
      {
        text: 'Jak edukacja seksualna w szkołach wpływa na statystyki STI i niechcianych ciąż?',
        answer: 'Kraje z kompleksową edukacją mają niższe wskaźniki STI i niechcianych ciąż',
        options: ['Edukacja seksualna zwiększa aktywność seksualną i STI', 'Kraje z kompleksową edukacją mają niższe wskaźniki STI i niechcianych ciąż', 'Edukacja seksualna nie wpływa na zachowania', 'Tylko abstynencyjna edukacja działa'],
      },
      {
        text: 'Ile procent dorosłych regularnie rozmawia z partnerem o swoich potrzebach seksualnych?',
        answer: 'Tylko około 40–50%',
        options: ['Prawie wszyscy – ~90%', 'Około 70%', 'Tylko około 40–50%', 'Poniżej 10%'],
      },

      // ── SATYSFAKCJA SEKSUALNA ────────────────────────────────────────────────
      {
        text: 'Jaki procent dorosłych deklaruje ogólne zadowolenie ze swojego życia seksualnego?',
        answer: 'Około 60–65%',
        options: ['Poniżej 10%', 'Około 30%', 'Około 60–65%', 'Ponad 95%'],
      },
      {
        text: 'Co jest najczęstszą przyczyną niezadowolenia seksualnego u kobiet?',
        answer: 'Trudności z osiąganiem orgazmu lub jego brak',
        options: ['Ból podczas stosunku', 'Trudności z osiąganiem orgazmu lub jego brak', 'Zbyt rzadki seks', 'Nieatrakcyjność partnera'],
      },
      {
        text: 'Co jest najczęstszą przyczyną niezadowolenia seksualnego u mężczyzn?',
        answer: 'Zaburzenia erekcji lub przedwczesny wytrysk',
        options: ['Brak pożądania', 'Zaburzenia erekcji lub przedwczesny wytrysk', 'Partnerka nie chce seksu', 'Zbyt częsty seks'],
      },
      {
        text: 'Ile procent kobiet deklaruje, że ich potrzeby seksualne są regularnie ignorowane przez partnera?',
        answer: 'Około 30–35%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–35%', 'Ponad 70%'],
      },
      {
        text: 'Ile procent dorosłych po 50. roku życia deklaruje satysfakcjonujące życie seksualne?',
        answer: 'Około 50–55%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 50–55%', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Jak samoocena własnego ciała wpływa na satysfakcję seksualną?',
        answer: 'Lepsza samoocena ciała = wyższa satysfakcja seksualna',
        options: ['Nie ma między nimi żadnego związku', 'Gorsza samoocena = lepsza koncentracja na partnerze', 'Lepsza samoocena ciała = wyższa satysfakcja seksualna', 'Wpływa tylko na libido, nie na satysfakcję'],
      },
      {
        text: 'Ile procent par deklaruje "rutynowy seks" bez szczególnego entuzjazmu?',
        answer: 'Około 40–50%',
        options: ['Poniżej 5%', 'Około 15%', 'Około 40–50%', 'Prawie wszystkie pary długoterminowe – ~90%'],
      },
      {
        text: 'Jak styl życia (ćwiczenia, dieta) wpływa na satysfakcję seksualną?',
        answer: 'Osoby aktywne fizycznie raportują wyższą satysfakcję',
        options: ['Brak związku między stylem życia a seksem', 'Ćwiczenia obniżają libido z powodu zmęczenia', 'Osoby aktywne fizycznie raportują wyższą satysfakcję', 'Dieta jest jedynym ważnym czynnikiem'],
      },
      {
        text: 'Jak długo po porodzie przeciętna para wznawia aktywność seksualną?',
        answer: 'Zwykle po 6–8 tygodniach',
        options: ['Już tydzień po porodzie', 'Około 2 tygodnie po porodzie', 'Zwykle po 6–8 tygodniach', 'Dopiero po 1. roku życia dziecka'],
      },
      {
        text: 'Jaki procent par uprawia "seks planowany" (np. wyznaczony dzień tygodnia)?',
        answer: 'Około 20–25% par',
        options: ['Poniżej 1% par', 'Około 20–25% par', 'Około 70% par', 'Prawie wszyscy w związkach 10+ lat'],
      },

      // ── SEKS NA ŚWIECIE ──────────────────────────────────────────────────────
      {
        text: 'Ile krajów na świecie nadal kryminalizuje kontakty homoseksualne? (ILGA 2023)',
        answer: 'Około 64 kraje',
        options: ['Żaden – homoseksualizm jest legalny wszędzie', 'Około 10 krajów', 'Około 64 kraje', 'Ponad 150 krajów'],
      },
      {
        text: 'W ilu krajach świata legalne jest małżeństwo jednopłciowe? (stan na 2024)',
        answer: 'Około 34 kraje',
        options: ['Tylko w 2–3 krajach', 'Około 10 krajów', 'Około 34 kraje', 'Ponad 100 krajów'],
      },
      {
        text: 'Ile procent kobiet na świecie doświadczyło przemocy seksualnej co najmniej raz w życiu?',
        answer: 'Około 27–30%',
        options: ['Poniżej 1%', 'Około 5%', 'Około 27–30%', 'Ponad 80%'],
      },
      {
        text: 'Jaki jest najniższy wiek przyzwolenia seksualnego w Europie (z pewnymi zastrzeżeniami)?',
        answer: '14 lat',
        options: ['10 lat', '14 lat', '18 lat w całej UE', '21 lat'],
      },
      {
        text: 'Jak religia wpływa na statystyki seksualne?',
        answer: 'Inicjują seksualnie później i mają mniej partnerów',
        options: ['Religia nie wpływa na zachowania seksualne', 'Osoby religijne mają więcej seksu – większe rodziny', 'Inicjują seksualnie później i mają mniej partnerów', 'Religia wpływa tylko na orientację seksualną'],
      },
      {
        text: 'Który kontynent ma globalnie najwyższy wskaźnik zakażeń HIV?',
        answer: 'Afryka Subsaharyjska',
        options: ['Azja Południowo-Wschodnia', 'Ameryka Łacińska', 'Afryka Subsaharyjska', 'Europa Wschodnia'],
      },
      {
        text: 'Ile procent gwałtów jest zgłaszanych organom ścigania?',
        answer: 'Około 10–15%',
        options: ['Prawie wszystkie – ~90%', 'Około 50%', 'Około 30%', 'Około 10–15%'],
      },
      {
        text: 'W których krajach stosunki pozamałżeńskie są nadal prawnie karane śmiercią?',
        answer: 'W niektórych krajach Bliskiego Wschodu i Azji',
        options: ['W żadnym kraju na świecie', 'Tylko w krajach Afryki Zachodniej', 'W niektórych krajach Bliskiego Wschodu i Azji', 'Wyłącznie w Ameryce Południowej'],
      },

      // ── ORIENTACJA I TOŻSAMOŚĆ ───────────────────────────────────────────────
      {
        text: 'Ile procent dorosłych identyfikuje się jako biseksualnych (kraje zachodnie)?',
        answer: 'Około 3–5%',
        options: ['Poniżej 0,1%', 'Około 3–5%', 'Około 25%', 'Ponad 50%'],
      },
      {
        text: 'Ile procent dorosłych identyfikuje się jako homoseksualni?',
        answer: 'Około 2–4%',
        options: ['Poniżej 0,1%', 'Około 2–4%', 'Około 20%', 'Ponad 40%'],
      },
      {
        text: 'Jak orientacja seksualna wpływa na satysfakcję seksualną?',
        answer: 'Przy akceptacji – satysfakcja podobna lub wyższa',
        options: ['Osoby LGB zawsze mają niższą satysfakcję', 'Brak jakichkolwiek różnic – płeć bez znaczenia', 'Przy akceptacji – satysfakcja podobna lub wyższa', 'Tylko heteroseksualiści osiągają pełną satysfakcję'],
      },
      {
        text: 'Jak Tinder i aplikacje randkowe wpłynęły na liczbę partnerów seksualnych?',
        answer: 'Aktywni użytkownicy mają więcej partnerów',
        options: ['Aplikacje zmniejszyły aktywność seksualną', 'Aktywni użytkownicy mają więcej partnerów', 'Brak mierzalnego wpływu na zachowania', 'Więcej partnerów dają tylko singlom 35+'],
      },

      // ── CIEKAWOSTKI W LICZBACH ───────────────────────────────────────────────
      {
        text: 'Jak pora roku wpływa na aktywność seksualną i liczbę urodzeń?',
        answer: 'Szczyt urodzeń wrzesień–październik sugeruje aktywność podczas świąt grudniowych',
        options: ['Lato to szczyt aktywności seksualnej – więcej dzieci rodzi się w marcu', 'Szczyt urodzeń wrzesień–październik sugeruje aktywność podczas świąt grudniowych', 'Pora roku nie ma żadnego wpływu na aktywność', 'Wiosna jest sezonem miłosnym – szczyt urodzeń w grudniu'],
      },
      {
        text: 'Ile procent dorosłych miało przygodę seksualną podczas podróży?',
        answer: 'Około 25–30%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–30%', 'Ponad 80%'],
      },
      {
        text: 'Ile procent singli na randkach oczekuje seksu po pierwszej randce?',
        answer: 'Około 20–25%',
        options: ['Prawie wszyscy – ~85%', 'Około 50%', 'Około 20–25%', 'Poniżej 1%'],
      },
      {
        text: 'Jak wykształcenie wpływa na satysfakcję seksualną?',
        answer: 'Wyższe wykształcenie = lepsza komunikacja i satysfakcja',
        options: ['Niższe wykształcenie = więcej spontaniczności i satysfakcji', 'Brak jakiegokolwiek związku', 'Wyższe wykształcenie = lepsza komunikacja i satysfakcja', 'Wykształcenie wpływa tylko na częstotliwość seksu'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek miało seks w wodzie (basen, morze, wanna)?',
        answer: 'Około 40–50%',
        options: ['Poniżej 2%', 'Około 15%', 'Około 40–50%', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek seksowało (seksting)?',
        answer: 'Około 60–70%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 60–70%', 'Prawie wszyscy – ~99%'],
      },
      {
        text: 'Jak zarobki wpływają na częstotliwość seksu?',
        answer: 'Wyższy dochód nieco zwiększa częstotliwość seksu',
        options: ['Zamożniejsi uprawiają seks 10x rzadziej – stres', 'Wyższy dochód nieco zwiększa częstotliwość seksu', 'Brak jakiegokolwiek związku', 'Biedniejsi uprawiają znacznie więcej seksu'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek uprawiało seks pod wpływem alkoholu?',
        answer: 'Ponad 70%',
        options: ['Poniżej 5%', 'Około 30%', 'Około 50%', 'Ponad 70%'],
      },
      {
        text: 'Ile procent stosunków seksualnych prowadzi do ciąży, gdy nie jest stosowana antykoncepcja?',
        answer: 'Około 20–25%',
        options: ['Prawie każdy stosunek – ~99%', 'Około 50%', 'Około 20–25%', 'Poniżej 1%'],
      },
      {
        text: 'Ile procent ciąż w Polsce jest nieplanowanych?',
        answer: 'Około 30–40%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–40%', 'Ponad 80%'],
      },
      {
        text: 'Ile par par korzysta z terapii seksualnej lub poradnictwa par?',
        answer: 'Mniej niż 5%',
        options: ['Prawie wszystkie pary z problemami – ~80%', 'Około 30%', 'Około 15%', 'Mniej niż 5%'],
      },

      // ── SEKS PO 50 I STAROŚĆ ─────────────────────────────────────────────────
      {
        text: 'Ile procent osób po 70. roku życia jest nadal aktywnych seksualnie?',
        answer: 'Około 40–50%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 40–50%', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Jak menopauza wpływa na libido kobiety?',
        answer: 'U części kobiet spada, u części wręcz rośnie',
        options: ['Całkowite wygaszenie libido u wszystkich kobiet', 'Libido zawsze rośnie po menopauzie', 'U części kobiet spada, u części wręcz rośnie', 'Menopauza w ogóle nie wpływa na libido'],
      },
      {
        text: 'Jak andropauza wpływa na aktywność seksualną mężczyzn?',
        answer: 'Stopniowy spadek libido i wzrost ryzyka zaburzeń erekcji po 50. roku życia',
        options: ['Całkowity zanik aktywności seksualnej po 60. roku życia', 'Stopniowy spadek libido i wzrost ryzyka zaburzeń erekcji po 50. roku życia', 'Libido mężczyzny nie zmienia się aż do śmierci', 'Wyraźny wzrost libido po 60. roku życia'],
      },
      {
        text: 'Ile procent mężczyzn po 70. roku życia doświadcza zaburzeń erekcji?',
        answer: 'Około 70%',
        options: ['Poniżej 5%', 'Około 25%', 'Około 50%', 'Około 70%'],
      },
      {
        text: 'Jak seks w starszym wieku wpływa na zdrowie psychiczne?',
        answer: 'Koreluje z lepszym samopoczuciem i niższą depresją',
        options: ['Negatywny wpływ – wzrost ryzyka zawału', 'Brak żadnego wpływu na psychikę', 'Koreluje z lepszym samopoczuciem i niższą depresją', 'Pozytywny wpływ tylko u kobiet, nie mężczyzn'],
      },

      // ── PREZERWATYWY I BEZPIECZEŃSTWO ────────────────────────────────────────
      {
        text: 'Ile prezerwatyw sprzedaje się rocznie na całym świecie?',
        answer: 'Około 27–30 miliardów sztuk',
        options: ['Kilka milionów', 'Około 500 milionów', 'Około 27–30 miliardów sztuk', 'Ponad bilion'],
      },
      {
        text: 'Ile procent stosunków seksualnych na świecie odbywa się z użyciem prezerwatywy?',
        answer: 'Około 5–10%',
        options: ['Prawie wszystkie – ~90%', 'Około 50%', 'Około 30%', 'Około 5–10%'],
      },
      {
        text: 'Jak wiek wpływa na stosowanie prezerwatyw?',
        answer: 'Młodzi dorośli (18–25 lat) używają ich częściej',
        options: ['Osoby starsze używają ich częściej', 'Brak różnicy wiekowej w stosowaniu', 'Młodzi dorośli (18–25 lat) używają ich częściej', 'Używają ich prawie wyłącznie osoby 50+'],
      },
      {
        text: 'Ile procent przypadków HIV można by uniknąć przy 100% stosowaniu prezerwatyw?',
        answer: 'Około 80% lub więcej',
        options: ['Około 10%', 'Około 40%', 'Około 80% lub więcej', 'Prezerwatywy nie wpływają na transmisję HIV'],
      },

      // ── SEKS ONLINE I NOWOCZESNE TRENDY ─────────────────────────────────────
      {
        text: 'Jaki procent dorosłych kiedykolwiek uczestniczył w wideo-seksie (np. przez Skype/FaceTime)?',
        answer: 'Około 25–30%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–30%', 'Prawie wszyscy – ~80%'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek kupiło produkt erotyczny przez internet?',
        answer: 'Około 40–50%',
        options: ['Poniżej 2%', 'Około 15%', 'Około 40–50%', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Ile procent dorosłych przyznaje się do oglądania pornografii z partnerem razem?',
        answer: 'Około 20–30%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 20–30%', 'Ponad 70%'],
      },
      {
        text: 'W którym roku rynek OnlyFans gwałtownie wzrósł?',
        answer: '2020',
        options: ['2015', '2018', '2020', '2023'],
      },
      {
        text: 'Ile dorosłych kobiet zarabia pieniądze tworząc treści dla dorosłych online?',
        answer: 'Szacunkowo kilka milionów na świecie',
        options: ['Kilkaset osób globalnie', 'Szacunkowo kilka milionów na świecie', 'Ponad 500 milionów', 'Tylko profesjonalne aktorki – brak amatorek'],
      },

      // ── PŁODNOŚĆ W LICZBACH ──────────────────────────────────────────────────
      {
        text: 'Ile procent par w krajach zachodnich doświadcza problemów z płodnością?',
        answer: 'Około 10–15%',
        options: ['Poniżej 0,5%', 'Około 3%', 'Około 10–15%', 'Ponad 50%'],
      },
      {
        text: 'W jakiej proporcji za niepłodność odpowiada czynnik męski vs żeński?',
        answer: 'Mniej więcej po równo między płciami',
        options: ['Niemal wyłącznie kobieta – ~90%', 'Niemal wyłącznie mężczyzna – ~80%', 'Mniej więcej po równo między płciami', 'Niepłodność jest zawsze obustronna'],
      },
      {
        text: 'O ile spada płodność kobiety po 35. roku życia?',
        answer: 'Znacząco – z ~20% do ~5% szansy miesięcznie',
        options: ['Nie spada – płodne tak samo aż do menopauzy', 'O 5% na rok – minimalnie', 'Znacząco – z ~20% do ~5% szansy miesięcznie', 'Gwałtownie po 30., zupełny zanik po 35.'],
      },
      {
        text: 'Jak pandemia COVID-19 wpłynęła na wskaźniki urodzeń?',
        answer: 'Krótkoterminowy spadek urodzeń, ale w niektórych krajach "baby boom" po lockdownie',
        options: ['Gwałtowny wzrost – "baby boom" w każdym kraju', 'Krótkoterminowy spadek urodzeń, ale w niektórych krajach "baby boom" po lockdownie', 'Brak jakiegokolwiek wpływu', 'Trwały i dramatyczny spadek urodzeń'],
      },
      {
        text: 'Ile procent zapłodnień in vitro (IVF) kończy się żywym urodzeniem (kobiety do 35 lat)?',
        answer: 'Około 40–45%',
        options: ['Prawie 100%', 'Około 70%', 'Około 40–45%', 'Poniżej 5%'],
      },

      // ── PSYCHOLOGIA SEKSUALNA W LICZBACH ────────────────────────────────────
      {
        text: 'Ile procent dorosłych ma co najmniej jeden fetysz seksualny?',
        answer: 'Około 30–45%',
        options: ['Poniżej 1% – fetysze są rzadkie', 'Około 5%', 'Około 30–45%', 'Prawie wszyscy – ~95%'],
      },
      {
        text: 'Jaki jest najczęstszy fetysz seksualny na świecie wg badań?',
        answer: 'Fetysz stóp',
        options: ['Fetysz bielizny', 'Fetysz stóp', 'Fetysz skóry', 'Fetysz mundurów'],
      },
      {
        text: 'Ile procent dorosłych regularnie używa aplikacji randkowych?',
        answer: 'Około 30% samotnych dorosłych',
        options: ['Poniżej 1% dorosłych', 'Około 10% wszystkich dorosłych', 'Około 30% samotnych dorosłych', 'Ponad 80% dorosłych poniżej 40 lat'],
      },
      {
        text: 'Jaka jest najczęstszą przyczyną seks-terapii u par?',
        answer: 'Różnice w poziomie pożądania',
        options: ['Zaburzenia erekcji', 'Niewierność partnera', 'Różnice w poziomie pożądania', 'Ból podczas stosunku'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek korzystało z seks-linii telefonicznej lub czatu erotycznego?',
        answer: 'Około 15–20%',
        options: ['Poniżej 0,1%', 'Około 5%', 'Około 15–20%', 'Ponad 60%'],
      },
      {
        text: 'Ile dorosłych na świecie było kiedykolwiek klientem usług seksualnych (prostytucji)?',
        answer: 'Około 15–20% mężczyzn',
        options: ['Poniżej 0,1%', 'Około 5%', 'Około 15–20% mężczyzn', 'Ponad 60%'],
      },

      // ── SEKS A TECHNOLOGIA ───────────────────────────────────────────────────
      {
        text: 'Jak smartfony zmieniły nawyki seksualne?',
        answer: 'Ułatwiły dostęp do porno, randek i sekstingu',
        options: ['Zmniejszyły aktywność seksualną – ludzie wolą ekrany', 'Ułatwiły dostęp do porno, randek i sekstingu', 'Nie wpłynęły na zachowania seksualne', 'Zastąpiły kontakt fizyczny u większości osób'],
      },
      {
        text: 'Ile aplikacji randkowych jest aktualnie dostępnych na rynku globalnym?',
        answer: 'Ponad 1 500',
        options: ['Tylko kilka popularnych', 'Około 50', 'Około 300', 'Ponad 1 500'],
      },
      {
        text: 'Co to jest "sextortion" i ilu dotyczy?',
        answer: 'Szantaż intymnymi zdjęciami lub filmami',
        options: ['Termin marketingowy z branży fitness', 'Szantaż intymnymi zdjęciami lub filmami', 'Legalna forma seksbiznesu', 'Zjawisko dotyczące wyłącznie celebrytek'],
      },

      // ── MAŁŻEŃSTWO I SEKS ────────────────────────────────────────────────────
      {
        text: 'Ile procent małżeństw jest ocenianych jako "seksualnie satysfakcjonujące" przez obie strony?',
        answer: 'Około 50–55%',
        options: ['Prawie wszystkie – ~95%', 'Około 75%', 'Około 50–55%', 'Mniej niż 10%'],
      },
      {
        text: 'Jak długość małżeństwa wpływa na częstotliwość seksu?',
        answer: 'Stopniowo maleje – ok. 20% co dekadę',
        options: ['Rośnie – pary coraz lepiej się poznają', 'Stopniowo maleje – ok. 20% co dekadę', 'Pozostaje stała przez całe małżeństwo', 'Spada po urodzeniu dzieci, potem jest stała'],
      },
      {
        text: 'Ile procent małżeństw przeżywa po potwierdzeniu zdrady? (wg badań par)',
        answer: 'Około 20%',
        options: ['Prawie wszystkie – zdrada wzmacnia związek', 'Około 80%', 'Około 50%', 'Około 20%'],
      },
      {
        text: 'Ile procent par w Polsce decyduje się na separację lub rozwód?',
        answer: 'Około 30%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30%', 'Ponad 70%'],
      },
      {
        text: 'Ile procent rozwodów jest pośrednio lub bezpośrednio związanych z problemami seksualnymi?',
        answer: 'Około 20–30%',
        options: ['Poniżej 1% – seks rzadko bywa przyczyną', 'Około 20–30%', 'Ponad 80% – seks jest zawsze kluczowy', 'Dokładnie 50%'],
      },
      {
        text: 'W którym roku życia małżeńskiego najczęściej pojawia się "syndrom wypalenia seksualnego"?',
        answer: 'Najczęściej między 3. a 7. rokiem małżeństwa',
        options: ['W pierwszym roku', 'Najczęściej między 3. a 7. rokiem małżeństwa', 'Po 25 latach wspólnego życia', 'Wypalenie seksualne nie jest udowodnionym zjawiskiem'],
      },
      {
        text: 'Ile procent wdowców/wdów po 65. roku życia podejmuje nowe relacje seksualne?',
        answer: 'Około 25–35%',
        options: ['Prawie żaden – ~1%', 'Około 25–35%', 'Ponad 80%', 'Tylko mężczyźni, kobiety rzadko'],
      },

      // ── OSTATNIA SERIA CIEKAWOSTEK ───────────────────────────────────────────
      {
        text: 'Ile procent aktów seksualnych odbywa się spontanicznie (bez planowania)?',
        answer: 'Około 70–80%',
        options: ['Prawie wszystkie – ~99%', 'Około 70–80%', 'Mniej niż 10%', 'Równo 50/50'],
      },
      {
        text: 'Ile procent dorosłych nigdy nie rozmawiało ze swoimi rodzicami o seksie?',
        answer: 'Około 60–70%',
        options: ['Poniżej 5%', 'Około 25%', 'Około 60–70%', 'Prawie wszyscy – ~95%'],
      },
      {
        text: 'Ile procent kobiet przyznaje, że kiedykolwiek miała seks bez podekscytowania – wyłącznie z obowiązku?',
        answer: 'Około 50–60%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 50–60%', 'Prawie wszystkie – ~90%'],
      },
      {
        text: 'Ile procent dorosłych uprawiało seks w sposób, którego potem żałowało?',
        answer: 'Około 55–65%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 55–65%', 'Prawie wszyscy – ~99%'],
      },
      {
        text: 'Jak bardzo aktywność fizyczna wpływa na libido?',
        answer: 'Regularne ćwiczenia wyraźnie zwiększają libido',
        options: ['Nie wpływa na libido wcale', 'Ćwiczenia zmniejszają libido – zmęczenie ciała', 'Regularne ćwiczenia wyraźnie zwiększają libido', 'Wpływa tylko na mężczyzn'],
      },
      {
        text: 'Ile procent dorosłych regularnie rozmawia z lekarzem o swoim życiu seksualnym?',
        answer: 'Mniej niż 20%',
        options: ['Prawie wszyscy – lekarz zawsze pyta', 'Około 50%', 'Około 35%', 'Mniej niż 20%'],
      },
      {
        text: 'Ile procent dorosłych kobiet przeżyło co najmniej jeden stosunek, który był dla nich bolesny?',
        answer: 'Około 75%',
        options: ['Poniżej 5%', 'Około 25%', 'Około 50%', 'Około 75%'],
      },
      {
        text: 'Ile procent kobiet cierpi na przewlekłą dyspareuniię (regularny ból podczas seksu)?',
        answer: 'Około 10–20%',
        options: ['Poniżej 0,5%', 'Około 2%', 'Około 10–20%', 'Ponad 50%'],
      },
      {
        text: 'Ile procent mężczyzn ma trudności z utrzymaniem erekcji co najmniej okazjonalnie?',
        answer: 'Około 52% mężczyzn po 40. roku życia',
        options: ['Poniżej 1%', 'Około 10%', 'Około 52% mężczyzn po 40. roku życia', 'Prawie wszyscy po 50. roku życia'],
      },
      {
        text: 'Jaka jest global średnia liczba stosunków seksualnych w ciągu całego aktywnego życia?',
        answer: 'Około 5 000–6 000 stosunków',
        options: ['Około 100', 'Około 1 000', 'Około 5 000–6 000 stosunków', 'Ponad 100 000'],
      },
      {
        text: 'Ile procent osób aktywnych seksualnie nigdy nie używało żadnej formy antykoncepcji?',
        answer: 'Około 15–20%',
        options: ['Poniżej 0,1%', 'Około 5%', 'Około 15–20%', 'Ponad 50%'],
      },
      {
        text: 'Ile procent kobiet po 60. roku życia jest wciąż aktywnych seksualnie?',
        answer: 'Około 50–65%',
        options: ['Poniżej 1%', 'Około 15%', 'Około 50–65%', 'Prawie wszystkie – ~95%'],
      },
      {
        text: 'Co statystyki pokazują o związku między szczęściem a aktywnością seksualną?',
        answer: 'Szczęśliwsi ludzie uprawiają więcej seksu – ale zależność działa w obu kierunkach',
        options: ['Tylko seks powoduje szczęście – nie odwrotnie', 'Brak związku – to dwa niezależne zjawiska', 'Szczęśliwsi ludzie uprawiają więcej seksu – ale zależność działa w obu kierunkach', 'Aktywność seksualna nie koreluje z żadnym miernikiem szczęścia'],
      },
      {
        text: 'Ile procent dorosłych mających problemy seksualne nigdy nie szuka pomocy specjalistycznej?',
        answer: 'Około 80–85%',
        options: ['Poniżej 5% – prawie wszyscy szukają pomocy', 'Około 30%', 'Około 55%', 'Około 80–85%'],
      },
      {
        text: 'Ile procent par przyznaje, że ich seks jest lepszy po kłótni (makeup sex)?',
        answer: 'Około 30–40%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–40%', 'Ponad 90%'],
      },
      {
        text: 'Ile procent dorosłych uprawiało seks na pierwszej randce?',
        answer: 'Około 20–25%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 20–25%', 'Ponad 70%'],
      },
      {
        text: 'Jaki jest wskaźnik satysfakcji seksualnej u par stosujących terapię seksualną?',
        answer: 'Poprawa u ok. 70–80% par',
        options: ['Brak poprawy – terapia nie działa', 'Poprawa u ok. 10% par', 'Poprawa u ok. 70–80% par', 'Pogorszenie – terapia ujawnia głębsze problemy'],
      },
      {
        text: 'Ile procent dorosłych przyznaje, że oglądanie partnerki/partnera podczas seksu zwiększa ich satysfakcję?',
        answer: 'Około 65–70%',
        options: ['Poniżej 5%', 'Około 25%', 'Około 65–70%', 'Prawie wszyscy – ~99%'],
      },
    ],
  },
  {
    id: 'men',
    name: '🍆 Faceci pod lupą',
    description: 'Wszystko o mężczyznach – od głowy po… no wiecie',
    color: '#f59e0b',
    border: 'rgba(245,158,11,0.5)',
    bg: 'rgba(245,158,11,0.07)',
    questions: [
      // ── PENIS – WYMIARY I FAKTY ───────────────────────────────────────────────
      {
        text: 'Który kraj ma statystycznie największy średni rozmiar penisa wg badań?',
        answer: 'Demokratyczna Republika Konga',
        options: ['Brazylia', 'Włochy', 'Demokratyczna Republika Konga', 'Francja'],
      },
      {
        text: 'Jaka jest średnia długość penisa w erekcji na świecie? (metaanaliza BJUI 2015, n = 15 521)',
        answer: '13,1 cm',
        options: ['9,5 cm', '11,0 cm', '13,1 cm', '16,5 cm'],
      },
      {
        text: 'Jaka jest średnia długość penisa w stanie spoczynku wg tej samej metaanalizy?',
        answer: '9,16 cm',
        options: ['5,5 cm', '7,0 cm', '9,16 cm', '12,0 cm'],
      },
      {
        text: 'Jaki jest średni obwód penisa w erekcji wg BJUI 2015?',
        answer: '11,66 cm',
        options: ['7,5 cm', '9,5 cm', '11,66 cm', '14,5 cm'],
      },
      {
        text: 'Jaka jest szacowana średnia długość penisa w erekcji w Polsce?',
        answer: 'Około 14–15 cm',
        options: ['Około 10 cm', 'Około 12 cm', 'Około 14–15 cm', 'Ponad 19 cm'],
      },
      {
        text: 'Jaki procent mężczyzn ma penisa dłuższego niż 18 cm w erekcji?',
        answer: 'Około 2%',
        options: ['Około 2%', 'Około 15%', 'Około 30%', 'Ponad połowa'],
      },
      {
        text: 'Jaki procent mężczyzn ma mikropenis (poniżej 7 cm w erekcji)?',
        answer: 'Około 0,6%',
        options: ['Około 0,6%', 'Około 5%', 'Około 15%', 'Ponad 20%'],
      },
      {
        text: 'Czy rozmiar buta lub dłoni koreluje z długością penisa?',
        answer: 'Nie – badania naukowe nie potwierdzają żadnej istotnej korelacji',
        options: ['Tak – rozmiar buta 44+ = penis powyżej 18 cm', 'Tak – długość dłoni jest dokładnym wskaźnikiem', 'Nie – badania naukowe nie potwierdzają żadnej istotnej korelacji', 'Tak, ale tylko u mężczyzn powyżej 190 cm'],
      },
      {
        text: 'Który kontynent ma statystycznie największy średni rozmiar penisa?',
        answer: 'Afryka',
        options: ['Ameryka Łacińska', 'Afryka', 'Europa Wschodnia', 'Azja Wschodnia'],
      },
      {
        text: 'Czy wzrost mężczyzny koreluje z długością penisa?',
        answer: 'Bardzo słabo – korelacja r ≈ 0,2',
        options: ['Tak – wysocy mężczyźni zawsze mają większy penis', 'Bardzo słabo – korelacja r ≈ 0,2', 'Korelacja jest silna – r ≈ 0,9', 'Niscy mężczyźni mają statystycznie większy penis'],
      },
      {
        text: 'Co to jest choroba Peyroniego?',
        answer: 'Skrzywienie penisa wskutek bliznowacenia tkanki',
        options: ['Stan zapalny napletka i żołędzi', 'Skrzywienie penisa wskutek bliznowacenia tkanki', 'Wrodzony zbyt mały rozmiar penisa', 'Ból podczas erekcji bez zmian anatomicznych'],
      },
      {
        text: 'Jaki procent mężczyzn ma skrzywiony penis w erekcji?',
        answer: 'Lekkie skrzywienie jest normalne – ok. 20–30%',
        options: ['Jest to rzadkość – poniżej 1%', 'Tylko przy chorobie Peyroniego – ~5%', 'Lekkie skrzywienie jest normalne – ok. 20–30%', 'Ponad 80% – każdy penis jest skrzywiony'],
      },
      {
        text: 'Co to jest wędzidełko prącia (frenulum) i dlaczego jest ważne?',
        answer: 'Wrażliwy fałd skóry pod żołędzią',
        options: ['Kość znajdująca się w penisie', 'Wrażliwy fałd skóry pod żołędzią', 'Więzadło łączące penis z moszną', 'Tkanka jamista wnętrza penisa'],
      },
      {
        text: 'Ile zakończeń nerwowych szacunkowo zawiera napletek?',
        answer: 'Około 20 000',
        options: ['Kilkadziesiąt', 'Około 1 000', 'Około 20 000', 'Około 100 000'],
      },
      {
        text: 'Co to jest stulejka (fimosis)?',
        answer: 'Zbyt ciasny napletek utrudniający odsłonięcie żołędzi',
        options: ['Bolesny stan zapalny żołędzi', 'Zbyt ciasny napletek utrudniający odsłonięcie żołędzi', 'Bolesne skrzywienie penisa', 'Całkowity brak wytrysku'],
      },

      // ── EREKCJA I ZABURZENIA ─────────────────────────────────────────────────
      {
        text: 'Ile razy przeciętny mężczyzna doświadcza nocnej erekcji (NPT) podczas snu?',
        answer: '3–5 razy na noc',
        options: ['Nigdy', 'Raz na noc', '3–5 razy na noc', 'Ponad 10 razy'],
      },
      {
        text: 'Co powoduje poranną erekcję?',
        answer: 'Fazy snu REM aktywujące układ nerwowy',
        options: ['Wysoki poranny poziom testosteronu', 'Pełny pęcherz moczowy uciskający nerwy', 'Fazy snu REM aktywujące układ nerwowy', 'Kortyzol wydzielany nad ranem'],
      },
      {
        text: 'Co to jest priapizm?',
        answer: 'Bolesna erekcja trwająca ponad 4 godziny',
        options: ['Lęk przed zbliżeniem seksualnym', 'Bolesna erekcja trwająca ponad 4 godziny', 'Zbyt szybki, przedwczesny wytrysk', 'Całkowity brak popędu seksualnego'],
      },
      {
        text: 'Ile procent mężczyzn po 40. roku życia doświadcza zaburzeń erekcji (ED)?',
        answer: 'Około 52% mężczyzn po 40. roku życia',
        options: ['Poniżej 1%', 'Około 10%', 'Około 52% mężczyzn po 40. roku życia', 'Prawie wszyscy po 50. roku życia'],
      },
      {
        text: 'Jaka jest najczęstsza przyczyna zaburzeń erekcji u mężczyzn poniżej 40. roku życia?',
        answer: 'Przyczyny psychologiczne – lęk i stres',
        options: ['Zbyt niski poziom testosteronu', 'Choroby naczyń krwionośnych', 'Przyczyny psychologiczne – lęk i stres', 'Alergia kontaktowa na lateks'],
      },
      {
        text: 'Jak działa sildenafil (Viagra) na erekcję?',
        answer: 'Rozszerza naczynia ciał jamistych przez blokadę PDE-5',
        options: ['Podnosi poziom testosteronu we krwi', 'Rozszerza naczynia ciał jamistych przez blokadę PDE-5', 'Pobudza układ nerwowy jak kofeina', 'Bezpośrednio stymuluje nerwy erekcji'],
      },
      {
        text: 'Ile procent mężczyzn z ED nie zgłasza problemu lekarzowi?',
        answer: 'Ponad 70%',
        options: ['Poniżej 5%', 'Około 30%', 'Ponad 70%', 'Prawie nikt – mężczyźni zawsze szukają pomocy'],
      },
      {
        text: 'Jak alkohol wpływa na erekcję?',
        answer: 'Małe dawki rozluźniają, duże blokują erekcję',
        options: ['Zawsze poprawia erekcję przez wzrost pewności siebie', 'Nie ma żadnego wpływu na erekcję', 'Małe dawki rozluźniają, duże blokują erekcję', 'Alkohol jest najlepszym naturalnym afrodyzjakiem'],
      },
      {
        text: 'Co to jest "performance anxiety" i jak wpływa na mężczyzn?',
        answer: 'Lęk przed oceną seksualną',
        options: ['Wzrost adrenaliny poprawiający erekcję', 'Lęk przed oceną seksualną', 'Naturalne zmęczenie po stosunku', 'Stan, po którym następuje wzmożona erekcja'],
      },
      {
        text: 'Czy erekcja możliwa jest po śmierci mężczyzny?',
        answer: 'Tak – tzw. "angel lust" po śmierci',
        options: ['Nie – erekcja wymaga aktywnego układu nerwowego', 'Tak – tzw. "angel lust" po śmierci', 'Tylko po straceniu na szubienicy', 'To mit niemający podstaw medycznych'],
      },
      {
        text: 'Ile procent mężczyzn jest obrzezanych na świecie?',
        answer: 'Około 37–38%',
        options: ['Około 5%', 'Około 20%', 'Około 37–38%', 'Ponad 80%'],
      },

      // ── WYTRYSK I ORGAZM ─────────────────────────────────────────────────────
      {
        text: 'Jak szybko przebiega wytrysk (prędkość nasienia)?',
        answer: 'Około 45 km/h',
        options: ['Około 2 km/h', 'Około 10 km/h', 'Około 45 km/h', 'Ponad 200 km/h'],
      },
      {
        text: 'Ile trwa orgazm u przeciętnego mężczyzny?',
        answer: '3–15 sekund',
        options: ['Mniej niż sekundę', '3–15 sekund', '30–45 sekund', 'Ponad minutę'],
      },
      {
        text: 'Co to jest "ejaculatory inevitability" – punkt bez powrotu?',
        answer: 'Moment, po którym nie można już zatrzymać wytrysku',
        options: ['Chwila tuż po zakończeniu orgazmu', 'Moment, po którym nie można już zatrzymać wytrysku', 'Stan pełnej erekcji bez możliwości jej cofnięcia', 'Drugi orgazm następujący z rzędu'],
      },
      {
        text: 'Ile procent mężczyzn doświadcza przedwczesnego wytrysku? (ISSM)',
        answer: 'Około 20–30%',
        options: ['Około 2%', 'Około 10%', 'Około 20–30%', 'Ponad 60%'],
      },
      {
        text: 'Co to jest opóźniony wytrysk (delayed ejaculation)?',
        answer: 'Trudność z osiągnięciem wytrysku mimo stymulacji',
        options: ['Wytrysk po 30 minutach – norma u starszych mężczyzn', 'Trudność z osiągnięciem wytrysku mimo stymulacji', 'Wytrysk w kilka sekund po penetracji', 'Wytrysk dwuetapowy – zjawisko normalne'],
      },
      {
        text: 'Co to jest wytrysk wsteczny (retrograde ejaculation)?',
        answer: 'Nasienie cofa się do pęcherza – suchy orgazm',
        options: ['Wytrysk bez odczucia orgazmu', 'Nasienie cofa się do pęcherza – suchy orgazm', 'Brak nasienia przy wytrysku (azoospermia)', 'Podwójny wytrysk podczas jednego orgazmu'],
      },
      {
        text: 'Ile ejakulacji miesięcznie u mężczyzn koreluje z niższym ryzykiem raka prostaty? (Giovannucci 2004)',
        answer: '21 lub więcej miesięcznie',
        options: ['1–2 miesięcznie', '5–7 miesięcznie', '21 lub więcej miesięcznie', 'Celibat – brak ejakulacji chroni prostatę'],
      },
      {
        text: 'Czy mężczyźni mogą osiągać orgazm wielokrotny?',
        answer: 'Tak – dzięki technikom zatrzymania nasienia',
        options: ['Nie – jest to biologicznie niemożliwe', 'Tak – dzięki technikom zatrzymania nasienia', 'Tak, ale tylko mężczyźni przed 25. rokiem życia', 'Tylko po kastracji chemicznej'],
      },
      {
        text: 'Co to jest orgazm mężczyzny z prostaty ("P-spot orgasm")?',
        answer: 'Orgazm przez stymulację prostaty przez odbyt',
        options: ['Mit niemający podstaw anatomicznych', 'Orgazm przez stymulację prostaty przez odbyt', 'Orgazm występujący wyłącznie przy impotencji', 'Orgazm wywołany samymi myślami bez stymulacji'],
      },
      {
        text: 'Jak mężczyźni opisują uczucie podczas orgazmu neurologicznie?',
        answer: 'Aktywacja tych samych obszarów nagrody co heroina',
        options: ['Łagodna przyjemność jak drapanie po plecach', 'Aktywacja tych samych obszarów nagrody co heroina', 'Głównie ulga napięcia bez wyraźnej przyjemności', 'Uczucie bólu przechodzącego w ulgę'],
      },

      // ── REFRAKCJA I LIBIDO ───────────────────────────────────────────────────
      {
        text: 'Ile wynosi typowy okres refrakcji (czas do kolejnej erekcji) u młodego mężczyzny?',
        answer: '15–30 minut',
        options: ['30 sekund', '5 minut', '15–30 minut', 'Ponad 12 godzin'],
      },
      {
        text: 'Ile wynosi okres refrakcji u mężczyzny po 50. roku życia?',
        answer: 'Od kilku godzin nawet do doby',
        options: ['Identyczny jak u 20-latka – 15 min', 'Od kilku godzin nawet do doby', 'Zaledwie kilka sekund', 'Mężczyźni po 50. nie mają refrakcji'],
      },
      {
        text: 'Co powoduje uczucie senności i znużenia po orgazmie u mężczyzn?',
        answer: 'Wyrzut prolaktyny i oksytocyny po wytrysku',
        options: ['Utrata energii z powodu wysiłku fizycznego', 'Wyrzut prolaktyny i oksytocyny po wytrysku', 'Krew odpływa z mózgu do ciał jamistych', 'To mit – mężczyźni nie są bardziej senni'],
      },
      {
        text: 'Ile razy dziennie przeciętny mężczyzna myśli o seksie? (Fisher et al. 2011)',
        answer: 'Około 19 razy dziennie',
        options: ['Raz na godzinę – ~16 razy', 'Około 19 razy dziennie', 'Co 7 sekund (ok. 8 000 razy)', 'Ponad 200 razy dziennie'],
      },
      {
        text: 'Jak się nazywa zjawisko odnowionego podniecenia seksualnego przy nowym partnerze?',
        answer: 'Efekt Coolidge\'a',
        options: ['Syndrom Don Juana', 'Efekt Coolidge\'a', 'Efekt halo', 'Prawo Yerkesa-Dodsona'],
      },
      {
        text: 'Jak poziom testosteronu zmienia się przez dobę?',
        answer: 'Szczyt rano (6:00–8:00), minimum wieczorem',
        options: ['Jest stały przez całą dobę', 'Szczyt rano (6:00–8:00), minimum wieczorem', 'Szczyt przypada o północy', 'Wzrasta wyłącznie podczas seksu'],
      },
      {
        text: 'Jak dieta wpływa na libido mężczyzny?',
        answer: 'Cynk, witamina D i zdrowe tłuszcze wspierają testosteron',
        options: ['Dieta nie ma żadnego wpływu na libido', 'Wyłącznie kaloryczność posiłków decyduje o libido', 'Cynk, witamina D i zdrowe tłuszcze wspierają testosteron', 'Wegetarianizm zawsze obniża libido mężczyzn'],
      },

      // ── TESTOSTERON I HORMONY ─────────────────────────────────────────────────
      {
        text: 'Który gruczoł produkuje ok. 95% testosteronu u mężczyzny?',
        answer: 'Jądra',
        options: ['Nadnercza', 'Przysadka mózgowa', 'Jądra', 'Prostata'],
      },
      {
        text: 'O ile procent rocznie spada testosteron po 30. roku życia?',
        answer: 'Około 1% rocznie',
        options: ['Nie spada wcale aż do starości', 'Około 0,1% rocznie', 'Około 1% rocznie', 'Ponad 10% rocznie'],
      },
      {
        text: 'Co to jest andropauza?',
        answer: 'Stopniowy spadek testosteronu po 40–50. roku życia',
        options: ['Nagłe zatrzymanie produkcji testosteronu jak menopauza', 'Stopniowy spadek testosteronu po 40–50. roku życia', 'Stan po kastracji chirurgicznej', 'Chorobowy niedobór testosteronu od urodzenia'],
      },
      {
        text: 'Jak trening siłowy wpływa na testosteron?',
        answer: 'Krótkoterminowo podnosi, zwłaszcza ćwiczenia wielostawowe',
        options: ['Drastycznie obniża go po każdym treningu', 'Krótkoterminowo podnosi, zwłaszcza ćwiczenia wielostawowe', 'Nie wpływa w żaden sposób na testosteron', 'Podnosi testosteron tylko u kobiet'],
      },
      {
        text: 'Jak stres wpływa na testosteron?',
        answer: 'Kortyzol antagonizuje testosteron i obniża go',
        options: ['Stres podnosi testosteron przez adrenalinę', 'Stres nie wpływa na poziom testosteronu', 'Kortyzol antagonizuje testosteron i obniża go', 'Stres wpływa tylko na estrogeny'],
      },
      {
        text: 'Jaki poziom testosteronu uważa się za normy u dorosłego mężczyzny?',
        answer: '300–1 000 ng/dl',
        options: ['50–100 ng/dl', '150–200 ng/dl', '300–1 000 ng/dl', 'Ponad 5 000 ng/dl'],
      },
      {
        text: 'Co to jest hipogonadyzm u mężczyzny?',
        answer: 'Niedobór produkcji testosteronu przez jądra',
        options: ['Nadmierny przerost jąder', 'Niedobór produkcji testosteronu przez jądra', 'Stan po zabiegu wazektomii', 'Zapalenie gruczołu krokowego'],
      },
      {
        text: 'Co to jest ginekomastia?',
        answer: 'Powiększenie tkanki gruczołowej piersi u mężczyzn',
        options: ['Złośliwy rak piersi u mężczyzn', 'Powiększenie tkanki gruczołowej piersi u mężczyzn', 'Nadmierne owłosienie klatki piersiowej', 'Całkowity brak owłosienia klatki'],
      },
      {
        text: 'Jak alkohol przewlekle wpływa na testosteron?',
        answer: 'Obniża testosteron i może powodować zanik jąder',
        options: ['Podnosi testosteron – stąd agresja po alkoholu', 'Nie ma wpływu na hormony mężczyzny', 'Obniża testosteron i może powodować zanik jąder', 'Tylko piwo, nie wódka, obniża testosteron'],
      },
      {
        text: 'Co to są sterydy anaboliczne i jak wpływają na jądra?',
        answer: 'Syntetyczny testosteron – powoduje zanik jąder',
        options: ['Naturalne suplementy wzmacniające jądra', 'Syntetyczny testosteron – powoduje zanik jąder', 'Leki stosowane na zaburzenia erekcji', 'Witaminy stosowane przez sportowców'],
      },

      // ── SPERMA I PŁODNOŚĆ ────────────────────────────────────────────────────
      {
        text: 'Ile plemników produkuje zdrowy mężczyzna każdego dnia?',
        answer: 'Około 300 milionów dziennie',
        options: ['Kilka tysięcy', 'Kilka milionów', 'Około 300 milionów dziennie', 'Kilka miliardów'],
      },
      {
        text: 'Ile trwa spermatogeneza – od komórki macierzystej do dojrzałego plemnika?',
        answer: '64–74 dni',
        options: ['7–10 dni', '24–30 dni', '64–74 dni', 'Ponad 6 miesięcy'],
      },
      {
        text: 'Ile ml nasienia zawiera typowy ejakulat?',
        answer: '3–5 ml',
        options: ['0,5 ml', '1–2 ml', '3–5 ml', 'Ponad 20 ml'],
      },
      {
        text: 'Jak długo plemniki przeżywają w kobiecych drogach rodnych?',
        answer: 'Do 5 dni',
        options: ['Kilka minut', 'Kilka godzin', 'Do 5 dni', 'Do 3 tygodni'],
      },
      {
        text: 'Co niszczy jakość nasienia?',
        answer: 'Ciepło, palenie, alkohol, stres i sterydy',
        options: ['Ćwiczenia fizyczne i dieta roślinna', 'Ciepło, palenie, alkohol, stres i sterydy', 'Zbyt częsty seks – "wyczerpanie" zapasów', 'Wyłącznie czynniki genetyczne'],
      },
      {
        text: 'Dlaczego noszenie obcisłych slipów może wpływać na jakość nasienia?',
        answer: 'Podwyższona temperatura moszny zaburza spermatogenezę',
        options: ['Ucisk mechaniczny niszczy plemniki w najądrzu', 'Podwyższona temperatura moszny zaburza spermatogenezę', 'Obcisła bielizna obniża poziom testosteronu', 'To wyłącznie mit bez podstaw naukowych'],
      },
      {
        text: 'Co to jest azoospermia?',
        answer: 'Całkowity brak plemników w nasieniu',
        options: ['Zbyt mała objętość ejakulatu', 'Całkowity brak plemników w nasieniu', 'Zbyt niska ruchliwość plemników', 'Zdeformowane, wadliwe plemniki'],
      },
      {
        text: 'Ile procent niepłodności u par wynika z czynnika wyłącznie męskiego?',
        answer: 'Około 40%',
        options: ['Poniżej 5% – to problem wyłącznie kobiecy', 'Około 15%', 'Około 40%', 'Ponad 80%'],
      },
      {
        text: 'Jak praca siedząca długotrwale wpływa na jakość nasienia?',
        answer: 'Może podnosić temperaturę moszny i obniżać jakość nasienia',
        options: ['Poprawia jakość nasienia przez brak wysiłku', 'Może podnosić temperaturę moszny i obniżać jakość nasienia', 'Nie ma żadnego wpływu na nasienie', 'Wyłącznie jazda na rowerze szkodzi nasieniu'],
      },
      {
        text: 'Jaka dieta wspiera jakość nasienia i płodność mężczyzny?',
        answer: 'Śródziemnomorska – bogata w antyoksydanty i cynk',
        options: ['Wysokobiałkowa z dużą ilością czerwonego mięsa', 'Śródziemnomorska – bogata w antyoksydanty i cynk', 'Ketogeniczna, eliminująca węglowodany', 'Suplementacja wyłącznie witaminą C'],
      },

      // ── PROSTATA I JĄDRA ─────────────────────────────────────────────────────
      {
        text: 'Gdzie dokładnie znajduje się gruczoł krokowy (prostata)?',
        answer: 'Pod pęcherzem moczowym, otaczając cewkę moczową',
        options: ['Między jądrami a cewką', 'Pod pęcherzem moczowym, otaczając cewkę moczową', 'Za odbytnicą, poza miednicą', 'Wewnątrz moszny, powyżej jąder'],
      },
      {
        text: 'Jaki rozmiar ma zdrowa prostata?',
        answer: 'Orzech włoski',
        options: ['Ziarno grochu', 'Orzech włoski', 'Jajko kurze', 'Piłka tenisowa'],
      },
      {
        text: 'Co to jest PSA i do czego służy?',
        answer: 'Marker używany w diagnostyce raka prostaty',
        options: ['Białko w nasieniu odpowiedzialne za ruchliwość', 'Marker używany w diagnostyce raka prostaty', 'Hormon regulujący spermatogenezę', 'Enzym rozkładający ściankę komórki jajowej'],
      },
      {
        text: 'Ile procent mężczyzn po 80. roku życia ma komórki raka prostaty (mikrofokalne)?',
        answer: 'Około 70–80%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 40%', 'Około 70–80%'],
      },
      {
        text: 'Co to jest BPH (łagodny przerost prostaty)?',
        answer: 'Niezłośliwe powiększenie prostaty utrudniające oddawanie moczu',
        options: ['Rak prostaty we wczesnym stadium', 'Niezłośliwe powiększenie prostaty utrudniające oddawanie moczu', 'Zapalenie gruczołu krokowego (prostatitis)', 'Kamica gruczołu krokowego'],
      },
      {
        text: 'W jakim przedziale wiekowym najczęściej pojawia się rak jąder?',
        answer: '15–35 lat',
        options: ['0–5 lat (noworodki)', '15–35 lat', '50–65 lat', 'Powyżej 70. roku życia'],
      },
      {
        text: 'Dlaczego lewe jądro zwisa zazwyczaj niżej niż prawe?',
        answer: 'Lewa żyła nasienna ma dłuższą drogę spływu krwi',
        options: ['Lewe jądro jest cięższe u większości mężczyzn', 'Lewa żyła nasienna ma dłuższą drogę spływu krwi', 'Moszna jest asymetrycznie zbudowana u wszystkich', 'To mit – jądra są zawsze symetryczne'],
      },
      {
        text: 'Co to są żylaki powrózka nasiennego (varicocele)?',
        answer: 'Poszerzenie żył odprowadzających krew z jądra',
        options: ['Bolesne zapalenie najądrza', 'Poszerzenie żył odprowadzających krew z jądra', 'Wypełniona płynem torbiel jądra', 'Nagły skręt jądra'],
      },
      {
        text: 'Jak długi jest najądrze, jeśli się go rozwinąć?',
        answer: 'Około 6 metrów',
        options: ['Około 10 cm', 'Około 1 metra', 'Około 6 metrów', 'Ponad 50 metrów'],
      },
      {
        text: 'Co to jest skręt jądra i dlaczego jest nagły?',
        answer: 'Skręcenie powrózka odcinające dopływ krwi do jądra',
        options: ['Łagodny ból po wysiłku fizycznym', 'Bolesne zapalenie najądrza', 'Skręcenie powrózka odcinające dopływ krwi do jądra', 'Normalny objaw dojrzewania u nastolatków'],
      },

      // ── MASTURBACJA ──────────────────────────────────────────────────────────
      {
        text: 'Ile procent mężczyzn masturbuje się regularnie?',
        answer: 'Około 80–90%',
        options: ['Około 20%', 'Około 50%', 'Około 80–90%', 'Prawie 100%'],
      },
      {
        text: 'Ile procent mężczyzn nigdy nie masturbowało się?',
        answer: 'Około 5–10%',
        options: ['Poniżej 0,1%', 'Około 5–10%', 'Około 30%', 'Ponad połowa'],
      },
      {
        text: 'Jak często przeciętny mężczyzna masturbuje się?',
        answer: 'Około 1–3 razy tygodniowo',
        options: ['Raz w miesiącu', 'Raz w tygodniu', 'Około 1–3 razy tygodniowo', 'Kilka razy dziennie'],
      },
      {
        text: 'W jakim wieku mężczyźni typowo zaczynają masturbować się?',
        answer: '12–14 lat – zazwyczaj przed pierwszym stosunkiem seksualnym',
        options: ['6–8 lat', '12–14 lat – zazwyczaj przed pierwszym stosunkiem seksualnym', '18–20 lat', 'Po inicjacji seksualnej'],
      },
      {
        text: 'Czy masturbacja u mężczyzn powoduje zmniejszenie ilości lub jakości nasienia?',
        answer: 'Tymczasowo zmniejsza ilość, ale jakość powraca do normy w ciągu kilku dni',
        options: ['Tak – trwale niszczy jakość nasienia', 'Nie – masturbacja poprawia jakość nasienia', 'Tymczasowo zmniejsza ilość, ale jakość powraca do normy w ciągu kilku dni', 'Nie ma żadnego wpływu na nasienie'],
      },
      {
        text: 'Jak masturbacja do pornografii może wpływać na seks z partnerką?',
        answer: 'Może powodować "death grip syndrome" – przyzwyczajenie do mocnej stymulacji utrudniające orgazm z partnerką',
        options: ['Zawsze poprawia seks z partnerką przez trening', 'Może powodować "death grip syndrome" – przyzwyczajenie do mocnej stymulacji utrudniające orgazm z partnerką', 'Nie ma żadnego wpływu na seks z partnerką', 'Masturbacja zastępuje potrzebę seksu z partnerką'],
      },

      // ── PSYCHOLOGIA SEKSUALNA MĘŻCZYZN ──────────────────────────────────────
      {
        text: 'Jak mężczyźni przeżywają seks emocjonalnie?',
        answer: 'Mężczyźni częściej oddzielają seks od emocji, ale połączenie emocjonalne zwiększa ich satysfakcję',
        options: ['Mężczyźni są całkowicie niezdolni do emocji podczas seksu', 'Mężczyźni są bardziej emocjonalni niż kobiety podczas seksu', 'Mężczyźni częściej oddzielają seks od emocji, ale połączenie emocjonalne zwiększa ich satysfakcję', 'Emocje nie mają żadnego wpływu na seksualność mężczyzn'],
      },
      {
        text: 'Ile procent mężczyzn doświadczyło post-coital dysphoria (smutku po seksie)?',
        answer: 'Około 41%',
        options: ['Poniżej 1% – to wyłącznie kobiece zjawisko', 'Około 10%', 'Około 41%', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Co to jest "Madonna-Whore Complex"?',
        answer: 'Rozdzielenie kobiet na "dobre" do związku i "złe" do seksu',
        options: ['Kompleks Edypa u dorosłych mężczyzn', 'Rozdzielenie kobiet na "dobre" do związku i "złe" do seksu', 'Fetysz na muzykę i seksualność', 'Zaburzenie erekcji u mężczyzn pobożnych'],
      },
      {
        text: 'Ile procent mężczyzn doświadczyło przemocy seksualnej?',
        answer: 'Szacunkowo 10–15%',
        options: ['Poniżej 0,1%', 'Około 2%', 'Szacunkowo 10–15%', 'Tyle samo co kobiety – ~27%'],
      },
      {
        text: 'Jak mężczyźni reagują biologicznie na widok atrakcyjnej kobiety?',
        answer: 'Krótkoterminowy wzrost testosteronu i aktywacja układu nagrody',
        options: ['Wyłącznie reakcja psychologiczna bez zmian hormonalnych', 'Krótkoterminowy wzrost testosteronu i aktywacja układu nagrody', 'Wzrost kortyzolu wywołany ekscytacją', 'Brak jakichkolwiek biologicznych zmian'],
      },
      {
        text: 'Co mówią badania o mężczyznach i zakochaniu?',
        answer: 'Mężczyźni zakochują się szybciej (statystycznie) i mówią "kocham cię" jako pierwsi częściej niż kobiety',
        options: ['Mężczyźni nigdy się nie zakochują – to wyłącznie kobiecy fenomen', 'Kobiety zawsze zakochują się szybciej i mówią "kocham cię" pierwsze', 'Mężczyźni zakochują się szybciej (statystycznie) i mówią "kocham cię" jako pierwsi częściej niż kobiety', 'Zakochiwanie przebiega identycznie u obu płci'],
      },
      {
        text: 'Ile procent mężczyzn zgłasza problemy seksualne lekarzowi?',
        answer: 'Mniej niż 25%',
        options: ['Prawie wszyscy – zdrowie seksualne jest priorytetem', 'Około 60%', 'Mniej niż 25%', 'Tylko mężczyźni powyżej 60. roku życia'],
      },

      // ── MĘŻCZYŹNI W ZWIĄZKACH ────────────────────────────────────────────────
      {
        text: 'Jak mężczyźni przeżywają rozstanie w porównaniu z kobietami?',
        answer: 'Gorzej długoterminowo – kobiety lepiej przetwarzają emocje; mężczyźni tłumią i odkładają ból',
        options: ['Mężczyźni prawie wcale nie przeżywają rozstania', 'Identycznie jak kobiety – brak różnic', 'Gorzej długoterminowo – kobiety lepiej przetwarzają emocje; mężczyźni tłumią i odkładają ból', 'Mężczyźni szybciej wchodzą w nowe związki bo szybciej "zapominają"'],
      },
      {
        text: 'Ile procent mężczyzn zdradza w stałym związku?',
        answer: 'Szacunkowo 15–25%',
        options: ['Ponad 80%', 'Około 50%', 'Szacunkowo 15–25%', 'Poniżej 1%'],
      },
      {
        text: 'Co jest najczęstszą przyczyną niesatysfakcji seksualnej u mężczyzn w związkach?',
        answer: 'Zbyt rzadki seks i poczucie odrzucenia przez partnerkę',
        options: ['Brak orgazmu podczas stosunku', 'Zbyt rzadki seks i poczucie odrzucenia przez partnerkę', 'Zbyt monotonne pozycje seksualne', 'Brak atrakcyjności partnerki'],
      },
      {
        text: 'Jak ojcostwo wpływa na testosteron mężczyzny?',
        answer: 'Ojcowie mają statystycznie niższy testosteron',
        options: ['Ojcostwo podnosi testosteron przez większą odpowiedzialność', 'Ojcostwo nie wpływa na testosteron', 'Ojcowie mają statystycznie niższy testosteron', 'Testosteron rośnie przy pierwszym dziecku, potem spada'],
      },
      {
        text: 'Jak małżeństwo wpływa na poziom testosteronu mężczyzny?',
        answer: 'Żonaci mają statystycznie niższy testosteron niż kawalerowie',
        options: ['Małżeństwo podnosi poziom testosteronu', 'Nie ma żadnego wpływu na testosteron', 'Żonaci mają statystycznie niższy testosteron niż kawalerowie', 'Testosteron rośnie w pierwszym roku małżeństwa'],
      },
      {
        text: 'Ile procent mężczyzn inicjuje seks w swoich związkach?',
        answer: 'Około 60–70%',
        options: ['Prawie 100% – kobiety nigdy nie inicjują', 'Około 60–70%', 'Równo 50% – inicjatywa jest symetryczna', 'Kobiety inicjują seks częściej niż mężczyźni'],
      },

      // ── ZDROWIE SEKSUALNE MĘŻCZYZN ───────────────────────────────────────────
      {
        text: 'Jak regularna aktywność seksualna wpływa na zdrowie prostaty?',
        answer: '21+ ejakulacji miesięcznie obniża ryzyko raka prostaty',
        options: ['Aktywność seksualna niszczy prostatę', 'Nie ma żadnego wpływu na prostatę', '21+ ejakulacji miesięcznie obniża ryzyko raka prostaty', 'Abstynencja chroni prostatę najlepiej'],
      },
      {
        text: 'Jak seks wpływa na układ sercowo-naczyniowy mężczyzny?',
        answer: 'Seks 2× tygodniowo zmniejsza ryzyko zawału serca',
        options: ['Seks obciąża serce i zwiększa ryzyko zawału', 'Nie ma wpływu na układ sercowo-naczyniowy', 'Seks 2× tygodniowo zmniejsza ryzyko zawału serca', 'Seks wpływa tylko na serce kobiet, nie mężczyzn'],
      },
      {
        text: 'Jak zaburzenia erekcji mogą być wczesnym sygnałem innych chorób?',
        answer: 'ED jest często pierwszym objawem chorób sercowo-naczyniowych, cukrzycy lub nadciśnienia',
        options: ['ED jest wyłącznie problemem psychologicznym', 'ED nie ma związku z innymi chorobami', 'ED jest często pierwszym objawem chorób sercowo-naczyniowych, cukrzycy lub nadciśnienia', 'ED sygnalizuje wyłącznie niedobór cynku'],
      },
      {
        text: 'Ile procent mężczyzn regularnie bada swoje jądra samodzielnie?',
        answer: 'Mniej niż 25%',
        options: ['Prawie wszyscy – ~90%', 'Około 50%', 'Mniej niż 25%', 'Samobadanie jąder nie jest zalecane'],
      },
      {
        text: 'Ile procent mężczyzn pali tytoń i jak to wpływa na seksualność?',
        answer: 'Palacze mają o 40–50% wyższe ryzyko ED',
        options: ['Palenie nie wpływa na seksualność mężczyzn', 'Palacze mają lepsze erekcje przez wzrost adrenaliny', 'Palacze mają o 40–50% wyższe ryzyko ED', 'Palenie wpływa wyłącznie na nasienie, nie erekcję'],
      },
      {
        text: 'Co to jest zapalenie gruczołu krokowego (prostatitis) i jak często dotyka mężczyzn?',
        answer: 'Ból i zapalenie gruczołu krokowego',
        options: ['Złośliwy rak prostaty', 'Ból i zapalenie gruczołu krokowego', 'Dotyczy jedynie mężczyzn po 70. roku życia', 'Rzadka choroba – poniżej 1% mężczyzn'],
      },

      // ── MĘŻCZYŹNI I PORNOGRAFIA ──────────────────────────────────────────────
      {
        text: 'Ile procent mężczyzn regularnie ogląda pornografię?',
        answer: 'Około 70–75%',
        options: ['Około 10%', 'Około 40%', 'Około 70–75%', 'Prawie 100%'],
      },
      {
        text: 'Jak regularne oglądanie pornografii wpływa na mózg mężczyzny?',
        answer: 'Stępienie układu nagrody – potrzeba silniejszych bodźców',
        options: ['Poprawia sprawność mózgu przez ciągłą stymulację', 'Stępienie układu nagrody – potrzeba silniejszych bodźców', 'Brak wpływu na mózg – to tylko rozrywka', 'Pornografia zwiększa empatię przez obserwację emocji'],
      },
      {
        text: 'Co to jest PIED (Porn-Induced Erectile Dysfunction)?',
        answer: 'Zaburzenia erekcji spowodowane uzależnieniem od pornografii',
        options: ['Erekcja wywołana myśleniem o pornografii', 'Zaburzenia erekcji spowodowane uzależnieniem od pornografii', 'Stan po obejrzeniu zbyt dużo pornografii naraz', 'Normalna adaptacja układu nerwowego do podniet'],
      },
      {
        text: 'Ile procent mężczyzn uważa się za uzależnionych od pornografii?',
        answer: 'Około 8–10% regularnych użytkowników',
        options: ['Poniżej 0,1%', 'Około 2%', 'Około 8–10% regularnych użytkowników', 'Ponad 50%'],
      },
      {
        text: 'W jakim wieku mężczyźni najczęściej po raz pierwszy oglądają pornografię?',
        answer: 'Między 11 a 13 rokiem życia',
        options: ['Dopiero po 18. roku życia', 'Między 15 a 17 rokiem życia', 'Między 11 a 13 rokiem życia', 'Dopiero w dorosłości po 20. roku życia'],
      },

      // ── MĘŻCZYŹNI W LICZBACH – CIEKAWOSTKI ──────────────────────────────────
      {
        text: 'Ile razy przeciętny mężczyzna uprawia seks w ciągu życia?',
        answer: 'Około 5 000–6 000 razy',
        options: ['Około 100 razy', 'Około 1 000 razy', 'Około 5 000–6 000 razy', 'Ponad 100 000 razy'],
      },
      {
        text: 'Ile czasu w ciągu życia przeciętny mężczyzna spędza na seksie?',
        answer: 'Około 1% aktywnego życia',
        options: ['Ponad 10% życia', 'Około 5% życia', 'Około 1% aktywnego życia', 'Mniej niż godzina łącznie'],
      },
      {
        text: 'Co to jest wazektomia i jak skuteczna jest jako metoda antykoncepcji?',
        answer: 'Przecięcie lub podwiązanie nasieniowodów',
        options: ['Chemiczne blokowanie testosteronu', 'Chirurgiczne usunięcie jąder', 'Przecięcie lub podwiązanie nasieniowodów', 'Zastrzyk hormonalny podawany co miesiąc'],
      },
      {
        text: 'Ile procent mężczyzn decyduje się na wazektomię w Polsce?',
        answer: 'Bardzo mało – poniżej 1%',
        options: ['Prawie wszyscy mężczyźni po 40. roku życia', 'Około 30%', 'Około 10% – jak w USA', 'Bardzo mało – poniżej 1%'],
      },
      {
        text: 'Które zwierzę domowe jest najczęściej kojarzone z obniżonym testosteronem u właściciela?',
        answer: 'Żadne – to mit, brak takiego związku',
        options: ['Kot – felinofilia obniża testosteron', 'Pies – właściciele psów mają niższy testosteron', 'Żadne – to mit, brak takiego związku', 'Chomik – udowodniono to laboratoryjnie'],
      },
      {
        text: 'Co to jest "Movember" i czego dotyczy?',
        answer: 'Listopadowa kampania na rzecz zdrowia mężczyzn',
        options: ['Kampania promująca brody u mężczyzn', 'Miesiąc walki z otyłością u mężczyzn', 'Listopadowa kampania na rzecz zdrowia mężczyzn', 'Akcja promująca mężczyzn w kuchni'],
      },

      // ── MĘŻCZYŹNI I STAROŚĆ ──────────────────────────────────────────────────
      {
        text: 'Ile procent mężczyzn po 70. roku życia doświadcza zaburzeń erekcji?',
        answer: 'Około 70%',
        options: ['Poniżej 5%', 'Około 30%', 'Około 70%', 'Prawie wszyscy – ~99%'],
      },
      {
        text: 'Ile procent mężczyzn po 70. roku życia jest aktywnych seksualnie?',
        answer: 'Około 40–50%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 40–50%', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Jak zmienia się orgazm mężczyzny z wiekiem?',
        answer: 'Mniej intensywny i wolniejszy, ale wciąż możliwy',
        options: ['Orgazm staje się silniejszy z doświadczeniem', 'Orgazm całkowicie zanika po 60. roku życia', 'Mniej intensywny i wolniejszy, ale wciąż możliwy', 'Wiek nie wpływa na orgazm mężczyzny'],
      },
      {
        text: 'Jak testosterone replacement therapy (TRT) wpływa na mężczyzn po andropauzie?',
        answer: 'Poprawia libido i erekcję, ale wymaga kontroli',
        options: ['Całkowicie eliminuje starzenie się seksualne', 'Poprawia libido i erekcję, ale wymaga kontroli', 'Jest nieskuteczna u mężczyzn po 60. roku życia', 'TRT jest całkowicie nielegalna w Polsce'],
      },
      {
        text: 'Ile lat żyją mężczyźni statystycznie krócej od kobiet?',
        answer: 'Około 5–7 lat krócej',
        options: ['Mężczyźni żyją dłużej niż kobiety', 'Różnica wynosi poniżej roku', 'Około 5–7 lat krócej', 'Ponad 20 lat krócej'],
      },
      {
        text: 'Dlaczego mężczyźni statystycznie żyją krócej?',
        answer: 'Choroby serca, wypadki i rzadsze leczenie',
        options: ['Biologicznie słabszy układ odpornościowy', 'Choroby serca, wypadki i rzadsze leczenie', 'Wyłącznie palenie tytoniu', 'Hormony męskie bezpośrednio skracają życie'],
      },

      // ── MĘŻCZYŹNI VS KOBIETY – RÓŻNICE SEKSUALNE ────────────────────────────
      {
        text: 'Kto jest bardziej wzrokowcem seksualnym – mężczyzna czy kobieta?',
        answer: 'Mężczyźni – silniej reagują na bodźce wizualne',
        options: ['Kobiety – wzrok jest ważniejszy dla ich stymulacji', 'Mężczyźni – silniej reagują na bodźce wizualne', 'Nie ma różnicy – obie płci jednakowo', 'Żadna płeć – dotyk jest ważniejszy niż wzrok'],
      },
      {
        text: 'Jak mężczyźni i kobiety różnią się w zakresie fantazji seksualnych?',
        answer: 'Mężczyźni częściej fantazjują o nowych partnerach i sytuacjach wizualnych; kobiety o kontekście emocjonalnym',
        options: ['Mężczyźni i kobiety mają identyczne fantazje', 'Kobiety fantazjują znacznie częściej niż mężczyźni', 'Mężczyźni częściej fantazjują o nowych partnerach i sytuacjach wizualnych; kobiety o kontekście emocjonalnym', 'Mężczyźni nie mają fantazji – reagują tylko na bodźce fizyczne'],
      },
      {
        text: 'Ile razy szybciej mężczyźni się podniecają wizualnie niż kobiety?',
        answer: 'Mężczyźni reagują na obraz w ~0,2 sekundy',
        options: ['Kobiety reagują szybciej niż mężczyźni', 'Obie płcie reagują identycznie szybko', 'Mężczyźni reagują na obraz w ~0,2 sekundy', 'Mężczyźni reagują 100× wolniej – potrzebują kontekstu'],
      },
      {
        text: 'Jak różni się komunikacja seksualna między mężczyznami a kobietami w związkach?',
        answer: 'Mężczyźni rzadziej inicjują rozmowę o problemach seksualnych – statystycznie gorzej komunikują potrzeby',
        options: ['Mężczyźni komunikują potrzeby seksualne częściej niż kobiety', 'Brak różnicy – obie płci komunikują równie dobrze', 'Mężczyźni rzadziej inicjują rozmowę o problemach seksualnych – statystycznie gorzej komunikują potrzeby', 'Kobiety są niezdolne do rozmowy o seksie'],
      },
      {
        text: 'Ile procent mężczyzn jest gotowych na seks z atrakcyjną nieznajomą wg klasycznych badań (Clark & Hatfield 1989)?',
        answer: 'Około 75%',
        options: ['Około 10%', 'Około 40%', 'Około 75%', 'Prawie wszyscy – ~99%'],
      },
      {
        text: 'Co mówi ewolucja o różnicach seksualnych mężczyzn i kobiet?',
        answer: 'Mężczyźni preferują liczność partnerek, kobiety – jakość',
        options: ['Ewolucja nie wpłynęła na preferencje seksualne', 'Mężczyźni i kobiety mają identyczne strategie seksualne', 'Mężczyźni preferują liczność partnerek, kobiety – jakość', 'Kobiety preferują liczność partnerów, mężczyźni – jedną'],
      },
      // Seksualność – dodatkowe fakty
      {
        text: 'Ile cm wynosi średni obwód (circumference) penisa wg BJUI 2015?',
        answer: 'Około 11,66 cm',
        options: ['Około 8 cm', 'Około 9,5 cm', 'Około 11,66 cm', 'Około 14 cm'],
      },
      {
        text: 'W którym roku penis po raz pierwszy zmierzono klinicznie w dużej próbie?',
        answer: '2015 – badanie BJUI, n = 15 521 mężczyzn',
        options: ['1948 – Kinsey Institute', '1966 – Masters & Johnson', '2015 – badanie BJUI, n = 15 521 mężczyzn', '2001 – WHO'],
      },
      {
        text: 'Jaki procent mężczyzn ma penisa krótszego niż 10 cm w erekcji?',
        answer: 'Około 2,28%',
        options: ['Około 15%', 'Około 10%', 'Około 5%', 'Około 2,28%'],
      },
      {
        text: 'Co oznacza termin "efekt szatni" (locker room effect) w kontekście penisa?',
        answer: 'Złudzenie, że inni mają większy penis – przez perspektywę',
        options: ['Strach przed rozebranием się przy innych mężczyznach', 'Efekt powiększenia penisa przez zimną wodę', 'Złudzenie, że inni mają większy penis – przez perspektywę', 'Rywalizacja seksualna w środowiskach sportowych'],
      },
      {
        text: 'Ile procent mężczyzn ma penisa "grower" (rośnie znacznie przy erekcji) vs "shower" (prawie bez zmiany)?',
        answer: 'Około 79% to "growers", 21% to "showers"',
        options: ['50% growers, 50% showers', 'Około 30% growers, 70% showers', 'Około 79% to "growers", 21% to "showers"', 'Niemal wszyscy to "showers"'],
      },
      {
        text: 'Jak długo trwa przeciętna erekcja poranna (morning wood)?',
        answer: 'Od kilku do 30 minut',
        options: ['Zawsze dokładnie 5 minut', 'Od kilku do 30 minut', 'Tylko jeśli mężczyzna ma sen erotyczny', 'Maksymalnie 2 minuty'],
      },
      {
        text: 'Jaki jest najdłuższy udokumentowany medycznie czas trwania erekcji?',
        answer: 'Ponad 96 godzin (opisany przypadek priapizmu)',
        options: ['Maksymalnie 6 godzin', 'Ponad 96 godzin (opisany przypadek priapizmu)', 'Rekord to 24 godziny', 'Medycyna nie mierzy tego parametru'],
      },
      {
        text: 'Co to jest "penile plethysmography"?',
        answer: 'Urządzenie mierzące zmiany obwodu penisa',
        options: ['Operacja plastyczna penisa', 'Lek na zaburzenia erekcji', 'Urządzenie mierzące zmiany obwodu penisa', 'Technika tatuażu na penisie'],
      },
      {
        text: 'Ile milionów plemników traci mężczyzna przy jednym wytrysku?',
        answer: 'Średnio 200–500 milionów',
        options: ['Kilka tysięcy', 'Około 1 milion', 'Średnio 200–500 milionów', 'Ponad miliard'],
      },
      {
        text: 'Jak wysoka temperatura niszczy produkcję plemników?',
        answer: 'Już 1–2°C powyżej normy obniża spermatogenezę',
        options: ['Dopiero powyżej 50°C', 'Temperatura nie wpływa na spermatogenezę', 'Już 1–2°C powyżej normy obniża spermatogenezę', 'Niskie temperatury są groźniejsze niż wysokie'],
      },
      {
        text: 'Ile dni żyją plemniki w żeńskim układzie rozrodczym?',
        answer: 'Do 5 dni',
        options: ['Maksymalnie kilka godzin', 'Dokładnie 24 godziny', 'Do 5 dni', 'Do 2 tygodni'],
      },
      {
        text: 'Jakie białko chroni plemniki przed atakiem układu odpornościowego kobiety?',
        answer: 'Białka powłoki CD52 i immunosupresyjne prostaglandyny',
        options: ['Chroni je bezpośrednio testosteron', 'Wystarczy kwaśne pH pochwy', 'Białka powłoki CD52 i immunosupresyjne prostaglandyny', 'Plemniki są całkowicie bezbronne'],
      },
      {
        text: 'Co to jest azoospermia?',
        answer: 'Całkowity brak plemników w ejakulacie',
        options: ['Ból odczuwany podczas wytrysku', 'Nadmiar plemników szkodzący płodności', 'Całkowity brak plemników w ejakulacie', 'Rzadka alergia na własną spermę'],
      },
      {
        text: 'Ile czasu zajmuje produkcja jednego dojrzałego plemnika (spermatogeneza)?',
        answer: 'Około 64–74 dni',
        options: ['24 godziny', 'Około 7 dni', 'Około 64–74 dni', 'Ponad rok'],
      },
      {
        text: 'Jak stres wpływa na jakość spermy?',
        answer: 'Kortyzol obniża testosteron i upośledza spermatogenezę',
        options: ['Stres poprawia mobilność plemników', 'Brak udokumentowanego wpływu', 'Kortyzol obniża testosteron i upośledza spermatogenezę', 'Stres wpływa tylko na libido, nie na spermę'],
      },
      {
        text: 'Jaka jest prawidłowa objętość ejakulatu wg WHO 2021?',
        answer: 'Co najmniej 1,4 ml',
        options: ['Co najmniej 5 ml', 'Co najmniej 3 ml', 'Co najmniej 1,4 ml', 'Objętość nie ma znaczenia klinicznego'],
      },
      {
        text: 'Który składnik prostaty odpowiada za charakterystyczny zapach spermy?',
        answer: 'Spermina i spermidyna (poliaminy)',
        options: ['Testosteron wydzielany do ejakulatu', 'Fruktoza z pęcherzyków nasiennych', 'Spermina i spermidyna (poliaminy)', 'Kwas cytrynowy'],
      },
      {
        text: 'Co to jest varicocele i jak wpływa na płodność?',
        answer: 'Żylaki powrózka nasiennego podwyższające temperaturę jądra',
        options: ['Bakteryjne zapalenie najądrza niezwiązane z płodnością', 'Łagodna torbiel najądrza bez wpływu na płodność', 'Żylaki powrózka nasiennego podwyższające temperaturę jądra', 'Wrodzona wada gruczołu krokowego'],
      },
      {
        text: 'Ile wynosi prawidłowe pH ejakulatu?',
        answer: '7,2–8,0 (lekko zasadowe)',
        options: ['4,0–5,0 (kwaśne)', '6,0–6,5 (lekko kwaśne)', '7,2–8,0 (lekko zasadowe)', 'Powyżej 9 (silnie zasadowe)'],
      },
      {
        text: 'Czym jest PSA (prostate-specific antigen) i dlaczego jest ważny?',
        answer: 'Białko prostaty – jego wzrost może wskazywać na raka',
        options: ['Hormon produkowany przez jądra', 'Enzym w spermie rozkładający DNA', 'Białko prostaty – jego wzrost może wskazywać na raka', 'Substancja chroniąca przed STI'],
      },
      {
        text: 'W jakim wieku ryzyko raka prostaty znacznie wzrasta?',
        answer: 'Po 50. roku życia',
        options: ['Już po 30. roku życia', 'Po 40. roku życia', 'Po 50. roku życia', 'Ryzyko jest równomiernie rozłożone w całym życiu'],
      },
      {
        text: 'Co to jest BPH (benign prostatic hyperplasia)?',
        answer: 'Łagodny przerost prostaty utrudniający oddawanie moczu',
        options: ['Rak prostaty w stadium I', 'Łagodny przerost prostaty utrudniający oddawanie moczu', 'Zapalenie pęcherza moczowego u mężczyzn', 'Wrodzona genetyczna wada prącia'],
      },
      {
        text: 'Jak alkohol wpływa na poziom testosteronu?',
        answer: 'Hamuje produkcję testosteronu w jądrach',
        options: ['Alkohol tymczasowo zwiększa testosteron', 'Brak udokumentowanego wpływu', 'Hamuje produkcję testosteronu w jądrach', 'Tylko piwo obniża testosteron'],
      },
      {
        text: 'Jak otyłość wpływa na poziom testosteronu?',
        answer: 'Tkanka tłuszczowa zamienia testosteron w estradiol',
        options: ['Otyłość nie wpływa na hormony płciowe', 'Otyłość zwiększa testosteron przez większą masę mięśniową', 'Tkanka tłuszczowa zamienia testosteron w estradiol', 'Wpływa tylko na libido, nie na T'],
      },
      {
        text: 'Czym jest "testosterone replacement therapy" (TRT) i kto jej potrzebuje?',
        answer: 'Terapia hormonalna dla mężczyzn z hipogonadyzmem',
        options: ['Suplementacja dla wszystkich mężczyzn po 40.', 'Kuracja odchudzająca oparta na hormonach', 'Terapia hormonalna dla mężczyzn z hipogonadyzmem', 'Eksperymentalna terapia antyrakowa'],
      },
      {
        text: 'Co to jest "low T" (niski testosteron) i jakie ma objawy?',
        answer: 'Testosteron poniżej 300 ng/dl z objawami',
        options: ['Choroba autoimmunologiczna jąder', 'Testosteron poniżej 300 ng/dl z objawami', 'Zjawisko wyłącznie u mężczyzn po 70.', 'Stan wymagający natychmiastowej operacji'],
      },
      {
        text: 'O ile procent spada testosteron przeciętnie na dekadę po 30. roku życia?',
        answer: 'Około 1–2% rocznie',
        options: ['Około 0,1% rocznie – zmiany minimalne', 'Około 5% rocznie', 'Około 1–2% rocznie', 'Spada jednorazowo w czasie andropauzy'],
      },
      {
        text: 'Ile godzin snu potrzebuje mężczyzna, by testosteron był optymalny?',
        answer: 'Minimum 7–8 godzin',
        options: ['4–5 godzin wystarczy', '6 godzin jest idealne', 'Minimum 7–8 godzin', 'Sen nie wpływa na hormony płciowe'],
      },
      {
        text: 'Jak ćwiczenia wpływają na testosteron?',
        answer: 'Trening oporowy krótkoterminowo podnosi testosteron',
        options: ['Tylko cardio podnosi testosteron', 'Ćwiczenia nie wpływają na T', 'Trening oporowy krótkoterminowo podnosi testosteron', 'Wszystkie formy ruchu obniżają T'],
      },
      {
        text: 'Jaki sport wiąże się z najwyższym testosteronem przed zawodami?',
        answer: 'Sporty walki (boks, zapasy, MMA) – wzrost T przed starciem',
        options: ['Maratony – endorfiny i T rosną razem', 'Szachy – napięcie umysłowe podnosi T', 'Golf – spokój sprzyja hormonom', 'Sporty walki (boks, zapasy, MMA) – wzrost T przed starciem'],
      },
      {
        text: 'Jak zwycięstwo lub porażka wpływa na testosteron mężczyzn?',
        answer: 'Zwycięstwo podnosi T, porażka go obniża',
        options: ['Wyniki nie mają wpływu na hormony', 'Tylko sport wyczynowy wywołuje zmianę T', 'Zwycięstwo podnosi T, porażka go obniża', 'T rośnie wyłącznie po wysiłku, nie po sukcesie'],
      },
      {
        text: 'Co to jest "dominance hierarchy" w kontekście testosteronu?',
        answer: 'Hierarchia, w której wyższy status wiąże się z wyższym T',
        options: ['Wojskowy termin niezwiązany z hormonami', 'Hierarchia dominuje tylko u zwierząt, nie u ludzi', 'Hierarchia, w której wyższy status wiąże się z wyższym T', 'Status obniża T przez stres'],
      },
      {
        text: 'Ile procent polskich mężczyzn przyznaje się do masturbacji wg badań CBOS?',
        answer: 'Około 70–75%',
        options: ['Około 20%', 'Około 40%', 'Około 70–75%', 'Prawie 100%'],
      },
      {
        text: 'Jak częsta masturbacja definiuje "compulsive sexual behavior" (CSB)?',
        answer: 'Nie ma jednej liczby – liczy się dyskomfort i utrata kontroli',
        options: ['Powyżej 3 razy dziennie to automatycznie zaburzenie', 'Powyżej 7 razy tygodniowo', 'Nie ma jednej liczby – liczy się dyskomfort i utrata kontroli', 'Masturbacja nigdy nie jest problemem klinicznym'],
      },
      {
        text: 'Jak pornografia wpływa na dopaminę?',
        answer: 'Aktywuje szlak nagrody jak substancje uzależniające',
        options: ['Pornografia obniża poziom dopaminy', 'Brak wpływu na układ nagrody', 'Aktywuje szlak nagrody jak substancje uzależniające', 'Tylko długie seanse zmieniają dopaminę'],
      },
      {
        text: 'Czym jest "death grip syndrome" w kontekście masturbacji?',
        answer: 'Przyzwyczajenie do zbyt silnego ucisku przy masturbacji',
        options: ['Ból erekcji spowodowany zbyt ciasną skórą', 'Syndrom lęku przed seksualnością', 'Przyzwyczajenie do zbyt silnego ucisku przy masturbacji', 'Termin nieistniejący w seksuologii'],
      },
      {
        text: 'Ile czasu trwa przeciętny seks heteroseksualny wg badań IELT (intravaginal ejaculation latency time)?',
        answer: 'Mediana ok. 5,4 minuty',
        options: ['Około 1–2 minut', 'Około 15–20 minut', 'Mediana ok. 5,4 minuty', 'Ponad 30 minut'],
      },
      {
        text: 'Ile procent mężczyzn doświadcza zaburzeń erekcji w wieku 40–49 lat?',
        answer: 'Około 12–15%',
        options: ['Poniżej 1%', 'Około 5%', 'Około 12–15%', 'Ponad 50%'],
      },
      {
        text: 'Jaki jest mechanizm działania sildenafilu (Viagra)?',
        answer: 'Blokuje PDE5, zwiększając napływ krwi do ciał jamistych',
        options: ['Bezpośrednia stymulacja nerwów w penisie', 'Wzrost testosteronu na czas działania tabletki', 'Blokuje PDE5, zwiększając napływ krwi do ciał jamistych', 'Blokada receptorów serotoninowych'],
      },
      {
        text: 'Czym jest "psychogenic erectile dysfunction"?',
        answer: 'ED z przyczyn psychologicznych przy sprawnej fizjologii',
        options: ['ED występujące wyłącznie u starszych mężczyzn', 'ED spowodowane urazem rdzenia kręgowego', 'ED z przyczyn psychologicznych przy sprawnej fizjologii', 'ED będące skutkiem leczenia raka'],
      },
      {
        text: 'Jaki odsetek przypadków ED ma podłoże naczyniowe?',
        answer: 'Około 50–70%',
        options: ['Poniżej 10%', 'Około 20–30%', 'Około 50–70%', 'Prawie 100% to podłoże psychogenne'],
      },
      {
        text: 'Co to jest "nocturnal penile tumescence test" (NPT)?',
        answer: 'Badanie nocnych erekcji różnicujące przyczyny ED',
        options: ['Test na raka prostaty', 'Badanie przepływu krwi w penisie na czczo', 'Badanie nocnych erekcji różnicujące przyczyny ED', 'Ultrasonografia jąder'],
      },
      {
        text: 'Jak cukrzyca wpływa na funkcje seksualne mężczyzny?',
        answer: 'Uszkadza naczynia i nerwy penisa – ryzyko ED 3× wyższe',
        options: ['Cukrzyca zwiększa libido przez podwyższony cukier', 'Wpływa tylko na płodność, nie na erekcję', 'Uszkadza naczynia i nerwy penisa – ryzyko ED 3× wyższe', 'Brak udokumentowanego związku'],
      },
      {
        text: 'Ile procent mężczyzn po radykalnej prostatektomii odzyskuje pełną potencję?',
        answer: 'Około 40–70% przy operacji oszczędzającej nerwy',
        options: ['Prawie wszyscy – 95%', 'Poniżej 10%', 'Około 40–70% przy operacji oszczędzającej nerwy', 'Potencja nigdy nie wraca po tej operacji'],
      },
      {
        text: 'Co to jest priapizm i dlaczego jest stanem nagłym?',
        answer: 'Przedłużona erekcja (>4 godz.) niezwiązana z podnieceniem',
        options: ['Ból podczas wytrysku u starszych mężczyzn', 'Złośliwa zmiana na penisie', 'Przedłużona erekcja (>4 godz.) niezwiązana z podnieceniem', 'Zapalenie żołędzi prącia'],
      },
      {
        text: 'Jaka jest najczęstsza przyczyna zakrzywienia penisa u dorosłych mężczyzn?',
        answer: 'Choroba Peyroniego – blizny w ciałach jamistych',
        options: ['Wada wrodzona chromosomalna', 'Niedobór testosteronu w dzieciństwie', 'Choroba Peyroniego – blizny w ciałach jamistych', 'Infekcja HPV penisa'],
      },
      {
        text: 'Jak ciasny napletek (fimoza) wpływa na zdrowie seksualne mężczyzny?',
        answer: 'Może powodować ból, utrudniać higienę i sprzyjać infekcjom',
        options: ['Fimoza nie ma wpływu na seksualność', 'Fimoza zawsze wymaga natychmiastowej operacji', 'Może powodować ból, utrudniać higienę i sprzyjać infekcjom', 'Fimoza znika samoistnie po 30. roku życia'],
      },
      {
        text: 'Czym jest "hypersexuality" (hiperseksualność) i jak się ją diagnozuje?',
        answer: 'Niekontrolowane zachowania seksualne zaburzające funkcjonowanie',
        options: ['Posiadanie libido powyżej przeciętnej', 'Każda relacja z więcej niż jedną partnerką', 'Niekontrolowane zachowania seksualne zaburzające funkcjonowanie', 'Stan wymagający leczenia testosteronem'],
      },
      {
        text: 'Jaki procent mężczyzn doświadcza anorgazmii (trudności z osiągnięciem orgazmu)?',
        answer: 'Około 5–10%',
        options: ['Poniżej 0,1% – to właściwie niemożliwe', 'Ponad 30%', 'Dokładnie 2%', 'Około 5–10%'],
      },
      {
        text: 'Jak SSRI (antydepresanty) wpływają na funkcje seksualne mężczyzn?',
        answer: 'U ok. 30–40% opóźniają ejakulację i obniżają libido',
        options: ['SSRI nie wpływają na funkcje seksualne', 'SSRI poprawiają libido przez poprawę nastroju', 'U ok. 30–40% opóźniają ejakulację i obniżają libido', 'SSRI wywołują priapizm u większości mężczyzn'],
      },
      {
        text: 'Czym jest "post-SSRI sexual dysfunction" (PSSD)?',
        answer: 'Zaburzenie seksualne utrzymujące się po odstawieniu SSRI',
        options: ['Zaburzenie erekcji wyłącznie w trakcie leczenia SSRI', 'Mit stworzony przez internet', 'Zaburzenie seksualne utrzymujące się po odstawieniu SSRI', 'Termin oznaczający zbyt częste stosunki po lekach'],
      },
      {
        text: 'Jak opiaty wpływają na testosteron i libido?',
        answer: 'Hamują oś hormonalną, drastycznie obniżając libido',
        options: ['Opiaty nie wpływają na układ hormonalny', 'Opiaty krótkotrwale podnoszą testosteron', 'Hamują oś hormonalną, drastycznie obniżając libido', 'Tylko heroina wpływa na hormony, nie leki'],
      },
      {
        text: 'Co to jest andropauza i czy jest odpowiednikiem menopauzy?',
        answer: 'Powolny spadek T z wiekiem, bez nagłej utraty płodności',
        options: ['Dokładny odpowiednik menopauzy – nagłe zatrzymanie T', 'Andropauza nie istnieje naukowo', 'Powolny spadek T z wiekiem, bez nagłej utraty płodności', 'Andropauza pojawia się tylko po 80. roku życia'],
      },
      // Uzupełnienie – 26 dodatkowych pytań
      {
        text: 'Ile procent mężczyzn nigdy nie odwiedza urologa w ciągu życia mimo wskazań?',
        answer: 'Ponad 60% zwleka ponad rok z wizytą',
        options: ['Poniżej 10% – mężczyźni regularnie chodzą do specjalistów', 'Około 30%', 'Ponad 60% zwleka ponad rok z wizytą', 'Prawie wszyscy zgłaszają się natychmiast'],
      },
      {
        text: 'Czym jest "male factor infertility" i jak często jest przyczyną problemu pary?',
        answer: 'Czynnik męski to ok. 40–50% przypadków',
        options: ['Czynnik męski to mniej niż 5% przypadków', 'Czynnik męski dotyczy wyłącznie mężczyzn po 50.', 'Czynnik męski to ok. 40–50% przypadków', 'Niepłodność jest zawsze po obu stronach równo'],
      },
      {
        text: 'Co to jest "retrograde ejaculation" (wsteczny wytrysk)?',
        answer: 'Nasienie cofa się do pęcherza – "suchy orgazm"',
        options: ['Przedwczesny wytrysk wywołany stresem', 'Ból podczas orgazmu bez wytrysku', 'Nasienie cofa się do pęcherza – "suchy orgazm"', 'Wytrysk bez orgazmu u starszych mężczyzn'],
      },
      {
        text: 'Jak noszenie obcisłej bielizny wpływa na płodność?',
        answer: 'Podnosi temperaturę moszny i może obniżyć jakość spermy',
        options: ['Bielizna nie ma żadnego wpływu na spermę', 'Tylko bokserki wpływają na płodność, nie slipy', 'Podnosi temperaturę moszny i może obniżyć jakość spermy', 'Efekt jest odwrotny – ucisk poprawia spermatogenezę'],
      },
      {
        text: 'Ile procent mężczyzn doświadczyło w życiu co najmniej jednego orgazmu wielokrotnego?',
        answer: 'Około 10–20% mężczyzn',
        options: ['Mężczyźni biologicznie nie są do tego zdolni', 'Prawie wszyscy – to norma biologiczna', 'Około 10–20% mężczyzn', 'Wyłącznie mężczyźni po wazektomii'],
      },
      {
        text: 'Co to jest "inhibited ejaculation" (zahamowany wytrysk) i jak często występuje?',
        answer: 'Trudność z wytryskiem mimo pełnej erekcji',
        options: ['To to samo co przedwczesny wytrysk', 'Dotyczy prawie wszystkich mężczyzn po 60.', 'Trudność z wytryskiem mimo pełnej erekcji', 'Stan wyłącznie po operacji prostaty'],
      },
      {
        text: 'Ile wynosi przeciętna objętość jąder u dorosłego mężczyzny?',
        answer: 'Około 15–25 ml każde',
        options: ['Około 5 ml', 'Około 50–100 ml', 'Około 15–25 ml każde', 'Objętość nie ma znaczenia klinicznego'],
      },
      {
        text: 'Czym różni się lewe jądro od prawego anatomicznie?',
        answer: 'Lewe zwisa niżej u większości mężczyzn',
        options: ['Prawe jest zawsze większe u wszystkich mężczyzn', 'Oba jądra są identyczne – asymetria jest patologią', 'Lewe zwisa niżej u większości mężczyzn', 'Lewa strona produkuje więcej testosteronu'],
      },
      {
        text: 'Co to jest kryptorchizm i jak wpływa na płodność?',
        answer: 'Niezstąpienie jądra do moszny w rozwoju',
        options: ['Łagodna torbiel jądra bez wpływu na płodność', 'Zapalenie najądrza u chłopców', 'Niezstąpienie jądra do moszny w rozwoju', 'Stan samoistnie ustępujący w wieku dojrzewania'],
      },
      {
        text: 'Jaka jest pięcioletnia przeżywalność przy raku jądra wykrytym w stadium I?',
        answer: 'Ponad 99%',
        options: ['Około 50%', 'Około 75%', 'Ponad 99%', 'Rak jądra jest praktycznie nieuleczalny'],
      },
      {
        text: 'Jak często mężczyźni powinni wykonywać samobadanie jąder?',
        answer: 'Co miesiąc, najlepiej po ciepłej kąpieli',
        options: ['Raz w roku przy kontroli lekarskiej', 'Codziennie rano', 'Co miesiąc, najlepiej po ciepłej kąpieli', 'Samobadanie jąder nie jest zalecane'],
      },
      {
        text: 'Jak palenie papierosów wpływa na jakość spermy?',
        answer: 'Obniża ruchliwość plemników i uszkadza DNA spermy',
        options: ['Palenie poprawia ruchliwość plemników', 'Brak udokumentowanego wpływu na spermę', 'Obniża ruchliwość plemników i uszkadza DNA spermy', 'Tylko bierne palenie wpływa na płodność'],
      },
      {
        text: 'Jak dieta śródziemnomorska wpływa na zdrowie seksualne mężczyzn?',
        answer: 'Niższe ryzyko ED, wyższy T i lepsza jakość spermy',
        options: ['Dieta nie wpływa na zdrowie seksualne', 'Dieta wysokobiałkowa jest lepsza', 'Niższe ryzyko ED, wyższy T i lepsza jakość spermy', 'Obniża testosteron przez dużo tłuszczy'],
      },
      {
        text: 'Jaki minerał jest najważniejszy dla produkcji testosteronu i spermy?',
        answer: 'Cynk – jego niedobór obniża T i jakość spermy',
        options: ['Żelazo – kluczowe dla transportu tlenu do jąder', 'Wapń – buduje strukturę plemników', 'Cynk – jego niedobór obniża T i jakość spermy', 'Magnez – reguluje poziom estrogenu'],
      },
      {
        text: 'Jak sauna wpływa na płodność mężczyzny?',
        answer: 'Może tymczasowo obniżyć liczbę i ruchliwość plemników',
        options: ['Poprawia jakość spermy przez rozluźnienie mięśni', 'Brak wpływu na spermę', 'Może tymczasowo obniżyć liczbę i ruchliwość plemników', 'Trwale niszczy zdolność do produkcji spermy'],
      },
      {
        text: 'Ile procent mężczyzn używa prezerwatyw podczas każdego stosunku z nową partnerką?',
        answer: 'Tylko ok. 30–40%',
        options: ['Prawie wszyscy – ponad 90%', 'Około 70%', 'Tylko ok. 30–40%', 'Poniżej 10%'],
      },
      {
        text: 'Jak wazektomia wpływa na życie seksualne mężczyzny?',
        answer: 'Nie zmienia libido, erekcji ani orgazmu',
        options: ['Wazektomia trwale obniża testosteron', 'Wazektomia eliminuje orgazm', 'Nie zmienia libido, erekcji ani orgazmu', 'Powoduje chroniczny ból przez blizny'],
      },
      {
        text: 'Jaki procent wazektomii można skutecznie odwrócić (vasovasostomy)?',
        answer: 'Ok. 70–90% do 3 lat po zabiegu',
        options: ['Wazektomia jest całkowicie nieodwracalna', 'Prawie zawsze – 99% skuteczności', 'Ok. 70–90% do 3 lat po zabiegu', 'Skuteczność jest identyczna niezależnie od czasu'],
      },
      {
        text: 'Jaki jest związek między częstością wytrysku a ryzykiem raka prostaty?',
        answer: 'Częsty wytrysk (≥21×/mies.) obniża ryzyko o ok. 33%',
        options: ['Częsty wytrysk zwiększa ryzyko raka prostaty', 'Brak jakiegokolwiek związku', 'Częsty wytrysk (≥21×/mies.) obniża ryzyko o ok. 33%', 'Zależy wyłącznie od diety, nie od seksu'],
      },
      {
        text: 'Jak seks wpływa na układ odpornościowy mężczyzny?',
        answer: 'Regularny seks koreluje z wyższym poziomem przeciwciał IgA',
        options: ['Seks osłabia odporność przez utratę energii', 'Brak udokumentowanego wpływu na odporność', 'Regularny seks koreluje z wyższym poziomem przeciwciał IgA', 'Seks poprawia odporność tylko u kobiet'],
      },
      {
        text: 'Czym jest "morning testosterone surge" i o ile wzrasta T rano?',
        answer: 'Najwyższy ok. 6–8 rano – stąd poranne erekcje',
        options: ['Równomiernie wysoki przez cały dzień', 'Najwyższy o północy', 'Najwyższy ok. 6–8 rano – stąd poranne erekcje', 'Szczyt następuje zaraz po posiłku'],
      },
      {
        text: 'Jak ojcostwo wpływa na poziom testosteronu?',
        answer: 'Aktywne ojcostwo obniża T o ok. 20–30%',
        options: ['Ojcostwo zwiększa T przez dumę i status', 'Testosteron nie zmienia się po urodzeniu dziecka', 'Aktywne ojcostwo obniża T o ok. 20–30%', 'Tylko pierwsze dziecko obniża T'],
      },
      {
        text: 'Ile procent mężczyzn doświadcza depresji poporodowej (paternal postnatal depression)?',
        answer: 'Około 10% ojców',
        options: ['Mężczyźni nie doświadczają depresji poporodowej', 'Prawie połowa – 45%', 'Około 10% ojców', 'Tylko ojcowie bez partnerki'],
      },
      {
        text: 'Co to jest "sympathetic nervous system dominance" podczas seksu i jak wpływa na erekcję?',
        answer: 'Erekcja wymaga relaksu; stres i lęk ją hamują',
        options: ['Stres zawsze poprawia erekcję przez adrenalinę', 'Erekcja nie zależy od stanu relaksu', 'Erekcja wymaga relaksu; stres i lęk ją hamują', 'Erekcja jest procesem wyłącznie psychicznym'],
      },
      {
        text: 'Ile kalorii spala mężczyzna podczas przeciętnego stosunku seksualnego?',
        answer: 'Około 85–100 kalorii',
        options: ['Około 500 kalorii – jak intensywny trening', 'Poniżej 20 kalorii – to minimalny wysiłek', 'Około 85–100 kalorii', 'Seks nie spala mierzalnych kalorii'],
      },
      {
        text: 'Jaki jest związek między długością palca wskazującego a serdecznego (digit ratio 2D:4D) a testosteronem prenatalnym?',
        answer: 'Niższy stosunek 2D:4D = wyższy T prenatalny',
        options: ['Wyższy stosunek 2D:4D = wyższy T prenatalny', 'Palce nie mają związku z hormonami', 'Niższy stosunek 2D:4D = wyższy T prenatalny', 'Badania digit ratio są obalonym mitem'],
      },
    ],
  },
  {
    id: 'women',
    name: '💋 Damskie sekrety',
    description: 'O kobietach, dla kobiet – bez owijania w bawełnę',
    color: '#ec4899',
    border: 'rgba(236,72,153,0.5)',
    bg: 'rgba(236,72,153,0.07)',
    questions: [
      // ── ORGAZM KOBIECY ───────────────────────────────────────────────────────
      {
        text: 'Jaki procent kobiet twierdzi, że doświadczyła orgazmu wielokrotnego?',
        answer: 'Około 43%',
        options: ['Około 3%', 'Około 15%', 'Około 43%', 'Ponad 90%'],
      },
      {
        text: 'Ile minut stymulacji potrzebuje przeciętna kobieta, by osiągnąć orgazm?',
        answer: '13–15 minut',
        options: ['1–2 minuty', '5–7 minut', '13–15 minut', 'Ponad 45 minut'],
      },
      {
        text: 'Ile procent kobiet nigdy nie osiągnęło orgazmu w życiu (anorgazmia pierwotna)?',
        answer: 'Około 10–15%',
        options: ['Poniżej 1%', 'Około 10–15%', 'Około 40%', 'Ponad połowa'],
      },
      {
        text: 'Jaki rodzaj stymulacji najczęściej prowadzi kobiety do orgazmu?',
        answer: 'Stymulacja łechtaczki',
        options: ['Penetracja pochwy', 'Stymulacja łechtaczki', 'Stymulacja brodawek sutkowych', 'Wyłącznie seks oralny'],
      },
      {
        text: 'Ile skurczów mięśni odbywa się podczas kobiecego orgazmu?',
        answer: '8–15 skurczów co około 0,8 sekundy',
        options: ['1–2 skurcze', '8–15 skurczów co około 0,8 sekundy', '40–50 skurczów', 'Jeden długotrwały skurcz'],
      },
      {
        text: 'Co się dzieje z łechtaczką tuż przed orgazmem?',
        answer: 'Chowa się pod napletkiem (odruch ochronny)',
        options: ['Powiększa się do maksimum i pozostaje widoczna', 'Chowa się pod napletkiem (odruch ochronny)', 'Twardnieje podobnie jak penis', 'Znika całkowicie z pola widzenia'],
      },
      {
        text: 'Jak długo trwa orgazm u przeciętnej kobiety?',
        answer: '20–35 sekund',
        options: ['2–3 sekundy', '8–10 sekund', '20–35 sekund', 'Ponad 2 minuty'],
      },
      {
        text: 'Orgazm u kobiety uwalnia głównie który hormon dający uczucie więzi?',
        answer: 'Oksytocynę',
        options: ['Adrenalinę', 'Kortyzol', 'Oksytocynę', 'Testosteron'],
      },
      {
        text: 'Ile procent kobiet osiąga orgazm wyłącznie podczas stosunku penetracyjnego?',
        answer: 'Około 18–25%',
        options: ['Poniżej 5%', 'Około 18–25%', 'Około 60%', 'Ponad 90%'],
      },
      {
        text: 'Jak często kobiety osiągają orgazm podczas seksu oralnego?',
        answer: 'Około 80% – częściej niż przy penetracji',
        options: ['Rzadziej niż podczas penetracji', 'Tak samo jak przy penetracji – ~25%', 'Około 80% – częściej niż przy penetracji', 'Prawie nigdy – oralny nie daje orgazmu'],
      },
      {
        text: 'Co to jest orgazm wielokrotny u kobiety?',
        answer: 'Kilka orgazmów pod rząd bez pełnego powrotu do stanu spoczynku',
        options: ['Orgazm trwający ponad 1 minutę', 'Kilka orgazmów pod rząd bez pełnego powrotu do stanu spoczynku', 'Orgazm angażujący całe ciało równocześnie', 'Orgazm osiągany bez jakiejkolwiek stymulacji genitalnej'],
      },
      {
        text: 'Ile procent kobiet przyznaje, że symuluje orgazm?',
        answer: 'Ponad 50%',
        options: ['Około 5%', 'Około 20%', 'Około 35%', 'Ponad 50%'],
      },
      {
        text: 'Co to jest post-coital dysphoria (PCD) i jak często dotyka kobiet?',
        answer: 'Uczucie smutku/płaczu po orgazmie – dotyczy ok. 46% kobiet przynajmniej raz',
        options: ['Ból fizyczny po stosunku – ~10% kobiet', 'Uczucie smutku/płaczu po orgazmie – dotyczy ok. 46% kobiet przynajmniej raz', 'Alergia na nasienie – ~2% kobiet', 'Brak uczucia po orgazmie – ~5% kobiet'],
      },
      {
        text: 'Który obszar mózgu dezaktywuje się podczas kobiecego orgazmu?',
        answer: 'Kora przedczołowa – stąd utrata kontroli',
        options: ['Ciało migdałowate – ośrodek strachu', 'Kora przedczołowa – stąd utrata kontroli', 'Hipokamp – dlatego nie pamiętamy orgazmu', 'Móżdżek – stąd utrata koordynacji'],
      },
      {
        text: 'Ile procent kobiet doświadcza orgazmu podczas snu?',
        answer: 'Około 37%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 37%', 'Prawie wszystkie'],
      },

      // ── SQUIRTING I ŻEŃSKA EJAKULACJA ───────────────────────────────────────
      {
        text: 'Skąd pochodzi płyn wydzielany podczas squirtingu?',
        answer: 'Z gruczołów Skenego i częściowo z pęcherza moczowego',
        options: ['Wyłącznie z pochwy', 'Wyłącznie z pęcherza', 'Z gruczołów Skenego i częściowo z pęcherza moczowego', 'Z szyjki macicy'],
      },
      {
        text: 'Ile procent kobiet doświadczyło squirtingu przynajmniej raz w życiu?',
        answer: 'Szacunkowo 10–54% (wyniki badań są bardzo zróżnicowane)',
        options: ['Poniżej 1%', 'Szacunkowo 10–54% (wyniki badań są bardzo zróżnicowane)', 'Ponad 90%', 'Dokładnie 50%'],
      },
      {
        text: 'Jaka jest różnica między squirtingiem a żeńską ejakulacją?',
        answer: 'Squirting – dużo płynu z pęcherza; żeńska ejakulacja – mała ilość gęstszego płynu z gruczołów Skenego',
        options: ['Są identyczne – to to samo zjawisko', 'Squirting – dużo płynu z pęcherza; żeńska ejakulacja – mała ilość gęstszego płynu z gruczołów Skenego', 'Żeńska ejakulacja to tylko mit naukowy', 'Squirting jest niemożliwy biologicznie'],
      },
      {
        text: 'Ile płynu może wydzielić się podczas squirtingu?',
        answer: 'Od kilku ml do ponad 150 ml – skrajnie zróżnicowane indywidualnie',
        options: ['Zawsze dokładnie 1 ml', 'Od kilku ml do ponad 150 ml – skrajnie zróżnicowane indywidualnie', 'Zawsze ponad litr', 'Mniej niż kropla – squirting to mit'],
      },
      {
        text: 'Czy każda kobieta może nauczyć się squirtingu?',
        answer: 'Nie wiadomo – anatomia gruczołów Skenego różni się między kobietami',
        options: ['Tak – to wyłącznie kwestia treningu', 'Nie wiadomo – anatomia gruczołów Skenego różni się między kobietami', 'Tak, ale tylko kobiety po 30. roku życia', 'Nie – squirting jest możliwy tylko u kobiet z dużą łechtaczką'],
      },

      // ── MASTURBACJA ──────────────────────────────────────────────────────────
      {
        text: 'Ile kobiet regularnie masturbuje się według badań Kinsey Institute?',
        answer: 'Około 50–60%',
        options: ['Około 5%', 'Około 20%', 'Około 50–60%', 'Prawie wszystkie'],
      },
      {
        text: 'Jaka jest najczęstsza metoda masturbacji u kobiet?',
        answer: 'Ręczna stymulacja łechtaczki',
        options: ['Penetracja wibratorem', 'Ręczna stymulacja łechtaczki', 'Stymulacja brodawek sutkowych', 'Masaż ścian pochwy'],
      },
      {
        text: 'Ile procent kobiet nigdy nie masturbowało się?',
        answer: 'Około 25–30%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–30%', 'Ponad 70%'],
      },
      {
        text: 'Jakie korzyści zdrowotne niesie regularna masturbacja u kobiet?',
        answer: 'Redukcja stresu, lepszy sen, ulga w bólu menstruacyjnym i lepsza znajomość własnego ciała',
        options: ['Brak udowodnionych korzyści zdrowotnych', 'Tylko poprawa humoru', 'Redukcja stresu, lepszy sen, ulga w bólu menstruacyjnym i lepsza znajomość własnego ciała', 'Wyłącznie poprawa libido'],
      },
      {
        text: 'Jak masturbacja wpływa na zdolność do osiągania orgazmu z partnerem?',
        answer: 'Kobiety regularnie masturbujące się osiągają orgazm z partnerem statystycznie częściej',
        options: ['Zmniejsza wrażliwość na dotyk partnera', 'Kobiety regularnie masturbujące się osiągają orgazm z partnerem statystycznie częściej', 'Nie ma żadnego związku', 'Zmniejsza pożądanie partnera'],
      },
      {
        text: 'Ile procent kobiet używa wibratorów podczas masturbacji?',
        answer: 'Około 52–60%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 52–60%', 'Prawie wszystkie'],
      },
      {
        text: 'Jak często przeciętna kobieta masturbuje się?',
        answer: 'Około 1–2 razy tygodniowo (rzadziej niż mężczyźni)',
        options: ['Kilka razy dziennie', 'Raz w miesiącu', 'Około 1–2 razy tygodniowo (rzadziej niż mężczyźni)', 'Raz na pół roku'],
      },
      {
        text: 'Co mówi badanie Hite Report (1976) o masturbacji kobiet?',
        answer: 'Że 82% kobiet masturbuje się, a większość osiąga orgazm szybciej samodzielnie niż z partnerem',
        options: ['Że masturbacja jest rzadka i nie prowadzi do orgazmu', 'Że 82% kobiet masturbuje się, a większość osiąga orgazm szybciej samodzielnie niż z partnerem', 'Że tylko kobiety bez partnera się masturbują', 'Że masturbacja wywołuje u kobiet poczucie winy'],
      },

      // ── GADŻETY EROTYCZNE ────────────────────────────────────────────────────
      {
        text: 'Jaki procent kobiet regularnie używa wibratora lub gadżetu erotycznego?',
        answer: 'Około 52%',
        options: ['Około 5%', 'Około 20%', 'Około 52%', 'Ponad 90%'],
      },
      {
        text: 'Co to był oryginalny wibrator wynaleziony w XIX w. i do czego służył?',
        answer: 'Urządzenie medyczne do "masażu histerycznego" leczącego histerię u kobiet',
        options: ['Zabawka dziecięca do masażu stóp', 'Urządzenie medyczne do "masażu histerycznego" leczącego histerię u kobiet', 'Narzędzie chirurgiczne do ginekologii', 'Urządzenie do terapii reumatyzmu'],
      },
      {
        text: 'Kiedy pojawił się pierwszy elektryczny wibrator dostępny w sprzedaży?',
        answer: 'Około 1902 roku (Hamilton Beach)',
        options: ['Około 1850 roku', 'Około 1902 roku (Hamilton Beach)', 'W 1950 roku', 'Dopiero w latach 70. XX w.'],
      },
      {
        text: 'Ile procent kobiet, które używają wibratorów, osiąga orgazm łatwiej niż bez?',
        answer: 'Ponad 90% deklaruje większą łatwość i intensywność orgazmu',
        options: ['Około 10%', 'Około 40%', 'Około 70%', 'Ponad 90% deklaruje większą łatwość i intensywność orgazmu'],
      },
      {
        text: 'Ile procent par używa zabawek erotycznych razem podczas seksu?',
        answer: 'Około 25–30%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–30%', 'Ponad 80%'],
      },
      {
        text: 'Jaki jest najpopularniejszy typ wibratorów na świecie?',
        answer: 'Wibrator klitoryczny (zewnętrzny) – m.in. "rabbit" z dwoma końcami',
        options: ['Wibrator waginalny typu dildo', 'Wibrator klitoryczny (zewnętrzny) – m.in. "rabbit" z dwoma końcami', 'Wand massager do całego ciała', 'Wibrujące majtki zdalne'],
      },
      {
        text: 'Jaki procent kobiet kupuje gadżety erotyczne samodzielnie (bez partnera)?',
        answer: 'Około 65–70%',
        options: ['Poniżej 5%', 'Około 25%', 'Około 65–70%', 'Prawie żadna'],
      },

      // ── CYKL MENSTRUACYJNY ───────────────────────────────────────────────────
      {
        text: 'Ile ml krwi traci kobieta podczas jednej przeciętnej miesiączki?',
        answer: '30–80 ml',
        options: ['5–10 ml', '30–80 ml', '200–300 ml', 'Ponad pół litra'],
      },
      {
        text: 'Ile dni trwa typowy cykl menstruacyjny (norma medyczna)?',
        answer: '21–35 dni – nie zawsze dokładnie 28',
        options: ['Zawsze dokładnie 28 dni', '7–14 dni', '21–35 dni – nie zawsze dokładnie 28', '40–60 dni'],
      },
      {
        text: 'Ile dni trwa typowe krwawienie miesiączkowe?',
        answer: '3–7 dni',
        options: ['1 dzień', '3–7 dni', '14 dni', 'Ponad 3 tygodnie'],
      },
      {
        text: 'Kiedy następuje owulacja w typowym 28-dniowym cyklu?',
        answer: 'Około 14. dnia cyklu (połowa cyklu)',
        options: ['1. dnia cyklu (podczas miesiączki)', 'Około 7. dnia', 'Około 14. dnia cyklu (połowa cyklu)', 'Ostatniego dnia cyklu'],
      },
      {
        text: 'Ile lat w sumie trwa życie menstruacyjne kobiety?',
        answer: 'Około 35–40 lat (od ok. 12. do ok. 51. roku życia)',
        options: ['Około 5–10 lat', 'Około 15–20 lat', 'Około 35–40 lat (od ok. 12. do ok. 51. roku życia)', 'Całe dorosłe życie – ponad 70 lat'],
      },
      {
        text: 'Ile procent kobiet cierpi na zespół napięcia przedmiesiączkowego (PMS)?',
        answer: 'Około 75–80%',
        options: ['Poniżej 5%', 'Około 30%', 'Około 75–80%', 'Prawie wszystkie – ~99%'],
      },
      {
        text: 'Co to jest PMDD (premenstrual dysphoric disorder)?',
        answer: 'Ciężka forma PMS z nasilonymi objawami psychicznymi – depresja, lęk, drażliwość',
        options: ['Łagodna forma PMS', 'Ciężka forma PMS z nasilonymi objawami psychicznymi – depresja, lęk, drażliwość', 'Brak miesiączki przez kilka miesięcy', 'Stan po ciąży zanikający samoistnie'],
      },
      {
        text: 'Co to jest dysmenorrhea (bolesne miesiączkowanie)?',
        answer: 'Silne bóle skurczowe macicy podczas miesiączki – pierwotne lub wtórne (np. przy endometriozie)',
        options: ['Nieregularne miesiączki', 'Silne bóle skurczowe macicy podczas miesiączki – pierwotne lub wtórne (np. przy endometriozie)', 'Brak miesiączki', 'Krwawienie między miesiączkami'],
      },
      {
        text: 'Jak masturbacja lub orgazm może pomóc podczas bolesnej miesiączki?',
        answer: 'Orgazm uwalnia endorfiny i powoduje skurcze macicy rozładowujące napięcie – łagodzi ból',
        options: ['Nasila ból przez dodatkowe skurcze', 'Orgazm uwalnia endorfiny i powoduje skurcze macicy rozładowujące napięcie – łagodzi ból', 'Nie ma żadnego wpływu', 'Skraca krwawienie o połowę'],
      },
      {
        text: 'Jak libido zmienia się przez cały cykl menstruacyjny?',
        answer: 'Rośnie przed owulacją (dzień 10–14), spada w fazie lutealnej i podczas miesiączki',
        options: ['Jest zawsze stałe – hormony nie wpływają na libido', 'Jest najwyższe podczas miesiączki', 'Rośnie przed owulacją (dzień 10–14), spada w fazie lutealnej i podczas miesiączki', 'Najwyższe w fazie lutealnej (tydzień 3–4)'],
      },
      {
        text: 'Co to jest menstruacja wsteczna (retrograde menstruation)?',
        answer: 'Krew menstruacyjna cofa się przez jajowody do jamy otrzewnowej – czynnik ryzyka endometriozy',
        options: ['Miesiączka trwająca wstecznie – od końca do początku cyklu', 'Krew menstruacyjna cofa się przez jajowody do jamy otrzewnowej – czynnik ryzyka endometriozy', 'Brak miesiączki mimo normalnych hormonów', 'Krwawienie z odbytu podczas miesiączki'],
      },
      {
        text: 'Ile procent kobiet doświadcza nieregularnych miesiączek?',
        answer: 'Około 14–25% kobiet w wieku rozrodczym',
        options: ['Poniżej 1%', 'Około 5%', 'Około 14–25% kobiet w wieku rozrodczym', 'Ponad 80%'],
      },
      {
        text: 'Co to jest amenorrhea i kiedy jest niepokojąca?',
        answer: 'Brak miesiączki – niepokojąca przy braku ciąży dłuższym niż 3 miesiące',
        options: ['Zbyt obfita miesiączka', 'Brak miesiączki – niepokojąca przy braku ciąży dłuższym niż 3 miesiące', 'Bolesna miesiączka', 'Skąpa miesiączka – mniej niż 5 ml'],
      },
      {
        text: 'Jak intensywny wysiłek fizyczny (np. maraton) wpływa na cykl?',
        answer: 'Może powodować zanik miesiączki (athletic amenorrhea) przez obniżenie estrogenów',
        options: ['Reguluje cykl i zmniejsza PMS', 'Może powodować zanik miesiączki (athletic amenorrhea) przez obniżenie estrogenów', 'Nie ma żadnego wpływu na hormony', 'Przyspiesza owulację o kilka dni'],
      },

      // ── LIBIDO I POŻĄDANIE ───────────────────────────────────────────────────
      {
        text: 'Który zmysł najbardziej wpływa na libido kobiet według badań?',
        answer: 'Węch – zapachy ciała i feromony mają silny wpływ na pożądanie',
        options: ['Wzrok – atrakcyjność fizyczna', 'Słuch – głos i słowa', 'Dotyk', 'Węch – zapachy ciała i feromony mają silny wpływ na pożądanie'],
      },
      {
        text: 'Co to jest "responsive desire" w odróżnieniu od "spontaneous desire"?',
        answer: 'Responsive desire – pożądanie pojawia się jako reakcja na kontekst/dotyk, nie samoistnie',
        options: ['Responsive desire to stan chorobowy wymagający leczenia', 'Spontaneous desire to typ wyłącznie kobiecy', 'Responsive desire – pożądanie pojawia się jako reakcja na kontekst/dotyk, nie samoistnie', 'Obydwa typy są identyczne i nie różnią się'],
      },
      {
        text: 'Jak stres wpływa na libido kobiety?',
        answer: 'Silnie je obniża – kortyzol hamuje produkcję testosteronu i estrogenów',
        options: ['Zwiększa libido przez adrenalinę', 'Nie ma żadnego wpływu', 'Silnie je obniża – kortyzol hamuje produkcję testosteronu i estrogenów', 'Wpływa tylko na libido mężczyzn'],
      },
      {
        text: 'W jakim przedziale wiekowym kobiety mają statystycznie najwyższe libido?',
        answer: 'Między 27 a 33 rokiem życia – szczyt pewności siebie i testosteronu',
        options: ['Między 16 a 18 rokiem życia', 'Między 27 a 33 rokiem życia – szczyt pewności siebie i testosteronu', 'Po menopauzie – brak stresu o ciążę', 'Libido jest stałe przez całe życie'],
      },
      {
        text: 'Jak regularna aktywność fizyczna wpływa na libido kobiety?',
        answer: 'Zwiększa je – poprawia ukrwienie, poziom testosteronu i samoocenę ciała',
        options: ['Zmniejsza – ciało jest zmęczone', 'Nie wpływa', 'Zwiększa je – poprawia ukrwienie, poziom testosteronu i samoocenę ciała', 'Tylko joga zwiększa libido, inne sporty nie'],
      },
      {
        text: 'Jak antydepresanty (SSRI) wpływają na libido kobiety?',
        answer: 'Bardzo często je obniżają i opóźniają lub uniemożliwiają orgazm',
        options: ['Zwiększają libido przez wyrównanie nastroju', 'Nie wpływają na libido', 'Bardzo często je obniżają i opóźniają lub uniemożliwiają orgazm', 'Wpływają tylko na mężczyzn'],
      },
      {
        text: 'Co to jest HSDD (Hypoactive Sexual Desire Disorder) u kobiet?',
        answer: 'Klinicznie niskie pożądanie seksualne powodujące distres – dotyczy ok. 10% kobiet',
        options: ['Nadmierne pożądanie seksualne', 'Klinicznie niskie pożądanie seksualne powodujące distres – dotyczy ok. 10% kobiet', 'Brak orgazmu mimo prawidłowego pożądania', 'Ból podczas stosunku'],
      },
      {
        text: 'Jak hormonalna antykoncepcja wpływa na libido?',
        answer: 'U ok. 15–20% kobiet obniża libido poprzez zmniejszenie wolnego testosteronu',
        options: ['Zawsze zwiększa libido – brak stresu o ciążę', 'Nie wpływa na libido', 'U ok. 15–20% kobiet obniża libido poprzez zmniejszenie wolnego testosteronu', 'Całkowicie eliminuje pożądanie seksualne'],
      },
      {
        text: 'Jak zapach partnera wpływa na pożądanie seksualne kobiety?',
        answer: 'Kobiety są bardziej pociągane do mężczyzn o różnym MHC (układzie odpornościowym) niż do bardzo podobnych',
        options: ['Zapach nie ma znaczenia – ważny jest tylko wygląd', 'Kobiety preferują zapach mężczyzn o identycznym DNA', 'Kobiety są bardziej pociągane do mężczyzn o różnym MHC (układzie odpornościowym) niż do bardzo podobnych', 'Feromony ludzkie nie istnieją naukowo'],
      },
      {
        text: 'Jak alkohol wpływa na libido i doznania seksualne kobiety?',
        answer: 'Małe ilości mogą obniżyć zahamowania; duże zmniejszają czucie i utrudniają orgazm',
        options: ['Zawsze zwiększa podniecenie seksualne', 'Nie wpływa na doznania seksualne', 'Małe ilości mogą obniżyć zahamowania; duże zmniejszają czucie i utrudniają orgazm', 'Alkohol poprawia orgazm poprzez rozluźnienie mięśni'],
      },

      // ── CIAŁO KOBIETY ────────────────────────────────────────────────────────
      {
        text: 'Z ilu milionów komórek jajowych rodzi się dziewczynka?',
        answer: 'Około 1–2 milionów',
        options: ['Kilku tysięcy', 'Około 100 000', 'Około 1–2 milionów', 'Kilkuset milionów'],
      },
      {
        text: 'Ile komórek jajowych pozostaje u kobiety w momencie menopauzy?',
        answer: 'Zaledwie około 1 000 – na menopauzie wyczerpuje się pula',
        options: ['Milion – tyle samo co przy urodzeniu', 'Kilkaset tysięcy', 'Zaledwie około 1 000 – na menopauzie wyczerpuje się pula', 'Zero – wszystkie zostają zużyte do owulacji'],
      },
      {
        text: 'Ile komórek jajowych wyda kobieta przez całe życie w owulacjach?',
        answer: 'Około 400–500 w ciągu całego życia płodnego',
        options: ['Kilkanaście rocznie – tysiące łącznie', 'Około 400–500 w ciągu całego życia płodnego', 'Zaledwie 12 – jedna na rok', 'Dziesiątki tysięcy'],
      },
      {
        text: 'Jak długo żyje komórka jajowa po uwolnieniu podczas owulacji?',
        answer: '12–24 godziny – to jedyne okno na zapłodnienie',
        options: ['72 godziny', '12–24 godziny – to jedyne okno na zapłodnienie', '7 dni', 'Cały cykl – do następnej miesiączki'],
      },
      {
        text: 'Co to jest endometrium?',
        answer: 'Błona śluzowa wyściełająca wnętrze macicy – złuszcza się podczas miesiączki',
        options: ['Zewnętrzna warstwa macicy', 'Tkanki pochwy', 'Błona śluzowa wyściełająca wnętrze macicy – złuszcza się podczas miesiączki', 'Tkanka jajowodów'],
      },
      {
        text: 'Co to jest owulacja?',
        answer: 'Uwolnienie dojrzałej komórki jajowej z pęcherzyka Graafa jajnika',
        options: ['Moment zapłodnienia', 'Uwolnienie dojrzałej komórki jajowej z pęcherzyka Graafa jajnika', 'Pierwsza miesiączka w życiu', 'Wydzielanie śluzu szyjkowego'],
      },
      {
        text: 'O ile wzrasta temperatura ciała kobiety po owulacji?',
        answer: 'O 0,2–0,5°C – bazalna temperatura ciała jako wskaźnik owulacji',
        options: ['Nie zmienia się w ogóle', 'O 0,2–0,5°C – bazalna temperatura ciała jako wskaźnik owulacji', 'O 2–3°C', 'Spada o 1°C'],
      },
      {
        text: 'Jak wygląda śluz szyjkowy w dniu owulacji?',
        answer: 'Przezroczysty, rozciągliwy jak białko jajka – szczyt płodności',
        options: ['Gęsty i biały jak mleko', 'Przezroczysty, rozciągliwy jak białko jajka – szczyt płodności', 'Brązowy i gęsty', 'Brak śluzu – dzień owulacji jest suchy'],
      },
      {
        text: 'Ile szyjek macicy ma kobieta?',
        answer: 'Jedną – łączy jamę macicy z pochwą',
        options: ['Dwie – po jednej na jajnik', 'Jedną – łączy jamę macicy z pochwą', 'Trzy – zależy od budowy anatomicznej', 'Zero – szyjka jest mitem'],
      },
      {
        text: 'Co to jest dno macicy (fundus uteri)?',
        answer: 'Górna, najszersza część macicy – tam najczęściej implantuje się zarodek',
        options: ['Dolna część macicy łącząca z pochwą', 'Szyjka macicy', 'Górna, najszersza część macicy – tam najczęściej implantuje się zarodek', 'Jajowody wychodzące z macicy'],
      },

      // ── ZDROWIE INTYMNE KOBIET ───────────────────────────────────────────────
      {
        text: 'Jak często kobiety powinny chodzić na badania ginekologiczne?',
        answer: 'Przynajmniej raz w roku – cytologia co 3 lata jeśli wyniki są prawidłowe',
        options: ['Co 10 lat wystarczy', 'Co 5 lat', 'Przynajmniej raz w roku – cytologia co 3 lata jeśli wyniki są prawidłowe', 'Tylko gdy pojawią się objawy'],
      },
      {
        text: 'Co to jest endometrioza?',
        answer: 'Stan, w którym tkanka podobna do śluzówki macicy rośnie poza macicą – często bolesna',
        options: ['Rak śluzówki macicy', 'Stan, w którym tkanka podobna do śluzówki macicy rośnie poza macicą – często bolesna', 'Zapalenie macicy wywołane bakteryjnie', 'Przerost endometrium w macicy'],
      },
      {
        text: 'Ile procent kobiet cierpi na endometriozę?',
        answer: 'Około 10% kobiet w wieku rozrodczym – często przez lata niezdiagnozowana',
        options: ['Poniżej 0,1%', 'Około 1%', 'Około 10% kobiet w wieku rozrodczym – często przez lata niezdiagnozowana', 'Ponad 50%'],
      },
      {
        text: 'Co to jest PCOS (zespół policystycznych jajników)?',
        answer: 'Zaburzenie hormonalne – nieregularne owulacje, nadmiar androgenów, cysty jajnikowe',
        options: ['Rak jajnika', 'Zaburzenie hormonalne – nieregularne owulacje, nadmiar androgenów, cysty jajnikowe', 'Zapalenie jajowodów', 'Łagodne guzy macicy'],
      },
      {
        text: 'Ile procent kobiet ma PCOS?',
        answer: 'Około 6–12% kobiet w wieku rozrodczym – jedna z najczęstszych przyczyn niepłodności',
        options: ['Poniżej 0,5%', 'Około 2%', 'Około 6–12% kobiet w wieku rozrodczym – jedna z najczęstszych przyczyn niepłodności', 'Ponad 40%'],
      },
      {
        text: 'Co to są mięśniaki macicy (fibroids)?',
        answer: 'Łagodne guzy mięśniówki macicy – najczęstszy guz ginekologiczny u kobiet',
        options: ['Nowotwory złośliwe macicy', 'Łagodne guzy mięśniówki macicy – najczęstszy guz ginekologiczny u kobiet', 'Zapalenie mięśnia macicy', 'Polipy endometrium'],
      },
      {
        text: 'Ile procent kobiet ma mięśniaki macicy do 50. roku życia?',
        answer: 'Około 70–80% – większość bezobjawowa',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30%', 'Około 70–80% – większość bezobjawowa'],
      },
      {
        text: 'Co to są ćwiczenia Kegela i jaką mają korzyść?',
        answer: 'Ćwiczenia mięśnia dna miednicy – wzmacniają kontrolę pęcherza i intensywność orgazmu',
        options: ['Ćwiczenia brzucha poprawiające postawę', 'Ćwiczenia mięśnia dna miednicy – wzmacniają kontrolę pęcherza i intensywność orgazmu', 'Rozciąganie mięśni jajowodów', 'Ćwiczenia relaksacyjne dla macicy'],
      },
      {
        text: 'Co to jest wypadanie narządów miednicy (pelvic organ prolapse)?',
        answer: 'Obniżenie macicy, pochwy lub pęcherza do lub poza pochwę – często po porodach',
        options: ['Nowotwór narządów rodnych', 'Obniżenie macicy, pochwy lub pęcherza do lub poza pochwę – często po porodach', 'Zapalenie mięśni miednicy', 'Brak miesiączki po porodzie'],
      },
      {
        text: 'Co to jest inkontynencja stresowa?',
        answer: 'Mimowolne oddawanie moczu przy kaszlu, śmiechu, kichaniu lub ćwiczeniach',
        options: ['Stres powodujący zatrzymanie moczu', 'Mimowolne oddawanie moczu przy kaszlu, śmiechu, kichaniu lub ćwiczeniach', 'Infekcja pęcherza wywołana stresem', 'Nocne moczenie u dorosłych kobiet'],
      },
      {
        text: 'Ile procent kobiet doświadcza inkontynencji stresowej w ciągu życia?',
        answer: 'Około 30–40% – jedna z najczęstszych dolegliwości kobiet',
        options: ['Poniżej 1%', 'Około 5%', 'Około 30–40% – jedna z najczęstszych dolegliwości kobiet', 'Prawie wszystkie kobiety po menopauzie'],
      },
      {
        text: 'Co to jest adenomioza?',
        answer: 'Tkanka endometrium wrasta w ścianę mięśniową macicy – silne bóle i obfite krwawienia',
        options: ['Brak endometrium – endometrium nie rośnie', 'Tkanka endometrium wrasta w ścianę mięśniową macicy – silne bóle i obfite krwawienia', 'Złośliwy nowotwór macicy', 'Zapalenie jajowodów'],
      },
      {
        text: 'Czym jest menstrual cup i jaką ma zaletę nad tamponem?',
        answer: 'Silikonowy kubeczek wielokrotnego użytku – pojemny, ekologiczny, do 12h noszenia',
        options: ['Plastikowy tampon jednorazowy', 'Silikonowy kubeczek wielokrotnego użytku – pojemny, ekologiczny, do 12h noszenia', 'Jednorazowa wkładka higieniczna', 'Urządzenie do zbierania śluzu szyjkowego'],
      },

      // ── HORMONY I CIĄŻA ──────────────────────────────────────────────────────
      {
        text: 'Jak estrogen wpływa na skórę kobiety?',
        answer: 'Utrzymuje jej grubość, elastyczność i nawilżenie – stąd pogorszenie skóry po menopauzie',
        options: ['Powoduje trądzik i przetłuszczenie', 'Utrzymuje jej grubość, elastyczność i nawilżenie – stąd pogorszenie skóry po menopauzie', 'Nie ma wpływu na skórę', 'Powoduje nadmierne owłosienie'],
      },
      {
        text: 'Ile tygodni trwa prawidłowa ciąża?',
        answer: '40 tygodni od ostatniej miesiączki (38 tygodni od zapłodnienia)',
        options: ['30 tygodni', '40 tygodni od ostatniej miesiączki (38 tygodni od zapłodnienia)', '52 tygodnie – rok', '20 tygodni – jak u małp'],
      },
      {
        text: 'Jak libido zmienia się w trakcie ciąży?',
        answer: 'Najczęściej rośnie w II trymestrze – wzrost ukrwienia narządów i estrogenów',
        options: ['Zawsze zanika całkowicie', 'Najczęściej rośnie w II trymestrze – wzrost ukrwienia narządów i estrogenów', 'Jest identyczne jak przed ciążą', 'Rośnie wyłącznie w III trymestrze'],
      },
      {
        text: 'Czy seks podczas ciąży jest bezpieczny?',
        answer: 'Tak – dla większości ciąż jest bezpieczny aż do porodu, o ile nie ma przeciwwskazań',
        options: ['Nie – może wywołać poronienie', 'Tylko w I trymestrze', 'Tak – dla większości ciąż jest bezpieczny aż do porodu, o ile nie ma przeciwwskazań', 'Tylko w pozycji misjonarza'],
      },
      {
        text: 'Co to jest hCG i dlaczego jest ważny dla kobiet?',
        answer: 'Gonadotropina kosmówkowa – hormon ciążowy wykrywany w testach ciążowych',
        options: ['Hormon regulujący miesiączkę', 'Gonadotropina kosmówkowa – hormon ciążowy wykrywany w testach ciążowych', 'Hormon wywołujący owulację', 'Hormon produkowany przez tarczycę'],
      },
      {
        text: 'Jak tarczyca wpływa na płodność kobiety?',
        answer: 'Niedoczynność lub nadczynność tarczycy mogą zaburzać owulację i prowadzić do niepłodności',
        options: ['Tarczyca nie ma żadnego wpływu na płodność', 'Niedoczynność lub nadczynność tarczycy mogą zaburzać owulację i prowadzić do niepłodności', 'Tarczyca wpływa tylko na płodność mężczyzn', 'Tarczyca reguluje wyłącznie libido'],
      },
      {
        text: 'Co to jest prolaktyna i jak wpływa na kobiety po porodzie?',
        answer: 'Hormon laktacji – stymuluje produkcję mleka i hamuje owulację (naturalna "antykoncepcja")',
        options: ['Hormon wywołujący depresję poporodową', 'Hormon laktacji – stymuluje produkcję mleka i hamuje owulację (naturalna "antykoncepcja")', 'Hormon regulujący skurcze macicy podczas porodu', 'Hormon odpowiedzialny za libido po porodzie'],
      },
      {
        text: 'Ile procent kobiet doświadcza depresji poporodowej?',
        answer: 'Około 10–15% – a "baby blues" łagodna forma dotyka ~80%',
        options: ['Poniżej 0,1%', 'Około 2%', 'Około 10–15% – a "baby blues" łagodna forma dotyka ~80%', 'Prawie wszystkie matki – ~99%'],
      },
      {
        text: 'Co to jest badanie AMH (anty-Mullerowski hormon) i do czego służy?',
        answer: 'Wskaźnik rezerwy jajnikowej – pokazuje, ile komórek jajowych kobieta ma w zapasie',
        options: ['Badanie poziomu estrogenów podczas menopauzy', 'Wskaźnik rezerwy jajnikowej – pokazuje, ile komórek jajowych kobieta ma w zapasie', 'Test wykrywający ciążę z krwi', 'Marker nowotworowy jajnika'],
      },

      // ── MENOPAUZA ────────────────────────────────────────────────────────────
      {
        text: 'W jakim średnim wieku pojawia się menopauza?',
        answer: 'Około 51 lat (norma: 44–56 lat)',
        options: ['Około 35–38 lat', 'Około 51 lat (norma: 44–56 lat)', 'Około 65 lat', 'Około 70 lat'],
      },
      {
        text: 'Co to jest perimenopauza?',
        answer: 'Kilkuletni okres przejściowy przed menopauzą – nieregularne miesiączki i zmienne hormony',
        options: ['Menopauza trwająca tylko jeden miesiąc', 'Kilkuletni okres przejściowy przed menopauzą – nieregularne miesiączki i zmienne hormony', 'Menopauza u kobiet przed 40. rokiem życia', 'Okres po menopauzie – stabilny hormonalnie'],
      },
      {
        text: 'Ile procent kobiet doświadcza uderzeń gorąca (hot flashes) podczas menopauzy?',
        answer: 'Około 75–85%',
        options: ['Poniżej 5%', 'Około 30%', 'Około 75–85%', 'Prawie wszystkie – ~99%'],
      },
      {
        text: 'Jak menopauza wpływa na seks?',
        answer: 'Suchość pochwy, obniżone libido u ~40%, ale u ~20% libido rośnie – brak stresu o ciążę',
        options: ['Całkowity zanik aktywności seksualnej u wszystkich', 'Suchość pochwy, obniżone libido u ~40%, ale u ~20% libido rośnie – brak stresu o ciążę', 'Brak jakichkolwiek zmian seksualnych', 'Zawsze wzrost libido po menopauzie'],
      },
      {
        text: 'Co to jest GSM (genitourinary syndrome of menopause)?',
        answer: 'Zespół objawów: suchość pochwy, ból podczas seksu, infekcje pęcherza po menopauzie',
        options: ['Rak narządów rodnych po menopauzie', 'Zespół objawów: suchość pochwy, ból podczas seksu, infekcje pęcherza po menopauzie', 'Wypadanie macicy u kobiet po 60. roku życia', 'Normalny stan hormonalny po menopauzie'],
      },
      {
        text: 'Co to jest hormonalna terapia zastępcza (HTZ/HRT)?',
        answer: 'Uzupełnianie estrogenów (i progesteronu) po menopauzie – łagodzi objawy, ale ma ryzyka',
        options: ['Terapia biologiczna nowotworów', 'Uzupełnianie estrogenów (i progesteronu) po menopauzie – łagodzi objawy, ale ma ryzyka', 'Terapia hormonalna zmieniająca płeć', 'Leki antykoncepcyjne stosowane po menopauzie'],
      },
      {
        text: 'Co to jest menopauza przedwczesna (POI)?',
        answer: 'Wygaśnięcie funkcji jajników przed 40. rokiem życia – dotyka ~1% kobiet',
        options: ['Menopauza u kobiet pomiędzy 50 a 55 rokiem życia', 'Wygaśnięcie funkcji jajników przed 40. rokiem życia – dotyka ~1% kobiet', 'Menopauza trwająca krócej niż rok', 'Menopauza połączona z ciążą (niemożliwa)'],
      },
      {
        text: 'Jak menopauza wpływa na kości kobiety?',
        answer: 'Spadek estrogenów przyspiesza utratę masy kostnej – ryzyko osteoporozy wzrasta',
        options: ['Kości stają się mocniejsze dzięki braku miesiączek', 'Brak wpływu – hormony nie mają związku z kośćmi', 'Spadek estrogenów przyspiesza utratę masy kostnej – ryzyko osteoporozy wzrasta', 'Osteoporoza dotyka wyłącznie mężczyzn'],
      },

      // ── FANTAZJE I PSYCHOLOGIA ───────────────────────────────────────────────
      {
        text: 'Ile procent kobiet fantazjuje podczas stosunku seksualnego z partnerem?',
        answer: 'Około 60–70%',
        options: ['Poniżej 5%', 'Około 25%', 'Około 60–70%', 'Prawie wszystkie – ~99%'],
      },
      {
        text: 'Jaka jest najczęstszą fantazją seksualną kobiet wg badań?',
        answer: 'Seks z nieznanym / seks w niecodziennym miejscu',
        options: ['Seks z inną kobietą', 'Seks grupowy wyłącznie', 'Seks z nieznanym / seks w niecodziennym miejscu', 'BDSM i dominacja'],
      },
      {
        text: 'Ile procent heteroseksualnych kobiet przyznaje się do fantazji o innej kobiecie?',
        answer: 'Około 30–45% – to normalne i nie definiuje orientacji',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–45% – to normalne i nie definiuje orientacji', 'Prawie wszystkie – ~90%'],
      },
      {
        text: 'Kobiety stanowią jaki procent czytelników powieści erotycznych?',
        answer: 'Około 80–85% – kobiety dominują jako odbiorczynie erotyków literackich',
        options: ['Około 10%', 'Około 40%', 'Około 80–85% – kobiety dominują jako odbiorczynie erotyków literackich', 'Równo 50%'],
      },
      {
        text: 'Ile procent kobiet ma fantazje o byciu dominującą (w roli dominatrix)?',
        answer: 'Około 30–40% ma takie fantazje przynajmniej okazjonalnie',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–40% ma takie fantazje przynajmniej okazjonalnie', 'Prawie wszystkie – BDSM dotyczy każdej kobiety'],
      },
      {
        text: 'Ile procent kobiet ma fantazje o byciu podporządkowaną / uległą?',
        answer: 'Około 50–65% ma takie fantazje – to jedna z najczęstszych fantazji kobiet',
        options: ['Poniżej 1% – to zaburzenie wymagające terapii', 'Około 10%', 'Około 50–65% ma takie fantazje – to jedna z najczęstszych fantazji kobiet', 'Prawie 0% – fantazje o uległości są patologiczne'],
      },
      {
        text: 'Czy fantazja seksualna zawsze oznacza chęć jej realizacji?',
        answer: 'Nie – badania pokazują, że większość kobiet nie chce realizować swoich fantazji',
        options: ['Tak – fantazja to zawsze ukryte pragnienie', 'Nie – badania pokazują, że większość kobiet nie chce realizować swoich fantazji', 'Tak, ale tylko młode kobiety', 'Fantazje zawsze są realizowane w bezpiecznych ramach'],
      },
      {
        text: 'Jak pornografia dla kobiet ("female-friendly porn") różni się od tradycyjnej?',
        answer: 'Skupia się na kontekście emocjonalnym, foreplay i kobiecej przyjemności',
        options: ['Nie różni się niczym', 'Skupia się na kontekście emocjonalnym, foreplay i kobiecej przyjemności', 'Jest wyłącznie w formie audio', 'Zawiera wyłącznie treści lesbijskie'],
      },

      // ── KOBIETY I SEKS W ZWIĄZKACH ───────────────────────────────────────────
      {
        text: 'Jak związek długoterminowy wpływa na pożądanie seksualne kobiet?',
        answer: 'Badania wskazują, że kobiety tracą pożądanie w stałym związku szybciej niż mężczyźni',
        options: ['Kobiety mają stałe pożądanie przez cały związek', 'Badania wskazują, że kobiety tracą pożądanie w stałym związku szybciej niż mężczyźni', 'Pożądanie rośnie z latami – im dłużej razem, tym lepiej', 'Mężczyźni tracą pożądanie szybciej niż kobiety'],
      },
      {
        text: 'Co kobiety cenią najbardziej w partnerze seksualnym wg badań?',
        answer: 'Uwaga, emocjonalne zaangażowanie i umiejętność komunikacji – ponad sam wygląd',
        options: ['Wyłącznie wygląd fizyczny', 'Rozmiar penisa', 'Uwaga, emocjonalne zaangażowanie i umiejętność komunikacji – ponad sam wygląd', 'Sprawność fizyczna i siła'],
      },
      {
        text: 'Ile procent kobiet inicjuje seks w swoich związkach?',
        answer: 'Około 30–40% – rzadziej niż mężczyźni, ale znaczący odsetek',
        options: ['Poniżej 1% – kobiety nigdy nie inicjują', 'Około 30–40% – rzadziej niż mężczyźni, ale znaczący odsetek', 'Ponad 70% – kobiety inicjują częściej', 'Równo 50% – inicjatywa jest zawsze symetryczna'],
      },
      {
        text: 'Co kobiety deklarują jako najważniejszy czynnik satysfakcji seksualnej?',
        answer: 'Bycie "widzianą" i pożądaną przez partnera – emocjonalne połączenie',
        options: ['Czas trwania stosunku', 'Rozmiar penisa partnera', 'Bycie "widzianą" i pożądaną przez partnera – emocjonalne połączenie', 'Częstotliwość seksu w tygodniu'],
      },
      {
        text: 'Jak samoocena ciała wpływa na seksualność kobiety?',
        answer: 'Negatywna samoocena ciała (body image) silnie koreluje z trudnościami w osiąganiu orgazmu',
        options: ['Brak jakiegokolwiek związku', 'Kobiety z gorszą samooceną mają lepszy seks', 'Negatywna samoocena ciała (body image) silnie koreluje z trudnościami w osiąganiu orgazmu', 'Samoocena wpływa wyłącznie na libido, nie na orgazm'],
      },
      {
        text: 'Ile procent kobiet po porodzie odczuwa ból podczas powrotu do seksu?',
        answer: 'Około 45–50% kobiet w pierwszych tygodniach po porodzie',
        options: ['Poniżej 1%', 'Około 10%', 'Około 45–50% kobiet w pierwszych tygodniach po porodzie', 'Prawie wszystkie – ~99%'],
      },

      // ── CIEKAWOSTKI O KOBIETACH ──────────────────────────────────────────────
      {
        text: 'O ile lat kobiety żyją statystycznie dłużej od mężczyzn globalnie?',
        answer: 'Średnio 5–7 lat dłużej',
        options: ['O 1 rok', 'Kobiety żyją krócej', 'Średnio 5–7 lat dłużej', 'O 20 lat dłużej'],
      },
      {
        text: 'Dlaczego kobiety mają statystycznie silniejszy układ odpornościowy niż mężczyźni?',
        answer: 'Estrogeny wzmacniają odpowiedź immunologiczną – stąd kobiety lepiej walczą z infekcjami',
        options: ['Kobiety jedzą więcej warzyw', 'Estrogeny wzmacniają odpowiedź immunologiczną – stąd kobiety lepiej walczą z infekcjami', 'Kobiety mają lepszy układ nerwowy', 'To mit – mężczyźni mają silniejszą odporność'],
      },
      {
        text: 'Kobiety mają więcej receptorów smaku niż mężczyźni – ile więcej?',
        answer: 'Kobiety mają o ok. 20% więcej kubków smakowych – są bardziej wrażliwe smakowe',
        options: ['Mniejszą liczbę receptorów smaku', 'Identyczną ilość – to mit', 'Kobiety mają o ok. 20% więcej kubków smakowych – są bardziej wrażliwe smakowe', 'Dwukrotnie więcej – dwa razy bardziej wrażliwe'],
      },
      {
        text: 'Jak kobiety wypadają w porównaniu z mężczyznami pod względem rozpoznawania emocji?',
        answer: 'Kobiety są statystycznie lepsze w rozpoznawaniu wyrazu twarzy i emocji',
        options: ['Mężczyźni są lepsi w rozpoznawaniu emocji', 'Brak różnicy między płciami', 'Kobiety są statystycznie lepsze w rozpoznawaniu wyrazu twarzy i emocji', 'Kobiety lepiej rozpoznają radość, mężczyźni – złość'],
      },
      {
        text: 'Która część mózgu jest statystycznie większa u kobiet niż u mężczyzn?',
        answer: 'Spoidło wielkie (corpus callosum) – lepsza komunikacja między półkulami',
        options: ['Ciało migdałowate', 'Spoidło wielkie (corpus callosum) – lepsza komunikacja między półkulami', 'Móżdżek', 'Kora wzrokowa'],
      },
      {
        text: 'Ile procent kobiet jest leworęczna?',
        answer: 'Około 9–10% – podobnie jak mężczyźni (lekko mniej)',
        options: ['Tylko 1%', 'Około 9–10% – podobnie jak mężczyźni (lekko mniej)', 'Ponad 30%', 'Kobiety zawsze są praworęczne'],
      },
      {
        text: 'Dlaczego kobiety są bardziej podatne na choroby autoimmunologiczne?',
        answer: 'Silniejszy układ immunologiczny sprawia, że częściej atakuje własne tkanki',
        options: ['Kobiety mają słabszy układ odpornościowy', 'Silniejszy układ immunologiczny sprawia, że częściej atakuje własne tkanki', 'Kobiety są bardziej narażone na stres', 'Hormony żeńskie bezpośrednio uszkadzają własne komórki'],
      },
      {
        text: 'Co to jest "pink tax"?',
        answer: 'Zjawisko wyższych cen produktów przeznaczonych dla kobiet niż identycznych dla mężczyzn',
        options: ['Podatek od tamponów i podpasek', 'Zjawisko wyższych cen produktów przeznaczonych dla kobiet niż identycznych dla mężczyzn', 'Różnica w zarobkach między płciami', 'Opłata za wizyty ginekologiczne'],
      },
      {
        text: 'Jak kobiety śpią w porównaniu do mężczyzn?',
        answer: 'Kobiety potrzebują statystycznie o 20 minut dłuższego snu i mają więcej zaburzeń snu',
        options: ['Kobiety śpią krócej i potrzebują mniej snu', 'Brak różnicy między płciami', 'Kobiety potrzebują statystycznie o 20 minut dłuższego snu i mają więcej zaburzeń snu', 'Kobiety śpią głębiej – mniej problemów ze snem'],
      },
      {
        text: 'Ile procent badań klinicznych historycznie wykluczało kobiety jako uczestniczki?',
        answer: 'Do lat 90. XX w. ok. 70% badań klinicznych prowadzono wyłącznie na mężczyznach',
        options: ['Poniżej 5%', 'Około 20%', 'Do lat 90. XX w. ok. 70% badań klinicznych prowadzono wyłącznie na mężczyznach', 'Kobiety zawsze były włączane do badań'],
      },

      // ── KOBIETY I ZDROWIE SEKSUALNE ──────────────────────────────────────────
      {
        text: 'Ile procent kobiet doświadczyło bólu podczas seksu co najmniej raz?',
        answer: 'Około 75% kobiet doświadczyło bolesnego seksu przynajmniej raz',
        options: ['Poniżej 5%', 'Około 25%', 'Około 50%', 'Około 75% kobiet doświadczyło bolesnego seksu przynajmniej raz'],
      },
      {
        text: 'Ile procent kobiet cierpi na przewlekłą dyspareuniię (regularny ból podczas seksu)?',
        answer: 'Około 10–20%',
        options: ['Poniżej 0,5%', 'Około 2%', 'Około 10–20%', 'Ponad 50%'],
      },
      {
        text: 'Co to jest wulwodynia?',
        answer: 'Przewlekły, trudny do wyjaśnienia ból sromu – dotyka ~8–16% kobiet',
        options: ['Ostry ból podczas miesiączki', 'Zapalenie pochwy wywołane grzybicą', 'Przewlekły, trudny do wyjaśnienia ból sromu – dotyka ~8–16% kobiet', 'Ból po porodzie ustępujący po tygodniu'],
      },
      {
        text: 'Ile procent kobiet aktywnych seksualnie miało przynajmniej raz zakażenie grzybicze pochwy?',
        answer: 'Około 75% kobiet przynajmniej raz w życiu',
        options: ['Poniżej 5%', 'Około 25%', 'Około 50%', 'Około 75% kobiet przynajmniej raz w życiu'],
      },
      {
        text: 'Co to jest pochwica (vaginismus) i ile kobiet dotyka?',
        answer: 'Mimowolny skurcz mięśni pochwy uniemożliwiający penetrację – ok. 1–7% kobiet',
        options: ['Dobrowolna kontrola pochwy', 'Mimowolny skurcz mięśni pochwy uniemożliwiający penetrację – ok. 1–7% kobiet', 'Przewlekłe suchość pochwy', 'Brak odczuwania podczas stosunku'],
      },
      {
        text: 'Ile procent kobiet po menopauzie cierpi na suchość pochwy?',
        answer: 'Około 50–60% – wywołana niedoborem estrogenów',
        options: ['Poniżej 5%', 'Około 20%', 'Około 50–60% – wywołana niedoborem estrogenów', 'Prawie wszystkie – ~99%'],
      },
      {
        text: 'Jakie jest ryzyko raka szyjki macicy u kobiet niezaszczepionych i nieprzebadanych cytologicznie?',
        answer: 'Znacząco wyższe – cytologia i szczepionka HPV razem redukują ryzyko o ponad 90%',
        options: ['Identyczne jak u zaszczepionych', 'Nieznacznie wyższe', 'Znacząco wyższe – cytologia i szczepionka HPV razem redukują ryzyko o ponad 90%', 'Niższe – niezaszczepione kobiety mają silniejszą naturalną odporność'],
      },
      {
        text: 'Co to jest rak jajnika i dlaczego jest groźny?',
        answer: '"Cichy zabójca" – rzadko daje objawy we wczesnym stadium; 70% przypadków wykrywa się późno',
        options: ['Łatwy do wykrycia przez badanie cytologiczne', '"Cichy zabójca" – rzadko daje objawy we wczesnym stadium; 70% przypadków wykrywa się późno', 'Najczęstszy nowotwór kobiecy', 'Całkowicie wyleczalny, wykrywany we wczesnym stadium u ~95%'],
      },
      {
        text: 'Ile procent kobiet po 40. roku życia robi regularną mammografię?',
        answer: 'Tylko ok. 50–60% w Polsce (wg NFZ) – mimo darmowych badań',
        options: ['Prawie wszystkie – ~95%', 'Około 80%', 'Tylko ok. 50–60% w Polsce (wg NFZ) – mimo darmowych badań', 'Poniżej 5%'],
      },
      {
        text: 'Co kobiety powinny wiedzieć o raku piersi?',
        answer: '1 na 8 kobiet zachoruje na raka piersi – wczesne wykrycie daje ~98% szans wyleczenia',
        options: ['Rak piersi dotyka wyłącznie kobiety po menopauzie', '1 na 8 kobiet zachoruje na raka piersi – wczesne wykrycie daje ~98% szans wyleczenia', 'Rak piersi jest rzadki – dotyczy mniej niż 0,1% kobiet', 'Mężczyźni chorują na raka piersi równie często'],
      },

      // ── KOBIETY I PŁODNOŚĆ ───────────────────────────────────────────────────
      {
        text: 'Ile procent par, w których kobieta ma ponad 40 lat, jest w stanie zajść w ciążę naturalnie?',
        answer: 'Około 5–10% przy próbach w ciągu roku',
        options: ['Ponad 80% – wiek nie ma znaczenia', 'Około 50%', 'Około 5–10% przy próbach w ciągu roku', 'Zero – ciąża po 40. jest niemożliwa'],
      },
      {
        text: 'Co to jest "zamrażanie komórek jajowych" (social egg freezing)?',
        answer: 'Vitryfikacja (szybkie mrożenie) komórek jajowych dla zachowania płodności na przyszłość',
        options: ['Zamrażanie całego jajnika', 'Vitryfikacja (szybkie mrożenie) komórek jajowych dla zachowania płodności na przyszłość', 'Hormonalne zatrzymanie owulacji na kilka lat', 'Przechowywanie zarodków po IVF'],
      },
      {
        text: 'Do jakiego wieku zamrożone komórki jajowe zachowują dobrą jakość wg ekspertów?',
        answer: 'Do ok. 35–37 roku życia – zamrożenie przed 35. daje najlepsze wyniki',
        options: ['Do 20. roku życia', 'Do ok. 35–37 roku życia – zamrożenie przed 35. daje najlepsze wyniki', 'Wiek nie ma znaczenia – jakość jest zawsze taka sama', 'Po 50. roku życia komórki są najlepszej jakości'],
      },
      {
        text: 'Co to jest test owulacji (LH test) i jak działa?',
        answer: 'Wykrywa skok LH przed owulacją – pomaga ustalić okno płodne',
        options: ['Test ciążowy z moczu', 'Wykrywa skok LH przed owulacją – pomaga ustalić okno płodne', 'Badanie krwi mierzące estrogeny', 'Ultradźwięki sprawdzające rozmiar pęcherzyka'],
      },
      {
        text: 'Jak spożywanie alkoholu wpływa na płodność kobiety?',
        answer: 'Nawet umiarkowane spożycie (3–5 drinków tygodniowo) może obniżyć szansę zapłodnienia',
        options: ['Alkohol nie wpływa na płodność', 'Nawet umiarkowane spożycie (3–5 drinków tygodniowo) może obniżyć szansę zapłodnienia', 'Alkohol zwiększa płodność przez relaksację', 'Tylko ciężki alkoholizm wpływa na płodność'],
      },
      {
        text: 'Ile procent poronień wynika z wad chromosomalnych zarodka?',
        answer: 'Około 50–60% – szczególnie u kobiet po 35. roku życia',
        options: ['Mniej niż 1%', 'Około 20%', 'Około 50–60% – szczególnie u kobiet po 35. roku życia', 'Prawie wszystkie – ~99%'],
      },
      {
        text: 'Co to jest hiperstymulacja jajników (OHSS)?',
        answer: 'Powikłanie po stymulacji hormonalnej przy IVF – jajniki nadmiernie się powiększają',
        options: ['Naturalne powiększenie jajników podczas owulacji', 'Powikłanie po stymulacji hormonalnej przy IVF – jajniki nadmiernie się powiększają', 'Choroba autoimmunologiczna jajników', 'Infekcja jajników po zabiegu'],
      },

      // ── KOBIETY I ANTYKONCEPCJA ──────────────────────────────────────────────
      {
        text: 'Ile procent kobiet stosuje pigułkę antykoncepcyjną na świecie?',
        answer: 'Około 9% kobiet w wieku rozrodczym globalnie – wyżej w Europie (~28–35%)',
        options: ['Prawie wszystkie – ~90%', 'Około 50%', 'Około 9% kobiet w wieku rozrodczym globalnie – wyżej w Europie (~28–35%)', 'Mniej niż 1%'],
      },
      {
        text: 'Co to jest antykoncepcja awaryjna (plan B / ellaOne) i jak działa?',
        answer: 'Tabletka przyjmowana do 72–120h po stosunku – opóźnia owulację lub uniemożliwia implantację',
        options: ['Tabletka aborcyjna powodująca poronienie', 'Tabletka przyjmowana do 72–120h po stosunku – opóźnia owulację lub uniemożliwia implantację', 'Specjalna prezerwatywa do stosowania po stosunku', 'Zastrzyk podawany przez lekarza w ciągu doby'],
      },
      {
        text: 'Jak wkładka domaciczna (IUD miedziana) działa antykoncepcyjnie?',
        answer: 'Miedź działa toksycznie na plemniki i utrudnia ich ruch oraz implantację',
        options: ['Zatrzymuje owulację jak pigułka', 'Miedź działa toksycznie na plemniki i utrudnia ich ruch oraz implantację', 'Tworzy fizyczną barierę uniemożliwiającą penetrację', 'Zmienia pH pochwy na bardzo kwaśne'],
      },
      {
        text: 'Ile lat działa hormonalna wkładka domaciczna (IUD Mirena)?',
        answer: 'Do 8 lat (Mirena) lub 3–5 lat (mniejsze systemy)',
        options: ['6 miesięcy', '1 rok', 'Do 8 lat (Mirena) lub 3–5 lat (mniejsze systemy)', '20 lat'],
      },
      {
        text: 'Co to jest implant antykoncepcyjny (Implanon/Nexplanon)?',
        answer: 'Pręcik wkładany pod skórę ramienia uwalniający progestogen – działa do 3 lat',
        options: ['Tabletka do połknięcia raz w miesiącu', 'Pręcik wkładany pod skórę ramienia uwalniający progestogen – działa do 3 lat', 'Plaster przyklejany do brzucha', 'Zastrzyk podawany co tydzień'],
      },
      {
        text: 'Jak metoda naturalnego planowania rodziny (NPR) różni się od antykoncepcji hormonalnej?',
        answer: 'NPR opiera się na obserwacji cyklu – mniej skuteczna (~76–99%), ale bez hormonów',
        options: ['NPR jest skuteczniejsza niż pigułka', 'NPR opiera się na obserwacji cyklu – mniej skuteczna (~76–99%), ale bez hormonów', 'NPR i pigułka mają identyczną skuteczność', 'NPR to wyłącznie metoda termiczna'],
      },
      {
        text: 'Jaka jest skuteczność prezerwatywy żeńskiej (wewnętrznej)?',
        answer: 'Około 79–95% przy typowym stosowaniu – nieco mniej niż prezerwatywa męska',
        options: ['100% – jest szczelna jak torebka plastikowa', 'Około 79–95% przy typowym stosowaniu – nieco mniej niż prezerwatywa męska', 'Poniżej 50% – jest praktycznie bezużyteczna', 'Identyczna jak prezerwatywa męska – 98%'],
      },

      // ── KOBIETY I ZWIĄZKI ────────────────────────────────────────────────────
      {
        text: 'Co kobiety cenią najwyżej w potencjalnym partnerze seksualnym wg badań ewolucyjnych?',
        answer: 'Zasoby, status i zdolność do ochrony rodziny – ponad samą atrakcyjność fizyczną',
        options: ['Wyłącznie wygląd i muskulaturę', 'Zasoby, status i zdolność do ochrony rodziny – ponad samą atrakcyjność fizyczną', 'Poczucie humoru ponad wszystko inne', 'Inteligencję mierzoną IQ'],
      },
      {
        text: 'Jak kobiety reagują na "efekt halo" w kontekście seksualnym?',
        answer: 'Atrakcyjne osoby są postrzegane jako bardziej kompetentne, dobre i godne zaufania',
        options: ['Kobiety nie podlegają efektowi halo', 'Atrakcyjne osoby są postrzegane jako bardziej kompetentne, dobre i godne zaufania', 'Kobiety postrzegają atrakcyjnych mężczyzn jako mniej godnych zaufania', 'Efekt halo dotyczy wyłącznie mężczyzn'],
      },
      {
        text: 'Ile procent kobiet byłoby zadowolona z rzadszego seksu w związku niż ma aktualnie?',
        answer: 'Około 30–40% – "desire discrepancy" jest bardzo powszechne',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–40% – "desire discrepancy" jest bardzo powszechne', 'Prawie wszystkie – kobiety zawsze chcą mniej seksu'],
      },
      {
        text: 'Co mówią badania o kobietach i zdradzie?',
        answer: 'Kobiety zdradzają równie często co mężczyźni, ale z innych powodów – częściej emocjonalnych',
        options: ['Kobiety niemal nigdy nie zdradzają – to domena mężczyzn', 'Kobiety zdradzają równie często co mężczyźni, ale z innych powodów – częściej emocjonalnych', 'Kobiety zdradzają 3x częściej niż mężczyźni', 'Kobiety zdradzają wyłącznie dla seksu'],
      },
      {
        text: 'Jak kobiety reagują na "seksualną nudę" w długotrwałym związku?',
        answer: 'Częściej szukają emocjonalnej głębi i nowych doświadczeń; rzadziej nowego partnera',
        options: ['Natychmiast kończą związek', 'Częściej szukają emocjonalnej głębi i nowych doświadczeń; rzadziej nowego partnera', 'Akceptują nudę jako normalną część życia bez działania', 'Zawsze szukają kochanka poza związkiem'],
      },
      {
        text: 'Ile procent kobiet przyznaje, że ich najlepszy seks był z byłym partnerem?',
        answer: 'Około 35–40% w badaniach anonimowych ankiet',
        options: ['Poniżej 1%', 'Około 10%', 'Około 35–40% w badaniach anonimowych ankiet', 'Prawie wszystkie – ~90%'],
      },
      {
        text: 'Jak długo trwa "etap zakochania" (limerence) z neurobiologicznego punktu widzenia?',
        answer: '6–18 miesięcy – potem mózg adaptuje się i intensywność spada',
        options: ['Zawsze trwa całe życie', 'Dokładnie 3 miesiące', '6–18 miesięcy – potem mózg adaptuje się i intensywność spada', 'Tylko 2 tygodnie – to zjawisko bardzo krótkotrwałe'],
      },

      // ── KOBIETY W HISTORII I KULTURZE ────────────────────────────────────────
      {
        text: 'Kiedy kobiety w Polsce uzyskały prawo głosu?',
        answer: 'W 1918 roku – jedna z pierwszych demokracji przyznająca kobietom prawa wyborcze',
        options: ['Dopiero w 1945 roku', 'W 1918 roku – jedna z pierwszych demokracji przyznająca kobietom prawa wyborcze', 'W 2000 roku', 'Kobiety w Polsce zawsze miały prawo głosu'],
      },
      {
        text: 'Kto napisał "Drugi sex" – przełomową książkę o kobiecości?',
        answer: 'Simone de Beauvoir (1949) – fundament filozofii feministycznej',
        options: ['Virginia Woolf', 'Simone de Beauvoir (1949) – fundament filozofii feministycznej', 'Betty Friedan', 'Germaine Greer'],
      },
      {
        text: 'Co to było "Kinsey Scale" i jak dotyczyło kobiet?',
        answer: 'Skala Kinseya (0–6) mierząca orientację – kobiety wypadały statystycznie mniej "jedynkowo" niż mężczyźni',
        options: ['Skala mierzącą atrakcyjność fizyczną kobiet', 'Skala Kinseya (0–6) mierząca orientację – kobiety wypadały statystycznie mniej "jedynkowo" niż mężczyźni', 'Test IQ stworzony dla kobiet', 'Skala bólu menstruacyjnego'],
      },
      {
        text: 'Która badaczka opublikowała w 1976 r. "Hite Report" – pierwsze masowe badanie kobiecej seksualności?',
        answer: 'Shere Hite',
        options: ['Virginia Johnson', 'Betty Dodson', 'Shere Hite', 'Helen Singer Kaplan'],
      },
      {
        text: 'Ile lat temu Światowa Organizacja Zdrowia usunęła homoseksualizm z listy zaburzeń psychicznych?',
        answer: 'W 1990 roku – ponad 35 lat temu',
        options: ['W 1950 roku', 'W 1990 roku – ponad 35 lat temu', 'Dopiero w 2010 roku', 'WHO nigdy tego nie zrobiła'],
      },
      {
        text: 'Co to był ruch "SlutWalk" i skąd pochodzi?',
        answer: 'Marsz z 2011 roku w Toronto protestujący przeciwko victim-blaming – "ubierasz się jak kurwa"',
        options: ['Festiwal muzyczny dla kobiet w latach 70.', 'Marsz z 2011 roku w Toronto protestujący przeciwko victim-blaming – "ubierasz się jak kurwa"', 'Protest kobiet za prawem do aborcji', 'Ruch feministyczny z lat 60. walczący o pracę'],
      },
      {
        text: 'W którym roku kobiety uzyskały prawo do własnego konta bankowego bez zgody męża w USA?',
        answer: 'Dopiero w 1974 roku (Equal Credit Opportunity Act)',
        options: ['W 1920 roku – razem z prawem głosu', 'W 1950 roku', 'Dopiero w 1974 roku (Equal Credit Opportunity Act)', 'W 2000 roku'],
      },

      // ── KOBIETY I PSYCHOLOGIA SEKSUALNA ─────────────────────────────────────
      {
        text: 'Jak kobiety przeżywają seks emocjonalnie inaczej niż mężczyźni?',
        answer: 'Kobiety silniej łączą seks z emocjami i relacją – kontekst emocjonalny jest kluczowy dla podniecenia',
        options: ['Identycznie – nie ma różnic emocjonalnych między płciami', 'Kobiety przeżywają seks czysto fizycznie, bez emocji', 'Kobiety silniej łączą seks z emocjami i relacją – kontekst emocjonalny jest kluczowy dla podniecenia', 'Kobiety są bardziej wizualne niż mężczyźni'],
      },
      {
        text: 'Co to jest "sexual script" (skrypt seksualny) i jak dotyczy kobiet?',
        answer: 'Kulturowe scenariusze zachowań seksualnych – kobiety są uczone bierności, mężczyźni aktywności',
        options: ['Biologicznie zaprogramowane zachowania seksualne', 'Kulturowe scenariusze zachowań seksualnych – kobiety są uczone bierności, mężczyźni aktywności', 'Skrypt terapii seksualnej dla par', 'Plan działania w związku'],
      },
      {
        text: 'Ile procent kobiet doświadczyło problemu z podnieceniem seksualnym (trudności z nawilżeniem)?',
        answer: 'Około 20–25% kobiet regularnie lub okazjonalnie',
        options: ['Poniżej 1%', 'Około 5%', 'Około 20–25% kobiet regularnie lub okazjonalnie', 'Prawie wszystkie kobiety po 40. roku życia'],
      },
      {
        text: 'Jak trauma seksualna wpływa na seksualność kobiety?',
        answer: 'Często prowadzi do PTSD, dysocjacji, bólu podczas seksu i trudności z intymnością',
        options: ['Trauma nie ma wpływu na seksualność', 'Często prowadzi do PTSD, dysocjacji, bólu podczas seksu i trudności z intymnością', 'Zwiększa wrażliwość seksualną jako mechanizm kompensacyjny', 'Powoduje wyłącznie lęk, bez fizycznych objawów'],
      },
      {
        text: 'Co to jest "spectatoring" i jak wpływa na orgazm kobiety?',
        answer: '"Obserwowanie" siebie z zewnątrz podczas seksu zamiast bycia obecną – blokuje orgazm',
        options: ['Świadome ćwiczenie świadomości ciała podczas seksu', '"Obserwowanie" siebie z zewnątrz podczas seksu zamiast bycia obecną – blokuje orgazm', 'Fantazjowanie o innym partnerze', 'Technika medytacyjna poprawiająca orgazm'],
      },
      {
        text: 'Jak mindfulness (uważność) wpływa na seksualność kobiety?',
        answer: 'Regularna praktyka poprawia podniecenie, nawilżenie i zdolność do orgazmu wg badań UBC',
        options: ['Nie ma związku z seksualnością', 'Zmniejsza podniecenie przez nadmierne analizowanie', 'Regularna praktyka poprawia podniecenie, nawilżenie i zdolność do orgazmu wg badań UBC', 'Mindfulness dotyczy tylko stresu, nie seksu'],
      },
      {
        text: 'Ile procent kobiet po doświadczeniu nieudanego seksu unika aktywności seksualnej przez pewien czas?',
        answer: 'Około 25–35% – kobiety są bardziej podatne na efekt "negatywnego doświadczenia"',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–35% – kobiety są bardziej podatne na efekt "negatywnego doświadczenia"', 'Prawie wszystkie – ~90%'],
      },

      // ── KOBIETY I CIAŁO – DODATKOWE ──────────────────────────────────────────
      {
        text: 'Jak wiele razy piersi mogą zmienić rozmiar przez całe życie kobiety?',
        answer: 'Wielokrotnie – cykl, ciąża, karmienie, waga, menopauza – stały jest tylko kształt tkanki',
        options: ['Nigdy – rozmiar piersi jest stały po dojrzewaniu', 'Raz – podczas ciąży', 'Wielokrotnie – cykl, ciąża, karmienie, waga, menopauza – stały jest tylko kształt tkanki', 'Dwa razy – podczas dojrzewania i po menopauzie'],
      },
      {
        text: 'Ile procent kobiet ma asymetryczne piersi?',
        answer: 'Niemal wszystkie – do 88% kobiet ma zauważalną asymetrię',
        options: ['Poniżej 1%', 'Około 20%', 'Około 50%', 'Niemal wszystkie – do 88% kobiet ma zauważalną asymetrię'],
      },
      {
        text: 'Dlaczego brodawki sutkowe mogą być wrażliwe w różnych fazach cyklu?',
        answer: 'Progesteron i estrogen zmieniają wrażliwość tkanki piersi – szczyt przed miesiączką',
        options: ['Wrażliwość brodawek jest stała i nie zmienia się', 'Progesteron i estrogen zmieniają wrażliwość tkanki piersi – szczyt przed miesiączką', 'Brodawki są wrażliwe tylko podczas karmienia', 'Tylko kobiety z dużymi piersiami odczuwają zmienną wrażliwość'],
      },
      {
        text: 'Ile procent kobiet doświadcza mastalgii (bólu piersi) cyklicznie?',
        answer: 'Około 70% kobiet doświadcza cyklicznego bólu piersi przed miesiączką',
        options: ['Poniżej 5%', 'Około 25%', 'Około 70% kobiet doświadcza cyklicznego bólu piersi przed miesiączką', 'Prawie wszystkie – ~99%'],
      },
      {
        text: 'Co to jest gardnereloza i jak się objawia?',
        answer: 'Zaburzenie flory pochwy – szarawobiała wydzielina o rybim zapachu',
        options: ['Zakażenie grzybicze – biała serowata wydzielina bez zapachu', 'Zaburzenie flory pochwy – szarawobiała wydzielina o rybim zapachu', 'Wirusowe STI powodujące pęcherze na sromie', 'Pasożytnicze zakażenie bez żadnych objawów'],
      },
      {
        text: 'Ile procent kobiet po 40. roku życia doświadcza perimenopauzy?',
        answer: 'Perimenopauza może zacząć się już po 40. roku życia u ~10%, a po 45. u większości',
        options: ['Perimenopauza zaczyna się dopiero po 60. roku życia', 'Wszystkie kobiety po 30. roku życia', 'Perimenopauza może zacząć się już po 40. roku życia u ~10%, a po 45. u większości', 'Perimenopauza trwa zawsze 10 dni'],
      },
      {
        text: 'Jak ciąża zmienia mózg kobiety?',
        answer: '"Pregnancy brain" – zmiany strukturalne ułatwiające wiązanie z dzieckiem, trwają lata',
        options: ['Ciąża zmniejsza inteligencję o 20% trwale', '"Pregnancy brain" – zmiany strukturalne ułatwiające wiązanie z dzieckiem, trwają lata', 'Ciąża nie wpływa na mózg kobiety', 'Mózg wraca do normy 1 dzień po porodzie'],
      },
      {
        text: 'Ile procent kobiet doświadcza "pregnancy brain" – problemów z pamięcią i koncentracją?',
        answer: 'Około 80% ciężarnych – potwierdzono to badaniami neuroobrazowania',
        options: ['Poniżej 5% – to wyłącznie mit', 'Około 20%', 'Około 80% ciężarnych – potwierdzono to badaniami neuroobrazowania', 'Tylko kobiety z depresją ciążową'],
      },
      {
        text: 'Jak karmienie piersią wpływa na seksualne libido kobiety?',
        answer: 'Wysoki poziom prolaktyny i niski estrogenów często obniżają libido i powodują suchość pochwy',
        options: ['Zawsze zwiększa libido', 'Nie wpływa na libido', 'Wysoki poziom prolaktyny i niski estrogenów często obniżają libido i powodują suchość pochwy', 'Karmienie piersią wzmacnia więź z partnerem i poprawia seks'],
      },

      // ── FINAŁOWA SERIA ────────────────────────────────────────────────────────
      {
        text: 'Co mówią badania o kobietach i seksie po 60. roku życia?',
        answer: 'Około 40–65% kobiet po 60. jest aktywnych seksualnie i deklaruje satysfakcję',
        options: ['Aktywność seksualna całkowicie zanika po menopauzie', 'Około 40–65% kobiet po 60. jest aktywnych seksualnie i deklaruje satysfakcję', 'Seks po 60. jest możliwy wyłącznie z pomocą leków', 'Tylko kobiety z partnerem mogą być aktywne seksualnie po 60.'],
      },
      {
        text: 'Co to jest "sexual afterglow" i jak długo trwa u kobiet?',
        answer: 'Poczucie bliskości, dobrostanu i satysfakcji po seksie – u kobiet trwa ok. 48 godzin',
        options: ['Ból mięśni po intensywnym seksie', 'Poczucie bliskości, dobrostanu i satysfakcji po seksie – u kobiet trwa ok. 48 godzin', 'Zjawisko tylko u mężczyzn po orgazmie', 'Zaczerwienienie skóry trwające kilka minut'],
      },
      {
        text: 'Ile procent kobiet używa aplikacji do śledzenia cyklu menstruacyjnego?',
        answer: 'Ponad 30% kobiet w wieku rozrodczym – szczególnie w grupie 20–35 lat',
        options: ['Poniżej 1%', 'Około 10%', 'Ponad 30% kobiet w wieku rozrodczym – szczególnie w grupie 20–35 lat', 'Prawie wszystkie – ~90%'],
      },
      {
        text: 'Jak data owulacji może wpływać na głos kobiety?',
        answer: 'Głos staje się lekko wyższy i bardziej atrakcyjny dla mężczyzn tuż przed owulacją',
        options: ['Głos kobiety nie zmienia się przez cały cykl', 'Głos staje się lekko wyższy i bardziej atrakcyjny dla mężczyzn tuż przed owulacją', 'Głos jest najniższy podczas owulacji', 'Zmiany głosu są losowe i niezwiązane z cyklem'],
      },
      {
        text: 'Ile procent kobiet odczuwa zwiększone libido podczas miesiączki?',
        answer: 'Około 20–30% – mimo (lub z powodu) krwawienia',
        options: ['Prawie żadna – to fizycznie niemożliwe', 'Wszystkie kobiety – miesiączka zawsze zwiększa libido', 'Około 20–30% – mimo (lub z powodu) krwawienia', 'Dokładnie 50%'],
      },
      {
        text: 'Co to jest "breastgasm" (orgazm z brodawek sutkowych)?',
        answer: 'Orgazm osiągany wyłącznie przez stymulację brodawek – doświadcza go ok. 1–2% kobiet',
        options: ['Mit niemający podstaw w neurobiologii', 'Orgazm osiągany wyłącznie przez stymulację brodawek – doświadcza go ok. 1–2% kobiet', 'Forma orgazmu możliwa wyłącznie podczas karmienia piersią', 'Termin opisujący przyjemność z masażu piersi'],
      },
      {
        text: 'Jak kobiety w Polsce postrzegają swoją atrakcyjność seksualną?',
        answer: 'Większość – ok. 60% – uważa, że jest mniej atrakcyjna niż w rzeczywistości (negatywne body image)',
        options: ['Większość ma bardzo wysoką samoocenę seksualną', 'Większość – ok. 60% – uważa, że jest mniej atrakcyjna niż w rzeczywistości (negatywne body image)', 'Samoocena seksualna jest identyczna jak u mężczyzn', 'Kobiety są niezdolne do oceny własnej atrakcyjności'],
      },
      {
        text: 'Co to jest "orgasmic meditation" (OM)?',
        answer: 'Praktyka uważności skupiona na 15-minutowej stymulacji łechtaczki – badana klinicznie',
        options: ['Medytacja buddyjska poprawiająca koncentrację podczas seksu', 'Praktyka uważności skupiona na 15-minutowej stymulacji łechtaczki – badana klinicznie', 'Technika kontrolowania oddechu podczas orgazmu', 'Forma jogi tantrycznej dla par'],
      },
      {
        text: 'Ile procent kobiet zmieniło swoje preferencje seksualne po terapii?',
        answer: 'Terapia seksualna nie zmienia orientacji, ale pomaga ~70–80% z zaburzeniami pożądania',
        options: ['100% – terapia zawsze zmienia preferencje', 'Terapia seksualna nie zmienia orientacji, ale pomaga ~70–80% z zaburzeniami pożądania', 'Mniej niż 5% – terapia jest nieskuteczna', 'Terapia zmienia wyłącznie orientację seksualną'],
      },
      {
        text: 'Ile procent kobiet regularnie czyta treści erotyczne (literatura, fanfiction)?',
        answer: 'Około 25–35% – kobiety dominują jako czytelniczki erotyków',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–35% – kobiety dominują jako czytelniczki erotyków', 'Ponad 80%'],
      },
      {
        text: 'Jak taniec wpływa na pewność seksualną kobiety?',
        answer: 'Badania wskazują wzrost body confidence, libido i satysfakcji seksualnej u kobiet tańczących regularnie',
        options: ['Taniec nie ma związku z seksualnością', 'Badania wskazują wzrost body confidence, libido i satysfakcji seksualnej u kobiet tańczących regularnie', 'Taniec zmniejsza libido przez wyczerpanie fizyczne', 'Wpływa wyłącznie na pewność siebie na imprezach'],
      },
      {
        text: 'Jaki procent kobiet twierdzi, że doświadczyła seksu lepszego po 30. niż przed 30. rokiem życia?',
        answer: 'Ponad 60% – pewność siebie i znajomość własnego ciała poprawia seks z wiekiem',
        options: ['Poniżej 5% – seks jest lepszy tylko u młodszych', 'Około 20%', 'Ponad 60% – pewność siebie i znajomość własnego ciała poprawia seks z wiekiem', 'Wiek nie ma wpływu na jakość seksu'],
      },
      {
        text: 'Ile procent kobiet przyznaje, że seks stał się lepszy po urodzeniu dziecka (po przejściowym trudnym okresie)?',
        answer: 'Około 30–40% – odblokowanie emocjonalne i lepsza komunikacja z partnerem',
        options: ['Poniżej 1%', 'Prawie żadna – macierzyństwo niszczy życie seksualne', 'Około 30–40% – odblokowanie emocjonalne i lepsza komunikacja z partnerem', 'Ponad 90%'],
      },
      {
        text: 'Jak kobiety reagują biologicznie na widok niemowlęcia?',
        answer: 'Wzrost oksytocyny i aktywacja tych samych obszarów nagrody co podczas seksu i zakochania',
        options: ['Brak reakcji hormonalnej na widok niemowlęcia', 'Wzrost oksytocyny i aktywacja tych samych obszarów nagrody co podczas seksu i zakochania', 'Wyłącznie reakcja stresowa z powodu hałasu', 'Kobiety bezdzietne nie mają żadnej reakcji biologicznej'],
      },
      {
        text: 'Co to jest "empathy gap" między płciami w kontekście seksualnym?',
        answer: 'Trudność mężczyzn w rozumieniu kobiecej seksualności – stąd orgasm gap i komunikacyjne problemy',
        options: ['Różnica w poziomie empatii w kłótniach', 'Trudność mężczyzn w rozumieniu kobiecej seksualności – stąd orgasm gap i komunikacyjne problemy', 'Różnica w sile emocjonalnych reakcji na filmy', 'Mit naukowy bez podstaw'],
      },
      {
        text: 'Ile procent kobiet doświadcza seksualnych skutków ubocznych po leczeniu raka piersi?',
        answer: 'Około 70–80% – chemioterapia, hormonoterapia i mastektomia wpływają na seksualność',
        options: ['Poniżej 5%', 'Około 20%', 'Około 70–80% – chemioterapia, hormonoterapia i mastektomia wpływają na seksualność', 'Prawie żadna – leczenie raka nie ma wpływu na seks'],
      },
      {
        text: 'Co to jest "sexual empowerment" i jak wpływa na satysfakcję kobiet?',
        answer: 'Poczucie prawa do własnej przyjemności seksualnej – silnie koreluje z wyższą satysfakcją i częstszymi orgazmami',
        options: ['Termin polityczny bez związku z seksem', 'Poczucie prawa do własnej przyjemności seksualnej – silnie koreluje z wyższą satysfakcją i częstszymi orgazmami', 'Przesadna asertywność seksualna szkodliwa dla relacji', 'Zjawisko dotyczące wyłącznie kobiet po menopauzie'],
      },
      {
        text: 'Ile procent kobiet globalnie nie ma dostępu do antykoncepcji, pomimo że tego pragnie?',
        answer: 'Około 218 milionów kobiet (wg UNFPA) – szczególnie w krajach rozwijających się',
        options: ['Mniej niż 1 milion', 'Około 10 milionów', 'Około 218 milionów kobiet (wg UNFPA) – szczególnie w krajach rozwijających się', 'Ponad 3 miliardy'],
      },
      {
        text: 'Jak kobiety oceniają znaczenie seksu w swoim życiu w porównaniu z mężczyznami?',
        answer: 'Kobiety równie wysoko cenią seks, ale częściej w kontekście emocjonalnym i relacyjnym',
        options: ['Kobiety cenią seks niżej – to wyłącznie domena mężczyzn', 'Kobiety cenią seks wyżej niż mężczyźni', 'Kobiety równie wysoko cenią seks, ale częściej w kontekście emocjonalnym i relacyjnym', 'Nie ma żadnej różnicy w postrzeganiu roli seksu'],
      },
      {
        text: 'Ile procent kobiet czuje się pewnie rozmawiając z partnerem o swoich seksualnych potrzebach?',
        answer: 'Tylko około 30–40% – większość ma trudności z asertywną komunikacją seksualną',
        options: ['Prawie wszystkie – ~90%', 'Około 70%', 'Tylko około 30–40% – większość ma trudności z asertywną komunikacją seksualną', 'Poniżej 5%'],
      },
      {
        text: 'Co badania Kinsey Institute mówią o kobiecej seksualności w ogólnym ujęciu?',
        answer: 'Kobieca seksualność jest bardziej płynna, kontekstualna i zmienna przez całe życie niż męska',
        options: ['Kobiety mają identyczną seksualność jak mężczyźni', 'Kobieca seksualność jest bardziej płynna, kontekstualna i zmienna przez całe życie niż męska', 'Kobiety są mniej seksualne z natury biologicznej', 'Kinsey nie badał kobiet – skupiał się na mężczyznach'],
      },
      {
        text: 'Ile procent kobiet deklaruje, że seks jest dla nich źródłem relaksu i redukcji stresu?',
        answer: 'Około 55–65% kobiet aktywnych seksualnie wskazuje seks jako skuteczną metodę relaksu',
        options: ['Poniżej 5%', 'Około 20%', 'Około 55–65% kobiet aktywnych seksualnie wskazuje seks jako skuteczną metodę relaksu', 'Prawie wszystkie – ~99%'],
      },
      {
        text: 'Co to jest "aftercare" w kontekście seksualnym i dlaczego jest ważny dla kobiet?',
        answer: 'Opieka emocjonalna i fizyczna po seksie (tulenie, rozmowa) – kobiety potrzebują go częściej niż mężczyźni',
        options: ['Pielęgnacja ciała po seksie (prysznic, krem)', 'Opieka emocjonalna i fizyczna po seksie (tulenie, rozmowa) – kobiety potrzebują go częściej niż mężczyźni', 'Termin medyczny dla rekonwalescencji po operacji ginekologicznej', 'Ćwiczenia Kegela wykonywane po stosunku'],
      },
    ],
  },
  {
    id: 'alcohol',
    name: '🥂 Alkohole i drinki',
    description: 'Sprawdźcie się zanim sięgniecie po kolejnego drinka',
    color: '#f97316',
    border: 'rgba(249,115,22,0.5)',
    bg: 'rgba(249,115,22,0.07)',
    questions: [
      // Podstawy alkoholu i metabolizm
      {
        text: 'Który alkohol powoduje statystycznie najlżejszego kaca przez małą ilość kongenery?',
        answer: 'Wódka',
        options: ['Bourbon', 'Brandy', 'Ciemny rum', 'Wódka'],
      },
      {
        text: 'Dlaczego kobiety upijają się szybciej niż mężczyźni przy tej samej ilości alkoholu?',
        answer: 'Mniej wody w organizmie i mniej enzymu ADH w żołądku',
        options: ['Mniejsza masa ciała', 'Szybszy metabolizm', 'Mniej wody w organizmie i mniej enzymu ADH w żołądku', 'Bardziej wrażliwy układ nerwowy'],
      },
      {
        text: 'Ile gramów czystego alkoholu zawiera jedna "standardowa porcja" wg WHO?',
        answer: '10 g',
        options: ['2 g', '5 g', '10 g', '25 g'],
      },
      {
        text: 'Jak szybko alkohol wchłania się do krwioobiegu na pusty żołądek?',
        answer: '30–45 minut',
        options: ['2–5 minut', '10–15 minut', '30–45 minut', 'Ponad 3 godziny'],
      },
      {
        text: 'Ile kcal ma kieliszek wytrawnego wina (150 ml, ~12%)?',
        answer: 'Około 120–130 kcal',
        options: ['Około 20 kcal', 'Około 60 kcal', 'Około 120–130 kcal', 'Ponad 350 kcal'],
      },
      {
        text: 'Który kraj produkuje najwięcej wina na świecie wg OIV 2022?',
        answer: 'Włochy',
        options: ['Francja', 'Włochy', 'Hiszpania', 'USA'],
      },
      {
        text: 'Jak się nazywa drink z szampana i soku pomarańczowego?',
        answer: 'Mimosa',
        options: ['Bellini', 'Spritz', 'Kir Royale', 'Mimosa'],
      },
      {
        text: 'Co to jest "beer goggles effect" udowodniony naukowo?',
        answer: 'Postrzeganie innych jako atrakcyjniejszych po alkoholu',
        options: ['Zamazane, nieostre widzenie po alkoholu', 'Postrzeganie innych jako atrakcyjniejszych po alkoholu', 'Uczucie przyjemnego ciepła po piwie', 'Stopniowy wzrost tolerancji na alkohol'],
      },
      {
        text: 'Przy jakim stężeniu promili alkoholu we krwi grozi utrata przytomności?',
        answer: '2,5–3‰',
        options: ['0,5‰', '1,2‰', '2,5–3‰', '5‰'],
      },
      {
        text: 'Ile procent alkoholu ma standardowy shot wódki?',
        answer: '40%',
        options: ['20%', '30%', '40%', '70%'],
      },
      // Koktajle i drinki
      {
        text: 'Z czego zrobiony jest klasyczny Cosmopolitan?',
        answer: 'Wódka cytrynowa, triple sec, żurawina, sok z limonki',
        options: ['Gin, tonik, limonka, mięta', 'Rum, coca-cola, limonka', 'Wódka cytrynowa, triple sec, żurawina, sok z limonki', 'Tequila, triple sec, sok z cytryny'],
      },
      {
        text: 'Jaki alkohol jest bazą klasycznego Mojito?',
        answer: 'Biały rum',
        options: ['Wódka', 'Biały rum', 'Gin', 'Tequila'],
      },
      {
        text: 'Co wchodzi w skład drinka Aperol Spritz?',
        answer: 'Aperol, prosecco, woda gazowana',
        options: ['Aperol, wódka, tonic', 'Campari, prosecco, pomarańcza', 'Aperol, prosecco, woda gazowana', 'Aperol, biały rum, limonka'],
      },
      {
        text: 'Skąd pochodzi drink Margarita?',
        answer: 'Meksyk',
        options: ['Kuba', 'Brazylia', 'Meksyk', 'USA'],
      },
      {
        text: 'Co to jest "Sex on the Beach"?',
        answer: 'Drink z wódki, soku brzoskwiniowego, soku pomarańczowego i grenadyny',
        options: ['Drink z rumu, mleka kokosowego i soku ananasowego', 'Drink z ginu, tequili i limonki', 'Drink z wódki, soku brzoskwiniowego, soku pomarańczowego i grenadyny', 'Drink z szampana i soku malinowego'],
      },
      {
        text: 'Skąd pochodzi Pina Colada?',
        answer: 'Portoryko – jest jej oficjalnym napojem narodowym',
        options: ['Kuba', 'Jamajka', 'Portoryko – jest jej oficjalnym napojem narodowym', 'Brazylia'],
      },
      {
        text: 'Z czego zrobiony jest Negroni?',
        answer: 'Gin, Campari, słodkie wermut w równych częściach',
        options: ['Whisky, Aperol, wermut', 'Rum, Campari, sok z cytryny', 'Gin, Campari, słodkie wermut w równych częściach', 'Tequila, triple sec, Campari'],
      },
      {
        text: 'Czym różni się Manhattan od Old Fashioned?',
        answer: 'Manhattan ma wermut, Old Fashioned ma cukier i bitter – oba opierają się na whisky',
        options: ['Manhattan jest na bazie ginu', 'Old Fashioned zawiera szampana', 'Manhattan ma wermut, Old Fashioned ma cukier i bitter – oba opierają się na whisky', 'Są identyczne – różnią się tylko kieliszkiem'],
      },
      {
        text: 'Co to jest Bellini?',
        answer: 'Prosecco z puree z białej brzoskwini – pochodzi z Wenecji',
        options: ['Szampan z sokiem truskawkowym', 'Prosecco z puree z białej brzoskwini – pochodzi z Wenecji', 'Wino musujące z mango i grenadyną', 'Wermut z sokiem pomarańczowym'],
      },
      {
        text: 'Jaki alkohol jest bazą drinku Tequila Sunrise?',
        answer: 'Tequila',
        options: ['Rum', 'Wódka', 'Tequila', 'Gin'],
      },
      {
        text: 'Co to jest Kir Royale?',
        answer: 'Szampan z likierem z czarnej porzeczki (crème de cassis)',
        options: ['Prosecco z sokiem pomarańczowym', 'Szampan z sokiem malinowym', 'Szampan z likierem z czarnej porzeczki (crème de cassis)', 'Wino musujące z wodą różaną'],
      },
      {
        text: 'Z czego składa się klasyczna Caipirinha?',
        answer: 'Cachaça, limonka, cukier trzcinowy – narodowy drink Brazylii',
        options: ['Rum, limonka, cukier, mięta', 'Tequila, limonka, sól', 'Cachaça, limonka, cukier trzcinowy – narodowy drink Brazylii', 'Wódka, limona, cukier, syrop'],
      },
      {
        text: 'Co to jest Hugo?',
        answer: 'Prosecco, syrop z kwiatów czarnego bzu, woda gazowana, mięta – popularny w Alpach',
        options: ['Gin z tonikiem i ogórkiem', 'Prosecco, syrop z kwiatów czarnego bzu, woda gazowana, mięta – popularny w Alpach', 'Wódka z sokiem jabłkowym i cynamonem', 'Szampan z lodem i grenadyną'],
      },
      {
        text: 'Jak się nazywa drink z wódki i napoju energetycznego?',
        answer: 'Vodka Energy (lub „Wódka Red Bull")',
        options: ['Power Shot', 'Energizer', 'Vodka Energy (lub „Wódka Red Bull")', 'Electric Lemonade'],
      },
      {
        text: 'Z czego zrobiony jest Daiquiri?',
        answer: 'Biały rum, sok z limonki, cukier',
        options: ['Biały rum, mleko kokosowe, ananas', 'Biały rum, sok z limonki, cukier', 'Tequila, sok z cytryny, syrop', 'Cachaça, limonka, syrop cukrowy'],
      },
      {
        text: 'Które miasto jest uważane za kolebkę koktajlu Mojito?',
        answer: 'Hawana (Kuba)',
        options: ['Miami', 'Hawana (Kuba)', 'Nowy Jork', 'Mexico City'],
      },
      {
        text: 'Co to jest "dry martini"?',
        answer: 'Gin (lub wódka) z minimalną ilością wermut wytrawnego, garnirowany oliwką lub skórką cytryny',
        options: ['Martini bez lodu', 'Gin z tonikiem bez cukru', 'Gin (lub wódka) z minimalną ilością wermut wytrawnego, garnirowany oliwką lub skórką cytryny', 'Wermut podany bez mieszania'],
      },
      {
        text: 'Co to jest "Long Island Iced Tea"?',
        answer: 'Drink z wódki, ginu, rumu, tequili, triple sec i soku cytrynowego – bez herbaty, ale wygląda jak mrożona',
        options: ['Herbata z whisky i lodem', 'Drink z rumu i herbaty mrożonej', 'Drink z wódki, ginu, rumu, tequili, triple sec i soku cytrynowego – bez herbaty, ale wygląda jak mrożona', 'Napar herbaciany z alkoholem cytrusowym'],
      },
      {
        text: 'Jaka jest różnica między shakerem a mieszaczem (stirrer) przy koktajlach?',
        answer: 'Shaker napowietrza i schładza szybciej (dla drinków z sokiem/jajkiem); stirrer zachowuje klarowność (dla czystych alkoholi)',
        options: ['Shaker służy tylko do drinków bezalkoholowych', 'Stirrer jest szybszy i daje więcej lodu', 'Shaker napowietrza i schładza szybciej (dla drinków z sokiem/jajkiem); stirrer zachowuje klarowność (dla czystych alkoholi)', 'Nie ma różnicy – to kwestia stylu barmana'],
      },
      {
        text: 'Co to jest "Pornstar Martini"?',
        answer: 'Wódka waniliowa, likier marakuja (Passoa), sok z marakui – podawany z kieliszkiem prosecco obok',
        options: ['Wódka z sokiem truskawkowym i grenadyną', 'Gin, sok grejpfrutowy, syrop różany', 'Wódka waniliowa, likier marakuja (Passoa), sok z marakui – podawany z kieliszkiem prosecco obok', 'Szampan z musem mango i wódką'],
      },
      {
        text: 'Co to jest "Espresso Martini"?',
        answer: 'Wódka, likier kawowy (Kahlúa), świeże espresso – shake\'owane z lodem',
        options: ['Kawa z whisky irlandzką i bitą śmietaną', 'Wódka z kawą mrojoną i mlekiem', 'Wódka, likier kawowy (Kahlúa), świeże espresso – shake\'owane z lodem', 'Amaretto z espresso i syropem cukrowym'],
      },
      // Wino
      {
        text: 'Z jakiego szczepu winogron produkuje się Pinot Grigio?',
        answer: 'Pinot Gris (Pinot Grigio to włoska nazwa tego samego szczepu)',
        options: ['Chardonnay', 'Sauvignon Blanc', 'Pinot Gris (Pinot Grigio to włoska nazwa tego samego szczepu)', 'Riesling'],
      },
      {
        text: 'Co oznacza termin "terroir" w winiarstwie?',
        answer: 'Całość wpływu środowiska (gleba, klimat, ukształtowanie terenu) na charakter wina',
        options: ['Technika fermentacji w beczkach dębowych', 'Rocznik wina oznaczający jakość', 'Całość wpływu środowiska (gleba, klimat, ukształtowanie terenu) na charakter wina', 'Specjalny certyfikat jakości dla win francuskich'],
      },
      {
        text: 'Które wino zawiera więcej resweratrolu: czerwone czy białe?',
        answer: 'Czerwone – resweratrol pochodzi ze skórek winogron, które fermentują razem z sokiem w winach czerwonych',
        options: ['Białe – ma lepszy skład antyoksydantów', 'Oba zawierają identyczną ilość', 'Czerwone – resweratrol pochodzi ze skórek winogron, które fermentują razem z sokiem w winach czerwonych', 'Różowe – jest pośrednie między nimi'],
      },
      {
        text: 'Co to jest "Prosecco DOC"?',
        answer: 'Włoskie wino musujące z regionu Veneto i Friuli, chronione oznaczeniem pochodzenia (DOC)',
        options: ['Najdroższe wino musujące świata', 'Hiszpańska cava z apelacji DOC', 'Włoskie wino musujące z regionu Veneto i Friuli, chronione oznaczeniem pochodzenia (DOC)', 'Mieszanka szampana i wody mineralnej'],
      },
      {
        text: 'Jak nazywa się metoda produkcji szampana polegająca na fermentacji w butelce?',
        answer: 'Méthode champenoise (metoda tradycyjna)',
        options: ['Metoda Charmat (tank method)', 'Metoda carbonation', 'Méthode champenoise (metoda tradycyjna)', 'Méthode ancestrale'],
      },
      {
        text: 'Co oznacza "Brut" na etykiecie szampana?',
        answer: 'Wytrawny – zawartość cukru poniżej 12 g/l',
        options: ['Ekstra słodki', 'Rocznikowy szampan wysokiej jakości', 'Wytrawny – zawartość cukru poniżej 12 g/l', 'Produkowany wyłącznie z Chardonnay'],
      },
      {
        text: 'Który region Francji produkuje wina Bordeaux?',
        answer: 'Akwitania (Gironde) – na południowym zachodzie Francji',
        options: ['Burgundia', 'Alzacja', 'Akwitania (Gironde) – na południowym zachodzie Francji', 'Langwedocja'],
      },
      {
        text: 'Z jakiego szczepu winogron pochodzi Chianti?',
        answer: 'Sangiovese – minimum 70% w Chianti Classico',
        options: ['Barbera', 'Nebbiolo', 'Sangiovese – minimum 70% w Chianti Classico', 'Montepulciano'],
      },
      {
        text: 'Co to jest wino Rosé?',
        answer: 'Wino różowe produkowane przez krótki kontakt soku z czerwonymi skórkami lub macerację',
        options: ['Mieszanka czerwonego i białego wina (zawsze)', 'Wino różowe produkowane przez krótki kontakt soku z czerwonymi skórkami lub macerację', 'Wino produkowane z różowych odmian winogron', 'Słodkie wino deserowe ze słonecznych rejonów'],
      },
      {
        text: 'Ile butelek wina mieści standardowa beczka bordelaise (barrique)?',
        answer: 'Około 300 butelek (225 litrów)',
        options: ['Około 50 butelek', 'Około 150 butelek', 'Około 300 butelek (225 litrów)', 'Ponad 600 butelek'],
      },
      {
        text: 'Co to jest "decanting" wina?',
        answer: 'Przelewanie wina do karafi w celu dotlenienia i oddzielenia osadu',
        options: ['Schładzanie wina w lodzie', 'Mieszanie różnych roczników wina', 'Przelewanie wina do karafi w celu dotlenienia i oddzielenia osadu', 'Filtrowanie wina przez specjalną membranę'],
      },
      {
        text: 'Który szczep winogron jest bazą wina Sancerre?',
        answer: 'Sauvignon Blanc',
        options: ['Chardonnay', 'Sauvignon Blanc', 'Chenin Blanc', 'Viognier'],
      },
      {
        text: 'Co to jest wino "Orange wine"?',
        answer: 'Białe wino fermentowane ze skórkami, dające pomarańczowy kolor i taniny – styl z Gruzji i Włoch',
        options: ['Wino z pomarańczy – nie z winogron', 'Białe wino z dodatkiem soku pomarańczowego', 'Białe wino fermentowane ze skórkami, dające pomarańczowy kolor i taniny – styl z Gruzji i Włoch', 'Wino o smaku cytrusowym z Hiszpanii'],
      },
      {
        text: 'Jak długo może leżakować Château Pétrus w piwnicy?',
        answer: 'Nawet 50+ lat – jest to jedno z najdłużej leżakujących win świata',
        options: ['Maksymalnie 5 lat', 'Około 10–15 lat', 'Nawet 50+ lat – jest to jedno z najdłużej leżakujących win świata', 'Wszystkie wina tracą jakość po 20 latach'],
      },
      {
        text: 'Co to jest wino "naturalne" (natural wine)?',
        answer: 'Wino z ekologicznych winogron, fermentowane dzikimi drożdżami, bez lub z minimalnym użyciem siarki i dodatków',
        options: ['Wino bez etykiety "E-numerów"', 'Wino produkowane wyłącznie we Francji', 'Wino z ekologicznych winogron, fermentowane dzikimi drożdżami, bez lub z minimalnym użyciem siarki i dodatków', 'Wino nieprzeterminowane – spożywane świeże'],
      },
      // Piwo
      {
        text: 'Czym różni się ale od lagera?',
        answer: 'Ale fermentuje górnie (ciepłe drożdże), lager dolnie (zimne drożdże) – stąd różny smak i aromat',
        options: ['Ale zawsze ma więcej alkoholu', 'Lager jest ciemniejszy i mocniejszy', 'Ale fermentuje górnie (ciepłe drożdże), lager dolnie (zimne drożdże) – stąd różny smak i aromat', 'Ale produkuje się z pszenicy, lager z żyta'],
      },
      {
        text: 'Co to jest IPA?',
        answer: 'India Pale Ale – mocno chmielone piwo ze Wielkiej Brytanii, początkowo warzone do transportu do Indii',
        options: ['Irish Pale Ale – piwo z Dublina', 'India Pale Ale – mocno chmielone piwo ze Wielkiej Brytanii, początkowo warzone do transportu do Indii', 'Italian Premium Ale – włoski styl', 'Imperial Pale Ale – piwo o mocy powyżej 10%'],
      },
      {
        text: 'Który kraj wypija najwięcej piwa per capita?',
        answer: 'Czechy – ok. 130–140 litrów rocznie na osobę',
        options: ['Niemcy', 'Irlandia', 'Czechy – ok. 130–140 litrów rocznie na osobę', 'Australia'],
      },
      {
        text: 'Co to jest Reinheitsgebot?',
        answer: 'Bawarskie prawo czystości piwa z 1516 r.: tylko woda, słód i chmiel (drożdże dodano później)',
        options: ['Austriacki podatek na alkohol z XVIII w.', 'Bawarskie prawo czystości piwa z 1516 r.: tylko woda, słód i chmiel (drożdże dodano później)', 'Certyfikat jakości Unii Europejskiej dla piwa', 'Regulamin spożywania alkoholu w Niemczech'],
      },
      {
        text: 'Ile kalorii ma standardowe piwo (500 ml, 5%)?',
        answer: 'Około 200–220 kcal',
        options: ['Około 50 kcal', 'Około 100 kcal', 'Około 200–220 kcal', 'Ponad 500 kcal'],
      },
      {
        text: 'Co to jest Stout?',
        answer: 'Ciemne piwo górnej fermentacji o wyraźnym smaku palonego słodu; Guinness to jego ikoniczny przykład',
        options: ['Pszeniczne piwo z Niemiec', 'Czeskie piwo lagerowe', 'Ciemne piwo górnej fermentacji o wyraźnym smaku palonego słodu; Guinness to jego ikoniczny przykład', 'Słodkie piwo deserowe z Belgii'],
      },
      {
        text: 'Skąd pochodzi piwo Leffe?',
        answer: 'Belgia – warzone przez trapaskich mnichów od XIII w.',
        options: ['Holandia', 'Niemcy', 'Belgia – warzone przez trapaskich mnichów od XIII w.', 'Francja'],
      },
      {
        text: 'Co to jest "craft beer" (piwo rzemieślnicze)?',
        answer: 'Piwo produkowane przez małe, niezależne browary z naciskiem na jakość składników i unikatowe receptury',
        options: ['Piwo bez dodatku drożdży przemysłowych', 'Piwo wyłącznie z organicznych składników', 'Piwo produkowane przez małe, niezależne browary z naciskiem na jakość składników i unikatowe receptury', 'Piwo dojrzewające w beczkach whisky'],
      },
      {
        text: 'Ile procent alkoholu ma tradycyjne Weizenbier (piwo pszeniczne)?',
        answer: 'Zazwyczaj 4,7–5,4%',
        options: ['Poniżej 2%', 'Około 3%', 'Zazwyczaj 4,7–5,4%', 'Powyżej 8%'],
      },
      {
        text: 'Co to jest piwo bezalkoholowe "0,0%"?',
        answer: 'Piwo z zawartością alkoholu poniżej 0,05% – uzyskane przez dealcoholizację lub fermentację bez alkoholu',
        options: ['Piwo z soku owocowego bez fermentacji', 'Piwo z zawartością alkoholu poniżej 0,05% – uzyskane przez dealcoholizację lub fermentację bez alkoholu', 'Zwykłe piwo rozcieńczone wodą', 'Piwo z drożdżami niezawierającymi alkoholu'],
      },
      // Wódka
      {
        text: 'Z czego najczęściej produkuje się polską wódkę?',
        answer: 'Żyto lub pszenica – rzadziej ziemniaki (mit o ziemniaczanej wódce jest przesadzony)',
        options: ['Wyłącznie z ziemniaków', 'Z buraków cukrowych', 'Żyto lub pszenica – rzadziej ziemniaki (mit o ziemniaczanej wódce jest przesadzony)', 'Z kukurydzy i sorgo'],
      },
      {
        text: 'Który kraj był pierwszym producentem wódki historycznie?',
        answer: 'Polska lub Rosja – spór trwa; najstarsze polskie zapisy o "wódce" pochodzą z XIV w.',
        options: ['Szwecja', 'Finlandia', 'Polska lub Rosja – spór trwa; najstarsze polskie zapisy o "wódce" pochodzą z XIV w.', 'Ukraina'],
      },
      {
        text: 'Co to jest wódka Żubrówka?',
        answer: 'Polska wódka aromatyzowana trawą żubrową (Hierochloe odorata) z Białowieży',
        options: ['Litewska wódka z żubrem na etykiecie', 'Polska wódka aromatyzowana trawą żubrową (Hierochloe odorata) z Białowieży', 'Białoruska wódka z esencją dębową', 'Rosyjska wódka z kłączem tataraku'],
      },
      {
        text: 'Ile razy standardowo destyluje się wódkę premium?',
        answer: 'Minimum 3 razy – wiele marek premium chwali się 5–6 destylacjami',
        options: ['Jeden raz – to wystarczy do czystości', 'Minimum 3 razy – wiele marek premium chwali się 5–6 destylacjami', 'Dokładnie 10 razy', 'Im więcej, tym gorzej – jakość spada'],
      },
      {
        text: 'Czym jest filtrowanie wódki przez węgiel aktywny?',
        answer: 'Procesem usuwania zanieczyszczeń i kongener, który sprawia że wódka jest "czystsza" i łagodniejsza',
        options: ['Dodawaniem smaku wędzenia do wódki', 'Procesem usuwania zanieczyszczeń i kongener, który sprawia że wódka jest "czystsza" i łagodniejsza', 'Chłodzeniem wódki do temperatury -18°C', 'Metodą dodawania minerałów dla lepszego smaku'],
      },
      {
        text: 'Jaka jest idealna temperatura podawania wódki?',
        answer: '-18 do -10°C – mocno schłodzona, co łagodzi smak i zmniejsza odczuwanie alkoholu',
        options: ['W temperaturze pokojowej 20°C', 'Dokładnie 0°C (zamarzania)', '-18 do -10°C – mocno schłodzona, co łagodzi smak i zmniejsza odczuwanie alkoholu', 'Podgrzana do 40°C'],
      },
      // Whisky/Whiskey
      {
        text: 'Czym różni się Scotch Whisky od Irish Whiskey?',
        answer: 'Scotch leżakuje min. 3 lata, Irish min. 3 lata; Scotch jest zazwyczaj torfowy i produkowany w Szkocji, Irish jest potrójnie destylowany i łagodniejszy',
        options: ['Scotch zawsze jest z jednego słodu, Irish z mieszanki', 'Scotch pisze się bez "e", Irish z "e" – i to jedyna różnica', 'Scotch leżakuje min. 3 lata, Irish min. 3 lata; Scotch jest zazwyczaj torfowy i produkowany w Szkocji, Irish jest potrójnie destylowany i łagodniejszy', 'Irish jest dymny, Scotch słodki'],
      },
      {
        text: 'Co to jest Bourbon?',
        answer: 'Amerykańska whiskey produkowana z min. 51% kukurydzy, dojrzewająca w nowych wypalonych beczkach dębowych',
        options: ['Kanadyjska whisky z żyta', 'Tennessee whiskey ze szczepu kukurydzy', 'Amerykańska whiskey produkowana z min. 51% kukurydzy, dojrzewająca w nowych wypalonych beczkach dębowych', 'Japońska whisky w stylu szkockim'],
      },
      {
        text: 'Który region Szkocji słynie z najmocniej torfowych whisky?',
        answer: 'Islay – whisky takie jak Laphroaig, Ardbeg, Lagavulin',
        options: ['Speyside – tu jest Glenfiddich i Macallan', 'Highlands – największy region', 'Islay – whisky takie jak Laphroaig, Ardbeg, Lagavulin', 'Lowlands – najbardziej delikatne whisky'],
      },
      {
        text: 'Co oznacza "single malt"?',
        answer: 'Whisky z jednego browaru (distillery) z użyciem wyłącznie słodowanego jęczmienia',
        options: ['Whisky produkowana z jednego szczepu winogron', 'Whisky destylowana jednorazowo', 'Whisky z jednego browaru (distillery) z użyciem wyłącznie słodowanego jęczmienia', 'Whisky z jednej beczki (single cask)'],
      },
      {
        text: 'Jak długo leżakuje 12-letnia Scotch whisky?',
        answer: 'Minimum 12 lat w beczkach w Szkocji – liczba na etykiecie to wiek najmłodszego składnika blend\'u',
        options: ['Dokładnie 12 lat do dnia', 'Co najmniej 12 lat od zamknięcia butelki', 'Minimum 12 lat w beczkach w Szkocji – liczba na etykiecie to wiek najmłodszego składnika blend\'u', 'Między 10 a 12 latami'],
      },
      {
        text: 'Co to jest "Angels\' Share"?',
        answer: 'Alkohol parujący z beczki podczas leżakowania whisky – ok. 2% rocznie',
        options: ['Nagroda dla najlepszego destylatora', 'Alkohol parujący z beczki podczas leżakowania whisky – ok. 2% rocznie', 'Pierwsza porcja destylatu wylewana ze względów bezpieczeństwa', 'Specjalna edycja limitowana z okazji Bożego Narodzenia'],
      },
      {
        text: 'Co to jest Japanese Whisky?',
        answer: 'Whisky produkowana w Japonii wzorowana na stylu szkockim; marki Suntory i Nikka są globalnymi liderami',
        options: ['Sake przefermentowane po raz drugi', 'Japońska wódka ryżowa w stylu western', 'Whisky produkowana w Japonii wzorowana na stylu szkockim; marki Suntory i Nikka są globalnymi liderami', 'Import szkockiej whisky butelkowanej w Japonii'],
      },
      // Gin
      {
        text: 'Jaki smak musi dominować w ginie?',
        answer: 'Jałowiec (juniper berry) – to wymóg prawny definicji ginu w UE',
        options: ['Cytrusy', 'Kolendra', 'Jałowiec (juniper berry) – to wymóg prawny definicji ginu w UE', 'Anyż'],
      },
      {
        text: 'Czym różni się London Dry Gin od New Western Gin?',
        answer: 'London Dry ma dominować jałowiec; New Western może akcentować inne botaniki (np. ogórek, róże, herbata)',
        options: ['London Dry jest produkowany tylko w Londynie', 'New Western to gin bez jałowca', 'London Dry ma dominować jałowiec; New Western może akcentować inne botaniki (np. ogórek, róże, herbata)', 'Różnią się wyłącznie ceną – nie składem'],
      },
      {
        text: 'Jaki tonic najlepiej pasuje do premium ginu wg barmanów?',
        answer: 'Tonik wytrawny z minimalną ilością cukru i wysoką gazowością (np. Fever-Tree Indian Tonic)',
        options: ['Tonik z dużą ilością cukru dla zbalansowania goryczki', 'Tonik cytrynowy', 'Tonik wytrawny z minimalną ilością cukru i wysoką gazowością (np. Fever-Tree Indian Tonic)', 'Zwykła woda gazowana'],
      },
      {
        text: 'Który kraj jest globalnym liderem konsumpcji ginu?',
        answer: 'Filipiny – spożywają największą ilość ginu na świecie (głównie lokalna marka Ginebra San Miguel)',
        options: ['Wielka Brytania', 'Hiszpania', 'Filipiny – spożywają największą ilość ginu na świecie (głównie lokalna marka Ginebra San Miguel)', 'USA'],
      },
      {
        text: 'Co to jest Sloe Gin?',
        answer: 'Likier na bazie ginu macerowany z owocami tarniny (sloe berries) – tradycyjny napój brytyjski',
        options: ['Powolnie (slow) destylowany gin', 'Gin z dodatkiem śliwek japońskich', 'Likier na bazie ginu macerowany z owocami tarniny (sloe berries) – tradycyjny napój brytyjski', 'Niskoalkoholowy gin bez destylacji'],
      },
      // Rum i tequila
      {
        text: 'Z czego produkuje się rum?',
        answer: 'Z melasy (produktu ubocznego cukrownictwa) lub soku z trzciny cukrowej',
        options: ['Z ryżu i trzciny cukrowej', 'Z fermentowanych bananów tropikalnych', 'Z melasy (produktu ubocznego cukrownictwa) lub soku z trzciny cukrowej', 'Z destylowanego kakao i cukru'],
      },
      {
        text: 'Czym różni się rum biały od ciemnego?',
        answer: 'Biały nie leżakuje lub krótko (często filtrowany), ciemny dojrzewa latami w beczkach dębowych',
        options: ['Biały jest z trzciny, ciemny z melasy', 'Ciemny ma mniej alkoholu', 'Biały nie leżakuje lub krótko (często filtrowany), ciemny dojrzewa latami w beczkach dębowych', 'Różnią się wyłącznie zabarwieniem barwnikiem'],
      },
      {
        text: 'Z czego produkuje się tequilę?',
        answer: 'Z agawy niebieskiej (Agave tequilana Weber) – uprawianej głównie w Jalisco w Meksyku',
        options: ['Z kaktusa saguaro', 'Z fermentowanego soku z limonki i agawy', 'Z agawy niebieskiej (Agave tequilana Weber) – uprawianej głównie w Jalisco w Meksyku', 'Z fermentowanego kukurydzianego piwa'],
      },
      {
        text: 'Co to jest Mezcal i czym różni się od tequili?',
        answer: 'Mezcal produkowany jest z różnych gatunków agawy (nie tylko niebieskiej), często z pieczonymi sercami agawy – stąd dymny smak',
        options: ['Mezcal to tequila z robakiem w butelce', 'Tequila to rodzaj mezcalu z Jalisco; mezcal pochodzi głównie z Oaxaki', 'Mezcal produkowany jest z różnych gatunków agawy (nie tylko niebieskiej), często z pieczonymi sercami agawy – stąd dymny smak', 'Mezcal i tequila to dokładnie to samo – różnią się tylko etykietą'],
      },
      {
        text: 'Co to jest robak w mezcalu?',
        answer: 'Larwa ćmy (Hypopta agavis) żyjącej na agawie – tradycja marketingowa, nie autentyczna meksykańska praktyka',
        options: ['Symbol jakości chronionej CRTM', 'Larwa ćmy (Hypopta agavis) żyjącej na agawie – tradycja marketingowa, nie autentyczna meksykańska praktyka', 'Specjalny rodzaj drożdży do fermentacji', 'Lokalny termin na kryształy z agawy'],
      },
      // Szampan i wina musujące
      {
        text: 'Który region Francji produkuje szampana?',
        answer: 'Champagne – departamenty Marne, Aube, Aisne i Haute-Marne',
        options: ['Burgundia', 'Alzacja', 'Champagne – departamenty Marne, Aube, Aisne i Haute-Marne', 'Langwedocja-Roussillon'],
      },
      {
        text: 'Ile atmosfer ciśnienia panuje w butelce szampana?',
        answer: 'Około 5–6 atmosfer (bar) – trzy razy więcej niż w oponach samochodowych',
        options: ['Około 1–2 atmosfer', 'Około 3 atmosfer', 'Około 5–6 atmosfer (bar) – trzy razy więcej niż w oponach samochodowych', 'Ponad 10 atmosfer'],
      },
      {
        text: 'Ile bąbelków zawiera butelka szampana?',
        answer: 'Szacunkowo 47–250 milionów bąbelków CO₂',
        options: ['Kilka tysięcy', 'Około 1 milion', 'Szacunkowo 47–250 milionów bąbelków CO₂', 'Ponad miliard'],
      },
      {
        text: 'Co to jest Cava?',
        answer: 'Hiszpańskie wino musujące produkowane metodą tradycyjną głównie w Katalonii (Penedès)',
        options: ['Włoskie wino musujące z Piemontu', 'Hiszpańskie wino musujące produkowane metodą tradycyjną głównie w Katalonii (Penedès)', 'Greckie wino musujące z wyspy Santorini', 'Argentyńska odmiana prosecco'],
      },
      {
        text: 'Jak należy otwierać szampana?',
        answer: 'Powoli obracając butelkę, nie korek – cisza, nie huk; utrata CO₂ i niebezpieczeństwo przy hucznym otwarciu',
        options: ['Mocnym uderzeniem dna butelki w stół', 'Powoli obracając butelkę, nie korek – cisza, nie huk; utrata CO₂ i niebezpieczeństwo przy hucznym otwarciu', 'Specjalnym nożem do sabrage', 'Zawsze w temperaturze pokojowej, nie schłodzonego'],
      },
      // Kac i metabolizm
      {
        text: 'Jaka jest naukowa przyczyna kaca?',
        answer: 'Odwodnienie, produkcja aldehydu octowego (toksycznego metabolitu alkoholu), hipoglikemia i zapalenie',
        options: ['Wyłącznie odwodnienie', 'Tylko cukier zawarty w alkoholu', 'Odwodnienie, produkcja aldehydu octowego (toksycznego metabolitu alkoholu), hipoglikemia i zapalenie', 'Zbyt szybkie picie powodujące zatrucie żołądka'],
      },
      {
        text: 'Ile czasu potrzebuje wątroba na metabolizowanie jednej jednostki alkoholu?',
        answer: 'Około 1 godziny – bez względu na kawę, wodę czy inne mity',
        options: ['15–20 minut', 'Około 1 godziny – bez względu na kawę, wodę czy inne mity', 'Zależy od masy ciała – ok. 30 min na 10 kg', 'Do 6 godzin przy dużych dawkach'],
      },
      {
        text: 'Który mit o kacówkach jest naukowo obalony?',
        answer: 'Kawa nie przyspiesza trzeźwienia – tylko pobudza, ale BAC (stężenie alkoholu) pozostaje bez zmian',
        options: ['Woda nie pomaga przy kacu', 'Jedzenie tłustego przed piciem jest bezskuteczne', 'Kawa nie przyspiesza trzeźwienia – tylko pobudza, ale BAC (stężenie alkoholu) pozostaje bez zmian', 'Wysiłek fizyczny nie pomaga spalić alkoholu'],
      },
      {
        text: 'Czym jest "hair of the dog" (klin klinem)?',
        answer: 'Picie małej ilości alkoholu następnego dnia po kacu; tymczasowo łagodzi objawy, ale tylko opóźnia metabolizm aldehydu octowego',
        options: ['Dieta tłusta następnego dnia po imprezie', 'Picie małej ilości alkoholu następnego dnia po kacu; tymczasowo łagodzi objawy, ale tylko opóźnia metabolizm aldehydu octowego', 'Napój izotoniczny wzbogacony elektrolitami', 'Tradycyjny szkocki lek na kaca z owsianką i whisky'],
      },
      {
        text: 'Co powoduje ból głowy po czerwonym winie?',
        answer: 'Histaminy, taniny i siarczyny w czerwonym winie – nie sam etanol; osoby z niedoborem DAO są bardziej podatne',
        options: ['Wyłącznie siarczyny (E220) dodawane do wina', 'Sam etanol – to nie jest nic specyficznego dla czerwonego', 'Histaminy, taniny i siarczyny w czerwonym winie – nie sam etanol; osoby z niedoborem DAO są bardziej podatne', 'Cukier rezydualny w wytrawnych winach czerwonych'],
      },
      {
        text: 'Ile litrów wody traci człowiek przez działanie moczopędne alkoholu po wypiciu 1 litra piwa?',
        answer: 'Około 800 ml – alkohol hamuje ADH (hormon antydiuretyczny), powodując nadmierne wydalanie moczu',
        options: ['Dokładnie 1 litr (tyle ile wypiłeś)', 'Około 200 ml – efekt jest minimalny', 'Około 800 ml – alkohol hamuje ADH (hormon antydiuretyczny), powodując nadmierne wydalanie moczu', 'Ponad 2 litry – alkohol silnie odwadnia'],
      },
      {
        text: 'Jak jedzenie przed piciem wpływa na wchłanianie alkoholu?',
        answer: 'Tłuste potrawy spowalniają opróżnianie żołądka i opóźniają wchłanianie alkoholu – szczyt BAC jest niższy i późniejszy',
        options: ['Jedzenie całkowicie blokuje wchłanianie alkoholu', 'Jedzenie nie wpływa na BAC – tylko na samopoczucie', 'Tłuste potrawy spowalniają opróżnianie żołądka i opóźniają wchłanianie alkoholu – szczyt BAC jest niższy i późniejszy', 'Weglowodany blokują alkohol, tłuszcze przyspieszają wchłanianie'],
      },
      {
        text: 'Co to jest "blackout" alkoholowy?',
        answer: 'Brak tworzenia nowych wspomnień (amnezja anterogradna) przy wysokim BAC – osoba może być aktywna, ale mózg nie zapisuje zdarzeń',
        options: ['Utrata przytomności spowodowana alkoholem', 'Widzenie czarnych plamek przy hipoglikemii alkoholowej', 'Brak tworzenia nowych wspomnień (amnezja anterogradna) przy wysokim BAC – osoba może być aktywna, ale mózg nie zapisuje zdarzeń', 'Nadwrażliwość na światło podczas kaca'],
      },
      // Alkohol a zdrowie i nauka
      {
        text: 'Czy istnieje bezpieczna dawka alkoholu wg WHO 2023?',
        answer: 'Nie – WHO 2023 potwierdziło, że żadna ilość alkoholu nie jest całkowicie bezpieczna dla zdrowia',
        options: ['Tak – do 1 jednostki dziennie jest bezpieczne', 'Tak – do 14 jednostek tygodniowo', 'Nie – WHO 2023 potwierdziło, że żadna ilość alkoholu nie jest całkowicie bezpieczna dla zdrowia', 'Tak – kieliszek wina dziennie poprawia zdrowie serca'],
      },
      {
        text: 'Ile kalorii dostarcza gram czystego alkoholu?',
        answer: '7 kcal na gram – więcej niż białko i węglowodany (4 kcal), mniej niż tłuszcz (9 kcal)',
        options: ['4 kcal – tyle samo co cukier', '7 kcal na gram – więcej niż białko i węglowodany (4 kcal), mniej niż tłuszcz (9 kcal)', '9 kcal – tyle samo co tłuszcz', '12 kcal – alkohol jest najbardziej kalorycznym makroskładnikiem'],
      },
      {
        text: 'Jak alkohol wpływa na sen?',
        answer: 'Alkohol skraca fazę REM i fragmentuje sen – może ułatwić zasypianie, ale pogarsza jakość i regenerację',
        options: ['Alkohol poprawia jakość snu przez relaksację', 'Alkohol nie wpływa na strukturę snu', 'Alkohol skraca fazę REM i fragmentuje sen – może ułatwić zasypianie, ale pogarsza jakość i regenerację', 'Alkohol wydłuża fazę głębokiego snu NREM'],
      },
      {
        text: 'Ile procent nowotworów na świecie jest powiązanych z alkoholem wg IARC?',
        answer: 'Około 5–6% globalnych przypadków raka – alkohol jest karcynogenem grupy 1 wg IARC',
        options: ['Poniżej 1% – wpływ jest marginalny', 'Około 5–6% globalnych przypadków raka – alkohol jest karcynogenem grupy 1 wg IARC', 'Ponad 20%', 'Tylko rak wątroby jest związany z alkoholem'],
      },
      {
        text: 'Jaki jest efekt alkoholu na układ sercowo-naczyniowy wg aktualnej nauki?',
        answer: 'Nawet umiarkowane spożycie wiąże się z podwyższonym ryzykiem migotania przedsionków i nadciśnienia; mity o "zdrowym winie" zostały w dużej mierze obalone',
        options: ['Kieliszek wina dziennie wyraźnie zmniejsza ryzyko zawału', 'Piwo jest korzystne dla serca w dawce do 2 butelek', 'Nawet umiarkowane spożycie wiąże się z podwyższonym ryzykiem migotania przedsionków i nadciśnienia; mity o "zdrowym winie" zostały w dużej mierze obalone', 'Alkohol jest obojętny dla serca poniżej 14 jednostek tygodniowo'],
      },
      {
        text: 'Co to jest FAS (Fetal Alcohol Syndrome)?',
        answer: 'Zespół alkoholowy płodu – wady rozwojowe, zaburzenia neurologiczne i twarzoczaszkowe spowodowane spożywaniem alkoholu w ciąży',
        options: ['Alergia na alkohol u noworodków', 'Zespół alkoholowy płodu – wady rozwojowe, zaburzenia neurologiczne i twarzoczaszkowe spowodowane spożywaniem alkoholu w ciąży', 'Nadwrażliwość na alkohol wynikająca z genów', 'Choroba wątroby u noworodków matek alkoholiczek'],
      },
      {
        text: 'Jaki enzym metabolizuje alkohol w wątrobie w pierwszym etapie?',
        answer: 'Dehydrogenaza alkoholowa (ADH) – przekształca etanol w aldehyd octowy',
        options: ['Lipaza wątrobowa', 'Cytochrom P450 (tylko w nadmiarze)', 'Dehydrogenaza alkoholowa (ADH) – przekształca etanol w aldehyd octowy', 'Amylaza śluzówkowa'],
      },
      {
        text: 'Dlaczego niektóre osoby (często Azjaci) czerwienią się po alkoholu?',
        answer: 'Wariant genu ALDH2*2 – enzym ALDH2 metabolizuje aldehyd octowy wolniej, powodując jego gromadzenie i rozszerzenie naczyń ("Asian flush")',
        options: ['Niedobór wodny w organizmie', 'Nadwrażliwość układu nerwowego na etanol', 'Wariant genu ALDH2*2 – enzym ALDH2 metabolizuje aldehyd octowy wolniej, powodując jego gromadzenie i rozszerzenie naczyń ("Asian flush")', 'Wysoki poziom histaminy we krwi'],
      },
      // Ciekawostki z imprez i kultury
      {
        text: 'Jaki drink zamówiła Carrie Bradshaw w Sex and the City?',
        answer: 'Cosmopolitan',
        options: ['Martini', 'Mimosa', 'Cosmopolitan', 'Bellini'],
      },
      {
        text: 'Który drink jest symbolem James\'a Bonda?',
        answer: 'Martini – wstrząśnięte, nie mieszane ("shaken, not stirred")',
        options: ['Old Fashioned', 'Whisky z lodem', 'Martini – wstrząśnięte, nie mieszane ("shaken, not stirred")', 'Negroni z cytryną'],
      },
      {
        text: 'W którym roku wynaleziono szampana według popularnej legendy?',
        answer: 'Około 1693 r. – przypisywane mnichowi Dom Pérignonowi, choć faktycznie wino musujące produkowano już wcześniej',
        options: ['Około 1400 r.', 'Około 1693 r. – przypisywane mnichowi Dom Pérignonowi, choć faktycznie wino musujące produkowano już wcześniej', 'W 1789 r. – rok Rewolucji Francuskiej', 'W 1850 r. – wtedy opatentowano butelkę szampana'],
      },
      {
        text: 'Co to jest "prosecco stopper" i do czego służy?',
        answer: 'Korek z mechanizmem uszczelniającym butelkę prosecco/szampana po otwarciu, zachowujący bąbelki do kilku dni',
        options: ['Specjalna nakrętka na butelkę wódki', 'Korek z mechanizmem uszczelniającym butelkę prosecco/szampana po otwarciu, zachowujący bąbelki do kilku dni', 'Filtr do czyszczenia kieliszków', 'Termin na osobę niepijącą alkoholu na imprezie'],
      },
      {
        text: 'Ile jest oficjalnych koktajli IBA (International Bartenders Association)?',
        answer: '77 oficjalnych receptur w trzech kategoriach (New Era, Contemporary, Unforgettables)',
        options: ['12 klasycznych koktajli', '40 koktajli sezonowych', '77 oficjalnych receptur w trzech kategoriach (New Era, Contemporary, Unforgettables)', 'Ponad 200 – nowe są dodawane co roku'],
      },
      {
        text: 'Co to jest "flairowe barmaństwo" (flair bartending)?',
        answer: 'Akrobatyczne manipulowanie butelkami i szkłem podczas przygotowywania drinków – połączenie umiejętności i show',
        options: ['Mieszanie drinków w unikalnych kolorach', 'Akrobatyczne manipulowanie butelkami i szkłem podczas przygotowywania drinków – połączenie umiejętności i show', 'Podawanie alkoholu w niestandardowych naczyniach', 'Serwowanie drinków z płomykiem'],
      },
      {
        text: 'Który kraj spożywa największą ilość alkoholu na osobę rocznie wg WHO?',
        answer: 'Czechy lub Litwa – konsekwentnie w czołówce z ok. 12–14 l czystego alkoholu na osobę rocznie',
        options: ['Rosja', 'Niemcy', 'Czechy lub Litwa – konsekwentnie w czołówce z ok. 12–14 l czystego alkoholu na osobę rocznie', 'Irlandia'],
      },
      {
        text: 'Co to jest "mocktail"?',
        answer: 'Bezalkoholowy koktajl – składniki i techniki jak w koktajlu, ale bez alkoholu',
        options: ['Koktajl z minimalną zawartością alkoholu (poniżej 0,5%)', 'Drink z alkoholem podrobiony jako bezalkoholowy', 'Bezalkoholowy koktajl – składniki i techniki jak w koktajlu, ale bez alkoholu', 'Koktajl z kilkoma alkoholami jednocześnie'],
      },
      {
        text: 'Jak nazywa się technika wlewania alkoholu powoli po odwróconej łyżeczce?',
        answer: 'Layering (warstwowanie) – pozwala tworzyć koktajle wielowarstwowe dzięki różnym ciężarom właściwym cieczy',
        options: ['Muddling – rozcieranie składników', 'Layering (warstwowanie) – pozwala tworzyć koktajle wielowarstwowe dzięki różnym ciężarom właściwym cieczy', 'Carbonation – dodawanie CO₂', 'Infusion – moczenie składników w alkoholu'],
      },
      {
        text: 'Co to jest "muddle" w recepturze koktajlu?',
        answer: 'Rozgniatanie świeżych składników (limonka, mięta, owoce) w szejkerze lub szklance tłuczkiem barowym',
        options: ['Mieszanie alkoholu łyżką barową', 'Rozgniatanie świeżych składników (limonka, mięta, owoce) w szejkerze lub szklance tłuczkiem barowym', 'Filtrowanie koktajlu przez sito', 'Zmrażanie kieliszka przed podaniem'],
      },
      // Szukaszki i reguły picia
      {
        text: 'Co to jest promil (‰) i ile to jest mg alkoholu na 100 ml krwi?',
        answer: '1‰ = 100 mg alkoholu na 100 ml krwi (0,1%); w Polsce limit dla kierowców to 0,2‰',
        options: ['1‰ = 1 mg/100 ml krwi', '1‰ = 10 mg/100 ml krwi', '1‰ = 100 mg alkoholu na 100 ml krwi (0,1%); w Polsce limit dla kierowców to 0,2‰', '1‰ = 1 g alkoholu w 1 litrze krwi – tyle samo ile 1 g/l'],
      },
      {
        text: 'Ile jednostek alkoholu (UK units) zawiera butelka wina (750 ml, 12%)?',
        answer: '9 jednostek (750 ml × 0,12 = 90 ml czystego alkoholu; 1 unit = 10 ml etanolu)',
        options: ['3 jednostki', '6 jednostek', '9 jednostek (750 ml × 0,12 = 90 ml czystego alkoholu; 1 unit = 10 ml etanolu)', '12 jednostek'],
      },
      {
        text: 'Ile czasu potrzebuje osoba 70 kg na wytrzeźwienie po 3 piwach (5%)?',
        answer: 'Około 4–5 godzin – wątroba metabolizuje ok. 0,15‰ na godzinę',
        options: ['Około 1 godziny', 'Około 2 godzin', 'Około 4–5 godzin – wątroba metabolizuje ok. 0,15‰ na godzinę', 'Ponad 10 godzin'],
      },
      {
        text: 'Ile promili alkoholu może być niebezpieczne dla życia?',
        answer: 'Powyżej 3–4‰ grozi śpiączką i depresją ośrodka oddechowego; śmierć zwykle przy 4–5‰+',
        options: ['Już 1‰ jest niebezpieczne', '2‰ to dawka śmiertelna', 'Powyżej 3–4‰ grozi śpiączką i depresją ośrodka oddechowego; śmierć zwykle przy 4–5‰+', 'Alkohol nigdy nie jest śmiertelny sam w sobie'],
      },
      {
        text: 'Jak alkohol wpływa na podejmowanie decyzji seksualnych?',
        answer: 'Hamuje korę przedczołową odpowiedzialną za ocenę ryzyka, co prowadzi do bardziej ryzykownych decyzji (mniej prezerwatyw, więcej partnerów)',
        options: ['Alkohol zwiększa zdolności decyzyjne przez relaks', 'Brak udokumentowanego wpływu na decyzje seksualne', 'Hamuje korę przedczołową odpowiedzialną za ocenę ryzyka, co prowadzi do bardziej ryzykownych decyzji (mniej prezerwatyw, więcej partnerów)', 'Alkohol sprawia, że kobiety są bardziej asertywne seksualnie'],
      },
      // Popularne drinki imprezowe
      {
        text: 'Z czego składa się Jägerbomb?',
        answer: 'Shot Jägermeistera wrzucony do kufla z napojem energetycznym (Red Bull)',
        options: ['Jägermeister z sokiem pomarańczowym', 'Shot Jägermeistera wrzucony do kufla z napojem energetycznym (Red Bull)', 'Jägermeister z piwem pszenicznym', 'Dwa shoty różnych ziołówek w szklance z lodem'],
      },
      {
        text: 'Co to jest "Kamikaze" shot?',
        answer: 'Wódka, triple sec i sok z limonki – podawany jako shot',
        options: ['Tequila, sol i limonka', 'Wódka, triple sec i sok z limonki – podawany jako shot', 'Rum, sok limonkowy i tabasco', 'Gin, tonik i grenadyna w jednym shotu'],
      },
      {
        text: 'Czym jest "Sambuca"?',
        answer: 'Włoski likier anyżkowy; tradycyjnie podawany z trzema ziarenkami kawy i palony przed wypiciem',
        options: ['Hiszpańska brandy cytrusowa', 'Włoski likier anyżkowy; tradycyjnie podawany z trzema ziarenkami kawy i palony przed wypiciem', 'Szwedzka gorzka ziołowa nalewka', 'Grecka ouzo z dodatkiem likieru owocowego'],
      },
      {
        text: 'Skąd pochodzi drink "Harvey Wallbanger"?',
        answer: 'USA lata 70. – wódka, sok pomarańczowy i likier Galliano',
        options: ['Australijski surfer, który uderzył w ścianę baru po przegranym surfingu – a drink to wódka, Galliano i OJ', 'USA lata 70. – wódka, sok pomarańczowy i likier Galliano', 'Hawajski drink z rumu i kokosa', 'Włoski aperitif z Galliano i prosecco'],
      },
      {
        text: 'Co to jest "Paloma"?',
        answer: 'Meksykański drink z tequili, soku grejpfrutowego i wody gazowanej z solą; popularniejszy w Meksyku niż Margarita',
        options: ['Hiszpański drink z wina różowego i limonady', 'Meksykański drink z tequili, soku grejpfrutowego i wody gazowanej z solą; popularniejszy w Meksyku niż Margarita', 'Kubański drink z rumu, grejpfruta i mięty', 'Kolumbijski drink na bazie aguardiente i cytrusów'],
      },
      {
        text: 'Jak się nazywa drink z wódki, soku żurawinowego, limonki i ginger beer?',
        answer: 'Moscow Mule (podawany w miedzianym kubku)',
        options: ['Dark and Stormy', 'Moscow Mule (podawany w miedzianym kubku)', 'Shirley Temple', 'Greyhound'],
      },
      {
        text: 'Co to jest "Gimlet"?',
        answer: 'Gin (lub wódka) z sokiem z limonki i syropem cukrowym – klasyczny drink Royal Navy z XIX w.',
        options: ['Whisky ze słodkim wermut i bitterem', 'Rum, mięta i woda gazowana', 'Gin (lub wódka) z sokiem z limonki i syropem cukrowym – klasyczny drink Royal Navy z XIX w.', 'Gin z Elderflower tonic i ogórkiem'],
      },
      {
        text: 'Co to jest "Aperitivo hour"?',
        answer: 'Włoska tradycja popołudniowego drinka przed kolacją (ok. 18–20), często z przekąskami – odpowiednik happy hour',
        options: ['Poranny drink podany z kawą', 'Włoska tradycja popołudniowego drinka przed kolacją (ok. 18–20), często z przekąskami – odpowiednik happy hour', 'Zamknięte imprezy dla znajomych w domach', 'Nocna degustacja win w restauracji'],
      },
      // Drinki specjalne dla wieczoru panieńskiego
      {
        text: 'Jaki kolor ma grenadyna i z czego jest zrobiona?',
        answer: 'Czerwony – tradycyjnie z granatu (pomegranate), dziś często z innych czerwonych owoców i syropu',
        options: ['Pomarańczowy – z pomarańczy i cukru', 'Czerwony – tradycyjnie z granatu (pomegranate), dziś często z innych czerwonych owoców i syropu', 'Różowy – wyłącznie z malin', 'Fioletowy – z jagód i borówek'],
      },
      {
        text: 'Co to jest "Strawberry Daiquiri"?',
        answer: 'Blendowany drink z białego rumu, świeżych truskawek, soku z limonki i cukru – podawany zamrożony',
        options: ['Truskawkowe prosecco z grenadyną', 'Blendowany drink z białego rumu, świeżych truskawek, soku z limonki i cukru – podawany zamrożony', 'Drink z wódki truskawkowej i tonikiem', 'Likier truskawkowy z lemoniadą'],
      },
      {
        text: 'Jak się nazywa drink z wódki i soku żurawinowego?',
        answer: 'Cape Codder (lub Vodka Cranberry)',
        options: ['Screwdriver', 'Cape Codder (lub Vodka Cranberry)', 'Greyhound', 'Sea Breeze'],
      },
      {
        text: 'Co to jest Lychee Martini?',
        answer: 'Wódka, likier lichi (np. Soho) i sok z lichi – popularny drink azjatycki o słodko-kwiatowym smaku',
        options: ['Gin z cytrusami i słodkim wermut', 'Wódka, likier lichi (np. Soho) i sok z lichi – popularny drink azjatycki o słodko-kwiatowym smaku', 'Szampan z musem egzotycznych owoców', 'Rum z mlekiem kokosowym i lichi'],
      },
      {
        text: 'Jaki drink podaje się w ananas wydrążony jako naczynie?',
        answer: 'Piña Colada – tradycyjne podanie w Puerto Rico i na Karaibach',
        options: ['Tequila Sunrise', 'Piña Colada – tradycyjne podanie w Puerto Rico i na Karaibach', 'Rum Punch', 'Blue Lagoon'],
      },
      {
        text: 'Co to jest "Blue Lagoon"?',
        answer: 'Wódka, blue curaçao i lemoniada – intensywnie niebieski drink o smaku cytrusowym',
        options: ['Gin z tonikiem i niebieskim syropem', 'Wódka, blue curaçao i lemoniada – intensywnie niebieski drink o smaku cytrusowym', 'Rum z sokiem ananasowym i barwnikiem', 'Szampan z syropem borówkowym'],
      },
      // Historia i ciekawostki
      {
        text: 'Kiedy w USA zakończono prohibicję?',
        answer: '1933 r. – 21. poprawka do Konstytucji zniosła 18. poprawkę (prohibicję z 1920 r.)',
        options: ['1920 r.', '1929 r. – po krachu giełdowym', '1933 r. – 21. poprawka do Konstytucji zniosła 18. poprawkę (prohibicję z 1920 r.)', '1945 r. – po II wojnie światowej'],
      },
      {
        text: 'Który kraj jako pierwszy na świecie zalegalizował sprzedaż alkoholu po weekendach?',
        answer: 'Finlandia zniosła swoje ograniczenia sprzedaży w soboty w 1969 r.',
        options: ['Szwecja', 'Finlandia zniosła swoje ograniczenia sprzedaży w soboty w 1969 r.', 'Norwegia', 'Polska'],
      },
      {
        text: 'Co to jest "Bacchanalian" i skąd pochodzi to słowo?',
        answer: 'Uczta z winem i alkoholem wywodząca się z kultu Bachusa (Dionizosa) – boga wina w mitologii rzymskiej/greckiej',
        options: ['Starożytna egipska recepta na piwo', 'Uczta z winem i alkoholem wywodząca się z kultu Bachusa (Dionizosa) – boga wina w mitologii rzymskiej/greckiej', 'Religijny zakaz spożycia alkoholu', 'Włoska impreza plenerowa z winem'],
      },
      {
        text: 'Które piwo jest uważane za najstarszy udokumentowany przepis na alkohol?',
        answer: 'Sumeryjski "Hymn do Ninkasi" (ok. 1800 p.n.e.) zawiera przepis na piwo ze słodowanego ziarna',
        options: ['Egipskie piwo z papirusu Ebera (ok. 1500 p.n.e.)', 'Sumeryjski "Hymn do Ninkasi" (ok. 1800 p.n.e.) zawiera przepis na piwo ze słodowanego ziarna', 'Chińskie wino ryżowe z Jiahu (ok. 7000 p.n.e.) – to jednak inny napój', 'Mezopotamskie wino winogronowe (ok. 4000 p.n.e.)'],
      },
      {
        text: 'Co to jest Absynt i dlaczego był zakazany?',
        answer: 'Likier ziołowy z piołunem (thujon), zakazany w wielu krajach 1905–1915 przez mit o halucynogenności; dziś dozwolony z limitowaną zawartością thujonu',
        options: ['Chemiczny alkohol przemysłowy używany w latach 20.', 'Likier ziołowy z piołunem (thujon), zakazany w wielu krajach 1905–1915 przez mit o halucynogenności; dziś dozwolony z limitowaną zawartością thujonu', 'Trunek z ekstraktem opium, zakazany przez ONZ', 'Wzmocnione wino z kokainą jak "Vin Mariani"'],
      },
      {
        text: 'Jaka jest zawartość alkoholu w polskiej Spirytusie Rektyfikowanym?',
        answer: '95–96% – to jeden z najsilniejszych dostępnych w handlu alkoholi',
        options: ['75%', '80%', '95–96% – to jeden z najsilniejszych dostępnych w handlu alkoholi', '99,9% – czysty etanol'],
      },
      {
        text: 'Co to jest "sipping whisky"?',
        answer: 'Whisky przeznaczona do powolnego delektowania się w czystej postaci lub z jedną kostką lodu – bez mieszania z colą',
        options: ['Whisky o mocy powyżej 60%', 'Specjalny szczep słodowanego ziarna', 'Whisky przeznaczona do powolnego delektowania się w czystej postaci lub z jedną kostką lodu – bez mieszania z colą', 'Whisky podawana przez słomkę bambusową'],
      },
      {
        text: 'Jaka jest różnica między brandy a koniakiem?',
        answer: 'Koniak to brandy produkowana wyłącznie w regionie Cognac (Francja) z określonych szczepów winogron – każdy koniak jest brandy, ale nie każda brandy to koniak',
        options: ['Brandy jest z winogron, koniak z jabłek', 'Koniak leżakuje w dębie, brandy w stali', 'Koniak to brandy produkowana wyłącznie w regionie Cognac (Francja) z określonych szczepów winogron – każdy koniak jest brandy, ale nie każda brandy to koniak', 'Brandy i koniak to to samo – różnią się tylko ceną'],
      },
      {
        text: 'Co to jest Armagnac?',
        answer: 'Francuska brandy z regionu Gaskonia – starsza niż koniak, destylowana tylko raz, bardziej rustykalna',
        options: ['Belgijska czekoladowa nalewka', 'Włoska brandy z Piemontu', 'Francuska brandy z regionu Gaskonia – starsza niż koniak, destylowana tylko raz, bardziej rustykalna', 'Hiszpańskie brandy z winnic przy Kordobie'],
      },
      {
        text: 'Czym jest Calvados?',
        answer: 'Normandzka brandy jabłkowa (lub gruszkowa) – leżakuje w beczkach dębowych; nazwa pochodzi od departamentu Calvados',
        options: ['Belgijski likier śliwkowy', 'Normandzka brandy jabłkowa (lub gruszkowa) – leżakuje w beczkach dębowych; nazwa pochodzi od departamentu Calvados', 'Bretoński cydr niedeystylowany', 'Alzacki owocowy schnapps'],
      },
      {
        text: 'Co to jest Grappa?',
        answer: 'Włoski destylat z wytłoków winogronowych (skórki, pestki, ogonki) po tłoczeniu wina – typowo mocna i aromatyczna',
        options: ['Włoski likier cytrusowy z Sycylii', 'Włoski destylat z wytłoków winogronowych (skórki, pestki, ogonki) po tłoczeniu wina – typowo mocna i aromatyczna', 'Piemoncki likier z orzechów laskowych', 'Dolnowłoska wódka ryżowa'],
      },
      {
        text: 'Co to jest Ouzo?',
        answer: 'Grecki likier anyżkowy; mętnieje po dodaniu wody (efekt "louche") – chlorofil anyżu wytrąca się',
        options: ['Turecka rakı z figami', 'Grecki likier anyżkowy; mętnieje po dodaniu wody (efekt "louche") – chlorofil anyżu wytrąca się', 'Albański destylat winogronowy', 'Cypryjska nalewka z kopru włoskiego'],
      },
      {
        text: 'Jaka jest różnica między Pastis a Pernod?',
        answer: 'Pastis to gatunek (anyżowy aperitif z lawendą i korzeniami); Pernod to marka – jeden z najpopularniejszych pastisów',
        options: ['Pernod to marka absyntu, pastis jest bez thujonu', 'Pastis jest słodszy, Pernod wytrawny', 'Pastis to gatunek (anyżowy aperitif z lawendą i korzeniami); Pernod to marka – jeden z najpopularniejszych pastisów', 'Są identyczne – różnią się tylko opakowaniem'],
      },
      // Barman i techniki
      {
        text: 'Co to jest "free pouring" u barmana?',
        answer: 'Nalewanie alkoholu bez miarki (jigger) z pamięci – wymaga doświadczenia i precyzji',
        options: ['Podawanie drinków gratis w happy hour', 'Nalewanie alkoholu bez miarki (jigger) z pamięci – wymaga doświadczenia i precyzji', 'Technika nalewania piwa bez pianki', 'Serwowanie alkoholu prosto z beczki'],
      },
      {
        text: 'Co to jest "jigger" w barmańskim slangu?',
        answer: 'Mała miarka dwustronna do precyzyjnego odmierzania alkoholu (zazwyczaj 30 ml i 45 ml)',
        options: ['Rodzaj shakera', 'Małe naczynie do degustacji', 'Mała miarka dwustronna do precyzyjnego odmierzania alkoholu (zazwyczaj 30 ml i 45 ml)', 'Nakrętka do butelek alkoholu'],
      },
      {
        text: 'Jaka jest różnica między "up" a "on the rocks" przy zamawianiu drinka?',
        answer: '"Up" = schłodzony i przecedzony do kieliszka bez lodu; "on the rocks" = podany z lodem w szklance',
        options: ['"Up" to drink podany z kieliszka do góry nogami', '"On the rocks" to drink z solą na krawędzi szklanki', '"Up" = schłodzony i przecedzony do kieliszka bez lodu; "on the rocks" = podany z lodem w szklance', '"Up" to wyższy kieliszek, "rocks" to niższy'],
      },
      {
        text: 'Co to jest "dirty" w kontekście Martini?',
        answer: 'Martini z dodatkiem solanki z oliwek – daje słony, mętny smak',
        options: ['Martini bez lodu i bez wermutu', 'Martini z brudnymi (nierówno zmielonymi) ziołami', 'Martini z dodatkiem solanki z oliwek – daje słony, mętny smak', 'Martini po wstrząśnięciu zamiast mieszania'],
      },
      {
        text: 'Jak schładza się kieliszek do martini przed podaniem?',
        answer: 'Wypełniając lodem i wodą na kilka minut, po czym wylewając przed nalaniem drinka',
        options: ['Wkładając do zamrażarki na co najmniej 24 godziny', 'Wypełniając lodem i wodą na kilka minut, po czym wylewając przed nalaniem drinka', 'Polewając kieliszek zimną wodą pod kranem', 'Schładzanie kieliszka nie jest potrzebne przy zimnym drinku'],
      },
      {
        text: 'Co to jest "amaro"?',
        answer: 'Włoski gorzki likier ziołowy (amaro = gorzki); przykłady: Fernet-Branca, Averna, Montenegro',
        options: ['Słodki włoski deser z mascarpone', 'Włoski gorzki likier ziołowy (amaro = gorzki); przykłady: Fernet-Branca, Averna, Montenegro', 'Argentyński napój fermentowany z ziół', 'Katalońska gorzka nalewka bez alkoholu'],
      },
      {
        text: 'Co to jest Fernet-Branca?',
        answer: 'Włoski amaro z 27 ziołami; popularny w Argentynie jako kac-lek i Mediolan jako digestif',
        options: ['Szwajcarska wódka ziołowa na bazie alpejskich kwiatów', 'Włoski amaro z 27 ziołami; popularny w Argentynie jako kac-lek i Mediolan jako digestif', 'Czeski bitter ze szkoły mniszej', 'Belgijski likier czekoladowo-ziołowy'],
      },
      {
        text: 'Co to jest "Angostura Bitters"?',
        answer: 'Esencja bitterów z goryczki, ziół i kory angostury – używana kroplami do aromatyzowania koktajli (Old Fashioned, Manhattan)',
        options: ['Wenezuelski rum z wyspy Trinidad', 'Esencja bitterów z goryczki, ziół i kory angostury – używana kroplami do aromatyzowania koktajli (Old Fashioned, Manhattan)', 'Argentyński aperitif o smaku anyżowym', 'Bitter produkowany wyłącznie do celów medycznych'],
      },
      // Wino musujące i szampan – szczegóły
      {
        text: 'Co to jest "Riddling" w produkcji szampana?',
        answer: 'Stopniowe obracanie butelek (remuage) w celu przesunięcia drożdżowego osadu do szyjki przed dégorgement',
        options: ['Dodawanie drożdży do butelki przed fermentacją', 'Stopniowe obracanie butelek (remuage) w celu przesunięcia drożdżowego osadu do szyjki przed dégorgement', 'Degustacja szampana po 3 latach leżakowania', 'Etykietowanie butelek szampana'],
      },
      {
        text: 'Co to jest "dégorgement"?',
        answer: 'Usuwanie drożdżowego osadu z szyjki butelki przez jej zamrożenie i wystrzelenie korka z osadem',
        options: ['Dodawanie mieszanki dosage (cukier + wino) po otworzeniu', 'Usuwanie drożdżowego osadu z szyjki butelki przez jej zamrożenie i wystrzelenie korka z osadem', 'Degustacja wina po riddlingu przez sommeliera', 'Korekta kwasowości szampana przed finałowym korkowanie'],
      },
      {
        text: 'Co to jest "dosage" w szampanie?',
        answer: 'Mieszanina cukru i wina dodawana po dégorgement, ustalająca poziom słodkości (Brut, Extra Dry, Demi-Sec itp.)',
        options: ['Ilość CO₂ dodawana do butelki', 'Mieszanina cukru i wina dodawana po dégorgement, ustalająca poziom słodkości (Brut, Extra Dry, Demi-Sec itp.)', 'Zawartość alkoholu mierzona przed butelkowaniem', 'Dawka siarki jako konserwant'],
      },
      {
        text: 'Co oznacza "NV" (Non-Vintage) na butelce szampana?',
        answer: 'Blend roczników (bez podanego roku) zapewniający stały styl domu szampańskiego; większość szampanów to NV',
        options: ['Nisko alkoholowe wino musujące', 'Blend roczników (bez podanego roku) zapewniający stały styl domu szampańskiego; większość szampanów to NV', 'Nowy wariant smaku marki', 'Skrót od "Nowa Vintage" – najnowszy rocznik'],
      },
      // Popularne pytania wiedzy ogólnej
      {
        text: 'Jaki drink jest tradycyjnie podawany na Nowy Rok w Polsce?',
        answer: 'Szampan lub wino musujące – toast o północy to powszechna tradycja',
        options: ['Wódka z ogórkiem kiszonym', 'Miód pitny', 'Szampan lub wino musujące – toast o północy to powszechna tradycja', 'Krupnik – miodówka z korzeniami'],
      },
      {
        text: 'Czym jest Krupnik?',
        answer: 'Polska nalewka/likier na miodzie i korzeniach (cynamon, goździki, kardamon, wanilia) – tradycyjnie podawany gorący',
        options: ['Zupa z kaszy w wydaniu alkoholowym', 'Polska nalewka/likier na miodzie i korzeniach (cynamon, goździki, kardamon, wanilia) – tradycyjnie podawany gorący', 'Litewskie piwo miodowe', 'Rosyjska wódka z miodowym aromatem'],
      },
      {
        text: 'Co to jest Nalewka?',
        answer: 'Polskie tradycyjne destylaty/maceraty owocowe lub ziołowe na spirytusie – domowe nalewki to wielowiekowa tradycja',
        options: ['Rodzaj polskiej wódki klasy premium', 'Polskie tradycyjne destylaty/maceraty owocowe lub ziołowe na spirytusie – domowe nalewki to wielowiekowa tradycja', 'Mieszanina win importowanych pod polską etykietą', 'Zakwas na chleb – nie alkohol'],
      },
      {
        text: 'Czym jest Miód pitny?',
        answer: 'Fermentowany napój miodowy – jeden z najstarszych alkoholi w Polsce; od półtoraka do czwórniaka zależnie od proporcji miodu',
        options: ['Miód z wodą podgrzany do gorącej czekolady', 'Fermentowany napój miodowy – jeden z najstarszych alkoholi w Polsce; od półtoraka do czwórniaka zależnie od proporcji miodu', 'Likier miodowy na bazie spirytusu', 'Napój bezalkoholowy z miodu i jabłek'],
      },
      {
        text: 'Co to jest Goldwasser (Goldwasser Gdańsk)?',
        answer: 'Historyczny gdański likier ziołowy zawierający płatki złota 22-karatowego – produkowany od XVI w.',
        options: ['Polska wódka z Mazur z dominującym smakiem zboża', 'Historyczny gdański likier ziołowy zawierający płatki złota 22-karatowego – produkowany od XVI w.', 'Woda mineralna z Gdańska z domieszką alkoholu', 'Pruski koniak produkowany do 1945 r.'],
      },
      {
        text: 'Ile procent alkoholu ma typowy Baileys Irish Cream?',
        answer: '17%',
        options: ['10%', '17%', '25%', '35%'],
      },
      {
        text: 'Z czego zrobiony jest Kahlúa?',
        answer: 'Rum, cukier trzcinowy, kawa arabika i wanilia – meksykański likier kawowy',
        options: ['Whisky, kawa i syrop klonowy', 'Rum, cukier trzcinowy, kawa arabika i wanilia – meksykański likier kawowy', 'Wódka z ekstraktem kawowca i mlekiem', 'Brazylijska cachaça z kawą i czekoladą'],
      },
      {
        text: 'Co to jest Amaretto?',
        answer: 'Włoski słodki likier migdałowy (lub z pestek moreli); Amaretto Disaronno to najbardziej znana marka',
        options: ['Gorzki włoski aperitif na ziołach alpejskich', 'Włoski słodki likier migdałowy (lub z pestek moreli); Amaretto Disaronno to najbardziej znana marka', 'Destylat wiśniowy z Piemontu', 'Nalewka z migdałów i grappa'],
      },
      {
        text: 'Jak się nazywa drink z Amaretto i soku pomarańczowego?',
        answer: 'Amaretto Sour lub Godfather – Amaretto Sour to z cytryną, Godfather to z whisky/amaretto',
        options: ['Sicilian Sunrise', 'Italian Dream', 'Amaretto Sour lub Godfather – Amaretto Sour to z cytryną, Godfather to z whisky/amaretto', 'Venetian Kiss'],
      },
      {
        text: 'Co to jest Limoncello?',
        answer: 'Włoski likier cytrynowy z południa Włoch (Amalfi, Sorrento, Capri) – macerowane skórki cytryn na spirytusie z cukrem',
        options: ['Sycylijska lemoniada z domieszką alkoholu', 'Włoski likier cytrynowy z południa Włoch (Amalfi, Sorrento, Capri) – macerowane skórki cytryn na spirytusie z cukrem', 'Neapolitańskie wino cytrynowe', 'Likier produkowany tylko przez zakonnice w Kampanii'],
      },
      {
        text: 'Co to jest Chambord?',
        answer: 'Francuski likier z czarnych malin i owoców leśnych; używany w Kir Royale i French Martini',
        options: ['Francuski koniak z regionu Chambord', 'Francuski likier z czarnych malin i owoców leśnych; używany w Kir Royale i French Martini', 'Alzacka nalewka z borówek', 'Likier produkowany w Château Chambord'],
      },
      {
        text: 'Jak się nazywa tradycyjny japoński alkohol ryżowy?',
        answer: 'Sake (日本酒) – fermentowany napój ryżowy; nieco mylnie zwany "winem ryżowym", technicznie bliższy piwu',
        options: ['Soju', 'Umeshu', 'Sake (日本酒) – fermentowany napój ryżowy; nieco mylnie zwany "winem ryżowym", technicznie bliższy piwu', 'Shochu'],
      },
      {
        text: 'Czym różni się Sake od Shochu?',
        answer: 'Sake to fermentowany napój ryżowy (~15%); Shochu to destylowany alkohol z różnych składników (ryż, słodkie ziemniaki, kasza gryczana) – do 45%',
        options: ['Sake jest mocniejsze (40%), Shochu słabsze (5%)', 'Sake to napój z ryżu brązowego, Shochu z białego', 'Sake to fermentowany napój ryżowy (~15%); Shochu to destylowany alkohol z różnych składników (ryż, słodkie ziemniaki, kasza gryczana) – do 45%', 'Shochu pochodzi z Chin, Sake tylko z Japonii'],
      },
      {
        text: 'Co to jest Soju?',
        answer: 'Koreański destylowany alkohol (podobny do wódki, ~20–25%); najlepiej sprzedający się alkohol spirytusowy na świecie',
        options: ['Japońskie sake z dodatkiem limonki', 'Chiński baijiu rozcieńczony do koreańskich norm', 'Koreański destylowany alkohol (podobny do wódki, ~20–25%); najlepiej sprzedający się alkohol spirytusowy na świecie', 'Koreańskie piwo ryżowe z gazowaniem'],
      },
      {
        text: 'Jaki jest najdrożej sprzedany alkohol na świecie?',
        answer: 'Butelka Macallan Fine and Rare 1926 sprzedana za 2,7 mln USD w 2023 r.',
        options: ['Pétrus 1945 za 1 mln USD', 'Butelka Macallan Fine and Rare 1926 sprzedana za 2,7 mln USD w 2023 r.', 'Dom Pérignon Rosé za 500 000 USD', 'Kolekcjonerska Coca-Cola z alkoholem za 3 mln USD'],
      },
      {
        text: 'Ile procent pary wodnej wydziela się podczas destylacji jako "heads" (głowa) do odrzucenia?',
        answer: 'Około 5–10% pierwszych destylatu (heads) zawiera metanol i aldehydy – zawsze odrzucane przez destylatorów',
        options: ['Głowy stanowią ponad 50% destylatu', 'Głowy są zachowywane jako najlepszy alkohol', 'Około 5–10% pierwszych destylatu (heads) zawiera metanol i aldehydy – zawsze odrzucane przez destylatorów', 'Metanol usuwa się przez filtrację, nie przez odrzucenie głowy'],
      },
      {
        text: 'Co to jest "Tails" w destylacji?',
        answer: 'Końcowa frakcja destylatu z wyższymi alkoholami i fuzelami – zazwyczaj odrzucana lub redestylowana',
        options: ['Etykieta na butelce destylatu', 'Końcowa frakcja destylatu z wyższymi alkoholami i fuzelami – zazwyczaj odrzucana lub redestylowana', 'Ostatnie kilka butelek z partii', 'Specjalna wersja alkoholu leżakowana najdłużej'],
      },
      {
        text: 'Które piwo ma najwyższy poziom alkoholu na świecie?',
        answer: 'Snake Venom (Scottish brewery Brewmeister) – ok. 67,5% ABV; produkowane metodą freeze distillation',
        options: ['Carlsberg Special – 20%', 'Sam Adams Utopias – 28%', 'Snake Venom (Scottish brewery Brewmeister) – ok. 67,5% ABV; produkowane metodą freeze distillation', 'Chimay Grande Reserve – 9%'],
      },
      {
        text: 'Czym jest "barrel aging" koktajli?',
        answer: 'Maturacja gotowych koktajli (np. Negroni, Manhattan) w małych beczkach dębowych – dodaje złożoności i zaokrąglenia smaku',
        options: ['Leżakowanie kieliszków w piwnicy przed podaniem', 'Maturacja gotowych koktajli (np. Negroni, Manhattan) w małych beczkach dębowych – dodaje złożoności i zaokrąglenia smaku', 'Dodawanie wiórków dębowych bezpośrednio do shejkera', 'Podawanie drinków w drewnianych kubkach'],
      },
      {
        text: 'Co to jest "bottle service" w klubie?',
        answer: 'Zakup całej butelki alkoholu z rezerwacją stolika VIP – zazwyczaj wielokrotnie droższy niż pojedyncze drinki',
        options: ['Darmowa butelka wody mineralnej przy zamówieniu drinków', 'Zakup całej butelki alkoholu z rezerwacją stolika VIP – zazwyczaj wielokrotnie droższy niż pojedyncze drinki', 'Specjalny serwis dostawy alkoholu do domu', 'Voucher na darmowy drink w urodziny'],
      },
      {
        text: 'Ile promili to granica stanu wskazania (nie upojenia) w Polsce?',
        answer: '0,2–0,5‰ to stan po spożyciu; powyżej 0,5‰ to stan upojenia (różne przepisy karne)',
        options: ['Każde stężenie powyżej 0,1‰', '0,2–0,5‰ to stan po spożyciu; powyżej 0,5‰ to stan upojenia (różne przepisy karne)', '1,0‰ i powyżej to granica wskazania', 'W Polsce nie ma prawnej definicji stanu wskazania'],
      },
      {
        text: 'Jak długo pozostaje alkohol wykrywalny w moczu?',
        answer: 'Etanol do ok. 12 godzin; metabolit EtG (ethyl glucuronide) nawet do 80 godzin po wypiciu',
        options: ['Maksymalnie 2 godziny', 'Dokładnie 24 godziny', 'Etanol do ok. 12 godzin; metabolit EtG (ethyl glucuronide) nawet do 80 godzin po wypiciu', 'Alkohol jest w moczu widoczny przez cały tydzień'],
      },
      // Finałowe uzupełnienie – 24 pytania
      {
        text: 'Co to jest "shrub" w nowoczesnym barmaństwie?',
        answer: 'Syrop octan-owocowy (ocet + owoce + cukier) dodawany do koktajli dla kwasowości i głębi – modny składnik craft barów',
        options: ['Rodzaj garniru z ziół na krawędzi szklanki', 'Syrop octan-owocowy (ocet + owoce + cukier) dodawany do koktajli dla kwasowości i głębi – modny składnik craft barów', 'Napar z owoców bez alkoholu', 'Technika zamrażania cytrusów do koktajli'],
      },
      {
        text: 'Jaki drink tradycyjnie pija się na wieczorze panieńskim w UK?',
        answer: 'Prosecco i Jägerbomby to klasyka; "Woo Woo" (wódka, peach schnapps, żurawina) jest bardzo popularny',
        options: ['Piwo Guinness', 'Prosecco i Jägerbomby to klasyka; "Woo Woo" (wódka, peach schnapps, żurawina) jest bardzo popularny', 'Port z tonikiem', 'Wyłącznie szampan Premier Cru'],
      },
      {
        text: 'Co to jest "Sgroppino"?',
        answer: 'Wenecki drink: sorbet cytrynowy + prosecco + wódka – podawany jako deser lub aperitif',
        options: ['Sycylijska granita z limoncello', 'Wenecki drink: sorbet cytrynowy + prosecco + wódka – podawany jako deser lub aperitif', 'Piemoncki koktajl z Arneis i grapefruitem', 'Toskański drink ze Vin Santo i lodu'],
      },
      {
        text: 'Czym jest "aquavit" (akvavit)?',
        answer: 'Skandynawski destylat zbożowy/ziemniaczany aromatyzowany kminem lub koprem włoskim – tradycyjny napój Szwecji, Norwegii i Danii',
        options: ['Fińska wódka arktyczna', 'Skandynawski destylat zbożowy/ziemniaczany aromatyzowany kminem lub koprem włoskim – tradycyjny napój Szwecji, Norwegii i Danii', 'Islandzki likier z porostów', 'Duński ekstrakt z ryb morskich'],
      },
      {
        text: 'Jaka jest polska norma zawartości alkoholu w wódce?',
        answer: 'Minimum 37,5% ABV – taki wymóg nakłada unijne rozporządzenie dla Spirit Drinks',
        options: ['Dokładnie 40% – mniej to nie wódka', 'Minimum 37,5% ABV – taki wymóg nakłada unijne rozporządzenie dla Spirit Drinks', 'Co najmniej 50% ABV', 'Brak minimalnej normy w Unii Europejskiej'],
      },
      {
        text: 'Co to jest Baijiu?',
        answer: 'Chiński destylowany alkohol ze zboża (sorgo, ryż, kukurydza) – najsprzedawalniejszy mocny alkohol świata, ok. 50–60% ABV',
        options: ['Japońska wódka ryżowa dla kobiet', 'Chiński destylowany alkohol ze zboża (sorgo, ryż, kukurydza) – najsprzedawalniejszy mocny alkohol świata, ok. 50–60% ABV', 'Koreański piwo ryżowe z fusami', 'Wietnamski likier z ryżu i ziół'],
      },
      {
        text: 'Co to jest Pisco?',
        answer: 'Peruwiański/chilijski destylat winogronowy – obie nacje kłócą się o jego ojczyznę; baza Pisco Sour',
        options: ['Meksykański rum z Jukastanu', 'Peruwiański/chilijski destylat winogronowy – obie nacje kłócą się o jego ojczyznę; baza Pisco Sour', 'Kolumbijska cachaça z Karaibów', 'Argentyński likier różany'],
      },
      {
        text: 'Z czego składa się Pisco Sour?',
        answer: 'Pisco, sok z limonki, syrop cukrowy, białko jajka i bitter Angostura – koktajl narodowy Peru',
        options: ['Cachaça, limonka, cukier, soda', 'Pisco, sok z limonki, syrop cukrowy, białko jajka i bitter Angostura – koktajl narodowy Peru', 'Tequila, grejpfrut, sól, białko', 'Rum, cytryna, syrop, piana z mleka'],
      },
      {
        text: 'Jak się nazywa cydr musujący z Normandii?',
        answer: 'Cidre Bouché Brut de Normandie – chronione oznaczenie geograficzne; tradycyjnie podawany w kuflach',
        options: ['Calvados Extra Young', 'Cidre Bouché Brut de Normandie – chronione oznaczenie geograficzne; tradycyjnie podawany w kuflach', 'Pommeau de Normandie', 'Poiré – gruszkowiec z Normandii'],
      },
      {
        text: 'Co to jest Poiré?',
        answer: 'Cydr gruszkowy z Normandii lub Bretanii – lżejszy od jabłkowego, bardzo aromatyczny',
        options: ['Belgijskie piwo pszeniczne z gruszką', 'Cydr gruszkowy z Normandii lub Bretanii – lżejszy od jabłkowego, bardzo aromatyczny', 'Alzacki destylat gruszkowy (eau-de-vie)', 'Szwajcarski likier gruszkowy z kawy'],
      },
      {
        text: 'Ile procent alkoholu ma Campari?',
        answer: '20,5–25% – zależnie od rynku; włoski bitter z 60+ składnikami',
        options: ['5%', '12%', '20,5–25% – zależnie od rynku; włoski bitter z 60+ składnikami', '40%'],
      },
      {
        text: 'Czym zabarwiony był oryginalny Campari?',
        answer: 'Koszenilą (barwnik z owadów Dactylopius coccus) – w 2006 r. zamieniony na syntetyczny barwnik E124',
        options: ['Sokiem z wiśni i buraków', 'Czerwoną papryką i kurkumą', 'Koszenilą (barwnik z owadów Dactylopius coccus) – w 2006 r. zamieniony na syntetyczny barwnik E124', 'Ekstraktem z różowego pieprzu'],
      },
      {
        text: 'Co to jest "Punt e Mes"?',
        answer: 'Włoski wermut czerwony (Carpano) o intensywnej goryczy – nazwa znaczy "punkt i pół" w dialekcie turyńskim',
        options: ['Piemoncki destylat ze skórek cytrusów', 'Włoski wermut czerwony (Carpano) o intensywnej goryczy – nazwa znaczy "punkt i pół" w dialekcie turyńskim', 'Toskański likier szałwiowy', 'Sycylijski amaretto z migdałów i wina'],
      },
      {
        text: 'Jaki drink podaje się w miedzianym kubku i dlaczego?',
        answer: 'Moscow Mule – miedź schładza szybciej i wzmacnia odczucie orzeźwienia przez przewodnictwo cieplne',
        options: ['Negroni – dla zachowania temperatury', 'Mojito – miedź redukuje utlenianie mięty', 'Moscow Mule – miedź schładza szybciej i wzmacnia odczucie orzeźwienia przez przewodnictwo cieplne', 'Dark and Stormy – tradycja z XVIII-wiecznych statków'],
      },
      {
        text: 'Co to jest Tequila Blanco (Silver)?',
        answer: 'Tequila bez leżakowania lub leżakowana do 60 dni – czysta, o wyrazistym smaku agawy',
        options: ['Tequila z dodatkiem srebra koloidalnego', 'Tequila z mniej niż 51% agawy niebieskiej', 'Tequila bez leżakowania lub leżakowana do 60 dni – czysta, o wyrazistym smaku agawy', 'Najdroższa klasa tequili'],
      },
      {
        text: 'Co to jest Tequila Añejo?',
        answer: 'Tequila leżakująca 1–3 lata w beczkach dębowych – bardziej złożona, z nutami wanilii i karmelu',
        options: ['Tequila produkowana przed 1950 r.', 'Tequila z dodatkiem karmelu jako barwnika', 'Tequila leżakująca 1–3 lata w beczkach dębowych – bardziej złożona, z nutami wanilii i karmelu', 'Tequila przefiltrowana przez węgiel aktywny'],
      },
      {
        text: 'Ile kalorii ma standardowy kieliszek (40 ml) wódki 40%?',
        answer: 'Około 96 kcal – alkohol daje 7 kcal/g, więc 40 ml × 0,4 × 0,789 g/ml × 7 kcal',
        options: ['Około 20 kcal', 'Około 50 kcal', 'Około 96 kcal – alkohol daje 7 kcal/g, więc 40 ml × 0,4 × 0,789 g/ml × 7 kcal', 'Około 200 kcal'],
      },
      {
        text: 'Czym jest "ABV" na etykiecie alkoholu?',
        answer: 'Alcohol By Volume – procent objętości czystego etanolu względem całkowitej objętości napoju',
        options: ['Absolute Best Vintage – oznaczenie jakości', 'Alcohol By Volume – procent objętości czystego etanolu względem całkowitej objętości napoju', 'Average Bottle Value – cena rynkowa butelki', 'Ageing Barrel Variety – typ beczki do leżakowania'],
      },
      {
        text: 'Co to jest "Proof" jako miara alkoholu (system USA)?',
        answer: 'Proof w USA = 2 × ABV%, więc 80 proof = 40% ABV; wywodzi się z angielskiego testu prochu z XVII w.',
        options: ['Proof = ABV% / 2', 'Proof w USA = 2 × ABV%, więc 80 proof = 40% ABV; wywodzi się z angielskiego testu prochu z XVII w.', 'Proof = 10 × zawartość w g/l', 'Proof to certyfikat jakości bez związku z alkoholem'],
      },
      {
        text: 'Jaki jest najpopularniejszy alkohol spożywany na polskich weselach?',
        answer: 'Wódka – wg badań GUS i CBOS dominuje na weselach z ok. 80% udziałem',
        options: ['Piwo', 'Wino', 'Wódka – wg badań GUS i CBOS dominuje na weselach z ok. 80% udziałem', 'Nalewki domowe'],
      },
      {
        text: 'Jak alkohol wpływa na koordynację ruchową?',
        answer: 'Hamuje móżdżek i układ przedsionkowy odpowiedzialne za równowagę i koordynację – stąd zataczanie przy 0,5–1,5‰',
        options: ['Poprawia koordynację przez relaks mięśni', 'Wpływa tylko na wzrok, nie na ruch', 'Hamuje móżdżek i układ przedsionkowy odpowiedzialne za równowagę i koordynację – stąd zataczanie przy 0,5–1,5‰', 'Koordynacja spada tylko po przekroczeniu 3‰'],
      },
      {
        text: 'Co to jest "drink spiking" i dlaczego jest przestępstwem?',
        answer: 'Dodawanie alkoholu lub substancji odurzających do drinka bez wiedzy osoby; karalne w Polsce i UE jako przestępstwo przeciw nietykalności cielesnej',
        options: ['Wlewanie mocniejszego alkoholu do słabszego drinka za barmanem', 'Dodawanie alkoholu lub substancji odurzających do drinka bez wiedzy osoby; karalne w Polsce i UE jako przestępstwo przeciw nietykalności cielesnej', 'Serwowanie alkoholu nieletnim w koktajlach', 'Podawanie fałszywego mocnego alkoholu jako wody'],
      },
      {
        text: 'Jaki smak ma Galliano?',
        answer: 'Anyżowo-waniliowy z nutami cytrusów i ziołowymi – włoski likier o wyrazistym, złożonym aromacie',
        options: ['Kawowy z kardamonem i wanilią', 'Anyżowo-waniliowy z nutami cytrusów i ziołowymi – włoski likier o wyrazistym, złożonym aromacie', 'Czekoladowo-miętowy', 'Malinowo-różany z pieprzem'],
      },
      {
        text: 'Co to jest "toast" i skąd pochodzi tradycja wznoszenia toastów?',
        answer: 'Ze starożytnego zwyczaju wkładania opieczonego chleba (toast) do wina – wcześniej do pucharu, by wchłonąć osad; dziś symboliczny gest wzniesienia kieliszka',
        options: ['Z angielskiego słowa "toast" oznaczającego ogień', 'Ze starożytnego zwyczaju wkładania opieczonego chleba (toast) do wina – wcześniej do pucharu, by wchłonąć osad; dziś symboliczny gest wzniesienia kieliszka', 'Z francuskiej tradycji monarchistycznej z XIV w.', 'Z greckiego słowa "toastos" oznaczającego zdrowie'],
      },
    ],
  },
]
