const { QueryTypes } = require('sequelize');

class TypeService {
    constructor(db) {
        this.client = db.sequelize;
    }

    async getAllVehicleTypes() {
        const query = `SELECT VehicleTypeId as Id, Name FROM VehicleTypes ORDER BY VehicleTypeId;`;
        try {
            const types = await this.client.query(query, {
                type: QueryTypes.SELECT
            });
            return types;
        } catch (error) {
            console.error('Error fetching vehicle types:', error);
            throw error;
        }
    }

    async addVehicleType(name) {
        const query = `INSERT INTO VehicleTypes (Name) VALUES (?)`;
        await this.client.query(query, {
            replacements: [name],
            type: QueryTypes.INSERT
        });
    }

    async canManipulateVehicleType(id) {
        const query = `SELECT COUNT(*) AS count FROM Vehicles WHERE VehicleTypeId = ?`;
        const result = await this.client.query(query, {
            replacements: [id],
            type: QueryTypes.SELECT
        });
        return result[0].count === 0; // Returns true if no dependencies
    }  

    async updateVehicleType(id, newName) {
        if (await this.canManipulateVehicleType(id)) {
            const query = `UPDATE VehicleTypes SET Name = ? WHERE VehicleTypeId = ?`;
            await this.client.query(query, {
                replacements: [newName, id],
                type: QueryTypes.UPDATE
            });
        } else {
            throw new Error('Vehicle type cannot be updated due to existing dependencies.');
        }
    }        

    async deleteVehicleType(id) {
        if (await this.canManipulateVehicleType(id)) {
            const query = `DELETE FROM VehicleTypes WHERE VehicleTypeId = ?`;
            await this.client.query(query, {
                replacements: [id],
                type: QueryTypes.DELETE
            });
        } else {
            throw new Error('Vehicle type cannot be deleted due to existing dependencies.');
        }
    } 
}

module.exports = TypeService;