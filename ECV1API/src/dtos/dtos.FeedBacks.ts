import * as yup from "yup";

export type FeedbackCreateInput = {
  nome?: unknown;
  comentario?: unknown;
  descricao?: unknown;
};

export const feedbackCreateSchema = yup
  .object({
    nome: yup
      .string()
      .trim()
      .min(2, "O nome deve ter pelo menos 2 caracteres")
      .max(100, "O nome deve ter no maximo 100 caracteres")
      .required("O nome e obrigatorio"),
    comentario: yup
      .string()
      .trim()
      .min(3, "O comentario deve ter pelo menos 3 caracteres")
      .max(1000, "O comentario deve ter no maximo 1000 caracteres")
      .required("O comentario e obrigatorio"),
  })
  .required();

export const feedbackReturnSchema = feedbackCreateSchema.shape({
  id: yup.string().uuid().required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().optional(),
});

export type CreateFeedbackDTO = yup.InferType<typeof feedbackCreateSchema>;
export type FeedbackReturnDTO = yup.InferType<typeof feedbackReturnSchema>;

export function normalizeFeedbackCreateInput(input: FeedbackCreateInput): CreateFeedbackDTO {
  return {
    nome: typeof input.nome === "string" ? input.nome : "",
    comentario:
      typeof input.descricao === "string"
        ? input.descricao
        : typeof input.comentario === "string"
          ? input.comentario
          : "",
  };
}

export const FeedBacksReturnDTO = feedbackReturnSchema;
export const UserCreatedSchema = feedbackCreateSchema;
export type CreatedUSer = CreateFeedbackDTO;
