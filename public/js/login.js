document.addEventListener('DOMContentLoaded', main);

function main() {
    document.querySelector('#loginButton').addEventListener('click', () => loginRegister('login'));
    document.querySelector('#registerButton').addEventListener('click', () => loginRegister('register'));
}

async function loginRegister(action) {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    if (username === '' || password === '') {
        alert('Field can not be blank.');
        return;
    }
    const res = await fetch(`/${action}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    const response = await res.json();
    if (response.success) {
        window.location.href = '/chat?username=' + response.user.username;
    } else {
        alert(response.message);
    }
}