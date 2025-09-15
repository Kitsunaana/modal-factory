import ReactDOM from "react-dom/client";
import { reduxStoreFacade } from "./adapters";
import { SidebarProvider, TestReduxAdapter } from "./test-redux";
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <reduxStoreFacade.ReduxModalProvider>
    <SidebarProvider>
      <TestReduxAdapter />
    </SidebarProvider>
  </reduxStoreFacade.ReduxModalProvider>
);