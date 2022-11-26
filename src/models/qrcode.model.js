export const QRCode = (sequelize, Sequelize) => {
    const QRCode = sequelize.define("qrCode", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        url: {
            type: Sequelize.STRING,
            required: true,
        },
        deletedFlag: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        insertedBy: {
            type: Sequelize.STRING,
            defaultValue: "admin"
        },
        updatedBy: {
            type: Sequelize.STRING,
            defaultValue: "admin"
        }
    }, {});

    return QRCode;
};