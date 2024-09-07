import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Camera, Video, FileText, Search, Menu, Plus, X, Edit2Icon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ContentDashboard = () => {
	const [contents, setContents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showAddContent, setShowAddContent] = useState(false);
	const [newContent, setNewContent] = useState({
		title: "",
		type: "image",
		url: "",
		category: "",
		text: "",
	});
	const [categories, setCategories] = useState([]);
	const [userRole, setUserRole] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token");

				// Verificar si hay token antes de hacer solicitudes
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

	const handleCreateContent = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			console.error("Token no disponible");
			return;
		}

		if (userRole === "ADMIN" || userRole === "CREATOR") {
			try {
				const response = await fetch("http://localhost:5000/api/content", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(newContent),
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const result = await response.json();
				setContents([...contents, result]);
				setNewContent({
					title: "",
					type: "image",
					url: "",
					category: "",
					text: "",
				});
				setShowAddContent(false);
			} catch (error) {
				console.error("Error al intentar añadir contenido:", error);
				toast.error("Error al intentar añadir contenido.");
			}
		} else {
			toast.error("No tienes permiso para agregar contenido.");
		}
	};

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
								{(userRole === "CREATOR" || userRole === "ADMIN") && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => setShowAddContent(true)}
										className="px-4 py-2 bg-pastel-accent text-white rounded-lg hover:bg-pastel-accent-dark transition duration-200 ease-in-out"
									>
										<Plus className="h-5 w-5 inline-block mr-1" />
										Agregar Contenido
									</motion.button>
								)}
								{userRole === "ADMIN" && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => navigate("/contents/categories")}
										className="px-4 py-2 bg-pastel-accent text-white rounded-lg hover:bg-pastel-accent-dark transition duration-200 ease-in-out"
									>
										<Edit2Icon className="h-5 w-5 inline-block mr-1" />
										Editar Categorías
									</motion.button>
								)}
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
							{(userRole === "CREATOR" || userRole === "ADMIN") && (
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowAddContent(true)}
									className="px-4 py-2 bg-pastel-accent text-white rounded-lg hover:bg-pastel-accent-dark transition duration-200 ease-in-out"
								>
									<Plus className="h-5 w-5 inline-block mr-1" />
									Agregar Contenido
								</motion.button>
							)}
							{userRole === "ADMIN" && (
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => navigate("/contents/categories")}
									className="px-4 py-2 bg-pastel-accent text-white rounded-lg hover:bg-pastel-accent-dark transition duration-200 ease-in-out"
								>
									<Edit2Icon className="h-5 w-5 inline-block mr-1" />
									Editar Categorías
								</motion.button>
							)}
							{userRole === "ADMIN" && (
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => navigate("/contents/categories")}
									className="px-4 py-2 bg-pastel-accent text-white rounded-lg hover:bg-pastel-accent-dark transition duration-200 ease-in-out"
								>
									<Edit2Icon className="h-5 w-5 inline-block mr-1" />
									Editar Categorías
								</motion.button>
							)}
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
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<main className="flex-1 overflow-auto py-6 px-4 sm:px-6 lg:px-8">
				<AnimatePresence>
					{showAddContent && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg mb-6"
						>
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-2xl font-bold text-pastel-dark">Agregar Contenido</h2>
								<button
									onClick={() => setShowAddContent(false)}
									className="text-pastel-dark hover:text-pastel-accent transition duration-200 ease-in-out"
								>
									<X className="h-6 w-6" />
								</button>
							</div>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleCreateContent();
								}}
							>
								<div className="mb-4">
									<label className="block text-pastel-dark mb-2">Título</label>
									<input
										type="text"
										value={newContent.title}
										onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
										className="w-full p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-accent"
										required
									/>
								</div>
								<div className="mb-4">
									<label className="block text-pastel-dark mb-2">Tipo de Contenido</label>
									<select
										value={newContent.type}
										onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
										className="w-full p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-accent"
									>
										<option value="image">Imagen</option>
										<option value="video">Video</option>
										<option value="text">Documento .txt</option>
									</select>
								</div>
								<div className="mb-4">
									<label className="block text-pastel-dark mb-2">
										URL del Contenido (para imágenes y videos) o Texto (para documentos .txt)
									</label>
									<input
										type="text"
										value={newContent.url}
										onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
										className="w-full p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-accent"
										required
									/>
								</div>
								<div className="mb-4">
									<label className="block text-pastel-dark mb-2">Categoría</label>
									<select
										value={newContent.category}
										onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
										className="w-full p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-accent"
										required
									>
										<option value="">Selecciona una categoría</option>
										{categories.map((category) => (
											<option key={category._id} value={category.name}>
												{category.name}
											</option>
										))}
									</select>
								</div>
								{newContent.type === "text" && (
									<div className="mb-4">
										<label className="block text-pastel-dark mb-2">Texto del Documento .txt</label>
										<textarea
											value={newContent.text}
											onChange={(e) => setNewContent({ ...newContent, text: e.target.value })}
											className="w-full p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-accent"
											rows="4"
										></textarea>
									</div>
								)}
								<div className="flex justify-end space-x-4">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="submit"
										className="px-4 py-2 bg-pastel-accent text-white rounded-lg hover:bg-pastel-accent-dark transition duration-200 ease-in-out"
									>
										Agregar Contenido
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="button"
										onClick={() => setShowAddContent(false)}
										className="px-4 py-2 bg-white bg-opacity-50 text-pastel-dark rounded-lg hover:bg-opacity-70 transition duration-200 ease-in-out"
									>
										Cancelar
									</motion.button>
								</div>
							</form>
						</motion.div>
					)}
				</AnimatePresence>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredContents
						.map((content) => (
							<motion.div
								key={content.category._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg"
							>
								<img
									src={content.category.coverImageUrl}
									alt={content.category.name}
									className="w-full h-48 object-cover rounded-lg mb-4"
								/>
								<h2 className="text-xl font-bold text-pastel-dark mb-4">{content.category.name}</h2>
								{(userRole === "READER" || userRole === "ADMIN" || userRole === "CREATOR") && (
									<div className="space-y-4">
										{content.type === "image" && (
											<img src={content.url} alt={content.title} className="w-full h-48 object-cover rounded-lg" />
										)}
										{content.type === "video" && (
											<video controls className="w-full h-48 object-cover rounded-lg">
												<source src={content.url} type="video/mp4" />
												Your browser does not support the video tag.
											</video>
										)}
										{content.type === "text" && <p className="text-pastel-dark">{content.text}</p>}
										<p className="text-sm text-pastel-dark opacity-80">Créditos: {content.creator.username}</p>
									</div>
								)}
								{userRole !== "READER" && (
									<p className="text-sm text-pastel-dark opacity-80 mt-4">
										Contenidos disponibles para lectura sólo para usuarios registrados como Lector.
									</p>
								)}
							</motion.div>
						))
						.filter((content, index, self) => index === self.findIndex((t) => t.category._id === content.category._id))}
				</div>
			</main>
		</div>
	);
};
