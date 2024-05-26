// 서버 측 코드 (Node.js + Express)

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mariadb = require('mariadb');
const config = require('../DBconfig.json');

const router = express.Router();

const pool = mariadb.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../frontend/public/image/'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageUpload = multer({ storage: storage });

router.post('/uploadImage', imageUpload.single('file'), async (req, res) => {
    try {
        const { productId, overwrite } = req.body;
        const filePath = path.join(__dirname, '../frontend/public/image/', req.file.filename);

        console.log(req.body);
        console.log(req.file);

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        if (overwrite === 'true') { // 이미지를 덮어씌울 경우
            const connection = await pool.getConnection();
            await connection.execute(
                'SELECT ProductImage FROM product WHERE ProductNO = ?',
                [productId]
            ).then(async (result) => {
                const existingImagePath = path.join(__dirname, '../frontend/public/image/', result[0].ProductImage);
                if (fs.existsSync(existingImagePath)) {
                    fs.unlinkSync(existingImagePath);
                    console.log('Existing image deleted:', result[0].ProductImage);
                }
            });
            connection.release();
        }

        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE product SET ProductImage = ? WHERE ProductNO = ?',
            [req.file.originalname, productId]
        );
        connection.release();

        res.send('File uploaded and database updated successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error uploading file or updating database');
    }
});

module.exports = router;
