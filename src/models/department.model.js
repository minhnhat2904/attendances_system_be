export const Department = (sequelize, Sequelize) => {
    const Department = sequelize.define("Department", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            required: true,
        },
        userId: {
            type: Sequelize.STRING,
            required: false,
        },
        deletedFlag: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        insertedBy: {
            type: Sequelize.STRING,
            defaultValue: ""
        },
        updatedBy: {
            type: Sequelize.STRING,
            defaultValue: ""
        }
    }, {});

    return Department;
};