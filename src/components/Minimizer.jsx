import React, { useContext, useState, useEffect } from "react";
import BaseInput from "./BaseInput";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

export const DataContext = React.createContext();

function Minimizer() {

  const MOORE = "Moore";
  const MEALY = "Mealy";

  const [data, setData] = useState({
    states: [],
    alphabet: [],
    initialState: "",
    finalStates: [],
  });
  const [currentAutomaton, setCurrentAutomaton] = useState(MOORE);

  const toggleMachineType = () => {
    setCurrentAutomaton(currentAutomaton === MOORE ? MEALY : MOORE);
  };

  const handleChangeStates = (newStates) => {
    setData((prevState) => ({ ...prevState, states: newStates }));
  };

  const handleChangeAlphabet = (newAlphabet) => {
    setData((prevState) => ({ ...prevState, alphabet: newAlphabet }));
  };

  const handleChangeInitialState = (newInitialState) => {
    setData((prevState) => ({ ...prevState, initialState: newInitialState }));
  };

  const handleChangeFinalStates = (newFinalStates) =>{
    setData((prevState) => ({ ...prevState, finalStates: newFinalStates }));
  }
  
  const getStatesOptions = () => {
    const options = data.states.map((state) => {
      return { label: state, value: state };
    });
    return options;
  };

  const display = () => {
    console.log();
    if (data.states.length > 0) {
      return "";
    }
    return "hidden";
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h1 className={styles.title}>{currentAutomaton} machine</h1>
        <button className={styles.toggle} onClick={toggleMachineType}>
          To {currentAutomaton === MOORE ? MEALY : MOORE}
        </button>
      </header>
      <article className={styles.article}>
        <DataContext.Provider value={data}>
          <p className={styles.p}>
            <span className={styles.span}>1.</span> Enter the states separated by commas:
          </p>
          <BaseInput
            label="* Only different alphanumeric values and commas are allowed"
            placeholder="e.g. A,B,C,D"
            onChangeData={handleChangeStates}
          />
          <p className={styles.p + " mt-8"}>
            <span className={styles.span}>2.</span> Enter the alphabet symbols separated by commas:
          </p>
          <BaseInput
            label="* Only different alphanumeric values and commas are allowed"
            placeholder="e.g. 0,1"
            onChangeData={handleChangeAlphabet}
          />
          <div className={data.states.length === 0 ? "hidden" : "relative"}>
            <p className={styles.p + " mt-8"}>
              <span className={styles.span}>3.</span> Select the initial state:
            </p>
            <Dropdown
              className=" w-full "
              value={data.initialState}
              options={getStatesOptions()}
              onChange={(e) => handleChangeInitialState(e.target.value)}
            />
            <p className={styles.p + " mt-8"}>
              <span className={styles.span}>4.</span> Select the final states:
            </p>
            <MultiSelect
              value={data.finalStates}
              onChange={(e) => handleChangeFinalStates(e.value)}
              options={getStatesOptions()}
              optionLabel="label"
              className="w-full md:w-20rem"
            />
          </div>
        </DataContext.Provider>
      </article>
    </section>
  );
}

const styles = {
  header:" h-12 bg-gray-100 border-b-2 px-4 flex items-center justify-between text-slate-700 ",
  section: " bg-white custom-shadow rounded-md w-10/12 mt-8 ",
  toggle: " rounded-md text-sm underline underline-offset-4 text-indigo-700 hover:text-indigo-900 ",
  title: " font-bold text-xl",
  article: " p-10 ",
  p: " text-slate-600 ",
  span: " font-bold text-indigo-600 ",
};

export default Minimizer;
