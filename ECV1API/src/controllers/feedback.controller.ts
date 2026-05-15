import { type NextFunction, type Request, type Response } from "express";
import { StatusCode } from "status-code-enum";
import * as yup from "yup";
import { normalizeFeedbackCreateInput } from "../dtos/dtos.FeedBacks";
import { FeedbackService } from "../services/feedback.service";

class FeedbackController {
  private readonly service = new FeedbackService();

  async create(req: Request, res: Response, _next: NextFunction) {
    try {
      const feedbackData = normalizeFeedbackCreateInput(req.body);
      const feedback = await this.service.create(feedbackData);

      return res.status(StatusCode.SuccessCreated).json(feedback);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(StatusCode.ClientErrorBadRequest).json({
          message: "Invalid feedback data",
          errors: error.errors,
        });
      }

      console.error("FEEDBACK CONTROLLER ERROR:", error);

      return res.status(StatusCode.ServerErrorInternal).json({
        message: "Error while trying to create feedback",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async index(_req: Request, res: Response, _next: NextFunction) {
    try {
      const feedbacks = await this.service.findAll();

      return res.status(StatusCode.SuccessOK).json(feedbacks);
    } catch (error) {
      console.error("FEEDBACK CONTROLLER ERROR:", error);

      return res.status(StatusCode.ServerErrorInternal).json({
        message: "Error while trying to list feedbacks",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async show(req: Request, res: Response, _next: NextFunction) {
    try {
      const feedback = await this.service.findById(String(req.params.id ?? ""));

      if (!feedback) {
        return res.status(StatusCode.ClientErrorNotFound).json({
          message: "Feedback not found",
        });
      }

      return res.status(StatusCode.SuccessOK).json(feedback);
    } catch (error) {
      console.error("FEEDBACK CONTROLLER ERROR:", error);

      return res.status(StatusCode.ServerErrorInternal).json({
        message: "Error while trying to get feedback",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new FeedbackController();
