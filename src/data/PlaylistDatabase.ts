import { BaseDatabase } from "./BaseDatabase";
import { Playlist } from "../model/Playlist";

export class PlaylistDatabase extends BaseDatabase {
    protected TABLE_NAME: string = "SoundLabe_Playlists";

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
}