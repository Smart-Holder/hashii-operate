export const setCurrMenu = <T>(value: T) => {
	return { type: "menu", value };
};

export const setModalShow = <T>(value: T) => {
	return { type: "modal", value };
};

export const setisRefresh = <T>(value: T) => {
	return { type: "isRefresh", value };
};

export const setToken = <T>(value: T) => {
	return { type: "token", value };
};

export const setUserInfo = <T>(value: T) => {
	return { type: "userInfo", value };
};

export const setLocale = <T>(value: T) => {
	return { type: "locale", value };
};
