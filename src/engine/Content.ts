import type { DrillSpec, Sentence, Word } from "../core/types.ts";
import { library, type ContentLibrary } from "../content/ContentLibrary.ts";

/** Throwing lookups on top of the library, so engine code never handles undefined ids. */
export class Content {
  constructor(readonly lib: ContentLibrary = library) {}
  word(id: string): Word {
    const w = this.lib.word(id);
    if (!w) throw new Error(`Unknown word ${id}`);
    return w;
  }
  sentence(id: string): Sentence {
    const s = this.lib.sentence(id);
    if (!s) throw new Error(`Unknown sentence ${id}`);
    return s;
  }
  drill(id: string): DrillSpec {
    const d = this.lib.drill(id);
    if (!d) throw new Error(`Unknown drill ${id}`);
    return d;
  }
}
