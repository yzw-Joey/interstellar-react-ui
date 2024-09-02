import dayjs from "dayjs";
import React from "react";
import Calendar from "./src/Calendar/index";

function App() {
  return <Calendar value={dayjs()} />;
}

export default App;
