export const Report = (sequelize, Sequelize) => {
    const Report = sequelize.define("report", {
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
        date: {
            type: Sequelize.DATE,
            required: true,
        },
        project: {
            type: Sequelize.STRING,
            required: true,
        },
        ticket: {
            type: Sequelize.STRING,
            required: false,
        },
        task: {
            type: Sequelize.STRING,
            required: true,
        },
        time: {
            type: Sequelize.INTEGER,
            required: true,
        },
        note: {
            type: Sequelize.STRING,
            required: true,
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

    return Report;
};