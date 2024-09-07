import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "@/pages/home";
import { Login } from "@/components/login";
import { Register } from "@/components/register";
import { ViewerDashboard } from "@/components/viewerDashboard";
import { AdminDashboard } from "@/components/adminDashboard";

export const App = () => {
	const isAuthenticated = !!localStorage.getItem("token");

	return (
		<Router>
			<Routes>
				<Route path="/contents" element={isAuthenticated ? <Home /> : <Navigate to="/contents/viewer" />} />
				<Route
					path="/contents/categories"
					element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/contents/viewer" />}
				/>
				<Route path="/contents/viewer" element={<ViewerDashboard />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route
					path="*"
					element={<Navigate to={isAuthenticated ? "/contents" || "/contents/categories" : "/contents/viewer"} />}
				/>
			</Routes>
		</Router>
	);
};

export default App;
