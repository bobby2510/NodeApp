//const S3 = require('aws-sdk/clients/s3')
require('dotenv').config()

const fs = require('fs')

const accessKeyId=process.env.AWS_ACCESS_KEY_ID
const bucketName = process.env.AWS_BUCKET 
const region = process.env.AWS_BUCKET_NAME 
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY


const s3 = new S3({
accessKeyId,
region,
secretAccessKey
})

//upload files to the s3 bucket 
let upload = (file)=>{
    let fileStream = fs.createReadStream(file.path)
    let uploadParams = {
        Body:fileStream,
        Key:file.filename,
        Bucket:bucketName
    }
    return s3.upload(uploadParams).promise()
}

let getFileStream = (file_key) =>{
    let downloadParams = {
        Key: file_key,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}

module.exports.upload = upload 
module.exports.getFileStream = getFileStream