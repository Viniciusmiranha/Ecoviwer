import { sequelize } from "../database/models";
import { PlantRepository } from "../repository/repository.plant";
import { buildPlantDescription } from "../services/plant-description.service";
import {
    getOriginalEnglishName,
    getTranslatedFamilyName,
} from "../services/plant-localization.service";

async function migratePlantNamesToPtBr(): Promise<void> {
    const plantRepository = new PlantRepository();
    const plants = await plantRepository.findAll();
    let updatedPlants = 0;

    for (const plant of plants) {
        const originalEnglishName = getOriginalEnglishName(plant);
        const translatedFamily = getTranslatedFamilyName(plant.family);
        const description = buildPlantDescription({
            name: originalEnglishName,
            scientificName: plant.scientificName,
            family: translatedFamily,
        });

        await plantRepository.updateLocalizedFields(plant.id, {
            name: originalEnglishName,
            nameEN: originalEnglishName,
            family: translatedFamily,
            description,
        });
        updatedPlants += 1;
    }

    console.log(`Plant localized fields updated: ${updatedPlants}`);
}

migratePlantNamesToPtBr()
    .catch((error) => {
        console.error("Error while migrating plant names to pt-BR:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await sequelize.close();
    });
