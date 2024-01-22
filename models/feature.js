module.exports = (sequelize, Sequelize) => {
    const Feature = sequelize.define('Feature', {
        FeatureId: {
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

    Feature.associate = function(models) {
        Feature.belongsToMany(models.Vehicle, { 
            through: models.Vehicle_Feature,
            foreignKey: 'FeatureId',
            otherKey: 'VehicleId'
        });
    };

    return Feature;
};