export const Account = (sequelize, Sequelize) => {
    const Account = sequelize.define("account", {
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
        name: {
            type: Sequelize.STRING,
            required: true,
        },
        birthday: {
            type: Sequelize.STRING,
            required: true,
        },
        phone: {
            type: Sequelize.STRING,
            required: true,
        },
        address: {
            type: Sequelize.STRING,
            required: true,
        },
        role: {
            type: Sequelize.STRING,
            required: true,
        },
        deleted_flag: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        inserted_by: {
            type: Sequelize.STRING,
            defaultValue: "admin"
        },
        updated_by: {
            type: Sequelize.STRING,
            defaultValue: "admin"
        }
    }, {});

    Account.associate = function (models) {
        Account.belongsToMany(models.Permission, {
            through: "userPermission",
            as: 'permission',
            foreignKey: 'permissionId',
        });
    };

    return Account;
};
