import { Router } from "express";
import feedbackController from "../controllers/feedback.controller";
import plantController from "../controllers/plant.controller";


export const routes = Router();

routes.get("/get_plant/:page", (req, res, next) => {
    return plantController.indexAll(req, res, next);
});


routes.get("/families", (req, res, next) => {
    return plantController.indexFamilies(req, res, next);
});

routes.get("/plants/:id/care-attention", (req, res, next) => {
    return plantController.showCareAttention(req, res, next);
});

routes.post("/families/refresh", (req, res, next) => {
    return plantController.refreshFamiliesIndex(req, res, next);
});

routes.post("/feedback", (req, res, next) => {
    return feedbackController.create(req, res, next);
});

routes.get("/feedback", (req, res, next) => {
    return feedbackController.index(req, res, next);
});

routes.get("/feedback/:id", (req, res, next) => {
    return feedbackController.show(req, res, next);
});

routes.get("/families/:family/plants/:page", (req, res, next) => {
    return plantController.indexFamily(req, res, next);
});

routes.get("/get_family/:family", (req, res, next) => {
    return plantController.indexFamily(req, res, next);
});

routes.get("/get_family/:family/:page", (req, res, next) => {
    return plantController.indexFamily(req, res, next);
});
