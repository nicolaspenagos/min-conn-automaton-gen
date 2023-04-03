import React, { useContext, useState, useEffect } from "react";
import BaseInput from "./BaseInput";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import MachineTable from "./MachineTable/MachineTable";
import { getMinMooreMachine } from "../logic/moore/mooreLogic.js";
import {
  getStatesOptions,
  generateEmptyMatrix,
  isFullFilled,
} from "../logic/utils/machineUtils.js";

export const DataContext = React.createContext();
export const MOORE = "Moore";
export const MEALY = "Mealy";

function Minimizer() {
  const [data, setData] = useState({
    states: [],
    inputAlphabet: [],
    initialState: "",
    outputAlphabet: ["0", "1"],
    type: MOORE,
    machineMatrix: null,
  });

  const [disabled, setDisabled] = useState(true);

  const handleChangeStates = (newStates) => {
    setData((prevState) => ({ ...prevState, states: newStates }));
  };

  const handleSetType = (newType) => {
    resetMatrix();
    setData((prevState) => ({ ...prevState, type: newType }));
  };

  const handleChangeInputAlphabet = (newAlphabet) => {
    setData((prevState) => ({ ...prevState, inputAlphabet: newAlphabet }));
  };

  const handleChangeInitialState = (newInitialState) => {
    setData((prevState) => ({ ...prevState, initialState: newInitialState }));
  };

  const handleChangeMachineMatrix = (i, j, element) => {
    let newMatrix;
    if (!data.machineMatrix) {
      newMatrix = generateEmptyMatrix(
        data.states.length,
        data.inputAlphabet.length,
        data.type === MOORE ? 1 : 0
      );
    } else {
      newMatrix = [...data.machineMatrix];
    }

    newMatrix[i][j] = element;
    setData((prevState) => ({ ...prevState, machineMatrix: newMatrix }));
    setDisabled(!isFullFilled(data.machineMatrix));
  };

  const resetMatrix = () => {
    setData((prevState) => ({ ...prevState, machineMatrix: null }));
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h1 className={styles.title}>{data.type} machine</h1>
        <div className="flex flex-wrap gap-3">
          <div className="flex align-items-center">
            <RadioButton
              inputId="machine1"
              name="Moore"
              value="Moore"
              onChange={(e) => handleSetType(e.value)}
              checked={data.type === "Moore"}
            />
            <label htmlFor="machine1" className="ml-2 text-sm">
              Moore
            </label>
          </div>
          <div className="flex align-items-center">
            <RadioButton
              inputId="machine2"
              name="Mealy"
              value="Mealy"
              onChange={(e) => handleSetType(e.value)}
              checked={data.type === "Mealy"}
            />
            <label htmlFor="machine2" className="ml-2 text-sm">
              Mealy
            </label>
          </div>
        </div>
      </header>
      <article className={styles.article}>
        <DataContext.Provider value={data}>
          <p className={styles.p}>
            <span className={styles.span}>1.</span> Enter the{" "}
            <strong>states</strong> separated by commas:
          </p>
          <BaseInput
            label="* Only different alphanumeric values and commas are allowed"
            placeholder="e.g. A,B,C,D"
            onChangeData={handleChangeStates}
          />
          <p className={styles.p + " mt-8"}>
            <span className={styles.span}>2.</span> Enter the{" "}
            <strong>input alphabet</strong> symbols separated by commas:
          </p>
          <BaseInput
            label="* Only different alphanumeric values and commas are allowed"
            placeholder="e.g. 0,1"
            onChangeData={handleChangeInputAlphabet}
          />

          <div className={data.states.length === 0 ? "hidden" : "relative"}>
            <p className={styles.p + " mt-8"}>
              <span className={styles.span}>4.</span> Select the{" "}
              <strong>initial state</strong>:
            </p>
            <Dropdown
              className=" w-full "
              value={data.initialState}
              options={getStatesOptions(data.states)}
              onChange={(e) => handleChangeInitialState(e.target.value)}
            />
          </div>
          <div
            className={
              data.states.length === 0 ||
              data.inputAlphabet.length === 0 ||
              data.initialState === ""
                ? "hidden"
                : "relative"
            }
          >
            <p className={styles.p + " mt-8"}>
              <span className={styles.span}>5.</span> Enter the{" "}
              <strong>transitions</strong>:
            </p>
            <div className="overflow-x-auto">
              <MachineTable
                handleChangeMachineMatrix={handleChangeMachineMatrix}
              />
            </div>
            <button
              className={disabled?styles.button+' opacity-30':styles.button}
              disabled={disabled}
              onClick={() => {
                getMinMooreMachine(
                  data.states,
                  data.initialState,
                  data.inputAlphabet,
                  data.machineMatrix
                );
              }}
            >
              Minimize
            </button>
          </div>
        </DataContext.Provider>
      </article>
    </section>
  );
}

const styles = {
  header:
    " h-12 bg-gray-100 border-b-2 px-4 flex items-center justify-between text-slate-700 rounded-t-md",
  section: " bg-white custom-shadow rounded-md w-3/4 mt-8 mb-16",
  title: " font-bold text-2xl ",
  article: " p-10",
  p: " text-slate-600 ",
  span: " font-bold text-indigo-600 ",
  button:
    " bg-indigo-600 rounded-md text-white px-4 py-1 font-bold custom-shadow mt-6 ml-2 h:bg-indigo-700",
};

export default Minimizer;
