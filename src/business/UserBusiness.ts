import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { User } from "../model/User";
import { NotFoundError } from "../errors/NotFoundError";
import { InvalidParameterError } from "../errors/InvalidParameterError";

export class UserBusiness {
    constructor (
        private authenticator: Authenticator,
        private hashManager: HashManager,
        private idGenerator: IdGenerator,
        private userDatabase: UserDatabase
    ) {}

    public async createUser(
        name: string,
        email: string,
        nickname: string,
        password: string
    ) {
        if(!name || !email || !nickname || !password) {
            throw new InvalidParameterError("Favor preencher todos os campos.")
        }

        if(email.indexOf("@") === -1) {
            throw new InvalidParameterError("E-mail inválido.")
        }

        if(password.length < 6) {
            throw new InvalidParameterError("Sua senha deve conter mais de 6 caracteres.")
        }

        const id = this.idGenerator.generateId();

        const hashPassword = await this.hashManager.hash(password);

        await this.userDatabase.createUser(
            new User (id, name, email, nickname, hashPassword)
        );

        const token = this.authenticator.generateToken({ id });

        return { token };
    }

    public async getUserByEmail (
        input: string, 
        password: string
    ) {
        if (!input || !password) {
            throw new InvalidParameterError("Favor preencher todos os campos.")
        }

        let user
        if(input.indexOf("@") !== -1) {
            user = await this.userDatabase.getUserByEmail(input)
        } else {
            user = await this.userDatabase.getUserByNickname(input)
        }

        if (!user) {
            throw new NotFoundError("Usuário não encontrado.")
        }

        const isPasswordCorrect = await this.hashManager.compare(
            password,
            user.getPassword()
        );

        if(!isPasswordCorrect) {
            throw new InvalidParameterError("Senha incorreta.");
        }

        const token = this.authenticator.generateToken({
            id: user.getId()
        });

        return { token };
    }
}