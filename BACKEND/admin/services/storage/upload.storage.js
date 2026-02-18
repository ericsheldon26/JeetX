const sanitize = require("sanitize-html");
const formidable = require("formidable");
const fs = require("fs");
const { storage } = require("@/services/storage/storage.services");

function sanitizeFormData(obj) {
    const sanitizedObj = {};
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            const value = obj[prop][0];
            let sanitizedValue;

            if (typeof value != "object" || typeof value != "number") {
                sanitizedValue = sanitize(value).trim();
            }

            sanitizedObj[prop] = sanitizedValue;
        }
    }
    return sanitizedObj;
}


const UploadStorage = async (request, response, next, allowed, required, allowedExtension = []) => {
    try {
        let isAllowed = false
        let extensionsString = ""

        const form = new formidable.IncomingForm();

        const parseForm = () => {
            return new Promise((resolve, reject) => {
                form.parse(request, (error, fields, files) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ fields, files });
                    }
                });
            });
        };

        const { files, fields } = await parseForm();

        const sanitized = sanitizeFormData(fields);
        const file = files?.attachment?.[0] || null;

        if (file) {
            const { mimetype, size, originalFilename } = file;
            // Check if originalFilename is defined before splitting
            const extension = originalFilename ? originalFilename.split(".").pop() : null;

            if (!extension) {
                return response.status(200).json({
                    code: 401,
                    success: false,
                    error: [
                        {
                            field: "attachment",
                            message: "File extension is missing or invalid."
                        }
                    ],
                    message: ""
                });
            }

            const rules = {
                image: {
                    size: 7000000, // 7MB
                    extension: ["png", "jpeg", "jpg"]
                },
                application: {
                    size: 100000000, // 100MB
                    extension: ["docx", "doc", "pdf", "xlsx", "csv", "txt"]
                },
                video: {
                    size: 200000000, // 200MB
                    extension: ["mp4", "mkv"]
                }
            }

            const type = Object.keys(rules).find(key => rules[key].extension.includes(extension));

            if (allowedExtension.length > 0) {
                extensionsString = allowedExtension.join(", ");
                isAllowed = allowedExtension.includes(extension);
            }
            else {
                const allExtensions = allowed.flatMap(type => rules[type]?.extension || []);
                extensionsString = allExtensions.join(", ");
                isAllowed = allowed.includes(type);
            }

            if (!type || !isAllowed) {
                return response.status(200).json({
                    code: 401,
                    success: false,
                    error: [
                        {
                            field: "attachment",
                            message: `File extension is invalid, Only ${extensionsString} allowed.`
                        }
                    ],
                    message: ""
                });
            }
            if (size > rules[type].size) {
                return response.status(200).json({
                    code: 401,
                    success: false,
                    error: [
                        {
                            field: "",
                            message: `File size exceeds the limit (${rules[type].size}).`
                        }
                    ],
                    message: ""
                });
            }

            const name = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;

            const params = {
                Bucket: process.env.R2_BUCKET,
                Key: name,
                Body: fs.createReadStream(file.filepath),
                ContentType: mimetype,
                ContentLength: size
            };

            const uploadPromise = storage.putObject(params).promise();

            uploadPromise.then(async () => {
                request.body = {
                    ...sanitized,
                    icon_url: name,
                    icon_name: originalFilename,
                    icon_extension: extension
                };
                next();
            }).catch((uploadError) => {
                return response.status(500).json({
                    code: 500,
                    success: false,
                    error: [
                        {
                            field: "popup",
                            message: `Upload Error: ${uploadError}`
                        }
                    ],
                    message: ""
                });
            });
        }
        else {
            if (required) {
                return response.status(200).json({
                    code: 404,
                    success: false,
                    error: [
                        {
                            field: "popup",
                            message: "No file attached in the request."
                        }
                    ],
                    message: ""
                });
            } else {
                request.body = {
                    ...sanitized,
                };
                return next();
            }
        }
    } catch (error) {
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`
                }
            ],
            message: ""
        });
    }
};

module.exports = UploadStorage;
