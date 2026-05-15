import { Sequelize } from "sequelize";
import Plants from "./Plants";
import Feedbacks from "./Feedbacks";

const sequelize = new Sequelize(
  process.env.DB_NAME || "ecoviewerDB",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "ecoviewerDbPass",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    logging: false,
  }
);

Plants.initModel(sequelize);
Feedbacks.initModel(sequelize);

export { sequelize, Plants, Feedbacks };

export default {
  sequelize,
  Plants,
  Feedbacks,
};
