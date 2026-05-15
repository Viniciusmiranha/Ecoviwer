'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("plants", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nameEN: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scientificName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      family: {
        type: Sequelize.STRING,
        allowNull: false
      },
      default_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }

    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable("plants");
  }
};
