const File = require("@/models/file/file.model");
const sanitize = require("sanitize-html");
const formidable = require("formidable");
const fs = require("fs");
const storage = require("@/utils/connections/storage/connect.storage");
const RollbackStorage = require("./rollback.storage");


const UploadMultipleStorage = async (request, response, next, allowed, required, allowedExtension = []) => {
    let rollbackSafeGuardBucket = [];
    let rollbackSafeGuardDatabase = [];
    const uploadedFiles = {};

    try {

        const form = new formidable.IncomingForm(
            {
                multiples: true,
                keepExtensions: true,
                maxFileSize: 1024 * 1024 * 1024,          // 1GB per file
                maxFieldsSize: 1024 * 1024 * 1024,        // 1GB for fields
                maxTotalFileSize: 1024 * 1024 * 1024 * 2, // 2GB total
            }
        );

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
        function structureFormData(data) {
            const result = {};
            for (let [key, value] of Object.entries(data)) {
                const match = key.match(/^(.+)\[(\d+)\]$/);

                if (match) {
                    const index = match[1];      // e.g. "0"
                    const innerKey = match[2];   // e.g. "options", "optionImages"

                    if (!result[index]) {
                        result[index] = {};
                    }

                    // If multiple files/values come in the same key: convert to array
                    if (result[index][innerKey]) {
                        // If already array, push more
                        if (Array.isArray(result[index][innerKey])) {
                            result[index][innerKey].push(value);
                        } else {
                            // Convert existing to array
                            result[index][innerKey] = [result[index][innerKey], value];
                        }
                    } else {
                        // First time assignment
                        result[index][innerKey] = value;
                    }
                } else {
                    // root-level keys
                    if (result[key]) {
                        if (Array.isArray(result[key])) {
                            result[key].push(value);
                        } else {
                            result[key] = [result[key], value];
                        }
                    } else {
                        result[key] = value;
                    }
                }
            }
            return result;
        }
        const saveAttachmentDetails = (key, field, fileId, index) => {
            if (!uploadedFiles[key]) {
                uploadedFiles[key] = {};
            }

            if (!uploadedFiles[key][field]) {
                uploadedFiles[key][field] = [];
            }

            uploadedFiles[key][field].push(fileId);
        }
        const UploadFile = async (key, field = null, file, index = 0) => {
            let isAllowed = false
            const { mimetype, size, originalFilename, filepath } = file;
            const extension = originalFilename ? originalFilename.split(".").pop() : null;

            if (!extension) {
                throw new Error("File extension is missing or invalid.")
            }

            const rules = {
                image: {
                    size: 5000000, // 5MB
                    extension: ["png", "jpeg", "jpg"]
                },
                application: {
                    size: 75000000, // 75MB
                    extension: ["doc", "pdf", "xlsx", "csv", "txt", "ppt", "pptx"]
                },
                video: {
                    size: 300000000, // 300MB
                    extension: ["mp4", "mkv", "mov"]
                },
                audio: {
                    size: 10000000, // 10MB
                    extension: ["mp3"]
                }
            };

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
                throw new Error(`File extension is invalid, Only ${extensionsString} allowed.`)
            }
            if (size > rules[type].size) {
                throw new Error(`File size exceeds the limit (${rules[type].size}).`)
            }

            const name = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;

            const params = {
                Bucket: process.env.R2_BUCKET,
                Key: name,
                Body: fs.createReadStream(file.filepath),
                ContentType: mimetype,
                ContentLength: size
            };

            try {
                storage.putObject(params).promise();
                const addedFile = await File.create({
                    name: originalFilename,
                    alternative_text: originalFilename,
                    caption: originalFilename,
                    extension: extension,
                    mime: mimetype,
                    size: size,
                    url: name,
                    createdBy: request?.user?._id,
                    updatedBy: request?.user?._id,
                    used: true
                });
                rollbackSafeGuardBucket.push(params)
                rollbackSafeGuardDatabase.push(addedFile._id)
                fs.unlink(filepath, (err) => {
                    if (err) console.error("Temp file cleanup failed:", err);
                });
                saveAttachmentDetails(key, field, addedFile._id, index)
            }
            catch (uploadError) {
                throw new Error(`${uploadError}`)
            }
        }

        const sanitized = sanitizeFormData(fields);

        const structuredFields = structureFormData(sanitized)
        const structuredFiles = structureFormData(files)
        if (structuredFiles) {
            for (const [key, value] of Object.entries(structuredFiles)) {
                for (const field in value) {
                    if (Object.prototype.hasOwnProperty.call(value, field)) {
                        const filesArray = value[field];
                        const isAttachmentsInArray = Array.isArray(filesArray)
                        if (isAttachmentsInArray) {
                            let index = 0
                            for (const file of filesArray) {

                                await UploadFile(key, field, file, index)
                                index++
                            }
                        } else {
                            await UploadFile(key, field, filesArray)
                        }
                    }
                }
            }


            request.body = {
                ...structuredFields,
                file: uploadedFiles,
                rollbackBucket: rollbackSafeGuardBucket,
                rollbackDatabase: rollbackSafeGuardDatabase
            };

            next();
        }
        else {
            if (required) {

                return response.status(200).json({
                    code: 404,
                    success: false,
                    error: [
                        {
                            field: "popup",
                            message: "No files attached in the request."
                        }
                    ],
                    message: ""
                });
            } else {
                request.body = {
                    ...structuredFields
                };
                return next();
            }
        }
    } catch (error) {
        RollbackStorage(rollbackSafeGuardBucket, rollbackSafeGuardDatabase)
        return response.status(500).json({
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `${error}`
                }
            ],
            message: ""
        });
    }
};

module.exports = UploadMultipleStorage;
