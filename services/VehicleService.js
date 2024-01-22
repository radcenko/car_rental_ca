const { QueryTypes } = require('sequelize');

class VehicleService {
    constructor(db) {
        this.client = db.sequelize;
    }

    async getAllVehicles(extraConditions = '', extraJoins = '', extraSelects = '', orderBy = 'v.Id ASC') {
        const query = `
        SELECT 
            v.Id, 
            v.RegistrationNo, 
            m.Name as Make, 
            mo.Name as Model, 
            c.Name as Colour, 
            vt.Name as VehicleType, 
            DATE_FORMAT(v.LastServiceDate, '%Y-%m-%d') as LastServiceDate, 
            CASE WHEN v.Rented = 1 THEN 'True' ELSE 'False' END AS Rented,
            CASE WHEN DATEDIFF(CURRENT_DATE, v.LastServiceDate) > 180 THEN 'True' ELSE 'False' END AS Serviceable,
            GROUP_CONCAT(f.Name SEPARATOR '<br>') AS Features
            ${extraSelects}
        FROM 
            vehicles v
            JOIN makes m ON v.MakeId = m.MakeId
            JOIN models mo ON v.ModelId = mo.ModelId
            JOIN colours c ON v.ColourId = c.ColourId
            JOIN vehicletypes vt ON v.VehicleTypeId = vt.VehicleTypeId
            LEFT JOIN vehicle_features vf ON v.Id = vf.VehicleId
            LEFT JOIN features f ON vf.FeatureId = f.FeatureId
            ${extraJoins}
        WHERE 1 = 1
            ${extraConditions}
        GROUP BY v.Id
        ORDER BY ${orderBy};
        `;

        try {
            return await this.client.query(query, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error('Error executing vehicle query:', error);
            throw error;
        }
    }

    async getPopularVehicleTypes() {
        const extraSelects = `, COUNT(r.VehicleId) as RentalCount`;
        const extraJoins = `LEFT JOIN rentals r ON v.Id = r.VehicleId`;
        return this.getAllVehicles('', extraJoins, extraSelects, 'RentalCount DESC, v.Id ASC');
    }

    async getCurrentlyRentedVehicles() {
        const extraConditions = `AND r.RentalEndDate > CURRENT_TIMESTAMP`;
        const extraJoins = `JOIN rentals r ON v.Id = r.VehicleId JOIN users u ON r.UserId = u.Id`;
        const extraSelects = `, MAX(u.FullName) as CustomerName`;
        return this.getAllVehicles(extraConditions, extraJoins, extraSelects);
    }

    async getVehiclesRequiringService() {
        const extraConditions = `AND DATEDIFF(CURRENT_DATE, v.LastServiceDate) > 180`;
        return this.getAllVehicles(extraConditions);
    }

    async getVehiclesWithCruiseControl() {
        const extraJoins = `JOIN vehicle_features vf_cc ON v.Id = vf_cc.VehicleId 
            JOIN features f_cc ON vf_cc.FeatureId = f_cc.FeatureId AND f_cc.Name = 'Cruise Control'`;
        return this.getAllVehicles('', extraJoins);
    }

    async rentVehicle(userId, vehicleId, rentalStartDate, rentalEndDate) {
        const t = await this.client.transaction(); // Start a transaction

        try {
            // Check if the user already has an active rental
            const userRentalCheckQuery = `
            SELECT COUNT(*) AS count
            FROM Rentals
            WHERE UserId = ?
            AND (RentalEndDate > CURRENT_TIMESTAMP OR RentalEndDate IS NULL);
            `;
            const userRentalCheckResult = await this.client.query(userRentalCheckQuery, {
                replacements: [userId],
                type: QueryTypes.SELECT,
                transaction: t
            });

            if (userRentalCheckResult[0].count > 0) {
                throw new Error('You already have an active rental');
            }

            // Check if the vehicle is currently rented by any customer
            const vehicleRentalCheckQuery = `
                SELECT COUNT(*) AS count
                FROM Rentals
                WHERE VehicleId = ?
                AND (RentalEndDate > CURRENT_TIMESTAMP);
            `;
            const vehicleRentalCheckResult = await this.client.query(vehicleRentalCheckQuery, {
                replacements: [vehicleId],
                type: QueryTypes.SELECT,
                transaction: t
            });

            if (vehicleRentalCheckResult[0].count > 0) {
                throw new Error('This vehicle is currently rented by another customer');
            }

            // Check if the vehicle needs service
            const serviceCheckQuery = `
            SELECT CASE 
                    WHEN DATEDIFF(CURRENT_DATE, LastServiceDate) > 180 THEN 'True'
                    ELSE 'False'
                END AS Serviceable
            FROM vehicles
            WHERE Id = ?;
            `;
            const serviceCheckResult = await this.client.query(serviceCheckQuery, {
                replacements: [vehicleId],
                type: QueryTypes.SELECT,
                transaction: t
            });

            if (serviceCheckResult[0].Serviceable === 'True') {
                throw new Error('This vehicle needs service and cannot be rented');
            }

            // Proceed with creating the rental
            const rentalInsertQuery = `
                INSERT INTO Rentals (UserId, VehicleId, RentalStartDate, RentalEndDate)
                VALUES (?, ?, ?, ?);
            `;
            await this.client.query(rentalInsertQuery, {
                replacements: [userId, vehicleId, rentalStartDate, rentalEndDate],
                type: QueryTypes.INSERT,
                transaction: t
            });

            // Update Vehicles table
            const vehicleUpdateQuery = `
                UPDATE Vehicles
                SET Rented = 1
                WHERE Id = ?;
            `;
            await this.client.query(vehicleUpdateQuery, {
                replacements: [vehicleId],
                type: QueryTypes.UPDATE,
                transaction: t
            });

            await t.commit(); // Commit the transaction
        } catch (error) {
            await t.rollback(); // Rollback the transaction in case of error
            console.error('Error in renting vehicle:', error);
            throw error;
        }
    }

    async cancelRental(vehicleId) {
        const t = await this.client.transaction(); // Start a transaction
    
        try {
            // Step 1: Delete the rental record
            const rentalDeleteQuery = `
                DELETE FROM Rentals
                WHERE VehicleId = ? AND RentalEndDate > CURRENT_TIMESTAMP;
            `;
            await this.client.query(rentalDeleteQuery, {
                replacements: [vehicleId],
                type: QueryTypes.DELETE,
                transaction: t
            });
    
            // Step 2: Update the 'Rented' status of the vehicle
            const vehicleUpdateQuery = `
                UPDATE Vehicles
                SET Rented = 0
                WHERE Id = ?;
            `;
            await this.client.query(vehicleUpdateQuery, {
                replacements: [vehicleId],
                type: QueryTypes.UPDATE,
                transaction: t
            });
    
            await t.commit(); // Commit the transaction if both operations succeed
        } catch (error) {
            await t.rollback(); // Rollback the transaction in case of any error
            console.error('Error cancelling rental:', error);
            throw error;
        }
    }   
}

module.exports = VehicleService;