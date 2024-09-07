import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { LockIcon, MailIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const contentType = response.headers.get("content-type");
			let data;

			if (contentType && contentType.indexOf("application/json") !== -1) {
				data = await response.json();
			} else {
				data = await response.text();
			}

			if (response.ok) {
				localStorage.setItem("token", data.token);
				navigate("/home");
				toast.success("Inicio de sesión exitoso");
			} else {
				toast.error(data.message || "Error al ingresar");
			}
		} catch (error) {
			console.error("Error al enviar el formulario:", error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue px-4 py-12 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md w-full bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 space-y-8"
			>
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<motion.h2
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="mt-6 text-center text-4xl font-extrabold text-pastel-dark"
					>
						Iniciar Sesión
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="mt-2 text-center text-sm text-pastel-dark"
					>
						¿No tienes una cuenta?{" "}
						<a
							href="/register"
							className="font-medium text-pastel-accent hover:text-pastel-accent-dark transition-colors duration-200"
						>
							Regístrate
						</a>
					</motion.p>
				</div>

				<motion.form
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="space-y-6"
					onSubmit={handleLogin}
				>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-pastel-dark">
							Email
						</label>
						<div className="mt-1 relative rounded-md shadow-sm">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<MailIcon className="h-5 w-5 text-pastel-dark" aria-hidden="true" />
							</div>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="off"
								required
								onChange={handleChange}
								className="appearance-none block w-full pl-10 px-4 py-3 border border-pastel-border rounded-md bg-white bg-opacity-50 placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-accent focus:border-pastel-accent transition duration-200 ease-in-out text-pastel-dark sm:text-sm"
								placeholder="tu@email.com"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-pastel-dark">
							Contraseña
						</label>
						<div className="mt-1 relative rounded-md shadow-sm">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<LockIcon className="h-5 w-5 text-pastel-dark" aria-hidden="true" />
							</div>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="off"
								required
								onChange={handleChange}
								className="appearance-none block w-full pl-10 px-4 py-3 border border-pastel-border rounded-md bg-white bg-opacity-50 placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-accent focus:border-pastel-accent transition duration-200 ease-in-out text-pastel-dark sm:text-sm"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pastel-accent hover:bg-pastel-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-accent transition duration-200 ease-in-out"
						>
							Iniciar Sesión
						</motion.button>
					</div>
				</motion.form>
			</motion.div>
		</div>
	);
};
