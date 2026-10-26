import MessageRepository from "../../DB/repositories/message.repository.js";


export const sendMessageService = async (body) => {
    const {content ,receiverId} = body;
    const messageObject = {
        content , receiverId
    }
    return await MessageRepository.createDocument(messageObject)
}

export const getMyMessagesService = async (id) => {
    const messages = await MessageRepository.findDocuments({receiverId:id})
    return messages;
}
