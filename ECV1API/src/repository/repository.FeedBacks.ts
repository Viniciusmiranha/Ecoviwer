import { Feedbacks as FeedbackModel } from "../database/models";
import { FeedbackEntity, type FeedbackProps } from "../entity/entity.FeedBacks";

type FeedbackModelInstance = InstanceType<typeof FeedbackModel>;
type FeedbackPersistence = FeedbackProps & {
  created_at?: Date;
  updated_at?: Date;
};

export class FeedbackRepository {
  constructor(private readonly model: typeof FeedbackModel = FeedbackModel) {}

  async create(feedback: FeedbackEntity): Promise<FeedbackEntity> {
    const createdFeedback = await this.model.create({
      nome: feedback.nome,
      comentario: feedback.comentario,
    });

    return this.toEntity(createdFeedback);
  }

  async findById(id: string): Promise<FeedbackEntity | undefined> {
    if (!id?.trim()) {
      throw new Error("Feedback id is required");
    }

    const feedback = await this.model.findByPk(id);

    if (!feedback) {
      return undefined;
    }

    return this.toEntity(feedback);
  }

  async findAll(): Promise<FeedbackEntity[]> {
    const feedbacks = await this.model.findAll({
      order: [["created_at", "DESC"]],
    });

    return feedbacks.map((feedback) => this.toEntity(feedback));
  }

  private toEntity(feedback: FeedbackModelInstance): FeedbackEntity {
    const rawFeedback = feedback.toJSON() as FeedbackPersistence;

    return new FeedbackEntity({
      id: rawFeedback.id,
      nome: rawFeedback.nome,
      comentario: rawFeedback.comentario,
      createdAt: rawFeedback.createdAt ?? rawFeedback.created_at,
      updatedAt: rawFeedback.updatedAt ?? rawFeedback.updated_at,
    });
  }
}

export const FeedBacksRepository = FeedbackRepository;
export const UsersRepository = FeedbackRepository;
