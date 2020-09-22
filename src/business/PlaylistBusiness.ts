import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { MusicDatabase } from "../data/MusicDatabase";
import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { Playlist, PlaylistInputDTO } from "../model/Playlist";
import { InvalidParameterError } from "../errors/InvalidParameterError";
import { NotFoundError } from "../errors/NotFoundError";
import { GenericError } from "../errors/GenericError";

export class PlaylistBusiness {
    constructor (
        private authenticator: Authenticator,
        private IdGenerator: IdGenerator,
        private userDatabase: UserDatabase,
        private musicDatabase: MusicDatabase,
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

    public async addMusicToPlaylist(
        token: string,
        musicId: string,
        playlistId: string
    ) {
        const authenticationData = this.authenticator.getData(token)
        const user = await this.userDatabase.getUserById(authenticationData.id)

        if(!user) {
            throw new NotFoundError("Usuário não encontrado. Faça novo login.")
        }

        const music = await this.musicDatabase.getMusicById(musicId)

        if(!music) {
            throw new NotFoundError("Não foi possível encontrar música informada.")
        }

        const playlist = await this.playlistDatabase.getPLaylistById(playlistId)

        if(!playlist) {
            throw new NotFoundError("Não foi possível encontrar playlist informada.")
        }

        const searchMusicInPlaylist = await this.playlistDatabase.searchMusicInPlaylist(musicId, playlistId)

        if(searchMusicInPlaylist.length !== 0) {
            throw new GenericError("Essa música já foi adicionada à playlist.")
        }

        await this.playlistDatabase.insertOneMusicToPlaylist(musicId, playlistId)
    }
}
