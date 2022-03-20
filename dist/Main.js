import{Teacher,teachers}from"./Teacher.js";import{HTML_L_star}from"./html_interactions/HTML_L_star.js";import{HTML_NL_star}from"./html_interactions/HTML_NL_star.js";import{Automaton}from"./automaton/Automaton.js";import{L_star}from"./lerners/L_star.js";import{NL_star}from"./lerners/NL_star.js";import*as autFunction from"./automaton/automaton_type.js";export let automatonDiv,message,tableHTML,automatonHTML;export function initiate_global_vars(){automatonHTML=$("#automaton-mermaid")[0];automatonDiv=$("#input-automaton")[0];let button_next=$("#next_step")[0];message=$("#message")[0];tableHTML=$("#table")[0];let current_automaton;let teacher_switch_HTML=$("#teacher_switch")[0];let teacher_description_HTML=$("#teacher_description")[0];let radioAlgo=Array.from($(".algo-switch"));let conterRadioButton=0;let mapOptionTeacher={};let listenerAlgoSwitch=teacher=>{tableHTML.innerHTML="";message.innerHTML="";clear_automaton_HTML();current_automaton=radioAlgo[0].checked?new HTML_L_star(teacher):new HTML_NL_star(teacher);teacher_description_HTML.innerHTML=current_automaton.lerner.teacher.description;MathJax.typeset()};let createRadioTeacher=teacher=>{let option=document.createElement("option");option.value=""+conterRadioButton++;option.text=teacher.regex;teacher_switch_HTML.appendChild(option);mapOptionTeacher[option.value]=teacher;return option};let addCustomTeacherWithRegex=()=>{let regexAutButton=$("#input-regex")[0];let createAutButton=$("#button-regex")[0];createAutButton.addEventListener("click",()=>{let teacher=new Teacher(`My automaton with regex = (${regexAutButton.value})`,regexAutButton.value,sentence=>sentence.match(new RegExp("^("+regexAutButton.value+")$"))!=undefined,[]);let radioTeacher=createRadioTeacher(teacher);radioTeacher.selected=true;listenerAlgoSwitch(teacher)})};teacher_switch_HTML.addEventListener("change",function(){listenerAlgoSwitch(mapOptionTeacher[this.selectedOptions[0].value])});radioAlgo.forEach(e=>{e.addEventListener("click",()=>listenerAlgoSwitch(current_automaton.lerner.teacher))});teachers.forEach((teacher,pos)=>{let radioTeacher=createRadioTeacher(teacher);if(pos==0)listenerAlgoSwitch(teacher)});button_next.addEventListener("click",()=>{current_automaton.graphic_next_step()});addCustomTeacherWithRegex()}export function clear_automaton_HTML(){automatonDiv.innerHTML="";automatonHTML.innerHTML=""}try{process==undefined}catch(e){window.onload=()=>initiate_global_vars();window.Automaton=Automaton;window.Teacher=Teacher;window.teachers=teachers;window.L_star=L_star;window.NL_star=NL_star;window.autFunction=autFunction}
//# sourceMappingURL=Main.js.map