export const PASSWORD_MIN_LENGTH = 4;

export const PASSWORD_REGEX = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

export const PASSWORD_REGEX_ERROR =
    "Password must have lowercase and UPPERCASE and number and special character";
