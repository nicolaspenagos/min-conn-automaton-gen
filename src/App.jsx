import Minimizer from "./components/Minimizer";

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h2 className={styles.headerTitle}>Theoretical Computer Science</h2>
        <a
          className={styles.headerSubtitle}
          href="https://github.com/nicolaspenagos"
          target="_blank"
        >
          Developed by Nicolás Penagos
        </a>
      </header>
      <main className={styles.main}>
        <h1 className={styles.mainTitle}>
          Minimal Connected Automaton Generator
        </h1>
        <p className={styles.text}>
          Implementation of a program to generate the connected and minimally
          equivalent automaton from a finite state automaton
        </p>
        <Minimizer />
      </main>
    
    </div>
  );
}

const styles = {
  app: " flex flex-col space-around h-screen ",
  main: " m-20 mt-28 flex flex-col items-center",
  header:
    " bg-indigo-600 flex px-8 items-center fixed top-0 h-16 w-full custom-shadow z-10 justify-between custom-shadow ",
  headerTitle: " font-bold text-md text-slate-50 ",
  headerSubtitle: " text-slate-300 ",
  mainTitle: " text-4xl font-bold text-slate-700 text-center mb-4 ",
  text: " text-lg text-center text-slate-600 ",
  section: " bg-white custom-shadow rounded-md w-full mt-8 ",
  credits: " text-indigo-700 ml-2",
};

export default App;
