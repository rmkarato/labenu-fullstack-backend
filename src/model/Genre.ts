export class Genre {
    constructor(
        private id: string,
        private genre: string[]
    ) {}

    public getId(): string {
        return this.id;
    }

    public getGenre(): string[] {
        return this.genre;
    }
}

export class GenreToMusic {
    constructor(
        public musicId: string,
        public genreId: string[]
    ) {}

    public getMusicId(): string {
        return this.musicId;
    }

    public getGenreId(): string[] {
        return this.genreId;
    }
}

export interface GenreInputDTO {
    id: string[];
    genre: GenreName;
}

export interface InsertGenreToMusicInputDTO {
    musicId: string;
    genreId: string[];
}

export enum GenreName {
    Axé = "Axé",
    Blues = "Blues",
    Clássica = "Clássica",
    Country = "Country",
    Eletrônica = "Eletrônica",
    Forró = "Forró",
    Funk = "Funk",
    Gospel = "Gospel",
    HipHop = "Hip Hop",
    Indie = "Indie",
    Instrumental = "Instrumental",
    Jazz = "Jazz",
    MPB = "MPB",
    KPop = "K-Pop",
    Outro = "Outro",
    Pagode = "Pagode",
    Pop = "Pop",
    PopRock = "Pop Rock",
    Rap = "Rap",
    Reggae = "Reggae",
    Rock = "Rock",
    Samba = "Samba",
    Sertanejo = "Sertanejo"
}