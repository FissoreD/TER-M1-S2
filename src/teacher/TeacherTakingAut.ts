import { boolToString } from "../tools/Utilities.js";
import { Automaton, State } from "../automaton/Automaton.js";
import { Teacher } from "./Teacher.js";
import { minimizeAutomaton } from "../automaton/automaton_type.js";
import { MyAutomatonToHis } from "../automaton/automaton_type.js";
import { differenceAutomata } from "../automaton/automaton_type.js";

export class TeacherTakingAut implements Teacher {
  description: string;
  alphabet: string | string[];
  regex: string;
  automaton: Automaton;

  constructor(automaton: Automaton, description?: string, regex?: string) {
    this.automaton = automaton;
    this.alphabet = automaton.alphabet;
    this.regex = regex || "Teacher with automaton"
    this.description = description || "";
  }

  /*
 * @param sentence the sentence to test the appartenance
 * @returns the string "0" if the sentence is accepted else "1"
 */
  member(sentence: string): string {
    return boolToString(this.automaton!.accept_word_nfa(sentence));
  }

  equiv(automaton: Automaton): string | undefined {
    let counterExemple = (automatonDiff: Automaton): string | undefined => {
      let stateList = automatonDiff.allStates
      if (automatonDiff.acceptingStates.length == 0) return undefined;
      let toExplore = Array.from(automatonDiff.initialStates)
      let explored: State[] = []
      type parentChild = { parent: State | undefined, symbol: string }
      let parent: parentChild[] = new Array(stateList.length).fill({ parent: undefined, symbol: "" });
      while (toExplore.length > 0) {
        const current = toExplore.shift()!
        if (explored.includes(current)) continue;
        explored.push(current)
        for (const [symbol, states] of current.outTransitions) {
          if (!explored.includes(states[0])) {
            parent[stateList.indexOf(states[0])] =
              { parent: current, symbol: symbol }
            if (!toExplore.includes(states[0])) toExplore.push(states[0])
          }
        }


        if (automatonDiff.acceptingStates.includes(current)) {
          let id = stateList.indexOf(current);
          let res: string[] = [parent[id].symbol]
          while (parent[id].parent) {
            id = stateList.indexOf(parent[id].parent!)
            res.push(parent[id].symbol)
          }
          return res.reverse().join("");
        }
      }
      return "";
    }
    let automMinimized = minimizeAutomaton(MyAutomatonToHis(automaton));
    console.log("Diff1");
    let diff1 = differenceAutomata(this.automaton!, automMinimized);
    console.log("Diff2");
    let diff2 = differenceAutomata(automMinimized, this.automaton!);
    // BREAKPOINT AFTER DIFF 
    console.log("Counter * Exemples");

    let counterEx1 = counterExemple(diff1);
    let counterEx2 = counterExemple(diff2);
    // AFTER COUNTEREXEMPLE
    console.log(`C1 = { ${counterEx1} }, C2 = { ${counterEx2} }`);

    if (counterEx1 == undefined) return counterEx2;
    if (counterEx2 == undefined) return counterEx1;
    return counterEx1! < counterEx2! ? counterEx1 : counterEx2;
  }

}