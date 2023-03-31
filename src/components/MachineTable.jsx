import React, { useContext } from "react";
import { DataContext, MOORE, MEALY } from "./Minimizer.jsx";
import MooreItem from "./MooreItem.jsx";

function MachineTable({handleChangeMachineMatrix}) {
  const data = useContext(DataContext);

  const renderTableHeader = () => {
    return (
      <tr>
        <th className=" border-0 min-w-[30px]"></th>
        {data.inputAlphabet.map((element, index) => (
          <th
            key={index + 1}
            className={
              index + 1 === data.inputAlphabet.length
                ? "border-t-0 border-b-0 border-l-0 font-normal"
                : "font-normal border-0"
            }
          >
            {element}
          </th>
        ))}
        <th className="border-0 min-w-[80px]"></th>
      </tr>
    );
  };

  const getTableBody = () => {
    let table = [];
  
    for (let i = 0; i < data.states.length; i++) {
      let row = (
        <tr key={"row-" + i}>
          <td className="text-center border-0">{data.states[i]}</td>
          {data.inputAlphabet.map((element, j) => (
            <td key={"cell-" + j}>
              <MooreItem i={i} j={j} handleChangeMachineMatrix={handleChangeMachineMatrix} isOutputItem={false}/>
            </td>
          ))}
          <td>
            <MooreItem i={i} j={data.inputAlphabet.length} handleChangeMachineMatrix={handleChangeMachineMatrix} isOutputItem={true}/>
          </td>
        </tr>
      );
      table.push(row);
    }
    return table;
  };

  return (
    <table className={styles.table}>
      <thead>{renderTableHeader()}</thead>
      <tbody>
        {getTableBody()}
      </tbody>
    </table>
  );
}

const styles = {
  table: "mt-6 text-slate-800",
};

export default MachineTable;
