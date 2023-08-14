const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
          expiresIn: '24h',
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
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(500).json({ succes: false });
      }
      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return res.status(500).json({ succes: false });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        {
          expiresIn: '24h',
        },
      );
      res.send(token);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }

  async check(req, res) {
    try {
      const user = req.user;
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        {
          expiresIn: '24h',
        },
      );
      res.send(token);
    } catch (e) {
      res.status(500).json({ succes: false });
      console.log(e);
    }
  }
}

module.exports = new AdminController();
