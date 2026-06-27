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

async function getStats(userId) {
  const totalWords = await prisma.entry.count({ where: { userId } });
  const mastered = await prisma.entry.count({ where: { userId, mastered: true } });

  const entries = await prisma.entry.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' }
  });

  const streak = calculateWeeklyStreak(entries);

  return { totalWords, mastered, streak };
}

function calculateWeeklyStreak(entries) {
  if (entries.length === 0) return 0;

  const weeks = new Set(
    entries.map(e => {
      const date = new Date(e.createdAt);
      const year = date.getFullYear();
      const week = getWeekNumber(date);
      return `${year}-${week}`;
    })
  );

  const sortedWeeks = [...weeks].sort().reverse();
  const currentWeek = `${new Date().getFullYear()}-${getWeekNumber(new Date())}`;

  if (sortedWeeks[0] !== currentWeek) {
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    const lastWeek = `${lastWeekDate.getFullYear()}-${getWeekNumber(lastWeekDate)}`;
    if (sortedWeeks[0] !== lastWeek) return 0;
  }

  let streak = 1;
  for (let i = 0; i < sortedWeeks.length - 1; i++) {
    const [year1, week1] = sortedWeeks[i].split('-').map(Number);
    const [year2, week2] = sortedWeeks[i + 1].split('-').map(Number);
    const diff = (year1 * 52 + week1) - (year2 * 52 + week2);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}


module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getStats
}