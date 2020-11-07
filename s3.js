const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

//create instance of aws user - object with methods to communicate with s3 bucket
const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

//upload middleware

exports.upload = (req, res, next) => {
    if (!req.file) {
        //something went wrong with multer (no file chosen, over limit etc.)
        console.log("no files to upload... :(");
        res.json({
            success: false,
        });
        return;
        // return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "pimento-socialnetwork", // <==== my private bucket
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            // console.log("our img made it to the cloud!");
            next(); //we want to make sure to exit the middleware after successfully uploading the img to the cloud
            // optionally you can choose to remove the file after uploading
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            // uh oh
            console.log("Error! our upload to the cloud has failed", err);
        });
};
