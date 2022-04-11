import { Automaton, State } from "../automaton/Automaton.js";
import { Teacher } from "../teacher/Teacher.js";
import { generate_suffix_list } from "../tools/Utilities.js";
import { LernerBase, Map_string_string } from "./LernerBase.js";

export class NL_star extends LernerBase {
  prime_lines: string[];

  constructor(teacher: Teacher) {
    super(teacher);
    this.prime_lines = Array.from(this.alphabet).concat("");
  }

  is_prime(row_key: string): boolean {
    if (this.prime_lines == undefined) this.prime_lines = []
    let row_value = this.observation_table[row_key];

    if (row_value.length < 2 || parseInt(row_value) == 0) return true;

    let res = "0".repeat(row_value.length)

    // let res = ""
    // for (let i = 0; i < row_value.length; i++) res += "0";

    Object.values(this.observation_table).forEach(value => {
      if (value != row_value && this.is_covered(value, row_value)) {
        res = this.row_union(res, value);
      }
    });
    return res != row_value;
  }

  /**
   * Given two rows, {@link row1} and {@link row2} 
   * it return the union of them, that is the logic 
   * or of them, for exemple : row_union(0101, 0110) 
   * returns 0111
   */
  row_union(row1: string, row2: string): string {
    return Array.from(row1).map((e, pos) => [e, row2.charAt(pos)].includes("1") ? "1" : "0").join("");
  }

  /**
   * returns if {@link row1} is covered by {@link row2}
   * row1 is covered if every bit of is smaller then the 
   * corresponding bit of row2. For exemple :
   * 01100 is covered by 01110
   * 01101 is not covered by 01110 (due to last bit of r1)
   */
  is_covered(row1: string, row2: string): boolean {
    return Array.from(row1).every((e, pos) => e <= row2.charAt(pos));
  }

  check_prime_lines() {
    this.prime_lines = [...this.S, ...this.SA].filter(l => this.is_prime(l));
  }

  add_elt_in_S(new_elt: string): string[] {
    let added_list = super.add_elt_in_S(new_elt);
    added_list.forEach(e => {
      if (!this.prime_lines?.includes(e) && this.is_prime(e)) {
        this.prime_lines.push(e);
        this.check_prime_lines();
      }
    })
    return added_list;
  }

  /**
  * For all suffix suff of {@link new_elt} if suff is not in {@link E} :
  * add suff to {@link E} and make queries for every elt in {@link SA} and
  * {@link S} relating to the new column suff
  */
  add_elt_in_E(new_elt: string) {
    let suffix_list = generate_suffix_list(new_elt);
    for (const suffix of suffix_list) {
      if (this.E.includes(suffix)) break;
      this.SA.forEach(s => this.make_member(s, suffix));
      this.S.forEach(s => this.make_member(s, suffix));
      this.E.push(suffix);
    }
    this.check_prime_lines()
  }

  /**
   * @returns the first `s` in {@link SA} st `s` is a prime line and 
   * `s` is not in {@link S}
   */
  is_close(): string | undefined {
    return this.SA.find(t => !this.S.some(s => this.same_row(s, t)) && this.prime_lines.includes(t));
  }

  /**
   * @returns a list of 3 elements, 
   * the first two are s1, s2 in {@link S} st row(s1) is covered by row(s2)
   * and there is an "a" in alphabet st row(s1 + a) is not covered row(s2 + a)
   */
  is_consistent(): string[] | undefined {
    for (let s1_ind = 0; s1_ind < this.S.length; s1_ind++) {
      for (let s2_ind = s1_ind + 1; s2_ind < this.S.length; s2_ind++) {
        let s1 = this.S[s1_ind];
        let s2 = this.S[s2_ind];
        let value_s1 = this.observation_table[s1];
        let value_s2 = this.observation_table[s2];
        if (this.is_covered(value_s1, value_s2)) {
          for (const a of this.alphabet) {
            let value_s1_p = this.observation_table[s1 + a]
            let value_s2_p = this.observation_table[s2 + a]
            if (!this.is_covered(value_s1_p, value_s2_p)) {
              for (let i = 0; i < this.E.length; i++) {
                if (this.observation_table[s1 + a][i] <
                  this.observation_table[s2 + a][i] && !this.E.includes(a + this.E[i])) {
                  return [s1, s2, a + this.E[i]]
                }
              }
            }
          }
        } else if (this.is_covered(value_s2, value_s1)) {
          for (const a of this.alphabet) {
            let value_s1_p = this.observation_table[s1 + a]
            let value_s2_p = this.observation_table[s2 + a]
            if (!this.is_covered(value_s2_p, value_s1_p))
              for (let i = 0; i < this.E.length; i++) {
                if (this.observation_table[s1 + a][i] <
                  this.observation_table[s2 + a][i] && !this.E.includes(a + this.E[i])) {
                  return [s2, s1, a + this.E[i]]
                }
              }
          }
        }
      }
    }
  }

  make_automaton() {
    let wordForState: string[] = [], states: Map<string, State> = new Map(),
      acceptingStates: State[] = [], initialStates: State[] = [];
    this.prime_lines.forEach(s => {
      if (this.S.includes(s)) {
        let name = this.observation_table[s];
        if (!states.get(name)) {
          let state = new State(name, name[0] == "1", this.is_covered(name, this.observation_table[""]), this.alphabet);
          wordForState.push(s);
          if (state.isAccepting) acceptingStates.push(state)
          if (state.isInitial) initialStates.push(state)
          states.set(name, state);
        }
      }
    })
    for (const word of wordForState) {
      let name = this.observation_table[word]
      for (const symbol of this.alphabet) {
        let rowNext = this.observation_table[word + symbol]
        for (const [name1, state] of states) {
          if (this.is_covered(name1, rowNext))
            states.get(name)!.transitions.get(symbol)!.push(state)
        }
      }
    }
    this.automaton = new Automaton(
      {
        states: states,
        acceptingStates: acceptingStates,
        alphabet: this.alphabet,
        initialStates: initialStates
      }
    )
    return this.automaton;
  }

  table_to_update_after_equiv(answer: string): void {
    this.add_elt_in_E(answer);
  }
}