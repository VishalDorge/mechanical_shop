"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRequestResponses = void 0;
exports.ProductRequestResponses = {
    UNABLE_TO_PROCEED: {
        message: "Not Able to Proceed your Request!",
        statusCode: 400
    },
    UPDATE_SUCCESS: {
        message: "Product Request Updated Successfully",
        statusCode: 200
    },
    DELETE_SUCCESS: {
        message: "Product Request Deleted Successfully",
        statusCode: 200
    },
    INVENTORY_SUCCESS: {
        message: "Products have been Added to Inventory",
        statusCode: 201
    },
    ORDER_PLACED_SUCCESS: {
        message: "Your Order has been Placed Successfully!",
        statusCode: 201
    }
};
