module.exports = (sequelize, Sequelize) => {
    const Make = sequelize.define('Make', {
        MakeId: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, { 
        timestamps: false
    });

    Make.associate = function(models) {
        Make.hasMany(models.Vehicle, { foreignKey: 'MakeId' });
    };

    return Make;
};