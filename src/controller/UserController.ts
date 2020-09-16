import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { UserBusiness } from "../business/UserBusiness";

export class UserController {
    private static UserBusiness = new UserBusiness(
        new Authenticator(),
        new HashManager(),
        new IdGenerator(),
        new UserDatabase()
    );

    public async signUp(req: Request, res: Response) {
        try {
            const result = await UserController.UserBusiness.signUp(
                req.body.name,
                req.body.email,
                req.body.nickname,
                req.body.password
            );
            
            res
                .status(200)
                .send(result);
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const result = await UserController.UserBusiness.login(
                email,
                password
            );

            res
                .status(200)
                .send(result);
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
    }
}