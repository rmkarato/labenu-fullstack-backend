import { BaseDatabase } from "./BaseDatabase";
import { Playlist } from "../model/Playlist";

export class PlaylistDatabase extends BaseDatabase {
    protected TABLE_NAME: string = "SoundLabe_Playlists";
    protected TABLE_NAME_MUSIC_PLAYLIST: string = "SoundLabe_MusicPlaylist"

    private toModel(dbModel?: any): Playlist | undefined {
        return dbModel &&
            new Playlist(
                dbModel.id,
                dbModel.title,
                dbModel.subtitle,
                dbModel.image
            )
    }

    public async createPlaylist(
        playlist: Playlist
    ): Promise<void> {
        await super.getConnection()
            .insert({
                id: playlist.getId(),
                title: playlist.getTitle(),
                subtitle: playlist.getSubtitle(),
                image: playlist.getImage()
            })
            .into(this.TABLE_NAME);
    }

    public async insertOneMusicToPlaylist(
        musicId: string,
        playlistId: string
    ): Promise<void> {
        await super.getConnection()
            .insert({
                music_id: musicId,
                playlist_id: playlistId
            })
            .into(this.TABLE_NAME_MUSIC_PLAYLIST)
    }

    public async getPLaylistById(
        id: string
    ): Promise<Playlist | undefined> {
        const result = await super.getConnection()
            .select("*")
            .from(this.TABLE_NAME)
            .where({ id })
        return this.toModel(result[0])
    }

    public async searchMusicInPlaylist(
        musicId: string,
        playlistId: string
    ): Promise <any | undefined> {
        const result = await super.getConnection()
            .raw(`
                SELECT *
                FROM ${this.TABLE_NAME_MUSIC_PLAYLIST}
                WHERE music_id = "${musicId}"
                AND playlist_id = "${playlistId}" 
            `)
            return result[0]
    }
}