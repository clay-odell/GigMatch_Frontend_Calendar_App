import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext.jsx"; 
import { EventProvider } from "./contexts/EventContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <EventProvider>
        <App />
      </EventProvider>
    </UserProvider>
  </StrictMode>
);
