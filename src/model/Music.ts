export class Music {
    constructor(
        private id: string,
        private title: string,
        private author: string,
        private date: string,
        private file: string,
        private album: string,
    ) {}

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getAuthor(): string {
        return this.author;
    }

    public getDate(): string {
        return this.date;
    }

    public getFile(): string {
        return this.file;
    }

    public getAlbum(): string {
        return this.album;
    }

    public static toMusicModel(music?: any): Music | undefined {
        return (
            music &&
            new Music(
                music.id,
                music.title,
                music.author,
                music.date,
                music.file,
                music.album
            )
        );
    }
}

export interface MusicInputDTO {
    title: string;
    author: string;
    date: string;
    file: string;
    album: string;
}

export interface MusicOutputDTO {
    id: string;
    title: string;
    author: string;
    date: string;
    file: string;
    album: string;
}

export interface MusicAndGenreOutputDTO {
    music: MusicOutputDTO,
    genres: string[]
}