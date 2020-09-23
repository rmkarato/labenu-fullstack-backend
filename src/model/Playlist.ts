export class Playlist {
    constructor(
        private id: string,
        private title: string,
        private subtitle: string,
        private image?: string
    ) {}

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getSubtitle(): string {
        return this.subtitle;
    }

    public getImage(): string | undefined {
        return this.image;
    }

    public static toPlaylistModel(playlist?: any): Playlist | undefined {
        return (
            playlist &&
            new Playlist(
                playlist.id,
                playlist.title,
                playlist.subtitle,
                playlist.image
            )
        );
    }
}

export interface PlaylistInputDTO {
    title: string;
    subtitle: string;
    image?: string;
}