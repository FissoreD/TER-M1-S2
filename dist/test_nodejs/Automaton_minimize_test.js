import{Automaton,State}from"../automaton/Automaton.js";let state1=new State("0",false,true,["a","b"]);let state2=new State("1",true,false,["a","b"]);let state3=new State("2",true,false,["a","b"]);state1.addTransition("a",state2);state2.addTransition("a",state3);let a=new Automaton(new Set([state1,state2,state3]));console.log(a.matrix_to_mermaid());console.log("-".repeat(70));console.log(a.minimize().matrix_to_mermaid());console.log();
//# sourceMappingURL=Automaton_minimize_test.js.map