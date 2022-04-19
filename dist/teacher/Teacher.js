import{MyAutomatonToHis}from"../automaton/automaton_type.js";import{minimizeAutomaton}from"../automaton/automaton_type.js";import{Automaton,State}from"../automaton/Automaton.js";import{TeacherAutomaton}from"./TeacherAutomaton.js";import{TeacherNoAutomaton}from"./TeacherNoAutomaton.js";import{TeacherTakingAut}from"./TeacherTakingAut.js";import{allStringFromAlphabet}from"../tools/Utilities.js";export let teacher_a_or_baStar=new TeacherAutomaton("a+(ba)*");export let teacherPairZeroAndOne=new TeacherAutomaton("(00+11+(01+10)(00+11)*(01+10))*",`Automaton accepting L = {w in (0, 1)* | #(w_0) % 2 = 0 and #(w_1) % 2 = 0} <br/> → words with even nb of '0' and even nb of '1'`);export let teacherA3fromLast=new TeacherAutomaton("(a+b)*a(a+b)(a+b)",`Automaton accepting L = {w in (a, b)* | w[-3] = a} <br/>
    → words with an 'a' in the 3rd pos from end`);export let teacherEvenAandThreeB=new TeacherAutomaton("b*a(b+ab*a)*+(a+b)*ba*ba*b(a+b)*",`Automaton accepting L = {w in (a, b)* | #(w_b) ≥ 3 or #(w_a) % 2 = 1}
  <br/> → words with at least 3 'b' or an odd nb of 'a'`);export let teacherNotAfourthPos=new TeacherAutomaton("((a+b)(a+b)(a+b)b)*(a+b+$)(a+b+$)(a+b+$)",`Automaton accepting L = {w ∈ (a,b)* and i ∈ 4ℕ | w[i] ≠ a and i ≤ len(w)} <br/>
  → words without an 'a' in a position multiple of 4`);export let teacher_bStar_a_or_aStart_bStar=new TeacherNoAutomaton({alphabet:"ab",regex:"((bb*a)|(a*b*))",counter_examples:["bba","b","aabb","aba","aa","bbaa"]},`Automaton accepting L = regex((bb^*a) + (a^*b^*))`);export let teacher_b_bStar_a__b_aOrb_star=new TeacherAutomaton("bb*($+a(b(a+b))*)");export let binaryAddition=new TeacherNoAutomaton({alphabet:"012345678",regex:sentence=>{let _=`  
       * Automaton calculating addition between binary integers:
       * exemple : 
       * 0101 + 
       * 1001 =
       * 1110
       * is a valid exemple that can be sent to the automaton with the encoding 3516
       * 3 = 011 (the 1st col), 5 = 101 (the 2nd col), 
       * 1 = 001 (the 3rd col), 6 = 110 (the 4th col) 
       **/ `;let charToBin=char=>(parseInt(char)>>>0).toString(2).padStart(3,"0");let sentenceAr=Array.from(sentence).map(e=>charToBin(e));let fst_term=parseInt(sentenceAr.map(e=>e[0]).join(""),2);let snd_term=parseInt(sentenceAr.map(e=>e[1]).join(""),2);let trd_term=parseInt(sentenceAr.map(e=>e[2]).join(""),2);return fst_term+snd_term==trd_term},counter_examples:allStringFromAlphabet({alphabet:"012345678",maxLength:3})});let automaton;{let n=4;let states=new Array(n).fill(0).map((_,i)=>new State(i+"",i==0,i<n/2,["a","b"]));for(let i=0;i<n-1;i++)states[i].addTransition("a",states[i+1]);states[n-1].addTransition("a",states[0]);states[0].addTransition("b",states[0]);for(let i=2;i<n;i++)states[i].addTransition("b",states[i-1]);states[1].addTransition("b",states[n-1]);automaton=minimizeAutomaton(MyAutomatonToHis(new Automaton(new Set(states))))}let badForNl=new TeacherTakingAut({automaton});let test=new TeacherTakingAut({automaton:Automaton.strToAutomaton(`[6]
a,[0]->[1]
b,[0]->[6]
a,[1]->[9]
b,[1]->[5]
a,[2]->[3]
b,[2]->[1]
a,[3]->[0]
b,[3]->[6]
a,[4]->[1]
b,[4]->[5]
a,[5]->[7]
b,[5]->[3]
a,[6]->[4]
b,[6]->[2]
a,[7]->[4]
b,[7]->[8]
a,[8]->[10]
b,[8]->[4]
a,[9]->[9]
b,[9]->[2]
a,[10]->[8]
b,[10]->[2]
[0]
[1]`),description:"Test with 5 states"});export let teachers=[test,badForNl,teacher_a_or_baStar,teacher_b_bStar_a__b_aOrb_star,binaryAddition,teacherA3fromLast,teacherEvenAandThreeB,teacherNotAfourthPos,teacherPairZeroAndOne,teacher_bStar_a_or_aStart_bStar];
//# sourceMappingURL=Teacher.js.map