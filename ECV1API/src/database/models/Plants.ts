import Sequelize, {
  Model,
  type Sequelize as SequelizeType,
} from "sequelize";

export type PlantsTypeDB = {
  id: number;
  name: string;
  nameEN: string;
  scientificName: string;
  family: string;
  familyPopular?: string | null;
  default_image?: string;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
};

type PlantCreationAttributes =
  Omit<PlantsTypeDB, "created_at" | "updated_at"> &
  Partial<Pick<PlantsTypeDB, "created_at" | "updated_at">>;

class PlantsModel
  extends Model<PlantsTypeDB, PlantCreationAttributes>
  implements PlantsTypeDB
{
  declare id: number;
  declare name: string;
  declare nameEN: string;
  declare scientificName: string;
  declare family: string;
  declare familyPopular?: string | null;
  declare default_image?: string;
  declare description?: string | null;
  declare created_at?: Date;
  declare updated_at?: Date;

  static initModel(sequelize: SequelizeType) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        nameEN: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        scientificName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        family: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        familyPopular: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        default_image: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "plants",
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );

    return PlantsModel;
  }

  static associate() {
    // Sem associacoes por enquanto.
  }
}

export default PlantsModel;
