const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

let code;
let currentUser;

function sendEmail(req, res) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SERVICE_EMAIL,
        pass: process.env.SERVICE_PASSWORD,
      },
    });

    code = Math.floor(Math.random() * 899999 + 100000);

    const mailOptions = {
      from: process.env.SERVICE_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Code for login to  admin panel',
      text: `${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email successfully sent');
      }
    });
  } catch (e) {
    res.status(500).json({ succes: false });
    console.log(e);
  }
}

class AdminController {
  async registration(req, res) {
    try {
      const { email, password, role } = req.body;
      const condidate = await User.findOne({ where: { email } });
      if (condidate) {
        return res.status(500).json({ succes: false });
      }
      const passwordHash = await bcrypt.hash(password, 5);
      const user = await User.create({ email, password: passwordHash, role });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        {
          expiresIn: '240h',
        },
      );
      res.send(token);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      currentUser = await User.findOne({ where: { email } });
      if (!currentUser) {
        return res.status(500).json({ succes: false });
      }
      const comparePassword = bcrypt.compareSync(password, currentUser.password);
      if (!comparePassword) {
        return res.status(500).json({ succes: false });
      }
      sendEmail(req, res);
      return res.json({ waitingForCode: true });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async authMe(req, res) {
    try {
      const user = req.user;
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        {
          expiresIn: '240h',
        },
      );
      res.send(token);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async checkCode(req, res) {
    try {
      const { numbers } = req.body;
      if (+numbers === +code) {
        const token = jwt.sign(
          { id: currentUser.id, email: currentUser.email, role: currentUser.role },
          process.env.SECRET_KEY,
          {
            expiresIn: '240h',
          },
        );
        return res.send(token);
      }
      return res.status(500).json({ succes: false });
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new AdminController();
