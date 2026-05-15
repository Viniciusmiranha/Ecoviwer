'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("plants");

    if (!table.description) {
      await queryInterface.addColumn("plants", "description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("plants");

    if (table.description) {
      await queryInterface.removeColumn("plants", "description");
    }
  },
};
