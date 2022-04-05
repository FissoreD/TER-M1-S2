import{Teacher,teachers}from"./Teacher.js";import{HTML_L_star}from"./html_interactions/HTML_L_star.js";import{HTML_NL_star}from"./html_interactions/HTML_NL_star.js";import{Automaton}from"./automaton/Automaton.js";import{L_star}from"./lerners/L_star.js";import{NL_star}from"./lerners/NL_star.js";import*as autFunction from"./automaton/automaton_type.js";export let automatonDiv,message,tableHTML,automatonHTML,automatonDivList=[];export function initiate_global_vars(){automatonHTML=$("#automaton-mermaid")[0];automatonDiv=$("#input-automaton")[0];message=$("#message")[0];tableHTML=$("#table")[0];let current_automaton,teacherSelector=$("#teacher-switch")[0],teacherDescription=$("#teacher_description")[0],algoSelector=Array.from($(".algo-switch")),mapTeacherValue={},counter=0,currentTeacher=teachers[0],newRegex=$("#input-regex")[0],newRegexSendButton=$("#button-regex")[0];let changeTeacherOrAlgo=()=>{tableHTML.innerHTML="";message.innerHTML="";clear_automaton_HTML();current_automaton=algoSelector[0].checked?new HTML_L_star(currentTeacher):new HTML_NL_star(currentTeacher);teacherDescription.innerHTML=current_automaton.lerner.teacher.description;MathJax.typeset()};let createRadioTeacher=teacher=>{let newTeacherHtml=document.createElement("option");newTeacherHtml.value=counter+"";newTeacherHtml.text=teacher.regex;mapTeacherValue[""+counter++]=teacher;teacherSelector.appendChild(newTeacherHtml);return newTeacherHtml};changeTeacherOrAlgo();teacherSelector.onchange=()=>{currentTeacher=mapTeacherValue[teacherSelector.selectedOptions[0].value];changeTeacherOrAlgo()};algoSelector.forEach(as=>as.onclick=()=>changeTeacherOrAlgo());teachers.forEach(teacher=>createRadioTeacher(teacher));$("#next_step")[0].addEventListener("click",()=>current_automaton.graphic_next_step());$("#go_to_end")[0].addEventListener("click",()=>current_automaton.go_to_end());newRegexSendButton.addEventListener("click",()=>{let regexAlreadyExists=Array.from($("#teacher-switch option")).find(e=>e.text==newRegex.value);let newTeacherOption;if(regexAlreadyExists){newTeacherOption=regexAlreadyExists}else{currentTeacher=new Teacher(`My automaton with regex = (${newRegex.value})`,newRegex.value,_s=>true,[]);newTeacherOption=createRadioTeacher(currentTeacher)}newTeacherOption.selected=true;changeTeacherOrAlgo()})}export function clear_automaton_HTML(){automatonDiv.innerHTML="";automatonHTML.innerHTML=""}try{process==undefined}catch(e){window.onload=function(){initiate_global_vars();resizableGrid($(".mainTable")[0])};window.Automaton=Automaton;window.Teacher=Teacher;window.teachers=teachers;window.L_star=L_star;window.NL_star=NL_star;window.autFunction=autFunction;window.automatonDivList=automatonDivList}
//# sourceMappingURL=Main.js.map