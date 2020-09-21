import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { GenreDatabase } from "../data/GenreDatabase";
import { Genre, GenreInputDTO } from "../model/Genre";
import { NotFoundError } from "../errors/NotFoundError";
import { InvalidParameterError } from "../errors/InvalidParameterError";


export class GenreBusiness {
    constructor (
        private idGenerator: IdGenerator,
        private genreDatabase: GenreDatabase
    ) {}

    public async createGenre(
        input: GenreInputDTO,
    ): Promise<void> {

        if(!input.genre) {
            throw new InvalidParameterError("Favor preencher todos os campos.")
        }

        const id = this.idGenerator.generateId();

        await this.genreDatabase.createGenre(
            new Genre(
                id,
                input.genre
            )
        );
    }
}
