const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const { authMiddleware } = require("./middleware");
const routes = require("./routes");
const swaggerSetup = require("./swagger");

const app = express();

// Middleware de configuración
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Configurar Swagger
swaggerSetup(app);

// Configurar rutas
app.use("/api", routes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
