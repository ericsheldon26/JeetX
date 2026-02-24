const getCookie = (request, name) => {
    const cookieHeader = request.headers.cookie; // raw cookie string
    if (!cookieHeader) return null;

    const cookies = cookieHeader
        .split(";")
        .map(cookie => cookie.trim())
        .reduce((acc, cookie) => {
            const [key, value] = cookie.split("=");
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});

    return cookies[name] || null;
}

module.exports = getCookie

