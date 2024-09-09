"use client";

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminDashboard } from "@/components/adminDashboard";
import { ContentDashboard } from "@/components/contentDashboard";
import { Login } from "@/components/login";
import { Register } from "@/components/register";
import { ViewerDashboard } from "@/components/viewerDashboard";
import { Loader } from "@/components/loader";
//
import { config } from "../config";

export const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [userRole, setUserRole] = useState(null);

	const URL = config.url;

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("token");
			if (token) {
				try {
					const response = await fetch(`${URL}/api/profile`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					const data = await response.json();
					setUserRole(data.role);
				} catch (error) {
					console.error("Error al intentar conseguir el token:", error);
					localStorage.removeItem("token");
				}
			}
			setIsLoading(false);
		};

		checkAuth();
	}, []);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<Router>
			<Routes>
				<Route path="/" element={userRole ? <ContentDashboard /> : <ViewerDashboard />} />
				<Route
					path="/admin/edit-categories"
					element={userRole === "ADMIN" ? <AdminDashboard /> : <Navigate to="/" />}
				/>
				<Route
					path="/content"
					element={
						userRole === "ADMIN" || userRole === "READER" || userRole === "CREATOR" ? (
							<ContentDashboard />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	);
};
