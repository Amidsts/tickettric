"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaeConnectionError = void 0;
const custom_error_1 = require("./custom-error");
class DatabaeConnectionError extends custom_error_1.CustomError {
    constructor() {
        super("Error connecting to database");
        this.reason = "Error connecting to database";
        this.statusCode = 500;
        Object.setPrototypeOf(this, DatabaeConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
exports.DatabaeConnectionError = DatabaeConnectionError;
