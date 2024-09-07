import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer, Bounce } from "react-toastify";
// Globals Styles \\
import "./globals.scss";
import "react-toastify/dist/ReactToastify.css";
// Components \\
import { App } from "@/App";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ToastContainer
			position="bottom-right"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={true}
			closeOnClick
			rtl={false}
			pauseOnHover={true}
			pauseOnFocusLoss={false}
			draggable
			theme="light"
			transition={Bounce}
		/>
		<App />
	</StrictMode>,
);
