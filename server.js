const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware de configuración
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NETWORK}/`,
		{
			dbName: "contentdb",
		}
	)
	.then(() => console.log("Conectado a contentdb"))
	.catch((err) => console.error("Error de conexión a contentdb:", err));

// Definición de esquemas y modelos de Mongoose
const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["ADMIN", "READER", "CREATOR"], required: true },
});

// Definición del esquema de Categorías
const categorySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	allowImages: { type: Boolean, default: false },
	allowVideos: { type: Boolean, default: false },
	allowTexts: { type: Boolean, default: false },
	coverImage: { type: String, required: true },
});

// Definición del esquema de Contenidos
const contentSchema = new mongoose.Schema({
	title: { type: String, required: true },
	type: { type: String, enum: ["image", "video", "text"], required: true },
	category: [categorySchema],
	creator: [userSchema],
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

// Creación de los modelos de Mongoose
const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);
const Content = mongoose.model("Content", contentSchema);

// Middleware para la autenticación de usuarios
const authMiddleware = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ _id: decoded._id });
		if (!user) {
			throw new Error();
		}
		req.user = user;
		next();
	} catch (error) {
		res.status(401).send({ error: "Autenticación requerida." });
	}
};

// Middleware para control de acceso basado en roles
const roleMiddleware = (roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).send({ error: "Acceso denegado." });
		}
		next();
	};
};

// Rutas de la API

// Registro de usuario
app.post("/api/register", async (req, res) => {
	try {
		const { username, email, password, role } = req.body;

		if (role !== "READER" && role !== "CREATOR") {
			return res
				.status(400)
				.send({ error: "Rol inválido. Debe ser READER o CREATOR." });
		}

		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res
				.status(400)
				.send({ error: "El nombre de usuario o email ya existe." });
		}

		const hashedPassword = await bcrypt.hash(password, 8);
		const user = new User({ username, email, password: hashedPassword, role });
		await user.save();

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

// Inicio de sesión de usuario
app.post("/api/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.send({ error: "Credenciales de inicio de sesión inválidas." });
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res
				.status(400)
				.send({ error: "Credenciales de inicio de sesión inválidas." });
		}
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
		res.send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

// Obtener información del usuario
app.get("/api/profile", authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");

		if (!user) {
			return res.status(404).send({ error: "Usuario no encontrado." });
		}

		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Crear una nueva categoría (Solo para administradores)
app.post(
	"/api/categories",
	authMiddleware,
	roleMiddleware(["ADMIN"]),
	async (req, res) => {
		try {
			const { name, allowImages, allowVideos, allowTexts, coverImage } =
				req.body;
			const category = new Category({
				name,
				allowImages,
				allowVideos,
				allowTexts,
				coverImage,
			});
			await category.save();
			res.status(201).send(category);
		} catch (error) {
			res.status(400).send(error);
		}
	}
);

// Obtener todas las categorías
app.get("/api/categories", authMiddleware, async (req, res) => {
	try {
		const categories = await Category.find();
		res.send(categories);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Crear nuevo contenido (Creador y Administrador)
app.post(
	"/api/content",
	authMiddleware,
	roleMiddleware(["ADMIN", "CREATOR"]),
	async (req, res) => {
		try {
			const { title, type, url, text, category } = req.body;

			const categoryId = new mongoose.Types.ObjectId.createFromHexString(
				category
			);
			const categoryObj = await Category.findById(
				{ _id: categoryId },
				{ $set: params },
				{ new: true }
			);
			if (!categoryObj) {
				return res.status(404).send({ error: "Categoría no encontrada." });
			}

			if (
				(type === "image" && !categoryObj.allowImages) ||
				(type === "video" && !categoryObj.allowVideos) ||
				(type === "text" && !categoryObj.allowTexts)
			) {
				return res.status(400).send({
					error:
						"Este tipo de contenido no está permitido para esta categoría.",
				});
			}

			const content = new Content({
				title,
				type,
				url,
				text,
				category,
				creator: req.user._id,
			});
			await content.save();
			res.status(201).send(content);
		} catch (error) {
			res.status(400).send(error);
		}
	}
);

// Obtener todos los contenidos
app.get("/api/content", authMiddleware, async (req, res) => {
	try {
		const contents = await Content.find()
			.populate("category")
			.populate("creator", "username");
		res.send(contents);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Actualizar contenido (Creador y Administrador)
app.put(
	"/api/content/:id",
	authMiddleware,
	roleMiddleware(["ADMIN", "CREATOR"]),
	async (req, res) => {
		try {
			const content = await Content.findById(req.params.id);
			if (!content) {
				return res.status(404).send({ error: "Contenido no encontrado." });
			}
			if (
				req.user.role !== "ADMIN" &&
				content.creator.toString() !== req.user._id.toString()
			) {
				return res
					.status(403)
					.send({ error: "Solo puedes actualizar tu propio contenido." });
			}
			Object.assign(content, req.body);
			await content.save();
			res.send(content);
		} catch (error) {
			res.status(400).send(error);
		}
	}
);

// Eliminar contenido (Solo para administradores)
app.delete(
	"/api/content/:id",
	authMiddleware,
	roleMiddleware(["ADMIN"]),
	async (req, res) => {
		try {
			const content = await Content.findByIdAndDelete(req.params.id);
			if (!content) {
				return res.status(404).send({ error: "Contenido no encontrado." });
			}
			res.send(content);
		} catch (error) {
			res.status(500).send(error);
		}
	}
);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
