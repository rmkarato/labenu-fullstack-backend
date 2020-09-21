import { UserBusiness } from "../../business/UserBusiness";
import { User } from "../../model/User";

describe("Testando o signup na camada UserBusiness", () => {

    let userDatabase = {
        createUser: jest.fn((user: User) => {})
    };

    let hashManager = {
        hash: jest.fn(() => "hash")
    };

    let idGenerator = {
        generate: jest.fn(() => "id")
    };

    let authenticator = {
        generate: jest.fn(()=> "token")
    };

    test("Deve retornar erro ao receber um nome vazio", async () => {
        expect.assertions(2);

        const userBusiness = new UserBusiness(
            authenticator as any,
            hashManager as any,
            idGenerator as any,
            userDatabase as any
        );

        try {
            await userBusiness.createUser("", "astrodev@labenu.com.br", "astrodev", "bananinha");
        } catch (error) {
            expect(error.errorCode).toBe(422);
            expect(error.message).toEqual("Favor preencher todos os campos.");
        }
    });
});