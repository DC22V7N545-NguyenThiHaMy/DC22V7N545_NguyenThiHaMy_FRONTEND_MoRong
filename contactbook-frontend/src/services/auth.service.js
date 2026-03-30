const REGISTER_STORAGE_KEY = "registeredUsers";
const CURRENT_USER_KEY = "currentUser";

const readRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(REGISTER_STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
};

const saveRegisteredUsers = (users) => {
  localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(users));
};

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  } catch (error) {
    return null;
  }
};

const login = (email, password) => {
  const users = readRegisteredUsers();
  const foundUser = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (!foundUser) {
    return { success: false, message: "Email hoặc mật khẩu không đúng." };
  }

  const safeUser = {
    name: foundUser.name,
    email: foundUser.email,
    phone: foundUser.phone,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return { success: true, user: safeUser };
};

const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

const loginWithSocial = (payload) => {
  const safeUser = {
    name: payload.name || "Người dùng",
    email: payload.email || "",
    phone: payload.phone || "",
    provider: payload.provider,
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return { success: true, user: safeUser };
};

const isAuthenticated = () => Boolean(getCurrentUser());

const register = (payload) => {
  const users = readRegisteredUsers();
  const existedEmail = users.some((user) => user.email === payload.email);

  if (existedEmail) {
    return {
      success: false,
      message: "Email này đã được đăng ký. Vui lòng dùng email khác.",
    };
  }

  users.push(payload);
  saveRegisteredUsers(users);
  return { success: true };
};

export default {
  REGISTER_STORAGE_KEY,
  CURRENT_USER_KEY,
  readRegisteredUsers,
  getCurrentUser,
  register,
  login,
  loginWithSocial,
  logout,
  isAuthenticated,
};
