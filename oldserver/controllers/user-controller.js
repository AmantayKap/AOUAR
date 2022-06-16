const userService = require('../service/user-service')
const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const Post = require("../models/post_model");
const router = require("express").Router();

class UserController{
    async registration(req, res, next){
        try{
            const {username, email, password} = req.body;
            const userData = await userService.registration(username, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }
    async login(req, res, next){
        try{
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }
    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e){
            next(e);
        }
    }

    async refresh(req, res, next){
        try{
            const {refreshToken} = req.cookie;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch(e){
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users);
        } catch (e){
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res){
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                } catch (err) {
                    return res.status(500).json(err);
                }
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                });
                res.status(200).json("Account has been updated");
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(403).json("You can update only your account!");
        }
    }

    async delete(req, res){
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            try {
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("Account has been deleted");
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(403).json("You can delete only your account!");
        }
    }

    async getUser(req, res){
        const userId = req.query.userId;
        const username = req.query.username;
        try {
            const user = userId
                ? await User.findById(userId)
                : await User.findOne({ username: username });
            const { password, updatedAt, ...other } = user._doc;
            res.status(200).json(other);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getFriends(req, res){
        try {
            const user = await User.findById(req.params.userId);
            const friends = await Promise.all(
                user.followings.map((friendId) => {
                    return User.findById(friendId);
                })
            );
            let friendList = [];
            friends.map((friend) => {
                const { _id, username, profilePicture } = friend;
                friendList.push({ _id, username, profilePicture });
            });
            res.status(200).json(friendList)
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async follow(req, res){
        if (req.body.userId !== req.params.id) {
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userId);
                if (!user.followers.includes(req.body.userId)) {
                    await user.updateOne({ $push: { followers: req.body.userId } });
                    await currentUser.updateOne({ $push: { followings: req.params.id } });
                    res.status(200).json("user has been followed");
                } else {
                    res.status(403).json("you already follow this user");
                }
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(403).json("you cant follow yourself");
        }
    }

    async unfollow(req, res){
        if (req.body.userId !== req.params.id) {
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userId);
                if (user.followers.includes(req.body.userId)) {
                    await user.updateOne({ $pull: { followers: req.body.userId } });
                    await currentUser.updateOne({ $pull: { followings: req.params.id } });
                    res.status(200).json("user has been unfollowed");
                } else {
                    res.status(403).json("you dont follow this user");
                }
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(403).json("you cant unfollow yourself");
        }
    }
}


module.exports = new UserController();