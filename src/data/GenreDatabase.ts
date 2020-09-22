import { BaseDatabase } from "./BaseDatabase";
import { Genre, GenreName, InsertGenreToMusicInputDTO } from "../model/Genre";

export class GenreDatabase extends BaseDatabase {
    protected TABLE_NAME: string = "SoundLabe_Genre";
    protected TABLE_NAME_MUSIC_GENRE: string = "SoundLabe_MusicGenre";

    private toModel(dbModel?: any): Genre | undefined {
        return dbModel && new Genre(
            dbModel.id,
            dbModel.genre
        )
    }

    public async createGenre(
        genre: Genre
    ): Promise<void> {
        await super.getConnection()
            .insert({
                id: genre.getId(),
                genre: genre.getGenre(),
            })
            .into(this.TABLE_NAME);
    }

    public async getGenres(): Promise<Genre[]> {
        const result = await super.getConnection()
           .raw(`
                SELECT * FROM ${this.TABLE_NAME}
           `)

        return result[0].map((res:any) => this.toModel(res))
    }

    public async verifyGenre(
        genre: string
    ): Promise<Genre | undefined> {
        const result = await super.getConnection()
            .select("*")
            .from(this.TABLE_NAME)
            .where({ genre })

        return this.toModel(result[0])
    }

    public async getGenreByName(
        genreName: string[]
    ): Promise<string[]> {
        let id: string[] = [];

        for (let genre of genreName) {
            const result = await super.getConnection()
                .raw(`
                    SELECT id
                    FROM ${this.TABLE_NAME}
                    WHERE genre IN("${genre}")
                `)
            id.push(result[0][0].id)
        }
        return id;
    }

    public async getGenreByMusicId(
        musicId: string
    ): Promise<string[]> {
        const result = await super.getConnection()
            .raw(`
                SELECT *
                FROM ${this.TABLE_NAME_MUSIC_GENRE}
                WHERE music_id="${musicId}"
            `)

            const genreId: string[] = result[0].map((item: any) => {
                return item.genre_id
            })
            return genreId;
    }

    public async insertGenreToMusic(input: InsertGenreToMusicInputDTO): Promise<void> {
        const insertGenreToMusic = input.genreId.map((item: any) => {
            return {
                music_id: input.musicId,
                genre_id: item
            }
        })
        await super.getConnection()
            .insert(insertGenreToMusic)
            .into(this.TABLE_NAME_MUSIC_GENRE)
    }
}

