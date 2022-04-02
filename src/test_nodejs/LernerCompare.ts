import { NL_star } from "../lerners/NL_star.js";
import { L_star } from "../lerners/L_star.js";
import { teacherPairZeroAndOne } from "../Teacher.js";
import { LernerTester } from "./AlgoTester.js";

let lernerL = new LernerTester(new L_star(teacherPairZeroAndOne))
let lernerNL = new LernerTester(new NL_star(teacherPairZeroAndOne))

while (!lernerL.finish())
  lernerL.next_step()

while (!lernerNL.finish())
  lernerNL.next_step()

let compare = (a: L_star, b: NL_star) => {
  let qNb1 = a.query_number, qNb2 = b.query_number,
    mNb1 = a.equiv_number, mNb2 = b.equiv_number;
  console.log(`L Star : queries = ${qNb1}, equiv = ${mNb1}`);
  console.log(`NL Star : queries = ${qNb2}, equiv = ${mNb2}`);
}

compare(lernerL.lerner as L_star, lernerNL.lerner as NL_star)