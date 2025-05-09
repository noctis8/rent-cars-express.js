import prisma from "../../../prisma-client.js";

export const userById = async (id) => {
    const user = await prisma.client.findUnique({
        where: {
            user_id: id
        },
    })
    return user;
} 

export const userByEmail = async (email) => {
    const user = await prisma.client.findUnique({
        where: {
            email: email
        },
    })
    return user;
} 

export const countAllClients = async () =>  {
    const clientNB = await prisma.client.count();
    return clientNB;
}

export const refreshRefreshTokenDB = async (email, refreshToken) => {
    console.log("update the refresh token in the DB")
    const update = await prisma.client.update({
        where: {
            email: email,
        },
        data: {
            refresh_token: refreshToken,
        }
    });
    return update;
}
