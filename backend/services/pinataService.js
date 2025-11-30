// backend/services/pinataService.js
// Servicio para subir archivos a IPFS usando Pinata

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class PinataService {
    constructor(apiKey, secretKey) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.pinataUrl = 'https://api.pinata.cloud';
    }

    /**
     * Subir archivo a IPFS
     */
    async uploadFile(filePath, fileName) {
        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));

            // Metadata opcional
            const metadata = JSON.stringify({
                name: fileName,
                keyvalues: {
                    app: 'CryptoStream',
                    type: 'video'
                }
            });
            formData.append('pinataMetadata', metadata);

            // Opciones de pinning
            const options = JSON.stringify({
                cidVersion: 1
            });
            formData.append('pinataOptions', options);

            const response = await axios.post(
                `${this.pinataUrl}/pinning/pinFileToIPFS`,
                formData,
                {
                    maxBodyLength: 'Infinity',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        'pinata_api_key': this.apiKey,
                        'pinata_secret_api_key': this.secretKey
                    }
                }
            );

            console.log('✅ Archivo subido a IPFS:', response.data.IpfsHash);

            return {
                success: true,
                ipfsHash: response.data.IpfsHash,
                ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
                size: response.data.PinSize,
                timestamp: response.data.Timestamp
            };

        } catch (error) {
            console.error('❌ Error subiendo a Pinata:', error.response?.data || error.message);
            throw new Error(`Error al subir archivo a IPFS: ${error.message}`);
        }
    }

    /**
     * Verificar conexión con Pinata
     */
    async testAuthentication() {
        try {
            const response = await axios.get(
                `${this.pinataUrl}/data/testAuthentication`,
                {
                    headers: {
                        'pinata_api_key': this.apiKey,
                        'pinata_secret_api_key': this.secretKey
                    }
                }
            );

            console.log('✅ Conexión con Pinata exitosa');
            return response.data;

        } catch (error) {
            console.error('❌ Error de autenticación con Pinata:', error.message);
            throw new Error('Error de autenticación con Pinata');
        }
    }

    /**
     * Obtener información de uso
     */
    async getUsage() {
        try {
            const response = await axios.get(
                `${this.pinataUrl}/data/userPinnedDataTotal`,
                {
                    headers: {
                        'pinata_api_key': this.apiKey,
                        'pinata_secret_api_key': this.secretKey
                    }
                }
            );

            return {
                pinCount: response.data.pin_count,
                pinSize: response.data.pin_size_total
            };

        } catch (error) {
            console.error('Error obteniendo uso de Pinata:', error.message);
            return null;
        }
    }

    /**
     * Eliminar archivo de IPFS (unpin)
     */
    async unpinFile(ipfsHash) {
        try {
            await axios.delete(
                `${this.pinataUrl}/pinning/unpin/${ipfsHash}`,
                {
                    headers: {
                        'pinata_api_key': this.apiKey,
                        'pinata_secret_api_key': this.secretKey
                    }
                }
            );

            console.log('✅ Archivo eliminado de IPFS:', ipfsHash);
            return { success: true };

        } catch (error) {
            console.error('Error eliminando de Pinata:', error.message);
            throw new Error('Error al eliminar archivo de IPFS');
        }
    }
}

module.exports = PinataService;
