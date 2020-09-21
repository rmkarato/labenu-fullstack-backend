import { UserBusiness } from "../../business/UserBusiness";
import { User } from "../../model/User";

describe("Testando o signup na camada UserBusiness", () => {

    let userDatabase = {
        
    };

    let hashManager = {
        
    };

    let idGenerator = {
        
    };

    let authenticator = {
        generate: jest.fn(()=> "token")
    };

    test("Deve retornar erro ao receber um e-mail vazio", async () => {
        expect.assertions(2);

        const userBusiness = new UserBusiness(
            authenticator as any,
            hashManager as any,
            idGenerator as any,
            userDatabase as any
        );

        try {
            await userBusiness.getUserByEmail("", "bananinha");
        } catch (error) {
            expect(error.errorCode).toBe(422);
            expect(error.message).toEqual("Favor preencher todos os campos.");
        }

    });

    test("Deve retornar erro ao receber uma senha vazia", async () => {
        expect.assertions(2);

        const userBusiness = new UserBusiness(
            authenticator as any,
            hashManager as any,
            idGenerator as any,
            userDatabase as any
        );

        try {
            await userBusiness.getUserByEmail("astrodev@gmail.com", "");
        } catch (error) {
            expect(error.errorCode).toBe(422);
            expect(error.message).toEqual("Favor preencher todos os campos.");
        }

    });

    test("Deve retornar erro quando o usuário não é encontrado", async() => {
        expect.assertions(3);

        const userBusiness = new UserBusiness(
            authenticator as any,
            hashManager as any,
            idGenerator as any,
            userDatabase as any
        );

        let getUserByEmail = jest.fn((email:string)=>{return undefined});

        try {
            userDatabase = { getUserByEmail };

            await userBusiness.getUserByEmail("notFound@gmail.com", "bananinha")
        } catch (error) {
            expect(error.errorCode).toBe(404);
            expect(error.message).toEqual("Usuário não encontrado.");
            expect(getUserByEmail).toHaveBeenCalledWith("notFound@gmail.com");
        }
    })

    test("Deve retornar erro quando a senha está incorreta", async() => {
        expect.assertions(4);

        const userBusiness = new UserBusiness(
            authenticator as any,
            hashManager as any,
            idGenerator as any,
            userDatabase as any
        );

        let getUserByEmail = jest.fn((email:string) => {
            return new User("id", "Astrodev", "astrodev@gmail.com", "astrodev", "bananinha")
        });

        let compareHash = jest.fn((password: string, userPassword: string) => false);

        try {
            userDatabase = { getUserByEmail };
            hashManager = { compareHash };

            await userBusiness.getUserByEmail("astrodev@gmail.com", "maxixezinho")
        } catch (error) {
            expect(error.errorCode).toBe(422);
            expect(error.message).toEqual("Senha incorreta.");
            expect(getUserByEmail).toHaveBeenCalledWith("astrodev@gmail.com");
            expect(compareHash).toHaveBeenCalledWith("maxixezinho", "bananinha");
        }
    });
});