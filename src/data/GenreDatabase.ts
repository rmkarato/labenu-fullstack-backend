import { BaseDatabase } from "./BaseDatabase";
import { Genre } from "../model/Genre";

export class GenreDatabase extends BaseDatabase {
    protected TABLE_NAME: string = "SoundLabe_Genre";

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
}