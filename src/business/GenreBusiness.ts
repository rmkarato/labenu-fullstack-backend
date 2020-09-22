import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { GenreDatabase } from "../data/GenreDatabase";
import { Genre, GenreInputDTO } from "../model/Genre";
import { NotFoundError } from "../errors/NotFoundError";
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { GenericError } from "../errors/GenericError";

export class GenreBusiness {
    constructor (
        private authenticator: Authenticator,
        private idGenerator: IdGenerator,
        private genreDatabase: GenreDatabase
    ) {}

    public async getAllGenres(): Promise<any> {
        const genres = await this.genreDatabase.getGenres();

        return genres;
    }

    public async getGenreByMusicId(
        id: string
    ): Promise<string[]> {
        if(!id) {
            throw new InvalidParameterError("Favor preencher todos os campos.")
        }

        const genre: string[] = await this.genreDatabase.getGenreByMusicId(id)

        return genre;
    }
}
