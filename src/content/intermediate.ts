import type { RawUnit } from "../core/types.ts";

/** Phase 2, roughly CEFR A2, ten units. */
export const INTERMEDIATE: RawUnit[] = [
  {
    id: "i1",
    title: "Yesterday and today",
    summary: "Tell what happened, with the past tense and time words.",
    note: {
      title: "The definite past: -DI",
      paragraphs: [
        "Add -DI to the verb stem, then a personal ending: geldim (I came), geldin, geldi, geldik, geldiniz, geldiler. The vowel is four-way (ı, i, u or ü) and follows the last vowel of the stem.",
        "D becomes t after a hard consonant (ç f h k p s ş t): içtim, çalıştım, gittim. After any other sound it stays d: aldım, gördüm, uyudum.",
        "This tense reports something you witnessed or know for certain. Turkish has a second past for things you only heard about, which appears in the advanced phase.",
      ],
      table: {
        head: ["Person", "gel-", "çalış-"],
        rows: [
          ["ben", "geldim", "çalıştım"], ["sen", "geldin", "çalıştın"], ["o", "geldi", "çalıştı"],
          ["biz", "geldik", "çalıştık"], ["siz", "geldiniz", "çalıştınız"], ["onlar", "geldiler", "çalıştılar"],
        ],
      },
    },
    lessons: [
      {
        title: "Time words",
        goal: "Place events in time and tell a short story about your day.",
        tip: "Time words usually come first in the sentence: Dün eve geç geldim.",
        words: [
          "dün|yesterday", "bugün|today", "yarın|tomorrow", "şimdi|now", "sabah|morning",
          "akşam|evening", "geç|late", "çok|very, a lot",
        ],
        sentences: [
          "Dün eve geç geldim.|I came home late yesterday.",
          "Bugün çok yoruldum.|I got very tired today.",
          "Sabah kahve içtim.|I drank coffee in the morning.",
        ],
        drills: [
          "past1|al|I took", "past1|iç|I drank", "past1|gel|I came", "past2|gör|you saw",
          "past3|uyu|he slept", "past1|yap|I did",
        ],
      },
      {
        title: "Verbs of the day",
        goal: "Use eight more verbs in the past tense.",
        tip: "Before you add -DI, check the final sound of the stem. Hard consonant means t, anything else means d.",
        words: [
          "almak|to take, to buy", "vermek|to give", "görmek|to see", "bilmek|to know",
          "konuşmak|to speak", "çalışmak|to work, to study", "yürümek|to walk", "uyumak|to sleep",
        ],
        sentences: [
          "Dün seni gördüm.|I saw you yesterday.",
          "Ahmet dün çok çalıştı.|Ahmet worked a lot yesterday.",
          "Kitabı aldım.|I took the book.",
          "Dün gece iyi uyudum.|I slept well last night.",
        ],
        drills: [
          "past1|çalış|I worked", "past2|konuş|you spoke", "past3|çalış|he worked", "past2|ver|you gave",
          "past1|yürü|I walked", "past3|bil|he knew",
        ],
      },
    ],
  },
  {
    id: "i2",
    title: "Places and directions",
    summary: "Go to, be at and come from places, and find your way.",
    note: {
      title: "Cases: where Turkish puts prepositions",
      paragraphs: [
        "Turkish has no prepositions like to, in or from. It adds endings to the noun, and each ending follows the vowel harmony you already know. A buffer y appears when the noun ends in a vowel.",
        "Verbs decide which case they need. Gitmek (to go) takes the dative, so okula gidiyorum. Gelmek (to come) takes the ablative for where you come from, so evden geliyorum.",
        "The accusative -(y)I marks a specific, known object: Kitabı okudum means I read the book. Without it the object is general: Kitap okudum means I did some book reading. Some words soften before vowel endings (kitap becomes kitabı, ağaç becomes ağacı), so notice them as you meet them.",
      ],
      table: {
        head: ["Case", "Ending", "Example"],
        rows: [
          ["to (dative)", "-(y)A", "eve, okula"], ["in, at (locative)", "-DA", "evde, parkta"],
          ["from (ablative)", "-DAn", "evden, parktan"], ["the (accusative)", "-(y)I", "evi, arabayı"],
        ],
      },
    },
    lessons: [
      {
        title: "Places in town",
        goal: "Say where you are going, where you are and where you come from.",
        tip: "Ask the question first: to, at or from? That tells you which of the three endings you need.",
        words: [
          "okul|school", "hastane|hospital", "market|market, shop", "park|park", "istasyon|station",
          "havaalanı|airport", "şehir|city", "köy|village",
        ],
        sentences: [
          "Parka gidiyoruz.|We are going to the park.",
          "Evden çıkıyorum.|I am leaving the house.",
          "Havaalanından geliyorum.|I am coming from the airport.",
          "Hastanede çalışıyorum.|I work at the hospital.",
        ],
        drills: [
          "dative|okul|to school", "dative|şehir|to the city", "dative|araba|to the car",
          "dative|hastane|to the hospital", "ablative|park|from the park", "ablative|okul|from school",
          "locative|market|at the market", "locative|köy|in the village",
        ],
      },
      {
        title: "Finding your way",
        goal: "Ask where something is and understand directions.",
        tip: "Nerede means where. Hastane nerede? puts the thing first and the question word last.",
        words: [
          "sağ|right", "sol|left", "düz|straight", "yakın|near", "uzak|far", "nerede|where",
          "burada|here", "orada|there",
        ],
        sentences: [
          "Hastane nerede?|Where is the hospital?",
          "Hastane çok uzak değil.|The hospital is not very far.",
          "Sağa dönün, sonra düz gidin.|Turn right, then go straight.",
          "Market çok yakın.|The market is very close.",
        ],
        drills: [
          "accusative|ev|the house", "accusative|araba|the car", "accusative|kapı|the door",
          "accusative|okul|the school", "dative|istasyon|to the station", "ablative|hastane|from the hospital",
        ],
      },
    ],
  },
  {
    id: "i3",
    title: "People and shopping",
    summary: "Talk about family and handle a purchase.",
    note: {
      title: "Possession: my, your, his",
      paragraphs: [
        "Possession is a suffix on the thing owned: ev (house) becomes evim (my house), evin (your house), evi (his house), evimiz, eviniz, evleri. After a vowel the first-person ending is only -m: annem, babam.",
        "To say whose, put the owner in the genitive before it: Ahmet'in kardeşi means Ahmet's sibling. Names take an apostrophe before the ending. The pronouns benim, senin and bizim are optional and add emphasis: Benim adım Ali.",
        "To express having, combine possession with var or yok: Arabam var (I have a car) and Param yok (I have no money). There is no verb to have.",
      ],
      table: {
        head: ["Owner", "After a consonant", "After a vowel"],
        rows: [
          ["my", "-(I)m: evim", "-m: annem"], ["your", "-(I)n: evin", "-n: annen"], ["his, her", "-(s)I: evi", "-sI: annesi"],
          ["our", "-(I)mIz: evimiz", "-mIz: annemiz"],
        ],
      },
    },
    lessons: [
      {
        title: "Family and friends",
        goal: "Introduce your family and say what they do.",
        tip: "Family terms are almost always used with the possessive: annem, babam, kardeşim.",
        words: [
          "benim|my, mine", "senin|your", "bizim|our", "ad|name", "anne|mother", "baba|father",
          "kardeş|sibling", "arkadaş|friend",
        ],
        sentences: [
          "Benim adım Ali.|My name is Ali.",
          "Annem öğretmen.|My mother is a teacher.",
          "Babam doktor.|My father is a doctor.",
          "Ahmet'in iki kardeşi var.|Ahmet has two siblings.",
        ],
        drills: [
          "poss1|ad|my name", "poss1|anne|my mother", "poss1|baba|my father", "poss1|kardeş|my sibling",
          "poss1|arkadaş|my friend", "poss1|ev|my house", "poss1|okul|my school", "poss1|göz|my eye",
        ],
      },
      {
        title: "Shopping",
        goal: "Ask prices, compare and ask for the bill.",
        tip: "Daha means more and makes comparisons easy: daha ucuz is cheaper, daha büyük is bigger.",
        words: [
          "fiyat|price", "ucuz|cheap", "pahalı|expensive|pa-ha-LI", "para|money", "lira|lira", "kaç|how many",
          "daha|more", "hesap|bill, account",
        ],
        sentences: [
          "Bu kaç lira?|How many lira is this?",
          "Bu çok pahalı.|This is very expensive.",
          "Daha ucuz var mı?|Is there a cheaper one?",
          "Hesap, lütfen.|The bill, please.",
        ],
        drills: [
          "poss1|para|my money", "poss1|lira|my lira", "plural|lira|liras", "plural|fiyat|prices",
          "accusative|para|the money", "poss1|fiyat|my price",
        ],
      },
    ],
  },
  {
    id: "i4",
    title: "Plans and abilities",
    summary: "Make plans, say what you can do and what you must do.",
    note: {
      title: "Future, ability and necessity",
      paragraphs: [
        "The future is -(y)AcAk: gelecek (will come). Before a vowel the final k softens to ğ, so geleceğim (I will come) and geleceksin (you will come). Stems ending in t often change to d: gitmek becomes gideceğim.",
        "Ability uses -(y)Abil before the aorist: konuşabilirim means I can speak. For cannot, use -(y)AmA: konuşamıyorum. Requests use the same form as a question: Yardım edebilir misiniz? (Could you help?).",
        "Necessity combines a possessive verb noun with lazım or gerek: Gitmem lazım means I need to go. It is literally my going is necessary, and it is how Turkish speakers say must.",
      ],
    },
    lessons: [
      {
        title: "Travel plans",
        goal: "Talk about trips and book transport.",
        tip: "Place names take an apostrophe before the case ending: İstanbul'a, Antalya'ya.",
        words: [
          "seyahat|trip, travel", "tatil|holiday", "bilet|ticket", "otobüs|bus", "tren|train", "uçak|plane",
          "yolculuk|journey", "rezervasyon|reservation",
        ],
        sentences: [
          "Yarın İstanbul'a gideceğim.|I will go to Istanbul tomorrow.",
          "Tatilde Antalya'ya gideceğiz.|We will go to Antalya on holiday.",
          "Bilet alabilir miyim?|Can I buy a ticket?",
          "Türkçe konuşabiliyorum.|I can speak Turkish.",
        ],
        drills: [
          "fut1|gel|I will come", "fut1|oku|I will read", "fut1|al|I will take", "fut2|gel|you will come",
          "fut2|yap|you will do", "fut1|yap|I will do",
        ],
      },
      {
        title: "Needs and requests",
        goal: "Say what you need to do and ask for help politely.",
        tip: "Lazım and gerek are interchangeable. Pair them with a possessive verb noun: gitmem, kalkmam, yapmam.",
        words: [
          "lazım|necessary, needed", "gerek|need, necessary", "yardım|help", "erken|early", "kalkmak|to get up",
          "beklemek|to wait", "bulmak|to find", "aramak|to call, to search",
        ],
        sentences: [
          "Gitmem lazım.|I need to go.",
          "Yarın erken kalkmam gerek.|I need to get up early tomorrow.",
          "Yardım edebilir misiniz?|Could you help?",
          "Seni bekliyorum.|I am waiting for you.",
        ],
        drills: [
          "abil1|gel|I can come", "abil1|konuş|I can speak", "abil2|yap|you can do", "abil2|oku|you can read",
          "abil1|bul|I can find", "abil2|gel|you can come",
        ],
      },
    ],
  },
  {
    id: "i5",
    title: "Body and health",
    summary: "Say what hurts, describe how you feel and handle a visit to the pharmacy.",
    note: {
      title: "Negating the past and talking about pain",
      paragraphs: [
        "Pain is expressed with a possessive noun and the verb ağrımak: Başım ağrıyor means My head hurts, literally my head is aching. The body part takes the possessive, so başım, dişim, elim, gözüm.",
        "The negative past puts -mA between the stem and -DI: gelmedim (I did not come), yapmadım, görmedin. The two-way harmony gives me or ma, and the d never changes to t because a vowel always comes before it.",
        "Having an illness uses var: Ateşim var (I have a fever), Öksürüğüm var (I have a cough). To say you need something, combine the verb noun with lazım: İlaç almam lazım.",
      ],
      table: {
        head: ["Person", "gel-", "yap-"],
        rows: [
          ["ben", "gelmedim", "yapmadım"], ["sen", "gelmedin", "yapmadın"], ["o", "gelmedi", "yapmadı"],
          ["biz", "gelmedik", "yapmadık"], ["siz", "gelmediniz", "yapmadınız"], ["onlar", "gelmediler", "yapmadılar"],
        ],
      },
    },
    lessons: [
      {
        title: "Parts of the body",
        goal: "Name the body parts and say which one hurts.",
        tip: "Always use the possessive with body parts: Başım ağrıyor, not Baş ağrıyor. Turkish marks whose body part it is.",
        words: ["baş|head", "göz|eye", "el|hand", "ayak|foot", "ağız|mouth", "burun|nose", "kulak|ear", "diş|tooth"],
        sentences: [
          "Başım ağrıyor.|I have a headache.",
          "Dişim ağrıyor.|My tooth hurts.",
          "Elim soğuk.|My hand is cold.",
          "Ayağım ağrıyor.|My foot hurts.",
        ],
        drills: [
          "poss1|baş|my head", "poss1|el|my hand", "poss1|göz|my eye", "poss1|diş|my tooth",
          "poss2|el|your hand", "poss2|göz|your eye", "poss2|baş|your head", "poss2|diş|your tooth",
        ],
      },
      {
        title: "At the pharmacy",
        goal: "Describe symptoms, ask for medicine and say what you did not do.",
        tip: "Ask Ağrım var if you want to say you are in pain generally. Add the place: Karnım ağrıyor, Başım ağrıyor.",
        words: ["hasta|ill, patient", "ağrı|pain", "ateş|fever", "ilaç|medicine", "eczane|pharmacy", "sağlık|health", "öksürük|cough", "nezle|cold"],
        sentences: [
          "Ateşim var.|I have a fever.",
          "Eczaneye gidiyorum.|I am going to the pharmacy.",
          "İlaç almam lazım.|I need to buy medicine.",
          "Dün işe gitmedim.|I did not go to work yesterday.",
        ],
        drills: [
          "negpast1|git|I did not go", "negpast1|gel|I did not come", "negpast1|yap|I did not do", "negpast1|oku|I did not read",
          "negpast1|gör|I did not see", "negpast1|al|I did not take", "poss1|ateş|my fever", "locative|eczane|at the pharmacy",
        ],
      },
    ],
  },
  {
    id: "i6",
    title: "Clothes and shopping",
    summary: "Describe what you wear, try things on and compare sizes and prices.",
    note: {
      title: "The third person possessive and softening",
      paragraphs: [
        "The ending -(s)I means his, her or its, and it also builds compound nouns: ayakkabı mağazası (shoe shop), ceketin rengi (the color of the jacket). After a consonant it is just -I (ceketi), after a vowel it is -sI (elbisesi).",
        "Many nouns soften their final consonant before a vowel suffix: gömlek becomes gömleği, çorap becomes çorabı, ayak becomes ayağı. The hard consonants p, ç, t and k turn into b, c, d and ğ. One-syllable words mostly do not soften: top becomes topu.",
        "Adjectives can stand in for a noun by taking a suffix: Bir beden büyüğü var mı? asks Is there one a size bigger? The ending carries the thing that was left unsaid.",
      ],
      table: {
        head: ["Word", "Softened form", "Meaning"],
        rows: [["gömlek", "gömleği", "the shirt"], ["çorap", "çorabı", "the sock"], ["ayak", "ayağı", "the foot"], ["top", "topu", "the ball (no softening)"]],
      },
    },
    lessons: [
      {
        title: "Clothing",
        goal: "Name common clothes and say they are yours or his.",
        tip: "Use the accusative when you mean a specific item: Bu gömleği alıyorum (I am buying this shirt).",
        words: ["gömlek|shirt", "pantolon|trousers", "elbise|dress", "ayakkabı|shoe", "ceket|jacket", "şapka|hat", "çorap|sock", "mont|coat"],
        sentences: [
          "Bu gömleği denemek istiyorum.|I want to try this shirt.",
          "Pantolonum çok uzun.|My trousers are very long.",
          "Elbisesi çok güzel.|Her dress is very nice.",
          "Ayakkabılarım yeni.|My shoes are new.",
        ],
        drills: [
          "poss3|elbise|her dress", "poss3|ceket|his jacket", "poss3|pantolon|his trousers", "poss3|şapka|his hat",
          "accusative|pantolon|the trousers", "accusative|elbise|the dress", "accusative|ceket|the jacket", "accusative|mont|the coat",
        ],
      },
      {
        title: "Trying and buying",
        goal: "Ask for sizes, colors and discounts.",
        tip: "Bir beden büyük means one size bigger and bir beden küçük means one size smaller. Büyük and küçük are the same words you met for describing things.",
        words: ["beden|size", "renk|color", "denemek|to try", "uygun|suitable, reasonable", "indirim|discount", "kasa|checkout", "poşet|bag", "fatura|invoice"],
        sentences: [
          "Bir beden büyüğü var mı?|Is there one a size bigger?",
          "Rengi çok güzel.|Its color is very nice.",
          "Kasa nerede?|Where is the checkout?",
          "İndirim var mı?|Is there a discount?",
        ],
        drills: [
          "poss1|şapka|my hat", "poss1|ceket|my jacket", "poss1|pantolon|my trousers", "poss3|mont|his coat",
          "plural|beden|sizes", "plural|fatura|invoices", "accusative|fatura|the invoice", "accusative|poşet|the bag",
        ],
      },
    ],
  },
  {
    id: "i7",
    title: "Months and seasons",
    summary: "Give dates, name the months and talk about the seasons.",
    note: {
      title: "Time expressions with the locative",
      paragraphs: [
        "Months take the locative to mean in: mayısta (in May), ekimde (in October), şubatta (in February). The choice between -da, -de, -ta and -te follows the harmony rules you already know.",
        "For seasons you often add -In, which means in the season of: yazın (in summer), kışın (in winter), ilkbaharda (in spring). Dates put the day number first: on beş mayıs (15 May).",
        "To say when something happens, put the time at the front of the sentence: Ekimde okula başlıyorum. Question and answer work as in English: Doğum günün ne zaman? Mayısta.",
      ],
      table: {
        head: ["Month", "In the month", "Season"],
        rows: [["ocak", "ocakta", "kış (winter)"], ["nisan", "nisanda", "ilkbahar (spring)"], ["temmuz", "temmuzda", "yaz (summer)"], ["ekim", "ekimde", "sonbahar (autumn)"]],
      },
    },
    lessons: [
      {
        title: "Seasons and the first months",
        goal: "Name the seasons and the first four months, and say what happens when.",
        tip: "Ilkbahar and sonbahar are the spring and autumn seasons, while bahar means spring in general. You will hear all of them.",
        words: ["ilkbahar|spring", "yaz|summer", "sonbahar|autumn", "kış|winter", "ocak|January", "şubat|February", "mart|March", "nisan|April"],
        sentences: [
          "Kış çok soğuk.|Winter is very cold.",
          "Yazın denize gidiyoruz.|In summer we go to the sea.",
          "Doğum günüm mayısta.|My birthday is in May.",
          "Nisanda yağmur yağıyor.|It rains in April.",
        ],
        drills: [
          "locative|ocak|in January", "locative|şubat|in February", "locative|mart|in March", "locative|nisan|in April",
          "locative|yaz|in summer", "poss1|doğum|my birth", "plural|mevsim|seasons", "locative|bahar|in spring",
        ],
      },
      {
        title: "The rest of the year",
        goal: "Name the other eight months and give dates.",
        tip: "Months are lowercase in Turkish unless they start a sentence.",
        words: ["mayıs|May", "haziran|June", "temmuz|July", "ağustos|August", "eylül|September", "ekim|October", "kasım|November", "aralık|December"],
        sentences: [
          "Temmuz çok sıcak.|July is very hot.",
          "Ekimde okula başlıyorum.|I start school in October.",
          "Aralıkta kar yağıyor.|It snows in December.",
          "Doğum günüm kasımda.|My birthday is in November.",
        ],
        drills: [
          "locative|mayıs|in May", "locative|haziran|in June", "locative|temmuz|in July", "locative|ağustos|in August",
          "locative|eylül|in September", "locative|ekim|in October", "locative|kasım|in November", "locative|aralık|in December",
        ],
      },
    ],
  },
  {
    id: "i8",
    title: "Hobbies and invitations",
    summary: "Talk about what you like doing and invite someone out.",
    note: {
      title: "Let us, liking to do, wanting to do",
      paragraphs: [
        "To suggest an activity, use -(y)AlIm: gidelim (let us go), yapalım (let us do it), okuyalım (let us read). Add mI to make it a question: Sinemaya gidelim mi? (Shall we go to the cinema?).",
        "To say you like doing something, use the verb noun -mAk with an accusative ending: Futbol oynamayı seviyorum (I like playing football). With istemek the infinitive stays bare: Müzik dinlemek istiyorum.",
        "For availability use müsait or boş: Cumartesi müsait misin? (Are you free on Saturday?). Birlikte (together) and hafta sonu (weekend) are both very common in invitations.",
      ],
      table: {
        head: ["Pattern", "Example", "Meaning"],
        rows: [
          ["-(y)AlIm", "gidelim", "let us go"], ["-mAk istemek", "gitmek istiyorum", "I want to go"],
          ["-mAyI sevmek", "gitmeyi seviyorum", "I like going"],
        ],
      },
    },
    lessons: [
      {
        title: "Free time",
        goal: "Name activities and say what you like to do.",
        tip: "Oynamak is used for games, sports and instruments: futbol oynamak, gitar çalmak uses çalmak for instruments instead.",
        words: ["müzik|music", "film|film", "spor|sport", "futbol|football", "yüzmek|to swim", "koşmak|to run", "gezmek|to tour, to wander", "oynamak|to play"],
        sentences: [
          "Futbol oynamayı seviyorum.|I like playing football.",
          "Müzik dinlemek istiyorum.|I want to listen to music.",
          "Her sabah koşuyorum.|I run every morning.",
          "Hafta sonu şehri geziyoruz.|At the weekend we tour the city.",
        ],
        drills: [
          "inf|yüz|to swim", "inf|koş|to run", "inf|gez|to tour", "inf|oyna|to play",
          "lets|gez|let us tour", "lets|koş|let us run", "lets|yüz|let us swim", "lets|oyna|let us play",
        ],
      },
      {
        title: "Making plans together",
        goal: "Invite someone, accept, and arrange a time.",
        tip: "Answer an invitation with Olur (that works) or Maalesef müsait değilim (sorry, I am not free).",
        words: ["davet|invitation", "sinema|cinema", "konser|concert", "parti|party", "hafta sonu|weekend", "birlikte|together", "buluşmak|to meet up", "müsait|free, available"],
        sentences: [
          "Hafta sonu sinemaya gidelim mi?|Shall we go to the cinema at the weekend?",
          "Cumartesi müsait misin?|Are you free on Saturday?",
          "Partiye birlikte gidelim.|Let us go to the party together.",
          "Seni konsere davet ediyorum.|I am inviting you to the concert.",
        ],
        drills: [
          "lets|gel|let us come", "lets|yap|let us do", "lets|oku|let us read", "lets|gör|let us see",
          "lets|al|let us take", "lets|bak|let us look", "dative|sinema|to the cinema", "dative|parti|to the party",
        ],
      },
    ],
  },
  {
    id: "i9",
    title: "Getting around town",
    summary: "Use public transport, give an address and describe a route.",
    note: {
      title: "Genitive and compound nouns",
      paragraphs: [
        "The genitive -(n)In shows who owns something, and it pairs with the possessive ending on the thing owned: şehrin merkezi (the center of the city), okulun kapısı (the door of the school). Two endings, one idea.",
        "A noun compound with no genitive means a type of thing: taksi durağı (taxi stand), otobüs bileti (bus ticket). The first noun has no ending, and the second takes the possessive -(s)I.",
        "By means of is the suffix -(y)lA, written as a separate word ile when it stands alone: otobüsle gidiyorum or otobüs ile gidiyorum. To get on a vehicle use binmek, and to get off use inmek.",
      ],
      table: {
        head: ["Noun", "Genitive", "Possessed form"],
        rows: [["ev", "evin", "evi"], ["araba", "arabanın", "arabası"], ["okul", "okulun", "okulu"], ["şehir", "şehrin", "şehri"]],
      },
    },
    lessons: [
      {
        title: "Streets and stops",
        goal: "Name the parts of a city and say where you are.",
        tip: "Locative -DA works for streets and stops: durakta (at the stop), caddede (on the avenue).",
        words: ["yol|road", "cadde|avenue", "sokak|street", "köprü|bridge", "durak|stop", "taksi|taxi", "metro|metro", "vapur|ferry"],
        sentences: [
          "Otobüse bu durakta biniyorum.|I get on the bus at this stop.",
          "Metro ile işe gidiyorum.|I go to work by metro.",
          "Bir sonraki durakta ineceğim.|I will get off at the next stop.",
          "Taksiyle havaalanına gidiyoruz.|We are going to the airport by taxi.",
        ],
        drills: [
          "locative|durak|at the stop", "locative|cadde|on the avenue", "locative|sokak|on the street", "locative|köprü|on the bridge",
          "locative|yol|on the road", "locative|taksi|in the taxi", "locative|metro|on the metro", "locative|vapur|on the ferry",
        ],
      },
      {
        title: "Directions and traffic",
        goal: "Understand directions and describe traffic and distance.",
        tip: "Dönün and gidin are polite commands for siz. With a friend say dön and git.",
        words: ["binmek|to get on, to ride", "inmek|to get off", "aktarma|transfer", "trafik|traffic", "dakika|minute", "kavşak|intersection", "adres|address", "harita|map"],
        sentences: [
          "Kavşaktan sağa dönün.|Turn right at the intersection.",
          "Trafik çok yoğun.|The traffic is very heavy.",
          "Haritaya bakıyorum.|I am looking at the map.",
          "Adresi biliyor musun?|Do you know the address?",
        ],
        drills: [
          "gen|yol|of the road", "gen|cadde|of the avenue", "gen|köprü|of the bridge", "gen|taksi|of the taxi",
          "gen|metro|of the metro", "gen|vapur|of the ferry", "gen|harita|of the map", "dative|harita|to the map",
        ],
      },
    ],
  },
  {
    id: "i10",
    title: "Habits and routines",
    summary: "Say what you always, usually and never do, with the aorist tense.",
    note: {
      title: "The aorist: habits and general truths",
      paragraphs: [
        "The aorist describes what usually happens or is generally true: Her sabah kahve içerim (I drink coffee every morning), Su sıfır derecede donar (Water freezes at zero). It is also the tense for polite offers and requests.",
        "Build it from the stem plus -r. After a vowel add just -r: okur. For a stem of two or more syllables add -Ir: çalışır. For one-syllable verbs add -Ar (yapar, açar, içer), except thirteen common ones that take -Ir: al, bil, bul, dur, gel, gör, kal, ol, öl, san, var, ver, vur.",
        "Add the personal endings after that: yaparım, yaparsın, yapar, yaparız, yaparsınız, yaparlar. Negative aorist is different: yapmam (I do not do it), yapmazsın, yapmaz, yapmayız. With the past marker you get habits in the past: yapardım (I used to do it).",
      ],
      table: {
        head: ["Stem", "Aorist", "Rule"],
        rows: [
          ["yap-", "yapar", "one syllable, -Ar"], ["gel-", "gelir", "one of the 13, -Ir"], ["çalış-", "çalışır", "two syllables, -Ir"],
          ["oku-", "okur", "vowel stem, -r"], ["git-", "gider", "t softens to d"],
        ],
      },
    },
    lessons: [
      {
        title: "How often",
        goal: "Say how often things happen and describe your habits.",
        tip: "Frequency words go before the verb: Her zaman erken kalkarım. The aorist verb stays at the end.",
        words: ["her zaman|always", "genellikle|usually", "bazen|sometimes", "asla|never", "sık sık|often", "her gün|every day", "hiç|never, not at all", "çoğu zaman|most of the time"],
        sentences: [
          "Genellikle sabah kahve içerim.|I usually drink coffee in the morning.",
          "Her gün Türkçe çalışırım.|I study Turkish every day.",
          "Her zaman erken kalkarım.|I always get up early.",
          "Bazen yürüyerek işe giderim.|Sometimes I walk to work.",
        ],
        drills: [
          "aor1|yap|I do", "aor1|gel|I come", "aor1|oku|I read", "aor1|çalış|I work",
          "aor1|gör|I see", "aor1|sev|I like", "aor1|ver|I give", "aor1|kal|I stay",
        ],
      },
      {
        title: "Chores and routines",
        goal: "Describe household tasks and what you do each week.",
        tip: "The negative aorist is different: kalmam means I never stay, gelmem means I do not come.",
        words: ["pişirmek|to cook", "temizlemek|to clean", "yıkamak|to wash", "kullanmak|to use", "taşımak|to carry", "toplamak|to collect, to tidy", "değiştirmek|to change", "ödemek|to pay"],
        sentences: [
          "Akşam yemek pişiririm.|I cook dinner in the evening.",
          "Odamı her hafta temizlerim.|I clean my room every week.",
          "Faturayı internetten öderim.|I pay the bill online.",
          "Asla geç kalmam.|I am never late.",
        ],
        drills: [
          "aor2|yaz|you write", "aor2|al|you take", "aor2|bil|you know", "aor2|bul|you find",
          "aor2|aç|you open", "aor2|gel|you come", "aor3|yap|he does", "aor3|gel|he comes",
        ],
      },
    ],
  },
];
