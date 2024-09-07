import React, { useEffect, useState } from "react";
import { ContentDashboard } from "@/components/contentDashboard";
import { ViewerDashboard } from "@/components/viewerDashboard";

export const Home = () => {
	const [role, setRole] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/profile", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				const data = await response.json();
				setRole(data.role);
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};

		fetchProfile();
	}, []);

	if (role === "CREATOR" || role === "READER" || role === "ADMIN") {
		return <ContentDashboard />;
	} else {
		return <ViewerDashboard />;
	}
};
