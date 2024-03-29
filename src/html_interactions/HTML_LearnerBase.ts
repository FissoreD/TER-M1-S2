import { Automaton } from "../automaton/Automaton.js";
import { LearnerBase } from "../learners/LearnerBase.js";
import { addHistoryElement, automatonDiv, centerDivClone, clear_automaton_HTML } from "../Main.js";
import { myFunction, myLog } from "../tools/Utilities.js";


export abstract class HTML_LearnerBase<T extends LearnerBase> {
  learner: T;

  table_header: HTMLTableSectionElement;
  table_body: HTMLTableSectionElement;
  pile_actions: myFunction<void, void>[];
  automaton: Automaton | undefined;
  tableHTML: HTMLTableElement;
  table_counter = 0;
  stopNextStep = false;

  constructor(learner: T) {
    this.learner = learner;
    this.pile_actions = [() => this.draw_table()];

    this.tableHTML = document.createElement('table');
    this.table_header = this.tableHTML.createTHead();
    this.table_body = this.tableHTML.createTBody();
  }

  draw_table() {
    document.getElementById('tableHead')?.classList.remove('up');

    this.add_row_html(this.table_header!, "Table" + this.table_counter++, undefined, this.learner.E, 2);

    /**
     The first {@link S}.length rows of the table start with the S symbol
    */
    var fst: string | undefined = "S";
    for (var s of this.learner.S) {
      const row = Array.from(this.learner.observation_table[s]);
      this.add_row_html(this.table_body!, fst, s, row, 1, fst ? this.learner.S.length : 1);
      fst = undefined;
    }
    /**
     In the second part of the table, rows start with the SA symbol
    */
    var fst: string | undefined = "SA";
    for (var s of this.learner.SA) {
      const row = Array.from(this.learner.observation_table[s]);
      this.add_row_html(this.table_body!, fst, s, row, 1, fst ? this.learner.SA.length : 1);
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
      row.classList.add('borderTopTable');
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
    this.table_body!.innerHTML = "";
    this.table_header!.innerHTML = "";
  }

  async next_step() {
    if (this.stopNextStep || ((this.automaton && !this.automaton.continueAction))) return;
    document.getElementById('centerDiv')!.replaceWith(centerDivClone());
    document.getElementById('tableHead')?.classList.remove('up');

    if (this.pile_actions.length > 0) await this.pile_actions.shift()!()
    else if (!this.close_action()) { }
    else if (!this.consistence_action()) { }
    else this.send_automaton_action()
    this.message().innerHTML =
      `Membership queries = ${this.learner.member_number} - Equivalence queries = ${this.learner.equiv_number}` + (this.learner.automaton ? ` - States = ${this.learner.automaton?.state_number()} - Transitions = ${this.learner.automaton?.transition_number()}` : ``) + `<br> ${this.message().innerHTML}`
    console.log(`Eq = ${this.learner.equiv_number}, Mb = ${this.learner.member_number}, Cl = ${this.learner.closedness_counter}, Cn = ${this.learner.consistence_counter}`);

    if (this.learner.finish) {
      this.message().innerHTML += "The Teacher has accepted the automaton";
      this.stopNextStep = true
    }
    document.getElementById('messageHead')?.classList.remove('up');
    document.getElementById('tableHead')?.classList.remove('up');
    document.getElementById('teacher_description')?.classList.remove('up');

    document.getElementById('table')!.innerHTML = this.tableHTML.innerHTML;
    document.getElementById('teacher_description')!.innerHTML = this.learner.teacher.description;
    const timer = (ms: number) => new Promise(res => setTimeout(res, ms))
    if (this.automaton && !this.automaton.continueAction)
      while (this.automaton && !this.automaton.continueAction) {
        let tm = timer(5);
        await tm.then(() => { if (this.automaton!.continueAction) addHistoryElement(this.automaton) }).catch(e => {
          myLog({ a: [e] });
        });
      } else {
      addHistoryElement(this.automaton)
    }
  }

  close_action(): boolean {
    const close_rep = this.learner.is_close();
    if (close_rep != undefined) {
      this.message().innerText =
        this.close_message(close_rep);
      this.pile_actions.push(() => {
        this.message().innerText = "";
        this.learner.add_elt_in_S(close_rep);
        this.clear_table();
        this.draw_table();
      });
      return false;
    }
    return true;
  }

  consistence_action(): boolean {
    const consistence_rep = this.learner.is_consistent()
    if (consistence_rep != undefined) {
      let s1 = consistence_rep[0];
      let s2 = consistence_rep[1];
      let new_col = consistence_rep[2]
      this.message().innerText = this.consistent_message(s1, s2, new_col);
      this.pile_actions.push(() => {
        this.message().innerText = "";
        this.learner.add_elt_in_E(new_col);
        this.clear_table();
        this.draw_table();
      });
      return false;
    }
    return true;
  }

  send_automaton_action() {
    this.message().innerText =
      `The table is consistent and closed, I will send an automaton`;
    let automaton = this.learner.make_automaton();

    this.automaton = automaton;
    window.automaton = automaton;
    this.pile_actions.push(async () => {
      this.message().innerHTML = "";
      automaton.initiate_graph();
      $('#input-automaton')[0].classList.remove('hide');

      function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      while (!automaton.continueAction) {
        await delay(10).then(async () => {
          document.getElementById("messageHead")!.scrollIntoView();
          if (!automaton.continueAction) return
          await delay(10).then(() => {
            let answer = this.learner.make_equiv(automaton);
            myLog({ a: [answer] });


            if (answer != undefined) {
              this.message().innerText =
                `The sent automaton is not valid, here is a counter-exemple ${answer}`;
              this.pile_actions.push(() => {
                this.message().innerHTML = "";
                clear_automaton_HTML();
                this.learner.table_to_update_after_equiv(answer!, true)
                this.clear_table();
                this.draw_table();
              })
              return;
            }
            this.learner.finish = true;
            ($("#next_step")[0] as HTMLButtonElement).classList.add('hide');
            ($("#go_to_end")[0] as HTMLButtonElement).classList.add('hide');
          }
          );
        });
      }
    });
  }

  abstract close_message(close_rep: string): string;

  abstract consistent_message(s1: string, s2: string, new_col: string): string;

  async go_to_end() {
    while (!this.learner.finish) {
      await this.next_step();
    }
  }

  message() {
    return document.getElementById('message')!
  }

  replaceEpsilon(s: string): string {
    return s ? s : "ε";
  }
}