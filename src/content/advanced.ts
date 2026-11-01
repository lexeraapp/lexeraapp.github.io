import type { RawUnit } from "../core/types.ts";

/** Phase 3, roughly CEFR B1, ten units. */
export const ADVANCED: RawUnit[] = [
  {
    id: "a1",
    title: "Hearsay and opinion",
    summary: "Report what you heard, discovered or think, with the second past tense.",
    note: {
      title: "Evidentiality: -mIş",
      paragraphs: [
        "Turkish marks how you know something. The -DI past says I saw it or I know it for certain. The -mIş past says I heard it, I inferred it, or I just discovered it: Ali gelmiş means Apparently Ali has come.",
        "It is also the tense of surprise and of storytelling. Seeing wet streets you say Yağmur yağmış (it must have rained), and fairy tales open with -mIş forms. Using -DI for something you did not witness can sound odd.",
        "The ending is four-way: gelmiş, almış, olmuş, görmüş. Add personal endings as in the other tenses: gelmişim, gelmişsin, gelmiş, gelmişiz.",
      ],
      table: {
        head: ["Sentence", "Meaning"],
        rows: [
          ["Ali geldi.", "Ali came (I saw it)."],
          ["Ali gelmiş.", "Apparently Ali came."],
          ["Toplantıyı unuttum.", "I forgot the meeting (I know)."],
          ["Toplantıyı unutmuşum.", "I seem to have forgotten the meeting."],
        ],
      },
    },
    lessons: [
      {
        title: "Telling and learning",
        goal: "Report news and discoveries without claiming you saw them.",
        tip: "Reach for -mIş when the information arrived second hand or by surprise.",
        words: [
          "duymak|to hear", "anlatmak|to tell, to narrate", "öğrenmek|to learn", "unutmak|to forget",
          "hatırlamak|to remember", "haber|news", "hikâye|story", "belki|maybe",
        ],
        sentences: [
          "Dün çok yağmur yağmış.|Apparently it rained a lot yesterday.",
          "Ali bu şehre taşınmış.|Apparently Ali moved to this city.",
          "Toplantıyı unutmuşum.|I seem to have forgotten the meeting.",
          "Ayşe Türkçe öğrenmiş.|Apparently Ayşe has learned Turkish.",
        ],
        drills: [
          "evid|gel|apparently came", "evid|uyu|apparently slept", "evid|kaç|apparently ran away",
          "evid|unut|apparently forgot", "evid|öğren|apparently learned", "evid|gör|apparently saw",
        ],
      },
      {
        title: "Opinions and reasons",
        goal: "Give your view, contrast ideas and explain why.",
        tip: "Çünkü starts the reason clause: Gelmedim çünkü hastaydım. Put the result first, then the reason.",
        words: [
          "bence|in my opinion", "sanırım|I suppose, I think", "kesinlikle|definitely", "aslında|actually",
          "ama|but", "çünkü|because", "hâlâ|still", "ancak|however, only",
        ],
        sentences: [
          "Bence bu film çok güzel.|In my opinion this film is very good.",
          "Aslında bunu bilmiyordum.|Actually I did not know this.",
          "Gelmedim çünkü hastaydım.|I did not come because I was ill.",
          "Hâlâ Türkçe öğreniyorum.|I am still learning Turkish.",
        ],
        drills: [
          "evid|bil|apparently knew", "past3|ol|it became", "past3|git|he went", "evid|ol|apparently became",
          "evid|git|apparently went", "evid|ye|apparently ate",
        ],
      },
    ],
  },
  {
    id: "a2",
    title: "If, weather and work",
    summary: "Speak about conditions, wishes and the working world.",
    note: {
      title: "Conditionals: -sA",
      paragraphs: [
        "The conditional ending is -sA (se or sa), followed by a personal ending: gelsem (if I come), gelsen, gelse, gelsek, gelseniz, gelseler. For a likely future condition use the aorist first: Yağmur yağarsa evde kalırız (If it rains we stay in).",
        "For unreal or contrary-to-fact conditions add the past marker: Vaktim olsaydı gelirdim (If I had time I would come). The same -sAydI form with keşke expresses regret or a wish: Keşke burada olsaydın (I wish you were here).",
        "Eğer (if) is optional and mostly adds emphasis. The conditional verb already says if.",
      ],
      table: {
        head: ["Person", "Ending", "Example"],
        rows: [
          ["ben", "-sAm", "gelsem"], ["sen", "-sAn", "gelsen"], ["o", "-sA", "gelse"],
          ["biz", "-sAk", "gelsek"], ["siz", "-sAnIz", "gelseniz"], ["onlar", "-sAlAr", "gelseler"],
        ],
      },
    },
    lessons: [
      {
        title: "Weather and wishes",
        goal: "Describe the weather and make real and unreal conditions.",
        tip: "Ask whether the condition could still happen. If yes use -Ar + sA. If no, use -sAydI.",
        words: [
          "hava|weather, air", "yağmur|rain", "kar|snow", "güneş|sun", "rüzgâr|wind", "soğuk|cold",
          "sıcak|hot", "eğer|if",
        ],
        sentences: [
          "Yağmur yağarsa evde kalırız.|If it rains we will stay at home.",
          "Vaktim olsa gelirdim.|If I had time I would come.",
          "Hava güzel olursa parka gideriz.|If the weather is nice we will go to the park.",
          "Keşke burada olsaydın.|I wish you were here.",
        ],
        drills: [
          "cond|ol|if (it) is", "cond|gel|if (he) comes", "cond|yap|if (he) does", "cond|git|if (he) goes",
          "cond|bil|if (he) knows", "cond|kal|if (he) stays",
        ],
      },
      {
        title: "Work and career",
        goal: "Talk about your job, meetings and applications.",
        tip: "Three years of work is üç yıldır with -dIr: this durative ending means for or since and pairs with the present.",
        words: [
          "iş|job, work", "toplantı|meeting", "müdür|manager", "maaş|salary", "şirket|company",
          "başvuru|application", "deneyim|experience", "görüşme|interview, meeting",
        ],
        sentences: [
          "Yarın önemli bir toplantım var.|I have an important meeting tomorrow.",
          "Şirkette üç yıldır çalışıyorum.|I have been working at the company for three years.",
          "İş görüşmesine hazırlanıyorum.|I am preparing for the job interview.",
          "Müdür toplantıya gelmedi.|The manager did not come to the meeting.",
        ],
        drills: [
          "poss1|toplantı|my meeting", "locative|şirket|at the company", "ablative|iş|from work",
          "dative|toplantı|to the meeting", "plural|müdür|managers", "accusative|müdür|the manager",
          "poss1|iş|my job",
        ],
      },
    ],
  },
  {
    id: "a3",
    title: "Voice and linking",
    summary: "Use the passive, make things happen, and join clauses.",
    note: {
      title: "Passive, causative and clause linking",
      paragraphs: [
        "The passive drops the doer: Kapı açıldı (The door was opened). Add -Il after a consonant, -n after a vowel and -In after l: açıl-, okun-, bilin-. Then add tense endings as usual. Turkish uses the passive often in announcements and signs: Burada Türkçe konuşulur.",
        "The causative makes someone do something or lets you have it done: kes (cut) becomes kestirdim (I had it cut). Common markers are -DIr, -t, -Ir and -Ar, and each verb prefers one.",
        "Clauses are joined by verb endings rather than by words like while or after: -ken (while: yürürken), -dIktAn sonra (after: yedikten sonra), -mAdAn önce (before: gitmeden önce) and -mAk için (in order to: öğrenmek için).",
      ],
      table: {
        head: ["Pattern", "Meaning", "Example"],
        rows: [
          ["-(y)ken", "while", "yürürken"], ["-DIktAn sonra", "after", "yedikten sonra"],
          ["-mAdAn önce", "before", "gitmeden önce"], ["-mAk için", "in order to", "öğrenmek için"],
        ],
      },
    },
    lessons: [
      {
        title: "Things get done",
        goal: "Describe actions without naming who did them.",
        tip: "Use the passive when the doer is unknown or unimportant, and keep an active verb when it matters.",
        words: [
          "açmak|to open", "kapatmak|to close", "yazmak|to write", "satmak|to sell", "göndermek|to send",
          "kırmak|to break", "kesmek|to cut", "dinlemek|to listen",
        ],
        sentences: [
          "Kapı açıldı.|The door was opened.",
          "Burada Türkçe konuşulur.|Turkish is spoken here.",
          "Bu kitap 1990'da yazıldı.|This book was written in 1990.",
          "Saçımı kestirdim.|I had my hair cut.",
        ],
        drills: [
          "passpast|aç|was opened", "passpast|yaz|was written", "passpast|gönder|was sent",
          "passpast|kapat|was closed", "passpast|sat|was sold", "passpast|kır|was broken",
          "passpast|kes|was cut", "passpast|yap|was done",
        ],
      },
      {
        title: "Before, after, while",
        goal: "Order events and give reasons in longer sentences.",
        tip: "The verb before sonra or önce is in a noun form: yedikten sonra, gitmeden önce.",
        words: [
          "sonra|after, then", "önce|before, first", "için|for, in order to", "rağmen|despite",
          "kadar|until, as much as", "beri|since", "sırasında|during", "yüzünden|because of",
        ],
        sentences: [
          "Yürürken müzik dinliyorum.|I listen to music while walking.",
          "Yemek yedikten sonra çay içtik.|After eating we drank tea.",
          "Gitmeden önce beni ara.|Call me before you go.",
          "Türkçe öğrenmek için çalışıyorum.|I am studying in order to learn Turkish.",
        ],
      },
    ],
  },
  {
    id: "a4",
    title: "Ideas and etiquette",
    summary: "Describe people and things with clauses, and use real social formulae.",
    note: {
      title: "Relative clauses come first",
      paragraphs: [
        "Turkish has no word for who, which or that. A whole clause becomes an adjective that sits before the noun. Kapıda bekleyen adam means the man who is waiting at the door, built as the clause bekleyen then adam.",
        "When the noun is the subject, use -(y)An: gelen, okuyan, bekleyen. When the noun is the object or something else, use -DIK plus a possessive ending for the doer: okuduğum kitap (the book that I read), gördüğün adam (the man that you saw).",
        "Turkish also runs on fixed formulae that have no English match: Kolay gelsin to someone working, Geçmiş olsun to someone ill, Afiyet olsun before a meal, Eline sağlık to the cook. Using them correctly sounds natural to native ears.",
      ],
      table: {
        head: ["Type", "Pattern", "Example"],
        rows: [
          ["subject", "-(y)An", "okuyan öğrenci"], ["object, I", "-DIğIm", "okuduğum kitap"],
          ["object, you", "-DIğIn", "gördüğün adam"],
        ],
      },
    },
    lessons: [
      {
        title: "Describing with clauses",
        goal: "Build relative clauses and name abstract ideas.",
        tip: "Read the clause backward: find the noun, then ask who does what to it.",
        words: [
          "kişi|person", "mesele|matter, issue", "fikir|idea", "gerçek|truth, real", "sebep|reason",
          "sonuç|result", "amaç|aim, purpose", "durum|situation",
        ],
        sentences: [
          "Kapıda bekleyen adam kim?|Who is the man waiting at the door?",
          "Okuduğum kitap çok güzel.|The book I read is very good.",
          "Gördüğün adam benim öğretmenim.|The man you saw is my teacher.",
          "Bildiğim kadarıyla toplantı yarın.|As far as I know the meeting is tomorrow.",
        ],
        drills: [
          "rel|bekle|who waits", "rel|oku|who reads", "rel|gel|who comes", "rel|çalış|who works",
          "part1|oku|what I read", "part1|yap|what I did", "part2|gör|what you saw", "part2|bil|what you know",
        ],
      },
      {
        title: "Social formulae",
        goal: "Say the right thing at work, at the table and in hard moments.",
        tip: "These phrases are fixed and say what you wish for the other person. Learn them whole, not word by word.",
        words: [
          "kolay gelsin|may your work be easy", "geçmiş olsun|get well soon", "afiyet olsun|enjoy your meal",
          "hayırlı olsun|congratulations, may it be blessed", "başınız sağ olsun|my condolences",
          "eline sağlık|bless your hands (to a cook)", "çok yaşa|bless you (after a sneeze)", "inşallah|God willing, hopefully",
        ],
        sentences: [
          "Eline sağlık, yemek çok güzel olmuş.|Bless your hands, the meal turned out very good.",
          "Geçmiş olsun, nasıl hissediyorsun?|Get well soon, how are you feeling?",
          "Yeni işin hayırlı olsun.|Congratulations on your new job.",
          "Yarın görüşürüz, inşallah.|See you tomorrow, God willing.",
        ],
      },
    ],
  },
  {
    id: "a5",
    title: "Discussion and decisions",
    summary: "Share opinions, agree and disagree, suggest solutions and decide.",
    note: {
      title: "Obligation and suggestion: -mAlI",
      paragraphs: [
        "You already know lazım and gerek for need. For must or should, add -mAlI to the verb: gitmeliyim (I must go), yapmalısın (you must do it), gelmeli (he should come). The last vowel of the suffix is i or ı to match its a or e.",
        "The negative is -mA before -mAlI: gitmemeliyim (I must not go). For a softer should, Turkish also uses -sA iyi olur (it would be good if): Erken yatsan iyi olur.",
        "Opinion verbs are bence (in my opinion), katılıyorum (I agree), katılmıyorum (I disagree), tavsiye ederim (I recommend). The pattern X ile ilgili... (about X) introduces a topic and works well in formal discussion.",
      ],
      table: {
        head: ["Person", "gel-", "yap-"],
        rows: [
          ["ben", "gelmeliyim", "yapmalıyım"], ["sen", "gelmelisin", "yapmalısın"], ["o", "gelmeli", "yapmalı"],
          ["biz", "gelmeliyiz", "yapmalıyız"], ["siz", "gelmelisiniz", "yapmalısınız"], ["onlar", "gelmeliler", "yapmalılar"],
        ],
      },
    },
    lessons: [
      {
        title: "Debating",
        goal: "Agree, disagree and decide.",
        tip: "Katılıyorum alone means I agree. Add sana to say with you: Sana katılıyorum.",
        words: [
          "katılmak|to agree, to join", "itiraz etmek|to object", "tartışmak|to discuss, to argue", "önermek|to suggest",
          "karar vermek|to decide", "seçmek|to choose", "kabul etmek|to accept", "reddetmek|to reject",
        ],
        sentences: [
          "Bu konuda sana katılıyorum.|I agree with you on this topic.",
          "Önerimi kabul ettiler.|They accepted my suggestion.",
          "Karar vermek kolay değil.|Deciding is not easy.",
          "Sorun şu ki zamanımız yok.|The problem is that we have no time.",
        ],
        drills: [
          "part1|seç|what I chose", "part1|bul|what I found", "part1|ver|what I gave", "part1|öner|what I suggested",
          "part2|gör|what you saw", "part2|bil|what you know", "part2|seç|what you chose", "part2|yap|what you did",
        ],
      },
      {
        title: "Problems and solutions",
        goal: "Describe a problem, propose a solution and say what must be done.",
        tip: "Bulmalıyız says we must find. Bulmamız lazım says it is necessary for us to find. Both are natural.",
        words: [
          "görüş|opinion, view", "avantaj|advantage", "dezavantaj|disadvantage", "konu|topic", "sorun|problem", "çözüm|solution", "yöntem|method", "öneri|suggestion",
        ],
        sentences: [
          "Bir çözüm bulmamız lazım.|We need to find a solution.",
          "Bu yöntemin bir avantajı var.|This method has an advantage.",
          "Konuyu tekrar düşünmeliyiz.|We must think about the topic again.",
          "Önerim çok basit.|My suggestion is very simple.",
        ],
        drills: [
          "must|yap|must do", "must|gel|must come", "must|oku|must read", "must|gör|must see",
          "must|bil|must know", "must|çalış|must work", "poss1|sorun|my problem", "poss1|çözüm|my solution",
        ],
      },
    ],
  },
  {
    id: "a6",
    title: "Culture and travel in Turkey",
    summary: "Talk about museums, holidays and hospitality, and use the light verbs etmek and olmak.",
    note: {
      title: "Compound verbs with etmek, olmak and yapmak",
      paragraphs: [
        "Turkish borrowed many nouns, and it makes verbs from them with etmek (to do), olmak (to be, to become) and sometimes yapmak: ziyaret etmek (to visit), yardım etmek (to help), tavsiye etmek (to recommend), memnun olmak (to be pleased), hasta olmak (to fall ill).",
        "The inflection falls on the light verb, not the noun: ziyaret ederim, yardım edebilir misiniz. Note that the t of etmek softens to d before a vowel: ederim, edeceğim, ediyorum.",
        "Cultural vocabulary often has no neat English match. İkram (the host's treat), misafirperverlik (hospitality) and bayram (a holiday for which families gather) carry a whole set of expectations. The aorist suits customs: Camiye girerken ayakkabılarımızı çıkarırız.",
      ],
      table: {
        head: ["Noun", "Light verb", "Meaning"],
        rows: [["ziyaret", "etmek", "to visit"], ["yardım", "etmek", "to help"], ["memnun", "olmak", "to be pleased"], ["hasta", "olmak", "to fall ill"]],
      },
    },
    lessons: [
      {
        title: "Places and heritage",
        goal: "Name cultural places and say you want to visit them.",
        tip: "Visit a place with gezmek (tour) or ziyaret etmek (visit formally). Müzeyi geziyorum is more casual.",
        words: ["müze|museum", "cami|mosque", "çarşı|bazaar", "saray|palace", "tarih|history", "kültür|culture", "gelenek|tradition", "bayram|festival, holiday"],
        sentences: [
          "Bayramda ailemi ziyaret ederim.|I visit my family at the holiday.",
          "Müzeyi gezmek istiyoruz.|We want to tour the museum.",
          "Camiye girerken ayakkabılarımızı çıkarırız.|When entering a mosque we take off our shoes.",
          "Çarşıda çok güzel hediyeler var.|There are very nice gifts in the bazaar.",
        ],
        drills: [
          "dative|müze|to the museum", "dative|cami|to the mosque", "dative|çarşı|to the bazaar", "dative|saray|to the palace",
          "locative|müze|in the museum", "locative|cami|in the mosque", "ablative|cami|from the mosque", "ablative|saray|from the palace",
        ],
      },
      {
        title: "Hospitality and recommendations",
        goal: "Receive guests, accept an offer and ask for recommendations.",
        tip: "Refusing a first offer is polite; the host will offer again. A warm Eline sağlık or Ağzına sağlık after the meal is expected.",
        words: ["misafir|guest", "ikram|treat, offer of food", "lezzet|flavor", "gezi|trip, tour", "rehber|guide", "tavsiye|recommendation", "yöre|region", "hatıra|souvenir, memory"],
        sentences: [
          "Bana bir yer tavsiye edebilir misiniz?|Could you recommend a place to me?",
          "Misafirlerimize çay ikram ettik.|We offered tea to our guests.",
          "Bu yörenin yemekleri çok lezzetli.|The food of this region is very delicious.",
          "Rehber bize tarihi anlattı.|The guide told us about the history.",
        ],
        drills: [
          "plural|misafir|guests", "plural|rehber|guides", "plural|gezi|trips", "poss1|misafir|my guest",
          "poss1|gezi|my trip", "poss1|rehber|my guide", "accusative|rehber|the guide", "accusative|gezi|the trip",
        ],
      },
    ],
  },
  {
    id: "a7",
    title: "Work, technology and reporting",
    summary: "Talk about digital life and work projects, and report what others said.",
    note: {
      title: "Reporting what was said: noun clauses",
      paragraphs: [
        "To report, Turkish turns the statement into a noun and puts it in the accusative. Ali yarın geliyor becomes Ali yarın geleceğini söyledi (Ali said he will come tomorrow). The future verb takes -AcAK plus a possessive ending (-ği) and then the case ending (-ni).",
        "The pattern is verb stem, -DIK or -AcAK, a possessive ending for who does it, and a case ending: geldiğini, gideceğimi, bildiğimi. Past and present use -DIK: Geldiğini biliyorum (I know that he came).",
        "A shorter spoken route is diye, which quotes: Geleceğim diye söyledi (He said, I will come). Diye also means in order to, so context decides: İşi bitireyim diye erken geldim.",
      ],
      table: {
        head: ["Direct", "Reported", "Meaning"],
        rows: [
          ["Geliyorum.", "Geldiğimi söyledi.", "He said I came."], ["Yarın gelirim.", "Yarın geleceğimi söyledi.", "He said I will come tomorrow."],
          ["Bunu biliyorum.", "Bunu bildiğimi söyledi.", "He said I know this."],
        ],
      },
    },
    lessons: [
      {
        title: "Digital life",
        goal: "Talk about devices, passwords and messages.",
        tip: "Computer terms are mostly loanwords. They follow the harmony of their last vowel: bilgisayarım, mesajım.",
        words: ["bilgisayar|computer", "internet|internet", "e-posta|email", "ekran|screen", "şifre|password", "uygulama|app", "mesaj|message", "dosya|file"],
        sentences: [
          "Bilgisayarım çalışmıyor.|My computer is not working.",
          "Şifremi unuttum.|I forgot my password.",
          "Müşteriye e-posta gönderdim.|I sent an email to the customer.",
          "Dosyayı sana gönderiyorum.|I am sending you the file.",
        ],
        drills: [
          "poss1|bilgisayar|my computer", "poss1|şifre|my password", "poss1|mesaj|my message", "poss1|dosya|my file",
          "accusative|dosya|the file", "accusative|mesaj|the message", "accusative|ekran|the screen", "poss1|ekran|my screen",
        ],
      },
      {
        title: "Projects and reports",
        goal: "Describe a project, give status updates and report what was said.",
        tip: "Verbs of saying take the accusative noun clause: söyledi, açıkladı, dedi that. Practise with Geleceğini söyledi.",
        words: ["rapor|report", "proje|project", "takım|team", "müşteri|customer", "süre|period, deadline", "başarı|success", "hata|mistake", "hedef|target, goal"],
        sentences: [
          "Bu raporu yarına kadar göndermem lazım.|I need to send this report by tomorrow.",
          "Projeyi zamanında bitirdik.|We finished the project on time.",
          "Müdür toplantıya geleceğini söyledi.|The manager said he will come to the meeting.",
          "Hatayı fark ettiğimi söyledim.|I said I noticed the mistake.",
        ],
        drills: [
          "poss1|rapor|my report", "poss1|proje|my project", "poss1|hata|my mistake", "poss1|hedef|my goal",
          "accusative|rapor|the report", "accusative|proje|the project", "accusative|hata|the mistake", "accusative|hedef|the goal",
        ],
      },
    ],
  },
  {
    id: "a8",
    title: "Nature and the news",
    summary: "Describe the environment, read about current events and build adjectives from nouns.",
    note: {
      title: "Building adjectives: -lI, -sIz and participles",
      paragraphs: [
        "You met -lI and -sIz in the food unit. Here they work on weather and nature: yağmurlu (rainy), güneşli (sunny), karlı (snowy), rüzgârlı (windy). Combined with hava they give weather in a word: Hava yağmurlu.",
        "Participles are also adjectives. -(y)An describes who does something: yürüyen çocuk (the walking child). -DIK with a possessive describes what is done to something: gördüğüm film (the film I saw), duyduğun haber (the news you heard).",
        "News vocabulary is often abstract: gelişme (development), değişim (change), toplum (society), eğitim (education). They mostly take regular suffixes and give you plenty of -In and -DIr practice in written texts.",
      ],
      table: {
        head: ["Noun", "-lI", "-sIz"],
        rows: [["yağmur", "yağmurlu", "yağmursuz"], ["güneş", "güneşli", "güneşsiz"], ["su", "sulu", "susuz"], ["ev", "evli", "evsiz"]],
      },
    },
    lessons: [
      {
        title: "Nature",
        goal: "Describe landscapes and weather.",
        tip: "Hava güneşli is the standard weather report: Hava yağmurlu, Hava karlı, Hava rüzgârlı.",
        words: ["çevre|environment", "doğa|nature", "hayvan|animal", "orman|forest", "deniz|sea", "dağ|mountain", "nehir|river", "göl|lake"],
        sentences: [
          "Bugün hava güneşli.|The weather is sunny today.",
          "Nehir çok uzun.|The river is very long.",
          "Ormanda yürümeyi seviyorum.|I like walking in the forest.",
          "Hayvanları korumak çok önemli.|Protecting animals is very important.",
        ],
        drills: [
          "with|yağmur|rainy", "with|güneş|sunny", "with|rüzgâr|windy", "with|kar|snowy",
          "without|su|waterless", "without|ev|homeless", "without|iş|jobless", "without|para|penniless",
        ],
      },
      {
        title: "In the news",
        goal: "Read and discuss simple news with relative clauses.",
        tip: "Read the participle before the noun: Dün duyduğum haber means the news I heard yesterday.",
        words: ["gazete|newspaper", "ekonomi|economy", "toplum|society", "eğitim|education", "teknoloji|technology", "gelişme|development", "olay|event", "değişim|change"],
        sentences: [
          "Gazetede ilginç bir haber okudum.|I read an interesting piece of news in the newspaper.",
          "Teknoloji hayatımızı değiştiriyor.|Technology is changing our lives.",
          "Dün gördüğüm olay çok garipti.|The incident I saw yesterday was very strange.",
          "Eğitim toplumun geleceğidir.|Education is the future of society.",
        ],
        drills: [
          "part1|duy|what I heard", "part1|oku|what I read", "part1|al|what I took", "part1|sev|what I liked",
          "part2|duy|what you heard", "part2|oku|what you read", "part2|al|what you took", "part2|ver|what you gave",
        ],
      },
    ],
  },
  {
    id: "a9",
    title: "Telling stories",
    summary: "Narrate the past with three more tenses and connect events smoothly.",
    note: {
      title: "Five pasts in one place",
      paragraphs: [
        "Turkish has several pasts and each tells you something different. -DI is what happened. -(I)yordu is what was going on (Yürüyordum, I was walking). -mIştI is what had already happened (Gitmiştim, I had gone). The aorist plus -DI gives what used to happen (Giderdim, I used to go).",
        "Together they build a story: Ormanda yürüyordum. Birdenbire yağmur yağmaya başladı. Eve geldiğimde herkes uyumuştu. A background action (continuous), a sudden event (simple past) and a completed prior state (past perfect).",
        "-Ip joins actions in sequence like and then: Kapıyı açıp içeri girdi (He opened the door and went in). Use it for chains of simple actions without repeating the subject.",
      ],
      table: {
        head: ["Tense", "gel- (I)", "Use"],
        rows: [
          ["-DI", "geldim", "it happened"], ["-(I)yordu", "geliyordum", "it was going on"], ["-mIştI", "gelmiştim", "it had happened"],
          ["aorist + -DI", "gelirdim", "it used to happen"], ["-mIş", "gelmişim", "apparently it happened"],
        ],
      },
    },
    lessons: [
      {
        title: "Connecting events",
        goal: "Order events in time and describe the background of a story.",
        tip: "Birdenbire marks a sudden change. Use it right before the simple past verb.",
        words: [
          "sonunda|finally", "birdenbire|suddenly", "o sırada|at that moment", "bir gün|one day", "bir zamanlar|once upon a time", "nihayet|at last", "hemen|immediately", "sonradan|afterwards",
        ],
        sentences: [
          "Bir gün ormanda yürüyordum.|One day I was walking in the forest.",
          "Birdenbire yağmur yağmaya başladı.|Suddenly it began to rain.",
          "Sonunda sırrı öğrendi.|Finally he learned the secret.",
          "Kapıyı açıp içeri girdi.|He opened the door and went in.",
        ],
        drills: [
          "pcont1|gel|I was coming", "pcont1|oku|I was reading", "pcont1|yap|I was doing", "pcont1|bak|I was looking",
          "ip|gel|coming and then", "ip|oku|reading and then", "ip|yap|doing and then", "ip|gör|seeing and then",
        ],
      },
      {
        title: "Memory and imagination",
        goal: "Talk about childhood, dreams and secrets, with habits in the past.",
        tip: "Çocukken means when I was a child. The -ken ending joins a time or a state to a main verb.",
        words: ["kahraman|hero", "masal|fairy tale", "macera|adventure", "korku|fear", "sır|secret", "hayal|dream, imagination", "anı|memory", "kitap kurdu|bookworm"],
        sentences: [
          "Çocukken çok masal dinlerdim.|As a child I used to listen to many fairy tales.",
          "Eve geldiğimde herkes uyumuştu.|When I got home everyone had fallen asleep.",
          "Her yaz köye giderdik.|Every summer we used to go to the village.",
          "Bu anıyı hiç unutmadım.|I never forgot this memory.",
        ],
        drills: [
          "pperf1|gel|I had come", "pperf1|uyu|I had slept", "pperf1|yap|I had done", "pperf1|bil|I had known",
          "pperf1|gör|I had seen", "hab1|yap|I used to do", "hab1|oku|I used to read", "hab1|gel|I used to come",
        ],
      },
    ],
  },
  {
    id: "a10",
    title: "Formal language",
    summary: "Write and speak politely in formal situations and understand official language.",
    note: {
      title: "Politeness and register",
      paragraphs: [
        "Formal Turkish uses siz for one person, with the -(y)In imperative: Lütfen oturun (Please sit), Buyurun (Here you are, go ahead), Gelin (Come). Sen forms are for friends, family and children.",
        "Requests become polite questions with -(y)Abilir miyim or -(y)Abilir misiniz: Size yardımcı olabilir miyim? (May I help you?). To ask a favor use rica ederim, or the formal -mAnIzI rica ederim (I would ask you to...).",
        "Written business style begins with Sayın and the name, ends with Saygılarımla or Saygılarımızla, and favors long noun clauses: Ekte bilgileri bulabilirsiniz. In speech, Efendim is a polite replacement for pardon or yes.",
      ],
      table: {
        head: ["Informal", "Formal", "Meaning"],
        rows: [
          ["Nasılsın?", "Nasılsınız?", "How are you?"], ["Gel.", "Gelin.", "Come."], ["Yardım edebilir misin?", "Yardım edebilir misiniz?", "Could you help?"],
          ["Otur.", "Oturun.", "Sit."],
        ],
      },
    },
    lessons: [
      {
        title: "Meeting and greeting formally",
        goal: "Introduce yourself, address people correctly and respond to introductions.",
        tip: "Tanıştığımıza memnun oldum is the standard response to being introduced. Memnun oldum alone is also fine.",
        words: ["sayın|dear, honorable", "bay|Mr", "bayan|Ms", "efendim|pardon, sir, madam", "müsaade|permission", "rica|request", "memnun|pleased", "tanışmak|to meet, to get acquainted"],
        sentences: [
          "Tanıştığımıza memnun oldum.|Pleased to meet you.",
          "Size yardımcı olabilir miyim?|May I help you?",
          "Müsaadenizle çıkıyorum.|With your permission, I am leaving.",
          "Sayın müdürüm, hoş geldiniz.|Dear manager, welcome.",
        ],
        drills: [
          "abil1|ver|I can give", "abil1|yap|I can do", "abil1|gel|I can come", "abil2|yap|you can do",
          "abil2|oku|you can read", "abil2|gör|you can see", "fut1|ver|I will give", "fut2|ver|you will give",
        ],
      },
      {
        title: "Appointments and official language",
        goal: "Make an appointment, write a short formal request and understand official notices.",
        tip: "In emails, Ekte means attached and Bilgilerinize means for your information.",
        words: ["ilgili|relevant, interested", "ekte|attached", "bilgi|information", "başvurmak|to apply", "randevu|appointment", "dilekçe|petition", "onay|approval", "saygı|respect"],
        sentences: [
          "Randevu almak istiyorum.|I would like to make an appointment.",
          "Ekte bilgileri bulabilirsiniz.|You can find the information attached.",
          "Bu konuda bilgi verebilir misiniz?|Could you give information on this?",
          "Başvurunuzu dün aldık.|We received your application yesterday.",
        ],
        drills: [
          "must|yap|must do", "must|ver|must give", "must|başvur|must apply", "must|bil|must know",
          "past2|başvur|you applied", "past2|ver|you gave", "past1|başvur|I applied", "past1|ver|I gave",
        ],
      },
    ],
  },
];
