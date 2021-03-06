import { boolToString } from "../tools/Utilities.js";
import { Automaton, State } from "../automaton/Automaton.js";
import { Teacher } from "./Teacher.js";
import { equivalenceFunction } from "./Equiv.js";
import { minimizeAutomaton, MyAutomatonToHis } from "../automaton/automaton_type.js";

/**
 * This Teacher takes an Automaton Instance as parameter
 */
export class TeacherAutomaton implements Teacher {
  description: string;
  alphabet: string[];
  regex: string;
  automaton: Automaton;
  counter_examples?: string[];

  constructor(params: { automaton: Automaton, description?: string, regex?: string, counter_examples?: string[] }) {
    this.automaton = minimizeAutomaton(MyAutomatonToHis(params.automaton));
    this.alphabet = params.automaton.alphabet;
    this.regex = params.regex != undefined ? params.regex : "Teacher with automaton"
    this.description = params.description != undefined ? params.description : "Teacher with automaton";
    this.counter_examples = params.counter_examples;
  }

  member(sentence: string): string {
    return boolToString(this.automaton!.accept_word_nfa(sentence));
  }

  equiv(automaton: Automaton): string | undefined {
    return equivalenceFunction(this, automaton)
  }

}