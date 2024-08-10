const mailFormat =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const asciiFormat = /^[\x00-\x7F]*$/;

/**
 * Function that checks if the email is valid
 * @param email string that will be checked
 * @returns an empty string if the email is valid, otherwise a string with an error message
 */
export function checkEmail(email: string): string | undefined {
  if (!mailFormat.test(email)) {
    return "No valid email address!";
  }
  return undefined;
}

/**
 * Function that checks if the password is acceptable
 * @param password string that will be checked
 * @returns an empty string if the password is valid, otherwise a string with an error message
 */
export function checkPassword(password: string): string | undefined {
  if (password.length < 8) {
    return "Minimum 8 characters required!";
  }
  return undefined;
}

/**
 * Function that checks if the username is acceptable
 * @param username string that will be checked
 * @returns an empty string if the username is valid, otherwise a string with an error message
 */
export function checkUsername(username: string): string | undefined {
  if (username.length < 3) {
    return "Minimum 3 characters required!";
  } else if (!asciiFormat.test(username)) {
    return "Only ASCII characters allowed!";
  }
  return undefined;
}

export function checkApy(apy: number): string | undefined {
  if (apy < 0) {
    return "APY must be positive!";
  }
  return undefined;
}

export function checkCycles(cycles: number): string | undefined {
  if (cycles < 0) {
    return "Cycles must be positive!";
  } else if (cycles > 365) {
    return "Cycles must be less than 365 Days (one Year)!";
  }
  return undefined;
}

export function checkMinDebtAge(minDebtAge: number): string | undefined {
  if (minDebtAge < 0) {
    return "Minimum Debt Age must be positive!";
  } else if (minDebtAge > 365) {
    return "Minimum Debt Age must be less than 365 Days (one Year)!";
  }
  return undefined;
}

export function checkNextDate(date: Date): string | undefined {
  if (!(date instanceof Date)) {
    return "Date must be a valid Date!";
  }
  return undefined;
}
