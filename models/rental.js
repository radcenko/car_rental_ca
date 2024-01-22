module.exports = (sequelize, Sequelize) => {
    const Rental = sequelize.define('Rental', {
        RentalId: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'Id'
            }
        },
        VehicleId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Vehicles', 
                key: 'Id'
            }
        },
        RentalStartDate: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
        },
        RentalEndDate: {
            type: Sequelize.DataTypes.DATE
        }
    }, { 
        timestamps: false
    });

    Rental.associate = function(models) {
        Rental.belongsTo(models.User, { foreignKey: 'UserId' });
        Rental.belongsTo(models.Vehicle, { foreignKey: 'VehicleId' });
    };

    return Rental;
};