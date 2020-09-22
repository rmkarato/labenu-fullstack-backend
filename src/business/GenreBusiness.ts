import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { GenreDatabase } from "../data/GenreDatabase";
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { NotFoundError } from "../errors/NotFoundError";
import { Genre } from "../model/Genre";

export class GenreBusiness {
    constructor (
        private authenticator: Authenticator,
        private idGenerator: IdGenerator,
        private userDatabase: UserDatabase,
        private genreDatabase: GenreDatabase
    ) {}

    public async addGenre(
        genre: string | any,
        token: string
    ) {
        const authenticationData = this.authenticator.getData(token)
        const user = await this.userDatabase.getUserById(authenticationData.id)

        if(!user) {
            throw new NotFoundError("Usuário não encontrado.")
        }

        if(!genre || !token) {
            throw new InvalidParameterError("Favor preencher todos os campos.")
        }

        const genreName = await this.genreDatabase.getNameGenre(genre)

        if(genreName) {
            throw new InvalidParameterError("Gênero existente")
        }

        const id = this.idGenerator.generateId();
        const newGenre = new Genre(
            id,
            genre
        )

        await this.genreDatabase.addGenre(newGenre)
    }

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
