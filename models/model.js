module.exports = (sequelize, Sequelize) => {
    const Model = sequelize.define('Model', {
        ModelId: {
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

    Model.associate = function(models) {
        Model.hasMany(models.Vehicle, { foreignKey: 'ModelId' });
    };

    return Model;
};