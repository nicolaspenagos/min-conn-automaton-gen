import React from "react";
import { MEALY } from "../Minimizer.jsx";
import { MOORE } from "../Minimizer.jsx";
function OutputMachineTable({ machine }) {
  const renderTableHeader = () => {
    return (
      <tr>
        <th className=" border-0 min-w-[30px]"></th>
        {machine.inputAlphabet.map((element, index) => (
          <th
            key={index + 1}
            className={
              index + 1 === machine.inputAlphabet.length
                ? "border-0 font-normal"
                : "font-normal border-0"
            }
          >
            {element}
          </th>
        ))}
        <th
          className={
            machine.type === MEALY
              ? "hidden border-t-0 border-b-0 border-r-0  min-w-[80px] font-normal"
              : "border-t-0 border-b-0 border-r-0 min-w-[80px] font-normal"
          }
        >
          Output
        </th>
      </tr>
    );
  };

  const getTableBody = () => {
    let table = [];

    let counter = 0;
    for (const [stateKey, val] of machine.states) {
      let row = (
        <tr key={"row-" + counter}>
          <td className="text-right pr-2 border-0">
            {stateKey === machine.initialState ? "> " + stateKey : stateKey}
          </td>
          {val.stateStransitions.map((element, j) => (
            <td key={"row-" + counter++} className=" min-w-[80px] text-center ">
              {machine.type===MOORE?element:element.nextState+'|'+element.output }
            </td>
          ))}
          <td className={machine.type === MEALY ? "hidden" : ""}>
            {val.output}
          </td>
        </tr>
      );
      table.push(row);
      counter++;
    }
    return table;
  };

  return (
    <table className="mt-2 text-slate-800">
      <thead>{renderTableHeader()}</thead>
      <tbody>{getTableBody()}</tbody>
    </table>
  );
}

export default OutputMachineTable;
