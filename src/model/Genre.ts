export class Genre {
    constructor(
        private id: string,
        private genre: string
    ) {}

    public getId(): string {
        return this.id;
    }

    public getGenre(): string {
        return this.genre;
    }

    public static toGenreModel(genre?: any): Genre | undefined {
        return (
            genre &&
            new Genre(
                genre.id,
                genre.genre
            )
        );
    }
}

export interface GenreInputDTO {
    genre: string;
}