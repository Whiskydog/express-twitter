import { insertUser, selectUserByUsername } from '@db/db';
import { LoginUserSchema, RegisterUserSchema } from '@db/schemas/users';
import { compare, hash } from 'bcrypt';
import { nanoid } from 'nanoid';

const getUser = async (credentials: LoginUserSchema) => {
  const matchedUsers = await selectUserByUsername(credentials.username);
  if (matchedUsers.length === 0) return null;
  const user = matchedUsers[0];
  const isPasswordCorrect = await compare(credentials.password, user.password);
  if (!isPasswordCorrect) return null;
  return user;
};

const createUser = async (userData: RegisterUserSchema) => {
  const newUser = {
    userId: nanoid(),
    username: userData.username,
    password: await hash(userData.password, 10),
    displayName: userData.displayName,
  };
  await insertUser(newUser);
};

export default { getUser, createUser };
