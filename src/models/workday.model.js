export const WorkDay = (sequelize, Sequelize) => {
    const WorkDay = sequelize.define("workDay", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        qrCodeId: {
            type: Sequelize.STRING,
            required: true,
        },
        userId: {
            type: Sequelize.STRING,
            required: true,
        },
        leaveId: {
            type: Sequelize.STRING,
            required: true,
        },
        checkIn: {
            type: Sequelize.DATE,
            required: true,
        },
        checkOut: {
            type: Sequelize.DATE,
            required: true,
        },
        status: {
            type: Sequelize.INTEGER,
            required: true,
            defaultValue: 0
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

    return WorkDay;
};