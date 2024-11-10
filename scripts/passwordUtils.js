// passwordUtils.js

export function togglePasswordVisibility(passwordFieldId) {
    const passwordField = document.getElementById(passwordFieldId);
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

document.querySelectorAll('.toggle-password').forEach(toggleIcon => {
    toggleIcon.addEventListener('click', () => {
        const passwordFieldId = toggleIcon.getAttribute('onclick').match(/'([^']+)'/)[1];
        togglePasswordVisibility(passwordFieldId);
    });
});