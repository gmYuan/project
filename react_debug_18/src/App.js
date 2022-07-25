import { useState } from "react";
import AutomaticBatching from "./demo/AutomaticBatching";
import StartTransition from "./demo/StartTransition";
import DeferredValue from "./demo/DeferredValue";
import SuspenseCom from "./demo/SuspenseCom";

function App() {
  const [value, setValue] = useState(0);
  return <button onClick={() => setValue((prev) => prev + 1)}>{value}</button>;
  // return <AutomaticBatching />;
  // return <StartTransition />;
  // return <DeferredValue />;
  // return <SuspenseCom />;
}

export default App;
