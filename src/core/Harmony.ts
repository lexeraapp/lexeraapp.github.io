import { TurkishText } from "./TurkishText.ts";

const VOWELS = "aeıioöuü";
const VOICELESS = "çfhkpsşt";

export interface Build {
  form: string;
  add: string;
  why: string[];
}
export interface SuffixFamily {
  id: string;
  label: string;
  /** Textbook notation, e.g. "-lAr". */
  pattern: string;
  /** Every surface form a learner could confuse; used as answer options. */
  variants: string[];
  build(stem: string): Build;
}

/** Vowel and consonant harmony: the engine behind every grammar drill. */
export class Harmony {
  static isVowel(c: string): boolean {
    return VOWELS.includes(c);
  }
  /** Circumflex letters (hâlâ, rüzgâr) behave like their plain vowels for harmony. */
  static plain(word: string): string {
    return TurkishText.lower(word).replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u");
  }
  static syllables(word: string): number {
    return [...Harmony.plain(word)].filter((c) => VOWELS.includes(c)).length;
  }
  static lastVowel(word: string): string {
    const w = Harmony.plain(word);
    for (let i = w.length - 1; i >= 0; i--) if (Harmony.isVowel(w[i] as string)) return w[i] as string;
    throw new Error(`No vowel in "${word}"`);
  }
  static endsInVowel(word: string): boolean {
    return Harmony.isVowel(Harmony.plain(word).slice(-1));
  }
  static endsVoiceless(word: string): boolean {
    return VOICELESS.includes(Harmony.plain(word).slice(-1));
  }
  /** Two-way harmony: a or e. */
  static two(word: string): "a" | "e" {
    return "aıou".includes(Harmony.lastVowel(word)) ? "a" : "e";
  }
  /** Four-way harmony: ı, i, u or ü. */
  static four(word: string): "ı" | "i" | "u" | "ü" {
    const v = Harmony.lastVowel(word);
    if ("aı".includes(v)) return "ı";
    if ("ei".includes(v)) return "i";
    if ("ou".includes(v)) return "u";
    return "ü";
  }
  static describe(word: string): string {
    const v = Harmony.lastVowel(word);
    const back = "aıou".includes(v) ? "back" : "front";
    const round = "oöuü".includes(v) ? "rounded" : "unrounded";
    return `the last vowel of "${word}" is ${v} (${back}, ${round})`;
  }
}

const buffer = (stem: string, ch: string): string => (Harmony.endsInVowel(stem) ? ch : "");
const dt = (stem: string): "t" | "d" => (Harmony.endsVoiceless(stem) ? "t" : "d");
const cons = (stem: string): string =>
  `the stem ends in "${stem.slice(-1)}", ${Harmony.endsVoiceless(stem) ? "a voiceless consonant, so d becomes t" : "a voiced sound, so d stays d"}`;

function family(
  id: string,
  label: string,
  pattern: string,
  variants: string[],
  addFor: (stem: string) => string,
  whyFor: (stem: string) => string[],
): SuffixFamily {
  return {
    id, label, pattern, variants,
    build(stem) {
      const add = addFor(stem);
      return { form: stem + add, add, why: whyFor(stem) };
    },
  };
}

const two = (s: string) => `${Harmony.describe(s)}, so the suffix takes ${Harmony.two(s)}.`;
const four = (s: string) => `${Harmony.describe(s)}, so the suffix takes ${Harmony.four(s)}.`;
const yBuf = (s: string) => (Harmony.endsInVowel(s) ? ["After a vowel Turkish adds a buffer y."] : []);
const yorWhy = (s: string) =>
  Harmony.endsInVowel(s) ? ["The stem ends in a vowel, so only -yor- is added."] : [four(s)];
const yorAdd = (tail: string) => (s: string) => (Harmony.endsInVowel(s) ? "" : Harmony.four(s)) + "yor" + tail;
const harm2 = (s: string) => Harmony.two(s);
const i4 = (s: string) => (Harmony.two(s) === "a" ? "ı" : "i");


