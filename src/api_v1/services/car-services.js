import prisma from "../../../prisma-client.js";
import { unavailableCarsInThatPeriod } from "./rented-car-services.js";

import getImageURL from "../server.js"; 

async function add_image_reference_to_the_returned_car_obj(carArr) {
    const editedArrOfCar = await Promise.all(carArr.map(async (ele) => {
        if (ele.img_url) {
            // console.log("we are in " + ele.brand + "it's image url" + ele.img_url);
            ele.img_url = await getImageURL(ele.img_url);
        }
        // console.log("returend ele will be", ele)
        return ele;
    }))
    return editedArrOfCar;
}

// get car data
export const getCarObj = async (id) => {
    const carByid = await prisma.car.findFirst({
        where: {
            car_id: {
                equals: id,
            }
        }
    });
    const editedArrOfCar = await add_image_reference_to_the_returned_car_obj([carByid]);
    return editedArrOfCar[0];
}

//get all cars
const selectAllCarsWithRentalInfo = await prisma.car.findMany({
    include: {
        CARS_IN_RENT: {
            select: {
                rental_date: true,
                return_date: true,
            },
            distinct: ['car_id'],
            orderBy: {
                rental_date: 'asc',
            },
            where: {
                return_date: {
                    gt: new Date()
                },
            }
        }
    }
});
export const getAllAvailableCars = async () => {
    // allCarsWithRentInfos will be { key: val, key: val, key: val, key: [] }
    console.log("from DB", selectAllCarsWithRentalInfo);
    const flattenedCars = selectAllCarsWithRentalInfo.map(car => {
        const { CARS_IN_RENT, ...rest } = car;
        const rentInfo = CARS_IN_RENT.length > 0 ? CARS_IN_RENT[0] : { rental_date: null, return_date: null };
        return {
            ...rest,
            rental_date: rentInfo.rental_date,
            return_date: rentInfo.return_date,
        };
    });
    const editedArrOfCar = await add_image_reference_to_the_returned_car_obj(flattenedCars);
    return editedArrOfCar;
}

// get available brands in the date given by the user
export const getbrands = async (rental_date_given, return_date_given) => {
    const arr = await unavailableCarsInThatPeriod(rental_date_given, return_date_given);
    const uniqueBrands = await prisma.car.groupBy({
        by: ['brand'],
        where: {
            car_id: {
                notIn: arr.map((ele) => ele.car_id)
            }
        }
    });
    const editedArrOfCar = await add_image_reference_to_the_returned_car_obj(uniqueBrands);
    return { brand: editedArrOfCar.map(ele => ele.brand) };
}

// get available types in the date given by the user and with the choosed model
export const getTypes = async (rental_date_given, return_date_given, choosedBrand) => {
    const arr = await unavailableCarsInThatPeriod(rental_date_given, return_date_given);
    const uniqueTypes = await prisma.car.groupBy({
        by: ['type'],
        where: {
            car_id: {
                notIn: arr.map((ele) => ele.car_id),
            },
            brand: {
                equals: choosedBrand
            }
        }
    });
    const editedArrOfCar = await add_image_reference_to_the_returned_car_obj(uniqueTypes);
    return { type: editedArrOfCar.map(ele => ele.type) };
}

// get all available cars following the user prefrences
export const getAllAvailableCarsUserPrefrences = async (rental_date_given, return_date_given, brand_choosed, type_choosed) => {
    const arr = await unavailableCarsInThatPeriod(rental_date_given, return_date_given);
    const userPrefrencesCars = await prisma.car.findMany({
        where: {
            brand: brand_choosed,
            type: type_choosed,
            car_id: {
                notIn: arr.map((ele) => ele.car_id)
            }
        }
    });
    const editedArrOfCar = await add_image_reference_to_the_returned_car_obj(userPrefrencesCars);
    console.log("ADEL ARRAYS !!!", editedArrOfCar);
    return editedArrOfCar;
}

// get cars number
export const countAllCars = async () =>  {
    const carsNB = await prisma.car.count();
    return carsNB;
}

// most 3 less used cars
export const newstCars = async () => {
    const lessThreeUsedCars = await prisma.car.findMany({
        take: 3,
        orderBy: { distance: "asc" },
    });
    const editedArrOfCar = await add_image_reference_to_the_returned_car_obj(lessThreeUsedCars);
    return editedArrOfCar;
}
