import React, { useContext, useState, useEffect } from 'react';

function Minimizer() {

    const MOORE = 'Moore';
    const MEALY = 'Mealy';
    const [currentAutomaton, setCurrentAutomaton] = useState(MOORE);

    const toggleMachineType = () => {
        setCurrentAutomaton(currentAutomaton === MOORE ? MEALY : MOORE);
    }

    return (
        <section className={styles.section}>
            <header className={styles.header}>
                <h1 className={styles.title}>{currentAutomaton} machine</h1>
                <button className={styles.toggle} onClick={toggleMachineType}>To {currentAutomaton === MOORE ? MEALY : MOORE}</button>
            </header>
            <article>
                alksjasjfjafj
            </article>
        </section>
    )
}

const styles = {
    header:' h-12 bg-gray-100 border-b-2 px-4 flex items-center justify-between text-slate-700',
    section:' bg-white custom-shadow rounded-md w-full mt-8',
    toggle:' rounded-md text-sm underline underline-offset-2 text-indigo-700 hover:text-indigo-900',
    title:'font-bold'
}

export default Minimizer