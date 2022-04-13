import { regexToAutomaton } from "../automaton/automaton_type.js";
import { TeacherTakingAut } from "./TeacherTakingAut.js";

export class TeacherAutomaton extends TeacherTakingAut {
  constructor(regex: string, description?: string) {
    super(regexToAutomaton(regex), description, regex)
    this.description = description || `Automaton accepting \\(regex(${regex})\\)`;
  }
}