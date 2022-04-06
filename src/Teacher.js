define(["require", "exports", "./automaton/automaton_type.js", "./tools/Utilities.js"], function (require, exports, automaton_type_js_1, Utilities_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.teachers = exports.binaryAddition = exports.teacher_b_bStar_a__b_aOrb_star = exports.teacher_bStar_a_or_aStart_bStar = exports.teacherNotAfourthPos = exports.teacherEvenAandThreeB = exports.teacherA3fromLast = exports.teacherPairZeroAndOne = exports.teacher_a_or_baStar = exports.Teacher = void 0;
    class Teacher {
        constructor(description, regex, f, counter_exemples) {
            this.counter_exemples_pos = 0;
            this.max_word_length = 8;
            this.check_function = f || (() => true);
            this.counter_exemples = counter_exemples || [];
            this.counter = 0;
            this.description = description;
            this.automaton = (0, automaton_type_js_1.regexToAutomaton)(regex);
            this.alphabet = Array.from(this.automaton.alphabet);
            this.regex = regex;
        }
        initiate_mapping() {
            let res = [["", this.check_function("")]];
            let alphabet = Array.from(this.alphabet).sort();
            let level = [""];
            while (res[res.length - 1][0].length < this.max_word_length) {
                let res1 = [];
                level.forEach(e => alphabet.forEach(a => {
                    res.push([e + a, this.check_function(e + a)]);
                    res1.push(e + a);
                }));
                level = res1;
            }
            return res;
        }
        member(sentence) {
            return (0, Utilities_js_1.boolToString)(this.automaton.accept_word_nfa(sentence)[0]);
        }
        equiv(automaton) {
            if (this.counter_exemples_pos < this.counter_exemples.length) {
                return this.counter_exemples[this.counter_exemples_pos++];
            }
            let counterExemple = (automatonDiff) => {
                if (automatonDiff.acceptingStates.length == 0)
                    return undefined;
                let toExplore = [automatonDiff.startState[0]];
                let explored = [];
                let parent = new Array(automatonDiff.states.length).fill({ parent: "", symbol: "" });
                while (toExplore.length > 0) {
                    let current = toExplore.shift();
                    if (explored.includes(current))
                        continue;
                    explored.push(current);
                    for (const transition of automatonDiff.transitions) {
                        if (!explored.includes(transition.toStates[0]) && transition.fromState == current) {
                            parent[automatonDiff.states.indexOf(transition.toStates[0])] =
                                { parent: transition.fromState, symbol: transition.symbol };
                            toExplore.push(transition.toStates[0]);
                        }
                    }
                    if (automatonDiff.acceptingStates.includes(current)) {
                        let id = automatonDiff.states.indexOf(current);
                        let res = [parent[id].symbol];
                        while (parent[id].parent != "") {
                            id = automatonDiff.states.indexOf(parent[id].parent);
                            res.push(parent[id].symbol);
                        }
                        return res.reverse().join("");
                    }
                }
                return "";
            };
            let automMinimized = (0, automaton_type_js_1.minimizeAutomaton)((0, automaton_type_js_1.MyAutomatonToHis)(automaton));
            let diff1 = (0, automaton_type_js_1.differenceAutomata)(this.automaton, automMinimized);
            let diff2 = (0, automaton_type_js_1.differenceAutomata)(automMinimized, this.automaton);
            let counterEx1 = counterExemple(diff1);
            let counterEx2 = counterExemple(diff2);
            console.log(`C1 = { ${counterEx1} }, C2 = { ${counterEx2} }`);
            if (counterEx1 == undefined)
                return counterEx2;
            if (counterEx2 == undefined)
                return counterEx1;
            return counterEx1 < counterEx2 ? counterEx1 : counterEx2;
        }
    }
    exports.Teacher = Teacher;
    exports.teacher_a_or_baStar = new Teacher(`Automata accepting \\(regex(a + (ba)*)\\)`, "a+(ba)*", sentence => {
        let parity = (0, Utilities_js_1.count_str_occurrences)(sentence, "0");
        return parity % 2 == 0 && sentence.length % 2 == 0;
    }, []);
    exports.teacherPairZeroAndOne = new Teacher(`Automata accepting \\(L = \\{w \\in (0, 1)^* | \\#(w_0) \\% 2 = 0 \\land \\#(w_1) \\% 2 = 0\\}\\) <br/> → words with even nb of '0' and even nb of '1'`, "(00+11+(01+10)(00+11)*(01+10))*", sentence => {
        let parity = (0, Utilities_js_1.count_str_occurrences)(sentence, "0");
        return parity % 2 == 0 && sentence.length % 2 == 0;
    }, ["11", "011"]);
    exports.teacherA3fromLast = new Teacher(`Automata accepting \\(L = \\{w \\in (a, b)^* | w[-3] = a\\}\\) <br/>
    → words with an 'a' in the 3rd pos from end`, "(a+b)*a(a+b)(a+b)", sentence => sentence.length >= 3 && sentence[sentence.length - 3] == 'a', []);
    exports.teacherEvenAandThreeB = new Teacher(`Automata accepting \\(L = \\{w \\in (a, b)^* | \\#(w_b) \\geq 3 \\lor \\#(w_a) \\% 2 = 1\\}\\)
  <br/> → words with at least 3 'b' or an odd nb of 'a'`, "b*a(b+ab*a)*+(a+b)*ba*ba*b(a+b)*", sentence => (0, Utilities_js_1.count_str_occurrences)(sentence, "b") >= 3 || (0, Utilities_js_1.count_str_occurrences)(sentence, "a") % 2 == 1, []);
    exports.teacherNotAfourthPos = new Teacher(`Automata accepting \\(L = \\{w \\in (a,b)^* \\land i \\in 4\\mathbb{N} | w[i] \\neq a \\land i \\leq len(w)\\}\\) <br/>
  → words without an 'a' in a position multiple of 4`, "((a+b)(a+b)(a+b)b)*(a+b+$)(a+b+$)(a+b+$)", sentence => {
        for (let i = 3; i < sentence.length; i += 4) {
            if (sentence.charAt(i) == "a")
                return false;
        }
        return true;
    }, []);
    exports.teacher_bStar_a_or_aStart_bStar = new Teacher(`Automata accepting \\(L = regex((bb^*a) + (a^*b^*))\\)`, "(bb*a)+(a*b*)", sentence => {
        return sentence.match(/^((b+a)|(a*b*))$/g) != undefined;
    }, []);
    exports.teacher_b_bStar_a__b_aOrb_star = new Teacher(`Automata accepting \\(L = regex(bb^*($+a(b(a+b))^*)\\)`, "bb*($+a(b(a+b))*)", _sentence => true, []);
    exports.binaryAddition = new Teacher(`Automata accepting the sum between binary words, exemple : <br>
  <pre>
  0101 + 
  1001 = 
  1110 </pre>
  we encode this sum as the concatenation of vectors of size 3 : <br>
  <pre>
  fst column 011 = 3
  snd column 101 = 5 
  trd column 001 = 1 
  fth column 110 = 6 </pre>
  so 3516 which is a valid word for the sum <br>
  <input class="sum-calc sum-calc-style" onkeyup="update_input()"> + <br>
  <input class="sum-calc sum-calc-style" onkeyup="update_input()"> = <br>
  <input class="sum-calc sum-calc-style" onkeyup="update_input()"><br>
  <button id="calc" onclick="send_calc_button()">Send</button>
  <span class="sum-calc-style" id="add-res"></span>
  `, "((0+3+5)+1(7+4+2)*6)*", sentence => {
        let charToBin = (char) => (parseInt(char) >>> 0).toString(2).padStart(3, "0");
        let sentenceAr = Array.from(sentence).map(e => charToBin(e));
        let fst_term = parseInt(sentenceAr.map(e => e[0]).join(''), 2);
        let snd_term = parseInt(sentenceAr.map(e => e[1]).join(''), 2);
        let trd_term = parseInt(sentenceAr.map(e => e[2]).join(''), 2);
        return fst_term + snd_term == trd_term;
    }, []);
    exports.teachers = [exports.teacher_a_or_baStar, exports.teacher_b_bStar_a__b_aOrb_star, exports.binaryAddition, exports.teacherA3fromLast, exports.teacherEvenAandThreeB, exports.teacherNotAfourthPos, exports.teacherPairZeroAndOne, exports.teacher_bStar_a_or_aStart_bStar];
});
//# sourceMappingURL=Teacher.js.map