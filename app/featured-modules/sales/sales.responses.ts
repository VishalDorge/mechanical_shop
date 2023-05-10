
export const SalesResponses = {

    UNABLE_TO_PROCEED : {
        message: "Not Able to Proceed your Request!",
        statusCode: 400
    },

    UPDATE_SUCCESS : {
        message: "Sales Updated Successfully",
        statusCode: 200
    },

    DELETE_SUCCESS : {
        message: "Sales Deleted Successfully",
        statusCode: 200
    },

    SALES_SUCCESS : {
        message: "Sales Entry Successfull",
        statusCode: 201
    },

    REVENUE_NOT_MATCHED : {
        message: "Revenue is not Equal to Cash Collected",
        statusCode: 400
    },

    REVENUE_MATCHED : {
        message: "Sales Verified Successfully",
        statusCode: 200
    },

    REVENUE_VERIFIED : {
        message: "Revenue has been Verified Already",
        statusCode: 409
    },

    PRODUCT_OUT_OF_STOCK : {
        message: "One or More Products Seems to Out of Stock",
        statusCode: 400
    }
}