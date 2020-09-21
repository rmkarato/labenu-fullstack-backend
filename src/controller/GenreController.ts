import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { BaseDatabase } from "../data/BaseDatabase";
import { GenreDatabase } from "../data/GenreDatabase";
import { GenreBusiness } from "../business/GenreBusiness";
import { GenreInputDTO } from "../model/Genre";


export class GenreController {
    private static GenreBusiness = new GenreBusiness(
        new IdGenerator(),
        new GenreDatabase()
    );
    
    public async createGenre(req: Request, res: Response) {
        try {
            const genreInput: GenreInputDTO = {
                genre: req.body.genre
            };

            await GenreController.GenreBusiness.createGenre(genreInput)

            res
                .status(200)
                .send({
                    message: "Gênero criado com sucesso."
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