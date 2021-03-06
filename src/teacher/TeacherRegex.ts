import { Automaton } from "../automaton/Automaton.js";
import { boolToString, myFunction } from "../tools/Utilities.js";
import { equivalenceFunction } from "./Equiv.js";
import { Teacher } from "./Teacher.js";

/** 
 * Teacher taking a js function to test the membership of a word.
 * We must pass a list of counter-example to answer to equivalence queries.
 * If needed you can use the {@link allStringFromAlphabet} function to 
 * create all words on a given alphabet with length smaller or equal
 * to a given length
 */
export class TeacherRegex implements Teacher {
  static counter = 0;

  check_function: myFunction<string, boolean>;
  counter_examples: string[];
  counter: number;
  description: string;
  alphabet: string[];
  max_word_length = 8;
  regex: string;

  constructor(params: {
    regex: string | myFunction<string, boolean>, counter_examples?: string[], alphabet:
    string[] | string
  }, description?: string) {

    this.counter = 0;
    this.description = description || ((typeof params.regex == 'string') ? "Automaton with regex : " + params.regex :
      // @ts-ignore
      `Teacher with function<br><pre> ${js_beautify(params.regex.toString())}</pre>`);
    this.alphabet = Array.from(params.alphabet);
    this.regex = (typeof params.regex == 'string') ? params.regex : "Teacher with function"

    this.check_function =
      (typeof params.regex == 'string') ?
        s => s.match(new RegExp(`^(${params.regex})$`)) != undefined :
        params.regex as myFunction<string, boolean>;

    this.counter_examples = params.counter_examples || [];
  }

  member(sentence: string): string {
    return boolToString(this.check_function(sentence));
  }

  equiv(automaton: Automaton): string | undefined {
    return equivalenceFunction(this, automaton);
  }
}