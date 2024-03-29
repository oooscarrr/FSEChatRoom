const socket = io();

document.addEventListener('DOMContentLoaded', main);

async function main() {
    const username = await getUsername();

    document.querySelector('#postForm').addEventListener('submit', e => {
        e.preventDefault();
        postTextElement = document.querySelector('#postText');
        if (postTextElement.value === '') {
            alert('You can not send blank message.')
            return;
        }
        const data = {
            username: username,
            content: postTextElement.value,
            time: new Date(),
        };
        socket.emit('message', data);
        postTextElement.value = '';
    });

    socket.on('message', data => {
        const message = document.createElement('div')
        message.classList.add('message');

        const messageInfo = document.createElement('div')
        messageInfo.classList.add('messageInfo');

        const messageUsername = document.createElement('div')
        messageUsername.classList.add('messageUsername');
        messageUsername.textContent = data.username;
        messageInfo.appendChild(messageUsername);

        const messageTime = document.createElement('div')
        messageTime.classList.add('messageTime');
        messageTime.textContent = formatDateString(data.timestamp);
        messageInfo.appendChild(messageTime);

        const messageText = document.createElement('div')
        messageText.classList.add('messageText');
        messageText.textContent = data.content;

        message.appendChild(messageInfo);
        message.appendChild(messageText);
        document.querySelector('#messagesContainer').prepend(message);
    });
}

async function getUsername() {
    const res = await fetch('/username');
    const response = await res.json();
    return response.username;
}

function formatDateString(timestamp) {
    timestamp = new Date(timestamp);
    const month = (timestamp.getMonth()+1).toString().padStart(2, '0');
    const day = timestamp.getDate().toString().padStart(2, '0');
    const year = timestamp.getFullYear();
    const hour = timestamp.getHours().toString().padStart(2, '0');
    const minute = timestamp.getMinutes().toString().padStart(2, '0');
    const amOrPm = hour < 12 ? 'AM' : 'PM';
    return `${month}.${day}.${year} ${hour}:${minute} ${amOrPm}`;
}