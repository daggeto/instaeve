"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("instagram_users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      instagram_id: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      profile_pic_url: {
        type: Sequelize.TEXT
      },
      is_private: {
        type: Sequelize.BOOLEAN
      },
      is_verified: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("instagram_users");
  }
};
