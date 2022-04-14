import{Automaton,State}from"../automaton/Automaton.js";import{LearnerBase}from"./LearnerBase.js";export class L_star extends LearnerBase{constructor(teacher){super(teacher)}make_automaton(){let wordForState=[],statesMap=new Map,acceptingStates=[],initialStates=[],statesSet=new Set;this.S.forEach(s=>{let name=this.observation_table[s];if(!statesMap.get(name)){let state=new State(name,name[0]=="1",s=="",this.alphabet);wordForState.push(s);if(state.isAccepting)acceptingStates.push(state);if(state.isInitial)initialStates.push(state);statesMap.set(name,state);statesSet.add(state)}});for(const word of wordForState){let name=this.observation_table[word];for(const symbol of this.alphabet){statesMap.get(name).outTransitions.get(symbol).push(statesMap.get(this.observation_table[word+symbol]))}}this.automaton=new Automaton(statesSet);return this.automaton}is_close(){return this.SA.find(t=>!this.S.some(s=>this.same_row(s,t)))}is_consistent(){for(let s1_ind=0;s1_ind<this.S.length;s1_ind++){for(let s2_ind=s1_ind+1;s2_ind<this.S.length;s2_ind++){let s1=this.S[s1_ind];let s2=this.S[s2_ind];if(this.same_row(s1,s2)){for(const a of this.alphabet){for(let i=0;i<this.E.length;i++){if(this.observation_table[s1+a][i]!=this.observation_table[s2+a][i]&&!this.E.includes(a+this.E[i]))return[s1,s2,a+this.E[i]]}}}}}}same_row(a,b){return this.observation_table[a]==this.observation_table[b]}table_to_update_after_equiv(answer){this.add_elt_in_S(answer)}}
//# sourceMappingURL=L_star.js.map