import Post from '../models/Post.js';
import User from '../models/User.js';


// CREATE

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });

        await newPost.save();

        // below line of code is not grabbing the newly
        // saved post, instead after saving we need to
        // return all the posts to the front end
        // so we pass nothing to Post.find() function
        // which basically will give us all documents of Post collection
        const post = await Post.find();
        res.status(201).json(post);

    } catch (err) {
        // code: 409 is conflict with current state of resource
        res.status(409).json( { message: err.message } );
    }
}

// READ

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json( { message: err.message } );
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        // find all posts posted by a user by passing
        // userId which was grabbed from request params
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json( { message: err.message } );
    }
}

// UPDATE

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        // below we check if the userId in the likes object
        // exists, if it exists then it has been liked
        const isLiked = post.likes.get(userId);

        if(isLiked) {
            // if we tap on heart which is already liked
            // it should be unliked so we remove the userId
            // from the likes object for that purpose
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        // update the post by finding the post by passing id and
        // updating it by sending updated `likes` object
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json( { message: err.message } );
    }
}