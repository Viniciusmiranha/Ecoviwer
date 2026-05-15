import { sequelize, Plants } from "../database/models";
import { getFamilyPopularName } from "../services/family-popular.service";

async function populateFamilyPopular(): Promise<void> {
    const plants = await Plants.findAll({
        attributes: ["id", "family", "familyPopular"],
        order: [["family", "ASC"], ["id", "ASC"]],
    });

    let updatedPlants = 0;

    await sequelize.transaction(async (transaction) => {
        for (const plant of plants) {
            const familyPopular = getFamilyPopularName(plant.family);

            if (plant.familyPopular === familyPopular) {
                continue;
            }

            await Plants.update(
                { familyPopular },
                {
                    where: { id: plant.id },
                    transaction,
                    silent: true,
                }
            );
            updatedPlants += 1;
        }
    });

    console.log(`familyPopular updated: ${updatedPlants}`);
}

populateFamilyPopular()
    .catch((error) => {
        console.error("Error while populating familyPopular:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await sequelize.close();
    });
