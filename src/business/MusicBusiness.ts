import { IdGenerator } from "../services/IdGenerator";
import { MusicDatabase } from "../data/MusicDatabase";
import { Music, MusicInputDTO } from "../model/Music";
import { InvalidParameterError } from "../errors/InvalidParameterError";

export class MusicBusiness {
    constructor (
        private idGenerator: IdGenerator,
        private musicDatabase: MusicDatabase
    ) {}

    public async createMusic(
        input: MusicInputDTO,
    ): Promise<void> {
        
        if(!input.title || !input.author || !input.date || !input.file || !input.album ) {
            throw new InvalidParameterError("Favor preencher todos os campos.")
        }

        const id = this.idGenerator.generateId();

        await this.musicDatabase.createMusic(
            new Music(
                id, 
                input.title,    
                input.author,
                input.date,
                input.file, 
                input.album,
            )
        );
    }

    public async getAllMusics(): Promise<any> {
       
        const musics = await this.musicDatabase.getMusics();

        return musics;
    }
}