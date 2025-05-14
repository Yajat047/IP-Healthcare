class ApiResponse{
    constructor(statusCode, data, message="Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success= statusCode < 400; //if 200-399 then true 
    }
}

export {ApiResponse}