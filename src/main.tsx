import ReactDOM from "react-dom/client";
import { TestReduxAdapter } from "./test-redux"
import { reduxStoreFacade } from "./adapters"
import { Modal } from "./kernel/modal-factory/implementation";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <reduxStoreFacade.ReduxModalProvider>
    <TestReduxAdapter />
  </reduxStoreFacade.ReduxModalProvider>
);

const modalTest = new Modal("login")

console.log(modalTest)