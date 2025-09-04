import ReactDOM from "react-dom/client";
import { reduxStoreFacade } from "./adapters";
import { TestReduxAdapter } from "./test-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <reduxStoreFacade.ReduxModalProvider>
    <TestReduxAdapter />
  </reduxStoreFacade.ReduxModalProvider>
);