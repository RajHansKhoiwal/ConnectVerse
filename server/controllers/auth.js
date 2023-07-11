import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* Register User */
// async call to the mongoose database
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
            twitterId,
            linkedinId,
            instagramId
        } = req.body;

        const salt = await bcrypt.genSalt();
        /* genSalt(): This function generates a salt, which is a random string used to modify the password before hashing it. Salting adds an extra layer of security by making it more difficult to guess or crack passwords. */
        const passwordHash = await bcrypt.hash(password, salt);

        /* Register function working - save the password and when the user tries to login salt the provided password again to check if it is the correct one and then give them the json web token. */

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            twitterId,
            linkedinId,
            instagramId,
            viewedProfile: Math.floor(Math.random() * 1000), // some random value
            impressions: Math.floor(Math.random() * 1000)
        });
        const savedUser = await newUser.save();
        /* newUser.save(): It is an asynchronous operation that saves the newUser object to the database. It returns a promise that resolves to the saved user object.
        
        await: The await keyword is used to wait for the newUser.save() promise to resolve before continuing to the next line. This requires the surrounding function to be declared as async.*/

        res.status(201).json(savedUser);
        // sends the savedUser object as a JSON response to the client.

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* Logging in */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }); //Use mongoose to find the one with specified email
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password); //compared the stored password with the provided one with the same salt as before

        if (!isMatch) return res.status(400).json({ msg: "Incorrect Password." });
        /* If the password is matched then pass the json web token. */
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        delete user.password; //delete the password so it doesn't get sent back to the frontend

        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}