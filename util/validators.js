module.exports.registerValidator = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username cannot be empty';
    }
    if (email.trim() === '') {
        errors.email = 'Email cannot be empty';
    } else {
        if (!email.match(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/)) {
            errors.email = "Please enter a valid email address";
        }
    }
    if (password.trim() === '') {
        errors.password = 'Password cannot be empty';
    } else if (password != confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    } else if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)) {
        errors.password = 'Password must contain: at least eight characters, one number, one letter, and one special character';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.addDistValidator = (
    name,
    phone,
    email
) => {
    const errors = {};
    if (name.trim() === '') {
        errors.name = 'Username cannot be empty';
    }
    if (email.trim() === '') {
        errors.email = 'Email cannot be empty';
    } else {
        if (!email.match(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/)) {
            errors.email = "Please enter a valid email address";
        }
    }
    if (phone.trim() === '') {
        errors.phone = 'Phone number cannot be empty'
    } else {
        if (!phone.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)) {
            errors.phone = 'Please enter a valid phone number';
        }
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}