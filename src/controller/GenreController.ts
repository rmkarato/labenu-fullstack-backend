import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { BaseDatabase } from "../data/BaseDatabase";
import { GenreDatabase } from "../data/GenreDatabase";
import { GenreBusiness } from "../business/GenreBusiness";
import { GenreInputDTO } from "../model/Genre";
import { UserDatabase } from "../data/UserDatabase";


export class GenreController {
    private static GenreBusiness = new GenreBusiness(
        new Authenticator(),
        new IdGenerator(),
        new UserDatabase(),
        new GenreDatabase()
    );

    public async addGenre(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;

            const { genre } = req.body;

            await GenreController.GenreBusiness.addGenre(genre, token)

            res
                .status(200)
                .send({
                    message: "Gênero adicionado com sucesso."
                });
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
        
    }

    public async getAllGenres(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;
            
            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            if(!authenticationData) {
                throw new Error("Token não autorizado.")
            }

            const genres = await GenreController.GenreBusiness.getAllGenres()

            res
                .status(200)
                .send(genres);
        } catch(error) {
            res
            .status(error.errorCode || 400)
            .send({
                message: error.message
            });
        }
    }
}