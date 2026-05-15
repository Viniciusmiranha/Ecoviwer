import { feedbackCreateSchema, type CreateFeedbackDTO } from "../dtos/dtos.FeedBacks";
import { FeedbackEntity } from "../entity/entity.FeedBacks";
import { FeedbackRepository } from "../repository/repository.FeedBacks";

export type FeedbackResponse = {
  id?: string;
  nome: string;
  comentario: string;
  descricao: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class FeedbackService {
  constructor(private readonly feedbackRepository = new FeedbackRepository()) {}

  async create(feedbackData: CreateFeedbackDTO): Promise<FeedbackResponse> {
    const validatedFeedback = await feedbackCreateSchema.validate(feedbackData, {
      abortEarly: false,
      stripUnknown: true,
    });

    const feedback = new FeedbackEntity(validatedFeedback);
    const createdFeedback = await this.feedbackRepository.create(feedback);

    return this.toResponse(createdFeedback);
  }

  async findAll(): Promise<FeedbackResponse[]> {
    const feedbacks = await this.feedbackRepository.findAll();

    return feedbacks.map((feedback) => this.toResponse(feedback));
  }

  async findById(id: string): Promise<FeedbackResponse | undefined> {
    const feedback = await this.feedbackRepository.findById(id);

    if (!feedback) {
      return undefined;
    }

    return this.toResponse(feedback);
  }

  private toResponse(feedback: FeedbackEntity): FeedbackResponse {
    return {
      id: feedback.id,
      nome: feedback.nome,
      comentario: feedback.comentario,
      descricao: feedback.comentario,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    };
  }
}
