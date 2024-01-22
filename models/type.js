module.exports = (sequelize, Sequelize) => {
    const VehicleType = sequelize.define('VehicleType', {
        VehicleTypeId: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    }, { 
        timestamps: false
    });

    VehicleType.associate = function(models) {
        VehicleType.hasMany(models.Vehicle, { foreignKey: 'VehicleTypeId' });
    };

    return VehicleType;
};