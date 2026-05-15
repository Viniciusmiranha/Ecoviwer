export type FeedbackProps = {
  id?: string;
  nome: string;
  comentario: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FeedbackEntity {
  public readonly id?: string;
  public readonly nome: string;
  public readonly comentario: string;
  public readonly createdAt: Date;
  public readonly updatedAt?: Date;

  constructor({ id, nome, comentario, createdAt, updatedAt }: FeedbackProps) {
    const normalizedName = nome.trim();
    const normalizedComment = comentario.trim();

    if (!normalizedName) {
      throw new Error("Feedback name is required");
    }

    if (!normalizedComment) {
      throw new Error("Feedback comment is required");
    }

    this.id = id;
    this.nome = normalizedName;
    this.comentario = normalizedComment;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt;
  }
}

export type FeedBacksProps = FeedbackProps;
export const FeedBacksEntity = FeedbackEntity;
