import prisma from "../../../prisma-client.js";
import AppError from "../utils/app-error.js";


export const unavailableCarsInThatPeriod = async (rental_date_given, return_date_given) => {
    const unavailableCarsList = await prisma.cARS_IN_RENT.findMany({
        where: {
            NOT: {
                OR: [
                    { return_date: { lt: rental_date_given } },
                    { rental_date: { gt: return_date_given } }
                ]
            }
        }
    });
    return unavailableCarsList;
}

const allCarsInRentTableByID = async (id) => {
    const arr = await prisma.cARS_IN_RENT.findMany({
        where: {
            car_id: id
        }
    })
    return arr;
}

export const rentCar = async (car_id, client_id, rental_date_given, return_date_give) => {
    console.log("in rental Car request DB!!!!");
    const arr = await allCarsInRentTableByID(car_id);

    const isConflicting = arr.some(ele => {
        return (
            (rental_date_given <= ele.return_date && rental_date_given >= ele.rental_date) ||
            (return_date_give < ele.return_date && return_date_give >= ele.rental_date) ||
            (rental_date_given <= ele.rental_date && return_date_give > ele.return_date) 
        );
    });

    if (isConflicting) {
        throw new AppError("Car is already rented for the selected dates.", 403);
    }
    await prisma.cARS_IN_RENT.create({
        data: {
            car_id: car_id,
            client_id: client_id,
            rental_date: rental_date_given,
            return_date: return_date_give,
        },
    })
}
