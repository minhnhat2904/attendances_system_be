export const Admin = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admin", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            required: true,
        },
        password: {
            type: Sequelize.STRING,
            required: true,
        },
        role: {
            type: Sequelize.STRING,
            default: "admin",
        },
    });

    return Admin;
};
