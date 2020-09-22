import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { BaseDatabase } from "../data/BaseDatabase";
import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { PlaylistBusiness } from "../business/PlaylistBusiness";
import { PlaylistInputDTO } from "../model/Playlist";

export class PlaylistController {
    private static PlaylistBusiness = new PlaylistBusiness(
        new Authenticator,
        new IdGenerator,
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
}