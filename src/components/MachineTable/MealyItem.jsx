import React, { useContext } from "react";
import { DataContext } from "../Minimizer.jsx";
import { Dropdown } from "primereact/dropdown";
import { getStatesOptions } from "../../logic/utils/machineUtils.js";

function MealyItem({ handleChangeMachineMatrix, i, j }) {
  const data = useContext(DataContext);

  const getChangeNextState = (val) => {
    if (doesCellExist()) {
      return { ...data.machineMatrix[i][j], nextState: val };
    }
    return { nextState: val };
  };

  const getChangeOutput = (val) => {
    if (doesCellExist()) {
      return { ...data.machineMatrix[i][j], output: val };
    }
    return { output: val };
  };

  const doesCellExist = () => {
    return (
      data.machineMatrix && data.machineMatrix[i] && data.machineMatrix[i][j]
    );
  };

  return (
    <div className="flex">
      <Dropdown
        className=" min-w-[80px] !border-0 !rounded-none"
        value={
          data.machineMatrix &&
          data.machineMatrix[i] &&
          data.machineMatrix[i][j] &&
          data.machineMatrix[i][j].nextState
            ? data.machineMatrix[i][j].nextState
            : ""
        }
        options={getStatesOptions(data.states)}
        onChange={(e) =>
          handleChangeMachineMatrix(i, j, getChangeNextState(e.target.value))
        }
      />
      <p>|</p>
      <Dropdown
        className=" min-w-[80px] !border-0 !rounded-none"
        value={
          data.machineMatrix &&
          data.machineMatrix[i] &&
          data.machineMatrix[i][j] &&
          data.machineMatrix[i][j].output
            ? data.machineMatrix[i][j].output
            : ""
        }
        options={getStatesOptions(data.outputAlphabet)}
        onChange={(e) =>
          handleChangeMachineMatrix(i, j, getChangeOutput(e.target.value))
        }
      />
    </div>
  );
}

export default MealyItem;
