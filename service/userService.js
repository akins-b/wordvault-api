const prisma = require("../db");

async function createUser(data){
    try {
        const {id, email, username, firstName, lastName} = data;
        const existingUser = await prisma.user.findUnique({
            where: {id}
        });

        if(existingUser){
            throw new Error("User already exists");
        }
        
        const user = await prisma.user.create({
            data: {
                id,
                email, 
                username,
                firstName,
                lastName,
            }}
        );

        return user;
    } catch(error){
        throw error;
    }
}

async function getUserById(data){
    try {
        const user = await prisma.user.findUnique({
            where: { id: data }
        });

        if(!user){
            throw new Error("User not found");
        }

        return user;
    } catch(error){
        throw error;
    }
}

async function updateUser(data){
    try{
        const { id, ...fields } = data;
        const existingUser = await prisma.user.findUnique({
            where: {id}
        });
        if(!existingUser){
            throw new Error("User not found");
        }

        const updatedFields = Object.fromEntries(
            Object.entries(fields).filter(([_, value]) => value !== undefined)
        );

        const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: updatedFields
        });
        return updatedUser;
    }
    catch(error){
        throw error;
    }
}

async function deleteUser(data){
    try {
        const { id } = data;
        const user = await prisma.user.findUnique({
            where: {id}
        });
        if(!user){
            throw new Error("User not found");
        }

        await prisma.user.delete({
            where: {id: user.id}
        });
        return {message: "User deleted successfully"};
    } catch(error){
        throw error;
    }
}


module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser
}