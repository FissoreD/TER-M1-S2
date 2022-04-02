import{Automaton}from"../Automaton.js";import{generate_prefix_list}from"../Utilities.js";export class L_star{constructor(alphabet,teacher){this.alphabet=Array.from(alphabet);this.teacher=teacher;this.query_number=0;this.member_number=0;this.E=[""];this.S=[""];this.SA=Array.from(alphabet);this.observation_table={};this.make_query("","");this.SA.forEach(elt=>this.make_query(elt,""))}update_observation_table(new_str,value){let old_value=this.observation_table[new_str];if(old_value!=undefined)value=old_value+value;this.observation_table[new_str]=value}make_query(pref,suff){var answer=this.teacher.query(pref+suff);this.update_observation_table(pref,answer);this.query_number++}make_member(a){let answer=this.teacher.member(a);this.member_number++;return answer}add_elt_in_S(new_elt){let prefix_list=generate_prefix_list(new_elt);console.log(new_elt,"is going to be added in S, it has",prefix_list);for(const prefix of prefix_list){if(this.S.includes(prefix))return;if(this.SA.includes(prefix)){this.move_from_SA_to_S(prefix);this.alphabet.forEach(a=>{const new_word=prefix+a;if(!this.SA.includes(new_word)&&!this.S.includes(new_word)){this.E.forEach(e=>this.make_query(new_word,e));this.SA.push(new_word)}})}else{this.E.forEach(e=>this.make_query(prefix,e));this.S.push(prefix);this.alphabet.forEach(a=>{let new_word=prefix+a;if(!this.SA.includes(new_word)&&!this.S.includes(new_word)){this.SA.push(prefix+a);this.E.forEach(e=>this.make_query(prefix+a,e))}})}}}move_from_SA_to_S(elt){const index=this.SA.indexOf(elt);if(index!=-1)this.SA.splice(index,1);this.S.push(elt)}find_suffix_not_compatible(consistence_error){let e=this.E.find((_e,pos)=>{let cell=value=>this.observation_table[consistence_error[value]+consistence_error[2]][pos];return cell(0)!=cell(1)});let new_col=consistence_error[2]+e;return new_col}add_column(new_col){let L=[this.SA,this.S];L.forEach(l=>l.forEach(s=>this.make_query(s,new_col)));this.E.push(new_col)}define_next_questions(){const close_rep=this.is_close();const consistence_rep=this.is_consistent();if(close_rep!=undefined){this.add_elt_in_S(close_rep)}else if(consistence_rep!=undefined){let new_col=this.find_suffix_not_compatible(consistence_rep);this.add_column(new_col)}else{return true}return false}make_automaton(){let states={};this.S.forEach(e=>states[this.observation_table[e]]=e);let first_state=this.observation_table[""];let keys=Object.keys(states);let end_states=keys.filter(k=>k[0]=="1");let ar=keys.map(k=>this.alphabet.map(a=>{return this.observation_table[states[k]+a]}));return new Automaton({"alphabet":this.alphabet,"endNodes":end_states,"startNode":first_state,"states":keys,"transitions":ar})}is_close(){return this.SA.find(t=>!this.S.some(s=>this.same_row(s,t)))}is_consistent(){for(let s1_ind=0;s1_ind<this.S.length;s1_ind++){for(let s2_ind=s1_ind+1;s2_ind<this.S.length;s2_ind++){let s1=this.S[s1_ind];let s2=this.S[s2_ind];if(this.same_row(s1,s2)){let first_unmacth=this.alphabet.find(a=>!this.same_row(s1+a,s2+a));if(first_unmacth!=undefined)return[s1,s2,first_unmacth]}}}}same_row(a,b){return this.observation_table[a]==this.observation_table[b]}}
//# sourceMappingURL=L_star.js.map