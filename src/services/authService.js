const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { generateToken } = require('../utils/jwt');

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw {
      status: 400,
      message: 'Email and password are required'
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      province: true,
      district: true,
      station: true
    }
  });

  if (!user) {
    throw {
      status: 401,
      message: 'Invalid email or password'
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw {
      status: 401,
      message: 'Invalid email or password'
    };
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      province: user.province,
      district: user.district,
      station: user.station,
      createdAt: user.createdAt
    }
  };
};

module.exports = {
  loginUser
};