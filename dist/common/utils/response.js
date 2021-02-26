exports.status = {
    SUCCESS: "Success",
    ERROR: "Error",
}
exports.response = function(status, message, data = {}){
    return {
        status: status,
        message: message,
        data: data
    }
}