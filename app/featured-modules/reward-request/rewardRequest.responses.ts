
export const RewardRequestResponses = {

    UNABLE_TO_PROCEED : {
        message: "Not Able to Proceed your Request!",
        statusCode: 400
    },

    UPDATE_SUCCESS : {
        message: "Reward Request Updated Successfully",
        statusCode: 200
    },

    DELETE_SUCCESS : {
        message: "Reward Request Deleted Successfully",
        statusCode: 200
    },

    INVALID_OWNER: {
        message: "Owner does not have Any Shop",
        statusCode: 400
    },

    INSUFFICIENT_BALANCE: {
        message: "You do not have Enough Points",
        statusCode: 400
    },

    NO_PENDING_REQUEST_FOUND: {
        message: "Invalid Reward Request Id",
        statusCode: 404
    }

}