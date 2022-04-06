define(["require", "exports", "../automaton/Automaton.js", "./LernerBase.js"], function (require, exports, Automaton_js_1, LernerBase_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.L_star = void 0;
    class L_star extends LernerBase_js_1.LernerBase {
        constructor(teacher) {
            super(teacher);
        }
        update_observation_table(key, value) {
            let old_value = this.observation_table[key];
            if (old_value != undefined)
                value = old_value + value;
            this.observation_table[key] = value;
        }
        make_member(pref, suff) {
            let word = pref + suff;
            let answer;
            for (let i = 0; i < word.length + 1; i++) {
                let pref1 = word.substring(0, i);
                let suff1 = word.substring(i);
                if (pref1 == pref)
                    continue;
                if (this.E.includes(suff1)) {
                    if ((this.S.includes(pref1) || this.SA.includes(pref1)) && this.observation_table[pref1]) {
                        answer = this.observation_table[pref1].charAt(this.E.indexOf(suff1));
                        this.update_observation_table(pref, answer);
                        if (answer == undefined)
                            throw 'Parameter is not a number!';
                        return;
                    }
                }
            }
            answer = this.teacher.member(word);
            this.update_observation_table(pref, answer);
            this.member_number++;
        }
        make_equiv(a) {
            let answer = this.teacher.equiv(a);
            this.equiv_number++;
            return answer;
        }
        make_automaton() {
            let states = {};
            this.S.forEach(e => states[this.observation_table[e]] = e);
            let first_state = this.observation_table[""];
            let keys = Object.keys(states);
            let end_states = keys.filter(k => k[0] == '1');
            let transitions = [];
            for (const state of this.S) {
                for (const symbol of this.alphabet) {
                    transitions.push({
                        fromState: this.observation_table[state],
                        symbol: symbol,
                        toStates: [this.observation_table[state + symbol]]
                    });
                }
            }
            this.automaton = new Automaton_js_1.Automaton({
                "alphabet": this.alphabet,
                "acceptingStates": end_states,
                "startState": [first_state],
                "states": keys,
                "transitions": transitions
            });
            return this.automaton;
        }
        is_close() {
            return this.SA.find(t => !this.S.some(s => this.same_row(s, t)));
        }
        is_consistent() {
            for (let s1_ind = 0; s1_ind < this.S.length; s1_ind++) {
                for (let s2_ind = s1_ind + 1; s2_ind < this.S.length; s2_ind++) {
                    let s1 = this.S[s1_ind];
                    let s2 = this.S[s2_ind];
                    if (this.same_row(s1, s2)) {
                        for (const a of this.alphabet) {
                            for (let i = 0; i < this.E.length; i++) {
                                if (this.observation_table[s1 + a][i] !=
                                    this.observation_table[s2 + a][i] && !this.E.includes(a + this.E[i]))
                                    return [s1, s2, a + this.E[i]];
                            }
                        }
                    }
                }
            }
        }
        same_row(a, b) {
            return this.observation_table[a] == this.observation_table[b];
        }
        table_to_update_after_equiv(answer) {
            this.add_elt_in_S(answer);
        }
    }
    exports.L_star = L_star;
});
//# sourceMappingURL=L_star.js.map