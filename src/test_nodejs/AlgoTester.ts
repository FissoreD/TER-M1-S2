import { NL_star } from "../lerners/NL_star.js";
import { L_star } from "../lerners/L_star.js";

export class LernerTester {
  lerner: L_star | NL_star;

  constructor(lerner: L_star | NL_star) {
    this.lerner = lerner;
  }

  next_step() {
    if (this.lerner.finish) { }
    else if (!this.close_action()) { }
    else if (!this.consistence_action()) { }
    else this.send_automaton_action()
  }

  close_action(): boolean {
    const close_rep = this.lerner.is_close();
    if (close_rep != undefined) {
      this.lerner.add_elt_in_S(close_rep);
      return false;
    }
    return true;
  }

  consistence_action(): boolean {
    const consistence_rep = this.lerner.is_consistent()
    if (consistence_rep != undefined) {
      let s1 = consistence_rep[0];
      let s2 = consistence_rep[1];
      let new_col = consistence_rep[2]
      this.lerner.add_column(new_col);
      return false;
    }
    return true;
  }

  send_automaton_action() {
    let automaton = this.lerner.make_automaton();
    this.lerner.automaton = automaton;
    let answer = this.lerner.make_equiv(automaton);
    if (answer != undefined) {
      this.table_to_update_after_equiv(answer!)
      return;
    }
    this.lerner.finish = true;
  }

  table_to_update_after_equiv(answer: string) {
    if (this instanceof NL_star) (this as NL_star).add_elt_in_E(answer);
    else this.lerner.add_elt_in_S(answer)
  }

  finish() { return this.lerner.finish };
}