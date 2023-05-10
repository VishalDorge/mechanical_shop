import { PipelineStage, Types } from "mongoose";
import { convertValuesToOriginalType } from "./convert";

export class CustomPipeline {

    private pipeline: PipelineStage[] = [];

    constructor(query: any) {
        const { page, limit, sortBy, sortOrder, ...filter } = query;
        convertValuesToOriginalType(filter);
        this.matchStage(filter).sortingStage(sortBy, sortOrder).pagination(page, limit);
    }

    pagination = (pageNo: string, limitItems: string) => {
        const page = parseInt(pageNo) || 1;
        const limit = parseInt(limitItems) || 3;
        const offset = (page - 1) * limit;
        this.pipeline.push({ $skip: offset }, { $limit: limit })
        return this;
    }

    lookupStage = (
        populateFrom: string,
        localFieldName: string,
        foreignFieldName: string,
        finalFieldName: string
    ) => {

        this.pipeline.push({
            $lookup: {
                from: populateFrom,
                localField: localFieldName,
                foreignField: foreignFieldName,
                as: finalFieldName
            }
        })

        return this;
    }

    selectStage = (...fieldsToHide: string[]) => {
        fieldsToHide.forEach(field => {
            this.pipeline.push({
                $unset: field
            })
        })

        return this;
    }

    matchStage = (filter: any) => {

        this.pipeline.push({
            $match: { isDeleted: false }
        });

        for (let field in filter) {
            if (typeof filter[field] === "object") {

                this.pipeline.push({
                    $match: {
                        [field]: filter[field]
                    }
                })

            }
            else if (Array.isArray(filter[field])) {
                this.pipeline.push({
                    $match: {
                        [field]: { $in: filter[field] }
                    }
                })
            }
            else {

                if (filter[field].length > 20) {
                    this.pipeline.push({
                        $match: {
                            [field]: new Types.ObjectId(filter[field])
                        }
                    })
                } else {
                    this.pipeline.push({
                        $match: {
                            [field]: filter[field]
                        }
                    })
                }
            }
        }

        return this;
    }

    unWindStage = (fieldName: string) => {
        this.pipeline.push({
            $unwind: "$" + fieldName
        });

        return this;
    }

    sortingStage = (sortBy: string, sortOrder: string) => {

        this.pipeline.push({
            $sort: {
                [sortBy]: sortOrder === 'desc' ? -1 : 1
            }
        })
        return this;
    }

    generate() {
        return this.pipeline
    };

}

const pagination = (pageNo: string, limitItems: string, pipeline: PipelineStage[]) => {

    const page = parseInt(pageNo);
    const limit = parseInt(limitItems);
    const offset = (page - 1) * limit;

    pipeline.push(
        { $skip: offset },
        { $limit: limit }
    )
}

const lookupStage = (
    populateFrom: string,
    localFieldName: string,
    foreignFieldName: string,
    finalFieldName: string,
    pipeline: PipelineStage[]
) => {

    pipeline.push({
        $lookup: {
            from: populateFrom,
            localField: localFieldName,
            foreignField: foreignFieldName,
            as: finalFieldName
        }
    })
}

const selectStage = (pipeline: PipelineStage[], ...fieldsToHide: string[]) => {
    fieldsToHide.forEach(field => {
        pipeline.push({
            $unset: field
        })
    })
}

const matchStage = (filter: any, pipeline: PipelineStage[]) => {

    pipeline.push({
        $match: { isDeleted: false }
    });

    for (let field in filter) {
        if (typeof filter[field] === "object") {

            pipeline.push({
                $match: {
                    [field]: filter[field]
                }
            })

        }
        else if (Array.isArray(filter[field])) {
            pipeline.push({
                $match: {
                    [field]: { $in: filter[field] }
                }
            })
        }
        else {

            if (filter[field].length > 20) {
                pipeline.push({
                    $match: {
                        [field]: new Types.ObjectId(filter[field])
                    }
                })
            } else {
                pipeline.push({
                    $match: {
                        [field]: filter[field]
                    }
                })
            }
        }
    }
}

const unWindStage = (fieldName: string, pipeline: PipelineStage[]) => {
    pipeline.push({
        $unwind: "$" + fieldName
    })
}

const sortingStage = (sortBy: string, sortOrder: string, pipeline: PipelineStage[]) => {

    pipeline.push({
        $sort: {
            [sortBy]: sortOrder === 'desc' ? -1 : 1
        }
    })
}

export default {
    matchStage,
    pagination,
    lookupStage,
    selectStage,
    unWindStage,
    sortingStage
}