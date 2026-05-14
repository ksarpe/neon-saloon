export interface CategoryQuestion {
  text: string;
  answer: string;
  options: string[];
}

export interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  border: string;
  bg: string;
  questions: CategoryQuestion[];
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: "anatomy",
    name: "Anatomia ciała",
    description: "Pytania o ludzkie ciało i jak działa od środka",
    color: "var(--neon-pink)",
    border: "rgba(221,84,162,0.5)",
    bg: "rgba(221,84,162,0.07)",
    questions: [
      {
        text: "Który narząd odpowiada za pompowanie krwi?",
        answer: "Serce",
        options: ["Płuca", "Serce", "Wątroba", "Nerki"],
      },
      {
        text: "Ile kości ma dorosły człowiek?",
        answer: "206",
        options: ["186", "206", "250", "312"],
      },
      {
        text: "Jak długie jest jelito cienkie człowieka?",
        answer: "Około 6 metrów",
        options: ["Około 1 metra", "Około 3 metrów", "Około 6 metrów", "Około 12 metrów"],
      },
      {
        text: "Który narząd wytwarza insulinę?",
        answer: "Trzustka",
        options: ["Wątroba", "Śledziona", "Trzustka", "Nerka"],
      },
      {
        text: "Jak nazywa się największa kość w ciele człowieka?",
        answer: "Kość udowa",
        options: ["Kość piszczelowa", "Kość biodrowa", "Kość udowa", "Kość ramienna"],
      },
      {
        text: "Która grupa krwi jest dawcą uniwersalnym?",
        answer: "0 Rh-",
        options: ["A+", "AB+", "0 Rh-", "B-"],
      },
      {
        text: "Ile zębów ma dorosły człowiek (z zębami mądrości)?",
        answer: "32",
        options: ["28", "30", "32", "36"],
      },
      {
        text: "Który narząd odpowiada za produkcję żółci?",
        answer: "Wątroba",
        options: ["Nerki", "Trzustka", "Wątroba", "Śledziona"],
      },
      {
        text: "Ile litrów krwi ma przeciętny dorosły człowiek?",
        answer: "Około 5 litrów",
        options: ["Około 2 litrów", "Około 3 litrów", "Około 5 litrów", "Około 8 litrów"],
      },
      {
        text: "Jak nazywa się najmniejsza kość w ciele człowieka?",
        answer: "Strzemiączko",
        options: ["Młoteczek", "Strzemiączko", "Kowadełko", "Kość grochowata"],
      },
    ],
  },
  {
    id: "popculture",
    name: "Kultura popularna",
    description: "Filmy, muzyka, celebryci i wszystko, co w trendach",
    color: "#a78bfa",
    border: "rgba(167,139,250,0.5)",
    bg: "rgba(167,139,250,0.07)",
    questions: [
      {
        text: "Kto zagrał główną rolę w filmie 'Pretty Woman'?",
        answer: "Julia Roberts",
        options: ["Meg Ryan", "Sandra Bullock", "Julia Roberts", "Demi Moore"],
      },
      {
        text: "W którym roku pojawił się Instagram?",
        answer: "2010",
        options: ["2008", "2009", "2010", "2012"],
      },
      {
        text: "Jak ma na imię główna bohaterka 'Sex and the City'?",
        answer: "Carrie",
        options: ["Charlotte", "Miranda", "Samantha", "Carrie"],
      },
      {
        text: "Kto napisał serię książek o Harrym Potterze?",
        answer: "J.K. Rowling",
        options: ["Stephenie Meyer", "J.K. Rowling", "Suzanne Collins", "Dan Brown"],
      },
      {
        text: "Ile sezonów miał serial 'Przyjaciele'?",
        answer: "10",
        options: ["8", "9", "10", "12"],
      },
      {
        text: "Kto jest autorką albumu 'Lemonade'?",
        answer: "Beyoncé",
        options: ["Rihanna", "Beyoncé", "Adele", "Taylor Swift"],
      },
      {
        text: "W którym roku premierę miał film 'Titanic'?",
        answer: "1997",
        options: ["1994", "1997", "2000", "2002"],
      },
      {
        text: "Na jakiej platformie można oglądać serial 'Bridgertonowie'?",
        answer: "Netflix",
        options: ["HBO Max", "Netflix", "Disney+", "Amazon Prime"],
      },
      {
        text: "Kto zdobył Oscara za najlepszą rolę kobiecą w 'La La Land'?",
        answer: "Emma Stone",
        options: ["Emma Stone", "Natalie Portman", "Jennifer Lawrence", "Meryl Streep"],
      },
      {
        text: "Z jakiego zespołu pochodzi Harry Styles?",
        answer: "One Direction",
        options: ["The Wanted", "One Direction", "5 Seconds of Summer", "Jonas Brothers"],
      },
    ],
  },
  {
    id: "general",
    name: "Wiedza ogólna",
    description: "Sprawdźcie, kto wie najwięcej o wszystkim",
    color: "var(--sheriff-gold)",
    border: "rgba(255,215,0,0.5)",
    bg: "rgba(255,215,0,0.07)",
    questions: [
      {
        text: "Ile planet jest w Układzie Słonecznym?",
        answer: "8",
        options: ["7", "8", "9", "10"],
      },
      {
        text: "Jaka jest stolica Australii?",
        answer: "Canberra",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      },
      {
        text: "Ile kontynentów liczy nasza planeta?",
        answer: "7",
        options: ["5", "6", "7", "8"],
      },
      {
        text: "Kto namalował 'Monę Lisę'?",
        answer: "Leonardo da Vinci",
        options: ["Michelangelo", "Rafael", "Leonardo da Vinci", "Picasso"],
      },
      {
        text: "Jaką prędkość osiąga światło w próżni?",
        answer: "300 000 km/s",
        options: ["30 000 km/s", "150 000 km/s", "300 000 km/s", "1 000 000 km/s"],
      },
      {
        text: "Ile wynosi pierwiastek kwadratowy z 144?",
        answer: "12",
        options: ["11", "12", "13", "14"],
      },
      {
        text: "Który kraj jest największy na świecie pod względem powierzchni?",
        answer: "Rosja",
        options: ["Chiny", "Kanada", "USA", "Rosja"],
      },
      {
        text: "Ile nóg ma pająk?",
        answer: "8",
        options: ["6", "8", "10", "12"],
      },
      {
        text: "W którym roku Neil Armstrong wylądował na Księżycu?",
        answer: "1969",
        options: ["1963", "1966", "1969", "1972"],
      },
      {
        text: "Jakie zwierzę jest symbolem WWF?",
        answer: "Panda",
        options: ["Słoń", "Tygrys", "Panda", "Niedźwiedź polarny"],
      },
    ],
  },
  {
    id: "science",
    name: "Nauka i przyroda",
    description: "Pytania o naukę, zwierzęta i siły natury",
    color: "#34d399",
    border: "rgba(52,211,153,0.5)",
    bg: "rgba(52,211,153,0.07)",
    questions: [
      {
        text: "Jaki gaz tworzą rośliny podczas fotosyntezy?",
        answer: "Tlen",
        options: ["Dwutlenek węgla", "Azot", "Tlen", "Wodór"],
      },
      {
        text: "Ile chromosomów ma zdrowy człowiek?",
        answer: "46",
        options: ["23", "44", "46", "48"],
      },
      {
        text: "Jaki pierwiastek chemiczny ma symbol 'Au'?",
        answer: "Złoto",
        options: ["Srebro", "Aluminium", "Złoto", "Miedź"],
      },
      {
        text: "Jak długo trwa jeden obrót Ziemi wokół Słońca?",
        answer: "365,25 dni",
        options: ["360 dni", "365 dni", "365,25 dni", "366 dni"],
      },
      {
        text: "Jak nazywa się największy ocean na Ziemi?",
        answer: "Spokojny",
        options: ["Atlantycki", "Indyjski", "Spokojny", "Arktyczny"],
      },
      {
        text: "Ile procent powierzchni Ziemi pokrywa woda?",
        answer: "Około 71%",
        options: ["Około 50%", "Około 60%", "Około 71%", "Około 85%"],
      },
      {
        text: "Który pierwiastek jest najlżejszy?",
        answer: "Wodór",
        options: ["Hel", "Wodór", "Lit", "Tlen"],
      },
      {
        text: "Ile par chromosomów mają komórki ludzkiego ciała?",
        answer: "23",
        options: ["12", "18", "23", "46"],
      },
      {
        text: "Jak szybko porusza się dźwięk w powietrzu?",
        answer: "Około 340 m/s",
        options: ["Około 100 m/s", "Około 200 m/s", "Około 340 m/s", "Około 500 m/s"],
      },
      {
        text: "Jak nazywa się warstwa atmosfery chroniąca Ziemię przed promieniowaniem UV?",
        answer: "Ozonosfera",
        options: ["Troposfera", "Jonosfera", "Ozonosfera", "Egzosfera"],
      },
    ],
  },
  {
    id: "history",
    name: "Historia",
    description: "Ważne daty i wydarzenia z historii Polski i świata",
    color: "#fb923c",
    border: "rgba(251,146,60,0.5)",
    bg: "rgba(251,146,60,0.07)",
    questions: [
      {
        text: "W którym roku zakończyła się II Wojna Światowa?",
        answer: "1945",
        options: ["1943", "1944", "1945", "1946"],
      },
      {
        text: "Kto był pierwszym prezydentem USA?",
        answer: "George Washington",
        options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
      },
      {
        text: "W którym roku upadł Mur Berliński?",
        answer: "1989",
        options: ["1985", "1987", "1989", "1991"],
      },
      {
        text: "W którym roku Polska odzyskała niepodległość?",
        answer: "1918",
        options: ["1916", "1918", "1920", "1922"],
      },
      {
        text: "Kto był pierwszym człowiekiem w kosmosie?",
        answer: "Jurij Gagarin",
        options: ["Neil Armstrong", "Buzz Aldrin", "Jurij Gagarin", "Alan Shepard"],
      },
      {
        text: "W którym roku była Bitwa pod Grunwaldem?",
        answer: "1410",
        options: ["1380", "1410", "1444", "1492"],
      },
      {
        text: "Kto napisał 'Pana Tadeusza'?",
        answer: "Adam Mickiewicz",
        options: ["Juliusz Słowacki", "Adam Mickiewicz", "Henryk Sienkiewicz", "Bolesław Prus"],
      },
      {
        text: "Jak nazwano pierwszy sztuczny satelita Ziemi?",
        answer: "Sputnik 1",
        options: ["Explorer 1", "Sputnik 1", "Vostok 1", "Luna 1"],
      },
      {
        text: "W którym stuleciu zaczęła się rewolucja przemysłowa?",
        answer: "XVIII wiek",
        options: ["XVI wiek", "XVII wiek", "XVIII wiek", "XIX wiek"],
      },
      {
        text: "Który kraj jako pierwszy przyznał kobietom prawo głosu?",
        answer: "Nowa Zelandia",
        options: ["USA", "Wielka Brytania", "Nowa Zelandia", "Szwecja"],
      },
    ],
  },
];
