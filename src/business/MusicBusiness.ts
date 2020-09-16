import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { MusicDatabase } from "../data/MusicDatabase";
import { Music } from "../model/Music";
import { NotFoundError } from "../errors/NotFoundError";
import { InvalidParameterError } from "../errors/InvalidParameterError";

export class MusicBusiness {
    constructor (
        private authenticator: Authenticator,
        private hashManager: HashManager,
        private idGenerator: IdGenerator,
        private userDatabase: UserDatabase,
        private musicDatabase: MusicDatabase
    ) {}

    public async createMusic(
        title: string,
        author: string,
        date: Date,
        file: string,
        genre: string[],
        album: string,
        token: string
    ) {
        if(!title || !date || !file || !genre || !album || !token) {
            throw new InvalidParameterError("Favor preencher todos os campos.")
        }

        const userData = this.authenticator.getData(token)
        const user = await this.userDatabase.getUserById(userData.id)

        if(!user) {
            throw new NotFoundError("Usuário não encontrado.")
        }

        const id = this.idGenerator.generateId();

        await this.musicDatabase.createMusic(
            new Music(id, title, author, date, file, genre, album)
        )
    }
}