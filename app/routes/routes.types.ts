import { Router } from "express";

export class Route{
    pathTaken: string[] = [];
    constructor(public path: string, public router: Router){
        
    }
}