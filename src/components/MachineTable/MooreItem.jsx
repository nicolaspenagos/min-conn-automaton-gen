import React, { useContext } from "react";
import { DataContext } from "../Minimizer.jsx";
import { Dropdown } from "primereact/dropdown";
import { getStatesOptions } from "../../logic/utils/machineUtils.js";

function MooreItem({ handleChangeMachineMatrix, i, j, isOutputItem }) {
  const data = useContext(DataContext);

  return (
    <div className="flex">
      <Dropdown
        className=" min-w-[80px] !border-0 !rounded-none"
        value={
          data.machineMatrix &&
          data.machineMatrix[i] &&
          data.machineMatrix[i][j]
            ? data.machineMatrix[i][j]
            : ""
        }
        options={
          isOutputItem
            ? getStatesOptions(data.outputAlphabet)
            : getStatesOptions(data.states)
        }
        onChange={(e) => handleChangeMachineMatrix(i, j, e.target.value)}
      />
    </div>
  );
}

export default MooreItem;
