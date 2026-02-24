const AWS = require("aws-sdk");

const storage = new AWS.S3({
    signatureVersion: "v4",
    endpoint: process.env.R2_ENDPOINT,
    region: "auto",
    s3ForcePathStyle: true,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_ACCESS_SECRET
    }
})

const GetSignedUrl = async (key) => {
    const params = {
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Expires: 120
    };
    try {
        const url = storage.getSignedUrl("getObject", params);
        return {
            code: 200,
            success: true,
            data: {
                url: url
            },
            error: [],
            message: "File signed url created successfully."
        };
    } catch (error) {
        return {
            code: 404,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "File does not exist."
                }
            ]
        }
    }
}
const GetUnSignedUrl = async (key) => {
    const params = {
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Expires: 1200
    };
    try {
        const url = storage.getSignedUrl("getObject", params);
        return {
            code: 200,
            success: true,
            url,
            error: [],
            message: "File signed url created successfully."
        };
    } catch (error) {
        return {
            code: 404,
            success: false,
            error: [
                {
                    field: "popup",
                    message: "File does not exist."
                }
            ]
        }
    }
}

const RemoveStorage = async (key) => {
    try {
        const result = await storage.deleteObject({
            Bucket: process.env.R2_BUCKET,
            Key: key,
        }).promise();

        return { success: true, data: result };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, error };
    }
};

const RollbackStorage = async (Bucket) => {
    console.warn("Error: Rolling back files")
    for (const params of Bucket) {
        try {
            const keys = {
                Bucket: process.env.R2_BUCKET,
                Key: params.Key
            }
            await storage.deleteObject(keys).promise();
        } catch (error) {
            console.error("Rollback delete failed for:", params.Key, error.message);
        }
    }

}



module.exports = {
    storage,
    GetSignedUrl,
    GetUnSignedUrl,
    RemoveStorage,
    RollbackStorage
};
