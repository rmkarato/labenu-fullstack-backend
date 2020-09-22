import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { MusicDatabase } from "../data/MusicDatabase";
import { GenreDatabase } from "../data/GenreDatabase";
import { Music, MusicAndGenreOutputDTO, MusicInputDTO, MusicOutputDTO } from "../model/Music";
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { InsertGenreToMusicInputDTO } from "../model/Genre";
import { GenericError } from "../errors/GenericError";

export class MusicBusiness {
    constructor (
        private authenticator: Authenticator,
        private idGenerator: IdGenerator,
        private musicDatabase: MusicDatabase,
        private genreDatabase: GenreDatabase
    ) {}

    public async createMusic(
        input: MusicInputDTO,
        genreName: string[],
        token: string
    ): Promise<void> {
        
        if(!input.title || !input.author || !input.date || !input.file || !input.album ) {
            throw new InvalidParameterError("Favor preencher todos os campos.")
        }

        if(genreName.length <= 0) {
            throw new InvalidParameterError("Favor inserir um gênero válido.")
        }

        if(!token) {
            throw new GenericError("Requer token.")
        }

        const authenticationData = this.authenticator.getData(token);

        if(!authenticationData.id || !authenticationData) {
            throw new InvalidParameterError("Requer um token válido.")
        }

        const genreId: string[] = await this.genreDatabase.getGenreByName(genreName)

        if(genreId.length !== genreName.length) {
            throw new InvalidParameterError("Algum gênero não é válido.")
        }

        const musicId: string = this.idGenerator.generateId();

        await this.musicDatabase.createMusic(
            new Music(
                musicId, 
                input.title,    
                input.author,
                input.date,
                input.file, 
                input.album,
            )
        );

        const InsertGenreToMusicInput: InsertGenreToMusicInputDTO = {
            musicId: musicId,
            genreId: genreId as string[]
        }
        await this.genreDatabase.insertGenreToMusic(InsertGenreToMusicInput);
    }

    public async getAllMusics(): Promise<any> {
        const musics = await this.musicDatabase.getMusics();

        return musics;
    }

    public async getMusicbyId(
        id: string,
        token: string
    ): Promise<MusicAndGenreOutputDTO> {
        if(!id || !token) {
            throw new InvalidParameterError("Está faltando o id.")
        }

        const authenticationData = this.authenticator.getData(token);

        if(!authenticationData.id || !authenticationData) {
            throw new InvalidParameterError("Requer um token válido.")
        }

        const music: MusicOutputDTO = await this.musicDatabase.getMusicById(id);
        const genreId: string[] = await this.genreDatabase.getGenreByMusicId(id);

        if(!genreId) {
            throw new GenericError("Gênero não encontrado.")
        }

        const genreNames: string[] = await this.genreDatabase.getGenreById(genreId)

        if(genreId.length !== genreNames.length) {
            throw new GenericError("Algum gênero não foi encontrado.")
        }

        const result: MusicAndGenreOutputDTO = {
            music: music,
            genres: genreNames
        }
        return result;
    }
}