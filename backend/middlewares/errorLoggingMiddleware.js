function errorLoggingMiddleware(err, req, res, next){
    console.log("------------- LOGGING ERROR ----------------------------")
    console.log(err)
    console.log("--------------------------------------------------------")
}

module.exports = {errorLoggingMiddleware}