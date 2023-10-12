const mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const asciiFormat = /^[\x00-\x7F]*$/;

export function checkEmail(email: string): string {
    if (!mailFormat.test(email)) {
        return 'No valid email address!';
    }
    return '';
}

export function checkPassword(password: string): string {
    if (password.length < 8) {
        return 'Minimum 8 characters required!';
    }
    return '';
}

export function checkUsername(username: string): string {
    if (username.length < 3) {
        return 'Minimum 3 characters required!';
    } else if (!asciiFormat.test(username)) {
        return 'Only ASCII characters allowed!';
    }
    return '';
}
