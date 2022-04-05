import{boolToString,generate_prefix_list}from"../tools/Utilities.js";export class LernerBase{finish=false;constructor(teacher){this.alphabet=Array.from(teacher.alphabet);this.teacher=teacher;this.member_number=0;this.equiv_number=0;this.E=[""];this.S=[""];this.SA=Array.from(this.alphabet);this.observation_table={};this.add_row("");this.SA.forEach(elt=>this.add_row(elt))}update_observation_table(key,value){let old_value=this.observation_table[key];if(old_value!=undefined)value=old_value+value;this.observation_table[key]=value}make_member(pref,suff){let word=pref+suff;let answer;for(let i=0;i<word.length+1;i++){let pref1=word.substring(0,i);let suff1=word.substring(i);if(pref1==pref)continue;if(this.E.includes(suff1)){if((this.S.includes(pref1)||this.SA.includes(pref1))&&this.observation_table[pref1]){answer=this.observation_table[pref1].charAt(this.E.indexOf(suff1));this.update_observation_table(pref,answer);if(answer==undefined)throw"Parameter is not a number!";return}}}answer=this.teacher.member(word);this.update_observation_table(pref,answer);this.member_number++}make_equiv(a){let answer=this.teacher.equiv(a);this.equiv_number++;return answer}add_elt_in_S(new_elt,after_member=false){let added_list=[];let prefix_list=generate_prefix_list(new_elt);for(const prefix of prefix_list){if(this.S.includes(prefix))return added_list;if(this.SA.includes(prefix)){this.move_from_SA_to_S(prefix);this.alphabet.forEach(a=>{const new_word=prefix+a;if(!this.SA.includes(new_word)&&!this.S.includes(new_word)){this.add_row(new_word,after_member);this.SA.push(new_word);added_list.push(new_word)}})}else{this.S.push(prefix);this.add_row(prefix,after_member);added_list.push(prefix);this.alphabet.forEach(a=>{let new_word=prefix+a;if(!this.SA.includes(new_word)&&!this.S.includes(new_word)){this.SA.push(prefix+a);this.add_row(prefix+a);added_list.push(prefix+a)}})}after_member=false}return added_list}add_row(row_name,after_member=false){this.E.forEach(e=>{if(after_member&&e=="")this.observation_table[row_name]=boolToString(!this.automaton.accept_word_nfa(row_name)[0]);else this.make_member(row_name,e)})}move_from_SA_to_S(elt){const index=this.SA.indexOf(elt);if(index!=-1)this.SA.splice(index,1);this.S.push(elt)}add_column(new_col){let L=[this.SA,this.S];L.forEach(l=>l.forEach(s=>this.make_member(s,new_col)));this.E.push(new_col)}make_next_query(){if(this.finish)return;var close_rep;var consistence_rep;if(close_rep=this.is_close()){this.add_elt_in_S(close_rep)}else if(consistence_rep=this.is_consistent()){let new_col=consistence_rep[2];this.add_column(new_col)}else{let automaton=this.make_automaton();this.automaton=automaton;let answer=this.make_equiv(automaton);if(answer!=undefined){this.table_to_update_after_equiv(answer)}else{this.finish=true}}}make_all_queries(){while(!this.finish){this.make_next_query()}}same_row(a,b){return this.observation_table[a]==this.observation_table[b]}}
//# sourceMappingURL=LernerBase.js.map