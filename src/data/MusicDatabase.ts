import { BaseDatabase } from "./BaseDatabase";
import { Music } from "../model/Music";

export class MusicDatabase extends BaseDatabase {
    protected TABLE_NAME: string = "SoundLabe_Music";

    private toModel(dbModel?: any): Music | undefined {
        return (
            dbModel &&
            new Music (
                dbModel.id,
                dbModel.title,
                dbModel.author,
                dbModel.date,
                dbModel.file,
                dbModel.genre,
                dbModel.album
            )
        );
    }

    public async createMusic(
        music: Music,
        genre: string[]
    ) :Promise<void> {
        try {
            await super.getConnection()
                .insert({
                    id: music.getId(),
                    title: music.getTitle(),
                    author: music.getAuthor(),
                    date: music.getDate(),
                    file: music.getFile(),
                    genre: music.getGenre(),
                    album: music.getAlbum(),
                })
                .into(this.TABLE_NAME);

                for (const type of genre) {
                    await super.getConnection()
                        .insert({
                            music: name,
                            genre: type
                        })
                        .into(this.TABLE_NAME)
                }
        } catch(error) {
            throw new Error("Ocorreu um erro ao criar a música.");
        }
    }
}