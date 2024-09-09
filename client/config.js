const production = {
	url: "",
};

const development = {
	url: "http://localhost:5000",
};

export const config = process.env.NODE_ENV === "development" ? development : production;
