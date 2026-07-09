import request from '../utils/request'

// 1. 获取全部聊天室
export function getChatRoomList() {
  return request.get('/ai_lst/chatroom/list')
}

// 2. 根据房间id获取群成员
export function getRoomMembers(roomId: number) {
  return request.get(`/ai_lst/chatroom/${roomId}/members`)
}

// 3. 获取房间历史消息
export function getRoomMessageList(roomId: number) {
  return request.get(`/ai_lst/chatroom/message/list?roomId=${roomId}`)
}

// 4. 发送消息
export function sendChatMessage(data: { roomId: number; content: string }) {
  return request.post('/ai_lst/chatroom/message/send', data)
}