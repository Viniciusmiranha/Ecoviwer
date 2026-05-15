'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("plants");

    if (table.namePtBr && !table.nameEN) {
      await queryInterface.renameColumn("plants", "namePtBr", "nameEN");
      return;
    }

    if (!table.nameEN) {
      await queryInterface.addColumn("plants", "nameEN", {
        type: Sequelize.STRING,
        allowNull: true,
      });

      await queryInterface.sequelize.query('UPDATE "plants" SET "nameEN" = "name" WHERE "nameEN" IS NULL');

      await queryInterface.changeColumn("plants", "nameEN", {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("plants");

    if (table.nameEN && !table.namePtBr) {
      await queryInterface.renameColumn("plants", "nameEN", "namePtBr");
      return;
    }

    if (table.nameEN) {
      await queryInterface.removeColumn("plants", "nameEN");
    }
  },
};
