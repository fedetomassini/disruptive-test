const mongoose = require("mongoose");

// Definición de esquemas y modelos de Mongoose
const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["ADMIN", "READER", "CREATOR"], required: true },
});

const categorySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	allowImages: { type: Boolean, default: false },
	allowVideos: { type: Boolean, default: false },
	allowTexts: { type: Boolean, default: false },
	coverImage: { type: String, required: true },
});

const contentSchema = new mongoose.Schema({
	title: { type: String, required: true },
	type: { type: String, enum: ["image", "video", "text"], required: true },
	category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
	creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);
const Content = mongoose.model("Content", contentSchema);

module.exports = { User, Category, Content };
