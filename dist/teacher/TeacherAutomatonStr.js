import{regexToAutomaton}from"../automaton/automaton_type.js";import{TeacherAutomaton}from"./TeacherAutomaton.js";export class TeacherAutomatonStr extends TeacherAutomaton{constructor(regex,description){super({automaton:regexToAutomaton(regex),description:description,regex:regex});this.description=description||`Automaton accepting L = ${regex}`}}
//# sourceMappingURL=TeacherAutomatonStr.js.map