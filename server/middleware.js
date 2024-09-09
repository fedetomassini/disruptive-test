const jwt = require("jsonwebtoken");
const { User } = require("./models");

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
	} catch (_error) {
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

module.exports = { authMiddleware, roleMiddleware };
