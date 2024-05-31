// 서버 측 코드 (Node.js + Express)

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mariadb = require('mariadb');
const config = require('../DBconfig.json');

const router = express.Router();

const PRODUCT_FILE_PATH = path.join(__dirname, '../frontend/src/data/product.json');

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
    // try {
    //     const { productId, overwrite } = req.body;
    //     const filePath = path.join(__dirname, '../frontend/public/image/', req.file.filename);

    //     console.log(req.body);
    //     console.log(req.file);

    //     if (!req.file) {
    //         return res.status(400).send('No file uploaded.');
    //     }

    //     if (overwrite === 'true') { // 이미지를 덮어씌울 경우
    //         const connection = await pool.getConnection();
    //         await connection.execute(
    //             'SELECT ProductImage FROM product WHERE ProductNO = ?',
    //             [productId]
    //         ).then(async (result) => {
    //             const existingImagePath = path.join(__dirname, '../frontend/public/image/', result[0].ProductImage);
    //             if (fs.existsSync(existingImagePath)) {
    //                 fs.unlinkSync(existingImagePath);
    //                 console.log('Existing image deleted:', result[0].ProductImage);
    //             }
    //         });
    //         connection.release();
    //     }

    //     const connection = await pool.getConnection();
    //     await connection.execute(
    //         'UPDATE product SET ProductImage = ? WHERE ProductNO = ?',
    //         [req.file.originalname, productId]
    //     );
    //     connection.release();

    //     res.send('File uploaded and database updated successfully');
    // } catch (error) {
    //     console.error('Error:', error);
    //     res.status(500).send('Error uploading file or updating database');
    // }
    try {
        const { productId, overwrite } = req.body;
        const filePath = path.join(__dirname, '../frontend/public/image/', req.file.filename);

        console.log(req.body);
        console.log(req.file);

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // product.json 파일 읽기
        const data = fs.readFileSync(PRODUCT_FILE_PATH, 'utf8');
    
        // JSON 문자열을 JavaScript 객체로 변환
        const products = JSON.parse(data);
        console.log("자 현재 메뉴 드가자",products)

        if (overwrite === 'true') { // 이미지를 덮어씌울 경우
            const existingProductIndex = products.findIndex(product => product.id === productId);
            if (existingProductIndex !== -1) {
                const existingImage = products[existingProductIndex].image;
                const existingImagePath = path.join(__dirname, '../frontend/public/image/', existingImage);
                if (fs.existsSync(existingImagePath)) {
                    fs.unlinkSync(existingImagePath);
                    console.log('Existing image deleted:', existingImage);
                }
            }
        }

        // 해당 상품의 이미지 업데이트
        const productIndex = products.find(product => product.id == productId);
        if (productIndex) {
            productIndex.image = req.file.originalname;
        }
        // product.json 파일에 쓰기
        fs.writeFileSync(PRODUCT_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');

        res.send('File uploaded and product image updated successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error uploading file or updating product image');
    }
});

module.exports = router;
