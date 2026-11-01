import type { RawUnit } from "../core/types.ts";

/** Phase 1, roughly CEFR A1, ten units. Word format "tr|en|pronunciation hint", drill format "family|stem|gloss". */
export const BEGINNER: RawUnit[] = [
  {
    id: "b1",
    title: "Sounds and greetings",
    summary: "Read any Turkish word aloud, then greet and thank people.",
    note: {
      title: "The Turkish alphabet",
      paragraphs: [
        "Turkish has 29 letters and is almost perfectly phonetic: each letter makes one sound, and every letter is pronounced. Once you know the alphabet you can read any word aloud, which is a large head start over English.",
        "Seven letters need attention because English has no direct match. The most important contrast is dotless ı against dotted i, which are different letters, so ışık (light) and işik are not the same word and the capitals are I and İ.",
        "Stress usually falls on the last syllable (günaydın is gün-ay-DIN). Names and some place words are exceptions, so treat this as a default, not a law.",
      ],
      table: {
        head: ["Letter", "Sound", "Example"],
        rows: [
          ["ı", "like the a in sofa", "ışık (light)"],
          ["i", "like the i in sit", "iki (two)"],
          ["ö", "like German ö", "göz (eye)"],
          ["ü", "like German ü", "gül (rose)"],
          ["ç", "like ch in chair", "çay (tea)"],
          ["ş", "like sh in ship", "şeker (sugar)"],
          ["c", "like j in jam", "cam (glass)"],
          ["ğ", "lengthens the vowel before it", "dağ (mountain)"],
        ],
      },
    },
    lessons: [
      {
        title: "Hello and goodbye",
        goal: "Greet people at any time of day and say goodbye correctly.",
        tip: "Turkish has two goodbyes. The person leaving says hoşça kal, and the person staying says güle güle.",
        words: [
          "merhaba|hello|mer-HA-ba",
          "günaydın|good morning|gün-ay-DIN",
          "iyi akşamlar|good evening",
          "iyi geceler|good night",
          "nasılsın|how are you (informal)|na-SIL-sın",
          "teşekkürler|thank you|te-shek-kyur-LER",
          "hoşça kal|goodbye (said by the one leaving)",
          "güle güle|goodbye (said to the one leaving)",
        ],
        sentences: [
          "Merhaba, nasılsın?|Hello, how are you?",
          "İyiyim, teşekkürler.|I am fine, thank you.",
          "Günaydın, nasılsınız?|Good morning, how are you? (formal)",
        ],
      },
      {
        title: "Polite basics",
        goal: "Say yes, no, please and sorry, and ask for help when you do not understand.",
        tip: "Add -siniz to a phrase to make it polite and formal: affedersiniz, nasılsınız. Use it with strangers and elders.",
        words: [
          "evet|yes",
          "hayır|no|ha-YIR",
          "lütfen|please",
          "özür dilerim|I am sorry",
          "affedersiniz|excuse me",
          "rica ederim|you are welcome",
          "tamam|okay, all right",
          "anlamadım|I did not understand|an-LA-ma-dım",
        ],
        sentences: [
          "Lütfen yavaş konuşun.|Please speak slowly.",
          "Anlamadım, tekrar eder misiniz?|I did not understand, could you repeat that?",
          "Evet, tamam.|Yes, okay.",
        ],
      },
    ],
  },
  {
    id: "b2",
    title: "I am, you are",
    summary: "Say who you are and how you feel, using suffixes instead of a verb.",
    note: {
      title: "To be: no verb, just a suffix",
      paragraphs: [
        "In the present tense Turkish has no separate word for am, is or are. You attach a short ending to the noun or adjective: öğrenci (student) becomes öğrenciyim (I am a student).",
        "The vowel in the ending changes to match the last vowel of the word. This is vowel harmony, the most important idea in Turkish. The notation -(y)Im means the vowel is one of ı, i, u or ü, and a y appears after a vowel.",
        "There is no gender: o means he, she or it. In the third person the ending is usually absent, so Ali öğrenci means Ali is a student.",
      ],
      table: {
        head: ["Person", "Ending", "Example"],
        rows: [
          ["ben (I)", "-(y)Im", "öğrenciyim"],
          ["sen (you)", "-sIn", "öğrencisin"],
          ["o (he, she)", "none", "öğrenci"],
          ["biz (we)", "-(y)Iz", "öğrenciyiz"],
          ["siz (you, formal or plural)", "-sInIz", "öğrencisiniz"],
          ["onlar (they)", "-lAr", "öğrenciler"],
        ],
      },
    },
    lessons: [
      {
        title: "Who are you?",
        goal: "Use the six pronouns and say your job.",
        tip: "Pronouns are optional. Öğrenciyim already means I am a student, so Turkish speakers add ben only for emphasis.",
        words: [
          "ben|I", "sen|you (singular, informal)", "o|he, she, it", "biz|we", "siz|you (formal or plural)",
          "onlar|they", "öğrenci|student|ö-ren-JI", "doktor|doctor",
        ],
        sentences: [
          "Ben öğrenciyim.|I am a student.",
          "Sen doktorsun.|You are a doctor.",
          "Biz öğrenciyiz.|We are students.",
        ],
        drills: [
          "cop1|öğrenci|I am a student", "cop1|doktor|I am a doctor", "cop2|öğrenci|you are a student",
          "cop2|doktor|you are a doctor", "cop1pl|öğrenci|we are students", "cop1pl|doktor|we are doctors",
        ],
      },
      {
        title: "How are you feeling?",
        goal: "Describe yourself with adjectives and nationalities.",
        tip: "Look at the last vowel before choosing the ending. Yorgunum has u because yorgun ends in a rounded back vowel.",
        words: [
          "öğretmen|teacher", "mühendis|engineer", "yorgun|tired", "mutlu|happy", "evli|married",
          "hazır|ready|ha-ZIR", "İngiliz|English (person)", "Türk|Turkish (person)",
        ],
        sentences: [
          "Ben yorgunum.|I am tired.",
          "Siz mutlusunuz.|You are happy.",
          "Onlar öğretmenler.|They are teachers.",
          "Ben İngilizim.|I am English.",
        ],
        drills: [
          "cop1|yorgun|I am tired", "cop2|mutlu|you are happy", "cop1pl|öğretmen|we are teachers",
          "cop1|hazır|I am ready", "cop2|yorgun|you are tired", "cop1|mühendis|I am an engineer",
          "cop1|evli|I am married", "cop2|hazır|you are ready",
        ],
      },
    ],
  },
  {
    id: "b3",
    title: "Things and numbers",
    summary: "Name objects, count them, and say what is where.",
    note: {
      title: "Plurals, location and two-way harmony",
      paragraphs: [
        "The plural is -lAr: kitap becomes kitaplar and ev becomes evler. The capital A is a placeholder meaning a or e. Choose a after back vowels (a, ı, o, u) and e after front vowels (e, i, ö, ü). This two-way pattern is one of two harmony rules.",
        "The locative ending -DA means in, at or on. D is also a placeholder: it is d normally, but becomes t after the hard consonants ç f h k p s ş t. So evde (in the house) but kitapta (in the book). A common mnemonic for the list is fıstıkçı şahap.",
        "After a number the noun stays singular: iki kitap, never iki kitaplar. To say something exists use var, and to say it does not exist use yok: Evde su var, Evde su yok.",
      ],
    },
    lessons: [
      {
        title: "Things around you",
        goal: "Name common objects and say where they are.",
        tip: "Var and yok are among the most useful words in Turkish. They also express having: Arabam var means I have a car.",
        words: [
          "kitap|book", "masa|table", "kalem|pen", "telefon|phone", "araba|car", "ev|house, home",
          "var|there is, there are", "yok|there is not",
        ],
        sentences: [
          "Masada kalem var.|There is a pen on the table.",
          "Evde su yok.|There is no water at home.",
          "Bu bir kitap.|This is a book.",
        ],
        drills: [
          "plural|kitap|books", "plural|ev|houses", "plural|araba|cars", "plural|kalem|pens",
          "locative|masa|on the table", "locative|ev|in the house", "locative|kitap|in the book",
          "locative|telefon|on the phone",
        ],
      },
      {
        title: "Numbers one to eight",
        goal: "Count and ask how many things there are.",
        tip: "Never pluralise a counted noun. Say beş araba, not beş arabalar.",
        words: [
          "bir|one", "iki|two", "üç|three", "dört|four", "beş|five", "altı|six|al-TI", "yedi|seven", "sekiz|eight",
        ],
        sentences: [
          "İki kitap var.|There are two books.",
          "Beş araba var.|There are five cars.",
          "Masada üç kalem var.|There are three pens on the table.",
        ],
        drills: [
          "plural|telefon|phones", "plural|masa|tables", "locative|araba|in the car",
          "locative|market|at the market", "locative|kalem|on the pen", "plural|kapı|doors",
        ],
      },
    ],
  },
  {
    id: "b4",
    title: "Everyday actions",
    summary: "Talk about what you are doing, wanting and eating right now.",
    note: {
      title: "Present continuous and questions",
      paragraphs: [
        "Dictionary forms end in -mak or -mek (gitmek, to go). Remove that ending to get the stem: git-, gel-, oku-. Add -(I)yor and a personal ending to say what is happening now: geliyorum, geliyorsun, geliyor, geliyoruz, geliyorsunuz, geliyorlar.",
        "Verbs ending in a or e change that vowel first (başla- becomes başlıyor, bekle- becomes bekliyor). Stems ending in t often soften to d: git- becomes gidiyorum.",
        "Word order is subject, object, verb, so the verb comes last: Ben su içiyorum. To ask yes or no questions, add the separate word mI after the verb and let it harmonise: İçiyor musun? Gidiyor mu? Geliyor musunuz?",
      ],
    },
    lessons: [
      {
        title: "What are you doing?",
        goal: "Use eight core verbs in the present continuous.",
        tip: "Say the verb stem out loud first. If it ends in a consonant, add the vowel; if it ends in a vowel, add only -yor.",
        words: [
          "yemek|to eat", "içmek|to drink", "gitmek|to go", "gelmek|to come", "okumak|to read",
          "yapmak|to do, to make", "sevmek|to love, to like", "istemek|to want",
        ],
        sentences: [
          "Ben su içiyorum.|I am drinking water.",
          "Sen ne yapıyorsun?|What are you doing?",
          "Okula gidiyorum.|I am going to school.",
          "Çay istiyor musun?|Do you want tea?",
        ],
        drills: [
          "pres1|iç|I am drinking", "pres1|oku|I am reading", "pres2|gel|you are coming",
          "pres1pl|yap|we are doing", "pres1|sev|I love", "pres1pl|gel|we are coming",
        ],
      },
      {
        title: "Food and drink",
        goal: "Order simple food and ask questions with mI.",
        tip: "Mi goes after the word you are questioning. Kahve mi çay mı? asks coffee or tea?",
        words: [
          "çay|tea", "kahve|coffee", "ekmek|bread", "peynir|cheese|pey-NIR", "elma|apple", "et|meat",
          "süt|milk", "ne|what",
        ],
        sentences: [
          "Çay içiyor musun?|Are you drinking tea?",
          "Ekmek ve peynir yiyorum.|I am eating bread and cheese.",
          "Kahve istiyorum.|I want coffee.",
          "Kahve mi çay mı?|Coffee or tea?",
        ],
        drills: [
          "pres1|oku|I am reading", "pres2|iç|you are drinking", "pres1pl|iç|we are drinking",
          "pres2|yap|you are doing", "pres1|gel|I am coming", "plural|elma|apples",
        ],
      },
    ],
  },
  {
    id: "b5",
    title: "Colors and describing",
    summary: "Name colors, describe things, and say what they are not.",
    note: {
      title: "Adjectives and değil",
      paragraphs: [
        "An adjective comes before the noun and never changes: kırmızı araba (red car), kırmızı arabalar (red cars). There is no agreement in gender, number or case.",
        "To say something is not so, use değil after the word and add the personal ending to değil, not to the adjective: Ben yorgun değilim (I am not tired). Questions still use mI: O araba yeni mi?",
        "Bu means this, şu means that (near you or in sight) and o means that (further away, or already mentioned). They come before the noun and do not take endings of their own: bu kitap, şu masa, o ev.",
      ],
      table: {
        head: ["Person", "Negative", "Meaning"],
        rows: [
          ["ben", "yorgun değilim", "I am not tired"], ["sen", "yorgun değilsin", "you are not tired"],
          ["o", "yorgun değil", "he or she is not tired"], ["biz", "yorgun değiliz", "we are not tired"],
          ["siz", "yorgun değilsiniz", "you are not tired"], ["onlar", "yorgun değiller", "they are not tired"],
        ],
      },
    },
    lessons: [
      {
        title: "Colors",
        goal: "Name eight colors and use them with nouns.",
        tip: "Colors are adjectives, so they sit before the noun: kırmızı araba. In a plain statement they can also stand alone: Araba kırmızı.",
        words: [
          "kırmızı|red|kır-mı-ZI", "mavi|blue", "yeşil|green", "sarı|yellow", "siyah|black", "beyaz|white", "gri|gray", "turuncu|orange",
        ],
        sentences: [
          "Araba kırmızı.|The car is red.",
          "Masa beyaz.|The table is white.",
          "Telefonum siyah.|My phone is black.",
          "Bu kalem mavi.|This pen is blue.",
        ],
        drills: [
          "plural|araba|cars", "poss1|araba|my car", "poss1|kalem|my pen", "poss1|telefon|my phone", "poss1|masa|my table", "plural|kalem|pens",
        ],
      },
      {
        title: "Describing things",
        goal: "Describe size, age and difficulty, and negate with değil.",
        tip: "Değil negates a noun or adjective. For verbs use the -mA or -mI forms you met in earlier units.",
        words: [
          "büyük|big", "küçük|small", "güzel|nice, beautiful", "yeni|new", "eski|old", "uzun|long, tall", "kısa|short", "zor|difficult",
        ],
        sentences: [
          "Evim büyük değil.|My house is not big.",
          "Bu kitap çok güzel.|This book is very nice.",
          "O araba yeni mi?|Is that car new?",
          "Şu masa eski.|That table is old.",
          "Bu soru zor değil.|This question is not difficult.",
        ],
        drills: [
          "plural|ev|houses", "poss1|ev|my house", "plural|masa|tables", "locative|ev|in the house", "poss1|kitap|my book", "locative|araba|in the car",
        ],
      },
    ],
  },
  {
    id: "b6",
    title: "Days and numbers",
    summary: "Name the days, tell the time, count to a hundred and say what you are not doing.",
    note: {
      title: "Negation and time",
      paragraphs: [
        "In the present continuous, negation goes between the stem and -yor: gelmiyorum (I am not coming), gitmiyorsun, okumuyoruz. The negative marker -mI follows the usual four-way harmony.",
        "Times use the locative: saat dokuzda means at nine o'clock. Days take no ending in a simple statement (Bugün pazartesi), and take -günü when you mean on that day: Cuma günü (on Friday).",
        "Numbers above ten are built by place: yirmi (20), otuz (30), kırk (40), elli (50), yüz (100). Remember that the noun after a number stays singular: yirmi lira, not yirmi liralar.",
      ],
      table: {
        head: ["Person", "gel-", "git-"],
        rows: [
          ["ben", "gelmiyorum", "gitmiyorum"], ["sen", "gelmiyorsun", "gitmiyorsun"], ["o", "gelmiyor", "gitmiyor"],
          ["biz", "gelmiyoruz", "gitmiyoruz"], ["siz", "gelmiyorsunuz", "gitmiyorsunuz"], ["onlar", "gelmiyorlar", "gitmiyorlar"],
        ],
      },
    },
    lessons: [
      {
        title: "Days of the week",
        goal: "Name every day and say what you do not do on them.",
        tip: "Turkish weeks start on Monday, pazartesi. Day names are not capitalised in running text.",
        words: [
          "pazartesi|Monday", "salı|Tuesday", "çarşamba|Wednesday", "perşembe|Thursday", "cuma|Friday", "cumartesi|Saturday", "pazar|Sunday", "hafta|week",
        ],
        sentences: [
          "Bugün pazartesi.|Today is Monday.",
          "Cuma günü okula gitmiyorum.|I am not going to school on Friday.",
          "Pazar günü evdeyim.|On Sunday I am at home.",
          "Perşembe akşamı arkadaşım geliyor.|My friend is coming on Thursday evening.",
        ],
        drills: [
          "negpres1|gel|I am not coming", "negpres1|git|I am not going", "negpres1|oku|I am not reading",
          "negpres1|yap|I am not doing", "negpres1|çalış|I am not working", "negpres1|gör|I am not seeing",
        ],
      },
      {
        title: "The clock and big numbers",
        goal: "Ask and tell the time, and count in tens up to one hundred.",
        tip: "Ask the time with Saat kaç? and answer with the number: Saat dokuz. To say at nine, add -da to the number: dokuzda.",
        words: [
          "dokuz|nine", "on|ten", "yirmi|twenty", "otuz|thirty", "kırk|forty", "elli|fifty", "yüz|hundred", "saat|hour, clock, watch",
        ],
        sentences: [
          "Saat kaç?|What time is it?",
          "Saat dokuz.|It is nine o'clock.",
          "Çay yirmi lira.|The tea is twenty lira.",
          "Otobüs saat onda geliyor.|The bus comes at ten o'clock.",
        ],
        drills: [
          "locative|dokuz|at nine", "locative|on|at ten", "locative|yirmi|at twenty", "locative|otuz|at thirty",
          "locative|kırk|at forty", "locative|yüz|at one hundred",
        ],
      },
    ],
  },
  {
    id: "b7",
    title: "At home",
    summary: "Say what is in each room and where things are.",
    note: {
      title: "Where things are: -DA and I am",
      paragraphs: [
        "Location is the locative -DA you already know. In the third person nothing more is needed: Anahtar çantada (The key is in the bag). Odada bir yatak var says there is a bed in the room.",
        "For I, you and we, the to be endings from the second unit attach after -DA: Ben evdeyim (I am at home), sen evdesin, biz evdeyiz. After the vowel of -de or -da the buffer y appears before -im and -iz.",
        "Word order for existence is place, then thing, then var or yok: Mutfakta su var. This is the natural way to answer Where is it? or What is there?",
      ],
      table: {
        head: ["Person", "ev + -DA", "Meaning"],
        rows: [
          ["ben", "evdeyim", "I am at home"], ["sen", "evdesin", "you are at home"], ["o", "evde", "he or she is at home"],
          ["biz", "evdeyiz", "we are at home"], ["siz", "evdesiniz", "you are at home"], ["onlar", "evdeler", "they are at home"],
        ],
      },
    },
    lessons: [
      {
        title: "Rooms and furniture",
        goal: "Say what is in each room.",
        tip: "Consonant-final nouns often use -ta or -te: mutfakta, yatakta. Check the last consonant before you choose d or t.",
        words: [
          "oda|room", "mutfak|kitchen", "banyo|bathroom", "yatak|bed", "sandalye|chair", "pencere|window", "çanta|bag", "anahtar|key",
        ],
        sentences: [
          "Odada bir yatak var.|There is a bed in the room.",
          "Mutfakta su var.|There is water in the kitchen.",
          "Anahtar çantada.|The key is in the bag.",
          "Ben mutfaktayım.|I am in the kitchen.",
        ],
        drills: [
          "locative|oda|in the room", "locative|mutfak|in the kitchen", "locative|banyo|in the bathroom", "locative|yatak|on the bed",
          "locative|pencere|at the window", "locative|sandalye|on the chair", "locative|çanta|in the bag", "locative|anahtar|on the key",
        ],
      },
      {
        title: "Around the house",
        goal: "Name common household objects and describe them.",
        tip: "Most nouns need no article. Say bir (one, a) only when you want to stress one: Odada bir yatak var.",
        words: [
          "lamba|lamp", "televizyon|television", "buzdolabı|fridge", "halı|rug", "koltuk|armchair", "duvar|wall", "tavan|ceiling", "perde|curtain",
        ],
        sentences: [
          "Duvarda büyük bir saat var.|There is a big clock on the wall.",
          "Koltuk çok rahat.|The armchair is very comfortable.",
          "Perde mavi.|The curtain is blue.",
          "Buzdolabında süt var.|There is milk in the fridge.",
        ],
        drills: [
          "plural|lamba|lamps", "plural|koltuk|armchairs", "plural|duvar|walls", "plural|perde|curtains",
          "locative|duvar|on the wall", "locative|tavan|on the ceiling", "locative|televizyon|on the television", "locative|lamba|on the lamp",
        ],
      },
    ],
  },
  {
    id: "b8",
    title: "Food and restaurants",
    summary: "Order a meal, say what you like and describe food with and without.",
    note: {
      title: "With and without: -lI and -sIz",
      paragraphs: [
        "Two suffixes turn a noun into an adjective. -lI means with or having: şekerli çay is tea with sugar, sütlü kahve is coffee with milk. -sIz means without: şekersiz çay is tea without sugar.",
        "Both follow four-way harmony: tuzlu (salty), tuzsuz (unsalted), sütlü, sütsüz. They are very productive, so one pattern gives you hundreds of words: yağmurlu (rainy), akıllı (clever), evli (married).",
        "Hunger and fullness use the to be endings on aç (hungry) and tok (full): Ben açım, Biz tokuz. To order politely say the thing you want, then istiyorum or lütfen.",
      ],
      table: {
        head: ["Noun", "with: -lI", "without: -sIz"],
        rows: [["şeker", "şekerli", "şekersiz"], ["süt", "sütlü", "sütsüz"], ["tuz", "tuzlu", "tuzsuz"], ["su", "sulu", "susuz"]],
      },
    },
    lessons: [
      {
        title: "Meals and ingredients",
        goal: "Name common foods and say what you eat.",
        tip: "Definite objects take -(y)I: Balığı seviyorum (I like the fish). Note that balık becomes balığı before a vowel ending.",
        words: [
          "su|water", "çorba|soup", "tavuk|chicken", "balık|fish", "pirinç|rice", "meyve|fruit", "sebze|vegetable", "tuz|salt",
        ],
        sentences: [
          "Çorba istiyorum.|I want soup.",
          "Su var mı?|Is there water?",
          "Tavuk ve pirinç yiyorum.|I am eating chicken and rice.",
          "Balığı çok seviyorum.|I like fish a lot.",
        ],
        drills: [
          "plural|tavuk|chickens", "plural|sebze|vegetables", "plural|meyve|fruits", "accusative|çorba|the soup",
          "accusative|sebze|the vegetable", "accusative|meyve|the fruit", "accusative|tuz|the salt", "plural|balık|fish",
        ],
      },
      {
        title: "At the restaurant",
        goal: "Order, say you are hungry or full, and ask for food with or without something.",
        tip: "Garson is how you call the waiter. A polite request is the dish, then lütfen.",
        words: [
          "lokanta|restaurant", "garson|waiter", "menü|menu", "kahvaltı|breakfast", "tatlı|dessert, sweet", "aç|hungry", "tok|full", "şeker|sugar",
        ],
        sentences: [
          "Garson, menü lütfen.|Waiter, the menu please.",
          "Kahvaltıda çay içiyorum.|I drink tea at breakfast.",
          "Ben açım.|I am hungry.",
          "Çayım şekersiz.|My tea is without sugar.",
        ],
        drills: [
          "cop1|aç|I am hungry", "cop1pl|tok|we are full", "cop2|aç|you are hungry", "cop2|tok|you are full",
          "with|şeker|with sugar", "without|şeker|without sugar", "with|süt|with milk", "without|tuz|without salt",
        ],
      },
    ],
  },
  {
    id: "b9",
    title: "Daily routine and school",
    summary: "Describe your day and talk about school.",
    note: {
      title: "The infinitive and verbs of the day",
      paragraphs: [
        "Dictionary forms end in -mAk: uyanmak (to wake up), oturmak (to sit), kalmak (to stay). The two-way harmony picks mak after back vowels and mek after front vowels. Drop it to get the stem.",
        "The infinitive combines with istemek: Okumak istiyorum (I want to read). That is the pattern for I want to do something. Later you will use it with sevmek and başlamak too.",
        "For clock times with a verb, put the time first and add -DA: Sabah yedide uyanıyorum (I wake up at seven in the morning). Sabah, öğleden sonra and akşam are time-of-day words you can place first in the sentence.",
      ],
    },
    lessons: [
      {
        title: "My day",
        goal: "Say what you do from morning to evening with eight new verbs.",
        tip: "Start with the time word, then the place or object, and finish with the verb: Sabah yedide uyanıyorum.",
        words: [
          "uyanmak|to wake up", "oturmak|to sit", "bakmak|to look", "başlamak|to begin", "bitirmek|to finish", "kalmak|to stay", "dönmek|to return, to turn", "girmek|to enter",
        ],
        sentences: [
          "Sabah yedide uyanıyorum.|I wake up at seven in the morning.",
          "Parkta oturuyoruz.|We are sitting in the park.",
          "Evde kalıyorum.|I am staying at home.",
          "Okul dokuzda başlıyor.|School starts at nine.",
        ],
        drills: [
          "pres1|uyan|I am waking up", "pres1|otur|I am sitting", "pres1pl|bak|we are looking", "pres2|kal|you are staying",
          "pres1|dön|I am returning", "pres1pl|gir|we are entering", "inf|uyan|to wake up", "inf|otur|to sit",
        ],
      },
      {
        title: "School and study",
        goal: "Talk about lessons, homework and the library.",
        tip: "Possession marks what belongs to you: ödevim, dersim, defterim. Use it with school words constantly.",
        words: [
          "ders|lesson, class", "sınıf|classroom", "sınav|exam", "ödev|homework", "defter|notebook", "tahta|board", "kütüphane|library", "kurs|course",
        ],
        sentences: [
          "Sınıfta on öğrenci var.|There are ten students in the classroom.",
          "Kütüphaneye gidiyorum.|I am going to the library.",
          "Ödevim çok zor.|My homework is very difficult.",
          "Defterim çantada.|My notebook is in the bag.",
        ],
        drills: [
          "dative|kütüphane|to the library", "locative|sınıf|in the classroom", "poss1|defter|my notebook", "poss1|ödev|my homework",
          "poss1|ders|my lesson", "plural|ders|lessons", "plural|sınav|exams", "locative|tahta|on the board",
        ],
      },
    ],
  },
  {
    id: "b10",
    title: "Asking questions",
    summary: "Ask who, when, why, how and which, and check that you understood.",
    note: {
      title: "Question words",
      paragraphs: [
        "Question words stay where the answer would stand. Sen kimsin? (Who are you?) is answered Ben Ali'yim. Ne zaman geliyorsun? is answered Yarın geliyorum. Unlike English, the question word does not jump to the front.",
        "The most useful ones are kim (who), ne (what), ne zaman (when), neden (why), nasıl (how), hangi (which), nerede (where), nereye (where to) and nereden (from where). Kim and ne take case endings: kimin (whose), neyi (what, as object).",
        "Neden pairs naturally with the negative: Neden gelmiyorsun? (Why are you not coming?). Yes or no questions take mI after the verb or the word you are asking about: Anlıyor musun?",
      ],
      table: {
        head: ["Question", "Meaning", "Typical answer"],
        rows: [
          ["Nerede?", "Where?", "Evde."], ["Nereye?", "Where to?", "Okula."], ["Nereden?", "From where?", "Evden."],
          ["Ne zaman?", "When?", "Yarın."], ["Neden?", "Why?", "Çünkü yorgunum."],
        ],
      },
    },
    lessons: [
      {
        title: "Who, when, why",
        goal: "Ask about people, times, reasons and places.",
        tip: "Answer with the same case the question word carries. Nereye? needs a dative answer, Nereden? an ablative one.",
        words: [
          "kim|who", "ne zaman|when", "neden|why", "nasıl|how", "hangi|which", "nereye|where to", "nereden|from where", "kimin|whose",
        ],
        sentences: [
          "Sen kimsin?|Who are you?",
          "Ne zaman geliyorsun?|When are you coming?",
          "Neden gelmiyorsun?|Why are you not coming?",
          "Nereye gidiyorsun?|Where are you going?",
          "Bu kimin kalemi?|Whose pen is this?",
        ],
        drills: [
          "negpres2|gel|you are not coming", "negpres2|git|you are not going", "negpres2|gör|you are not seeing", "negpres2|al|you are not taking",
          "negpres1|oku|I am not reading", "negpres1|yap|I am not doing",
        ],
      },
      {
        title: "Understanding and answering",
        goal: "Check understanding, ask for repetition and say whether something is right.",
        tip: "Tekrar söyler misin? is a friendly way to ask someone to say it again. Use söyler misiniz? with strangers.",
        words: [
          "anlamak|to understand", "söylemek|to say, to tell", "sormak|to ask", "cevap|answer", "soru|question", "doğru|true, correct", "yanlış|wrong", "tekrar|again",
        ],
        sentences: [
          "Anlıyor musun?|Do you understand?",
          "Soru çok kolay.|The question is very easy.",
          "Cevap doğru.|The answer is correct.",
          "Tekrar söyler misin?|Could you say it again?",
        ],
        drills: [
          "past2|sor|you asked", "past1|sor|I asked", "past1|söyle|I said", "past2|söyle|you said",
          "plural|soru|questions", "plural|cevap|answers", "poss1|soru|my question", "negpast1|anla|I did not understand",
        ],
      },
    ],
  },
];
