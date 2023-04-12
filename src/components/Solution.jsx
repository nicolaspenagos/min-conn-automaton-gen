import React from "react";
import { fromSetToString } from "../logic/utils/machineUtils";
import OutputMachineTable from "./MachineTable/OutputMachineTable";

function MooreSolution({ solution }) {
  const renderParitions = (partitions) => {
    let partitionsStrArr = [];
    for (let i = 0; i < partitions.length; i++) {
      //if(partitions[i].size>0)
      partitionsStrArr.push("P" + i + " = " + fromSetToString(partitions[i]));
    }
    return partitionsStrArr;
  };
  return (
    <section>
      <article>
        <div className="border-b-2 border-solid border-slate-200 pb-2">
          <p className={styles.textTitle}>Inaccessible states:</p>
          <p className={styles.text}>{solution.removedStates}</p>
        </div>
        <div className=" border-b-2 pb-2 border-solid border-slate-200">
          <p className={styles.textTitle}>
            Minimization equivalent partitions:
          </p>
          {renderParitions(solution.minimizedPartitions).map((element, i) => (
            <p className={styles.text} key={"pindx" + i}>
              {element}
            </p>
          ))}
        </div>
      </article>
      <article>
        <p className={styles.textTitle}>Minimal connected equivalent:</p>
        <OutputMachineTable machine={solution.machine} />
      </article>
    </section>
  );
}
const styles = {
  textTitle: "text-slate-700 mt-2 font-bold",
  text: "text-slate-700",
};

export default MooreSolution;
