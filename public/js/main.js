const socket = io()
const infotArea = document.getElementById("info")
const form = document.getElementById("chat-form")
const messageArea = document.getElementById("message-area")
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username')
const room = urlParams.get('room')

socket.emit("joinRoom", {username, room});

socket.on("joinRoom", join =>{
    addAlert(`${join.username} join the room at ${join.time}`);
})
socket.on("message", message => {
    addAlert(message);
})
socket.on("chat", message => {
    addMessage(message);
})

const addAlert = (alert) =>{
    const newDivAlert = document.createElement("div");
    newDivAlert.classList.add("alert");
    newDivAlert.innerText = alert;
    infotArea.appendChild(newDivAlert);
}

form.addEventListener('submit', (e) =>{
    e.preventDefault()
    const msg = e.target.message.value;
    if(!msg) return
    socket.emit('chat', {msg:msg, username:username, room: room});
    e.target.message.value = '';
})

const addMessage = msg =>{
    const newMessageDiv = document.createElement("div");
    const newMessageInfoDiv = document.createElement("div");
    const newMessageBody = document.createElement("div");
    newMessageBody.innerText = msg.body;
    const newMessageUsername = document.createElement("span");
    newMessageUsername.innerText = msg.username;
    const newMessageTime = document.createElement("span");
    newMessageTime.innerText = msg.time;
    newMessageInfoDiv.appendChild(newMessageUsername);
    newMessageInfoDiv.appendChild(newMessageTime);
    newMessageInfoDiv.classList.add("user-info");
    newMessageDiv.appendChild(newMessageInfoDiv);
    newMessageDiv.appendChild(newMessageBody);
    newMessageDiv.classList.add("message");
    messageArea.appendChild(newMessageDiv);
    messageArea.scrollTop = messageArea.scrollHeight;   

}
