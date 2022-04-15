import { Automaton, State } from "../automaton/Automaton.js";

export type myFunction<S, T> = { (data: S): T; };

export function same_vector(v1: any[], v2: any[]): boolean {
  return v1.map((elt, pos) => elt == v2[pos]).every(e => e);
}

/**
 * creates all generate_prefix_list from the str passed in input :
 * exemple for hello : ['', 'h', 'he', 'hel', 'hell', 'hello']
 */
export const generate_prefix_list = (str: string) =>
  Array(str.length + 1).fill(0).map((_, i) => str.substring(0, i)).reverse();

/**
 * creates all suffix from the str passed in input :
 * exemple for hello : ['hello', 'ello', 'llo', 'lo', 'o', '']
 */
export const generate_suffix_list = (str: string) =>
  Array(str.length + 1).fill("").map((_, i) => str.substring(i, str.length + 1));

export const count_str_occurrences = (str: string, obj: string) =>
  Array.from(str).filter(f => f == obj).length

export function boolToString(bool: boolean): string {
  return bool ? "1" : "0";
}

export function allStringFromAlphabet(params: { alphabet: string[] | string, maxLength: number }) {
  let res: string[] = [""]
  let alphabet = Array.from(params.alphabet).sort()
  let level = [""]
  while (res[res.length - 1].length < params.maxLength) {
    let res1: string[] = []
    level.forEach(e => alphabet.forEach(a => {
      res.push(e + a)
      res1.push(e + a)
    }))
    level = res1
  }
  return res;
}

export function txtToAutomaton(content: string) {
  const SYMBOL_LIST = Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

  let sContent = content.split("\n");
  let IN_INITIAL = 0, IN_TRANSITION = 1, IN_ACCEPTING = 2;
  let statePhase = IN_INITIAL;
  const initalState: string[] = [], acceptingStates: string[] = [],
    transitions: { current: string, symbol: string, next: string }[] = [],
    statesName: Set<string> = new Set(), alphabetSet: Set<string> = new Set();
  for (const line of sContent) {
    if (!line.includes("-")) {
      let stateName = line.substring(line.indexOf('[') + 1, line.indexOf(']'));
      statesName.add(stateName)
      if (statePhase == IN_INITIAL) {
        initalState.push(stateName);
      } else {
        statePhase = IN_ACCEPTING;
        acceptingStates.push(stateName)
      }
    } else if (line.match(/[a-zA-Z0-9]+/)) {
      statePhase = IN_TRANSITION;
      let split = line.match(/[A-Za-z0-9]+/g)!;
      let current = split[1];
      let symbol = split[0];
      let next = split[2];
      transitions.push({
        current: current,
        next: next,
        symbol: symbol
      })
      statesName.add(current);
      statesName.add(next);
      alphabetSet.add(symbol);
    }
  }
  let alphabet = Array.from(alphabetSet);
  let alphabetOneLetter = SYMBOL_LIST.splice(0, alphabet.length)
  let stateMap: Map<string, State> = new Map();
  let stateSet: Set<State> = new Set();
  statesName.forEach(e => {
    let state = new State(e, acceptingStates.includes(e), initalState.includes(e), alphabetOneLetter)
    stateMap.set(e, state);
    stateSet.add(state)
  });
  transitions.forEach(({ current, symbol, next }) =>
    stateMap.get(current)!.addTransition(
      alphabetOneLetter[alphabet.indexOf(symbol)],
      stateMap.get(next)!)
  )

  let automaton = new Automaton(stateSet);
  return automaton;
}