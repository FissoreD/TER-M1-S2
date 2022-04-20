import{readdirSync,readFileSync}from"fs";import{clearFile,csvHead,printCsvCompare,printInfo,writeToFile}from"./PrintFunction.js";import{TeacherTakingAut}from"../teacher/TeacherTakingAut.js";import{L_star}from"../learners/L_star.js";import{NL_star}from"../learners/NL_star.js";import{Automaton}from"../automaton/Automaton.js";let benchMark=true;let path="./statistics/"+(benchMark?"benchMark/":"automata/"),fileName=benchMark?"benchMark":"randomAutomata",files=readdirSync(path),automata=[],toWrite=true;let l=["1.5-0.1/A13.ba","1.5-0.1/A17.ba","1.5-0.1/A19.ba","1.5-0.1/A2.ba","1.5-0.1/A37.ba","1.5-0.1/A42.ba","1.5-0.1/A44.ba","1.5-0.1/A58.ba","1.5-0.1/A7.ba","1.5-0.1/A82.ba","1.5-0.1/A85.ba","1.5-0.1/A93.ba","1.5-0.1/A99.ba","1.5-0.1/B12.ba","1.5-0.1/B18.ba","1.5-0.1/B23.ba","1.5-0.1/B37.ba","1.5-0.1/B48.ba","1.5-0.1/B49.ba","1.5-0.1/B5.ba","1.5-0.1/B58.ba","1.5-0.1/B60.ba","1.5-0.1/B71.ba","1.5-0.1/B80.ba","1.5-0.1/B9.ba","1.5-0.2/A2.ba","1.5-0.2/A42.ba","1.5-0.2/A89.ba","1.5-0.2/A9.ba","1.5-0.2/B15.ba","1.5-0.2/B30.ba","1.5-0.2/B48.ba","1.5-0.2/B53.ba","1.5-0.2/B59.ba","1.5-0.2/B71.ba","1.5-0.2/B81.ba","1.5-0.2/B92.ba","1.5-0.3/A36.ba","1.5-0.3/A5.ba","1.5-0.3/A52.ba","1.5-0.4/A50.ba","1.5-0.4/A53.ba","1.5-0.4/A65.ba","","1.5-0.5/A2.ba","1.5-0.5/A4.ba","1.5-0.5/A69.ba","1.5-0.5/A96.ba","1.5-0.5/B20.ba","1.5-0.5/B79.ba","1.5-0.5/B91.ba","1.5-0.6/A5.ba","1.5-0.6/B89.ba","1.5-0.6/B97.ba","1.5-0.7/A40.ba","1.5-0.7/A64.ba","1.5-0.7/B50.ba","1.5-0.7/B73.ba","1.5-0.8/A42.ba","1.5-0.8/A88.ba","1.5-0.8/B54.ba","1.5-0.9/A40.ba","1.5-0.9/B16.ba","1.5-1/B86.ba"];let minStateNb=102;for(const underFolder of files){console.log(underFolder);if(!l.includes(underFolder))continue;let newPath=path+underFolder+"/";let files=readdirSync(newPath);for(const file of files){if(!l.includes(underFolder+"/"+file))continue;if(!file.endsWith(".ba"))continue;console.log("=".repeat(90));console.error("Creating automaton of file",underFolder+"/"+file);console.log("Creating automaton of file",underFolder+"/"+file);let content=readFileSync(newPath+file).toString();let automaton=Automaton.strToAutomaton(content);let teacher=new TeacherTakingAut({automaton:automaton,regex:underFolder+"/"+file});if(teacher.automaton.state_number()<minStateNb)continue;automata.push([teacher,underFolder+"/"+file]);teacher.description=teacher.automaton.state_number()+""}}console.log(automata.map(e=>e[1]));console.log("=".repeat(90));console.log("Automata created the ordered list of states is :");automata.sort((a,b)=>a[0].automaton.state_number()-b[0].automaton.state_number());automata.forEach(a=>console.log(a[0].automaton.state_number()));if(toWrite){clearFile(fileName);writeToFile(fileName,csvHead)}for(let index=0;index<automata.length;index++){const[teacher,file]=automata[index];let L=new L_star(teacher),NL=new NL_star(teacher);console.log("=".repeat(90));console.error(file,"Current benchmark :",index,"/",automata.length,"With state number",teacher.automaton.state_number());console.log(file,"Current benchmark :",index,"/",automata.length,"With state number",teacher.automaton.state_number());console.error("In L*");L.make_all_queries();console.log(printInfo(L,"L*"));console.log("-".repeat(80));console.error("In NL*");NL.make_all_queries();console.log(printInfo(NL,"NL*"));console.log(printCsvCompare(L,NL));if(toWrite)writeToFile(fileName,printCsvCompare(L,NL))}
//# sourceMappingURL=CompareBenchMark.js.map