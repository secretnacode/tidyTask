import { ValidateReturnType } from "@/type";

export function Validate<T extends object>(data: T): ValidateReturnType {
  for (const value of Object.values(data)) {
    // validate if all the field has a value
    if (value === "")
      return {
        validate: false,
        message: `All Input field should have a value`,
      };
  }

  for (const [key, value] of Object.entries(data)) {
    // validate if all the field has atleast 8 characters
    if (value.length < 8)
      return {
        validate: false,
        message: `${key} should atleast have a 8 characters`,
      };

    // validate if all the field has atleast a single number
    if (!/0-9/.test(value))
      return {
        validate: false,
        message: `${key} should atleast a single number`,
      };

    // validate if all the field has atleast a single small letter
    if (!/a-z/.test(value))
      return {
        validate: false,
        message: `${key} should atleast a single small letter`,
      };

    // validate if all the field has atleast a single big letter
    if (!/A-Z/.test(value))
      return {
        validate: false,
        message: `${key} should atleast a single big letter`,
      };
  }

  return { validate: true, message: "All value is valid" };
}
