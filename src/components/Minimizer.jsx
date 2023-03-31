import React, { useContext, useState, useEffect } from "react";
import BaseInput from "./BaseInput";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import MachineTable from "./MachineTable";
import {
  getStatesOptions,
  generateEmptyMatrix,
} from "../utils/machineUtils.js";

export const DataContext = React.createContext();
export const MOORE = "Moore";
export const MEALY = "Mealy";

function Minimizer() {
  const [data, setData] = useState({
    states: [],
    inputAlphabet: [],
    initialState: "",
    outputAlphabet: [],
    type: MOORE,
    machineMatrix: null,
  });

  const handleChangeStates = (newStates) => {
    setData((prevState) => ({ ...prevState, states: newStates }));
  };

  const handleSetType = (newType) => {
    setData((prevState) => ({ ...prevState, type: newType }));
  };

  const handleChangeInputAlphabet = (newAlphabet) => {
    setData((prevState) => ({ ...prevState, inputAlphabet: newAlphabet }));
  };

  const handleChangeOutputAlphabet = (newAlphabet) => {
    setData((prevState) => ({ ...prevState, outputAlphabet: newAlphabet }));
  };

  const handleChangeInitialState = (newInitialState) => {
    setData((prevState) => ({ ...prevState, initialState: newInitialState }));
  };

  const handleChangeFinalStates = (newFinalStates) => {
    setData((prevState) => ({ ...prevState, finalStates: newFinalStates }));
  };

  const handleChangeMachineMatrix = (i, j, element) => {
    let newMatrix;
    if (!data.machineMatrix) {
      newMatrix = generateEmptyMatrix(
        data.states.length,
        data.inputAlphabet.length,
        (data.type===MOORE)?1:0
      );
    }else{
      newMatrix = [...data.machineMatrix];
    }

    console.log(newMatrix);
    newMatrix[i][j] = element;
    setData((prevState) => ({ ...prevState, machineMatrix: newMatrix }));
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
          <p className={styles.p + " mt-8"}>
            <span className={styles.span}>3.</span> Enter the{" "}
            <strong>output alphabet</strong> symbols separated by commas:
          </p>
          <BaseInput
            label="* Only different alphanumeric values and commas are allowed"
            placeholder="e.g. 0,1"
            onChangeData={handleChangeOutputAlphabet}
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
              data.outputAlphabet.length === 0
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
          </div>
        </DataContext.Provider>
      </article>
    </section>
  );
}

const styles = {
  header:
    " h-12 bg-gray-100 border-b-2 px-4 flex items-center justify-between text-slate-700 rounded-t-md",
  section: " bg-white custom-shadow rounded-md w-3/4 mt-8 ",
  title: " font-bold text-2xl ",
  article: " p-10",
  p: " text-slate-600 ",
  span: " font-bold text-indigo-600 ",
};

export default Minimizer;
