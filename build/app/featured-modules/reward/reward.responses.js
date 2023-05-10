"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardResponses = void 0;
exports.RewardResponses = {
    UNABLE_TO_PROCEED: {
        message: "Not Able to Proceed your Request!",
        statusCode: 400
    },
    UPDATE_SUCCESS: {
        message: "Reward Updated Successfully",
        statusCode: 200
    },
    DELETE_SUCCESS: {
        message: "Reward Deleted Successfully",
        statusCode: 200
    },
    REWARD_ALREADY_EXIST: {
        message: "Reward with Same name Already Exist",
        statusCode: 400
    }
};
