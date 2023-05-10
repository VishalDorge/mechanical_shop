import { Schema } from "mongoose";

export class BaseSchema extends Schema{

    constructor(structure: any){
        super({
            ...structure, 
            isDeleted: {
                type: Boolean,
                default: false
            }
        }, {timestamps: true})
    }

}