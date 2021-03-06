import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { BaseDatabase } from "../data/BaseDatabase";
import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { PlaylistBusiness } from "../business/PlaylistBusiness";
import { PlaylistInputDTO } from "../model/Playlist";
import { UserDatabase } from "../data/UserDatabase";
import { MusicDatabase } from "../data/MusicDatabase";

export class PlaylistController {
    private static PlaylistBusiness = new PlaylistBusiness(
        new Authenticator,
        new IdGenerator,
        new UserDatabase,
        new MusicDatabase,
        new PlaylistDatabase
    );

    public async createPlaylist(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            if(!authenticationData) {
                throw new Error("Token não autorizado.")
            }

            const playlistInput: PlaylistInputDTO = {
                title: req.body.title,
                subtitle: req.body.subtitle,
                image: req.body.image
            }

            await PlaylistController.PlaylistBusiness.createPlaylist(playlistInput)

            res
                .status(200)
                .send({
                    message: "Playlist criada com sucesso"
                });
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
        await BaseDatabase.destroyConnection();
    }

    public async getAllPlaylists(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;
            
            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            if(!authenticationData) {
                throw new Error("Token não autorizado.")
            }

            const playlists = await PlaylistController.PlaylistBusiness.getAllPlaylists()
            
            res
            .status(200)
            .send(playlists);
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
    }

    public async addMusicToPlaylist(req: Request, res: Response) {
        try{
            const token = req.headers.authorization as string;
            const { musicId, playlistId } = req.body;

            await PlaylistController.PlaylistBusiness.addMusicToPlaylist(token, musicId, playlistId)
            
            res
                .status(200)
                .send({
                    message: "Música adicionada à playlist com sucesso."
                });
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
        await BaseDatabase.destroyConnection();
    }

    public async getPlaylistDetails(req: Request, res: Response) {
        try{
            const token = req.headers.authorization as string;
            
            const { id } = req.params;

            const result = await PlaylistController.PlaylistBusiness.getPlaylistDetails(token, id)
            
            res
                .status(200)
                .send(result);
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
        await BaseDatabase.destroyConnection();
    }

    public async deletePlaylist(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;

            const id = req.params.id;
            
            await PlaylistController.PlaylistBusiness.deletePlaylist(id, token)
            
            res
                .status(200)
                .send({
                    message: "Playlist deletada com sucesso."
                });
        } catch(error) {
            res
                .status(error.errorCode || 400)
                .send({
                    message: error.message
                });
        }
        await BaseDatabase.destroyConnection();
    }
}