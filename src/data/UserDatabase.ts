import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {
    protected TABLE_NAME: string = "SoundLabe_Users";

    private toModel(dbModel?: any): User | undefined {
        return (
            dbModel &&
            new User(
                dbModel.id,
                dbModel.name,
                dbModel.email,
                dbModel.nickname,
                dbModel.password
            )
        );
    }

    public async createUser(
        user: User
    ) :Promise<void> {
        await this.getConnection()
            .insert({
                id: user.getId(),
                name: user.getName(),
                email: user.getEmail(),
                nickname: user.getNickname(),
                password: user.getPassword(),
            })
            .into(this.TABLE_NAME)
    }
    
    public async getUserByEmail(email: string) :Promise<User | undefined> {
        const result = await super.getConnection()
            .raw(`
                SELECT * from ${this.TABLE_NAME} WHERE email = '${email}'
            `);

            return this.toModel(result[0][0]);
    }
}