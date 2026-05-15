import Sequelize, {
  Model,
  type Sequelize as SequelizeType,
} from "sequelize";

export type FeedbackTypeDB = {
  id: string;
  nome: string;
  comentario: string;
  created_at?: Date;
  updated_at?: Date;
};

type FeedbackCreationAttributes =
  Omit<FeedbackTypeDB, "id" | "created_at" | "updated_at"> &
  Partial<Pick<FeedbackTypeDB, "id" | "created_at" | "updated_at">>;

class FeedbackModel
  extends Model<FeedbackTypeDB, FeedbackCreationAttributes>
  implements FeedbackTypeDB
{
  declare id: string;
  declare nome: string;
  declare comentario: string;
  declare created_at?: Date;
  declare updated_at?: Date;

  static initModel(sequelize: SequelizeType) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        nome: {
          type: Sequelize.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 100],
          },
        },
        comentario: {
          type: Sequelize.STRING(1000),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [3, 1000],
          },
        },
      },
      {
        sequelize,
        tableName: "feedbacks",
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );

    return FeedbackModel;
  }

  static associate() {
    // Sem associacoes por enquanto.
  }
}

export default FeedbackModel;
