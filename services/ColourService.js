const { QueryTypes } = require('sequelize');

class ColourService {
    constructor(db) {
        this.client = db.sequelize;
    }
    async getAllVehicleColours() {
        const query = `SELECT ColourId as Id, Name FROM Colours ORDER BY ColourId;`;
        try {
            const colours = await this.client.query(query, {
                type: QueryTypes.SELECT
            });
            return colours;
        } catch (error) {
            console.error('Error fetching vehicle types:', error);
            throw error;
        }
    }
    
    async addVehicleColour(name) {
        const query = `INSERT INTO Colours (Name) VALUES (?)`;
        await this.client.query(query, {
            replacements: [name],
            type: QueryTypes.INSERT
        });
    }   
    
    async canManipulateVehicleColour(id) {
        const query = `SELECT COUNT(*) AS count FROM Vehicles WHERE ColourId = ?`;
        const result = await this.client.query(query, {
            replacements: [id],
            type: QueryTypes.SELECT
        });
        return result[0].count === 0;
    }    

    async updateVehicleColour(id, newColour) {
        if (await this.canManipulateVehicleColour(id)) {
            const query = `UPDATE Colours SET Name = ? WHERE ColourId = ?`;
            await this.client.query(query, {
                replacements: [newColour, id], 
                type: QueryTypes.UPDATE
            });
        } else {
            throw new Error('Colour cannot be updated due to existing dependencies.');
        }
    }
    
    async deleteVehicleColour(id) {
        if (await this.canManipulateVehicleColour(id)) {
            const query = `DELETE FROM Colours WHERE ColourId = ?`;
            await this.client.query(query, {
                replacements: [id],
                type: QueryTypes.DELETE
            });
        } else {
            throw new Error('Colour cannot be deleted due to existing dependencies.');
        }
    }    
}

module.exports = ColourService;