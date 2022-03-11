import { Automaton } from "../Automaton.js";
import { LernerBase } from "../lerners/LernerBase.js";
import { clear_automaton_HTML, message, tableHTML } from "../Main.js";
import { myFunction } from "../Utilities.js";

export abstract class HTML_LernerBase<Lerner extends LernerBase> {
  lerner: Lerner;

  table_header: HTMLTableSectionElement;
  table_body: HTMLTableSectionElement;
  pile_actions: myFunction<void, void>[];
  automaton: Automaton | undefined;
  table_counter = 0;

  constructor(lerner: Lerner) {
    this.lerner = lerner;

    this.table_header = tableHTML.createTHead();
    this.table_body = tableHTML.createTBody();
    this.pile_actions = [() => this.draw_table()];
  }

  draw_table() {
    this.add_row_html(this.table_header, "Table" + this.table_counter++, undefined, this.lerner.E, 2);

    /**
     The first {@link S}.length rows of the table start with the S symbol
    */
    var fst: string | undefined = "S";
    for (var s of this.lerner.S) {
      const row = Array.from(this.lerner.observation_table[s]);
      this.add_row_html(this.table_body, fst, s, row, 1, fst ? this.lerner.S.length : 1);
      fst = undefined;
    }
    /**
     In the second part of the table, rows start with the SA symbol
    */
    var fst: string | undefined = "SA";
    for (var s of this.lerner.SA) {
      const row = Array.from(this.lerner.observation_table[s]);
      this.add_row_html(this.table_body, fst, s, row, 1, fst ? this.lerner.SA.length : 1);
      fst = undefined;
    }
  }

  add_row_html(
    parent: HTMLTableSectionElement, fst: string | undefined, head: string | undefined,
    row_elts: string[], colspan: number = 1, rowspan: number = 1
  ) {
    let convert_to_epsilon = (e: string) => e == "" ? "&epsilon;" : e;
    let create_cell_with_text = (row: HTMLTableRowElement, txt: string) => {
      var cell = row.insertCell();
      cell.innerHTML = `${convert_to_epsilon(txt)}`
    };

    var row = parent.insertRow();
    if (fst) {
      row.style.borderTop = "2px solid #009879";
      var cell = document.createElement('th');
      cell.setAttribute("rowspan", rowspan + "");
      cell.setAttribute("colspan", colspan + "");
      cell.innerHTML = convert_to_epsilon(fst);
      row.appendChild(cell);
    }
    if (head != undefined) create_cell_with_text(row, head);
    for (var letter of row_elts)
      create_cell_with_text(row, letter)
    return row;
  }

  clear_table() {
    this.table_body.innerHTML = "";
    this.table_header.innerHTML = "";
  }


  graphic_next_step() {
    if (this.lerner.finish) {
      if (message.innerHTML != "")
        message.innerHTML = "The Teacher has accepted the automaton";
    }
    else if (this.pile_actions.length > 0) {
      this.pile_actions.shift()!()
    }
    else if (!this.close_action()) { }
    else if (!this.consistence_action()) { }
    else this.send_automaton_action()
    message.innerHTML =
      `Queries = ${this.lerner.query_number} - Membership = ${this.lerner.member_number} <br>
      ${message.innerHTML}`
    // @ts-ignore
    MathJax.typeset()
  }

  close_action(): boolean {
    const close_rep = this.lerner.is_close();
    if (close_rep != undefined) {
      message.innerText =
        this.close_message(close_rep);
      this.pile_actions.push(() => {
        message.innerText = "";
        this.lerner.add_elt_in_S(close_rep);
        this.clear_table();
        this.draw_table();
      });
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
      message.innerText = this.consistent_message(s1, s2, new_col);
      this.pile_actions.push(() => {
        message.innerText = "";
        this.lerner.add_column(new_col);
        this.clear_table();
        this.draw_table();
      });
      return false;
    }
    return true;
  }

  send_automaton_action() {
    message.innerText =
      `The table is consistent and closed, I will send an automaton`;
    let automaton = this.lerner.make_automaton();

    this.automaton = automaton;
    this.pile_actions.push(() => {
      message.innerHTML = "";
      automaton.initiate_graph();
      this.add_automaton_listener();
      let answer = this.lerner.make_member(automaton);
      if (answer != undefined) {
        message.innerText =
          `The sent automaton is not valid, 
          here is a counter-exemple ${answer}`;
        this.pile_actions.push(() => {
          message.innerHTML = "";
          clear_automaton_HTML();
          this.table_to_update_after_equiv(answer!)
          this.clear_table();
          this.draw_table();
        })
        return;
      }
      this.lerner.finish = true;
    });
  }

  abstract close_message(close_rep: string): string;

  abstract consistent_message(s1: string, s2: string, new_col: string): string;

  abstract add_automaton_listener(): void;

  abstract table_to_update_after_equiv(answer: string): void;

}