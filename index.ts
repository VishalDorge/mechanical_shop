import { config } from "dotenv";
import { startServer } from "./app/app";
import { populate } from "./app/utility/populateDb";

config();
startServer();
populate();