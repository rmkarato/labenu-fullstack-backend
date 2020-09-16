import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { MusicDatabase } from "../data/MusicDatabase";
import { MusicBusiness } from "../business//MusicBusiness";

export class MusicController {
    private static MusicBusiness = new MusicBusiness(
        new Authenticator(),
        new HashManager(),
        new IdGenerator(),
        new UserDatabase(),
        new MusicDatabase()
    );

    public async createMusic(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;

            const { title, date, file, album } = req.body;
            
            await MusicController.MusicBusiness.createMusic(token,  title, date, file, album )

            res
                .status(200)
                .send({
                    message: "Música criada com sucesso."
                });
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
        await BaseDatabase.destroyConnection();
    }
}