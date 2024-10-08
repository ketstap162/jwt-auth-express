const Joi = require('joi');
const {User} = require('../models/index')
const jwt = require('jsonwebtoken');
const {authToken, jwtSecret} = require('../utils/auth/jwt')

class authController{
    async register(req, res) {
        const schema = Joi.object({
          name: Joi.string().min(3).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
        });
      
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
      
        try {
          const { name, email, password } = req.body;
          const user = await User.create({ name, email, password });
          res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
          res.status(400).json({ error: 'Email already exists' });
        }
    };

    async login(req, res){
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        if (!user || !user.checkPassword(password)) {
          return res.status(400).json({ error: 'Invalid email or password' });
        }

        const accessToken = jwt.sign({ user }, jwtSecret, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ user }, jwtSecret, { expiresIn: '1d' });

        res.status(200).json({
            access: accessToken,
            refresh: refreshToken,
        });      
    };

    async profile(req, res){       
        const accessToken = req.header('Authorization')?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ message: 'Access Denied: No token provided' });
        };

        const decoded = jwt.verify(accessToken, jwtSecret);

        return res.status(200).json(decoded.user);
    };

    async updatePassword(req, res){
        const schema = Joi.object({
            oldPassword: Joi.string().min(6).required(),
            newPassword: Joi.string().min(6).required(),
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const accessToken = req.header('Authorization')?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ message: 'Access Denied: No token provided' });
        };

        const decoded = jwt.verify(accessToken, jwtSecret);
        
        const { oldPassword, newPassword } = req.body;

        console.log("old:", oldPassword);
        console.log("new:", newPassword);

        console.log("decoded", decoded.user.id)

        const user = await User.findByPk(decoded.user.id);

        console.log("user", user.id);

        
        if (!user.checkPassword(oldPassword)) {
            return res.status(400).json({ error: 'Invalid old password' });
        }

        try{
            user.password = newPassword;
            await user.save();
            return res.json({ message: 'Password updated successfully' });
        } catch (error){
            console.log(error);
            return res.status(400).json({ 
                error: 'Password changing error',
                message: error,
            });
        };        
    };

    async getUsers(req, res){
        try {
            const users = await User.findAll();
            return res.json(users);
          } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
    };

    async refresh(req, res){
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
          return res.status(401).send('Access Denied. No refresh token provided.');
        }
      
        try {
          const decoded = jwt.verify(refreshToken, jwtSecret);
          const accessToken = jwt.sign({ user: decoded.user }, jwtSecret, { expiresIn: '1h' });
      
          res.status(200).json({
            access: accessToken,
            });  
        } catch (error) {
          return res.status(400).send('Invalid refresh token.');
        }
      }
};

module.exports = new authController();
