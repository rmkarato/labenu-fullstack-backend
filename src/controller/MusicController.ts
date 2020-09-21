import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { BaseDatabase } from "../data/BaseDatabase";
import { MusicDatabase } from "../data/MusicDatabase";
import { MusicBusiness } from "../business//MusicBusiness";
import { Music, MusicInputDTO } from "../model/Music";

export class MusicController {
    private static MusicBusiness = new MusicBusiness(
        new IdGenerator(),
        new MusicDatabase()
    );

    public async createMusic(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;
            
            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            if(!authenticationData) {
                throw new Error("Token não autorizado.")
            }

            const musicInput: MusicInputDTO = {
                title: req.body.title,
                author: req.body.author,
                date: req.body.date,
                file: req.body.file,
                album: req.body.album
            };

            await MusicController.MusicBusiness.createMusic(musicInput)

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

    public async getAllMusics(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;
            
            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            if(!authenticationData) {
                throw new Error("Token não autorizado.")
            }

            const musics = await MusicController.MusicBusiness.getAllMusics()

            res
                .status(200)
                .send(musics);
        } catch(error) {
            res
                .status(error.errorCode || 400)
                    .send({
                        message: error.message
                    });
        }
    }
}