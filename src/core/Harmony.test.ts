import { describe, expect, it } from "vitest";
import { SuffixBook } from "./Harmony.ts";
import { TurkishText } from "./TurkishText.ts";

const f = (fam: string, stem: string) => SuffixBook.get(fam).build(stem).form;

describe("Harmony suffix engine", () => {
  it("plural, locative, ablative", () => {
    expect(f("plural", "kitap")).toBe("kitaplar");
    expect(f("plural", "ev")).toBe("evler");
    expect(f("locative", "ev")).toBe("evde");
    expect(f("locative", "kitap")).toBe("kitapta");
    expect(f("locative", "market")).toBe("markette");
    expect(f("ablative", "park")).toBe("parktan");
    expect(f("ablative", "okul")).toBe("okuldan");
  });
  it("dative and accusative with buffer y", () => {
    expect(f("dative", "okul")).toBe("okula");
    expect(f("dative", "şehir")).toBe("şehire");
    expect(f("dative", "araba")).toBe("arabaya");
    expect(f("dative", "hastane")).toBe("hastaneye");
    expect(f("accusative", "ev")).toBe("evi");
    expect(f("accusative", "araba")).toBe("arabayı");
  });
  it("to be and possession", () => {
    expect(f("cop1", "öğrenci")).toBe("öğrenciyim");
    expect(f("cop1", "yorgun")).toBe("yorgunum");
    expect(f("cop2", "mutlu")).toBe("mutlusun");
    expect(f("cop1pl", "öğretmen")).toBe("öğretmeniz");
    expect(f("poss1", "ev")).toBe("evim");
    expect(f("poss1", "anne")).toBe("annem");
    expect(f("poss1", "okul")).toBe("okulum");
  });
  it("present, past, future, ability", () => {
    expect(f("pres1", "iç")).toBe("içiyorum");
    expect(f("pres1", "oku")).toBe("okuyorum");
    expect(f("pres2", "gel")).toBe("geliyorsun");
    expect(f("pres1pl", "yap")).toBe("yapıyoruz");
    expect(f("past1", "çalış")).toBe("çalıştım");
    expect(f("past1", "al")).toBe("aldım");
    expect(f("past2", "gör")).toBe("gördün");
    expect(f("past3", "uyu")).toBe("uyudu");
    expect(f("fut1", "gel")).toBe("geleceğim");
    expect(f("fut1", "oku")).toBe("okuyacağım");
    expect(f("fut2", "al")).toBe("alacaksın");
    expect(f("abil1", "konuş")).toBe("konuşabilirim");
    expect(f("abil2", "gel")).toBe("gelebilirsin");
  });
  it("advanced forms", () => {
    expect(f("evid", "gel")).toBe("gelmiş");
    expect(f("evid", "uyu")).toBe("uyumuş");
    expect(f("cond", "ol")).toBe("olsa");
    expect(f("rel", "oku")).toBe("okuyan");
    expect(f("rel", "gel")).toBe("gelen");
    expect(f("part1", "oku")).toBe("okuduğum");
    expect(f("part1", "yap")).toBe("yaptığım");
    expect(f("part2", "gör")).toBe("gördüğün");
    expect(f("passpast", "aç")).toBe("açıldı");
    expect(f("passpast", "gönder")).toBe("gönderildi");
    expect(f("passpast", "konuş")).toBe("konuşuldu");
  });
  it("negation, genitive, possession, and linking", () => {
    expect(f("negpast1", "gel")).toBe("gelmedim");
    expect(f("negpast1", "yap")).toBe("yapmadım");
    expect(f("negpres1", "oku")).toBe("okumuyorum");
    expect(f("negpres2", "git")).toBe("gitmiyorsun");
    expect(f("gen", "ev")).toBe("evin");
    expect(f("gen", "araba")).toBe("arabanın");
    expect(f("poss2", "el")).toBe("elin");
    expect(f("poss3", "elbise")).toBe("elbisesi");
    expect(f("poss3", "pantolon")).toBe("pantolonu");
    expect(f("ip", "oku")).toBe("okuyup");
    expect(f("inf", "gel")).toBe("gelmek");
    expect(f("with", "süt")).toBe("sütlü");
    expect(f("with", "rüzgâr")).toBe("rüzgârlı");
    expect(f("without", "şeker")).toBe("şekersiz");
    expect(f("must", "yap")).toBe("yapmalı");
    expect(f("must", "gel")).toBe("gelmeli");
    expect(f("lets", "oku")).toBe("okuyalım");
    expect(f("lets", "gel")).toBe("gelelim");
  });
  it("past continuous, past perfect and the aorist", () => {
    expect(f("pcont1", "gel")).toBe("geliyordum");
    expect(f("pcont1", "oku")).toBe("okuyordum");
    expect(f("pperf1", "uyu")).toBe("uyumuştum");
    expect(f("pperf1", "gör")).toBe("görmüştüm");
    expect(f("aor3", "yap")).toBe("yapar");
    expect(f("aor3", "gel")).toBe("gelir");
    expect(f("aor3", "oku")).toBe("okur");
    expect(f("aor3", "çalış")).toBe("çalışır");
    expect(f("aor3", "gör")).toBe("görür");
    expect(f("aor3", "sev")).toBe("sever");
    expect(f("aor3", "iç")).toBe("içer");
    expect(f("aor3", "kalk")).toBe("kalkar");
    expect(f("aor1", "yap")).toBe("yaparım");
    expect(f("aor1", "oku")).toBe("okurum");
    expect(f("aor2", "bil")).toBe("bilirsin");
    expect(f("aor2", "yaz")).toBe("yazarsın");
    expect(f("hab1", "dinle")).toBe("dinlerdim");
    expect(f("hab1", "yap")).toBe("yapardım");
  });
  it("always lists the correct answer among variants", () => {
    for (const id of SuffixBook.ids()) {
      const fam = SuffixBook.get(id);
      for (const stem of ["ev", "okul", "gel", "yap", "öğretmen", "kitap", "oku", "araba", "aç", "gör"]) {
        expect(fam.variants, `${id}:${stem}`).toContain(fam.build(stem).add);
      }
    }
  });
});

describe("TurkishText", () => {
  it("handles dotted and dotless i", () => {
    expect(TurkishText.lower("IŞIK")).toBe("ışık");
    expect(TurkishText.lower("İSTANBUL")).toBe("istanbul");
    expect(TurkishText.fold("Görüşürüz")).toBe("gorusuruz");
    expect(TurkishText.sameFolded("Gunaydin", "Günaydın")).toBe(true);
    expect(TurkishText.sameExact("Gunaydin", "Günaydın")).toBe(false);
  });
});
