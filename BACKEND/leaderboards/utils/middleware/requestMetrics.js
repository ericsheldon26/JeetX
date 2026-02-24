module.exports = function requestMetrics(req, res, next) {
    const startCpu = process.cpuUsage();
    const startTime = process.hrtime();
    const startMem = process.memoryUsage();
    res.on("finish", () => {
        // Time elapsed
        const diffTime = process.hrtime(startTime);
        const elapsedMs = diffTime[0] * 1000 + diffTime[1] / 1e6;

        // CPU used during this request
        const diffCpu = process.cpuUsage(startCpu);
        const cpuUserMs = diffCpu.user / 1000;   // userland CPU ms
        const cpuSystemMs = diffCpu.system / 1000; // kernel CPU ms
        const totalCpuMs = cpuUserMs + cpuSystemMs;

        // Memory usage delta
        const endMem = process.memoryUsage();
        const memDiff = (endMem.heapUsed - startMem.heapUsed) / 1024 / 1024;
        console.log(
            `${req.method} ${req.originalUrl} | Time: ${elapsedMs.toFixed(2)} ms | CPU: ${totalCpuMs.toFixed(2)} ms | Mem Δ: ${memDiff.toFixed(2)} MB`
        );
    });
    next();
};