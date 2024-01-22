module.exports = (sequelize, Sequelize) => {
    const Vehicle = sequelize.define('Vehicle', {
        Id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        RegistrationNo: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        MakeId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Makes',
                key: 'MakeId'
            }
        },
        ModelId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Models',
                key: 'ModelId'
            }
        },
        ColourId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Colours',
                key: 'ColourId'
            }
        },
        VehicleTypeId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'VehicleTypes',
                key: 'VehicleTypeId'
            }
        },
        LastServiceDate: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
        },
        Rented: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false
        }
    }, { 
        timestamps: false
    });

    Vehicle.associate = function(models) {
        Vehicle.belongsTo(models.Make, { foreignKey: 'MakeId' });
        Vehicle.belongsTo(models.Model, { foreignKey: 'ModelId' });
        Vehicle.belongsTo(models.Colour, { foreignKey: 'ColourId' });
        Vehicle.belongsTo(models.VehicleType, { foreignKey: 'VehicleTypeId' });
        Vehicle.belongsToMany(models.Feature, { 
            through: models.Vehicle_Feature,
            foreignKey: 'VehicleId',
            otherKey: 'FeatureId'
        });
    };

    return Vehicle;
};