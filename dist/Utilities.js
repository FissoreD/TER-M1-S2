export function same_vector(v1,v2){return v1.map((elt,pos)=>elt==v2[pos]).every(e=>e)}export const generate_prefix_list=str=>Array(str.length+1).fill(0).map((_,i)=>str.substring(0,i)).reverse();export const generate_suffix_list=str=>Array(str.length+1).fill("").map((_,i)=>str.substring(i,str.length+1));export const count_str_occurrences=(str,obj)=>Array.from(str).filter(f=>f==obj).length;
//# sourceMappingURL=Utilities.js.map