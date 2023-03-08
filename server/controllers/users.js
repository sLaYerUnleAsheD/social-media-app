import User from "../models/User.js";

// READ

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (err) {
        req.status(404).json( {message: err.message} );
    }
}

export const getUserFriends = async (req, res) => {

    try {
        const { id } = req.params;
        const user = await User.findById(id);

        // we use Promise.all() because we are gonna
        // make multiple api calls to our DB
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }  
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        req.status(404).json( {message: err.message} );
    }
}

// UPDATE

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            // below in `id !== id` the first id is the parameter in the arrow function
            // and the second one is the `id` that we grabbed from req.params object via
            // object destructuring, so we are basically filtering friend list
            // of the person whom we removed from users friend list so that the user is
            // present in that persons friend list as well
            friend.friends = friend.friends.filter((id) => id !== id);

        } else {
            // if person was in friend list of user
            // then on tapping the button we must remove them
            // but if they were not present in the friend list then
            // simply add both in each others friend list
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }  
        );
        
        res.status(200).json(formattedFriends);

    } catch (err) {
        req.status(404).json( {message: err.message} );
    }
}