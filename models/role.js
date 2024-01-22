module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        RoleId: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        RoleName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, { 
        timestamps: false
    });

    Role.associate = function(models) {
        Role.hasMany(models.User, { foreignKey: 'RoleId' });
    };

    return Role;
};