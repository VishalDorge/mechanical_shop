"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomPipeline = void 0;
const mongoose_1 = require("mongoose");
const convert_1 = require("./convert");
class CustomPipeline {
    constructor(query) {
        this.pipeline = [];
        this.pagination = (pageNo, limitItems) => {
            const page = parseInt(pageNo) || 1;
            const limit = parseInt(limitItems) || 3;
            const offset = (page - 1) * limit;
            this.pipeline.push({ $skip: offset }, { $limit: limit });
            return this;
        };
        this.lookupStage = (populateFrom, localFieldName, foreignFieldName, finalFieldName) => {
            this.pipeline.push({
                $lookup: {
                    from: populateFrom,
                    localField: localFieldName,
                    foreignField: foreignFieldName,
                    as: finalFieldName
                }
            });
            return this;
        };
        this.selectStage = (...fieldsToHide) => {
            fieldsToHide.forEach(field => {
                this.pipeline.push({
                    $unset: field
                });
            });
            return this;
        };
        this.matchStage = (filter) => {
            this.pipeline.push({
                $match: { isDeleted: false }
            });
            for (let field in filter) {
                if (typeof filter[field] === "object") {
                    this.pipeline.push({
                        $match: {
                            [field]: filter[field]
                        }
                    });
                }
                else if (Array.isArray(filter[field])) {
                    this.pipeline.push({
                        $match: {
                            [field]: { $in: filter[field] }
                        }
                    });
                }
                else {
                    if (filter[field].length > 20) {
                        this.pipeline.push({
                            $match: {
                                [field]: new mongoose_1.Types.ObjectId(filter[field])
                            }
                        });
                    }
                    else {
                        this.pipeline.push({
                            $match: {
                                [field]: filter[field]
                            }
                        });
                    }
                }
            }
            return this;
        };
        this.unWindStage = (fieldName) => {
            this.pipeline.push({
                $unwind: "$" + fieldName
            });
            return this;
        };
        this.sortingStage = (sortBy, sortOrder) => {
            this.pipeline.push({
                $sort: {
                    [sortBy]: sortOrder === 'desc' ? -1 : 1
                }
            });
            return this;
        };
        const { page, limit, sortBy, sortOrder } = query, filter = __rest(query, ["page", "limit", "sortBy", "sortOrder"]);
        (0, convert_1.convertValuesToOriginalType)(filter);
        this.matchStage(filter).sortingStage(sortBy, sortOrder).pagination(page, limit);
    }
    generate() {
        return this.pipeline;
    }
    ;
}
exports.CustomPipeline = CustomPipeline;
const pagination = (pageNo, limitItems, pipeline) => {
    const page = parseInt(pageNo);
    const limit = parseInt(limitItems);
    const offset = (page - 1) * limit;
    pipeline.push({ $skip: offset }, { $limit: limit });
};
const lookupStage = (populateFrom, localFieldName, foreignFieldName, finalFieldName, pipeline) => {
    pipeline.push({
        $lookup: {
            from: populateFrom,
            localField: localFieldName,
            foreignField: foreignFieldName,
            as: finalFieldName
        }
    });
};
const selectStage = (pipeline, ...fieldsToHide) => {
    fieldsToHide.forEach(field => {
        pipeline.push({
            $unset: field
        });
    });
};
const matchStage = (filter, pipeline) => {
    pipeline.push({
        $match: { isDeleted: false }
    });
    for (let field in filter) {
        if (typeof filter[field] === "object") {
            pipeline.push({
                $match: {
                    [field]: filter[field]
                }
            });
        }
        else if (Array.isArray(filter[field])) {
            pipeline.push({
                $match: {
                    [field]: { $in: filter[field] }
                }
            });
        }
        else {
            if (filter[field].length > 20) {
                pipeline.push({
                    $match: {
                        [field]: new mongoose_1.Types.ObjectId(filter[field])
                    }
                });
            }
            else {
                pipeline.push({
                    $match: {
                        [field]: filter[field]
                    }
                });
            }
        }
    }
};
const unWindStage = (fieldName, pipeline) => {
    pipeline.push({
        $unwind: "$" + fieldName
    });
};
const sortingStage = (sortBy, sortOrder, pipeline) => {
    pipeline.push({
        $sort: {
            [sortBy]: sortOrder === 'desc' ? -1 : 1
        }
    });
};
exports.default = {
    matchStage,
    pagination,
    lookupStage,
    selectStage,
    unWindStage,
    sortingStage
};
