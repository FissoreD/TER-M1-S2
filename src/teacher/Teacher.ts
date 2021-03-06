import { Automaton, State } from "../automaton/Automaton.js";
import { TeacherAutomatonStr } from "./TeacherAutomatonStr.js";
import { TeacherRegex } from "./TeacherRegex.js";
import { allStringFromAlphabet } from "../tools/Utilities.js";
import { TeacherAutomaton } from "./TeacherAutomaton.js";

export interface Teacher {
  description: string;
  alphabet: string[];
  counter_examples?: string[];
  regex: string;
  automaton?: Automaton;
  /**
   * @param sentence the sentence to test the membership
   * @returns the string "0" if the sentence is accepted else "1"
   */
  member(sentence: string): string;
  /**
   * @param automaton
   * @returns undefined if the automaton recognizes the teacher's language, a counter-example otherwise
   */
  equiv(automaton: Automaton): string | undefined;
}
/** 
 * a teacher accepting a + (ba)*
 */
export let teacher_a_or_baStar = new TeacherAutomatonStr("a+(ba)*");

/** 
 * a teacher accepting the language over {0, 1}
 * of strings with even number of 0 and even number of 1
 */
export let teacherPairZeroAndOne = new TeacherAutomatonStr(
  "(00+11+(01+10)(00+11)*(01+10))*",
  `Automaton accepting L = {w in (0, 1)* | #(w_0) % 2 = 0 and #(w_1) % 2 = 0} <br/> → words with even nb of '0' and even nb of '1'`);

/**
 * a teacher accepting the language over {a, b}
 * of strings with an "a" in the third letter from end
 * (exemple abb, baab, bbabbaab)
 */
export let teacherA3fromLast = new TeacherAutomatonStr(
  "(a+b)*a(a+b)(a+b)",
  `Automaton accepting L = {w in (a, b)* | w[-3] = a} <br/>
    → words with an 'a' in the 3rd pos from end`,
)
/**
 * a teacher accepting the language over {a, b}
 * of strings with any even number of "a" or at least three "b"
 */
export let teacherEvenAandThreeB = new TeacherAutomatonStr(
  "b*a(b+ab*a)*+(a+b)*ba*ba*b(a+b)*",
  `Automaton accepting L = {w in (a, b)* | #(w_b) ≥ 3 or #(w_a) % 2 = 1}
  <br/> → words with at least 3 'b' or an odd nb of 'a'`
);

/**
 * a teacher accepting the language over {a, b}
 * of strings not having an a in a position multiple
 * of 4 
 */
export let teacherNotAfourthPos = new TeacherAutomatonStr(
  "((a+b)(a+b)(a+b)b)*(a+b+$)(a+b+$)(a+b+$)",
  `Automaton accepting L = {w ∈ (a,b)* and i ∈ 4ℕ | w[i] ≠ a and i ≤ len(w)} <br/>
  → words without an 'a' in a position multiple of 4`)

/**
 * a teacher accepting the regex bb*a + a*b*
 */
export let teacher_bStar_a_or_aStart_bStar = new TeacherRegex(
  { alphabet: "ab", regex: "((bb*a)|(a*b*))", counter_examples: ["bba", "b", "aabb", "aba", "aa", "bbaa"] },
  `Automaton accepting L = (bb*a) + (a*b*)`)

/**
 * a teacher accepting the regex bb*($ + a(b(a+b))*)
 */
export let teacher_b_bStar_a__b_aOrb_star = new TeacherAutomatonStr("bb*($+a(b(a+b))*)")

// export let binaryAddition = new TeacherRegex(
//   {
//     alphabet: "012345678",
//     regex: sentence => {
//       let charToBin = (char: string) =>
//         (parseInt(char) >>> 0).toString(2).padStart(3, "0")
//       let sentenceAr = Array.from(sentence).map(e => charToBin(e))
//       let fst_term = parseInt(sentenceAr.map(e => e[0]).join(''), 2);
//       let snd_term = parseInt(sentenceAr.map(e => e[1]).join(''), 2);
//       let trd_term = parseInt(sentenceAr.map(e => e[2]).join(''), 2);
//       return fst_term + snd_term == trd_term;
//     },
//     counter_examples: allStringFromAlphabet({ alphabet: '012345678', maxLength: 3 })
//   }, `  <pre>
//        /**
//        *  Automaton calculating addition between binary integers: 
//        * exemple : 
//        * 0101 + 
//        * 1001 =
//        * 1110
//        * is a valid exemple that can be sent to the automaton with the encoding 3516
//        * 3 = 011 (the 1st col), 5 = 101 (the 2nd col), 
//        * 1 = 001 (the 3rd col), 6 = 110 (the 4th col) 
//        **/</pre> `)

// let t1 = new TeacherAutomaton({
//   automaton: Automaton.strToAutomaton(`
// [0]
// a1,[14]->[9]
// a1,[14]->[7]
// a0,[13]->[8]
// a0,[12]->[8]
// a0,[12]->[5]
// a1,[12]->[0]
// a0,[11]->[14]
// a0,[11]->[9]
// a1,[11]->[3]
// a0,[10]->[9]
// a0,[10]->[7]
// a1,[10]->[8]
// a1,[10]->[5]
// a0,[9]->[5]
// a1,[9]->[6]
// a1,[8]->[13]
// a1,[8]->[9]
// a0,[7]->[13]
// a1,[7]->[12]
// a1,[7]->[10]
// a1,[7]->[2]
// a1,[7]->[1]
// a0,[6]->[7]
// a0,[6]->[1]
// a0,[5]->[13]
// a0,[5]->[2]
// a0,[5]->[0]
// a0,[4]->[14]
// a0,[4]->[11]
// a1,[4]->[7]
// a0,[3]->[11]
// a0,[3]->[8]
// a1,[3]->[10]
// a1,[3]->[2]
// a1,[2]->[7]
// a1,[2]->[6]
// a1,[2]->[2]
// a0,[1]->[9]
// a0,[1]->[0]
// a1,[1]->[4]
// a0,[0]->[10]
// a0,[0]->[4]
// a0,[0]->[0]
// a1,[0]->[14]
// a1,[0]->[9]
// a1,[0]->[8]
// [10]
// [7]
// [0]

// `)
// })

// export let teachers = [t1, teacher_a_or_baStar, teacher_b_bStar_a__b_aOrb_star, binaryAddition, teacherA3fromLast, teacherEvenAandThreeB, teacherNotAfourthPos, teacherPairZeroAndOne, teacher_bStar_a_or_aStart_bStar]

export let teachers = [teacher_a_or_baStar, teacher_bStar_a_or_aStart_bStar, teacherNotAfourthPos, teacherEvenAandThreeB, teacherA3fromLast, teacherPairZeroAndOne]