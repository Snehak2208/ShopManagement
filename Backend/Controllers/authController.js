import jwt  from 'jsonwebtoken';
import User from '../Models/userModel.js';
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
    try {
        const { email, password, role = 'shopkeeper' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ status:false,message: 'User already exists' });
        }

        // Validate role
        if (role && !['shopkeeper', 'customer'].includes(role)) {
            return res.status(400).json({ status:false,message: 'Invalid role. Must be shopkeeper or customer' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();

        console.log('User registered successfully:', { email, role: newUser.role });
        res.status(200).json({ status:true,message: 'User registered successfully', role: newUser.role });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ status:false,message: 'Server error' });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt for email:', email);

        // Check if JWT_SECRET is set
        if (!process.env.JWT_SECRET_KEY) {
            console.error('JWT_SECRET_KEY is not set in environment variables');
            return res.status(500).json({ status:false,message: 'Server configuration error' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ status:false,message: 'Invalid email or password' });
        }

        console.log('User found:', { email: user.email, role: user.role });

        // Compare the passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log('Password mismatch for email:', email);
            return res.status(404).json({ status:false,message: 'Invalid email or password' });
        }

        console.log('Password matched for user:', email);

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Set the token as a cookie
        let options = {
            maxAge: 1000 * 60 * 15, // would expire after 15 minutes
            httpOnly: false, // The cookie only accessible by the web server
            signed: false // Indicates if the cookie should be signed
        }
        
        res.cookie('token', token);
        console.log('Login successful for user:', email);
        res.status(200).json({ status:true,message: 'Login successful', role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status:false,message: 'Server error' });
    }
};

export const logoutController = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ status:true,message: 'Logged out successfully' });
};

export const getUserController = async(req, res) => {
    try {
        // get user
        const user = await User.findOne({ _id:req.user.userId });
        if (!user){ return res.status(404).json({ status:false, message: "unauthorized user",error })};

        const { email, role, products, sales } = user;
return res.status(200).json({ status:true, data: { email, role, products, sales } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status:false,message: 'Server error' });
    }
};
