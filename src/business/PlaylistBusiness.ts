import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { Playlist, PlaylistInputDTO } from "../model/Playlist";
import { InvalidParameterError } from "../errors/InvalidParameterError";

export class PlaylistBusiness {
    constructor (
        private authenticator: Authenticator,
        private IdGenerator: IdGenerator,
        private playlistDatabase: PlaylistDatabase
    ) {}

    public async createPlaylist(
        input: PlaylistInputDTO,
    ): Promise<void> {

        if(!input.title || !input.subtitle) {
            throw new InvalidParameterError("Favor preencher todos os campos.")
        }

        const id = this.IdGenerator.generateId();

        await this.playlistDatabase.createPlaylist(
            new Playlist(
                id,
                input.title,
                input.subtitle,
                input.image
            )
        );
    }
}
