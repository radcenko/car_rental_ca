async function rentVehicle(userId, vehicleId) {
    let rentalStartDate, rentalEndDate;
    const dateFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    let validDates = false;

    while (!validDates) {
        rentalStartDate = prompt("Please provide starting date in format YYYY-MM-DD HH:MM:SS");
        rentalEndDate = prompt("Please provide ending date in format YYYY-MM-DD HH:MM:SS");

        // Check for cancellation
        if (rentalStartDate === null || rentalEndDate === null) {
            alert("Rental process cancelled.");
            return; // Exit the function
        }

        if (!dateFormat.test(rentalStartDate) || !dateFormat.test(rentalEndDate)) {
            alert("Invalid date format. Please use YYYY-MM-DD HH:MM:SS");
            continue;
        }

        const start = new Date(rentalStartDate);
        const end = new Date(rentalEndDate);
        const now = new Date();

        if (start < now) {
            alert("Start date cannot be in the past.");
            continue;
        }

        if (end <= start) {
            alert("End date must be after the start date.");
            continue;
        }

        validDates = true;
    }

    try {
        const response = await fetch('/vehicles', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                vehicleId: vehicleId,
                rentalStartDate: rentalStartDate,
                rentalEndDate: rentalEndDate 
            })
        });

        if (response.ok) {
            alert("Made reservation successfully.");
        } else {
            const errorData = await response.json(); 
            alert(errorData.message || "Unable to rent vehicle.");
        }
    } catch (error) {
        alert("Network error or issue with the request.");
    } finally {
        location.reload();
    }
}

async function cancelRental(vehicleId) {
    if (!confirm("Are you sure you want to cancel this rental?")) {
        return;
    }

    try {
        const response = await fetch(`/vehicles/cancel/${vehicleId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Rental cancelled successfully.");
        } else {
            alert("Unable to cancel rental.");
        }
    } catch (error) {
        alert("Error occurred while cancelling rental.");
    } finally {
        location.reload();
    }
}

function sqlQuery1() { // Popular vehicles
    window.location.href = '/vehicles/?sort=popular';
}

// Vehicles requiring service - admin only, error handling with user friendly message for others
async function sqlQuery2() {
    try {
        const response = await fetch('/vehicles/?sort=serviceable');
        // Check if the response is not OK
        if (!response.ok) {
            // Check if the response is JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            } else {
                // Handle non-JSON responses
                throw new Error("You are not authorized to access this page. Only for Admin!");
            }
        }
        // Handle successful response here
        window.location.href = '/vehicles/?sort=serviceable';
    } catch (error) {
        // Display error message in an alert
        alert(error.message);
    }
}

function sqlQuery3() { // Cruise Control
    window.location.href = '/vehicles/?sort=cruiseControl';
}

function sqlQuery4() { // Currently Rented Vehicles
    window.location.href = '/vehicles/?sort=rented';
    
}

function allVehicles() { // Complete list of vehicles
    window.location.href = '/vehicles';
}

async function updateColour(id) {
    let newColour = prompt("Enter new colour name:");
    if (newColour) {
        try {
            const response = await fetch('/colours/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, newColour })
            });

            if (response.ok) {
                alert("Colour updated successfully.");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Unable to update colour.");
            }
        } catch (error) {
            alert("Network error or issue with the request.");
        } finally {
            location.reload();
        }
    }
}

async function deleteColour(id) {
    if (confirm("Are you sure you want to delete this colour?")) {
        try {
            const response = await fetch('/colours/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id }) // Ensure id is correctly sent
            });

            if (response.ok) {
                alert("Colour deleted successfully.");
                location.reload();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Unable to delete colour.");
            }
        } catch (error) {
            alert("Network error or issue with the request.");
        }
    }
}

async function updateType(typeId) {
    var newTypeName = prompt("Enter new type name:");
    if (newTypeName) {
        try {
            const response = await fetch('/types/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    typeId: typeId,
                    newName: newTypeName
                })
            });

            if (response.ok) {
                alert("Vehicle type updated successfully.");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Unable to update vehicle type.");
            }
        } catch (error) {
            alert("Network error or issue with the request.");
        } finally {
            location.reload();
        }
    }
}

function deleteType(id) {
    if (confirm("Are you sure you want to delete this vehicle type?")) {
        fetch('/types/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ typeId: id })
        })
        .then(response => {
            if (response.ok) {
                alert("Vehicle type deleted successfully.");
                location.reload(); 
            } else {
                alert("Error deleting vehicle type.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error deleting vehicle type.");
        });
    }
}