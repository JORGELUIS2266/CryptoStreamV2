const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Si no hay MONGODB_URI, usar modo desarrollo (sin DB)
        if (!process.env.MONGODB_URI) {
            console.log('⚠️  MongoDB no configurado - Usando modo desarrollo (datos en memoria)');
            console.log('💡 Para usar MongoDB, configura MONGODB_URI en .env');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
        console.log('⚠️  Continuando en modo desarrollo (datos en memoria)');
    }
};

module.exports = connectDB;
