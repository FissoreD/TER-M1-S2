define(["require", "exports", "../Main.js"], function (require, exports, Main_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTML_LernerBase = void 0;
    class HTML_LernerBase {
        constructor(lerner) {
            this.table_counter = 0;
            this.lerner = lerner;
            this.table_header = Main_js_1.tableHTML.createTHead();
            this.table_body = Main_js_1.tableHTML.createTBody();
            this.pile_actions = [() => this.draw_table()];
        }
        draw_table() {
            this.add_row_html(this.table_header, "Table" + this.table_counter++, undefined, this.lerner.E, 2);
            var fst = "S";
            for (var s of this.lerner.S) {
                const row = Array.from(this.lerner.observation_table[s]);
                this.add_row_html(this.table_body, fst, s, row, 1, fst ? this.lerner.S.length : 1);
                fst = undefined;
            }
            var fst = "SA";
            for (var s of this.lerner.SA) {
                const row = Array.from(this.lerner.observation_table[s]);
                this.add_row_html(this.table_body, fst, s, row, 1, fst ? this.lerner.SA.length : 1);
                fst = undefined;
            }
        }
        add_row_html(parent, fst, head, row_elts, colspan = 1, rowspan = 1) {
            let convert_to_epsilon = (e) => e == "" ? "&epsilon;" : e;
            let create_cell_with_text = (row, txt) => {
                var cell = row.insertCell();
                cell.innerHTML = `${convert_to_epsilon(txt)}`;
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
            if (head != undefined)
                create_cell_with_text(row, head);
            for (var letter of row_elts)
                create_cell_with_text(row, letter);
            return row;
        }
        clear_table() {
            this.table_body.innerHTML = "";
            this.table_header.innerHTML = "";
        }
        graphic_next_step() {
            if (this.lerner.finish) {
                if (Main_js_1.message.innerHTML != "")
                    Main_js_1.message.innerHTML = "The Teacher has accepted the automaton";
            }
            else if (this.pile_actions.length > 0) {
                this.pile_actions.shift()();
            }
            else if (!this.close_action()) { }
            else if (!this.consistence_action()) { }
            else
                this.send_automaton_action();
            Main_js_1.message.innerHTML =
                `Queries = ${this.lerner.member_number} - Membership = ${this.lerner.equiv_number}` + (this.lerner.automaton ? ` - States = ${this.lerner.automaton?.state_number()} - Transitions = ${this.lerner.automaton?.transition_number()}` : ``) + `<br> ${Main_js_1.message.innerHTML}`;
            MathJax.typeset();
        }
        close_action() {
            const close_rep = this.lerner.is_close();
            if (close_rep != undefined) {
                Main_js_1.message.innerText =
                    this.close_message(close_rep);
                this.pile_actions.push(() => {
                    Main_js_1.message.innerText = "";
                    this.lerner.add_elt_in_S(close_rep);
                    this.clear_table();
                    this.draw_table();
                });
                return false;
            }
            return true;
        }
        consistence_action() {
            const consistence_rep = this.lerner.is_consistent();
            if (consistence_rep != undefined) {
                let s1 = consistence_rep[0];
                let s2 = consistence_rep[1];
                let new_col = consistence_rep[2];
                Main_js_1.message.innerText = this.consistent_message(s1, s2, new_col);
                this.pile_actions.push(() => {
                    Main_js_1.message.innerText = "";
                    this.lerner.add_column(new_col);
                    this.clear_table();
                    this.draw_table();
                });
                return false;
            }
            return true;
        }
        send_automaton_action() {
            Main_js_1.message.innerText =
                `The table is consistent and closed, I will send an automaton`;
            let automaton = this.lerner.make_automaton();
            this.automaton = automaton;
            this.pile_actions.push(() => {
                Main_js_1.message.innerHTML = "";
                automaton.initiate_graph();
                this.add_automaton_listener();
                let answer = this.lerner.make_equiv(automaton);
                if (answer != undefined) {
                    Main_js_1.message.innerText =
                        `The sent automaton is not valid, 
          here is a counter-exemple ${answer}`;
                    this.pile_actions.push(() => {
                        Main_js_1.message.innerHTML = "";
                        (0, Main_js_1.clear_automaton_HTML)();
                        this.table_to_update_after_equiv(answer);
                        this.clear_table();
                        this.draw_table();
                    });
                    return;
                }
                this.lerner.finish = true;
            });
        }
        add_automaton_listener() {
            let input = document.createElement("input");
            let setB = document.createElement("button");
            setB.innerHTML = "Reinitialize automaton";
            setB.addEventListener('click', () => {
                this.automaton.restart();
                this.automaton.initiate_graph();
            });
            let nextB = document.createElement("button");
            nextB.innerHTML = "Next char";
            nextB.addEventListener('click', () => {
                this.automaton.draw_next_step(input.value[0]);
                input.value = input.value.slice(1);
            });
            Main_js_1.automatonDiv.appendChild(input);
            Main_js_1.automatonDiv.appendChild(nextB);
            Main_js_1.automatonDiv.appendChild(setB);
            let acceptB = document.createElement("button");
            let answerP = document.createElement("p");
            acceptB.innerHTML = "In automaton";
            acceptB.addEventListener("click", () => {
                let aut_answer = this.automaton?.accept_word_nfa(input.value);
                if (aut_answer[0]) {
                    answerP.innerHTML = `The word ${input.value} is accepted, here is a valid path : ${aut_answer[1]}`;
                }
                else {
                    answerP.innerHTML = `There is no valid path accepting the word ${input.value}`;
                }
            });
            Main_js_1.automatonDiv.appendChild(acceptB);
            Main_js_1.automatonDiv.appendChild(answerP);
        }
        go_to_end() {
            if (this.lerner.finish)
                return;
            this.lerner.make_all_queries();
            this.clear_table();
            this.draw_table();
            (0, Main_js_1.clear_automaton_HTML)();
            this.lerner.automaton?.initiate_graph();
            this.graphic_next_step();
        }
    }
    exports.HTML_LernerBase = HTML_LernerBase;
});
//# sourceMappingURL=HTML_LernerBase.js.map