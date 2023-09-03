document.addEventListener('DOMContentLoaded', main);

function main() {
    document.querySelector('#loginButton').addEventListener('click', () => setFormAction('/login'));
    document.querySelector('#registerButton').addEventListener('click', () => setFormAction('/register'));
}

function setFormAction(act) {
    document.querySelector('#loginForm').action = act;
}