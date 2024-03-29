const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uniqid = require("uniqid");

const uploadImageToAWS = async (req, res) => {
    try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File not found" });
    }

    const s3Client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const randomId = uniqid();
    const ext = file.originalname.split(".").pop();
    const newFilename = randomId + "." + ext;
    const bucketName = process.env.BUCKET_NAME;

    const result = await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        ACL: "public-read",
        Body: file.buffer, // Use req.file.buffer to upload the file
        ContentType: file.mimetype,
      })
    );

    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;

    return res.status(200).json({ link });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message:"Error uploading files to S3"});
  }
};

module.exports = { uploadImageToAWS };
