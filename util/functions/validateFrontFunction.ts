import { LoginUserType, SignUpUserValType, ValidateReturnType } from "@/type";

export function ValidateUserSignup(
  data: SignUpUserValType
): ValidateReturnType {
  const checkInput = CheckUserInput<SignUpUserValType>(data);

  // validate if all the field has a value
  if (!checkInput.validate)
    return {
      validate: false,
      message: checkInput.message,
    };

  if (data.password !== data.confirmPassword) {
    // validate if the password and confirm password are the same
    return {
      validate: false,
      message: `Password and Confirm Password should be the same`,
    };
  }

  for (const [key, value] of Object.entries(data)) {
    // validate if all the field has atleast 8 characters
    if (value.length < 8) {
      return {
        validate: false,
        message: `${key} should atleast have a 8 characters`,
      };
    }

    // validate if all the field has atleast a single number
    if (!/[0-9]/.test(value)) {
      return {
        validate: false,
        message: `${key} should atleast have a single number`,
      };
    }

    // validate if all the field has atleast a single small letter
    if (!/[a-z]/.test(value)) {
      return {
        validate: false,
        message: `${key} should atleast have a single small letter`,
      };
    }

    // validate if all the field has atleast a single big letter
    if (!/[A-Z]/.test(value)) {
      return {
        validate: false,
        message: `${key} should atleast a single big letter`,
      };
    }
  }

  return { validate: true, message: "All value is valid" };
}

export function CheckUserInput<T extends object>(data: T): ValidateReturnType {
  for (const value of Object.values(data)) {
    // validate if all the field has a value
    if (value === "")
      return {
        validate: false,
        message: `All Input field should have a value`,
      };
  }
  return {
    validate: true,
    message: `All Input field have a value`,
  };
}

export function ValidateUserLogin(data: LoginUserType): ValidateReturnType {
  const checkInput = CheckUserInput<LoginUserType>(data);

  // validate if all the field has a value
  if (!checkInput.validate)
    return {
      validate: false,
      message: checkInput.message,
    };

  return { validate: true, message: "All value is valid" };
}
