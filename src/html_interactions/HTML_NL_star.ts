import { Teacher } from "../teacher/Teacher.js";
import { NL_star } from "../learners/NL_star.js";
import { HTML_LearnerBase } from "./HTML_LearnerBase.js";

export class HTML_NL_star extends HTML_LearnerBase<NL_star> {
  constructor(teacher: Teacher) {
    super(new NL_star(teacher));
  }

  add_row_html(
    parent: HTMLTableSectionElement, fst: string | undefined, head: string | undefined,
    row_elts: string[], colspan: number = 1, rowspan: number = 1
  ) {
    let row = super.add_row_html(parent, fst, head, row_elts, colspan, rowspan);
    if (head != undefined && this.learner.prime_lines.includes(head)) {
      row.className += "prime-row"
    }
    return row;
  }

  close_message(close_rep: string) {
    return `
    The table is not closed since
    \\(\\{row(${close_rep}) = ${this.learner.observation_table[close_rep]} \\land ${close_rep} \\in SA\\}\\) but \\(\\{\\nexists s \\in S | row(s) \\sqsupseteq ${this.learner.observation_table[close_rep]}\\}\\)
    I'm going to move "${close_rep}" from SA to S`
  }

  consistent_message(s1: string, s2: string, new_col: string) {
    return `
    The table is not consistent :
    take \\(${s1 ? s1 : "ε"}\\in S \\land ${s2 ? s2 : "ε"} \\in S \\land ${new_col[0]} \\in \\Sigma \\)
    \\(\\{row(${s1 ? s1 : "ε"}) \\sqsubseteq row(${s2 ? s2 : "ε"})\\}\\)
    but \\(\\{row(${s1 ? s1 : "ε"} \\circ ${new_col[0]}) \\not\\sqsubseteq row(${s2 ? s2 : "ε"} \\circ ${new_col[0]})\\}\\)
    I'm going to add the column \\(${new_col} \\in \\Sigma \\circ E\\) since \\(T(${s1 ? s1 : "ε"} \\circ ${new_col}) > T(${s2 ? s2 : "ε"} \\circ ${new_col})\\)`
  }

  table_to_update_after_equiv(answer: string): void {
    this.learner.add_elt_in_E(answer!);
  }
}