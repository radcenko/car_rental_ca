module.exports = (sequelize, Sequelize) => {
    const Vehicle_Feature = sequelize.define('Vehicle_Feature', {
        VehicleId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Vehicles',
                key: 'Id'
            }
        },
        FeatureId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Features',
                key: 'FeatureId'
            }
        }
    }, { 
        timestamps: false
    });

    return Vehicle_Feature;
};