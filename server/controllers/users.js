import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        // Make Multiple API's to the database
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath, twitterId, linkedinId, instagramId }) => {
                return { _id, firstName, lastName, occupation, location, picturePath, twitterId, linkedinId, instagramId };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath, twitterId, linkedinId, instagramId }) => {
                return { _id, firstName, lastName, occupation, location, picturePath, twitterId, linkedinId, instagramId };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};


export const updateProfile = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            location,
            occupation,
            twitterId,
            linkedinId,
            instagramId,
            picturePath,
        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                picturePath: picturePath,
                location: location,
                occupation: occupation,
                twitterId: twitterId,
                linkedinId: linkedinId,
                instagramId: instagramId,
            },
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};