import { User } from './../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';
import { Post } from '../models/Post.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: `User already exits under ${email}!`,
                success: false,
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        })

    } catch (error) {
        console.log("🚀 ~ register ~ error:", error)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts
        }

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}!`,
            success: true,
            user
        });

    } catch (error) {
        console.log("🚀 ~ login ~ error:", error)
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully,',
            success: true
        })
    } catch (error) {
        console.log("🚀 ~ logout ~ error:", error)
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log("🚀 ~ getProfile ~ error:", error)
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture)
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
                success: false
            })
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        })

    } catch (error) {
        console.log("🚀 ~ editProfile ~ error:", error)
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently no users available.',
            })
        };
        return res.status(400).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log("🚀 ~ getSuggestedUser ~ error:", error)
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const followKarneWala = req.id; // Me
        const jiskoFollowKarunga = req.params.id // person whom i follow
        if (followKarneWala === jiskoFollowKarunga) {
            return res.status(400).json({
                message: "you cannot follow/unfollow yourself",
                success: false
            });
        }

        const user = await User.findById(followKarneWala);
        const targetUser = await User.findById(jiskoFollowKarunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        // to check rather i have to follow or unfollow
        const isFollowing = user.following.includes(jiskoFollowKarunga);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $pull: { following: jiskoFollowKarunga } }),
                User.updateOne({ _id: jiskoFollowKarunga }, { $pull: { followers: followKarneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $push: { following: jiskoFollowKarunga } }),
                User.updateOne({ _id: jiskoFollowKarunga }, { $push: { followers: followKarneWala } }),
            ])
            return res.status(200).json({ message: 'Followed successfully', success: true });
        }
    } catch (error) {
        console.log("🚀 ~ followOrUnfollow ~ error:", error)
    }
}