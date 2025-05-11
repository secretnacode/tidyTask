export type SignUpUserValType = {
  username: string;
  password: string;
  confirmPassword: string;
};

export type ValidateReturnType = {
  validate: boolean;
  message: string;
};

export type NewUserAuth = {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
};
