// export const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
export const phoneReg =
	/^([+]?0?\d{2,3}-?|\([+]?0?\d{2,3}\)|\([+]?0?\d{2,3}\))?\d+$|^([+]?0?\d{2,3}-?|\([+]?0?\d{2,3}\)|\([+]?0?\d{2,3}\))?[1-9]\d{4,10}(-\d{1,10})?$/;

export const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

export const isVideo = (path: string) => {
	return /\.(mp4|avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv|gif)/.test(path);
};

export const isFile = (path: string) => {
	return /\.(glb|svg)/.test(path);
};
