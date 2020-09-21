import moment from "moment";
import { BaseDatabase } from "./BaseDatabase";
import { Music } from "../model/Music";

export class MusicDatabase extends BaseDatabase {
    protected TABLE_NAME: string = "SoundLabe_Music";
    protected TABLE_NAME_GENRE: string = "SoundLabe_Genre"

    public async createMusic(
        music: Music
    ) :Promise<void> {
        await super.getConnection()
            .insert({
                id: music.getId(),
                title: music.getTitle(),
                author: music.getAuthor(),
                date: music.getDate(),
                file: music.getFile(),
                album: music.getAlbum(),
            })
            .into(this.TABLE_NAME);
    }

    public async getMusics(): Promise<any> {
        const result = await super.getConnection()
            .select("*")
            .from(this.TABLE_NAME);

        return result;
    }

    public async getMusicById(
        id: string
    ): Promise<any> {
        const result = await super.getConnection()
        .select("*")
        .from(this.TABLE_NAME)
        .where({ id })

    return result;
    }
}