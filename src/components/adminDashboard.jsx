import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";

export const AdminDashboard = () => {
	const [categories, setCategories] = useState([]);
	const [newCategory, setNewCategory] = useState({
		name: "",
		coverImage: "",
		allowImages: false,
		allowVideos: false,
		allowTexts: false,
	});
	const [editingCategory, setEditingCategory] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchCategories = async () => {
			const token = localStorage.getItem("token");

			const response = await fetch("http://localhost:5000/api/categories", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setCategories(data);
		};

		fetchCategories();
	}, []);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setNewCategory((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleCreateCategory = async () => {
		if (!newCategory.name || !newCategory.coverImage) {
			toast.warning("Por favor, completa todos los campos requeridos.");
			return;
		}
		const token = localStorage.getItem("token");
		const response = await fetch("http://localhost:5000/api/categories", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newCategory),
		});
		const data = await response.json();
		setCategories([...categories, data]);
		setNewCategory({
			name: "",
			coverImage: "",
			allowImages: false,
			allowVideos: false,
			allowTexts: false,
		});
	};

	const handleEditCategory = (category) => {
		setEditingCategory(category);
	};

	const handleUpdateCategory = async () => {
		const token = localStorage.getItem("token");
		const response = await fetch(`http://localhost:5000/api/categories/${editingCategory._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(editingCategory),
		});
		const data = await response.json();
		setCategories(categories.map((cat) => (cat._id === data._id ? data : cat)));
		setEditingCategory(null);
	};

	const handleDeleteCategory = async (id) => {
		if (toast.success("Has eliminado la categoría.")) {
			const token = localStorage.getItem("token");
			await fetch(`http://localhost:5000/api/categories/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			setCategories(categories.filter((cat) => cat._id !== id));
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue p-8">
			<div className="max-w-4xl mx-auto bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-8 relative">
				{editingCategory && (
					<div className="fixed inset-0 flex items-center justify-center z-50">
						<div className="bg-white p-4 rounded-lg shadow-md w-11/12 max-w-md">
							<h4 className="text-xl font-bold mb-4">Editar Categoría</h4>
							<input
								type="text"
								name="name"
								value={editingCategory.name}
								onChange={(e) =>
									setEditingCategory({
										...editingCategory,
										name: e.target.value,
									})
								}
								placeholder="Nombre de la categoría..."
								className="w-full p-2 mb-4 rounded-lg border"
							/>
							<input
								type="text"
								name="coverImage"
								value={editingCategory.coverImage}
								onChange={(e) =>
									setEditingCategory({
										...editingCategory,
										coverImage: e.target.value,
									})
								}
								placeholder="URL de portada para la categoría..."
								className="w-full p-2 mb-4 rounded-lg border"
							/>
							{/* Agrega más campos según sea necesario */}
							<div className="flex space-x-4">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleUpdateCategory}
									className="px-4 py-2 inline-flex items-center bg-pastel-accent text-white rounded-lg"
								>
									<Edit className="h-5 w-5 mr-2" />
									Actualizar
								</motion.button>
								<button
									onClick={() => setEditingCategory(null)}
									className="px-4 py-2 bg-gray-400 text-white rounded-lg"
								>
									Cancelar
								</button>
							</div>
						</div>
					</div>
				)}
				<h2 className="text-3xl font-bold text-pastel-dark mb-8">Administrar Categorías</h2>
				<div className="space-y-4 mb-8">
					<input
						type="text"
						name="name"
						value={newCategory.name}
						onChange={handleInputChange}
						placeholder="Nombre de la categoría..."
						className="w-full p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-accent"
					/>
					<input
						type="text"
						name="coverImage"
						value={newCategory.coverImage}
						onChange={handleInputChange}
						placeholder="URL de portada para la categoría..."
						className="w-full p-2 rounded-lg bg-white bg-opacity-50 border border-pastel-border text-pastel-dark placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-accent"
					/>
					<div className="flex space-x-4 max-md:flex-col items-start ">
						<label className="flex items-center space-x-2 text-pastel-dark">
							<input
								type="checkbox"
								name="allowImages"
								checked={newCategory.allowImages}
								onChange={handleInputChange}
								className="form-checkbox h-5 w-5 text-pastel-accent rounded focus:ring-pastel-accent"
							/>
							<span>Imagenes</span>
						</label>
						<label className="flex items-center space-x-2 text-pastel-dark">
							<input
								type="checkbox"
								name="allowVideos"
								checked={newCategory.allowVideos}
								onChange={handleInputChange}
								className="form-checkbox h-5 w-5 text-pastel-accent rounded focus:ring-pastel-accent"
							/>
							<span>Videos</span>
						</label>
						<label className="flex items-center space-x-2 text-pastel-dark">
							<input
								type="checkbox"
								name="allowTexts"
								checked={newCategory.allowTexts}
								onChange={handleInputChange}
								className="form-checkbox h-5 w-5 text-pastel-accent rounded focus:ring-pastel-accent"
							/>
							<span>Documentos</span>
						</label>
					</div>
					<div className="flex-col space-y-2">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleCreateCategory}
							className="w-full px-4 py-2 bg-pastel-accent text-white rounded-lg hover:bg-pastel-accent-dark transition duration-200 ease-in-out flex items-center justify-center"
						>
							<Plus className="h-5 w-5 mr-2" />
							Crear Categoría
						</motion.button>
						<button
							onClick={() => navigate("/contents")}
							className="px-4 py-2 w-full bg-indigo-400 text-white rounded-lg hover:bg-opacity-70 transition duration-200 ease-in-out"
						>
							Ver Contenidos
						</button>
						<button
							onClick={handleLogout}
							className="px-4 py-2 w-full bg-red-400 text-white rounded-lg hover:bg-opacity-70 transition duration-200 ease-in-out"
						>
							Deslogearse
						</button>
					</div>
				</div>
				<div>
					<h3 className="text-2xl font-bold text-pastel-dark mb-4">Categorías Existentes</h3>
					<ul className="space-y-4">
						{categories.map((category) => (
							<li
								key={category._id}
								className="flex items-center justify-between bg-white bg-opacity-50 p-4 rounded-lg"
							>
								<span className="text-pastel-dark">{category.name}</span>
								<div className="flex space-x-2">
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => handleEditCategory(category)}
										className="p-2 bg-pastel-accent text-white rounded-full hover:bg-pastel-accent-dark transition duration-200 ease-in-out"
									>
										<Edit className="h-4 w-4" />
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => handleDeleteCategory(category._id)}
										className="p-2 bg-red-400 text-white rounded-full hover:bg-red-500 transition duration-200 ease-in-out"
									>
										<Trash2 className="h-4 w-4" />
									</motion.button>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
