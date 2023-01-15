import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try{
        const { id } = req.params
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch(error){
        res.status(404).json({error: error.message})
    }
}

export const getUserFriends = async (req, res) => {
    try{
        const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
        user.friends.map( ( id ) => {
            User.findById(id);
        })
    )
    const formattedFriends = friends.map(
        ({_id, firstName, lastName, occupation, location, picturePath}) => {
            return {_id, firstName, lastName, occupation, location, picturePath};
        }
    )
    res.status(200.).json(formattedFriends);
    } catch(error) {
        res.status(404).json({error:error.message});
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try{
        const { id, friendId } = req.params;
        const user = await User.findById(id) // grab the current user;
        const friend = await User.findById(friendId) // grab the friend's information

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter( (id) => id !== friend.id);
            friend.friends = friend.friends.filter( (id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save(); await friend.save();

        // we sent the updated friend array to the frontend
        const friends = await Promise.all(
            user.friends.map( ( id ) => {
                User.findById(id);
            })
        )
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        )
        res.satus(200).json(formattedFriends);
    } catch(error) {
        res.status(404).json({error: error.message});
    }
}