import { sequelize } from "../database/models";
import { PlantRepository } from "../repository/repository.plant";
import { buildPlantDescription, hasPlantDescription } from "../services/plant-description.service";

async function populatePlantDescriptions(): Promise<void> {
    const plantRepository = new PlantRepository();
    const plantsWithoutDescription = await plantRepository.findWithoutDescription();
    let updatedPlants = 0;

    for (const plant of plantsWithoutDescription) {
        if (hasPlantDescription(plant.description)) {
            continue;
        }

        const description = buildPlantDescription(plant);
        await plantRepository.updateDescription(plant.id, description);
        updatedPlants += 1;
    }

    console.log(`Plant descriptions updated: ${updatedPlants}`);
}

populatePlantDescriptions()
    .catch((error) => {
        console.error("Error while populating plant descriptions:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await sequelize.close();
    });
