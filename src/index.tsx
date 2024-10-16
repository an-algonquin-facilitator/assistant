import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Build } from "./components/Build";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

((): void => {
  const node = document.getElementById("root");
  if (!node) throw new Error("root div not found");
  const root = ReactDOM.createRoot(node);

  root.render(
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Build />
            <App />
          </LocalizationProvider>
        </Provider>
      </ThemeProvider>
    </React.StrictMode>,
  );
})();
