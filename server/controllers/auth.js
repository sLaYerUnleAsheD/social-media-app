// encrypt users passwords
import bcrypt from 'bcrypt';
// give user a webtoken which they can use to authorize
// themselves
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTER USER

export const register = async (req, res) => {
    try {
        // destructuring parameters from body of request object
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body
        
        // generate a salt to encrypt our password with
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // flow: when user registers and enters the password
        // we are gonna grab that password by tapping into the request body
        // generate a salt and hash it with that salt and save it in `passwordHash`
        // when user again tries to login we will take the password that they write
        // hash it with the salt again and compare the two, if they match we give them
        // a webtoken using which they can view pages intended for authorized users only

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        const savedUser = await newUser.save();
        // send a status code 201 to imply that we "created" the new user
        // then create json version of savedUser which we send back to frontend
        res.status(201).json(savedUser);
    } catch(err) {
        // send status code of 500 indicating internal server error
        // send json of whatever error message MongoDB gives
        res.status(500).json({ error: err.message });
    }
}

// LOGGING IN

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json( { msg: "User does not exist."} );

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json( { msg: "Invalid credentials"} );

        const token = jwt.sign( { id: user._id }, process.env.JWT_SECRET );
        delete user.password;
        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}