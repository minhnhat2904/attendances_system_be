export const Leave = (sequelize, Sequelize) => {
    const Leave = sequelize.define("leave", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        userId: {
            type: Sequelize.STRING,
            required: true,
        },
        startDate: {
            type: Sequelize.DATE,
            required: true,
        },
        endDate: {
            type: Sequelize.DATE,
            required: true,
        },
        typeOff: {
            type: Sequelize.STRING,
            required: true,
        },
        reason: {
            type: Sequelize.STRING,
            required: true,
        },
        reasonDetail: {
            type: Sequelize.STRING,
            required: true,
        },
        status: {
            type: Sequelize.INTEGER,
            required: true,
            defaultValue: 0,
        },
        receiver: {
            type: Sequelize.STRING,
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

    return Leave;
};