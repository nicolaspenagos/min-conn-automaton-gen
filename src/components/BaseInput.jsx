import React, { useState } from "react";
import {
  removeInvalidCommas,
  removeAnyTrailingComma,
  isDuplicate,
} from "../logic/utils/stringValidation";

function BaseInput({ label, placeholder, onChangeData }) {
  const [states, setStates] = useState("");

  const handleFocusOut = () => {
    setStates(removeAnyTrailingComma(states));
    onChangeData(
      states === "" ? [] : removeAnyTrailingComma(states).split(",")
    );
  };

  const handleStatesChange = (event) => {
    //Remove invalid characters
    let result = event.target.value.replace(/[^a-z0-9,]/gi, "");

    //Remove any leading or consecutive commas
    result = removeInvalidCommas(result);

    //Avoiding duplicated states
    if (!isDuplicate(states, result)) setStates(result);
  };

  const renderLable = () => {
    if(label!=='')
    return <label className={styles.lable}>{label}</label>
  }

  return (
    <div className={styles.div}>
      <input
        className={styles.input}
        value={states}
        onChange={handleStatesChange}
        onBlur={handleFocusOut}
        placeholder={placeholder}
      ></input>
      {renderLable()}
    </div>
  );
}
const styles = {
  input: " border-b-2 outline-none w-full focus:border-indigo-300",
  lable: " text-indigo-700 text-[10px] font-mono ",
};

export default BaseInput;
