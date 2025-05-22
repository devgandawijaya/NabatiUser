const { Op } = require('sequelize');
const Users = require("../models/user");
const UserTokens = require("../models/user_token");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'rahasia123';

class UserViewModel {

  async registerUser(users) {
    const { name, email, phone, password } = users;

    try {
      if (!name && !email && !phone && !password) {
        throw new Error('Email/phone atau password wajib diisi');
      }

      const existingUser = await Users.findOne({
        where: {
          [Op.or]: [
            { email: email || null },
            { phone: phone || null }
          ]
        }
      });

      if (existingUser) {
        throw new Error('Email atau phone sudah terdaftar');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await Users.create({
        name,
        email,
        phone,
        password: hashedPassword
      });

      return { status: true, message: 'Registrasi berhasil' };
    } catch (error) {
      return { status: false, message: error.message };
    }
  }

  async loginUsers(users) {
    const { login, password } = users;

    try {
      const user = await Users.findOne({
        where: {
          [Op.or]: [
            { email: login },
            { phone: login }
          ]
        }
      });

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Password salah');
      }

     
      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' });

      const expiredDate = new Date();
      expiredDate.setMonth(expiredDate.getMonth() + 1);

      await UserTokens.create({
        user_id: user.id,
        token: token,
        expired_at: expiredDate
      });
      

      return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          token,
          expired_token: expiredDate 
      };

    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null
      };
    }
  }

}

module.exports = new UserViewModel();
