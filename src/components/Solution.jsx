import React from "react";
import { fromSetToString } from "../logic/utils/machineUtils";
import OutputMachineTable from "./MachineTable/OutputMachineTable";

function Solution({ solution }) {

    const renderParitions = (partitions) => {

       let partitionsStrArr = [<p className={styles.textTitle}>Minimization partitions:</p>];
       for(let i=0; i<partitions.length; i++){
        partitionsStrArr.push(<p className={styles.text} key={i}>{'P'+i+' = '+fromSetToString(partitions[i])}</p>);
       }
       return partitionsStrArr;
    }
  return (
    <section>
      <article>
      
        <div className="border-b-2 border-solid border-slate-200 pb-2">
            <p className={styles.textTitle}>Inaccessible states:</p>
            <p className={styles.text}>{solution.removedStates}</p>
        </div>
        <div className=" border-b-2 pb-2 border-solid border-slate-200">
        {renderParitions(solution.minimizedPartitions)}
        </div>
      </article>
      <article>
      <p className={styles.textTitle}>Minimal connected equivalent:</p>
        <OutputMachineTable machine = {solution.newMooreMachine}/>
      </article>
    </section>
  );
}
const styles = {

  textTitle:"text-slate-700 mt-2 font-bold",
  text:"text-slate-700"
};

export default Solution;
