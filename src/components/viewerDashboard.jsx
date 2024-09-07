import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Camera, Video, FileText, Search, Menu, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ViewerDashboard = () => {
	const [contents, setContents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showAddContent, setShowAddContent] = useState(false);
	const [categories, setCategories] = useState([]);
	const [userRole, setUserRole] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token");

				if (!token) {
					console.error("Token no disponible");
					return;
				}

				// Obtener el rol del usuario
				const userResponse = await fetch("http://localhost:5000/api/profile", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!userResponse.ok) {
					throw new Error(`Error al obtener el rol del usuario. Estado: ${userResponse.status}`);
				}

				const userData = await userResponse.json();
				setUserRole(userData.role);

				// Obtener los contenidos
				const contentResponse = await fetch("http://localhost:5000/api/content", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!contentResponse.ok) {
					throw new Error(`Error al obtener los contenidos. Estado: ${contentResponse.status}`);
				}

				const contentData = await contentResponse.json();
				setContents(contentData);

				// Obtener las categorías
				const categoryResponse = await fetch("http://localhost:5000/api/categories", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!categoryResponse.ok) {
					throw new Error(`Error al obtener las categorías. Estado: ${categoryResponse.status}`);
				}

				const categoryData = await categoryResponse.json();
				setCategories(categoryData);
			} catch (error) {
				console.error("Error al obtener datos:", error);
				toast.error("Error al obtener datos.");
			}
		};

		fetchData();
	}, []);

	const filteredContents = contents.filter(
		(content) =>
			(content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				content.category.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
			(categoryFilter === "" || content.category.name === categoryFilter),
	);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setUserRole(null);
		navigate("/login");
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue">
			<header className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center">
							<img src="/icon.png" className="h-8 w-8 text-pastel-accent mr-2" />
							<h1 className="text-2xl font-bold text-pastel-dark">Contenido</h1>
						</div>
						<div className="hidden md:block">
							<div className="flex items-center space-x-4">
								<input
									type="text"
									placeholder="Buscar por título o categoría"
									className="p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-accent"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								<select
									className="p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-accent"
									onChange={(e) => setCategoryFilter(e.target.value)}
								>
									<option value="">Todas las Categorías</option>
									{categories.map((category) => (
										<option key={category._id} value={category.name}>
											{category.name}
										</option>
									))}
								</select>
								{userRole ? (
									<button
										onClick={handleLogout}
										className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-opacity-70 transition duration-200 ease-in-out"
									>
										Deslogearse
									</button>
								) : (
									<button
										onClick={() => navigate("/login")}
										className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-opacity-70 transition duration-200 ease-in-out"
									>
										Loguearse
									</button>
								)}
							</div>
						</div>
						<div className="md:hidden">
							<button className="text-pastel-dark focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
								<Menu className="h-6 w-6" />
							</button>
						</div>
					</div>
				</div>
			</header>

			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="md:hidden bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg"
					>
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							<input
								type="text"
								placeholder="Buscar por título o categoría"
								className="w-full p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-accent"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<select
								className="w-full p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-accent"
								onChange={(e) => setCategoryFilter(e.target.value)}
							>
								<option value="">Todas las Categorías</option>
								{categories.map((category) => (
									<option key={category._id} value={category.name}>
										{category.name}
									</option>
								))}
							</select>
							{userRole ? (
								<button
									onClick={handleLogout}
									className="px-4 py-2 w-full bg-red-400 text-white rounded-lg hover:bg-opacity-70 transition duration-200 ease-in-out"
								>
									Deslogearse
								</button>
							) : (
								<button
									onClick={() => navigate("/login")}
									className="px-4 py-2 w-full bg-blue-400 text-white rounded-lg hover:bg-opacity-70 transition duration-200 ease-in-out"
								>
									Loguearse
								</button>
							)}
							<button
								className="w-full px-4 py-2 text-pastel-dark hover:bg-pastel-light rounded-lg"
								onClick={() => setIsMenuOpen(false)}
							>
								<X className="h-5 w-5 inline-block mr-1" />
								Cerrar Menú
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<main className="flex-1 p-6">
				{filteredContents.length === 0 ? (
					<p className="text-center text-pastel-dark">No hay contenidos disponibles</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{filteredContents.map((content) => (
							<div key={content._id} className="bg-white rounded-lg shadow-md overflow-hidden">
								<img src={content.coverImage} alt={content.title} className="w-full h-40 object-cover" />
								<div className="p-4">
									<h3 className="text-lg font-semibold text-pastel-dark">{content.title}</h3>
									<p className="text-sm text-pastel-placeholder">{content.category.name}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</main>

			<AnimatePresence>
				{showAddContent && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
					>
						<div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
							<h2 className="text-xl font-semibold mb-4">Agregar Nuevo Contenido</h2>
							<div className="space-y-4">
								<input
									type="text"
									placeholder="Título"
									className="w-full p-2 rounded-lg border border-pastel-border text-pastel-dark placeholder-pastel-placeholder"
									value={newContent.title}
									onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
								/>
								<select
									className="w-full p-2 rounded-lg border border-pastel-border text-pastel-dark"
									value={newContent.type}
									onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
								>
									<option value="image">Imagen</option>
									<option value="video">Video</option>
									<option value="text">Texto</option>
								</select>
								<input
									type="text"
									placeholder="URL"
									className="w-full p-2 rounded-lg border border-pastel-border text-pastel-dark placeholder-pastel-placeholder"
									value={newContent.url}
									onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
								/>
								<select
									className="w-full p-2 rounded-lg border border-pastel-border text-pastel-dark"
									value={newContent.category}
									onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
								>
									<option value="">Seleccionar Categoría</option>
									{categories.map((category) => (
										<option key={category._id} value={category.name}>
											{category.name}
										</option>
									))}
								</select>
								<textarea
									placeholder="Texto"
									className="w-full p-2 rounded-lg border border-pastel-border text-pastel-dark placeholder-pastel-placeholder"
									value={newContent.text}
									onChange={(e) => setNewContent({ ...newContent, text: e.target.value })}
								/>
								<div className="flex justify-end space-x-2">
									<button onClick={() => setShowAddContent(false)} className="px-4 py-2 bg-gray-300 rounded-lg">
										Cancelar
									</button>
									<button onClick={handleCreateContent} className="px-4 py-2 bg-pastel-accent text-white rounded-lg">
										Agregar
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
