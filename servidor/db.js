const { default: mongoose } = require("mongoose");

const conectBD = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://Emmanuel:Emmanuel@emmanuel.rurpl.mongodb.net/bazarUniversal?retryWrites=true&w=majority&appName=Emmanuel');
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.error("Error: " + error);
        process.exit(1);
    }
};

module.exports = conectBD;