// upload_api.js
const router = require('express').Router();
const AWS = require("aws-sdk");
const multer = require('multer');
const uuid = require('uuid');

let messageProcess = require("../models/upload").messageProcess;
const messageProcessInstance = new messageProcess();

require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-west-1',
});

const s3 = new AWS.S3();


// 處理文件上傳
const upload = multer({
    storage: multer.memoryStorage(), // 使用記憶體儲存，檔案將保存在 RAM 中
    fileFilter: function (req,file, cb) {
      // 驗證檔案類型，只接受 jpg 和 png 格式
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
        return cb(new Error('Only jpg and png formats are allowed!'), false);
    }
    cb(null, true);
    },
});



router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (req.file) {
            // 存在文件，上传到S3
            const fileName= uuid.v4();
            const params = {
                Bucket: process.env.S3_Headshot_Bucket,
                Key: fileName,
                Body: req.file.buffer
            };

            s3.upload(params, async (err) => {
                if (err) {
                    console.error("檔案上傳至S3失敗", err);
                    return res.status(500).json({ message: "檔案上傳至S3失敗" });
                }

                const cloudFrontDomain = process.env.cloudFrontDomain;
                const cloudFrontUrl = `${cloudFrontDomain}/${fileName}`;

                await messageProcessInstance.insertMessage(req.body.messageContent, cloudFrontUrl);
                return res.status(200).json({ message: "上傳成功" });
            });
        } else {
            await messageProcessInstance.insertMessage(req.body.messageContent, null);
            return res.status(200).json({ message: "上傳成功" });
        }
    } catch (error) {
        console.error("上傳錯誤", error);
        return res.status(500).json({ message: "上傳錯誤" });
    }
});

router.get("/upload", async (req, res) => {
    try {
        result=await messageProcessInstance.getMessage();
        res.json(result[0]);

    }catch (error) {
        console.error("error:", error.message);
        res.status(500).json({ error: "發生錯誤" });
    }
})



module.exports = router;