import{NL_star}from"../learners/NL_star.js";import{L_star}from"../learners/L_star.js";import{teachers}from"../teacher/Teacher.js";import{clearFile,csvHead,printCsvCompare,printInfo,writeToFile}from"./PrintFunction.js";let fileName="randomRegex";clearFile(fileName);writeToFile(fileName,csvHead);for(let index=0;index<teachers.length;index++){const teacher=teachers[index];teacher.description=index+"";let L=new L_star(teacher);let NL=new NL_star(teacher);console.log("==============================");console.log("Current regexp : ",teacher.regex,teacher.description);L.make_all_queries();printInfo(L,"L*");NL.make_all_queries();printInfo(L,"NL*");writeToFile(fileName,printCsvCompare(L,NL))}
//# sourceMappingURL=LernerCompare.js.map