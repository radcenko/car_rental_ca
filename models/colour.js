module.exports = (sequelize, Sequelize) => {
    const Colour = sequelize.define('Colour', {
        ColourId: {
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

    Colour.associate = function(models) {
        Colour.hasMany(models.Vehicle, { foreignKey: 'ColourId' });
    };

    return Colour;
};