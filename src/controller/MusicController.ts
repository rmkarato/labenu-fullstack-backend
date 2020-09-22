import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { BaseDatabase } from "../data/BaseDatabase";
import { MusicDatabase } from "../data/MusicDatabase";
import { MusicBusiness } from "../business//MusicBusiness";
import { MusicInputDTO } from "../model/Music";
import { GenreDatabase } from "../data/GenreDatabase";
import { GenreBusiness } from "../business/GenreBusiness";
import { UserDatabase } from "../data/UserDatabase";

export class MusicController {
    private static MusicBusiness = new MusicBusiness(
        new Authenticator(),
        new IdGenerator(),
        new MusicDatabase(),
        new GenreDatabase()
    );
    
    private static GenreBusiness = new GenreBusiness(
        new Authenticator(),
        new IdGenerator(),
        new UserDatabase(),
        new GenreDatabase()
    );

    public async createMusic(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;

            const musicInput: MusicInputDTO = {
                title: req.body.title,
                author: req.body.author,
                date: req.body.date,
                file: req.body.file,
                album: req.body.album
            };

            const genre: string[] = req.body.genre;

           await MusicController.MusicBusiness.createMusic(musicInput, genre, token)
            
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
        await BaseDatabase.destroyConnection();
    }

    public async getMusicById(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;

            const id = req.params.id;
            
            const music = await MusicController.MusicBusiness.getMusicbyId(id, token);

            res
                .status(200)
                .send(music)
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
        await BaseDatabase.destroyConnection()
    }
}