/** The thirteen short verbs that take -Ir instead of -Ar in the aorist. */
const AORIST_IR = new Set(["al", "bil", "bul", "dur", "gel", "gör", "kal", "ol", "öl", "san", "var", "ver", "vur"]);
function aorist(stem: string): { add: string; why: string } {
  const w = Harmony.plain(stem);
  if (Harmony.endsInVowel(w)) return { add: "r", why: "The stem ends in a vowel, so the aorist is just -r." };
  if (Harmony.syllables(w) > 1) return { add: Harmony.four(w) + "r", why: "A stem with two or more syllables takes -Ir." };
  if (AORIST_IR.has(w)) return { add: Harmony.four(w) + "r", why: `${w} is one of the 13 short verbs that take -Ir.` };
  return { add: Harmony.two(w) + "r", why: "A one-syllable verb usually takes -Ar." };
}

export class SuffixBook {
  private static readonly all: SuffixFamily[] = [
    family("plural", "plural", "-lAr", ["ler", "lar"], (s) => "l" + harm2(s) + "r", (s) => [two(s)]),
    family("locative", "in, at, on", "-DA", ["de", "da", "te", "ta"],
      (s) => dt(s) + harm2(s), (s) => [two(s), `Also, ${cons(s)}.`]),
    family("ablative", "from", "-DAn", ["den", "dan", "ten", "tan"],
      (s) => dt(s) + harm2(s) + "n", (s) => [two(s), `Also, ${cons(s)}.`]),
    family("dative", "to, towards", "-(y)A", ["e", "a", "ye", "ya"],
      (s) => buffer(s, "y") + harm2(s), (s) => [two(s), ...yBuf(s)]),
    family("accusative", "the (definite object)", "-(y)I", ["i", "ı", "u", "ü", "yi", "yı", "yu", "yü"],
      (s) => buffer(s, "y") + Harmony.four(s), (s) => [four(s), ...yBuf(s)]),
    family("poss1", "my", "-(I)m", ["m", "im", "ım", "um", "üm"],
      (s) => (Harmony.endsInVowel(s) ? "m" : Harmony.four(s) + "m"),
      (s) => (Harmony.endsInVowel(s) ? ["After a vowel, only m is added."] : [four(s)])),
    family("cop1", "I am", "-(y)Im", ["im", "ım", "um", "üm", "yim", "yım", "yum", "yüm"],
      (s) => buffer(s, "y") + Harmony.four(s) + "m", (s) => [four(s), ...yBuf(s)]),
    family("cop2", "you are", "-sIn", ["sin", "sın", "sun", "sün"],
      (s) => "s" + Harmony.four(s) + "n", (s) => [four(s)]),
    family("cop1pl", "we are", "-(y)Iz", ["iz", "ız", "uz", "üz", "yiz", "yız", "yuz", "yüz"],
      (s) => buffer(s, "y") + Harmony.four(s) + "z", (s) => [four(s), ...yBuf(s)]),
    family("past1", "I (past)", "-DIm", ["dim", "dım", "dum", "düm", "tim", "tım", "tum", "tüm"],
      (s) => dt(s) + Harmony.four(s) + "m", (s) => [four(s), `Also, ${cons(s)}.`]),
    family("past2", "you (past)", "-DIn", ["din", "dın", "dun", "dün", "tin", "tın", "tun", "tün"],
      (s) => dt(s) + Harmony.four(s) + "n", (s) => [four(s), `Also, ${cons(s)}.`]),
    family("past3", "he, she (past)", "-DI", ["di", "dı", "du", "dü", "ti", "tı", "tu", "tü"],
      (s) => dt(s) + Harmony.four(s), (s) => [four(s), `Also, ${cons(s)}.`]),
    family("pres1", "I am ...ing", "-(I)yorum", ["iyorum", "ıyorum", "uyorum", "üyorum", "yorum"], yorAdd("um"), yorWhy),
    family("pres2", "you are ...ing", "-(I)yorsun", ["iyorsun", "ıyorsun", "uyorsun", "üyorsun", "yorsun"], yorAdd("sun"), yorWhy),
    family("pres1pl", "we are ...ing", "-(I)yoruz", ["iyoruz", "ıyoruz", "uyoruz", "üyoruz", "yoruz"], yorAdd("uz"), yorWhy),
    family("fut1", "I will", "-(y)AcAğIm", ["eceğim", "acağım", "yeceğim", "yacağım"],
      (s) => buffer(s, "y") + harm2(s) + "c" + harm2(s) + "ğ" + i4(s) + "m",
      (s) => [two(s), "Before a vowel the final k of -cak softens to ğ.", ...yBuf(s)]),
    family("fut2", "you will", "-(y)AcAksIn", ["eceksin", "acaksın", "yeceksin", "yacaksın"],
      (s) => buffer(s, "y") + harm2(s) + "c" + harm2(s) + "ks" + i4(s) + "n",
      (s) => [two(s), ...yBuf(s)]),
    family("abil1", "I can", "-(y)AbilirIm", ["ebilirim", "abilirim", "yebilirim", "yabilirim"],
      (s) => buffer(s, "y") + harm2(s) + "bilirim", (s) => [two(s), ...yBuf(s)]),
    family("abil2", "you can", "-(y)AbilirsIn", ["ebilirsin", "abilirsin", "yebilirsin", "yabilirsin"],
      (s) => buffer(s, "y") + harm2(s) + "bilirsin", (s) => [two(s), ...yBuf(s)]),
    family("evid", "apparently (reported past)", "-mIş", ["miş", "mış", "muş", "müş"],
      (s) => "m" + Harmony.four(s) + "ş", (s) => [four(s)]),
    family("cond", "if", "-sA", ["se", "sa"], (s) => "s" + harm2(s), (s) => [two(s)]),
    family("rel", "who ...s (relative)", "-(y)An", ["en", "an", "yen", "yan"],
      (s) => buffer(s, "y") + harm2(s) + "n", (s) => [two(s), ...yBuf(s)]),
    family("part1", "what I ...ed", "-DIğIm", ["diğim", "dığım", "duğum", "düğüm", "tiğim", "tığım", "tuğum", "tüğüm"],
      (s) => dt(s) + Harmony.four(s) + "ğ" + Harmony.four(s) + "m", (s) => [four(s), `Also, ${cons(s)}.`]),
    family("part2", "what you ...ed", "-DIğIn", ["diğin", "dığın", "duğun", "düğün", "tiğin", "tığın", "tuğun", "tüğün"],
      (s) => dt(s) + Harmony.four(s) + "ğ" + Harmony.four(s) + "n", (s) => [four(s), `Also, ${cons(s)}.`]),
    family("negpast1", "I did not", "-mA-DIm", ["medim", "madım"],
      (s) => "m" + harm2(s) + "d" + i4(s) + "m", (s) => [two(s), "After the vowel of -mA the past marker is always d."]),
    family("negpres1", "I am not ...ing", "-mIyorum", ["miyorum", "mıyorum", "muyorum", "müyorum"],
      (s) => "m" + Harmony.four(s) + "yorum", (s) => [four(s), "Negation -mI goes between the stem and -yor."]),
    family("negpres2", "you are not ...ing", "-mIyorsun", ["miyorsun", "mıyorsun", "muyorsun", "müyorsun"],
      (s) => "m" + Harmony.four(s) + "yorsun", (s) => [four(s), "Negation -mI goes between the stem and -yor."]),
    family("gen", "of (genitive)", "-(n)In", ["in", "ın", "un", "ün", "nin", "nın", "nun", "nün"],
      (s) => buffer(s, "n") + Harmony.four(s) + "n", (s) => [four(s), ...(Harmony.endsInVowel(s) ? ["After a vowel the buffer is n."] : [])]),
    family("poss2", "your (singular)", "-(I)n", ["n", "in", "ın", "un", "ün"],
      (s) => (Harmony.endsInVowel(s) ? "n" : Harmony.four(s) + "n"),
      (s) => (Harmony.endsInVowel(s) ? ["After a vowel, only n is added."] : [four(s)])),
    family("poss3", "his, her, its", "-(s)I", ["i", "ı", "u", "ü", "si", "sı", "su", "sü"],
      (s) => buffer(s, "s") + Harmony.four(s), (s) => [four(s), ...(Harmony.endsInVowel(s) ? ["After a vowel the buffer is s."] : [])]),
    family("ip", "and then (gerund)", "-(y)Ip", ["ip", "ıp", "up", "üp", "yip", "yıp", "yup", "yüp"],
      (s) => buffer(s, "y") + Harmony.four(s) + "p", (s) => [four(s), ...yBuf(s)]),
    family("inf", "to ... (dictionary form)", "-mAk", ["mek", "mak"], (s) => "m" + harm2(s) + "k", (s) => [two(s)]),
    family("with", "with", "-lI", ["li", "lı", "lu", "lü"], (s) => "l" + Harmony.four(s), (s) => [four(s)]),
    family("without", "without", "-sIz", ["siz", "sız", "suz", "süz"], (s) => "s" + Harmony.four(s) + "z", (s) => [four(s)]),
    family("must", "must", "-mAlI", ["meli", "malı"], (s) => "m" + harm2(s) + "l" + i4(s), (s) => [two(s), "The last vowel of the suffix is i or ı to match its a or e."]),
    family("lets", "let us", "-(y)AlIm", ["elim", "alım", "yelim", "yalım"],
      (s) => buffer(s, "y") + harm2(s) + "l" + i4(s) + "m", (s) => [two(s), ...yBuf(s)]),
    family("pcont1", "I was ...ing", "-(I)yordum", ["iyordum", "ıyordum", "uyordum", "üyordum", "yordum"],
      (s) => (Harmony.endsInVowel(s) ? "" : Harmony.four(s)) + "yordum", yorWhy),
    family("pperf1", "I had ...ed", "-mIştIm", ["miştim", "mıştım", "muştum", "müştüm"],
      (s) => "m" + Harmony.four(s) + "ş" + "t" + Harmony.four(s) + "m", (s) => [four(s), "-mIş then -tI: the d of -DI becomes t after ş."]),
    family("aor1", "I (habitually)", "-Ar/-Ir + im", ["arım", "erim", "ırım", "irim", "urum", "ürüm", "rım", "rim", "rum", "rüm"],
      (s) => { const a = aorist(s); return a.add + Harmony.four(s + a.add) + "m"; }, (s) => [aorist(s).why]),
    family("aor2", "you (habitually)", "-Ar/-Ir + sIn", ["arsın", "ersin", "ırsın", "irsin", "ursun", "ürsün", "rsın", "rsin", "rsun", "rsün"],
      (s) => { const a = aorist(s); return a.add + "s" + Harmony.four(s + a.add) + "n"; }, (s) => [aorist(s).why]),
    family("aor3", "he, she (habitually)", "-Ar/-Ir", ["ar", "er", "ır", "ir", "ur", "ür", "r"],
      (s) => aorist(s).add, (s) => [aorist(s).why]),
    family("hab1", "I used to", "-Ar/-Ir + DIm", ["ardım", "erdim", "ırdım", "irdim", "urdum", "ürdüm", "rdım", "rdim", "rdum", "rdüm"],
      (s) => { const a = aorist(s); return a.add + "d" + Harmony.four(s + a.add) + "m"; }, (s) => [aorist(s).why, "Then -DIm, with d after r."]),
    {
      id: "passpast", label: "was ...ed (passive past)", pattern: "-Il-DI",
      variants: ["ıldı", "ildi", "uldu", "üldü", "ındı", "indi", "undu", "ündü", "ndu", "ndü", "ndı", "ndi"],
      build(stem) {
        const w = TurkishText.lower(stem);
        const marker = w.endsWith("l") ? Harmony.four(w) + "n" : Harmony.endsInVowel(w) ? "n" : Harmony.four(w) + "l";
        const add = marker + "d" + Harmony.four(w + marker);
        return {
          form: w + add, add,
          why: [
            `The passive marker is -${marker}, with its vowel chosen because ${Harmony.describe(w)}.`,
            "Then -DI follows, and d stays d because l and n are voiced.",
          ],
        };
      },
    },
  ];
  private static readonly byId = new Map(SuffixBook.all.map((f) => [f.id, f]));
  static get(id: string): SuffixFamily {
    const f = SuffixBook.byId.get(id);
    if (!f) throw new Error(`Unknown suffix family: ${id}`);
    return f;
  }
  static ids(): string[] {
    return SuffixBook.all.map((f) => f.id);
  }
}
