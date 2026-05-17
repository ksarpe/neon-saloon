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
        answer: 'Tkanka erekcyjna po obu stronach wejścia do pochwy – część anatomiczna łechtaczki',
        options: ['Gruczoły Bartholina', 'Tkanka erekcyjna po obu stronach wejścia do pochwy – część anatomiczna łechtaczki', 'Wargi sromowe mniejsze', 'Mięśnie łonowo-guziczne'],
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
        answer: 'Kilkakrotnie więcej – jest to najgęściej unerwiony obszar ciała',
        options: ['Mniej więcej tyle samo', 'Dwa razy więcej', 'Kilkakrotnie więcej – jest to najgęściej unerwiony obszar ciała', 'Palce mają więcej nerwów'],
      },
      {
        text: 'Jak łechtaczka połączona jest anatomicznie z pochwą?',
        answer: 'Poprzez opuszki przedsionkowe otaczające wejście do pochwy',
        options: ['Bezpośrednim kanałem nerwowym', 'Poprzez opuszki przedsionkowe otaczające wejście do pochwy', 'Tkanką łączną pochwy', 'Więzadłem łonowym'],
      },
      {
        text: 'Co to jest frenulum łechtaczki?',
        answer: 'Fałd skóry łączący wargi sromowe mniejsze z żołędzią łechtaczki od dołu',
        options: ['Napletek łechtaczki', 'Wargi sromowe większe', 'Fałd skóry łączący wargi sromowe mniejsze z żołędzią łechtaczki od dołu', 'Ściana przednia pochwy'],
      },
      {
        text: 'W którym roku anatomia łechtaczki zaczęła pojawiać się wyczerpująco w podręcznikach medycznych?',
        answer: 'Dopiero w pierwszej dekadzie lat 2000.',
        options: ['W latach 1950.', 'W latach 1970.', 'Dopiero w pierwszej dekadzie lat 2000.', 'Anatomia była opisana dokładnie już w XIX w.'],
      },
      {
        text: 'Czy rozmiar żołędzi łechtaczki koreluje z intensywnością orgazmu?',
        answer: 'Badania wykazują słabą i niejednoznaczną korelację',
        options: ['Tak – większa = silniejszy orgazm', 'Nie – rozmiar jest bez znaczenia', 'Badania wykazują słabą i niejednoznaczną korelację', 'Mniejsza łechtaczka = silniejszy orgazm'],
      },
      {
        text: 'Czym jest "złota trójkąt" w kontekście łechtaczki (triangle of pleasure)?',
        answer: 'Obszar między łechtaczką, cewką moczową a przednią ścianą pochwy, bogato unerwiony',
        options: ['Trzy punkty G na ścianie pochwy', 'Obszar między łechtaczką, cewką moczową a przednią ścianą pochwy, bogato unerwiony', 'Trójkąt widoczny na USG pochwy', 'Przestrzeń między wargami sromowymi'],
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
        answer: 'Skrzywienie penisa spowodowane bliznowaceniem tkanki (blaszka włóknista)',
        options: ['Stan zapalny napletka', 'Skrzywienie penisa spowodowane bliznowaceniem tkanki (blaszka włóknista)', 'Zbyt mały penis od urodzenia', 'Ból podczas erekcji bez zmian anatomicznych'],
      },
      {
        text: 'Czy penis może doznać "złamania"?',
        answer: 'Tak – pęknięcie osłonki białawej (tunica albuginea) podczas erekcji',
        options: ['Nie – penis nie ma kości ani chrząstki do złamania', 'Tak – pęknięcie osłonki białawej (tunica albuginea) podczas erekcji', 'Tylko u starszych mężczyzn', 'Jedynie przy deformacji Peyroniego'],
      },
      {
        text: 'Co to jest wędzidełko prącia (frenulum)?',
        answer: 'Wrażliwy fałd skóry pod żołędzią, łączący ją z napletkiem',
        options: ['Krawędź żołędzi penisa', 'Więzadło łączące penis z moszną', 'Wrażliwy fałd skóry pod żołędzią, łączący ją z napletkiem', 'Tkanki jamiste penisa'],
      },
      {
        text: 'Jaki procent mężczyzn jest obrzezanych na świecie?',
        answer: 'Około 37–38%',
        options: ['Około 10%', 'Około 20%', 'Około 37–38%', 'Ponad 60%'],
      },
      {
        text: 'Ile zakończeń nerwowych szacunkowo zawiera napletek?',
        answer: 'Szacunkowo około 20 000',
        options: ['Kilkaset', 'Około 2 000', 'Szacunkowo około 20 000', 'Tyle samo co żołądź'],
      },
      {
        text: 'Co to jest stulejka (fimosis)?',
        answer: 'Zbyt ciasny napletek uniemożliwiający odsłonięcie żołędzi',
        options: ['Stan zapalny żołędzi', 'Skrzywienie penisa', 'Zbyt ciasny napletek uniemożliwiający odsłonięcie żołędzi', 'Brak wytrysku'],
      },
      {
        text: 'Jak szybko przebiega wytrysk?',
        answer: 'Około 45 km/h',
        options: ['Około 5 km/h', 'Około 20 km/h', 'Około 45 km/h', 'Ponad 200 km/h'],
      },
      {
        text: 'Jaki procent ssaków posiada kość w penisie (baculum)?',
        answer: 'Około 95% – człowiek jest wyjątkiem i jej nie posiada',
        options: ['Około 10%', 'Około 40%', 'Około 95% – człowiek jest wyjątkiem i jej nie posiada', 'Tylko mięsożerne'],
      },
      {
        text: 'Co powoduje poranną erekcję?',
        answer: 'Fazy snu REM (NPT – nocturnal penile tumescence)',
        options: ['Wysoki poziom testosteronu rano', 'Pełny pęcherz moczowy', 'Fazy snu REM (NPT – nocturnal penile tumescence)', 'Kortyzol poranny'],
      },
      {
        text: 'Co to jest zapalenie żołędzi (balanitis)?',
        answer: 'Stan zapalny żołędzi prącia – często u nieobrzezanych mężczyzn',
        options: ['Ból przy erekcji', 'Stan zapalny żołędzi prącia – często u nieobrzezanych mężczyzn', 'Skrzywienie żołędzi', 'Powiększenie żołędzi'],
      },
      {
        text: 'Jaki procent mężczyzn ma mikropenis (< 7 cm w erekcji)?',
        answer: 'Około 0,6%',
        options: ['Około 0,6%', 'Około 5%', 'Około 15%', 'Ponad 20%'],
      },
      {
        text: 'Które więzadło przymocowuje penis do kości łonowej?',
        answer: 'Więzadło wieszadłowe prącia (suspensory ligament)',
        options: ['Więzadło łonowe', 'Więzadło wieszadłowe prącia (suspensory ligament)', 'Więzadło mosznowe', 'Rozcięgno biodrowe'],
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
        answer: 'Gruczoły wydzielające śluz nawilżający wejście do pochwy podczas pobudzenia',
        options: ['Gruczoły produkujące jaja', 'Gruczoły wydzielające śluz nawilżający wejście do pochwy podczas pobudzenia', 'Gruczoły limfatyczne sromu', 'Gruczoły regulujące pH pochwy'],
      },
      {
        text: 'Czym są gruczoły Skenego?',
        answer: 'Żeński odpowiednik gruczołu krokowego – uczestniczą w squirtingu',
        options: ['Gruczoły macicy produkujące hormony', 'Żeński odpowiednik gruczołu krokowego – uczestniczą w squirtingu', 'Gruczoły produkujące śluz szyjkowy', 'Gruczoły potowe sromu'],
      },
      {
        text: 'Czym jest błona dziewicza (hymen)?',
        answer: 'Cienka błona śluzowa częściowo pokrywająca wejście do pochwy',
        options: ['Kompletna bariera zamykająca pochwę', 'Cienka błona śluzowa częściowo pokrywająca wejście do pochwy', 'Tkanka łączna szyjki macicy', 'Mięsień dna miednicy'],
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
        answer: 'Mimowolne skurcze mięśni pochwy uniemożliwiające lub utrudniające penetrację',
        options: ['Przewlekłe zakażenie grzybicze pochwy', 'Mimowolne skurcze mięśni pochwy uniemożliwiające lub utrudniające penetrację', 'Suchość pochwy po menopauzie', 'Zapalenie szyjki macicy'],
      },
      {
        text: 'Czym są wargi sromowe mniejsze (labia minora)?',
        answer: 'Wewnętrzne fałdy skórne sromu, obficie unerwione',
        options: ['Zewnętrzne, przetłuszczone fałdy sromu', 'Wewnętrzne fałdy skórne sromu, obficie unerwione', 'Część układu limfatycznego sromu', 'Tkanka otaczająca cewkę moczową'],
      },
      {
        text: 'Czym są wargi sromowe większe (labia majora)?',
        answer: 'Zewnętrzne fałdy skóry sromu, zawierające tkankę tłuszczową',
        options: ['Zewnętrzne fałdy skóry sromu, zawierające tkankę tłuszczową', 'Przednią część łechtaczki', 'Mięśnie dna miednicy', 'Część wyściółki pochwy'],
      },
      {
        text: 'Gdzie dokładnie zlokalizowany jest punkt G na ścianie pochwy?',
        answer: '5–8 cm wgłąb, na przedniej ścianie (w kierunku pępka)',
        options: ['Przy wejściu do pochwy, głębokość 1–2 cm', '5–8 cm wgłąb, na przedniej ścianie (w kierunku pępka)', 'Na tylnej ścianie pochwy, głębokość 10 cm', 'Na szyjce macicy'],
      },
      {
        text: 'Co to są marszczenia pochwy (rugae vaginalis)?',
        answer: 'Podłużne fałdy błony śluzowej pochwy umożliwiające rozciąganie',
        options: ['Brodawki śluzówkowe pochwy', 'Podłużne fałdy błony śluzowej pochwy umożliwiające rozciąganie', 'Skupiska gruczołów śluzu', 'Blizny po porodzie'],
      },
      {
        text: 'Skąd pochodzi naturalne nawilżenie pochwy podczas pobudzenia?',
        answer: 'Transudacja – przesiąkanie osocza krwi przez ściany pochwy',
        options: ['Z gruczołów Bartholina (głównie)', 'Z wydzieliny gruczołów macicznych', 'Transudacja – przesiąkanie osocza krwi przez ściany pochwy', 'Ze śliny szyjkowej'],
      },
      {
        text: 'Co to jest gardnereloza / bakteryjna waginoza (BV)?',
        answer: 'Zaburzenie równowagi flory bakteryjnej pochwy – nadmiar bakterii beztlenowych',
        options: ['Zakażenie grzybicze pochwy', 'Wirusowe STI przenoszone kontaktem seksualnym', 'Zaburzenie równowagi flory bakteryjnej pochwy – nadmiar bakterii beztlenowych', 'Pasożytnicze zakażenie pochwy'],
      },
      {
        text: 'Co to jest srom (vulva)?',
        answer: 'Zewnętrzne narządy płciowe kobiety (łechtaczka, wargi, przedsionek, cewka)',
        options: ['Synonim pochwy', 'Zewnętrzne narządy płciowe kobiety (łechtaczka, wargi, przedsionek, cewka)', 'Szyjka macicy i pochwa łącznie', 'Jajniki i jajowody'],
      },
      {
        text: 'Co to jest dyspareunia?',
        answer: 'Bolesne stosunki płciowe u kobiet lub mężczyzn',
        options: ['Brak orgazmu mimo stymulacji', 'Bolesne stosunki płciowe u kobiet lub mężczyzn', 'Nadmierne pobudzenie seksualne', 'Stan zapalny szyjki macicy'],
      },
      {
        text: 'Jaki jest związek między odległością łechtaczka–cewka moczowa a orgazmem pochwowym?',
        answer: 'Mniejsza odległość (<2,5 cm) koreluje z większą szansą na orgazm pochwowy',
        options: ['Brak jakiejkolwiek korelacji', 'Mniejsza odległość (<2,5 cm) koreluje z większą szansą na orgazm pochwowy', 'Większa odległość = łatwiejszy orgazm', 'Odległość wpływa tylko na ból, nie orgazm'],
      },
      {
        text: 'Skąd pochodzi ciecz wydzielana podczas squirtingu?',
        answer: 'Z gruczołów Skenego i częściowo z pęcherza moczowego',
        options: ['Wyłącznie z pochwy', 'Wyłącznie z pęcherza moczowego', 'Z gruczołów Skenego i częściowo z pęcherza moczowego', 'Z szyjki macicy'],
      },
      {
        text: 'Czy pochwa oczyszcza się sama?',
        answer: 'Tak – naturalna wydzielina (discharge) odprowadza martwe komórki i bakterie',
        options: ['Nie – wymaga codziennego irygowania', 'Tak – naturalna wydzielina (discharge) odprowadza martwe komórki i bakterie', 'Tylko po miesiączce', 'Tak, ale tylko przy stosowaniu probiotyków'],
      },
      {
        text: 'Czym jest vulvodynia?',
        answer: 'Przewlekły ból sromu bez wyraźnej przyczyny zakaźnej lub skórnej',
        options: ['Grzybica sromu', 'Przewlekły ból sromu bez wyraźnej przyczyny zakaźnej lub skórnej', 'Stan zapalny gruczołów Bartholina', 'Alergia na lateks'],
      },

      // ── JĄDRA / PROSTATA ─────────────────────────────────────────────────────
      {
        text: 'Dlaczego lewe jądro zwisa zazwyczaj niżej niż prawe?',
        answer: 'Żyła nasienna lewa uchodzi do żyły nerkowej pod kątem prostym – dłuższa droga spływu',
        options: ['Lewe jądro jest cięższe', 'Żyła nasienna lewa uchodzi do żyły nerkowej pod kątem prostym – dłuższa droga spływu', 'Moszna jest asymetrycznie zbudowana', 'To tylko mit – jądra są na tym samym poziomie'],
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
        answer: 'Niezstąpienie jądra do moszny w trakcie rozwoju płodowego',
        options: ['Brak produkcji nasienia', 'Niezstąpienie jądra do moszny w trakcie rozwoju płodowego', 'Stan zapalny jąder', 'Powiększenie jąder powyżej normy'],
      },
      {
        text: 'Co produkuje gruczoł krokowy (prostata)?',
        answer: 'Zasadowy płyn stanowiący ok. 30% objętości nasienia',
        options: ['Testosteron', 'Zasadowy płyn stanowiący ok. 30% objętości nasienia', 'Główną masę plemników', 'Fruktozę odżywiającą plemniki'],
      },
      {
        text: 'Jaki rozmiar porównuje się do prostaty u zdrowego mężczyzny?',
        answer: 'Orzech włoski',
        options: ['Ziarno grochu', 'Orzech włoski', 'Jajko kurze', 'Piłka golfowa'],
      },
      {
        text: 'Co to jest PSA i do czego służy?',
        answer: 'Antygen specyficzny dla gruczołu krokowego – marker stosowany w diagnostyce raka prostaty',
        options: ['Białko w nasieniu odpowiedzialne za ruchliwość', 'Antygen specyficzny dla gruczołu krokowego – marker stosowany w diagnostyce raka prostaty', 'Hormon jąder regulujący spermatogenezę', 'Enzym rozkładający plemniki po zapłodnieniu'],
      },
      {
        text: 'Co produkują pęcherzyki nasienne?',
        answer: 'Płyn zawierający fruktozę stanowiący 60–70% objętości nasienia',
        options: ['Hormony regulujące popęd', 'Płyn zawierający fruktozę stanowiący 60–70% objętości nasienia', 'Antyciała chroniące plemniki', 'Enzymy rozkładające komórkę jajową'],
      },
      {
        text: 'W jakim przedziale wiekowym najczęściej pojawia się rak jąder?',
        answer: '15–35 lat – najczęstszy nowotwór u młodych mężczyzn',
        options: ['0–5 lat (noworodki)', '15–35 lat – najczęstszy nowotwór u młodych mężczyzn', '50–65 lat', 'Powyżej 70. roku życia'],
      },
      {
        text: 'Co to są żylaki powrózka nasiennego (varicocele)?',
        answer: 'Poszerzenie żył żylastych odprowadzających krew z jądra – częsta przyczyna niepłodności',
        options: ['Zapalenie jąder po śwince', 'Torbiel najądrza', 'Poszerzenie żył żylastych odprowadzających krew z jądra – częsta przyczyna niepłodności', 'Nowotwór jąder'],
      },
      {
        text: 'Gdzie dokładnie w ciele znajduje się gruczoł krokowy?',
        answer: 'Pod pęcherzem moczowym, otaczając cewkę moczową',
        options: ['Między jądrami a cewką moczową', 'Wewnątrz moszny, powyżej jąder', 'Pod pęcherzem moczowym, otaczając cewkę moczową', 'Za odbytem, poza miednicą'],
      },
      {
        text: 'Ile procent testosteronu u mężczyzny produkują jądra?',
        answer: 'Około 95% – reszta pochodzi z nadnerczy',
        options: ['Około 50%', 'Około 70%', 'Około 95% – reszta pochodzi z nadnerczy', '100% – nadnercza nie produkują testosteronu'],
      },
      {
        text: 'Ile ważą oba jądra razem?',
        answer: 'Około 30–40 g łącznie',
        options: ['Około 5–10 g', 'Około 15–20 g', 'Około 30–40 g łącznie', 'Ponad 100 g'],
      },
      {
        text: 'Co to jest zapalenie jąder (orchitis) i jaką ma najczęstszą przyczynę u dorosłych?',
        answer: 'Stan zapalny jąder – najczęstsza przyczyna u dorosłych to powikłanie świnki',
        options: ['Alergia na środki higieny', 'Stan zapalny jąder – najczęstsza przyczyna u dorosłych to powikłanie świnki', 'Nieprawidłowa temperatura moszny', 'Niedobór testosteronu'],
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
        answer: 'Ulega szerokiem dezaktywacji – stąd utrata kontroli i "la petite mort"',
        options: ['Aktywuje się maksymalnie', 'Ulega szerokiem dezaktywacji – stąd utrata kontroli i "la petite mort"', 'Nie zmienia aktywności', 'Aktywują się tylko obszary słuchowe'],
      },
      {
        text: 'Co to jest "orgasm gap"?',
        answer: 'Różnica w częstości osiągania orgazmu: mężczyźni ~95% vs kobiety ~65% podczas seksu',
        options: ['Różnica w długości trwania orgazmu między płciami', 'Różnica w częstości osiągania orgazmu: mężczyźni ~95% vs kobiety ~65% podczas seksu', 'Brak orgazmu u jednego z partnerów', 'Różnica w głośności podczas orgazmu'],
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
        answer: 'Tak – próg bólu wzrasta o 74–107% podczas pobudzenia i orgazmu',
        options: ['Nie – nie ma wpływu na ból', 'Tak – próg bólu wzrasta o 74–107% podczas pobudzenia i orgazmu', 'Tylko u kobiet', 'Tak, ale tylko ból głowy'],
      },
      {
        text: 'Co to jest ejaculatory inevitability ("punkt bez powrotu")?',
        answer: 'Moment, po którym mężczyzna nie może zatrzymać wytrysku',
        options: ['Drugi orgazm bez przerwy', 'Moment, po którym mężczyzna nie może zatrzymać wytrysku', 'Ból przy wytrysku', 'Stan po którym następuje refrakcja'],
      },
      {
        text: 'Jakie neurochemikalia są uwalniane podczas orgazmu?',
        answer: 'Dopamina, oksytocyna, endorfiny i serotonina jednocześnie',
        options: ['Wyłącznie adrenalina', 'Kortyzol i testosteron', 'Dopamina, oksytocyna, endorfiny i serotonina jednocześnie', 'Tylko endorfiny'],
      },
      {
        text: 'Czy mężczyźni mogą osiągać wielokrotne orgazmy?',
        answer: 'Tak – przy technikach zatrzymania wytrysku (non-ejaculatory multiple orgasm)',
        options: ['Nie – biologicznie niemożliwe', 'Tak – przy technikach zatrzymania wytrysku (non-ejaculatory multiple orgasm)', 'Tak, ale tylko po 50. roku życia', 'Tylko u mężczyzn z bardzo niskim poziomem prolaktyny'],
      },
      {
        text: 'Jaki hormon uwalniany po orgazmie wywołuje uczucie senności i relaksu?',
        answer: 'Prolaktyna',
        options: ['Kortyzol', 'Adrenalina', 'Prolaktyna', 'Melatonina'],
      },
      {
        text: 'Co to jest post-coital dysphoria (PCD)?',
        answer: 'Uczucie smutku, płaczliwości lub niepokoju po orgazmie – dotyczy ~46% kobiet',
        options: ['Ból fizyczny po stosunku', 'Uczucie smutku, płaczliwości lub niepokoju po orgazmie – dotyczy ~46% kobiet', 'Niemożność osiągnięcia orgazmu', 'Dyskomfort podczas stosunku'],
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
        answer: 'Tak – nocne orgazmy (pollucja u mężczyzn, nocturnal orgasm u kobiet)',
        options: ['Nie – sen uniemożliwia orgazm', 'Tak – nocne orgazmy (pollucja u mężczyzn, nocturnal orgasm u kobiet)', 'Tylko mężczyźni, nie kobiety', 'Tylko przed 25. rokiem życia'],
      },
      {
        text: 'Co to jest orgazm wielokrotny?',
        answer: 'Kilka orgazmów pod rząd bez pełnego powrotu do stanu wyjściowego',
        options: ['Orgazm trwający ponad 5 minut', 'Kilka orgazmów pod rząd bez pełnego powrotu do stanu wyjściowego', 'Orgazm angażujący całe ciało', 'Orgazm z wieloma partnerami jednocześnie'],
      },
      {
        text: 'Co to jest anorgazmia?',
        answer: 'Niemożność osiągnięcia orgazmu mimo wystarczającej stymulacji',
        options: ['Ból przy orgazmie', 'Zbyt szybkie osiąganie orgazmu', 'Niemożność osiągnięcia orgazmu mimo wystarczającej stymulacji', 'Orgazm bez fizycznej przyjemności'],
      },
      {
        text: 'Jaki procent kobiet przyznaje, że symuluje orgazm?',
        answer: 'Ponad 50%',
        options: ['Około 5%', 'Około 20%', 'Około 35%', 'Ponad 50%'],
      },
      {
        text: 'Jak orgazm wpływa na układ odpornościowy?',
        answer: 'Przejściowo podnosi poziom immunoglobuliny A (IgA) i komórek NK',
        options: ['Osłabia odporność przez 24h', 'Nie ma żadnego wpływu', 'Przejściowo podnosi poziom immunoglobuliny A (IgA) i komórek NK', 'Zwiększa białe krwinki przez tydzień'],
      },
      {
        text: 'Jak szybko może wzrosnąć tętno podczas orgazmu?',
        answer: 'Do 150–180 uderzeń na minutę',
        options: ['Do 80 uderzeń na minutę', 'Do 100 uderzeń na minutę', 'Do 150–180 uderzeń na minutę', 'Ponad 250 uderzeń na minutę'],
      },
      {
        text: 'Jaka rola pudendal nerve (nerwu sromowego) w orgazmie?',
        answer: 'Jest głównym nerwem czuciowym i motorycznym narządów płciowych odpowiedzialnym za orgazm',
        options: ['Kontroluje wyłącznie ból', 'Jest głównym nerwem czuciowym i motorycznym narządów płciowych odpowiedzialnym za orgazm', 'Reguluje poziom hormonów', 'Łączy mózg bezpośrednio z jajnikami'],
      },

      // ── HORMONY ─────────────────────────────────────────────────────────────
      {
        text: 'Który hormon w największym stopniu napędza popęd seksualny kobiet?',
        answer: 'Testosteron (produkowany w jajnikach i nadnerczach)',
        options: ['Estrogen', 'Progesteron', 'Testosteron (produkowany w jajnikach i nadnerczach)', 'Oksytocyna'],
      },
      {
        text: 'Kiedy testosteron jest najwyższy u kobiet w trakcie cyklu?',
        answer: 'Około owulacji (środek cyklu, ~dzień 14)',
        options: ['W pierwszym dniu miesiączki', 'Około owulacji (środek cyklu, ~dzień 14)', 'W fazie lutealnej', 'Poziom jest stały przez cały cykl'],
      },
      {
        text: 'Jaką rolę pełni oksytocyna w życiu seksualnym?',
        answer: 'Wzmacnia więź emocjonalną po stosunku – uwalniania przy orgazmie i dotyku',
        options: ['Napędza pożądanie seksualne', 'Reguluje cykl miesiączkowy', 'Wzmacnia więź emocjonalną po stosunku – uwalniania przy orgazmie i dotyku', 'Stymuluje owulację'],
      },
      {
        text: 'Co robi estrogen dla zdrowia pochwy?',
        answer: 'Utrzymuje grubość, elastyczność ścianek i nawilżenie pochwy',
        options: ['Reguluje popęd seksualny', 'Utrzymuje grubość, elastyczność ścianek i nawilżenie pochwy', 'Zwiększa produkcję plemników', 'Hamuje owulację'],
      },
      {
        text: 'Jaka jest rola prolaktyny po orgazmie mężczyzny?',
        answer: 'Wywołuje uczucie znużenia i odpowiada za okres refrakcji',
        options: ['Stymuluje kolejną erekcję', 'Wywołuje uczucie znużenia i odpowiada za okres refrakcji', 'Reguluje poziom testosteronu', 'Wpływa na jakość nasienia'],
      },
      {
        text: 'O ile procent spada testosteron u mężczyzn po 30. roku życia rocznie?',
        answer: 'Około 1% rocznie (stopniowy spadek)',
        options: ['Około 0,1% rocznie', 'Około 1% rocznie (stopniowy spadek)', 'Około 5% rocznie', 'Ponad 10% rocznie'],
      },
      {
        text: 'Jak progesteron wpływa na libido?',
        answer: 'Generalnie je obniża – zwłaszcza w fazie lutealnej i przy stosowaniu antykoncepcji',
        options: ['Znacznie zwiększa libido', 'Generalnie je obniża – zwłaszcza w fazie lutealnej i przy stosowaniu antykoncepcji', 'Nie ma wpływu', 'Zwiększa tylko u kobiet po menopauzie'],
      },
      {
        text: 'Co to jest FSH i jaką pełni funkcję?',
        answer: 'Hormon folikulotropowy – stymuluje produkcję jaj (u kobiet) i plemników (u mężczyzn)',
        options: ['Hormon stresu wydzielany przez nadnercza', 'Hormon folikulotropowy – stymuluje produkcję jaj (u kobiet) i plemników (u mężczyzn)', 'Hormon tarczycy regulujący libido', 'Hormon tylnej części przysadki odpowiedzialny za więź'],
      },
      {
        text: 'Jak przewlekły stres wpływa na libido?',
        answer: 'Kortyzol hamuje podwzgórze i obniża produkcję hormonów płciowych',
        options: ['Zwiększa libido przez adrenalinę', 'Kortyzol hamuje podwzgórze i obniża produkcję hormonów płciowych', 'Nie ma wpływu na hormony płciowe', 'Zwiększa testosteron krótkoterminowo'],
      },
      {
        text: 'Co się dzieje z poziomem estrogenów podczas menopauzy?',
        answer: 'Drastycznie spada, powodując suchość pochwy, uderzenia gorąca i zaburzenia nastroju',
        options: ['Rośnie, by kompensować brak owulacji', 'Pozostaje stały', 'Drastycznie spada, powodując suchość pochwy, uderzenia gorąca i zaburzenia nastroju', 'Najpierw rośnie, potem spada do zera po 5 latach'],
      },
      {
        text: 'Co to jest andropauza?',
        answer: 'Stopniowy, wieloletni spadek testosteronu u mężczyzn po 40–50. roku życia',
        options: ['Nagłe zatrzymanie produkcji testosteronu', 'Hormonalny odpowiednik menopauzy u kobiet – nagły', 'Stopniowy, wieloletni spadek testosteronu u mężczyzn po 40–50. roku życia', 'Brak erekcji po 65. roku życia'],
      },
      {
        text: 'Jak niedoczynność tarczycy wpływa na życie seksualne?',
        answer: 'Obniża libido, może powodować zaburzenia erekcji i suchość pochwy',
        options: ['Nie ma żadnego wpływu', 'Zwiększa libido', 'Obniża libido, może powodować zaburzenia erekcji i suchość pochwy', 'Wpływa tylko na miesiączkę, nie na seks'],
      },
      {
        text: 'Jak trening siłowy wpływa na poziom testosteronu?',
        answer: 'Krótkoterminowo go podnosi – zwłaszcza ćwiczenia wielostawowe (martwy ciąg, przysiady)',
        options: ['Drastycznie obniża po każdym treningu', 'Krótkoterminowo go podnosi – zwłaszcza ćwiczenia wielostawowe (martwy ciąg, przysiady)', 'Nie wpływa na testosteron', 'Podnosi tylko u mężczyzn powyżej 50. roku życia'],
      },
      {
        text: 'Co to są fitoestrogeny?',
        answer: 'Roślinne związki o budowie podobnej do estrogenów – obecne m.in. w soi i siemieniu lnianym',
        options: ['Syntetyczne estrogeny w tabletkach antykoncepcyjnych', 'Roślinne związki o budowie podobnej do estrogenów – obecne m.in. w soi i siemieniu lnianym', 'Estrogeny produkowane przez tarczycę', 'Hormony regulujące popęd u mężczyzn'],
      },
      {
        text: 'Jak alkohol przewlekle wpływa na poziom testosteronu?',
        answer: 'Długotrwałe spożycie obniża poziom testosteronu i jakość nasienia',
        options: ['Podnosi testosteron – dlatego mężczyźni są agresywni po alkoholu', 'Długotrwałe spożycie obniża poziom testosteronu i jakość nasienia', 'Nie ma wpływu na hormony', 'Alkohol działa jak booster testosteronu'],
      },
      {
        text: 'Jaką rolę odgrywa serotonina w życiu seksualnym?',
        answer: 'Generalnie hamuje – SSRI (antydepresanty) często redukują libido i opóźniają orgazm',
        options: ['Napędza pożądanie i erekcję', 'Nie ma związku z seksem', 'Generalnie hamuje – SSRI (antydepresanty) często redukują libido i opóźniają orgazm', 'Zwiększa libido u kobiet, obniża u mężczyzn'],
      },

      // ── NASIENIE / SPERMA ────────────────────────────────────────────────────
      {
        text: 'Ile plemników produkuje zdrowy mężczyzna każdego dnia?',
        answer: 'Około 300 milionów',
        options: ['Około 1 miliona', 'Około 10 milionów', 'Około 300 milionów', 'Ponad 5 miliardów'],
      },
      {
        text: 'Jaki procent nasienia stanowią faktycznie plemniki?',
        answer: 'Zaledwie 2–5%',
        options: ['Ponad 50%', 'Około 25%', 'Około 10%', 'Zaledwie 2–5%'],
      },
      {
        text: 'Co stanowi większość objętości nasienia?',
        answer: 'Płyn z pęcherzyków nasiennych (60–70%) i gruczołu krokowego (~30%)',
        options: ['Wyłącznie plemniki', 'Wydzielina najądrzy', 'Płyn z pęcherzyków nasiennych (60–70%) i gruczołu krokowego (~30%)', 'Woda i enzymy z cewki moczowej'],
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
        answer: 'Chemotaksja i termotaksja – reakcja na substancje chemiczne i temperaturę',
        options: ['Siła grawitacji', 'Magnetyzm biologiczny', 'Chemotaksja i termotaksja – reakcja na substancje chemiczne i temperaturę', 'Prądy elektryczne macicy'],
      },
      {
        text: 'Co to jest azoospermia?',
        answer: 'Całkowity brak plemników w ejakulacie',
        options: ['Zbyt mała objętość ejakulatu', 'Całkowity brak plemników w ejakulacie', 'Zdeformowane plemniki', 'Nieruchliwe plemniki'],
      },
      {
        text: 'Co to jest oligospermia?',
        answer: 'Zbyt niska liczba plemników w nasieniu (< 16 mln/ml wg WHO)',
        options: ['Zbyt niska liczba plemników w nasieniu (< 16 mln/ml wg WHO)', 'Zbyt duża objętość ejakulatu', 'Obecność krwi w nasieniu', 'Brak ruchliwości plemników'],
      },
      {
        text: 'Jaką ruchliwość plemników WHO uważa za normę?',
        answer: 'Ponad 42% plemników z ruchem postępowym',
        options: ['100% (wszystkie muszą być ruchliwe)', 'Ponad 70%', 'Ponad 42% plemników z ruchem postępowym', 'Wystarczy 10%'],
      },
      {
        text: 'Co niszczy jakość nasienia?',
        answer: 'Ciepło, palenie, alkohol, stres i sterydy anaboliczne',
        options: ['Witaminy C i E', 'Ciepło, palenie, alkohol, stres i sterydy anaboliczne', 'Ćwiczenia fizyczne', 'Dieta roślinna'],
      },
      {
        text: 'Jak szybko może płynąć pojedynczy plemnik?',
        answer: 'Około 3 mm/minutę (to odpowiednik 16 km/h w przeliczeniu na ludzką wielkość)',
        options: ['Około 0,01 mm/minutę', 'Około 3 mm/minutę (to odpowiednik 16 km/h w przeliczeniu na ludzką wielkość)', 'Około 30 mm/minutę', 'Ponad 10 cm/minutę'],
      },
      {
        text: 'Co to jest pojemność nasienia (sperm capacitation)?',
        answer: 'Ostateczna aktywacja biochemiczna plemnika w żeńskich drogach rodnych umożliwiająca zapłodnienie',
        options: ['Całkowita liczba plemników w ejakulacie', 'Zdolność nasienia do zapłodnienia komórki jajowej mierzona laboratoryjnie', 'Ostateczna aktywacja biochemiczna plemnika w żeńskich drogach rodnych umożliwiająca zapłodnienie', 'Ilość fruktozy w nasieniu'],
      },
      {
        text: 'Ile plemników z całego ejakulatu dociera do komórki jajowej?',
        answer: 'Zaledwie 10–100 z 200–500 milionów',
        options: ['Kilka milionów', 'Kilkadziesiąt tysięcy', 'Zaledwie 10–100 z 200–500 milionów', 'Połowa ejakulatu'],
      },
      {
        text: 'Co zawiera fruktoza w nasieniu i po co?',
        answer: 'Jest głównym źródłem energii dla poruszających się plemników',
        options: ['Reguluje pH nasienia', 'Jest głównym źródłem energii dla poruszających się plemników', 'Chroni plemniki przed odpornością kobiety', 'Pomaga plemnikom przejść przez błonę jajową'],
      },
      {
        text: 'Co sprawia, że nasienie jest początkowo gęste, a potem się upłynnia?',
        answer: 'Proteazy prostaty rozkładają białka koagulujące pęcherzyków nasiennych w ciągu 15–30 min',
        options: ['Temperatura ciała powoduje upłynnienie', 'Proteazy prostaty rozkładają białka koagulujące pęcherzyków nasiennych w ciągu 15–30 min', 'Kontakt z pH pochwy', 'Enzymy produkowane przez najądrze'],
      },
      {
        text: 'Co to jest hiperspermia?',
        answer: 'Zbyt duża objętość ejakulatu – powyżej 6 ml',
        options: ['Zbyt szybki wytrysk', 'Zbyt duża objętość ejakulatu – powyżej 6 ml', 'Nadmiar plemników powyżej normy', 'Wielokrotny wytrysk podczas jednego stosunku'],
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
        answer: 'Transudacja – osocze krwi przenika przez ściany pochwy pod wpływem wazokongescji',
        options: ['Z gruczołów Bartholina (główne źródło)', 'Z wydzieliny szyjki macicy', 'Transudacja – osocze krwi przenika przez ściany pochwy pod wpływem wazokongescji', 'Z pęcherzyków jajnikowych'],
      },
      {
        text: 'Co to jest strefa erogenna?',
        answer: 'Obszar ciała szczególnie wrażliwy na stymulację seksualną',
        options: ['Obszar ciała pokryty błoną śluzową', 'Obszar ciała szczególnie wrażliwy na stymulację seksualną', 'Tylko okolice narządów płciowych', 'Obszar ciała reagujący bólem na dotyk'],
      },
      {
        text: 'Co to jest "podwójny model kontroli seksualnej" (dual control model)?',
        answer: 'Równowaga między układem pobudzenia (gaz) a układem hamowania (hamulec) w mózgu',
        options: ['Aktywacja obu półkul mózgu podczas seksu', 'Równowaga między układem pobudzenia (gaz) a układem hamowania (hamulec) w mózgu', 'Synchronizacja orgazmu partnerów', 'Kontrola oddechu i tętna podczas stosunku'],
      },
      {
        text: 'Dlaczego brodawki sutkowe mogą erekować podczas pobudzenia?',
        answer: 'Skurcz mięśni gładkich areoli pod wpływem oksytocyny i układu współczulnego',
        options: ['Wzrost temperatury ciała', 'Skurcz mięśni gładkich areoli pod wpływem oksytocyny i układu współczulnego', 'Rozszerzenie naczyń krwionośnych brodawek', 'Wydzielanie estrogenów do tkanki piersi'],
      },
      {
        text: 'Co to jest rumieniec seksualny (sex flush)?',
        answer: 'Zaczerwienienie skóry klatki piersiowej i szyi spowodowane rozszerzeniem naczyń krwionośnych',
        options: ['Pocenie się podczas seksu', 'Zaczerwienienie skóry klatki piersiowej i szyi spowodowane rozszerzeniem naczyń krwionośnych', 'Uczucie gorąca od aktywności fizycznej', 'Objawy alergii'],
      },
      {
        text: 'Jaka jest rola dopaminy w pobudzeniu seksualnym?',
        answer: 'Napędza motywację i pożądanie – stwarza uczucie "chcenia"',
        options: ['Wywołuje fizyczną erekcję', 'Reguluje poziom nawilżenia pochwy', 'Napędza motywację i pożądanie – stwarza uczucie "chcenia"', 'Hamuje nadmierne pobudzenie'],
      },
      {
        text: 'Co to jest tumescencja?',
        answer: 'Powiększenie narządów płciowych wypełnionych krwią (wazokongescja) podczas pobudzenia',
        options: ['Ból w narządach płciowych po długiej stymulacji', 'Powiększenie narządów płciowych wypełnionych krwią (wazokongescja) podczas pobudzenia', 'Skurcz mięśni pochwy', 'Wydzielanie śluzu szyjkowego'],
      },
      {
        text: 'Który obszar mózgu przetwarza emocjonalne bodźce seksualne i reaguje na strach?',
        answer: 'Ciało migdałowate (amygdala)',
        options: ['Móżdżek', 'Kora ruchowa', 'Ciało migdałowate (amygdala)', 'Zakręt środkowy czoła'],
      },
      {
        text: 'Kiedy libido kobiety jest statystycznie najwyższe w trakcie cyklu?',
        answer: 'Wokół owulacji (dzień 12–16) – wzrost testosteronu i estrogenów',
        options: ['Podczas miesiączki', 'Wokół owulacji (dzień 12–16) – wzrost testosteronu i estrogenów', 'W fazie lutealnej (tydzień 3–4)', 'Libido jest stałe przez cały cykl'],
      },
      {
        text: 'Co to jest efekt Coolidge\'a?',
        answer: 'Odnowienie podniecenia seksualnego przy nowym partnerze mimo wcześniejszego nasycenia',
        options: ['Stopniowy wzrost podniecenia w długim związku', 'Odnowienie podniecenia seksualnego przy nowym partnerze mimo wcześniejszego nasycenia', 'Obniżenie libido po wieloletnim związku', 'Brak zainteresowania seksem u osób starszych'],
      },
      {
        text: 'Jak stymulacja wizualna wpływa na pobudzenie seksualne u mężczyzn i kobiet?',
        answer: 'Obie płci reagują na bodźce wizualne – mężczyźni silniej wg klasycznych badań, kobiety bardziej kontekstualnie',
        options: ['Wyłącznie mężczyźni reagują na wzrok', 'Kobiety reagują silniej niż mężczyźni', 'Obie płci reagują na bodźce wizualne – mężczyźni silniej wg klasycznych badań, kobiety bardziej kontekstualnie', 'Wzrok nie wpływa na pobudzenie seksualne'],
      },
      {
        text: 'Co to jest vomeronasal organ (narząd lemieszkowy) u ludzi?',
        answer: 'Szczątkowy narząd wykrywający feromony – u dorosłych ludzi jest nieaktywny funkcjonalnie',
        options: ['Narząd w nosie odpowiedzialny za słuch', 'Szczątkowy narząd wykrywający feromony – u dorosłych ludzi jest nieaktywny funkcjonalnie', 'Receptor smaku ważny dla orgazmu', 'Gruczoł wydzielający feromony u szyi'],
      },
      {
        text: 'Co to jest seksualne wstręt (sexual disgust)?',
        answer: 'Ewolucyjny mechanizm chroniący przed potencjalnie szkodliwymi kontaktami seksualnymi',
        options: ['Kliniczne zaburzenie polegające na awersji do wszystkiego co seksualne', 'Ewolucyjny mechanizm chroniący przed potencjalnie szkodliwymi kontaktami seksualnymi', 'Niemożność pobudzenia seksualnego', 'Fobia seksualna wymagająca leczenia'],
      },
      {
        text: 'Co się dzieje z tętnicami w narządach płciowych podczas pobudzenia?',
        answer: 'Rozszerzają się (wazodylatacja) – krew napływa i powoduje wzwód / tumescencję',
        options: ['Zwężają się dla lepszego ukrwienia', 'Rozszerzają się (wazodylatacja) – krew napływa i powoduje wzwód / tumescencję', 'Nie zmieniają się – to tylko efekt nerwowy', 'Pulsują szybciej bez zmiany średnicy'],
      },

      // ── REKORDY / CIEKAWOSTKI ────────────────────────────────────────────────
      {
        text: 'Ile orgazmów osiągnęła kobieta w ciągu 1 godziny w badaniach laboratoryjnych (Kinsey Institute, lata 50.)?',
        answer: '134',
        options: ['12', '47', '134', 'Ponad 500'],
      },
      {
        text: 'Do czego pierwotnie służył wibrator wynaleziony w XIX wieku?',
        answer: 'Do lekarskiego "masażu" leczącego "histerię" – powszechną diagnozę u kobiet epoki wiktoriańskiej',
        options: ['Do masażu pleców po pracy', 'Do lekarskiego "masażu" leczącego "histerię" – powszechną diagnozę u kobiet epoki wiktoriańskiej', 'Do badań fizjologicznych mięśni', 'Do leczenia bólu głowy elektryczną stymulacją'],
      },
      {
        text: 'Kiedy pierwszy elektryczny wibrator trafił do powszechnej sprzedaży?',
        answer: 'Około 1902 roku (Hamilton Beach)',
        options: ['W latach 1860.', 'Około 1902 roku (Hamilton Beach)', 'W 1945 roku', 'Dopiero w latach 60. XX w.'],
      },
      {
        text: 'Jakie zwierzę ma proporcjonalnie największy penis w królestwie zwierząt?',
        answer: 'Pąkla (barnacle) – penis może być do 8× długości ciała',
        options: ['Słoń', 'Humbak (wieloryb)', 'Pąkla (barnacle) – penis może być do 8× długości ciała', 'Goryl'],
      },
      {
        text: 'Co to jest "blue balls" (epididymal hypertension)?',
        answer: 'Bóle i dyskomfort w jądrach spowodowany długotrwałym pobudzeniem bez orgazmu – fenomen realny',
        options: ['Mit medyczny bez podstaw naukowych', 'Choroba przenoszona drogą płciową', 'Bóle i dyskomfort w jądrach spowodowany długotrwałym pobudzeniem bez orgazmu – fenomen realny', 'Zapalenie najądrzy'],
      },
      {
        text: 'Ile razy szacunkowo przeciętna osoba uprawia seks w ciągu całego życia?',
        answer: 'Szacunkowo 5 000–6 000 razy',
        options: ['Około 500 razy', 'Około 1 000 razy', 'Szacunkowo 5 000–6 000 razy', 'Ponad 50 000 razy'],
      },
      {
        text: 'Który kraj jako pierwszy zdelegalizował homoseksualizm jako przestępstwo?',
        answer: 'Francja (Code Pénal 1791, po Rewolucji Francuskiej)',
        options: ['Holandia', 'Francja (Code Pénal 1791, po Rewolucji Francuskiej)', 'Szwecja', 'USA'],
      },
      {
        text: 'Jaki związek chemiczny w czekoladzie naśladuje uczucie zakochania?',
        answer: 'Fenyloetylamine (PEA) – naturalna substancja uwalniania podczas zakochania',
        options: ['Teofilina', 'Kofeina', 'Fenyloetylamine (PEA) – naturalna substancja uwalniania podczas zakochania', 'Serotonina zawarta w kakao'],
      },
      {
        text: 'Jaką najczęstszą fantazję seksualną mają kobiety wg badań?',
        answer: 'Seks z nieznanym partnerem lub w niecodziennym miejscu',
        options: ['Seks z gwiazdą filmową', 'Seks z nieznanym partnerem lub w niecodziennym miejscu', 'Seks z kobietą (dla hetero)', 'Fantazje BDSM'],
      },
      {
        text: 'Które zwierzę jest uważane za symbol monogamii seksualnej wśród naczelnych?',
        answer: 'Gibon – utrzymuje pary monogamiczne dłużej niż większość naczelnych',
        options: ['Szympans', 'Goryl', 'Gibon – utrzymuje pary monogamiczne dłużej niż większość naczelnych', 'Makak'],
      },
      {
        text: 'Co to jest "beer goggles effect" – potwierdzony naukowo?',
        answer: 'Postrzeganie innych jako atrakcyjniejszych pod wpływem alkoholu',
        options: ['Zamazane widzenie po alkoholu', 'Postrzeganie innych jako atrakcyjniejszych pod wpływem alkoholu', 'Uczucie ciepła po piwie', 'Wzrost tolerancji na alkohol'],
      },
      {
        text: 'Ile kalorii spala przeciętny stosunek seksualny? (PLoS ONE 2013)',
        answer: 'Około 69–100 kcal',
        options: ['Około 5 kcal', 'Około 30 kcal', 'Około 69–100 kcal', 'Ponad 400 kcal'],
      },
      {
        text: 'Który starożytny grecki lekarz jako pierwszy szczegółowo opisał kobiecy orgazm?',
        answer: 'Galen z Pergamonu (II w. n.e.)',
        options: ['Hipokrates', 'Arystoteles', 'Galen z Pergamonu (II w. n.e.)', 'Sokrates'],
      },
      {
        text: 'Jaka jest najczęstsza pozycja seksualna na świecie wg badań?',
        answer: 'Misjonarz',
        options: ['Jeździec', 'Doggy style', 'Misjonarz', 'Łyżeczka'],
      },
      {
        text: 'Ile procent badanych przez Kinsey kobiet przyznało się do masturbacji?',
        answer: 'Około 62–70% (badanie z lat 50.)',
        options: ['Około 5%', 'Około 20%', 'Około 62–70% (badanie z lat 50.)', 'Prawie 100%'],
      },
      {
        text: 'Który lekarz jako pierwszy opisał punkt G w publikacji naukowej (1950)?',
        answer: 'Ernst Gräfenberg',
        options: ['Sigmund Freud', 'Alfred Kinsey', 'William Masters', 'Ernst Gräfenberg'],
      },

      // ── ZDROWIE INTYMNE ──────────────────────────────────────────────────────
      {
        text: 'Co to jest HPV?',
        answer: 'Ludzki wirus brodawczaka – najczęstszy wirus przenoszony drogą płciową, może powodować raka szyjki macicy',
        options: ['Wirus wywołujący opryszczkę narządów płciowych', 'Ludzki wirus brodawczaka – najczęstszy wirus przenoszony drogą płciową, może powodować raka szyjki macicy', 'Wirus HIV w formie utajonej', 'Zakażenie grzybicze narządów płciowych'],
      },
      {
        text: 'Który środek jest najskuteczniejszy w zapobieganiu przenoszeniu STI?',
        answer: 'Prezerwatywa (kondom) stosowana prawidłowo',
        options: ['Antykoncepcja hormonalna', 'Prezerwatywa (kondom) stosowana prawidłowo', 'Wkładka domaciczna (IUD)', 'Wstrzemięźliwość przez kilka dni po kontakcie'],
      },
      {
        text: 'Co wywołuje grzybicę pochwy?',
        answer: 'Nadmierny przerost drożdżaków Candida albicans',
        options: ['Bakteria Gardnerella vaginalis', 'Wirus HSV-2', 'Nadmierny przerost drożdżaków Candida albicans', 'Pasożyt Trichomonas vaginalis'],
      },
      {
        text: 'Co to jest endometrioza?',
        answer: 'Stan, w którym tkanka podobna do błony śluzowej macicy rośnie poza macicą',
        options: ['Rak endometrium', 'Stan, w którym tkanka podobna do błony śluzowej macicy rośnie poza macicą', 'Pogrubienie śluzówki macicy po menopauzie', 'Zapalenie macicy wywołane bakterią'],
      },
      {
        text: 'Co to jest PCOS (zespół policystycznych jajników)?',
        answer: 'Zaburzenie hormonalne powodujące nieregularne owulacje, cysty jajnikowe i nadmiar androgenów',
        options: ['Nowotwór jajnika', 'Zaburzenie hormonalne powodujące nieregularne owulacje, cysty jajnikowe i nadmiar androgenów', 'Zapalenie jajowodów', 'Przedwczesna menopauza'],
      },
      {
        text: 'Które STI można przenieść bez penetracji, przez sam kontakt skóry?',
        answer: 'Opryszczka (HSV) i HPV – przenoszą się kontaktowo',
        options: ['Chlamydia', 'HIV', 'Opryszczka (HSV) i HPV – przenoszą się kontaktowo', 'Kiła (wyłącznie przez krew)'],
      },
      {
        text: 'Jaki środek zapobiega najczęstszym typom HPV powodującym raka szyjki macicy?',
        answer: 'Szczepionka HPV (Gardasil 9) – podawana przed inicjacją seksualną',
        options: ['Antybiotyk przyjmowany profilaktycznie', 'Szczepionka HPV (Gardasil 9) – podawana przed inicjacją seksualną', 'Regularne cytologie', 'Antykoncepcja hormonalna'],
      },
      {
        text: 'Co to jest rzęsistkowica (trichomoniasis)?',
        answer: 'Pasożytnicze STI wywołane przez Trichomonas vaginalis – często bezobjawowe',
        options: ['Zakażenie grzybicze pochwy', 'Wirusowe STI powodujące brodawki', 'Pasożytnicze STI wywołane przez Trichomonas vaginalis – często bezobjawowe', 'Bakteryjne zapalenie pochwy'],
      },
      {
        text: 'Jakie lubrykanty są bezpieczne do stosowania z prezerwatywami lateksowymi?',
        answer: 'Na bazie wody lub silikonu – tłuszczowe niszczą lateks',
        options: ['Olej kokosowy', 'Wazelina', 'Na bazie wody lub silikonu – tłuszczowe niszczą lateks', 'Krem nawilżający do ciała'],
      },
      {
        text: 'Jak antybiotyki wpływają na florę bakteryjną pochwy?',
        answer: 'Mogą zaburzyć równowagę Lactobacillus i wywołać grzybicę wtórną',
        options: ['Poprawiają florę bakteryjną pochwy', 'Nie mają wpływu na florę pochwy', 'Mogą zaburzyć równowagę Lactobacillus i wywołać grzybicę wtórną', 'Leczą infekcje grzybicze pochwy'],
      },
      {
        text: 'Co to jest PrEP?',
        answer: 'Pre-Exposure Prophylaxis – codzienny lek antyretrowirusowy zapobiegający zakażeniu HIV',
        options: ['Szczepionka na HPV po kontakcie', 'Pre-Exposure Prophylaxis – codzienny lek antyretrowirusowy zapobiegający zakażeniu HIV', 'Antykoncepcja awaryjna dla kobiet', 'Test na HIV wykonywany w domu'],
      },
      {
        text: 'Jaki jest objaw pierwotny kiły (syfilisu)?',
        answer: 'Bezbolesny twardy wrzód (szankier) w miejscu wniknięcia bakterii Treponema pallidum',
        options: ['Ropna wydzielina z narządów płciowych', 'Swędzenie i pieczenie pochwy', 'Bezbolesny twardy wrzód (szankier) w miejscu wniknięcia bakterii Treponema pallidum', 'Wysypka krostkowa narządów płciowych'],
      },
      {
        text: 'Jaki jest problem z gonorrhea (rzeżączką) w XXI wieku?',
        answer: 'Narastająca oporność na antybiotyki – szczepy XDR oporne na wszystkie standardowe leki',
        options: ['Nie istnieje skuteczna diagnostyka', 'Narastająca oporność na antybiotyki – szczepy XDR oporne na wszystkie standardowe leki', 'Brak szczepionki i brak leczenia', 'Choroba sama ustępuje bez leczenia'],
      },
      {
        text: 'Do czego służy cytologia (wymaz Pap smear)?',
        answer: 'Przesiewowe badanie wykrywające zmiany przedrakowe i raka szyjki macicy',
        options: ['Badanie pH pochwy', 'Diagnoza infekcji grzybiczych', 'Przesiewowe badanie wykrywające zmiany przedrakowe i raka szyjki macicy', 'Kontrola hormonu ciążowego'],
      },
      {
        text: 'Jaką rolę pełnią probiotyki dla zdrowia pochwy?',
        answer: 'Wspomagają odbudowę flory Lactobacillus i obniżają ryzyko BV i grzybicy',
        options: ['Zastępują antybiotyki w leczeniu STI', 'Wspomagają odbudowę flory Lactobacillus i obniżają ryzyko BV i grzybicy', 'Leczą endometriozę', 'Nie mają udowodnionego wpływu na pochwę'],
      },

      // ── MÓZG I SEKS ─────────────────────────────────────────────────────────
      {
        text: 'Jaką rolę pełni podwzgórze w życiu seksualnym?',
        answer: 'Kontroluje wydzielanie hormonów płciowych poprzez hormony uwalniające (GnRH)',
        options: ['Przetwarza bodźce wzrokowe erotyczne', 'Kontroluje wydzielanie hormonów płciowych poprzez hormony uwalniające (GnRH)', 'Odpowiada za fizyczny wzwód', 'Jest centrum doznań zmysłowych'],
      },
      {
        text: 'Co to jest jądro półleżące (nucleus accumbens) i jakie ma znaczenie w seksie?',
        answer: 'Centrum nagrody mózgu – aktywowane przez pożądanie seksualne i orgazm',
        options: ['Centrum bólu regulujące odczuwanie w narządach płciowych', 'Centrum nagrody mózgu – aktywowane przez pożądanie seksualne i orgazm', 'Część układu limbicznego odpowiedzialna za strach', 'Obszar mózgu kontrolujący ruch podczas stosunku'],
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
        answer: 'Klinicznie niskie lub nieobecne pożądanie seksualne powodujące distres u pacjenta',
        options: ['Nadmierne pożądanie seksualne', 'Klinicznie niskie lub nieobecne pożądanie seksualne powodujące distres u pacjenta', 'Zaburzenie erekcji', 'Ból podczas stosunku'],
      },
      {
        text: 'Jak stres niszczy popęd seksualny na poziomie neurobiologicznym?',
        answer: 'Kortyzol hamuje oś podwzgórze-przysadka-gonady, obniżając produkcję hormonów płciowych',
        options: ['Stres bezpośrednio uszkadza narządy płciowe', 'Kortyzol hamuje oś podwzgórze-przysadka-gonady, obniżając produkcję hormonów płciowych', 'Adrenalina blokuje wrażliwość nerwową genitaliów', 'Stres nie ma udowodnionego wpływu na libido'],
      },
      {
        text: 'Jaka jest rola endorfin podczas seksu i orgazmu?',
        answer: 'Działają przeciwbólowo i wywołują euforię – podobnie jak morfina wiążą się z receptorami opioidowymi',
        options: ['Regulują poziom estrogenów', 'Powodują skurcze mięśni niezbędne do orgazmu', 'Działają przeciwbólowo i wywołują euforię – podobnie jak morfina wiążą się z receptorami opioidowymi', 'Są głównym neuroprzekaźnikiem pożądania'],
      },
      {
        text: 'Czy regularny seks wpływa na funkcje poznawcze?',
        answer: 'Badania sugerują poprawę pamięci i neurogenezę hipokampa u aktywnych seksualnie',
        options: ['Nie ma żadnych badań na ten temat', 'Pogarsza koncentrację z powodu hormonów', 'Badania sugerują poprawę pamięci i neurogenezę hipokampa u aktywnych seksualnie', 'Tylko u kobiet po 50. roku życia'],
      },
      {
        text: 'Co to jest warunkowanie seksualne (sexual conditioning)?',
        answer: 'Kojarzenie neutralnych bodźców z pobudzeniem (wzorzec Pawłowski) – podstawa wielu fetyszy',
        options: ['Genetyczne programowanie preferencji seksualnych', 'Terapia seksualna oparta na warunkowaniu behawioralnym', 'Kojarzenie neutralnych bodźców z pobudzeniem (wzorzec Pawłowski) – podstawa wielu fetyszy', 'Trening kontroli orgazmu w terapii par'],
      },
      {
        text: 'Jak uzależnienie od pornografii wpływa na mózg wg badań neuroobrazowania?',
        answer: 'Desensytyzacja układu nagrody – potrzeba silniejszych bodźców dla tego samego efektu',
        options: ['Trwałe uszkodzenie kory wzrokowej', 'Desensytyzacja układu nagrody – potrzeba silniejszych bodźców dla tego samego efektu', 'Nadaktywność obszarów odpowiedzialnych za pamięć', 'Zmniejszenie objętości hipokampa'],
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
        answer: 'Tak – nocne orgazmy, orgazmy podczas hipnozy lub spontaniczne orgazmy mózgowe',
        options: ['Nie – orgazm wymaga bezwzględnie stymulacji fizycznej', 'Tak – nocne orgazmy, orgazmy podczas hipnozy lub spontaniczne orgazmy mózgowe', 'Tylko u kobiet, nie u mężczyzn', 'Jedynie u osób z zaburzeniami neurologicznymi'],
      },

      // ── DODATKOWE FAKTY ──────────────────────────────────────────────────────
      {
        text: 'Co to jest libido?',
        answer: 'Popęd seksualny – napędzany przez testosteron, dopaminę i czynniki psychologiczne',
        options: ['Hormon produkowany wyłącznie przez jajniki', 'Popęd seksualny – napędzany przez testosteron, dopaminę i czynniki psychologiczne', 'Zdolność do orgazmu', 'Poziom nawilżenia pochwy podczas pobudzenia'],
      },
      {
        text: 'Który nerw jest głównym "nerwem przyjemności" narządów płciowych u obu płci?',
        answer: 'Nerw sromowy (nervus pudendus)',
        options: ['Nerw błędny (vagus)', 'Nerw sromowy (nervus pudendus)', 'Nerw biodrowy', 'Nerw kulszowy'],
      },
      {
        text: 'Jak wiele procent par doświadcza tzw. "desire discrepancy" (różnic w popędzie seksualnym)?',
        answer: 'Ponad 80% par w długotrwałych związkach',
        options: ['Około 10%', 'Około 30%', 'Ponad 80% par w długotrwałych związkach', 'Jest to rzadkie zjawisko – poniżej 5%'],
      },
      {
        text: 'Ile wynosi typowy obwód pochwy w spoczynku?',
        answer: 'Około 5–7 cm (obwód, nie średnica)',
        options: ['Około 1 cm', 'Około 3 cm', 'Około 5–7 cm (obwód, nie średnica)', 'Ponad 15 cm'],
      },
      {
        text: 'Co to jest oksytocyna i dlaczego nazywana jest "hormonem przytulania"?',
        answer: 'Hormon wydzielany podczas dotyku, orgazmu i karmienia – wzmacnia więź i zaufanie',
        options: ['Hormon wydzielany wyłącznie podczas ciąży', 'Hormon wydzielany podczas dotyku, orgazmu i karmienia – wzmacnia więź i zaufanie', 'Neuroprzekaźnik napędzający pożądanie seksualne', 'Enzym regulujący nawilżenie pochwy'],
      },
      {
        text: 'Ile procent par stosuje regularnie jakąś formę antykoncepcji?',
        answer: 'Około 57% par na świecie (WHO 2019)',
        options: ['Około 10%', 'Około 35%', 'Około 57% par na świecie (WHO 2019)', 'Ponad 90%'],
      },
      {
        text: 'Jak długo trwa ejakulacja (sam akt wyrzutu nasienia) u mężczyzny?',
        answer: 'Kilka sekund – zwykle 3–10 sekund',
        options: ['Ułamek sekundy', 'Kilka sekund – zwykle 3–10 sekund', 'Około minuty', 'Trwa tak długo jak orgazm – 3–15 sekund'],
      },
      {
        text: 'Co to jest menstruacja retrograde (wsteczna miesiączka)?',
        answer: 'Krew miesiączkowa cofa się przez jajowody do jamy otrzewnej – czynnik ryzyka endometriozy',
        options: ['Miesiączka trwająca ponad 10 dni', 'Brak krwawienia mimo cyklu', 'Krew miesiączkowa cofa się przez jajowody do jamy otrzewnej – czynnik ryzyka endometriozy', 'Nieregularne miesiączkowanie'],
      },
      {
        text: 'Ile plemników zdrowego mężczyzny jest morfologicznie "normalnych" wg WHO?',
        answer: 'Wystarczy 4% normalnych – reszta może mieć drobne wady morfologiczne',
        options: ['Co najmniej 90%', 'Co najmniej 50%', 'Co najmniej 20%', 'Wystarczy 4% normalnych – reszta może mieć drobne wady morfologiczne'],
      },
      {
        text: 'Co to jest ginekomastia?',
        answer: 'Powiększenie tkanki gruczołowej piersi u mężczyzn – może być spowodowane zaburzeniem hormonalnym',
        options: ['Rak piersi u mężczyzn', 'Powiększenie tkanki gruczołowej piersi u mężczyzn – może być spowodowane zaburzeniem hormonalnym', 'Nadmiar estrogenów powodujący impotencję', 'Stan zapalny piersi u kobiet po porodzie'],
      },
      {
        text: 'Co to jest refleks erekcji (reflex erection) vs psychogenna erekcja?',
        answer: 'Refleksowa – wywołana fizycznym dotykiem; psychogenna – wywołana myślami i fantazjami',
        options: ['Obydwa typy są identyczne neurologicznie', 'Refleksowa – wywołana fizycznym dotykiem; psychogenna – wywołana myślami i fantazjami', 'Psychogenna dotyczy tylko kobiet', 'Refleksowa erekcja nie istnieje u dorosłych'],
      },
      {
        text: 'Jak wiek wpływa na refrakcję (czas między orgazmami) u mężczyzn?',
        answer: 'Wydłuża się z wiekiem – z minut u nastolatka do godzin lub doby u mężczyzny 50+',
        options: ['Skraca się z wiekiem dzięki doświadczeniu', 'Wydłuża się z wiekiem – z minut u nastolatka do godzin lub doby u mężczyzny 50+', 'Pozostaje stała przez całe życie', 'Zależy wyłącznie od diety, nie wieku'],
      },
      {
        text: 'Ile kosztuje energetycznie jeden spermatogon (komórka macierzysta plemnika) na drodze do gotowego plemnika?',
        answer: 'Każdy dojrzały plemnik to wynik wielu podziałów przez 64–74 dni – organizm wytwarza ~1500/s',
        options: ['Każdy jest produkowany indywidualnie i trwa 1 dzień', 'Każdy dojrzały plemnik to wynik wielu podziałów przez 64–74 dni – organizm wytwarza ~1500/s', 'Produkcja jest jednorazowa – zasoby na całe życie', 'Jeden cykl trwa 7 dni i produkuje 1 mln komórek'],
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
        answer: 'U większości spadek – stres, zmęczenie i niepewność obniżyły libido',
        options: ['Wzrost u prawie wszystkich par', 'U większości spadek – stres, zmęczenie i niepewność obniżyły libido', 'Brak wpływu – aktywność była identyczna', 'Tylko pary bez dzieci zauważyły zmianę'],
      },
      {
        text: 'Ile procent singli uprawia seks regularnie (co najmniej raz w miesiącu)?',
        answer: 'Około 20–30%',
        options: ['Prawie wszyscy – ~90%', 'Około 60%', 'Około 20–30%', 'Poniżej 5%'],
      },
      {
        text: 'Ile czasu w ciągu dorosłego życia przeciętna osoba spędza uprawiając seks?',
        answer: 'Szacunkowo około 1% całego czasu dorosłego życia',
        options: ['Około 10%', 'Około 5%', 'Szacunkowo około 1% całego czasu dorosłego życia', 'Mniej niż 0,1%'],
      },

      // ── CZAS TRWANIA ─────────────────────────────────────────────────────────
      {
        text: 'Ile trwa penetracja mierzona stoperem wg badania BJUI 2005?',
        answer: '5,4 minuty (mediana)',
        options: ['1 minuta', '5,4 minuty (mediana)', '20 minut', '45 minut'],
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
        answer: 'Znacznie go wydłużają – nawet 5–10-krotnie u niektórych mężczyzn',
        options: ['Skracają czas do wytrysku', 'Nie mają wpływu', 'Znacznie go wydłużają – nawet 5–10-krotnie u niektórych mężczyzn', 'Całkowicie blokują wytrysk'],
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
        answer: 'Lesbijki osiągają orgazm w ~86% vs ~65% heteroseksualnych kobiet',
        options: ['Brak różnicy – obie grupy ~65%', 'Lesbijki osiągają orgazm w ~86% vs ~65% heteroseksualnych kobiet', 'Heteroseksualne kobiety osiągają orgazm częściej', 'Różnica wynosi zaledwie 2%'],
      },
      {
        text: 'W jakiej pozycji kobiety najczęściej osiągają orgazm wg badań?',
        answer: 'Jeździec (cowgirl) – najlepsza kontrola stymulacji łechtaczki',
        options: ['Misjonarz', 'Doggy style', 'Jeździec (cowgirl) – najlepsza kontrola stymulacji łechtaczki', 'Łyżeczka'],
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
        answer: 'Kobiety regularnie masturbujące się osiągają orgazm z partnerem statystycznie częściej',
        options: ['Zmniejsza wrażliwość na dotyk partnera', 'Nie ma żadnego wpływu', 'Kobiety regularnie masturbujące się osiągają orgazm z partnerem statystycznie częściej', 'Zmniejsza szansę na orgazm z partnerem'],
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
        answer: '"Reporting bias" – mężczyźni zawyżają, kobiety zaniżają z powodów społecznych',
        options: ['Bo faktycznie mają więcej partnerów', '"Reporting bias" – mężczyźni zawyżają, kobiety zaniżają z powodów społecznych', 'Bo mają inne rozumienie pojęcia "partner"', 'To mit – podają identyczne liczby'],
      },
      {
        text: 'Ile procent dorosłych miało więcej niż 10 partnerów seksualnych?',
        answer: 'Około 20–30% w krajach zachodnich',
        options: ['Poniżej 1%', 'Około 5%', 'Około 20–30% w krajach zachodnich', 'Ponad 70%'],
      },
      {
        text: 'Jaki procent dorosłych przyznaje się do relacji pozamałżeńskiej (zdrady)?',
        answer: 'Około 15–25% (różni się znacznie wg kraju i metodologii)',
        options: ['Poniżej 1%', 'Około 5%', 'Około 15–25% (różni się znacznie wg kraju i metodologii)', 'Ponad 60%'],
      },
      {
        text: 'Ile procent pierwszych stosunków odbywa się jako "przypadkowy seks" (one-night stand)?',
        answer: 'Około 30–40%',
        options: ['Poniżej 5%', 'Około 15%', 'Około 30–40%', 'Ponad 80%'],
      },
      {
        text: 'Ile procent randek przez aplikacje (Tinder, Bumble) prowadzi do kontaktu seksualnego?',
        answer: 'Około 30–40% wg badań użytkowników',
        options: ['Poniżej 5%', 'Około 15%', 'Około 30–40% wg badań użytkowników', 'Prawie 100%'],
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
        answer: 'Islandia i kraje skandynawskie – średnio ~15–16 lat',
        options: ['Francja i Włochy', 'Islandia i kraje skandynawskie – średnio ~15–16 lat', 'Brazylia i Argentyna', 'USA i Kanada'],
      },
      {
        text: 'W jakim wieku kobiety mają statystycznie największe libido wg badań?',
        answer: 'W okolicach 27–33 lat',
        options: ['W wieku 18–20 lat', 'W okolicach 27–33 lat', 'W okolicach 45–50 lat', 'Libido jest stałe przez całe życie'],
      },
      {
        text: 'Jak wiek inicjacji koreluje z późniejszą liczbą partnerów?',
        answer: 'Wcześniejsza inicjacja koreluje ze statystycznie wyższą liczbą partnerów w życiu',
        options: ['Brak jakiejkolwiek korelacji', 'Wcześniejsza inicjacja koreluje ze statystycznie wyższą liczbą partnerów w życiu', 'Późniejsza inicjacja = więcej partnerów', 'Wiek inicjacji wpływa tylko na płeć partnera'],
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
        answer: 'Około 5–10% regularnie; 25–30% eksperymentowało',
        options: ['Poniżej 0,5%', 'Około 5–10% regularnie; 25–30% eksperymentowało', 'Ponad 60%', 'BDSM praktykują wyłącznie mężczyźni'],
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
        answer: 'Seks wieloosobowy (trójkąt, grupowy)',
        options: ['BDSM i dominacja', 'Seks z celebrytą', 'Seks wieloosobowy (trójkąt, grupowy)', 'Transwestytyzm'],
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
        answer: 'Zwykle 13–16 lat – później niż mężczyźni',
        options: ['6–8 lat', 'Zwykle 13–16 lat – później niż mężczyźni', 'Dopiero po inicjacji seksualnej', 'Nie ma typowego wieku – jest bardzo zróżnicowany'],
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
        answer: 'Około 30–40% regularnie',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–40% regularnie', 'Prawie wszystkie pary'],
      },
      {
        text: 'Jaki stosunek kobiet inicjuje seks oralny u partnera?',
        answer: 'Około 50–55% regularnie inicjuje',
        options: ['Poniżej 5%', 'Około 20%', 'Około 50–55% regularnie inicjuje', 'Prawie wszystkie'],
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
        answer: 'U części par koreluje ze spadkiem satysfakcji i nierealistycznymi oczekiwaniami',
        options: ['Zawsze poprawia satysfakcję', 'U części par koreluje ze spadkiem satysfakcji i nierealistycznymi oczekiwaniami', 'Nie ma żadnego związku', 'Zawsze niszczy związek'],
      },
      {
        text: 'Jaka jest najpopularniejsza kategoria pornografii wśród kobiet wg danych Pornhub?',
        answer: '"Lesbian" (treści z kobietami) i "romantic"',
        options: ['"Hardcore" i "gangbang"', '"Lesbian" (treści z kobietami) i "romantic"', '"BDSM" i "bondage"', '"Amateur" i "casting"'],
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
        answer: 'Ponad 90% deklaruje większą łatwość osiągania orgazmu',
        options: ['Około 20%', 'Około 50%', 'Około 70%', 'Ponad 90% deklaruje większą łatwość osiągania orgazmu'],
      },

      // ── ANTYKONCEPCJA ────────────────────────────────────────────────────────
      {
        text: 'Jaka jest najczęściej stosowana metoda antykoncepcji na świecie?',
        answer: 'Sterylizacja żeńska – ponad 22% par',
        options: ['Prezerwatywa', 'Pigułka hormonalna', 'Sterylizacja żeńska – ponad 22% par', 'Wkładka domaciczna (IUD)'],
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
        answer: 'Ponad 99% – jedna z najskuteczniejszych odwracalnych metod',
        options: ['Około 70%', 'Około 85%', 'Około 95%', 'Ponad 99% – jedna z najskuteczniejszych odwracalnych metod'],
      },

      // ── ZDROWIE SEKSUALNE W LICZBACH ─────────────────────────────────────────
      {
        text: 'Co jest najpowszechniejszym STI na świecie?',
        answer: 'HPV – zaraża ponad 80% aktywnych seksualnie w jakimś momencie życia',
        options: ['Chlamydia', 'Kiła (syfilis)', 'HPV – zaraża ponad 80% aktywnych seksualnie w jakimś momencie życia', 'HIV'],
      },
      {
        text: 'Ile nowych zakażeń HIV notuje się rocznie na świecie?',
        answer: 'Około 1,5 miliona (UNAIDS 2023)',
        options: ['Kilkaset tysięcy', 'Około 1,5 miliona (UNAIDS 2023)', 'Około 50 milionów', 'Ponad 200 milionów'],
      },
      {
        text: 'Ile osób na świecie żyje aktualnie z HIV?',
        answer: 'Około 39 milionów (UNAIDS 2023)',
        options: ['Kilkaset tysięcy', 'Około 5 milionów', 'Około 39 milionów (UNAIDS 2023)', 'Ponad 500 milionów'],
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
        answer: 'Około 80% nowych zakażeń',
        options: ['Około 10%', 'Około 40%', 'Około 80% nowych zakażeń', 'Prawie 100%'],
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
        answer: 'Uwalnia prolaktynę i oksytocynę – ułatwia zasypianie',
        options: ['Utrudnia zasypianie z powodu adrenaliny', 'Nie ma wpływu na sen', 'Uwalnia prolaktynę i oksytocynę – ułatwia zasypianie', 'Tylko u mężczyzn skraca czas zasypiania'],
      },
      {
        text: 'O ile podnosi się poziom immunoglobuliny A (IgA) przy seksie 1–2× tygodniowo? (Wilkes Univ.)',
        answer: 'O około 30% w porównaniu do osób abstynentów',
        options: ['Spada – wysiłek osłabia odporność', 'O około 5%', 'O około 30% w porównaniu do osób abstynentów', 'Ponad 10-krotnie'],
      },
      {
        text: 'Jaki procent osób z migreną doświadcza jej złagodzenia podczas seksu/orgazmu?',
        answer: 'Około 60% – orgazm wykazuje działanie przeciwbólowe (University of Münster)',
        options: ['Poniżej 1%', 'Około 20%', 'Około 60% – orgazm wykazuje działanie przeciwbólowe (University of Münster)', 'Seks zawsze nasila ból głowy'],
      },
      {
        text: 'Jak seks wpływa na poziom kortyzolu (hormonu stresu)?',
        answer: 'Po stosunku poziom kortyzolu i ciśnienie krwi istotnie spadają',
        options: ['Podnosi kortyzol z powodu wysiłku fizycznego', 'Nie zmienia poziomu kortyzolu', 'Po stosunku poziom kortyzolu i ciśnienie krwi istotnie spadają', 'Wpływa tylko na adrenalinę, nie kortyzol'],
      },
      {
        text: 'Ile kalorii spala przeciętna para rocznie uprawiając seks?',
        answer: 'Szacunkowo 5 000–6 000 kcal rocznie',
        options: ['Około 100 kcal', 'Około 500 kcal', 'Szacunkowo 5 000–6 000 kcal rocznie', 'Ponad 50 000 kcal'],
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
        answer: 'Stres, zmęczenie i brak komunikacji o potrzebach',
        options: ['Fizyczne problemy zdrowotne', 'Brak pociągu fizycznego', 'Stres, zmęczenie i brak komunikacji o potrzebach', 'Oglądanie pornografii'],
      },
      {
        text: 'Jak komunikacja seksualna w parze wpływa na satysfakcję?',
        answer: 'Pary otwarcie komunikujące potrzeby mają o ~50% wyższą satysfakcję',
        options: ['Nie ma żadnego mierzalnego wpływu', 'Zmniejsza satysfakcję – "magia" zanika', 'Pary otwarcie komunikujące potrzeby mają o ~50% wyższą satysfakcję', 'Wpływa tylko na kobiety'],
      },
      {
        text: 'Do jakiej częstotliwości seksu wzrasta szczęście w związku, po czym plateau? (Muise et al. 2016)',
        answer: 'Raz w tygodniu – więcej nie zwiększa dalej szczęścia',
        options: ['Im więcej seksu, tym wyższe szczęście – bez plateau', 'Raz w tygodniu – więcej nie zwiększa dalej szczęścia', 'Trzy razy tygodniowo', 'Codziennie jest optymalne'],
      },
      {
        text: 'Ile procent par przyznaje się do otwartego związku (consensual non-monogamy)?',
        answer: 'Około 4–5% w USA, nieco wyżej w Europie Zachodniej',
        options: ['Poniżej 0,1%', 'Około 4–5% w USA, nieco wyżej w Europie Zachodniej', 'Około 30%', 'Ponad 50%'],
      },

      // ── MITY I FAKTY ────────────────────────────────────────────────────────
      {
        text: 'Czy mężczyźni myślą o seksie co 7 sekund?',
        answer: 'To mit – badanie Fisher (2011): średnio 19 razy dziennie, nie co 7 sekund',
        options: ['Tak – potwierdzono to naukowo', 'To mit – badanie Fisher (2011): średnio 19 razy dziennie, nie co 7 sekund', 'Tak, ale tylko mężczyźni poniżej 30. roku życia', 'Tak, lecz tylko przy braku partnerki'],
      },
      {
        text: 'Ile procent kobiet ocenia swój pierwszy seks z nowym partnerem jako rozczarowujący?',
        answer: 'Około 55%',
        options: ['Poniżej 5%', 'Około 20%', 'Około 55%', 'Prawie wszystkie – ~90%'],
      },
      {
        text: 'Czy seks przed zawodami sportowymi osłabia wyniki sportowe?',
        answer: 'Nie – badania nie wykazują wpływu na wyniki przy seksie 12h przed zawodami',
        options: ['Tak – znacząco osłabia siłę i wytrzymałość', 'Tak, ale tylko u mężczyzn', 'Nie – badania nie wykazują wpływu na wyniki przy seksie 12h przed zawodami', 'Tak – podwyższa testosteron zbyt mocno'],
      },
      {
        text: 'Czy seks podczas menstruacji jest medycznie niebezpieczny?',
        answer: 'Nie – jest bezpieczny, choć nieznacznie zwiększa ryzyko transmisji STI',
        options: ['Tak – grozi poważnymi infekcjami', 'Tak – jest bolesny dla obu stron', 'Nie – jest bezpieczny, choć nieznacznie zwiększa ryzyko transmisji STI', 'Tak – menstruacja uniemożliwia przyjemność seksualną'],
      },
      {
        text: 'Ile procent badanych kobiet deklaruje, że rozmiar penisa partnera nie ma dla nich znaczenia?',
        answer: 'Około 85% jest zadowolona z rozmiaru partnera (Anik Geraerts et al.)',
        options: ['Około 10%', 'Około 40%', 'Około 85% jest zadowolona z rozmiaru partnera (Anik Geraerts et al.)', 'Prawie 100%'],
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
        answer: 'Tylko około 40–50% – mimo że to klucz do satysfakcji',
        options: ['Prawie wszyscy – ~90%', 'Około 70%', 'Tylko około 40–50% – mimo że to klucz do satysfakcji', 'Poniżej 10%'],
      },

      // ── SATYSFAKCJA SEKSUALNA ────────────────────────────────────────────────
      {
        text: 'Jaki procent dorosłych deklaruje ogólne zadowolenie ze swojego życia seksualnego?',
        answer: 'Około 60–65% (Global Sex Survey Durex)',
        options: ['Poniżej 10%', 'Około 30%', 'Około 60–65% (Global Sex Survey Durex)', 'Ponad 95%'],
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
        answer: 'Około 50–55% – seks po 50 jest aktywny i satysfakcjonujący',
        options: ['Poniżej 1%', 'Około 10%', 'Około 50–55% – seks po 50 jest aktywny i satysfakcjonujący', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Jak samoocena własnego ciała wpływa na satysfakcję seksualną?',
        answer: 'Lepsza samoocena ciała koreluje ze znacznie wyższą satysfakcją seksualną',
        options: ['Brak jakiegokolwiek związku', 'Gorsza samoocena = lepsza koncentracja na partnerze', 'Lepsza samoocena ciała koreluje ze znacznie wyższą satysfakcją seksualną', 'Wpływa tylko na libido, nie satysfakcję'],
      },
      {
        text: 'Ile procent par deklaruje "rutynowy seks" bez szczególnego entuzjazmu?',
        answer: 'Około 40–50%',
        options: ['Poniżej 5%', 'Około 15%', 'Około 40–50%', 'Prawie wszystkie pary długoterminowe – ~90%'],
      },
      {
        text: 'Jak styl życia (ćwiczenia, dieta) wpływa na satysfakcję seksualną?',
        answer: 'Aktywne fizycznie osoby raportują o ~30% wyższą satysfakcję seksualną',
        options: ['Brak związku między stylem życia a seksem', 'Ćwiczenia obniżają libido z powodu zmęczenia', 'Aktywne fizycznie osoby raportują o ~30% wyższą satysfakcję seksualną', 'Dieta jest jedynym ważnym czynnikiem'],
      },
      {
        text: 'Jak długo po porodzie przeciętna para wznawia aktywność seksualną?',
        answer: 'Medycznie 6–8 tygodni, faktycznie często 3–6 miesięcy',
        options: ['Tydzień po porodzie', '2 tygodnie po porodzie', 'Medycznie 6–8 tygodni, faktycznie często 3–6 miesięcy', 'Po ukończeniu przez dziecko 1. roku życia'],
      },
      {
        text: 'Jaki procent par uprawia "seks planowany" (np. wyznaczony dzień tygodnia)?',
        answer: 'Około 20–25% par w długich związkach',
        options: ['Poniżej 1%', 'Około 20–25% par w długich związkach', 'Około 70%', 'Prawie wszyscy w związkach powyżej 10 lat'],
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
        answer: 'Około 27–30% wg WHO',
        options: ['Poniżej 1%', 'Około 5%', 'Około 27–30% wg WHO', 'Ponad 80%'],
      },
      {
        text: 'Jaki jest najniższy wiek przyzwolenia seksualnego w Europie (z pewnymi zastrzeżeniami)?',
        answer: '14 lat (Niemcy, Austria, Włochy – z zastrzeżeniami co do różnicy wieku)',
        options: ['10 lat', '14 lat (Niemcy, Austria, Włochy – z zastrzeżeniami co do różnicy wieku)', '18 lat w całej UE', '21 lat'],
      },
      {
        text: 'Jak religia wpływa na statystyki seksualne?',
        answer: 'Osoby głęboko religijne statystycznie inicjują seksualnie później i mają mniej partnerów',
        options: ['Religia nie wpływa na zachowania seksualne', 'Osoby religijne mają więcej seksu – rodziny są większe', 'Osoby głęboko religijne statystycznie inicjują seksualnie później i mają mniej partnerów', 'Religia wpływa tylko na orientację seksualną'],
      },
      {
        text: 'Który kontynent ma globalnie najwyższy wskaźnik zakażeń HIV?',
        answer: 'Afryka Subsaharyjska – ok. 25 mln z 39 mln zakażonych na świecie',
        options: ['Azja Południowo-Wschodnia', 'Ameryka Łacińska', 'Afryka Subsaharyjska – ok. 25 mln z 39 mln zakażonych na świecie', 'Europa Wschodnia'],
      },
      {
        text: 'Ile procent gwałtów jest zgłaszanych organom ścigania?',
        answer: 'Około 10–15% – zdecydowana większość pozostaje niezgłoszona',
        options: ['Prawie wszystkie – ~90%', 'Około 50%', 'Około 30%', 'Około 10–15% – zdecydowana większość pozostaje niezgłoszona'],
      },
      {
        text: 'W których krajach stosunki pozamałżeńskie są nadal prawnie karane śmiercią?',
        answer: 'W niektórych częściach Iranu, Arabii Saudyjskiej i Afganistanu',
        options: ['W żadnym kraju na świecie', 'Tylko w Afryce Zachodniej', 'W niektórych częściach Iranu, Arabii Saudyjskiej i Afganistanu', 'Wyłącznie w Ameryce Południowej'],
      },

      // ── ORIENTACJA I TOŻSAMOŚĆ ───────────────────────────────────────────────
      {
        text: 'Ile procent dorosłych identyfikuje się jako biseksualnych (kraje zachodnie)?',
        answer: 'Około 3–5% (więcej u kobiet niż mężczyzn)',
        options: ['Poniżej 0,1%', 'Około 3–5% (więcej u kobiet niż mężczyzn)', 'Około 25%', 'Ponad 50%'],
      },
      {
        text: 'Ile procent dorosłych identyfikuje się jako homoseksualni?',
        answer: 'Około 2–4% (różnice wg kraju i metodologii)',
        options: ['Poniżej 0,1%', 'Około 2–4% (różnice wg kraju i metodologii)', 'Około 20%', 'Ponad 40%'],
      },
      {
        text: 'Jak orientacja seksualna wpływa na satysfakcję seksualną?',
        answer: 'Przy akceptacji środowiska – osoby LGB raportują podobną lub wyższą satysfakcję',
        options: ['Osoby LGB zawsze mają niższą satysfakcję', 'Brak jakichkolwiek różnic – płeć nie ma znaczenia', 'Przy akceptacji środowiska – osoby LGB raportują podobną lub wyższą satysfakcję', 'Tylko heteroseksualiści mogą osiągać pełną satysfakcję'],
      },
      {
        text: 'Jak Tinder i aplikacje randkowe wpłynęły na liczbę partnerów seksualnych?',
        answer: 'Aktywni użytkownicy mają statystycznie więcej partnerów i częstszy casual sex',
        options: ['Aplikacje zmniejszyły aktywność seksualną', 'Aktywni użytkownicy mają statystycznie więcej partnerów i częstszy casual sex', 'Brak mierzalnego wpływu na zachowania seksualne', 'Tylko singlom powyżej 35 lat aplikacje dają więcej partnerów'],
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
        answer: 'Około 20–25% deklaruje takie oczekiwanie',
        options: ['Prawie wszyscy – ~85%', 'Około 50%', 'Około 20–25% deklaruje takie oczekiwanie', 'Poniżej 1%'],
      },
      {
        text: 'Jak wykształcenie wpływa na satysfakcję seksualną?',
        answer: 'Wyższe wykształcenie koreluje z lepszą komunikacją i wyższą satysfakcją',
        options: ['Niższe wykształcenie = wyższa spontaniczność = więcej satysfakcji', 'Brak jakiegokolwiek związku', 'Wyższe wykształcenie koreluje z lepszą komunikacją i wyższą satysfakcją', 'Wykształcenie wpływa tylko na częstotliwość seksu'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek miało seks w wodzie (basen, morze, wanna)?',
        answer: 'Około 40–50%',
        options: ['Poniżej 2%', 'Około 15%', 'Około 40–50%', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek seksowało (seksting)?',
        answer: 'Około 60–70% dorosłych z telefonem smartfonowym',
        options: ['Poniżej 5%', 'Około 20%', 'Około 60–70% dorosłych z telefonem smartfonowym', 'Prawie wszyscy – ~99%'],
      },
      {
        text: 'Jak zarobki wpływają na częstotliwość seksu?',
        answer: 'Wyższy dochód nieznacznie koreluje z wyższą częstotliwością seksu',
        options: ['Zamożniejsi uprawiają seks 10x rzadziej – stres pracy', 'Wyższy dochód nieznacznie koreluje z wyższą częstotliwością seksu', 'Brak jakiegokolwiek związku', 'Biedniejsi uprawiają znacznie więcej seksu'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek uprawiało seks pod wpływem alkoholu?',
        answer: 'Ponad 70% (badania wśród college students i dorosłych)',
        options: ['Poniżej 5%', 'Około 30%', 'Około 50%', 'Ponad 70% (badania wśród college students i dorosłych)'],
      },
      {
        text: 'Ile procent stosunków seksualnych prowadzi do ciąży, gdy nie jest stosowana antykoncepcja?',
        answer: 'Około 20–25% stosunków w oknie płodnym kobiety',
        options: ['Prawie każdy stosunek – ~99%', 'Około 50%', 'Około 20–25% stosunków w oknie płodnym kobiety', 'Poniżej 1%'],
      },
      {
        text: 'Ile procent ciąż w Polsce jest nieplanowanych?',
        answer: 'Około 30–40% (dane GUS i WHO dla Polski)',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–40% (dane GUS i WHO dla Polski)', 'Ponad 80%'],
      },
      {
        text: 'Ile par par korzysta z terapii seksualnej lub poradnictwa par?',
        answer: 'Mniej niż 5% – pomimo że problemy seksualne są powszechne',
        options: ['Prawie wszystkie pary z problemami – ~80%', 'Około 30%', 'Około 15%', 'Mniej niż 5% – pomimo że problemy seksualne są powszechne'],
      },

      // ── SEKS PO 50 I STAROŚĆ ─────────────────────────────────────────────────
      {
        text: 'Ile procent osób po 70. roku życia jest nadal aktywnych seksualnie?',
        answer: 'Około 40–50% w krajach zachodnich',
        options: ['Poniżej 1%', 'Około 10%', 'Około 40–50% w krajach zachodnich', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Jak menopauza wpływa na libido kobiety?',
        answer: 'U ok. 40% kobiet spada libido, u ok. 20% rośnie – brak lęku przed ciążą',
        options: ['Całkowite wygaszenie libido u wszystkich kobiet', 'Libido zawsze rośnie po menopauzie', 'U ok. 40% kobiet spada libido, u ok. 20% rośnie – brak lęku przed ciążą', 'Menopauza nie wpływa na libido'],
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
        answer: 'Aktywność seksualna po 60. roku życia koreluje z lepszym samopoczuciem i niższą depresją',
        options: ['Negatywny wpływ – wzrost ryzyka zawału', 'Brak żadnego wpływu na psychikę', 'Aktywność seksualna po 60. roku życia koreluje z lepszym samopoczuciem i niższą depresją', 'Pozytywny wpływ tylko u kobiet, nie mężczyzn'],
      },

      // ── PREZERWATYWY I BEZPIECZEŃSTWO ────────────────────────────────────────
      {
        text: 'Ile prezerwatyw sprzedaje się rocznie na całym świecie?',
        answer: 'Szacunkowo 27–30 miliardów sztuk rocznie',
        options: ['Kilka milionów', 'Około 500 milionów', 'Szacunkowo 27–30 miliardów sztuk rocznie', 'Ponad bilion'],
      },
      {
        text: 'Ile procent stosunków seksualnych na świecie odbywa się z użyciem prezerwatywy?',
        answer: 'Szacunkowo około 5–10% globalnie',
        options: ['Prawie wszystkie – ~90%', 'Około 50%', 'Około 30%', 'Szacunkowo około 5–10% globalnie'],
      },
      {
        text: 'Jak wiek wpływa na stosowanie prezerwatyw?',
        answer: 'Nastolatki i młodzi dorośli (18–25 lat) używają prezerwatyw częściej niż osoby starsze',
        options: ['Starsi używają prezerwatyw częściej', 'Brak różnicy wiekowej w stosowaniu', 'Nastolatki i młodzi dorośli (18–25 lat) używają prezerwatyw częściej niż osoby starsze', 'Prezerwatywy używają prawie wyłącznie osoby po 50. roku życia'],
      },
      {
        text: 'Ile procent przypadków HIV można by uniknąć przy 100% stosowaniu prezerwatyw?',
        answer: 'Szacunkowo 80% lub więcej nowych zakażeń drogą seksualną',
        options: ['Około 10%', 'Około 40%', 'Szacunkowo 80% lub więcej nowych zakażeń drogą seksualną', 'Prezerwatywy nie wpływają na transmisję HIV'],
      },

      // ── SEKS ONLINE I NOWOCZESNE TRENDY ─────────────────────────────────────
      {
        text: 'Jaki procent dorosłych kiedykolwiek uczestniczył w wideo-seksie (np. przez Skype/FaceTime)?',
        answer: 'Około 25–30% – wzrost znaczny po pandemii COVID',
        options: ['Poniżej 1%', 'Około 10%', 'Około 25–30% – wzrost znaczny po pandemii COVID', 'Prawie wszyscy – ~80%'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek kupiło produkt erotyczny przez internet?',
        answer: 'Około 40–50% w krajach zachodnich',
        options: ['Poniżej 2%', 'Około 15%', 'Około 40–50% w krajach zachodnich', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Ile procent dorosłych przyznaje się do oglądania pornografii z partnerem razem?',
        answer: 'Około 20–30%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 20–30%', 'Ponad 70%'],
      },
      {
        text: 'W którym roku rynek OnlyFans gwałtownie wzrósł?',
        answer: '2020 – podczas lockdownów pandemii COVID-19',
        options: ['2015', '2018', '2020 – podczas lockdownów pandemii COVID-19', '2023'],
      },
      {
        text: 'Ile dorosłych kobiet zarabia pieniądze tworząc treści dla dorosłych online?',
        answer: 'Szacunkowo kilka milionów na całym świecie (dane nieprecyzyjne ze względu na anonimowość)',
        options: ['Kilkaset osób globalnie', 'Szacunkowo kilka milionów na całym świecie (dane nieprecyzyjne ze względu na anonimowość)', 'Ponad 500 milionów', 'Tylko profesjonalne aktorki – rynek amatorski nie istnieje'],
      },

      // ── PŁODNOŚĆ W LICZBACH ──────────────────────────────────────────────────
      {
        text: 'Ile procent par w krajach zachodnich doświadcza problemów z płodnością?',
        answer: 'Około 10–15% par starających się o dziecko',
        options: ['Poniżej 0,5%', 'Około 3%', 'Około 10–15% par starających się o dziecko', 'Ponad 50%'],
      },
      {
        text: 'W jakiej proporcji za niepłodność odpowiada czynnik męski vs żeński?',
        answer: 'Mniej więcej po równo – ~40% mężczyźni, ~40% kobiety, ~20% oboje',
        options: ['Wyłącznie kobieta – ~90%', 'Wyłącznie mężczyzna – ~80%', 'Mniej więcej po równo – ~40% mężczyźni, ~40% kobiety, ~20% oboje', 'Niepłodność jest zawsze obustronna'],
      },
      {
        text: 'O ile spada płodność kobiety po 35. roku życia?',
        answer: 'Znacząco – szansa na ciążę miesięcznie spada z ~20% (25 lat) do ~5% (40 lat)',
        options: ['Nie spada – kobiety są płodne do menopauzy w tym samym stopniu', 'O 5% na rok – minimalnie', 'Znacząco – szansa na ciążę miesięcznie spada z ~20% (25 lat) do ~5% (40 lat)', 'Gwałtownie po 30. roku życia, zupełny zanik po 35.'],
      },
      {
        text: 'Jak pandemia COVID-19 wpłynęła na wskaźniki urodzeń?',
        answer: 'Krótkoterminowy spadek urodzeń, ale w niektórych krajach "baby boom" po lockdownie',
        options: ['Gwałtowny wzrost – "baby boom" w każdym kraju', 'Krótkoterminowy spadek urodzeń, ale w niektórych krajach "baby boom" po lockdownie', 'Brak jakiegokolwiek wpływu', 'Trwały i dramatyczny spadek urodzeń'],
      },
      {
        text: 'Ile procent zapłodnień in vitro (IVF) kończy się żywym urodzeniem (kobiety do 35 lat)?',
        answer: 'Około 40–45% na transfer (poniżej 35 lat)',
        options: ['Prawie 100%', 'Około 70%', 'Około 40–45% na transfer (poniżej 35 lat)', 'Poniżej 5%'],
      },

      // ── PSYCHOLOGIA SEKSUALNA W LICZBACH ────────────────────────────────────
      {
        text: 'Ile procent dorosłych ma co najmniej jeden fetysz seksualny?',
        answer: 'Badania wskazują na ~30–45% (stopy i bielizna są najczęstsze)',
        options: ['Poniżej 1% – fetysze są rzadkie', 'Około 5%', 'Badania wskazują na ~30–45% (stopy i bielizna są najczęstsze)', 'Prawie wszyscy – ~95%'],
      },
      {
        text: 'Jaki jest najczęstszy fetysz seksualny na świecie wg badań?',
        answer: 'Fetysz stóp (podofilia)',
        options: ['Fetysz bielizny', 'Fetysz stóp (podofilia)', 'Fetysz skóry', 'Fetysz mundurów'],
      },
      {
        text: 'Ile procent dorosłych regularnie używa aplikacji randkowych?',
        answer: 'Około 30% samotnych dorosłych i 10–15% wszystkich dorosłych',
        options: ['Poniżej 1%', 'Około 10% wszystkich dorosłych', 'Około 30% samotnych dorosłych i 10–15% wszystkich dorosłych', 'Ponad 80% dorosłych poniżej 40. roku życia'],
      },
      {
        text: 'Jaka jest najczęstszą przyczyną seks-terapii u par?',
        answer: 'Różnice w poziomie pożądania (desire discrepancy)',
        options: ['Zaburzenia erekcji', 'Niewiern ość', 'Różnice w poziomie pożądania (desire discrepancy)', 'Ból podczas stosunku'],
      },
      {
        text: 'Ile procent dorosłych kiedykolwiek korzystało z seks-linii telefonicznej lub czatu erotycznego?',
        answer: 'Około 15–20%',
        options: ['Poniżej 0,1%', 'Około 5%', 'Około 15–20%', 'Ponad 60%'],
      },
      {
        text: 'Ile dorosłych na świecie było kiedykolwiek klientem usług seksualnych (prostytucji)?',
        answer: 'Szacunkowo 15–20% mężczyzn (głównie mężczyźni – kobiety to znikomy procent)',
        options: ['Poniżej 0,1%', 'Około 5%', 'Szacunkowo 15–20% mężczyzn (głównie mężczyźni – kobiety to znikomy procent)', 'Ponad 60%'],
      },

      // ── SEKS A TECHNOLOGIA ───────────────────────────────────────────────────
      {
        text: 'Jak smartfony zmieniły nawyki seksualne?',
        answer: 'Ułatwiły dostęp do pornografii, randkowanie i komunikację seksualną (seksting)',
        options: ['Zmniejszyły aktywność seksualną – ludzie wolą ekrany', 'Ułatwiły dostęp do pornografii, randkowanie i komunikację seksualną (seksting)', 'Nie wpłynęły na zachowania seksualne', 'Zastąpiły kontakt fizyczny u większości osób'],
      },
      {
        text: 'Ile aplikacji randkowych jest aktualnie dostępnych na rynku globalnym?',
        answer: 'Ponad 1 500 różnych aplikacji randkowych',
        options: ['Kilka (Tinder, Bumble, Happn)', 'Około 50', 'Około 300', 'Ponad 1 500 różnych aplikacji randkowych'],
      },
      {
        text: 'Co to jest "sextortion" i ilu dotyczy?',
        answer: 'Szantaż seksualnymi zdjęciami/filmami – dotyka milionów ofiar rocznie na świecie',
        options: ['Termin marketingowy na sexy tortion w kręgosłupie', 'Szantaż seksualnymi zdjęciami/filmami – dotyka milionów ofiar rocznie na świecie', 'Legalna forma seksbiznesu', 'Zjawisko dotyczące wyłącznie celebrytek'],
      },

      // ── MAŁŻEŃSTWO I SEKS ────────────────────────────────────────────────────
      {
        text: 'Ile procent małżeństw jest ocenianych jako "seksualnie satysfakcjonujące" przez obie strony?',
        answer: 'Około 50–55% wg badań długoterminowych',
        options: ['Prawie wszystkie – ~95%', 'Około 75%', 'Około 50–55% wg badań długoterminowych', 'Mniej niż 10%'],
      },
      {
        text: 'Jak długość małżeństwa wpływa na częstotliwość seksu?',
        answer: 'Statystycznie maleje z każdym rokiem – o ok. 20% co dekadę',
        options: ['Rośnie – pary lepiej się poznają', 'Statystycznie maleje z każdym rokiem – o ok. 20% co dekadę', 'Pozostaje stała przez całe małżeństwo', 'Gwałtowny spadek tylko po urodzeniu dzieci, potem stała'],
      },
      {
        text: 'Ile procent małżeństw przeżywa po potwierdzeniu zdrady? (wg badań par)',
        answer: 'Około 20% udaje się utrzymać związek po zdradzie dłużej niż 5 lat',
        options: ['Prawie wszystkie – zdrada wzmacnia związek', 'Około 80%', 'Około 50%', 'Około 20% udaje się utrzymać związek po zdradzie dłużej niż 5 lat'],
      },
      {
        text: 'Ile procent par w Polsce decyduje się na separację lub rozwód?',
        answer: 'Około 30% małżeństw kończy się rozwodem (GUS 2022)',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30% małżeństw kończy się rozwodem (GUS 2022)', 'Ponad 70%'],
      },
      {
        text: 'Ile procent rozwodów jest pośrednio lub bezpośrednio związanych z problemami seksualnymi?',
        answer: 'Około 20–30% par wskazuje seks jako jeden z głównych powodów',
        options: ['Poniżej 1% – seks rzadko jest przyczyną rozstania', 'Około 20–30% par wskazuje seks jako jeden z głównych powodów', 'Ponad 80% – seks jest zawsze kluczowy', 'Dokładnie 50%'],
      },
      {
        text: 'W którym roku życia małżeńskiego najczęściej pojawia się "syndrom wypalenia seksualnego"?',
        answer: 'Najczęściej między 3. a 7. rokiem małżeństwa',
        options: ['W pierwszym roku', 'Najczęściej między 3. a 7. rokiem małżeństwa', 'Po 25 latach wspólnego życia', 'Wypalenie seksualne nie jest udowodnionym zjawiskiem'],
      },
      {
        text: 'Ile procent wdowców/wdów po 65. roku życia podejmuje nowe relacje seksualne?',
        answer: 'Około 25–35% – wbrew stereotypowi starości bez seksu',
        options: ['Prawie żaden – ~1%', 'Około 25–35% – wbrew stereotypowi starości bez seksu', 'Ponad 80%', 'Tylko mężczyźni, kobiety rzadko'],
      },

      // ── OSTATNIA SERIA CIEKAWOSTEK ───────────────────────────────────────────
      {
        text: 'Ile procent aktów seksualnych odbywa się spontanicznie (bez planowania)?',
        answer: 'Około 70–80% – spontaniczność dominuje szczególnie w nowych związkach',
        options: ['Prawie wszystkie – ~99%', 'Około 70–80% – spontaniczność dominuje szczególnie w nowych związkach', 'Mniej niż 10%', 'Równo 50/50'],
      },
      {
        text: 'Ile procent dorosłych nigdy nie rozmawiało ze swoimi rodzicami o seksie?',
        answer: 'Około 60–70%',
        options: ['Poniżej 5%', 'Około 25%', 'Około 60–70%', 'Prawie wszyscy – ~95%'],
      },
      {
        text: 'Ile procent kobiet przyznaje, że kiedykolwiek miała seks bez podekscytowania – wyłącznie z obowiązku?',
        answer: 'Około 50–60% (tzw. "obligatory sex")',
        options: ['Poniżej 1%', 'Około 10%', 'Około 50–60% (tzw. "obligatory sex")', 'Prawie wszystkie – ~90%'],
      },
      {
        text: 'Ile procent dorosłych uprawiało seks w sposób, którego potem żałowało?',
        answer: 'Około 55–65% (badania różnych grup demograficznych)',
        options: ['Poniżej 5%', 'Około 20%', 'Około 55–65% (badania różnych grup demograficznych)', 'Prawie wszyscy – ~99%'],
      },
      {
        text: 'Jak bardzo aktywność fizyczna wpływa na libido?',
        answer: 'Regularne ćwiczenia (3–5x tygodniowo) zwiększają libido o 30–60% w badaniach',
        options: ['Nie wpływa wcale', 'Ćwiczenia zmniejszają libido – ciało jest zmęczone', 'Regularne ćwiczenia (3–5x tygodniowo) zwiększają libido o 30–60% w badaniach', 'Wpływa tylko na mężczyzn'],
      },
      {
        text: 'Ile procent dorosłych regularnie rozmawia z lekarzem o swoim życiu seksualnym?',
        answer: 'Mniej niż 20% – pomimo że wiele problemów seksualnych ma podłoże medyczne',
        options: ['Prawie wszyscy – lekarz pyta o seks zawsze', 'Około 50%', 'Około 35%', 'Mniej niż 20% – pomimo że wiele problemów seksualnych ma podłoże medyczne'],
      },
      {
        text: 'Ile procent dorosłych kobiet przeżyło co najmniej jeden stosunek, który był dla nich bolesny?',
        answer: 'Około 75% kobiet doświadczyło bólu podczas seksu co najmniej raz',
        options: ['Poniżej 5%', 'Około 25%', 'Około 50%', 'Około 75% kobiet doświadczyło bólu podczas seksu co najmniej raz'],
      },
      {
        text: 'Ile procent kobiet cierpi na przewlekłą dyspareuniię (regularny ból podczas seksu)?',
        answer: 'Około 10–20%',
        options: ['Poniżej 0,5%', 'Około 2%', 'Około 10–20%', 'Ponad 50%'],
      },
      {
        text: 'Ile procent mężczyzn ma trudności z utrzymaniem erekcji co najmniej okazjonalnie?',
        answer: 'Około 52% mężczyzn powyżej 40. roku życia (Massachusetts Male Aging Study)',
        options: ['Poniżej 1%', 'Około 10%', 'Około 52% mężczyzn powyżej 40. roku życia (Massachusetts Male Aging Study)', 'Prawie wszyscy po 50. roku życia'],
      },
      {
        text: 'Jaka jest global średnia liczba stosunków seksualnych w ciągu całego aktywnego życia?',
        answer: 'Szacunkowo 5 000–6 000 stosunków',
        options: ['Około 100', 'Około 1 000', 'Szacunkowo 5 000–6 000 stosunków', 'Ponad 100 000'],
      },
      {
        text: 'Ile procent osób aktywnych seksualnie nigdy nie używało żadnej formy antykoncepcji?',
        answer: 'Około 15–20% globalnie (wyżej w krajach rozwijających się)',
        options: ['Poniżej 0,1%', 'Około 5%', 'Około 15–20% globalnie (wyżej w krajach rozwijających się)', 'Ponad 50%'],
      },
      {
        text: 'Ile procent kobiet po 60. roku życia jest wciąż aktywnych seksualnie?',
        answer: 'Około 50–65% w krajach zachodnich (wg badań AARP)',
        options: ['Poniżej 1%', 'Około 15%', 'Około 50–65% w krajach zachodnich (wg badań AARP)', 'Prawie wszystkie – ~95%'],
      },
      {
        text: 'Co statystyki pokazują o związku między szczęściem a aktywnością seksualną?',
        answer: 'Szczęśliwsi ludzie uprawiają więcej seksu – ale zależność działa w obu kierunkach',
        options: ['Tylko seks powoduje szczęście – nie odwrotnie', 'Brak związku – to dwa niezależne zjawiska', 'Szczęśliwsi ludzie uprawiają więcej seksu – ale zależność działa w obu kierunkach', 'Aktywność seksualna nie koreluje z żadnym miernikiem szczęścia'],
      },
      {
        text: 'Ile procent dorosłych mających problemy seksualne nigdy nie szuka pomocy specjalistycznej?',
        answer: 'Około 80–85% – duże tabu i wstyd przed wizytą u seksuologa',
        options: ['Poniżej 5% – prawie wszyscy szukają pomocy', 'Około 30%', 'Około 55%', 'Około 80–85% – duże tabu i wstyd przed wizytą u seksuologa'],
      },
      {
        text: 'Ile procent par przyznaje, że ich seks jest lepszy po kłótni (makeup sex)?',
        answer: 'Około 30–40% deklaruje intensywniejszy seks po konflikcie',
        options: ['Poniżej 1%', 'Około 10%', 'Około 30–40% deklaruje intensywniejszy seks po konflikcie', 'Ponad 90%'],
      },
      {
        text: 'Ile procent dorosłych uprawiało seks na pierwszej randce?',
        answer: 'Około 20–25%',
        options: ['Poniżej 1%', 'Około 10%', 'Około 20–25%', 'Ponad 70%'],
      },
      {
        text: 'Jaki jest wskaźnik satysfakcji seksualnej u par stosujących terapię seksualną?',
        answer: 'Poprawa u ok. 70–80% par po 10–15 sesjach terapeutycznych',
        options: ['Brak poprawy – terapia nie działa', 'Poprawa u ok. 10%', 'Poprawa u ok. 70–80% par po 10–15 sesjach terapeutycznych', 'Pogorszenie – terapia ujawnia głębsze problemy'],
      },
      {
        text: 'Ile procent dorosłych przyznaje, że oglądanie partnerki/partnera podczas seksu zwiększa ich satysfakcję?',
        answer: 'Około 65–70% (silny składnik wizualny u obu płci)',
        options: ['Poniżej 5%', 'Około 25%', 'Około 65–70% (silny składnik wizualny u obu płci)', 'Prawie wszyscy – ~99%'],
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
        answer: 'Bardzo słabo – współczynnik korelacji r ≈ 0,2 (praktycznie bez znaczenia)',
        options: ['Tak – wyscy mężczyźni mają zawsze większy penis', 'Bardzo słabo – współczynnik korelacji r ≈ 0,2 (praktycznie bez znaczenia)', 'Korelacja jest silna – r = 0,9', 'Niscy mężczyźni mają statystycznie większy penis'],
      },
      {
        text: 'Co to jest choroba Peyroniego?',
        answer: 'Skrzywienie penisa spowodowane bliznowaceniem tkanki (blaszka włóknista)',
        options: ['Stan zapalny napletka', 'Skrzywienie penisa spowodowane bliznowaceniem tkanki (blaszka włóknista)', 'Zbyt mały penis od urodzenia', 'Ból podczas erekcji bez zmian anatomicznych'],
      },
      {
        text: 'Jaki procent mężczyzn ma skrzywiony penis w erekcji?',
        answer: 'Lekkie skrzywienie do 30° jest normalne i dotyczy ok. 20–30% mężczyzn',
        options: ['Jest to rzadkość – poniżej 1%', 'Tylko mężczyźni z chorobą Peyroniego – ~5%', 'Lekkie skrzywienie do 30° jest normalne i dotyczy ok. 20–30% mężczyzn', 'Ponad 80% – każdy penis jest skrzywiony'],
      },
      {
        text: 'Co to jest wędzidełko prącia (frenulum) i dlaczego jest ważne?',
        answer: 'Wrażliwy fałd skóry pod żołędzią – jedno z najbardziej unerwionn miejsc na penisie',
        options: ['Kość penisa u człowieka', 'Wrażliwy fałd skóry pod żołędzią – jedno z najbardziej unerwionn miejsc na penisie', 'Więzadło łączące penis z moszną', 'Tkanka jamista penisa'],
      },
      {
        text: 'Ile zakończeń nerwowych szacunkowo zawiera napletek?',
        answer: 'Szacunkowo około 20 000',
        options: ['Kilkadziesiąt', 'Około 1 000', 'Szacunkowo około 20 000', 'Tyle samo co cały penis'],
      },
      {
        text: 'Co to jest stulejka (fimosis)?',
        answer: 'Zbyt ciasny napletek uniemożliwiający lub utrudniający odsłonięcie żołędzi',
        options: ['Stan zapalny żołędzi', 'Zbyt ciasny napletek uniemożliwiający lub utrudniający odsłonięcie żołędzi', 'Skrzywienie penisa', 'Brak wytrysku'],
      },

      // ── EREKCJA I ZABURZENIA ─────────────────────────────────────────────────
      {
        text: 'Ile razy przeciętny mężczyzna doświadcza nocnej erekcji (NPT) podczas snu?',
        answer: '3–5 razy na noc',
        options: ['Nigdy', 'Raz na noc', '3–5 razy na noc', 'Ponad 10 razy'],
      },
      {
        text: 'Co powoduje poranną erekcję?',
        answer: 'Fazy snu REM aktywujące autonomiczny układ nerwowy (NPT – nocturnal penile tumescence)',
        options: ['Wysoki poziom testosteronu rano', 'Pełny pęcherz moczowy uciskający nerwy', 'Fazy snu REM aktywujące autonomiczny układ nerwowy (NPT – nocturnal penile tumescence)', 'Kortyzol wydzielany rano'],
      },
      {
        text: 'Co to jest priapizm?',
        answer: 'Bolesna erekcja trwająca ponad 4 godziny – stan zagrożenia życia penisa',
        options: ['Lęk przed stosunkiem', 'Bolesna erekcja trwająca ponad 4 godziny – stan zagrożenia życia penisa', 'Zbyt szybki wytrysk', 'Brak popędu seksualnego'],
      },
      {
        text: 'Ile procent mężczyzn po 40. roku życia doświadcza zaburzeń erekcji (ED)?',
        answer: 'Około 52% mężczyzn po 40. (Massachusetts Male Aging Study)',
        options: ['Poniżej 1%', 'Około 10%', 'Około 52% mężczyzn po 40. (Massachusetts Male Aging Study)', 'Prawie wszyscy po 50. roku życia'],
      },
      {
        text: 'Jaka jest najczęstsza przyczyna zaburzeń erekcji u mężczyzn poniżej 40. roku życia?',
        answer: 'Psychologiczna – lęk, stres, depresja i performance anxiety',
        options: ['Niski testosteron', 'Choroby naczyń krwionośnych', 'Psychologiczna – lęk, stres, depresja i performance anxiety', 'Alergia na lateks'],
      },
      {
        text: 'Jak działa sildenafil (Viagra) na erekcję?',
        answer: 'Blokuje PDE-5, co zwiększa poziom cGMP i rozszerza naczynia ciał jamistych penisa',
        options: ['Podnosi poziom testosteronu', 'Blokuje PDE-5, co zwiększa poziom cGMP i rozszerza naczynia ciał jamistych penisa', 'Pobudza układ nerwowy jak kawa', 'Bezpośrednio stymuluje nerwowo erekcję'],
      },
      {
        text: 'Ile procent mężczyzn z ED nie zgłasza problemu lekarzowi?',
        answer: 'Ponad 70% – wstyd i tabu są ogromną barierą',
        options: ['Poniżej 5%', 'Około 30%', 'Ponad 70% – wstyd i tabu są ogromną barierą', 'Prawie nikt – mężczyźni zawsze szukają pomocy'],
      },
      {
        text: 'Jak alkohol wpływa na erekcję?',
        answer: 'Małe ilości mogą obniżyć zahamowania; duże blokują erekcję przez depresję OUN',
        options: ['Zawsze poprawia erekcję przez wzrost pewności siebie', 'Nie ma żadnego wpływu na erekcję', 'Małe ilości mogą obniżyć zahamowania; duże blokują erekcję przez depresję OUN', 'Alkohol jest najlepszym naturalnym afrodyzjakiem'],
      },
      {
        text: 'Co to jest "performance anxiety" i jak wpływa na mężczyzn?',
        answer: 'Lęk przed oceną seksualną – jeden z najczęstszych powodów ED i szybkiego wytrysku',
        options: ['Wzrost adrenaliny poprawiający erekcję', 'Lęk przed oceną seksualną – jeden z najczęstszych powodów ED i szybkiego wytrysku', 'Naturalne zmęczenie po stosunku', 'Stan po którym następuje wzmożona erekcja'],
      },
      {
        text: 'Czy erekcja możliwa jest po śmierci mężczyzny?',
        answer: 'Tak – "angel lust" to erekcja po śmierci spowodowana ciśnieniem krwi w pozycji leżącej',
        options: ['Nie – erekcja wymaga aktywnego układu nerwowego', 'Tak – "angel lust" to erekcja po śmierci spowodowana ciśnieniem krwi w pozycji leżącej', 'Tylko po straceniu (szubienica)', 'To mit niemający podstaw medycznych'],
      },
      {
        text: 'Ile procent mężczyzn jest obrze zanych na świecie?',
        answer: 'Około 37–38% mężczyzn globalnie',
        options: ['Około 5%', 'Około 20%', 'Około 37–38% mężczyzn globalnie', 'Ponad 80%'],
      },

      // ── WYTRYSK I ORGAZM ─────────────────────────────────────────────────────
      {
        text: 'Jak szybko przebiega wytrysk (prędkość nasienia)?',
        answer: 'Około 45 km/h przy wyrzucie',
        options: ['Około 2 km/h', 'Około 10 km/h', 'Około 45 km/h przy wyrzucie', 'Ponad 200 km/h'],
      },
      {
        text: 'Ile trwa orgazm u przeciętnego mężczyzny?',
        answer: '3–15 sekund',
        options: ['Mniej niż sekundę', '3–15 sekund', '30–45 sekund', 'Ponad minutę'],
      },
      {
        text: 'Co to jest "ejaculatory inevitability" – punkt bez powrotu?',
        answer: 'Moment, po którym mężczyzna nie może zatrzymać wytrysku – trwa ok. 1–2 sekundy',
        options: ['Chwila tuż po orgazmie', 'Moment, po którym mężczyzna nie może zatrzymać wytrysku – trwa ok. 1–2 sekundy', 'Stan pełnej erekcji bez możliwości jej cofnięcia', 'Drugi orgazm z rzędu'],
      },
      {
        text: 'Ile procent mężczyzn doświadcza przedwczesnego wytrysku? (ISSM)',
        answer: 'Około 20–30%',
        options: ['Około 2%', 'Około 10%', 'Około 20–30%', 'Ponad 60%'],
      },
      {
        text: 'Co to jest opóźniony wytrysk (delayed ejaculation)?',
        answer: 'Trudność lub niemożność osiągnięcia wytrysku mimo wystarczającej stymulacji',
        options: ['Wytrysk po 30 minutach – norma u starszych mężczyzn', 'Trudność lub niemożność osiągnięcia wytrysku mimo wystarczającej stymulacji', 'Wytrysk w kilka sekund po penetracji', 'Wytrysk dwuetapowy – zjawisko normalne'],
      },
      {
        text: 'Co to jest wytrysk wsteczny (retrograde ejaculation)?',
        answer: 'Nasienie cofa się do pęcherza zamiast wychodzić – suchy orgazm',
        options: ['Wytrysk bez uczucia orgazmu', 'Nasienie cofa się do pęcherza zamiast wychodzić – suchy orgazm', 'Brak nasienia przy wytrysku (azoospermia)', 'Podwójny wytrysk podczas jednego orgazmu'],
      },
      {
        text: 'Ile ejakulacji miesięcznie u mężczyzn koreluje z niższym ryzykiem raka prostaty? (Giovannucci 2004)',
        answer: '21 lub więcej ejakulacji miesięcznie',
        options: ['1–2 miesięcznie', '5–7 miesięcznie', '21 lub więcej ejakulacji miesięcznie', 'Celibat – brak ejakulacji chroni prostatę'],
      },
      {
        text: 'Czy mężczyźni mogą osiągać orgazm wielokrotny?',
        answer: 'Tak – stosując techniki non-ejaculatory orgasm (zatrzymanie nasienia)',
        options: ['Nie – biologicznie niemożliwe u mężczyzn', 'Tak – stosując techniki non-ejaculatory orgasm (zatrzymanie nasienia)', 'Tak, ale tylko mężczyźni poniżej 25. roku życia', 'Tylko po kastracji chemicznej'],
      },
      {
        text: 'Co to jest orgazm mężczyzny z prostaty ("P-spot orgasm")?',
        answer: 'Orgazm przez stymulację gruczołu krokowego przez odbyt – opisywany jako bardzo intensywny',
        options: ['Mit niemający podstaw anatomicznych', 'Orgazm przez stymulację gruczołu krokowego przez odbyt – opisywany jako bardzo intensywny', 'Orgazm wyłącznie przy impotencji', 'Orgazm wywołany myślami bez stymulacji'],
      },
      {
        text: 'Jak mężczyźni opisują uczucie podczas orgazmu neurologicznie?',
        answer: 'Aktywacja tych samych obszarów nagrody co heroina – nucleus accumbens zalewa dopamina',
        options: ['Łagodna przyjemność podobna do drapania po plecach', 'Aktywacja tych samych obszarów nagrody co heroina – nucleus accumbens zalewa dopamina', 'Głównie ulga napięcia bez wyraźnej przyjemności', 'Uczucie bólu przechodzącego w ulgę'],
      },

      // ── REFRAKCJA I LIBIDO ───────────────────────────────────────────────────
      {
        text: 'Ile wynosi typowy okres refrakcji (czas do kolejnej erekcji) u młodego mężczyzny?',
        answer: '15–30 minut',
        options: ['30 sekund', '5 minut', '15–30 minut', 'Ponad 12 godzin'],
      },
      {
        text: 'Ile wynosi okres refrakcji u mężczyzny po 50. roku życia?',
        answer: 'Od kilku godzin do doby – znacząco wzrasta z wiekiem',
        options: ['Identyczny jak u 20-latka – 15 min', 'Od kilku godzin do doby – znacząco wzrasta z wiekiem', 'Kilka sekund', 'Mężczyźni po 50. nie mają refrakcji'],
      },
      {
        text: 'Co powoduje uczucie senności i znużenia po orgazmie u mężczyzn?',
        answer: 'Spike prolaktyny i oksytocyny po wytrysku – działają uspakajająco jak morfina',
        options: ['Utrata energii z powodu wysiłku fizycznego', 'Spike prolaktyny i oksytocyny po wytrysku – działają uspakajająco jak morfina', 'Krew odpływa z mózgu do ciał jamistych', 'To mit – mężczyźni nie są bardziej senni po seksie'],
      },
      {
        text: 'Ile razy dziennie przeciętny mężczyzna myśli o seksie? (Fisher et al. 2011)',
        answer: 'Około 19 razy dziennie – nie co 7 sekund (to mit)',
        options: ['Raz na godzinę – ~16 razy', 'Około 19 razy dziennie – nie co 7 sekund (to mit)', 'Co 7 sekund (ok. 8 000 razy)', 'Ponad 200 razy'],
      },
      {
        text: 'Jak się nazywa zjawisko odnowionego podniecenia seksualnego przy nowym partnerze?',
        answer: 'Efekt Coolidge\'a',
        options: ['Syndrom Don Juana', 'Efekt Coolidge\'a', 'Efekt halo', 'Prawo Yerkesa-Dodsona'],
      },
      {
        text: 'Jak poziom testosteronu zmienia się przez dobę?',
        answer: 'Szczyt rano (6:00–8:00), minimum wieczorem – dlatego poranna erekcja i poranny seks',
        options: ['Jest stały przez całą dobę', 'Szczyt rano (6:00–8:00), minimum wieczorem – dlatego poranna erekcja i poranny seks', 'Szczyt o północy', 'Testosteron wzrasta wyłącznie podczas seksu'],
      },
      {
        text: 'Jak dieta wpływa na libido mężczyzny?',
        answer: 'Dieta bogata w cynk, witaminę D i zdrowe tłuszcze wspiera produkcję testosteronu',
        options: ['Dieta nie ma żadnego wpływu na libido', 'Wyłącznie kaloryczność posiłków decyduje o libido', 'Dieta bogata w cynk, witaminę D i zdrowe tłuszcze wspiera produkcję testosteronu', 'Wegetarianizm zawsze obniża libido mężczyzn'],
      },

      // ── TESTOSTERON I HORMONY ─────────────────────────────────────────────────
      {
        text: 'Który gruczoł produkuje ok. 95% testosteronu u mężczyzny?',
        answer: 'Jądra (komórki Leydiga)',
        options: ['Nadnercza', 'Przysadka mózgowa', 'Jądra (komórki Leydiga)', 'Prostata'],
      },
      {
        text: 'O ile procent rocznie spada testosteron po 30. roku życia?',
        answer: 'Około 1% rocznie – stopniowy, wieloletni proces',
        options: ['Nie spada wcale do menopauzy', 'Około 0,1% rocznie', 'Około 1% rocznie – stopniowy, wieloletni proces', 'Ponad 10% rocznie'],
      },
      {
        text: 'Co to jest andropauza?',
        answer: 'Stopniowy, wieloletni spadek testosteronu u mężczyzn po 40–50. roku życia',
        options: ['Nagłe zatrzymanie produkcji testosteronu jak menopauza', 'Stopniowy, wieloletni spadek testosteronu u mężczyzn po 40–50. roku życia', 'Stan po kastracji chirurgicznej', 'Chorobowy niedobór testosteronu od urodzenia'],
      },
      {
        text: 'Jak trening siłowy wpływa na testosteron?',
        answer: 'Krótkoterminowo podnosi – zwłaszcza ćwiczenia wielostawowe (martwy ciąg, przysiady)',
        options: ['Drastycznie obniża po każdym treningu', 'Krótkoterminowo podnosi – zwłaszcza ćwiczenia wielostawowe (martwy ciąg, przysiady)', 'Nie wpływa na testosteron', 'Podnosi testosteron tylko u kobiet'],
      },
      {
        text: 'Jak stres wpływa na testosteron?',
        answer: 'Kortyzol antagonizuje testosteron – przewlekły stres znacząco go obniża',
        options: ['Stres podnosi testosteron przez adrenalinę', 'Stres nie wpływa na testosteron', 'Kortyzol antagonizuje testosteron – przewlekły stres znacząco go obniża', 'Stres wpływa tylko na estrogeny'],
      },
      {
        text: 'Jaki poziom testosteronu uważa się za normy u dorosłego mężczyzny?',
        answer: '300–1 000 ng/dl – normy laboratoryjne różnią się wg źródeł',
        options: ['50–100 ng/dl', '150–200 ng/dl', '300–1 000 ng/dl – normy laboratoryjne różnią się wg źródeł', 'Ponad 5 000 ng/dl'],
      },
      {
        text: 'Co to jest hipogonadyzm u mężczyzny?',
        answer: 'Niedobór produkcji testosteronu przez jądra – powoduje ED, zmęczenie i utratę libido',
        options: ['Przerost jąder', 'Niedobór produkcji testosteronu przez jądra – powoduje ED, zmęczenie i utratę libido', 'Stan po wazektomii', 'Zapalenie gruczołu krokowego'],
      },
      {
        text: 'Co to jest ginekomastia?',
        answer: 'Powiększenie tkanki gruczołowej piersi u mężczyzn – często przez zaburzenie hormonalne lub leki',
        options: ['Rak piersi u mężczyzn', 'Powiększenie tkanki gruczołowej piersi u mężczyzn – często przez zaburzenie hormonalne lub leki', 'Nadmierne owłosienie klatki piersiowej', 'Brak owłosienia klatki piersiowej'],
      },
      {
        text: 'Jak alkohol przewlekle wpływa na testosteron?',
        answer: 'Obniża poziom testosteronu i może powodować atrofię jąder przy długotrwałym nadużywaniu',
        options: ['Podnosi testosteron – stąd agresja po alkoholu', 'Nie ma wpływu na hormony mężczyzny', 'Obniża poziom testosteronu i może powodować atrofię jąder przy długotrwałym nadużywaniu', 'Tylko piwo, nie wódka, obniża testosteron'],
      },
      {
        text: 'Co to są sterydy anaboliczne i jak wpływają na jądra?',
        answer: 'Syntetyczny testosteron – powoduje zanik jąder i azoospermię przez sprzężenie zwrotne',
        options: ['Naturalne suplementy wzmacniające jądra', 'Syntetyczny testosteron – powoduje zanik jąder i azoospermię przez sprzężenie zwrotne', 'Leki na zaburzenia erekcji', 'Witaminy stosowane przez sportowców'],
      },

      // ── SPERMA I PŁODNOŚĆ ────────────────────────────────────────────────────
      {
        text: 'Ile plemników produkuje zdrowy mężczyzna każdego dnia?',
        answer: 'Około 300 milionów dziennie (~1 500/sekundę)',
        options: ['Kilka tysięcy', 'Kilka milionów', 'Około 300 milionów dziennie (~1 500/sekundę)', 'Kilka miliardów'],
      },
      {
        text: 'Ile trwa spermatogeneza – od komórki macierzystej do dojrzałego plemnika?',
        answer: '64–74 dni',
        options: ['7–10 dni', '24–30 dni', '64–74 dni', 'Ponad 6 miesięcy'],
      },
      {
        text: 'Ile ml nasienia zawiera typowy ejakulat?',
        answer: '3–5 ml (wg WHO Reference Values)',
        options: ['0,5 ml', '1–2 ml', '3–5 ml (wg WHO Reference Values)', 'Ponad 20 ml'],
      },
      {
        text: 'Jak długo plemniki przeżywają w kobiecych drogach rodnych?',
        answer: 'Do 5 dni – najdłużej w śluzie szyjkowym przy owulacji',
        options: ['Kilka minut', 'Kilka godzin', 'Do 5 dni – najdłużej w śluzie szyjkowym przy owulacji', 'Do 3 tygodni'],
      },
      {
        text: 'Co niszczy jakość nasienia?',
        answer: 'Ciepło, palenie tytoniu, alkohol, stres, sterydy anaboliczne i promieniowanie',
        options: ['Ćwiczenia fizyczne i dieta roślinna', 'Ciepło, palenie tytoniu, alkohol, stres, sterydy anaboliczne i promieniowanie', 'Seks zbyt częsty – "wyczerpanie" zapasów', 'Tylko czynniki genetyczne'],
      },
      {
        text: 'Dlaczego noszenie obcisłych slipów może wpływać na jakość nasienia?',
        answer: 'Zbyt wysoka temperatura moszny (powyżej 34–35°C) zaburza spermatogenezę',
        options: ['Ucisk mechaniczny niszczy plemnikiw nadjądrzu', 'Zbyt wysoka temperatura moszny (powyżej 34–35°C) zaburza spermatogenezę', 'Obcisła bielizna obniża testosteron', 'To wyłącznie mit bez podstaw naukowych'],
      },
      {
        text: 'Co to jest azoospermia?',
        answer: 'Całkowity brak plemników w nasieniu – dotyczy ok. 1% mężczyzn',
        options: ['Zbyt mała objętość ejakulatu', 'Całkowity brak plemników w nasieniu – dotyczy ok. 1% mężczyzn', 'Niska ruchliwość plemników', 'Zdeformowane plemniki'],
      },
      {
        text: 'Ile procent niepłodności u par wynika z czynnika wyłącznie męskiego?',
        answer: 'Około 40% – mężczyzna jest przyczyną u niemal połowy niepłodnych par',
        options: ['Poniżej 5% – niepłodność to problem kobiecy', 'Około 15%', 'Około 40% – mężczyzna jest przyczyną u niemal połowy niepłodnych par', 'Ponad 80%'],
      },
      {
        text: 'Jak praca siedząca długotrwale wpływa na jakość nasienia?',
        answer: 'Może podnosić temperaturę moszny i obniżać jakość nasienia przy wielogodzinnym siedzeniu',
        options: ['Poprawia jakość nasienia przez brak wysiłku fizycznego', 'Może podnosić temperaturę moszny i obniżać jakość nasienia przy wielogodzinnym siedzeniu', 'Nie ma żadnego wpływu na nasienie', 'Wyłącznie jazda na rowerze szkodzi nasieniu'],
      },
      {
        text: 'Jaka dieta wspiera jakość nasienia i płodność mężczyzny?',
        answer: 'Śródziemnomorska – bogata w antyoksydanty, cynk, selen, kwasy omega-3',
        options: ['Dieta wysokobiałkowa z dużą ilością mięsa czerwonego', 'Śródziemnomorska – bogata w antyoksydanty, cynk, selen, kwasy omega-3', 'Dieta ketogeniczna eliminująca węglowodany', 'Suplementacja wyłącznie witaminą C'],
      },

      // ── PROSTATA I JĄDRA ─────────────────────────────────────────────────────
      {
        text: 'Gdzie dokładnie znajduje się gruczoł krokowy (prostata)?',
        answer: 'Pod pęcherzem moczowym, otaczając cewkę moczową',
        options: ['Między jądrami a cewką', 'Pod pęcherzem moczowym, otaczając cewkę moczową', 'Za odbytnicą, poza miednicą', 'Wewnątrz moszny, powyżej jąder'],
      },
      {
        text: 'Jaki rozmiar ma zdrowa prostata?',
        answer: 'Orzech włoski – około 20 g, 3×4 cm',
        options: ['Ziarno grochu', 'Orzech włoski – około 20 g, 3×4 cm', 'Jajko kurze', 'Piłka tenisowa'],
      },
      {
        text: 'Co to jest PSA i do czego służy?',
        answer: 'Antygen specyficzny dla prostaty – marker używany w diagnostyce raka gruczołu krokowego',
        options: ['Białko w nasieniu odpowiedzialne za ruchliwość plemników', 'Antygen specyficzny dla prostaty – marker używany w diagnostyce raka gruczołu krokowego', 'Hormon regulujący spermatogenezę', 'Enzym rozkładający ściankę komórki jajowej'],
      },
      {
        text: 'Ile procent mężczyzn po 80. roku życia ma komórki raka prostaty (mikrofokalne)?',
        answer: 'Około 70–80% – ale większość nigdy nie spowoduje objawów',
        options: ['Poniżej 1%', 'Około 10%', 'Około 40%', 'Około 70–80% – ale większość nigdy nie spowoduje objawów'],
      },
      {
        text: 'Co to jest BPH (łagodny przerost prostaty)?',
        answer: 'Niezłośliwe powiększenie gruczołu krokowego utrudniające oddawanie moczu – dotyka ~50% mężczyzn po 50.',
        options: ['Rak prostaty we wczesnym stadium', 'Niezłośliwe powiększenie gruczołu krokowego utrudniające oddawanie moczu – dotyka ~50% mężczyzn po 50.', 'Zapalenie gruczołu krokowego (prostatitis)', 'Kamica gruczołu krokowego'],
      },
      {
        text: 'W jakim przedziale wiekowym najczęściej pojawia się rak jąder?',
        answer: '15–35 lat – najczęstszy nowotwór złośliwy u młodych mężczyzn',
        options: ['0–5 lat (noworodki)', '15–35 lat – najczęstszy nowotwór złośliwy u młodych mężczyzn', '50–65 lat', 'Powyżej 70. roku życia'],
      },
      {
        text: 'Dlaczego lewe jądro zwisa zazwyczaj niżej niż prawe?',
        answer: 'Żyła nasienna lewa uchodzi do żyły nerkowej pod kątem prostym – dłuższy spływ krwi',
        options: ['Lewe jądro jest cięższe u większości mężczyzn', 'Żyła nasienna lewa uchodzi do żyły nerkowej pod kątem prostym – dłuższy spływ krwi', 'Moszna jest asymetrycznie zbudowana u wszystkich', 'To mit – jądra są zawsze symetrycznie'],
      },
      {
        text: 'Co to są żylaki powrózka nasiennego (varicocele)?',
        answer: 'Poszerzenie żył jądra – najczęstsza odwracalna przyczyna niepłodności męskiej',
        options: ['Zapalenie najądrza', 'Poszerzenie żył jądra – najczęstsza odwracalna przyczyna niepłodności męskiej', 'Torbiel jądra', 'Skręt jądra'],
      },
      {
        text: 'Jak długi jest najądrze, jeśli się go rozwinąć?',
        answer: 'Około 6 metrów – tu dojrzewają plemniki przez 2–3 tygodnie',
        options: ['Około 10 cm', 'Około 1 metra', 'Około 6 metrów – tu dojrzewają plemniki przez 2–3 tygodnie', 'Ponad 50 metrów'],
      },
      {
        text: 'Co to jest skręt jądra i dlaczego jest nagły?',
        answer: 'Skręcenie powrózka nasiennego odcinające dopływ krwi – stan pilny, okno 4–6h na ratowanie jądra',
        options: ['Łagodny ból po wysiłku fizycznym', 'Zapalenie najądrza', 'Skręcenie powrózka nasiennego odcinające dopływ krwi – stan pilny, okno 4–6h na ratowanie jądra', 'Normalny objaw dojrzewania u nastolatków'],
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
        answer: 'Około 41% mężczyzn przynajmniej raz – rzadziej niż kobiety, ale znaczący odsetek',
        options: ['Poniżej 1% – to wyłącznie kobiece zjawisko', 'Około 10%', 'Około 41% mężczyzn przynajmniej raz – rzadziej niż kobiety, ale znaczący odsetek', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Co to jest "Madonna-Whore Complex"?',
        answer: 'Psychologiczne rozdzielenie kobiet na "dobre" (do związku) i "złe" (do seksu) – opisany przez Freuda',
        options: ['Kompleks Edypa u dorosłych mężczyzn', 'Psychologiczne rozdzielenie kobiet na "dobre" (do związku) i "złe" (do seksu) – opisany przez Freuda', 'Fetysz na muzykę i seksualność', 'Zaburzenie erekcji u mężczyzn pobożnych'],
      },
      {
        text: 'Ile procent mężczyzn doświadczyło przemocy seksualnej?',
        answer: 'Szacunkowo 10–15% – mocno zaniżone z powodu tabu i wstydu',
        options: ['Poniżej 0,1%', 'Około 2%', 'Szacunkowo 10–15% – mocno zaniżone z powodu tabu i wstydu', 'Tyle samo co kobiety – ~27%'],
      },
      {
        text: 'Jak mężczyźni reagują biologicznie na widok atrakcyjnej kobiety?',
        answer: 'Krótkoterminowy wzrost testosteronu i aktywacja układu nagrody (dopamina)',
        options: ['Wyłącznie psychologiczna reakcja bez zmian hormonalnych', 'Krótkoterminowy wzrost testosteronu i aktywacja układu nagrody (dopamina)', 'Wzrost kortyzolu przez ekscytację', 'Brak żadnych biologicznych zmian'],
      },
      {
        text: 'Co mówią badania o mężczyznach i zakochaniu?',
        answer: 'Mężczyźni zakochują się szybciej (statystycznie) i mówią "kocham cię" jako pierwsi częściej niż kobiety',
        options: ['Mężczyźni nigdy się nie zakochują – to wyłącznie kobiecy fenomen', 'Kobiety zawsze zakochują się szybciej i mówią "kocham cię" pierwsze', 'Mężczyźni zakochują się szybciej (statystycznie) i mówią "kocham cię" jako pierwsi częściej niż kobiety', 'Zakochiwanie przebiega identycznie u obu płci'],
      },
      {
        text: 'Ile procent mężczyzn zgłasza problemy seksualne lekarzowi?',
        answer: 'Mniej niż 25% – tabu i wstyd są ogromną barierą',
        options: ['Prawie wszyscy – zdrowie seksualne jest priorytetem mężczyzn', 'Około 60%', 'Mniej niż 25% – tabu i wstyd są ogromną barierą', 'Tylko mężczyźni powyżej 60. roku życia szukają pomocy'],
      },

      // ── MĘŻCZYŹNI W ZWIĄZKACH ────────────────────────────────────────────────
      {
        text: 'Jak mężczyźni przeżywają rozstanie w porównaniu z kobietami?',
        answer: 'Gorzej długoterminowo – kobiety lepiej przetwarzają emocje; mężczyźni tłumią i odkładają ból',
        options: ['Mężczyźni prawie wcale nie przeżywają rozstania', 'Identycznie jak kobiety – brak różnic', 'Gorzej długoterminowo – kobiety lepiej przetwarzają emocje; mężczyźni tłumią i odkładają ból', 'Mężczyźni szybciej wchodzą w nowe związki bo szybciej "zapominają"'],
      },
      {
        text: 'Ile procent mężczyzn zdradza w stałym związku?',
        answer: 'Szacunkowo 15–25% – podobnie jak kobiety (różnica jest mniejsza niż stereotypy wskazują)',
        options: ['Ponad 80%', 'Około 50%', 'Szacunkowo 15–25% – podobnie jak kobiety (różnica jest mniejsza niż stereotypy wskazują)', 'Poniżej 1%'],
      },
      {
        text: 'Co jest najczęstszą przyczyną niesatysfakcji seksualnej u mężczyzn w związkach?',
        answer: 'Zbyt rzadki seks i poczucie odrzucenia przez partnerkę',
        options: ['Brak orgazmu podczas stosunku', 'Zbyt rzadki seks i poczucie odrzucenia przez partnerkę', 'Zbyt monotonne pozycje seksualne', 'Brak atrakcyjności partnerki'],
      },
      {
        text: 'Jak ojcostwo wpływa na testosteron mężczyzny?',
        answer: 'Ojcowie mają statystycznie niższy testosteron niż bezdzietni mężczyźni – ewolucyjne przystosowanie',
        options: ['Ojcostwo podnosi testosteron przez większą odpowiedzialność', 'Ojcostwo nie wpływa na testosteron', 'Ojcowie mają statystycznie niższy testosteron niż bezdzietni mężczyźni – ewolucyjne przystosowanie', 'Testosteron rośnie przy pierwszym dziecku, potem spada'],
      },
      {
        text: 'Jak małżeństwo wpływa na poziom testosteronu mężczyzny?',
        answer: 'Żonaci mężczyźni mają statystycznie niższy testosteron niż kawalerowie – wg badań endokrynologicznych',
        options: ['Małżeństwo podnosi testosteron', 'Nie ma żadnego wpływu', 'Żonaci mężczyźni mają statystycznie niższy testosteron niż kawalerowie – wg badań endokrynologicznych', 'Testosteron rośnie w pierwszym roku małżeństwa, potem spada'],
      },
      {
        text: 'Ile procent mężczyzn inicjuje seks w swoich związkach?',
        answer: 'Około 60–70% – mężczyźni inicjują częściej, ale różnica maleje w nowoczesnych związkach',
        options: ['Prawie 100% – kobiety nigdy nie inicjują', 'Około 60–70% – mężczyźni inicjują częściej, ale różnica maleje w nowoczesnych związkach', 'Równo 50% – inicjatywa jest symetryczna', 'Kobiety inicjują seks częściej niż mężczyźni'],
      },

      // ── ZDROWIE SEKSUALNE MĘŻCZYZN ───────────────────────────────────────────
      {
        text: 'Jak regularna aktywność seksualna wpływa na zdrowie prostaty?',
        answer: '21+ ejakulacji miesięcznie koreluje z niższym ryzykiem raka prostaty (Giovannucci 2004)',
        options: ['Aktywność seksualna niszczy prostatę', 'Nie ma żadnego wpływu', '21+ ejakulacji miesięcznie koreluje z niższym ryzykiem raka prostaty (Giovannucci 2004)', 'Abstynencja chroni prostatę najlepiej'],
      },
      {
        text: 'Jak seks wpływa na układ sercowo-naczyniowy mężczyzny?',
        answer: 'Seks 2× tygodniowo zmniejsza ryzyko zawału serca wg American Journal of Cardiology',
        options: ['Seks obciąża serce i zwiększa ryzyko zawału', 'Nie ma wpływu na układ sercowo-naczyniowy', 'Seks 2× tygodniowo zmniejsza ryzyko zawału serca wg American Journal of Cardiology', 'Seks wpływa tylko na serce kobiet, nie mężczyzn'],
      },
      {
        text: 'Jak zaburzenia erekcji mogą być wczesnym sygnałem innych chorób?',
        answer: 'ED jest często pierwszym objawem chorób sercowo-naczyniowych, cukrzycy lub nadciśnienia',
        options: ['ED jest wyłącznie problemem psychologicznym', 'ED nie ma związku z innymi chorobami', 'ED jest często pierwszym objawem chorób sercowo-naczyniowych, cukrzycy lub nadciśnienia', 'ED sygnalizuje wyłącznie niedobór cynku'],
      },
      {
        text: 'Ile procent mężczyzn regularnie bada swoje jądra samodzielnie?',
        answer: 'Mniej niż 25% – choć samobadanie może wykryć raka jądra we wczesnym stadium',
        options: ['Prawie wszyscy – ~90%', 'Około 50%', 'Mniej niż 25% – choć samobadanie może wykryć raka jądra we wczesnym stadium', 'Samobadanie jąder nie jest zalecane'],
      },
      {
        text: 'Ile procent mężczyzn pali tytoń i jak to wpływa na seksualność?',
        answer: 'Palacze mają o 40–50% wyższe ryzyko ED – nikotyna niszczy śródbłonek naczyń ciał jamistych',
        options: ['Palenie nie wpływa na seksualność mężczyzn', 'Palacze mają lepsze erekcje przez wzrost adrenaliny', 'Palacze mają o 40–50% wyższe ryzyko ED – nikotyna niszczy śródbłonek naczyń ciał jamistych', 'Palenie wpływa wyłącznie na nasienie, nie erekcję'],
      },
      {
        text: 'Co to jest zapalenie gruczołu krokowego (prostatitis) i jak często dotyka mężczyzn?',
        answer: 'Ból i zapalenie prostaty – dotyka ok. 50% mężczyzn w jakimś momencie życia',
        options: ['Rak prostaty', 'Ból i zapalenie prostaty – dotyka ok. 50% mężczyzn w jakimś momencie życia', 'Jedynie mężczyźni po 70. roku życia mogą mieć zapalenie prostaty', 'Rzadka choroba – poniżej 1% mężczyzn'],
      },

      // ── MĘŻCZYŹNI I PORNOGRAFIA ──────────────────────────────────────────────
      {
        text: 'Ile procent mężczyzn regularnie ogląda pornografię?',
        answer: 'Około 70–75%',
        options: ['Około 10%', 'Około 40%', 'Około 70–75%', 'Prawie 100%'],
      },
      {
        text: 'Jak regularne oglądanie pornografii wpływa na mózg mężczyzny?',
        answer: 'Desensytyzacja układu nagrody – konieczność silniejszych bodźców dla tych samych odczuć',
        options: ['Poprawia sprawność mózgu przez ciągłą stymulację', 'Desensytyzacja układu nagrody – konieczność silniejszych bodźców dla tych samych odczuć', 'Brak wpływu na mózg – to tylko rozrywka', 'Pornografia zwiększa empatię przez obserwację emocji'],
      },
      {
        text: 'Co to jest PIED (Porn-Induced Erectile Dysfunction)?',
        answer: 'Zaburzenia erekcji spowodowane uzależnieniem od pornografii – penis reaguje na ekran, nie na partnerkę',
        options: ['Erekcja wywołana myśleniem o pornografii', 'Zaburzenia erekcji spowodowane uzależnieniem od pornografii – penis reaguje na ekran, nie na partnerkę', 'Stan po obejrzeniu zbyt dużo pornografii jednorazowo', 'Normalna adaptacja układu nerwowego do podniet'],
      },
      {
        text: 'Ile procent mężczyzn uważa się za uzależnionych od pornografii?',
        answer: 'Około 8–10% regularnych użytkowników deklaruje utratę kontroli',
        options: ['Poniżej 0,1%', 'Około 2%', 'Około 8–10% regularnych użytkowników deklaruje utratę kontroli', 'Ponad 50%'],
      },
      {
        text: 'W jakim wieku mężczyźni najczęściej po raz pierwszy oglądają pornografię?',
        answer: 'Między 11 a 13 rokiem życia (Internet umożliwił znacznie wcześniejszy dostęp)',
        options: ['Po 18. roku życia', 'Między 15 a 17 rokiem życia', 'Między 11 a 13 rokiem życia (Internet umożliwił znacznie wcześniejszy dostęp)', 'Dopiero w dorosłości po 20. roku życia'],
      },

      // ── MĘŻCZYŹNI W LICZBACH – CIEKAWOSTKI ──────────────────────────────────
      {
        text: 'Ile razy przeciętny mężczyzna uprawia seks w ciągu życia?',
        answer: 'Szacunkowo 5 000–6 000 razy',
        options: ['Około 100 razy', 'Około 1 000 razy', 'Szacunkowo 5 000–6 000 razy', 'Ponad 100 000 razy'],
      },
      {
        text: 'Ile czasu w ciągu życia przeciętny mężczyzna spędza na seksie?',
        answer: 'Szacunkowo ok. 1% aktywnego życia – to równowartość kilku miesięcy',
        options: ['Ponad 10% życia', 'Około 5% życia', 'Szacunkowo ok. 1% aktywnego życia – to równowartość kilku miesięcy', 'Mniej niż godzina łącznie'],
      },
      {
        text: 'Co to jest wazektomia i jak skuteczna jest jako metoda antykoncepcji?',
        answer: 'Przecięcie lub podwiązanie nasieniowodów – skuteczność ponad 99,9%',
        options: ['Chemiczne blokowanie testosteronu', 'Usunięcie jąder', 'Przecięcie lub podwiązanie nasieniowodów – skuteczność ponad 99,9%', 'Zastrzyk hormonalny podawany co miesiąc'],
      },
      {
        text: 'Ile procent mężczyzn decyduje się na wazektomię w Polsce?',
        answer: 'Bardzo mało – poniżej 1% (w USA ok. 10%, w Holandii ok. 11%)',
        options: ['Prawie wszyscy mężczyźni po 40. roku życia', 'Około 30%', 'Około 10% – jak w USA', 'Bardzo mało – poniżej 1% (w USA ok. 10%, w Holandii ok. 11%)'],
      },
      {
        text: 'Które zwierzę domowe jest najczęściej kojarzone z obniżonym testosteronem u właściciela?',
        answer: 'Żadne – to mit; opieka nad zwierzęciem może obniżać stres, co pośrednio wspiera testosteron',
        options: ['Kot – felinofilia obniża testosteron', 'Pies – właściciele psów mają niższy testosteron', 'Żadne – to mit; opieka nad zwierzęciem może obniżać stres, co pośrednio wspiera testosteron', 'Chomik – udowodniono laboratoryjnie'],
      },
      {
        text: 'Co to jest "Movember" i czego dotyczy?',
        answer: 'Listopadowa kampania na rzecz zdrowia mężczyzn – raka prostaty, jąder i zdrowia psychicznego',
        options: ['Kampania promująca brody u mężczyzn', 'Miesiąc walki z otyłością u mężczyzn', 'Listopadowa kampania na rzecz zdrowia mężczyzn – raka prostaty, jąder i zdrowia psychicznego', 'Akcja promująca mężczyzn w kuchni'],
      },

      // ── MĘŻCZYŹNI I STAROŚĆ ──────────────────────────────────────────────────
      {
        text: 'Ile procent mężczyzn po 70. roku życia doświadcza zaburzeń erekcji?',
        answer: 'Około 70%',
        options: ['Poniżej 5%', 'Około 30%', 'Około 70%', 'Prawie wszyscy – ~99%'],
      },
      {
        text: 'Ile procent mężczyzn po 70. roku życia jest aktywnych seksualnie?',
        answer: 'Około 40–50% – aktywność seksualna nie kończy się na emeryturze',
        options: ['Poniżej 1%', 'Około 10%', 'Około 40–50% – aktywność seksualna nie kończy się na emeryturze', 'Prawie wszyscy – ~90%'],
      },
      {
        text: 'Jak zmienia się orgazm mężczyzny z wiekiem?',
        answer: 'Mniej intensywny, wolniejszy, okres refrakcji znacznie dłuższy – ale wciąż możliwy',
        options: ['Orgazm staje się silniejszy z doświadczeniem', 'Orgazm całkowicie zanika po 60. roku życia', 'Mniej intensywny, wolniejszy, okres refrakcji znacznie dłuższy – ale wciąż możliwy', 'Wiek nie wpływa na orgazm mężczyzny'],
      },
      {
        text: 'Jak testosterone replacement therapy (TRT) wpływa na mężczyzn po andropauzie?',
        answer: 'Poprawia libido, energię i erekcję, ale wymaga monitorowania PSA i krwi',
        options: ['Całkowicie eliminuje starzenie się seksualne', 'Poprawia libido, energię i erekcję, ale wymaga monitorowania PSA i krwi', 'Jest nieskuteczna u mężczyzn po 60. roku życia', 'TRT jest nielegalna w Polsce'],
      },
      {
        text: 'Ile lat żyją mężczyźni statystycznie krócej od kobiet?',
        answer: 'Około 5–7 lat krócej – globalna różnica jest stała od dziesięcioleci',
        options: ['Mężczyźni żyją dłużej', 'Różnica wynosi poniżej roku', 'Około 5–7 lat krócej – globalna różnica jest stała od dziesięcioleci', 'Ponad 20 lat krócej'],
      },
      {
        text: 'Dlaczego mężczyźni statystycznie żyją krócej?',
        answer: 'Wyższe ryzyko chorób sercowo-naczyniowych, wypadków, rzadsze korzystanie z pomocy medycznej i tłumienie emocji',
        options: ['Słabszy układ odpornościowy biologicznie', 'Wyższe ryzyko chorób sercowo-naczyniowych, wypadków, rzadsze korzystanie z pomocy medycznej i tłumienie emocji', 'Wyłącznie palenie tytoniu', 'Hormony męskie bezpośrednio skracają życie'],
      },

      // ── MĘŻCZYŹNI VS KOBIETY – RÓŻNICE SEKSUALNE ────────────────────────────
      {
        text: 'Kto jest bardziej wzrokowcem seksualnym – mężczyzna czy kobieta?',
        answer: 'Mężczyźni – silniej reagują na bodźce wizualne, co potwierdzają badania fMRI',
        options: ['Kobiety – wzrok jest ważniejszy dla kobiecej stymulacji', 'Mężczyźni – silniej reagują na bodźce wizualne, co potwierdzają badania fMRI', 'Nie ma różnicy – obie płci są jednakowo wzrokowcami', 'Żadne płeć – dotyk jest ważniejszy niż wzrok dla obu'],
      },
      {
        text: 'Jak mężczyźni i kobiety różnią się w zakresie fantazji seksualnych?',
        answer: 'Mężczyźni częściej fantazjują o nowych partnerach i sytuacjach wizualnych; kobiety o kontekście emocjonalnym',
        options: ['Mężczyźni i kobiety mają identyczne fantazje', 'Kobiety fantazjują znacznie częściej niż mężczyźni', 'Mężczyźni częściej fantazjują o nowych partnerach i sytuacjach wizualnych; kobiety o kontekście emocjonalnym', 'Mężczyźni nie mają fantazji – reagują tylko na bodźce fizyczne'],
      },
      {
        text: 'Ile razy szybciej mężczyźni się podniecają wizualnie niż kobiety?',
        answer: 'Badania fMRI: mężczyźni reagują na erotyczny obraz w ciągu 0,2 sekundy – to odruch nawet bez udziału świadomości',
        options: ['Kobiety reagują szybciej niż mężczyźni', 'Identycznie szybko', 'Badania fMRI: mężczyźni reagują na erotyczny obraz w ciągu 0,2 sekundy – to odruch nawet bez udziału świadomości', 'Mężczyźni reagują 100× wolniej – potrzebują kontekstu'],
      },
      {
        text: 'Jak różni się komunikacja seksualna między mężczyznami a kobietami w związkach?',
        answer: 'Mężczyźni rzadziej inicjują rozmowę o problemach seksualnych – statystycznie gorzej komunikują potrzeby',
        options: ['Mężczyźni komunikują potrzeby seksualne częściej niż kobiety', 'Brak różnicy – obie płci komunikują równie dobrze', 'Mężczyźni rzadziej inicjują rozmowę o problemach seksualnych – statystycznie gorzej komunikują potrzeby', 'Kobiety są niezdolne do rozmowy o seksie'],
      },
      {
        text: 'Ile procent mężczyzn jest gotowych na seks z atrakcyjną nieznajomą wg klasycznych badań (Clark & Hatfield 1989)?',
        answer: 'Około 75% – kobiety w identycznym eksperymencie: 0%',
        options: ['Około 10%', 'Około 40%', 'Około 75% – kobiety w identycznym eksperymencie: 0%', 'Prawie wszyscy – ~99%'],
      },
      {
        text: 'Co mówi ewolucja o różnicach seksualnych mężczyzn i kobiet?',
        answer: 'Mężczyźni ewolucyjnie preferują liczność partnerek (r-strategia), kobiety jakość partnera (K-strategia)',
        options: ['Ewolucja nie wpłynęła na preferencje seksualne', 'Mężczyźni i kobiety mają identyczne strategie seksualne', 'Mężczyźni ewolucyjnie preferują liczność partnerek (r-strategia), kobiety jakość partnera (K-strategia)', 'Kobiety preferu ją liczność partnerów, mężczyźni – jedną partnerkę'],
      },
      // Seksualność – dodatkowe fakty
      {
        text: 'Ile cm wynosi średni obwód (circumference) penisa wg BJUI 2015?',
        answer: 'Około 11,66 cm w stanie wzwodu',
        options: ['Około 8 cm', 'Około 9,5 cm', 'Około 11,66 cm w stanie wzwodu', 'Około 14 cm'],
      },
      {
        text: 'W którym roku penis po raz pierwszy zmierzono klinicznie w dużej próbie?',
        answer: '2015 – badanie BJUI, n = 15 521 mężczyzn',
        options: ['1948 – Kinsey Institute', '1966 – Masters & Johnson', '2015 – badanie BJUI, n = 15 521 mężczyzn', '2001 – WHO'],
      },
      {
        text: 'Jaki procent mężczyzn ma penisa krótszego niż 10 cm w erekcji?',
        answer: 'Około 2,28% (dwa odchylenia standardowe poniżej średniej)',
        options: ['Około 15%', 'Około 10%', 'Około 5%', 'Około 2,28% (dwa odchylenia standardowe poniżej średniej)'],
      },
      {
        text: 'Co oznacza termin "efekt szatni" (locker room effect) w kontekście penisa?',
        answer: 'Złudzenie, że inni mężczyźni mają większy penis, bo wzrok patrzy z góry na własny, a z przodu na cudzy',
        options: ['Strach przed rozebranием się przy innych mężczyznach', 'Efekt powiększenia penisa przez zimną wodę', 'Złudzenie, że inni mężczyźni mają większy penis, bo wzrok patrzy z góry na własny, a z przodu na cudzy', 'Rywalizacja seksualna w środowiskach sportowych'],
      },
      {
        text: 'Ile procent mężczyzn ma penisa "grower" (rośnie znacznie przy erekcji) vs "shower" (prawie bez zmiany)?',
        answer: 'Około 79% to "growers", 21% to "showers" wg badań urologicznych',
        options: ['50% growers, 50% showers', 'Około 30% growers, 70% showers', 'Około 79% to "growers", 21% to "showers" wg badań urologicznych', 'Niemal wszyscy to "showers"'],
      },
      {
        text: 'Jak długo trwa przeciętna erekcja poranna (morning wood)?',
        answer: 'Od kilku do 30 minut; pojawia się 3–5 razy w nocy podczas fazy REM',
        options: ['Zawsze dokładnie 5 minut', 'Od kilku do 30 minut; pojawia się 3–5 razy w nocy podczas fazy REM', 'Tylko jeśli mężczyzna ma sen erotyczny', 'Maksymalnie 2 minuty'],
      },
      {
        text: 'Jaki jest najdłuższy udokumentowany medycznie czas trwania erekcji?',
        answer: 'Przypadek priapizmu trwającego ponad 96 godzin opisano w literaturze urologicznej',
        options: ['Maksymalnie 6 godzin', 'Przypadek priapizmu trwającego ponad 96 godzin opisano w literaturze urologicznej', 'Rekord to 24 godziny', 'Medycyna nie mierzy tego parametru'],
      },
      {
        text: 'Co to jest "penile plethysmography"?',
        answer: 'Urządzenie mierzące zmiany obwodu penisa w celu oceny podniecenia seksualnego – stosowane w badaniach klinicznych',
        options: ['Operacja plastyczna penisa', 'Lek na zaburzenia erekcji', 'Urządzenie mierzące zmiany obwodu penisa w celu oceny podniecenia seksualnego – stosowane w badaniach klinicznych', 'Technika tatuażu na penisie'],
      },
      {
        text: 'Ile milionów plemników traci mężczyzna przy jednym wytrysku?',
        answer: 'Średnio 200–500 milionów, choć do zapłodnienia potrzeba tylko jednego',
        options: ['Kilka tysięcy', 'Około 1 milion', 'Średnio 200–500 milionów, choć do zapłodnienia potrzeba tylko jednego', 'Ponad miliard'],
      },
      {
        text: 'Jak wysoka temperatura niszczy produkcję plemników?',
        answer: 'Już 1–2°C powyżej normy jąder (~34°C) obniża spermatogenezę – stąd jądra są poza ciałem',
        options: ['Dopiero powyżej 50°C', 'Temperatura nie wpływa na spermatogenezę', 'Już 1–2°C powyżej normy jąder (~34°C) obniża spermatogenezę – stąd jądra są poza ciałem', 'Niskie temperatury są groźniejsze niż wysokie'],
      },
      {
        text: 'Ile dni żyją plemniki w żeńskim układzie rozrodczym?',
        answer: 'Do 5 dni w sprzyjającym śluzie szyjkowym',
        options: ['Maksymalnie kilka godzin', 'Dokładnie 24 godziny', 'Do 5 dni w sprzyjającym śluzie szyjkowym', 'Do 2 tygodni'],
      },
      {
        text: 'Jakie białko chroni plemniki przed atakiem układu odpornościowego kobiety?',
        answer: 'CD52 i inne białka powłoki; sperma zawiera też immunosupresyjne prostaglandyny',
        options: ['Testosteron chroni plemniki bezpośrednio', 'Wystarczy pH pochwy', 'CD52 i inne białka powłoki; sperma zawiera też immunosupresyjne prostaglandyny', 'Plemniki są całkowicie bezbronne'],
      },
      {
        text: 'Co to jest azoospermia?',
        answer: 'Całkowity brak plemników w ejakulacie – dotyczy ok. 1% mężczyzn i ok. 15% niepłodnych mężczyzn',
        options: ['Ból podczas wytrysku', 'Nadmiar plemników powodujący problemy z płodnością', 'Całkowity brak plemników w ejakulacie – dotyczy ok. 1% mężczyzn i ok. 15% niepłodnych mężczyzn', 'Rzadka alergia na własną spermę'],
      },
      {
        text: 'Ile czasu zajmuje produkcja jednego dojrzałego plemnika (spermatogeneza)?',
        answer: 'Około 64–74 dni od podziału komórki macierzystej do dojrzałego plemnika',
        options: ['24 godziny', 'Około 7 dni', 'Około 64–74 dni od podziału komórki macierzystej do dojrzałego plemnika', 'Ponad rok'],
      },
      {
        text: 'Jak stres wpływa na jakość spermy?',
        answer: 'Kortyzol obniża testosteron i upośledza spermatogenezę; stres chroniczny zwiększa odsetek uszkodzonych plemników',
        options: ['Stres poprawia mobilność plemników', 'Brak udokumentowanego wpływu', 'Kortyzol obniża testosteron i upośledza spermatogenezę; stres chroniczny zwiększa odsetek uszkodzonych plemników', 'Stres wpływa tylko na libido, nie na spermę'],
      },
      {
        text: 'Jaka jest prawidłowa objętość ejakulatu wg WHO 2021?',
        answer: 'Co najmniej 1,4 ml (poprzednia norma z 2010: 1,5 ml)',
        options: ['Co najmniej 5 ml', 'Co najmniej 3 ml', 'Co najmniej 1,4 ml (poprzednia norma z 2010: 1,5 ml)', 'Objętość nie ma znaczenia klinicznego'],
      },
      {
        text: 'Który składnik prostaty odpowiada za charakterystyczny zapach spermy?',
        answer: 'Spermina i spermidyna – poliaminy utleniające się na powietrzu, dające zapach chloru/kasztana',
        options: ['Testosteron wydzielany do ejakulatu', 'Fruktoza z pęcherzyków nasiennych', 'Spermina i spermidyna – poliaminy utleniające się na powietrzu, dające zapach chloru/kasztana', 'Kwas cytrynowy'],
      },
      {
        text: 'Co to jest varicocele i jak wpływa na płodność?',
        answer: 'Żylaki powrózka nasiennego; podwyższają temperaturę jądra i obniżają jakość spermy u ok. 40% niepłodnych mężczyzn',
        options: ['Bakteryjne zapalenie najądrza niezwiązane z płodnością', 'Łagodna torbiel najądrza bez wpływu na płodność', 'Żylaki powrózka nasiennego; podwyższają temperaturę jądra i obniżają jakość spermy u ok. 40% niepłodnych mężczyzn', 'Wada wrodzona prostaty'],
      },
      {
        text: 'Ile wynosi prawidłowe pH ejakulatu?',
        answer: '7,2–8,0 (lekko zasadowe, co neutralizuje kwaśne środowisko pochwy)',
        options: ['4,0–5,0 (kwaśne)', '6,0–6,5 (lekko kwaśne)', '7,2–8,0 (lekko zasadowe, co neutralizuje kwaśne środowisko pochwy)', 'Powyżej 9 (silnie zasadowe)'],
      },
      {
        text: 'Czym jest PSA (prostate-specific antigen) i dlaczego jest ważny?',
        answer: 'Białko produkowane przez prostatę; podwyższone PSA może wskazywać na raka prostaty, BPH lub zapalenie',
        options: ['Hormon produkowany przez jądra', 'Enzym w spermie rozkładający DNA', 'Białko produkowane przez prostatę; podwyższone PSA może wskazywać na raka prostaty, BPH lub zapalenie', 'Substancja chroniąca przed STI'],
      },
      {
        text: 'W jakim wieku ryzyko raka prostaty znacznie wzrasta?',
        answer: 'Po 50. roku życia; po 65. roku dotyczy większości mężczyzn w formie subklinicznej',
        options: ['Już po 30. roku życia', 'Po 40. roku życia', 'Po 50. roku życia; po 65. roku dotyczy większości mężczyzn w formie subklinicznej', 'Ryzyko jest równomiernie rozłożone w całym życiu'],
      },
      {
        text: 'Co to jest BPH (benign prostatic hyperplasia)?',
        answer: 'Łagodny przerost prostaty utrudniający oddawanie moczu; dotyczy ok. 50% mężczyzn po 60. roku życia',
        options: ['Rak prostaty w stadium I', 'Łagodny przerost prostaty utrudniający oddawanie moczu; dotyczy ok. 50% mężczyzn po 60. roku życia', 'Zapalenie pęcherza moczowego u mężczyzn', 'Genetyczna wada prącia'],
      },
      {
        text: 'Jak alkohol wpływa na poziom testosteronu?',
        answer: 'Alkohol hamuje produkcję testosteronu w jądrach i zwiększa konwersję do estrogenu w wątrobie',
        options: ['Alkohol tymczasowo zwiększa testosteron', 'Brak udokumentowanego wpływu', 'Alkohol hamuje produkcję testosteronu w jądrach i zwiększa konwersję do estrogenu w wątrobie', 'Tylko piwo obniża testosteron'],
      },
      {
        text: 'Jak otyłość wpływa na poziom testosteronu?',
        answer: 'Tkanka tłuszczowa aromatyzuje testosteron do estradiolu; otyłość koreluje z niskim T i zaburzeniami erekcji',
        options: ['Otyłość nie wpływa na hormony płciowe', 'Otyłość zwiększa testosteron przez większą masę mięśniową', 'Tkanka tłuszczowa aromatyzuje testosteron do estradiolu; otyłość koreluje z niskim T i zaburzeniami erekcji', 'Wpływa tylko na libido, nie na T'],
      },
      {
        text: 'Czym jest "testosterone replacement therapy" (TRT) i kto jej potrzebuje?',
        answer: 'Terapia hormonalna dla mężczyzn z hipogonadyzmem (T < 300 ng/dl z objawami); nie jest legalnym dopingiem sportowym',
        options: ['Suplementacja dla wszystkich mężczyzn po 40.', 'Kuracja odchudzająca oparta na hormonach', 'Terapia hormonalna dla mężczyzn z hipogonadyzmem (T < 300 ng/dl z objawami); nie jest legalnym dopingiem sportowym', 'Eksperymentalna terapia antyrakowa'],
      },
      {
        text: 'Co to jest "low T" (niski testosteron) i jakie ma objawy?',
        answer: 'Poziom testosteronu poniżej 300 ng/dl z objawami: zmęczenie, obniżone libido, ED, depresja, utrata masy mięśniowej',
        options: ['Choroba autoimmunologiczna jąder', 'Poziom testosteronu poniżej 300 ng/dl z objawami: zmęczenie, obniżone libido, ED, depresja, utrata masy mięśniowej', 'Zjawisko wyłącznie u mężczyzn po 70.', 'Stan wymagający natychmiastowej operacji'],
      },
      {
        text: 'O ile procent spada testosteron przeciętnie na dekadę po 30. roku życia?',
        answer: 'Około 1–2% rocznie, co daje ~10–20% na dekadę',
        options: ['Około 0,1% rocznie – zmiany minimalne', 'Około 5% rocznie', 'Około 1–2% rocznie, co daje ~10–20% na dekadę', 'Spada jednorazowo w czasie andropauzy'],
      },
      {
        text: 'Ile godzin snu potrzebuje mężczyzna, by testosteron był optymalny?',
        answer: 'Minimum 7–8 godzin; skrócenie snu do 5 godz. przez tydzień obniża T o ok. 10–15% (University of Chicago, 2011)',
        options: ['4–5 godzin wystarczy', '6 godzin jest idealne', 'Minimum 7–8 godzin; skrócenie snu do 5 godz. przez tydzień obniża T o ok. 10–15% (University of Chicago, 2011)', 'Sen nie wpływa na hormony płciowe'],
      },
      {
        text: 'Jak ćwiczenia wpływają na testosteron?',
        answer: 'Trening oporowy (szczególnie przysiady, martwy ciąg) krótkoterminowo podnosi T; aeroby w nadmiarze mogą go obniżać',
        options: ['Tylko cardio podnosi testosteron', 'Ćwiczenia nie wpływają na T', 'Trening oporowy (szczególnie przysiady, martwy ciąg) krótkoterminowo podnosi T; aeroby w nadmiarze mogą go obniżać', 'Wszystkie formy ruchu obniżają T'],
      },
      {
        text: 'Jaki sport wiąże się z najwyższym testosteronem przed zawodami?',
        answer: 'Sporty walki (boks, zapasy, MMA) – efekt anticipatory testosterone rise przed starciem',
        options: ['Maratony – endorfiny i T rosną razem', 'Szachy – napięcie umysłowe podnosi T', 'Golf – spokój sprzyja hormonom', 'Sporty walki (boks, zapasy, MMA) – efekt anticipatory testosterone rise przed starciem'],
      },
      {
        text: 'Jak zwycięstwo lub porażka wpływa na testosteron mężczyzn?',
        answer: 'Zwycięstwo w rywalizacji podnosi T, porażka obniża – nawet przy obserwacji sportu (efekt "winner-loser")',
        options: ['Wyniki nie mają wpływu na hormony', 'Tylko sport wyczynowy wywołuje zmianę T', 'Zwycięstwo w rywalizacji podnosi T, porażka obniża – nawet przy obserwacji sportu (efekt "winner-loser")', 'T rośnie wyłącznie po fizycznym wysiłku, nie po sukcesie'],
      },
      {
        text: 'Co to jest "dominance hierarchy" w kontekście testosteronu?',
        answer: 'Hierarchia społeczna, w której wyższy status koreluje z wyższym T; T zarówno odpowiada na status, jak i go kształtuje',
        options: ['Wojskowy termin niezwiązany z hormonami', 'Hierarchia dominuje tylko u zwierząt, nie u ludzi', 'Hierarchia społeczna, w której wyższy status koreluje z wyższym T; T zarówno odpowiada na status, jak i go kształtuje', 'Status obniża T przez stres'],
      },
      {
        text: 'Ile procent polskich mężczyzn przyznaje się do masturbacji wg badań CBOS?',
        answer: 'Około 70–75% aktywnych seksualnie mężczyzn przyznaje się do regularnej masturbacji',
        options: ['Około 20%', 'Około 40%', 'Około 70–75% aktywnych seksualnie mężczyzn przyznaje się do regularnej masturbacji', 'Prawie 100%'],
      },
      {
        text: 'Jak częsta masturbacja definiuje "compulsive sexual behavior" (CSB)?',
        answer: 'Nie ma jednej liczby – CSB diagnozuje się przez dyskomfort, utratę kontroli i zaburzenia funkcjonowania, nie przez częstotliwość',
        options: ['Powyżej 3 razy dziennie automatycznie to zaburzenie', 'Powyżej 7 razy tygodniowo', 'Nie ma jednej liczby – CSB diagnozuje się przez dyskomfort, utratę kontroli i zaburzenia funkcjonowania, nie przez częstotliwość', 'Masturbacja nigdy nie jest problemem klinicznym'],
      },
      {
        text: 'Jak pornografia wpływa na dopaminę?',
        answer: 'Pornografia aktywuje szlak nagrody (nucleus accumbens) tak jak substancje uzależniające – u podatnych osób może prowadzić do tolerancji',
        options: ['Pornografia obniża dopaminę', 'Brak wpływu na układ nagrody', 'Pornografia aktywuje szlak nagrody (nucleus accumbens) tak jak substancje uzależniające – u podatnych osób może prowadzić do tolerancji', 'Tylko długie seanse filmów porno zmieniają dopaminę'],
      },
      {
        text: 'Czym jest "death grip syndrome" w kontekście masturbacji?',
        answer: 'Przyzwyczajenie do bardzo silnego ucisku podczas masturbacji, przez co seks z partnerką przynosi mniej przyjemności',
        options: ['Ból erekcji spowodowany zbyt ciasną skórą', 'Syndrom lęku przed seksualnością', 'Przyzwyczajenie do bardzo silnego ucisku podczas masturbacji, przez co seks z partnerką przynosi mniej przyjemności', 'Termin nieistniejący w seksuologii'],
      },
      {
        text: 'Ile czasu trwa przeciętny seks heteroseksualny wg badań IELT (intravaginal ejaculation latency time)?',
        answer: 'Mediana IELT wynosi ok. 5,4 minuty (Waldinger et al., 2005)',
        options: ['Około 1–2 minut', 'Około 15–20 minut', 'Mediana IELT wynosi ok. 5,4 minuty (Waldinger et al., 2005)', 'Ponad 30 minut'],
      },
      {
        text: 'Ile procent mężczyzn doświadcza zaburzeń erekcji w wieku 40–49 lat?',
        answer: 'Około 12–15% (MMAS – Massachusetts Male Aging Study)',
        options: ['Poniżej 1%', 'Około 5%', 'Około 12–15% (MMAS – Massachusetts Male Aging Study)', 'Ponad 50%'],
      },
      {
        text: 'Jaki jest mechanizm działania sildenafilu (Viagra)?',
        answer: 'Inhibicja PDE5 zapobiega rozkładowi cGMP, co wydłuża relaksację mięśni gładkich i napływ krwi do ciał jamistych',
        options: ['Bezpośrednia stymulacja nerwów w penisie', 'Wzrost testosteronu na czas działania tabletki', 'Inhibicja PDE5 zapobiega rozkładowi cGMP, co wydłuża relaksację mięśni gładkich i napływ krwi do ciał jamistych', 'Blokada receptorów serotoninowych'],
      },
      {
        text: 'Czym jest "psychogenic erectile dysfunction"?',
        answer: 'ED wywołane czynnikami psychologicznymi (lęk, depresja, stres) przy sprawnej fizjologii; erekcje poranne zachowane',
        options: ['ED wyłącznie u starszych mężczyzn', 'ED spowodowane urazem rdzenia kręgowego', 'ED wywołane czynnikami psychologicznymi (lęk, depresja, stres) przy sprawnej fizjologii; erekcje poranne zachowane', 'ED będące skutkiem leczenia raka'],
      },
      {
        text: 'Jaki odsetek przypadków ED ma podłoże naczyniowe?',
        answer: 'Około 50–70% przypadków ED wynika z zaburzeń naczyniowych (miażdżyca, cukrzyca, nadciśnienie)',
        options: ['Poniżej 10%', 'Około 20–30%', 'Około 50–70% przypadków ED wynika z zaburzeń naczyniowych (miażdżyca, cukrzyca, nadciśnienie)', 'Prawie 100% to podłoże psychogenne'],
      },
      {
        text: 'Co to jest "nocturnal penile tumescence test" (NPT)?',
        answer: 'Badanie nocnych erekcji (podczas REM) do różnicowania ED organicznego i psychogennego – brak erekcji nocnych sugeruje przyczynę organiczną',
        options: ['Test na raka prostaty', 'Badanie przepływu krwi w penisie na czczo', 'Badanie nocnych erekcji (podczas REM) do różnicowania ED organicznego i psychogennego – brak erekcji nocnych sugeruje przyczynę organiczną', 'Ultrasonografia jąder'],
      },
      {
        text: 'Jak cukrzyca wpływa na funkcje seksualne mężczyzny?',
        answer: 'Uszkadza naczynia i nerwy penisa; ryzyko ED u diabetyków jest 3× wyższe, a neuropatia autonomiczna zaburza wytrysk',
        options: ['Cukrzyca zwiększa libido przez podwyższony cukier', 'Wpływa tylko na płodność, nie na erekcję', 'Uszkadza naczynia i nerwy penisa; ryzyko ED u diabetyków jest 3× wyższe, a neuropatia autonomiczna zaburza wytrysk', 'Brak udokumentowanego związku'],
      },
      {
        text: 'Ile procent mężczyzn po radykalnej prostatektomii odzyskuje pełną potencję?',
        answer: 'Około 40–70% przy operacji oszczędzającej nerwy (nerve-sparing), po ok. 2 latach powrotu potencji',
        options: ['Prawie wszyscy – 95%', 'Poniżej 10%', 'Około 40–70% przy operacji oszczędzającej nerwy (nerve-sparing), po ok. 2 latach powrotu potencji', 'Potencja nigdy nie wraca po tej operacji'],
      },
      {
        text: 'Co to jest priapizm i dlaczego jest stanem nagłym?',
        answer: 'Przedłużona erekcja (>4 godz.) niezwiązana z podnieceniem; niedotlenienie tkanek prowadzi do martwicy ciał jamistych',
        options: ['Ból podczas wytrysku u starszych mężczyzn', 'Złośliwa zmiana na penisie', 'Przedłużona erekcja (>4 godz.) niezwiązana z podnieceniem; niedotlenienie tkanek prowadzi do martwicy ciał jamistych', 'Zapalenie żołędzi'],
      },
      {
        text: 'Jaka jest najczęstsza przyczyna zakrzywienia penisa u dorosłych mężczyzn?',
        answer: 'Choroba Peyroniego – blizny w ciałach jamistych po mikrourazach; dotyczy ok. 3–9% mężczyzn',
        options: ['Wada wrodzona chromosomalna', 'Niedobór testosteronu w dzieciństwie', 'Choroba Peyroniego – blizny w ciałach jamistych po mikrourazach; dotyczy ok. 3–9% mężczyzn', 'Infekcja HPV penisa'],
      },
      {
        text: 'Jak ciasny napletek (fimoza) wpływa na zdrowie seksualne mężczyzny?',
        answer: 'Może powodować ból podczas erekcji i stosunku, utrudniać higienę i zwiększać ryzyko infekcji; leczenie: kortykosteroidy lub obrzezanie',
        options: ['Fimoza nie ma wpływu na seksualność', 'Fimoza zawsze wymaga natychmiastowej operacji', 'Może powodować ból podczas erekcji i stosunku, utrudniać higienę i zwiększać ryzyko infekcji; leczenie: kortykosteroidy lub obrzezanie', 'Fimoza znika samoistnie po 30. roku życia'],
      },
      {
        text: 'Czym jest "hypersexuality" (hiperseksualność) i jak się ją diagnozuje?',
        answer: 'Niekontrolowane zachowania seksualne powodujące dyskomfort i zaburzenia funkcjonowania; ICD-11 klasyfikuje je jako "compulsive sexual behaviour disorder"',
        options: ['Posiadanie libido powyżej przeciętnej', 'Każda relacja z więcej niż jedną partnerką', 'Niekontrolowane zachowania seksualne powodujące dyskomfort i zaburzenia funkcjonowania; ICD-11 klasyfikuje je jako "compulsive sexual behaviour disorder"', 'Stan wymagający leczenia testosteronem'],
      },
      {
        text: 'Jaki procent mężczyzn doświadcza anorgazmii (trudności z osiągnięciem orgazmu)?',
        answer: 'Około 5–10% w jakimś momencie życia; częstość rośnie z wiekiem i przy stosowaniu SSRI',
        options: ['Poniżej 0,1% – to właściwie niemożliwe', 'Ponad 30%', 'Dokładnie 2%', 'Około 5–10% w jakimś momencie życia; częstość rośnie z wiekiem i przy stosowaniu SSRI'],
      },
      {
        text: 'Jak SSRI (antydepresanty) wpływają na funkcje seksualne mężczyzn?',
        answer: 'U ok. 30–40% mężczyzn powodują opóźnienie ejakulacji, obniżenie libido i trudności z erekcją',
        options: ['SSRI nie wpływają na funkcje seksualne', 'SSRI poprawiają libido przez poprawę nastroju', 'U ok. 30–40% mężczyzn powodują opóźnienie ejakulacji, obniżenie libido i trudności z erekcją', 'SSRI wywołują priapizm u większości mężczyzn'],
      },
      {
        text: 'Czym jest "post-SSRI sexual dysfunction" (PSSD)?',
        answer: 'Zaburzenie seksualne utrzymujące się po odstawieniu SSRI, czasem tygodnie lub lata; FDA wydała ostrzeżenie w 2019 r.',
        options: ['Zaburzenie erekcji wyłącznie w trakcie leczenia SSRI', 'Mit stworzony przez internet', 'Zaburzenie seksualne utrzymujące się po odstawieniu SSRI, czasem tygodnie lub lata; FDA wydała ostrzeżenie w 2019 r.', 'Termin naukowy oznaczający zbyt częste stosunki po antydepresantach'],
      },
      {
        text: 'Jak opiaty wpływają na testosteron i libido?',
        answer: 'Opioidy hamują oś HPG (podwzgórze-przysadka-gonady), powodując hipogonadyzm i drastyczny spadek libido u >70% długotrwałych użytkowników',
        options: ['Opiaty nie wpływają na układ hormonalny', 'Opiaty krótkotrwale podnoszą testosteron', 'Opioidy hamują oś HPG (podwzgórze-przysadka-gonady), powodując hipogonadyzm i drastyczny spadek libido u >70% długotrwałych użytkowników', 'Tylko heroina wpływa na hormony, nie leki przeciwbólowe'],
      },
      {
        text: 'Co to jest andropauza i czy jest odpowiednikiem menopauzy?',
        answer: 'Stopniowy spadek T z wiekiem (PADAM – partial androgen deficiency of aging male); w przeciwieństwie do menopauzy jest powolny i nie powoduje nagłej utraty płodności',
        options: ['Andropauza to dokładny odpowiednik menopauzy – nagłe zatrzymanie produkcji T', 'Andropauza nie istnieje naukowo', 'Stopniowy spadek T z wiekiem (PADAM – partial androgen deficiency of aging male); w przeciwieństwie do menopauzy jest powolny i nie powoduje nagłej utraty płodności', 'Andropauza pojawia się tylko po 80. roku życia'],
      },
      // Uzupełnienie – 26 dodatkowych pytań
      {
        text: 'Ile procent mężczyzn nigdy nie odwiedza urologa w ciągu życia mimo wskazań?',
        answer: 'Szacuje się, że ponad 60% mężczyzn z objawami urologicznymi zwleka ponad rok z wizytą u specjalisty',
        options: ['Poniżej 10% – mężczyźni regularnie chodzą do specjalistów', 'Około 30%', 'Szacuje się, że ponad 60% mężczyzn z objawami urologicznymi zwleka ponad rok z wizytą u specjalisty', 'Prawie wszyscy zgłaszają się natychmiast'],
      },
      {
        text: 'Czym jest "male factor infertility" i jak często jest przyczyną problemu pary?',
        answer: 'Czynnik męski odpowiada za ok. 40–50% przypadków niepłodności par; dawniej błędnie przypisywano je wyłącznie kobietom',
        options: ['Czynnik męski to mniej niż 5% przypadków', 'Czynnik męski dotyczy wyłącznie mężczyzn po 50.', 'Czynnik męski odpowiada za ok. 40–50% przypadków niepłodności par; dawniej błędnie przypisywano je wyłącznie kobietom', 'Niepłodność jest zawsze po obu stronach równo'],
      },
      {
        text: 'Co to jest "retrograde ejaculation" (wsteczny wytrysk)?',
        answer: 'Stan, w którym nasienie cofa się do pęcherza zamiast wychodzić przez cewkę; powoduje "suchy orgazm" i może być przyczyną niepłodności',
        options: ['Przedwczesny wytrysk wywołany stresem', 'Ból podczas orgazmu bez wytrysku', 'Stan, w którym nasienie cofa się do pęcherza zamiast wychodzić przez cewkę; powoduje "suchy orgazm" i może być przyczyną niepłodności', 'Wytrysk bez orgazmu u starszych mężczyzn'],
      },
      {
        text: 'Jak noszenie obcisłej bielizny wpływa na płodność?',
        answer: 'Obcisła bielizna podnosi temperaturę moszny o ~1°C, co może obniżyć jakość spermy przy długotrwałym noszeniu (HJHB 2018)',
        options: ['Bielizna nie ma żadnego wpływu na spermę', 'Tylko bokserki wpływają na płodność, nie slipy', 'Obcisła bielizna podnosi temperaturę moszny o ~1°C, co może obniżyć jakość spermy przy długotrwałym noszeniu (HJHB 2018)', 'Efekt jest odwrotny – ucisk poprawia spermatogenezę'],
      },
      {
        text: 'Ile procent mężczyzn doświadczyło w życiu co najmniej jednego orgazmu wielokrotnego?',
        answer: 'Badania wskazują ok. 10–20% mężczyzn raportuje orgazmy wielokrotne – częściej przed 30. rokiem życia',
        options: ['Mężczyźni biologicznie nie są zdolni do orgazmów wielokrotnych', 'Prawie wszyscy – to norma biologiczna', 'Badania wskazują ok. 10–20% mężczyzn raportuje orgazmy wielokrotne – częściej przed 30. rokiem życia', 'Wyłącznie mężczyźni po wazektomii'],
      },
      {
        text: 'Co to jest "inhibited ejaculation" (zahamowany wytrysk) i jak często występuje?',
        answer: 'Trudność lub niemożność wytrysku mimo pełnej erekcji i pobudzenia; dotyczy ok. 1–4% mężczyzn (rzadziej diagnozowane niż PE)',
        options: ['To to samo co przedwczesny wytrysk', 'Dotyczy prawie wszystkich mężczyzn po 60.', 'Trudność lub niemożność wytrysku mimo pełnej erekcji i pobudzenia; dotyczy ok. 1–4% mężczyzn (rzadziej diagnozowane niż PE)', 'Stan wyłącznie po operacji prostaty'],
      },
      {
        text: 'Ile wynosi przeciętna objętość jąder u dorosłego mężczyzny?',
        answer: 'Około 15–25 ml każde (mierzone orchidometrem Pradera); objętość koreluje z produkcją spermy',
        options: ['Około 5 ml', 'Około 50–100 ml', 'Około 15–25 ml każde (mierzone orchidometrem Pradera); objętość koreluje z produkcją spermy', 'Objętość nie ma znaczenia klinicznego'],
      },
      {
        text: 'Czym różni się lewe jądro od prawego anatomicznie?',
        answer: 'Lewe jądro zwisa niżej u większości mężczyzn (ok. 65%); wynik asymetrycznego przebiegu żył nasiennych',
        options: ['Prawe jest zawsze większe u wszystkich mężczyzn', 'Oba jądra są identyczne – asymetria jest patologią', 'Lewe jądro zwisa niżej u większości mężczyzn (ok. 65%); wynik asymetrycznego przebiegu żył nasiennych', 'Lewa strona produkuje więcej testosteronu'],
      },
      {
        text: 'Co to jest kryptorchizm i jak wpływa na płodność?',
        answer: 'Niezstąpienie jądra do moszny; jeśli nieleczone do 2. roku życia – trwale upośledza spermatogenezę i zwiększa ryzyko raka jądra 4–8×',
        options: ['Łagodna torbiel jądra bez wpływu na płodność', 'Zapalenie najądrza u chłopców', 'Niezstąpienie jądra do moszny; jeśli nieleczone do 2. roku życia – trwale upośledza spermatogenezę i zwiększa ryzyko raka jądra 4–8×', 'Stan samoistnie ustępujący w wieku dojrzewania'],
      },
      {
        text: 'Jaka jest pięcioletnia przeżywalność przy raku jądra wykrytym w stadium I?',
        answer: 'Ponad 99% – rak jądra jest jednym z najlepiej rokujących nowotworów złośliwych przy wczesnym wykryciu',
        options: ['Około 50%', 'Około 75%', 'Ponad 99% – rak jądra jest jednym z najlepiej rokujących nowotworów złośliwych przy wczesnym wykryciu', 'Rak jądra jest nieuleczalny'],
      },
      {
        text: 'Jak często mężczyźni powinni wykonywać samobadanie jąder?',
        answer: 'Co miesiąc, najlepiej po ciepłej kąpieli gdy moszna jest rozluźniona; rekomendacja dla mężczyzn 15–35 lat',
        options: ['Raz w roku przy kontroli lekarskiej', 'Codziennie rano', 'Co miesiąc, najlepiej po ciepłej kąpieli gdy moszna jest rozluźniona; rekomendacja dla mężczyzn 15–35 lat', 'Samobadanie jąder nie jest zalecane przez urologów'],
      },
      {
        text: 'Jak palenie papierosów wpływa na jakość spermy?',
        answer: 'Palenie obniża ruchliwość plemników o ok. 13% i zwiększa fragmentację DNA spermy; ryzyko rośnie proporcjonalnie do liczby papierosów',
        options: ['Palenie poprawia ruchliwość plemników przez wazodilatację', 'Brak udokumentowanego wpływu na spermę', 'Palenie obniża ruchliwość plemników o ok. 13% i zwiększa fragmentację DNA spermy; ryzyko rośnie proporcjonalnie do liczby papierosów', 'Tylko bierne palenie wpływa na płodność'],
      },
      {
        text: 'Jak dieta śródziemnomorska wpływa na zdrowie seksualne mężczyzn?',
        answer: 'Koreluje z niższym ryzykiem ED, wyższym T i lepszą jakością spermy; bogata w antyoksydanty, kwasy omega-3 i cynk',
        options: ['Dieta nie wpływa na zdrowie seksualne', 'Dieta wysokobiałkowa jest lepsza od śródziemnomorskiej', 'Koreluje z niższym ryzykiem ED, wyższym T i lepszą jakością spermy; bogata w antyoksydanty, kwasy omega-3 i cynk', 'Dieta śródziemnomorska obniża testosteron przez dużo tłuszczy'],
      },
      {
        text: 'Jaki minerał jest najważniejszy dla produkcji testosteronu i spermy?',
        answer: 'Cynk – niedobór cynku bezpośrednio obniża T i pogarsza spermatogenezę; bogaty w niego jest ostrygi, mięso, nasiona',
        options: ['Żelazo – kluczowe dla transportu tlenu do jąder', 'Wapń – buduje strukturę plemników', 'Cynk – niedobór cynku bezpośrednio obniża T i pogarsza spermatogenezę; bogaty w niego jest ostrygi, mięso, nasiona', 'Magnez – reguluje poziom estrogenu'],
      },
      {
        text: 'Jak sauna wpływa na płodność mężczyzny?',
        answer: 'Regularne wizyty w saunie (>15 min, >80°C) mogą tymczasowo obniżyć liczbę i ruchliwość plemników; efekt odwracalny po ok. 3 miesiącach',
        options: ['Sauna poprawia jakość spermy przez rozluźnienie mięśni', 'Brak wpływu na spermę', 'Regularne wizyty w saunie (>15 min, >80°C) mogą tymczasowo obniżyć liczbę i ruchliwość plemników; efekt odwracalny po ok. 3 miesiącach', 'Sauna trwale niszczy zdolność do produkcji spermy'],
      },
      {
        text: 'Ile procent mężczyzn używa prezerwatyw podczas każdego stosunku z nową partnerką?',
        answer: 'Tylko ok. 30–40% mężczyzn konsekwentnie używa prezerwatywy z nowymi partnerkami (dane WHO/ECDC)',
        options: ['Prawie wszyscy – ponad 90%', 'Około 70%', 'Tylko ok. 30–40% mężczyzn konsekwentnie używa prezerwatywy z nowymi partnerkami (dane WHO/ECDC)', 'Poniżej 10%'],
      },
      {
        text: 'Jak wazektomia wpływa na życie seksualne mężczyzny?',
        answer: 'Nie zmienia libido, erekcji ani jakości orgazmu; wytrysk wygląda identycznie (sperma to tylko 2–5% objętości ejakulatu)',
        options: ['Wazektomia trwale obniża testosteron', 'Wazektomia eliminuje orgazm', 'Nie zmienia libido, erekcji ani jakości orgazmu; wytrysk wygląda identycznie (sperma to tylko 2–5% objętości ejakulatu)', 'Wazektomia powoduje chroniczny ból przez blizny'],
      },
      {
        text: 'Jaki procent wazektomii można skutecznie odwrócić (vasovasostomy)?',
        answer: 'Skuteczność ok. 70–90% przy odwróceniu do 3 lat po zabiegu; po 15+ latach spada do ok. 30%',
        options: ['Wazektomia jest całkowicie nieodwracalna', 'Prawie zawsze – 99% skuteczności', 'Skuteczność ok. 70–90% przy odwróceniu do 3 lat po zabiegu; po 15+ latach spada do ok. 30%', 'Skuteczność jest identyczna niezależnie od czasu'],
      },
      {
        text: 'Jaki jest związek między częstością wytrysku a ryzykiem raka prostaty?',
        answer: 'Giovannucci (2004): mężczyźni wytryskujący ≥21× miesięcznie mieli o 33% niższe ryzyko raka prostaty vs ≤4–7×',
        options: ['Częsty wytrysk zwiększa ryzyko raka prostaty', 'Brak jakiegokolwiek związku', 'Giovannucci (2004): mężczyźni wytryskujący ≥21× miesięcznie mieli o 33% niższe ryzyko raka prostaty vs ≤4–7×', 'Zależy wyłącznie od diety, nie od aktywności seksualnej'],
      },
      {
        text: 'Jak seks wpływa na układ odpornościowy mężczyzny?',
        answer: 'Regularne stosunki (1–2× tygodniowo) korelują z wyższym poziomem IgA – przeciwciała w śluzówkach chroniące przed infekcjami',
        options: ['Seks osłabia odporność przez utratę energii', 'Brak udokumentowanego wpływu na odporność', 'Regularne stosunki (1–2× tygodniowo) korelują z wyższym poziomem IgA – przeciwciała w śluzówkach chroniące przed infekcjami', 'Seks poprawia odporność tylko u kobiet'],
      },
      {
        text: 'Czym jest "morning testosterone surge" i o ile wzrasta T rano?',
        answer: 'Testosteron jest najwyższy ok. 6–8 rano – o ok. 20–30% wyższy niż wieczorem; stąd erekcje poranne i wyższe libido rano',
        options: ['Testosteron jest równomiernie wysoki przez cały dzień', 'T jest najwyższy o północy', 'Testosteron jest najwyższy ok. 6–8 rano – o ok. 20–30% wyższy niż wieczorem; stąd erekcje poranne i wyższe libido rano', 'Szczyt T następuje po posiłku'],
      },
      {
        text: 'Jak ojcostwo wpływa na poziom testosteronu?',
        answer: 'Bycie ojcem (szczególnie aktywnie opiekującym się dzieckiem) obniża T o ok. 20–30% – mechanizm ewolucyjny sprzyjający trosce nad potomstwem',
        options: ['Ojcostwo zwiększa T przez dumę i status', 'Testosteron nie zmienia się po urodzeniu dziecka', 'Bycie ojcem (szczególnie aktywnie opiekującym się dzieckiem) obniża T o ok. 20–30% – mechanizm ewolucyjny sprzyjający trosce nad potomstwem', 'Tylko pierwsze dziecko obniża T'],
      },
      {
        text: 'Ile procent mężczyzn doświadcza depresji poporodowej (paternal postnatal depression)?',
        answer: 'Około 10% ojców doświadcza depresji w pierwszym roku po narodzinach dziecka – rzadko diagnozowanej',
        options: ['Mężczyźni nie doświadczają depresji poporodowej', 'Prawie połowa – 45%', 'Około 10% ojców doświadcza depresji w pierwszym roku po narodzinach dziecka – rzadko diagnozowanej', 'Tylko ojcowie bez partnerki'],
      },
      {
        text: 'Co to jest "sympathetic nervous system dominance" podczas seksu i jak wpływa na erekcję?',
        answer: 'Erekcja zależy od układu przywspółczulnego (relaks); pobudzenie sympatyczne (stres, lęk) aktywnie ją hamuje – mechanizm "fight or flight"',
        options: ['Stres zawsze poprawia erekcję przez adrenalinę', 'Oba układy nerwowe działają razem, erekcja nie zależy od relaksu', 'Erekcja zależy od układu przywspółczulnego (relaks); pobudzenie sympatyczne (stres, lęk) aktywnie ją hamuje – mechanizm "fight or flight"', 'Erekcja jest procesem wyłącznie psychicznym'],
      },
      {
        text: 'Ile kalorii spala mężczyzna podczas przeciętnego stosunku seksualnego?',
        answer: 'Około 85–100 kalorii (ok. 4,2 kcal/min) – podobnie jak szybki marsz; badania U of Montreal 2013',
        options: ['Około 500 kalorii – jak intensywny trening', 'Poniżej 20 kalorii – to minimalny wysiłek', 'Około 85–100 kalorii (ok. 4,2 kcal/min) – podobnie jak szybki marsz; badania U of Montreal 2013', 'Seks nie spala kalorii mierzalnych klinicznie'],
      },
      {
        text: 'Jaki jest związek między długością palca wskazującego a serdecznego (digit ratio 2D:4D) a testosteronem prenatalnym?',
        answer: 'Niższy stosunek 2D:4D (dłuższy palec serdeczny) koreluje z wyższym testosteronem prenatalnym i zazwyczaj wyższym libido dorosłego mężczyzny',
        options: ['Wyższy stosunek 2D:4D koreluje z wyższym T prenatalnym', 'Palce nie mają związku z hormonami', 'Niższy stosunek 2D:4D (dłuższy palec serdeczny) koreluje z wyższym testosteronem prenatalnym i zazwyczaj wyższym libido dorosłego mężczyzny', 'Badania digit ratio są całkowicie obalonym mitem'],
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
        answer: 'Stymulacja łechtaczki – ponad 70% kobiet potrzebuje jej do orgazmu',
        options: ['Penetracja pochwy', 'Stymulacja łechtaczki – ponad 70% kobiet potrzebuje jej do orgazmu', 'Stymulacja brodawek sutkowych', 'Seks oralny wyłącznie'],
      },
      {
        text: 'Ile skurczów mięśni odbywa się podczas kobiecego orgazmu?',
        answer: '8–15 skurczów co około 0,8 sekundy',
        options: ['1–2 skurcze', '8–15 skurczów co około 0,8 sekundy', '40–50 skurczów', 'Jeden długotrwały skurcz'],
      },
      {
        text: 'Co się dzieje z łechtaczką tuż przed orgazmem?',
        answer: 'Chowa się pod napletkiem – odruch ochronny przed nadwrażliwością',
        options: ['Powiększa się do maksimum i pozostaje widoczna', 'Chowa się pod napletkiem – odruch ochronny przed nadwrażliwością', 'Twardnieje jak penis', 'Znika całkowicie z pola widzenia'],
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
        answer: 'Około 80% – znacznie częściej niż podczas samej penetracji',
        options: ['Rzadziej niż podczas penetracji', 'Tak samo jak przy penetracji – ~25%', 'Około 80% – znacznie częściej niż podczas samej penetracji', 'Prawie nigdy – seks oralny nie prowadzi do orgazmu'],
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
        answer: 'Kora przedczołowa – stąd utrata kontroli i "wyłączenie" racjonalnego myślenia',
        options: ['Ciało migdałowate', 'Kora przedczołowa – stąd utrata kontroli i "wyłączenie" racjonalnego myślenia', 'Hipokamp – dlatego nie pamiętamy orgazmu', 'Móżdżek – stąd utrata koordynacji'],
      },
      {
        text: 'Ile procent kobiet doświadcza orgazmu podczas snu?',
        answer: 'Około 37% kobiet miało co najmniej jeden nocny orgazm',
        options: ['Poniżej 1%', 'Około 10%', 'Około 37% kobiet miało co najmniej jeden nocny orgazm', 'Prawie wszystkie'],
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
        text: 'Który kraj produkuje najwięcej wina na świecie? (dane OIV 2022)',
        answer: 'Włochy',
        options: ['Francja', 'Włochy', 'Hiszpania', 'USA'],
      },
      {
        text: 'Jak się nazywa drink z szampana i soku pomarańczowego?',
        answer: 'Mimosa',
        options: ['Bellini', 'Spritz', 'Kir Royale', 'Mimosa'],
      },
      {
        text: 'Co to jest "beer goggles effect" – udowodniony naukowo?',
        answer: 'Postrzeganie innych jako atrakcyjniejszych pod wpływem alkoholu',
        options: ['Zamazane widzenie po alkoholu', 'Postrzeganie innych jako atrakcyjniejszych pod wpływem alkoholu', 'Uczucie ciepła po piwie', 'Wzrost tolerancji na alkohol'],
      },
      {
        text: 'Przy jakim stężeniu promili alkoholu we krwi grozi utrata przytomności?',
        answer: '2,5–3‰',
        options: ['0,5‰', '1,2‰', '2,5–3‰', '5‰'],
      },
      {
        text: 'Ile procent alkoholu ma standardowy shot wódki (40 ml)?',
        answer: '40%',
        options: ['20%', '30%', '40%', '70%'],
      },
    ],
  },
]
