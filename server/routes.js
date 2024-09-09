const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User, Category, Content } = require("./models");
const { authMiddleware, roleMiddleware } = require("./middleware");

// Registro de usuario
router.post("/register", async (req, res) => {
	try {
		const { username, email, password, role } = req.body;

		if (role !== "READER" && role !== "CREATOR") {
			return res.status(400).send({ error: "Rol inválido. Debe ser READER o CREATOR." });
		}

		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res.status(400).send({ error: "El nombre de usuario o email ya existe." });
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
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).send({ error: "Credenciales de inicio de sesión inválidas." });
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(400).send({ error: "Credenciales de inicio de sesión inválidas." });
		}
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
		res.send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

// Obtener información del usuario
router.get("/profile", authMiddleware, async (req, res) => {
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
router.post("/categories", authMiddleware, roleMiddleware(["ADMIN"]), async (req, res) => {
	try {
		const { name, allowImages, allowVideos, allowTexts, coverImage } = req.body;
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
});

// Obtener todas las categorías
router.get("/categories", authMiddleware, async (_req, res) => {
	try {
		const categories = await Category.find();
		res.send(categories);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Crear nuevo contenido (Creador y Administrador)
router.post("/content", authMiddleware, roleMiddleware(["ADMIN", "CREATOR"]), async (req, res) => {
	try {
		const { title, type, url, text, category } = req.body;

		const categoryObj = await Category.findById(category);
		if (!categoryObj) {
			return res.status(404).send({ error: "Categoría no encontrada." });
		}

		if (
			(type === "image" && !categoryObj.allowImages) ||
			(type === "video" && !categoryObj.allowVideos) ||
			(type === "text" && !categoryObj.allowTexts)
		) {
			return res.status(400).send({
				error: "Este tipo de contenido no está permitido para esta categoría.",
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
});

// Obtener todos los contenidos
router.get("/content", authMiddleware, async (_req, res) => {
	try {
		const contents = await Content.find().populate("category").populate("creator", "username");
		res.send(contents);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Actualizar contenido (Creador y Administrador)
router.put("/content/:id", authMiddleware, roleMiddleware(["ADMIN", "CREATOR"]), async (req, res) => {
	try {
		const content = await Content.findById(req.params.id);
		if (!content) {
			return res.status(404).send({ error: "Contenido no encontrado." });
		}
		if (req.user.role !== "ADMIN" && content.creator.toString() !== req.user._id.toString()) {
			return res.status(403).send({ error: "Solo puedes actualizar tu propio contenido." });
		}
		Object.assign(content, req.body);
		await content.save();
		res.send(content);
	} catch (error) {
		res.status(400).send(error);
	}
});

// Eliminar contenido (Solo para administradores)
router.delete("/content/:id", authMiddleware, roleMiddleware(["ADMIN"]), async (req, res) => {
	try {
		const content = await Content.findByIdAndDelete(req.params.id);
		if (!content) {
			return res.status(404).send({ error: "Contenido no encontrado." });
		}
		res.send(content);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
