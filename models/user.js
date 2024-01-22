module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        Id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        FullName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        Username: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Password: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        RoleId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Roles',
                key: 'RoleId'
            }
        }
    }, { 
        timestamps: false
    });

    User.associate = function(models) {
        User.belongsTo(models.Role, { foreignKey: 'RoleId' });
        User.hasMany(models.Rental, { foreignKey: 'UserId' });
    };

    return User;
};