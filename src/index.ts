import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { AddressInfo } from "net";

import { userRouter } from "./router/UserRouter";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/user", userRouter);

app.get("/test", async (req: Request, res: Response) => {
    try {
      res.status(200).send("Hi, your server is working!");
    } catch (error) {
      res.status(400).send("ERROR :(");
    }
});

const server = app.listen(process.env.PORT || 3000, () => {
    if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Server is running in http://localhost:${address.port}`);
    } else {
      console.error(`Failure upon starting server.`);
    }
});
  