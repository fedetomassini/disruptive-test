const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NETWORK}/`,
			{
				dbName: "contentdb",
			},
		);
		console.log("Conectado a contentdb");
	} catch (err) {
		console.error("Error de conexión a contentdb:", err);
	}
};

module.exports = connectDB;
