define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Automaton = void 0;
    ;
    class Automaton {
        constructor(json) {
            this.states_rename = [];
            this.transitions = json.transitions;
            this.startState = json.startState;
            this.acceptingStates = json.acceptingStates;
            this.currentStates = this.startState;
            this.alphabet = Array.from(json.alphabet);
            this.states = json.states;
            this.set_state_rename();
        }
        set_state_rename() {
            this.states_rename = [];
            let counter_init = [0, this.startState.length, this.states.length - this.acceptingStates.length + 1];
            for (let i = 0; i < this.states.length; i++) {
                if (this.startState.includes(this.states[i])) {
                    this.states_rename.push("q" + counter_init[0]++);
                }
                else if (this.acceptingStates.includes(this.states[i])) {
                    this.states_rename.push("q" + counter_init[2]++);
                }
                else {
                    this.states_rename.push("q" + counter_init[1]++);
                }
            }
        }
        next_step(next_char) {
            let newCurrentState = [];
            this.currentStates.forEach(cs => {
                let nextStates = this.find_transition(cs, next_char).toStates;
                nextStates.forEach(nextState => {
                    if (!newCurrentState.includes(nextState)) {
                        newCurrentState.push(nextState);
                    }
                });
            });
            this.currentStates = newCurrentState;
        }
        accept_word(word) {
            this.restart();
            Array.from(word).forEach(letter => this.next_step(letter));
            let is_accepted = this.acceptingStates.some(e => this.currentStates.includes(e));
            this.restart();
            return is_accepted;
        }
        find_transition(state, symbol) {
            return this.transitions
                .filter(e => e.fromState == state)
                .find(e => e.symbol == symbol);
        }
        accept_word_nfa(word) {
            let path = [];
            let recursive_explore = (word, index, current_state, state_path) => {
                if (index < word.length) {
                    let next_states = this.find_transition(current_state, word[index]).toStates;
                    return next_states.some(next_state => recursive_explore(word, index + 1, next_state, state_path + ", " + this.get_state_rename(next_state)));
                }
                else {
                    if (this.acceptingStates.includes(current_state)) {
                        path = [state_path];
                        return true;
                    }
                    path.push(state_path);
                    return false;
                }
            };
            let is_accepted = false;
            for (const start_state of this.startState) {
                is_accepted = recursive_explore(word, 0, start_state, this.get_state_rename(start_state));
                if (is_accepted)
                    break;
            }
            return [is_accepted, path];
        }
        restart() {
            this.currentStates = this.startState;
        }
        draw_next_step(next_char) {
            this.color_node(false);
            this.next_step(next_char);
            this.color_node(true);
        }
        initiate_graph() {
            let automatonHTML = $("#automaton-mermaid")[0];
            automatonHTML.removeAttribute('data-processed');
            automatonHTML.innerHTML = this.matrix_to_mermaid();
            mermaid.init($(".mermaid"));
            this.acceptingStates.forEach(n => {
                let circle = this.get_current_graph_node(n);
                circle.style.strokeWidth = "1.1";
                circle.style.stroke = "black";
                let smaller_circle = circle.cloneNode();
                smaller_circle.attributes['r'].value -= 4;
                circle.parentNode.insertBefore(smaller_circle, circle.nextSibling);
            });
            this.color_node(true);
            $(".mermaid")[0].after($(".mermaidTooltip")[0]);
            $('svg')[0].style.height = 'auto';
        }
        get_current_graph_node(node) {
            return Array.from($(".node")).find(e => e.id.split("-")[1] == node).firstChild;
        }
        matrix_to_mermaid() {
            let res = "flowchart LR\n";
            res = res.concat("subgraph Automaton\ndirection LR\n");
            let triples = {};
            for (let i = 0; i < this.states.length; i++) {
                for (let j = 0; j < this.alphabet.length; j++) {
                    for (const state of this.find_transition(this.states[i], this.alphabet[j]).toStates) {
                        let stateA_concat_stateB = this.states[i] + '&' + state;
                        if (triples[stateA_concat_stateB]) {
                            triples[stateA_concat_stateB].push(this.alphabet[j]);
                        }
                        else {
                            triples[stateA_concat_stateB] = [this.alphabet[j]];
                        }
                    }
                }
            }
            res = res.concat(Object.keys(triples).map(x => this.create_triple(x, triples[x].join(","))).join("\n"));
            res += "\n";
            res += "subgraph InitialStates\n";
            res += this.startState.map(e => e).join("\n");
            res += "\nend";
            res += "\n";
            res += "end\n";
            res = res.concat(this.states.map(e => `click ${e} undefinedCallback "${e}";`).join("\n"));
            console.log(res);
            return res;
        }
        color_node(toFill) {
            this.currentStates.forEach(currentState => {
                let current_circle = this.get_current_graph_node(currentState);
                let next_circle = current_circle.nextSibling;
                if (toFill) {
                    next_circle.style.textDecoration = "underline";
                    if (this.acceptingStates.includes(currentState))
                        next_circle.style.fill = '#009879';
                    else
                        current_circle.style.fill = '#009879';
                }
                else {
                    if (this.acceptingStates.includes(currentState))
                        next_circle.removeAttribute('style');
                    else
                        current_circle.removeAttribute('style');
                }
            });
        }
        create_triple(states, transition) {
            let split = states.split("&");
            let A = split[0], B = split[1];
            let A_rename = this.get_state_rename(A);
            let B_rename = this.get_state_rename(B);
            return `${A}((${A_rename})) -->| ${transition} | ${B}((${B_rename}))`;
        }
        create_entering_arrow() {
            return `START[ ]--> ${this.startState}`;
        }
        get_state_rename(name) {
            return this.states_rename[this.states.indexOf(name)];
        }
        state_number() {
            return this.states.length;
        }
        transition_number() {
            return this.transitions.map(e => e.toStates.length).reduce((prev, current) => prev + current);
        }
        minimize() {
            let couples = [];
            let separable = new Set();
            for (let i1 = 0; i1 < this.states.length; i1++) {
                for (let i2 = i1 + 1; i2 < this.states.length; i2++) {
                    if (this.acceptingStates.includes(this.states[i1]) != this.acceptingStates.includes(this.states[i2]))
                        separable.add(`${this.states[i1]}-${this.states[i2]}`);
                    else
                        couples.push([this.states[i1], this.states[i2]]);
                }
            }
            while (true) {
                let oldLength = couples.length;
                couples = couples.filter(e => {
                    let fst = e[0], snd = e[1];
                    let tr0 = this.transitions.filter(t => t.fromState == fst);
                    let tr1 = this.transitions.filter(t => t.fromState == snd);
                    for (const letter of this.alphabet) {
                        let t1 = tr0.find(e => e.symbol == letter)?.toStates;
                        let t2 = tr1.find(e => e.symbol == letter)?.toStates;
                        if (t1 && t2) {
                            for (const x of t1) {
                                for (const y of t2) {
                                    if (separable.has(`${x}-${y}`) || separable.has(`${y}-${x}`)) {
                                        separable.add(`${fst}-${snd}`);
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                    return true;
                });
                if (couples.length == oldLength)
                    break;
            }
            for (const couple of couples) {
                this.transitions.filter(e => e.fromState == couple[1]).forEach(s => {
                    let tr;
                    if (tr = this.transitions.find(t => t.fromState == couple[0] && t.symbol == s.symbol)) {
                        for (const next of s.toStates) {
                            if (!tr.toStates.includes(next))
                                tr.toStates.push(next);
                        }
                    }
                    else {
                        this.transitions.push({ fromState: couple[0], symbol: s.symbol, toStates: s.toStates });
                    }
                });
                if (this.startState.includes(couple[1])) {
                    this.startState = this.startState.filter(e => e != couple[1]);
                    if (!this.startState.includes(couple[0]))
                        this.startState.push(couple[0]);
                }
                this.acceptingStates = this.acceptingStates.filter(e => e != couple[1]);
                this.states = this.states.filter(e => e != couple[1]);
                this.transitions = this.transitions.filter(e => e.fromState != couple[1]);
                this.transitions.forEach(e => e.toStates = e.toStates.filter(x => x != couple[1]));
                this.transitions = this.transitions.filter(t => t.toStates.length != 0);
            }
            this.set_state_rename();
            console.log(Array.from(separable), couples);
            return this;
        }
    }
    exports.Automaton = Automaton;
});
//# sourceMappingURL=Automaton.js.map