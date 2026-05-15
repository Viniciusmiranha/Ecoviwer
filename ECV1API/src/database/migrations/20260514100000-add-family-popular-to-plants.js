'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("plants");

    if (!table.familyPopular) {
      await queryInterface.addColumn("plants", "familyPopular", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("plants");

    if (table.familyPopular) {
      await queryInterface.removeColumn("plants", "familyPopular");
    }
  },
};
