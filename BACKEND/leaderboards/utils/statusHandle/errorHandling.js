const handleCatchError = (error, response) => {
    if (response.headersSent) {
        console.error("Response already sent:", error);
        return; // don’t try to send again
    }
    if (error.code === 11000) {
        // Handle duplicate
        const keyFields = Object.keys(error.keyValue); // e.g. ["systemId", "subSystemName", "subSystemKey"]
        const readableKeys = keyFields.join(", ").replace(/,([^,]*)$/, " and$1"); // adds 'and' before last field

        return response.status(409).json({
            code: error.code,
            success: false,
            error: {
                field: "popup",
                message: `A document with the same ${readableKeys} already exists.`,
            }
        });
    }
    return response.status(500).json({
        code: 500,
        success: false,
        error: [
            {
                field: "popup",
                message: `Error: ${error?.message}`
            }
        ],
        message: ""
    });
}

module.exports = handleCatchError