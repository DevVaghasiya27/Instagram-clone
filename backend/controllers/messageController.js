import { Conversation } from './../models/Conversation.js';
import { Message } from './../models/Message.js';

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            particular: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })
        if (newMessage) conversation.message.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()])

        // implement Socket io for real time transfer

        return res.status(201).json({
            success: true,
            newMessage
        })

    } catch (error) {
        console.log("🚀 ~ sendMessage ~ error:", error)
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.find({
            participants: { $all: [senderId, receiverId] }
        });
        if (!conversation) return res.status(200).json({ success: true, message: [] });

        return res.status(200).json({ success: true, message: conversation?.message });

    } catch (error) {
        console.log("🚀 ~ getMessage ~ error:", error)
    }
}