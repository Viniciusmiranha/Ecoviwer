import { type NextFunction, type Request, type Response } from "express";
import { PlantService } from "../services/plant.service";
import { StatusCode } from "status-code-enum";

class PlantController {
    private readonly service = new PlantService();

    async indexAll(req: Request, res: Response, _next: NextFunction) {
        const page = Number(req.params.page) || 1;

        try {
            const plants = await this.service.getAll(page);

            return res.status(StatusCode.SuccessOK).json(plants);
        } catch (error) {
            console.error("CONTROLLER ERROR:", error);

            return res.status(StatusCode.ServerErrorInternal).json({
                message: "Error while trying to get plants",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async indexFamily(req: Request, res: Response, _next: NextFunction) {
        const page = Number(req.params.page) || 1;
        const perPage = Number(req.query.perPage) || 29;
        const family = String(req.params.family ?? "");

        try {
            if (!family) {
                return res.status(StatusCode.ClientErrorBadRequest).json({
                    message: "Family parameter is required"
                });
            }

            const filterPlants = await this.service.getByFamily(family, page, perPage);

            return res.status(StatusCode.SuccessOK).json(filterPlants);
        } catch (error) {
            console.error("CONTROLLER ERROR:", error);

            return res.status(StatusCode.ServerErrorInternal).json({
                message: "Error while trying to get plants by family",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async indexFamilies(req: Request, res: Response, _next: NextFunction) {
        const page = Number(req.query.page) || 1;
        const perPage = Number(req.query.perPage) || 20;

        try {
            const families = await this.service.getFamilies(page, perPage);

            return res.status(StatusCode.SuccessOK).json(families);
        } catch (error) {
            console.error("CONTROLLER ERROR:", error);

            return res.status(StatusCode.ServerErrorInternal).json({
                message: "Error while trying to get plant families",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async showCareAttention(req: Request, res: Response, _next: NextFunction) {
        const plantId = Number(req.params.id);

        try {
            if (!plantId) {
                return res.status(StatusCode.ClientErrorBadRequest).json({
                    message: "Plant id is required"
                });
            }

            const careAttention = await this.service.getPlantCareAttention(plantId);

            return res.status(StatusCode.SuccessOK).json(careAttention);
        } catch (error) {
            console.error("CONTROLLER ERROR:", error);

            return res.status(StatusCode.ServerErrorInternal).json({
                message: "Error while trying to get plant care attention",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async refreshFamiliesIndex(_req: Request, res: Response, _next: NextFunction) {
        try {
            const plantIndex = await this.service.refreshPlantIndex();

            return res.status(StatusCode.SuccessOK).json({
                message: "Plant family index refreshed",
                totalPlants: plantIndex.plants.length,
                totalFamilies: plantIndex.families.length,
                indexedAt: plantIndex.indexedAt,
                completed: plantIndex.completed,
                stoppedAtPage: plantIndex.stoppedAtPage,
                warning: plantIndex.warning,
            });
        } catch (error) {
            console.error("CONTROLLER ERROR:", error);

            return res.status(StatusCode.ServerErrorInternal).json({
                message: "Error while trying to refresh plant family index",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
}

export default new PlantController();
