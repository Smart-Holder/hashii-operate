import { message } from "antd";
import AWS from "aws-sdk";
import axios, { AxiosError, AxiosRequestConfig, Canceler } from "axios";
import { t } from "i18next";
import Qs from "qs";
import ErrorCode from "./errorCode";
import { getUserInfo, logout } from "./tools";
import { Body } from "aws-sdk/clients/s3";
// import { getUserInfo } from "./utils";
AWS.config.update({
	accessKeyId: "AKIARTU4UXGJFLBJ4RFC",
	secretAccessKey: "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",
});
const S3 = new AWS.S3();
const BucketName = "hashii-img/img";
const apiUrl: { [key: string]: string } = {
	// 'dev': "https://manager-dev.stars-mine.com/api/v1/backend",
	// http://manager-cndev.stars-mine.com
	// 'dev': "http://192.168.202.76:8888/api/v1/backend",
	// dev: "https://hashii-manager-dev2.stars-mine.com/service",
	// dev: "https://hashii-manager-dev2.stars-mine.com/service",
	dev: "https://managerapi-test.smartholder.jp/service",

	test: "https://managerapi-test.smartholder.jp/service",
	development: "https://hashii-manager-dev2.stars-mine.com/service",
	production: "https://managerapi-v2.smartholder.jp/service",
};

export interface IDataProps<T> {
	data: T;
	// msg: string;
	// state: any;
}

// axios.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.headers.common["Content-Type"] = "application/json";
// axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
// axios.defaults.headers["Content-Type"] = "application/json";

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending: Map<string, Canceler> = new Map();
/**
 * 添加请求
 * @param {Object} config
 */
const addPending = (config: AxiosRequestConfig) => {
	const url = [config.method, config.url, Qs.stringify(config.params), Qs.stringify(config.data)].join("&");
	config.cancelToken =
		config.cancelToken ||
		new axios.CancelToken((cancel) => {
			if (!pending.has(url)) {
				// 如果 pending 中不存在当前请求，则添加进去
				pending.set(url, cancel);
			}
		});
};
/**
 * 移除请求
 * @param {Object} config
 */
const removePending = (config: AxiosRequestConfig, c?: Canceler) => {
	const url = [config.method, config.url, Qs.stringify(config.params), Qs.stringify(config.data)].join("&");
	if (pending.has(url)) {
		// 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
		const cancel = pending.get(url);
		cancel && cancel("取消重复请求");
		pending.delete(url);
	}
};
/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
	for (const [url, cancel] of [...pending]) {
		cancel(url);
	}
	pending.clear();
};

const axiosConfig = {
	// baseURL: process.env.REACT_APP_ADMIN_URL,
	baseURL: process.env.REACT_APP_NODE_ENV ? apiUrl[process.env.REACT_APP_NODE_ENV] : process.env.REACT_APP_ADMIN_URL,
	timeout: 60 * 1000, // Timeout
	hideErrorMessage: false,
};
// console.log(process.env.REACT_APP_NODE_ENV, "process.env.REACT_APP_NODE_ENV", config.baseURL);

const _axios = axios.create(axiosConfig);
// const showErrorMessage = true;
_axios.interceptors.request.use<AxiosRequestConfig<IAxiosGetProps>>(
	(config: IAxiosGetProps) => {
		// Do something before request is sent
		if (config.headers) {
			const userInfoJson = getUserInfo();
			if (userInfoJson) {
				config.headers["Authorization"] = userInfoJson.token;
			}
			// getUserInfo()?.token && (config.headers["Authorization"] = getUserInfo()?.token);
		}
		axiosConfig.hideErrorMessage = Boolean(config.hideErrorMessage);

		// config.headers = { token: getUserInfo()?.token, ...config.headers };
		removePending(config); // 在请求开始前，对之前的请求做检查取消操作
		addPending(config); // 将当前请求添加到 pending 中

		return config;
	},
	(error) => {
		// Do something with request error
		return Promise.reject(error);
	}
);

export interface IErrorProps {
	code: string | number;
	msg: string;
}

// Add a response interceptor
_axios.interceptors.response.use(
	(response: { data: { code: number; msg: string } }) => {
		// C-10005
		console.log(response.data, "response.data");

		if ([401].includes(response.data.code)) {
			alert("身份验证信息已过期,请重新登录!");
			window.location.href = "/";
			return response;
		}

		if (response.data.code && !axiosConfig.hideErrorMessage) {
			const msg = String(ErrorCode[response.data.code] ?? response.data.msg);
			message.error(String(t(msg)));
		}
		removePending(response); // 在请求结束后，移除本次请求
		// Do something with response data
		return response;
	},
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			alert("身份验证信息已过期,请重新登录!");
			logout();
		}
		// console.log(Object.keys(error), error.response.status === 401, "error");

		// if (error?.message?.startsWith("取消")) return Promise.reject(error.message);
		message.error(error.message);
		Promise.reject(error);
		// Do something with response error
		return error;
	}
);

export interface IAxiosGetProps extends AxiosRequestConfig {
	hideErrorMessage?: boolean;
}
export interface IResponseProps<T> {
	code: number;
	data: T;
}

const axiosGet = <T>(props: IAxiosGetProps): Promise<IDataProps<T>> => {
	const { url, data, ...rest } = props; // eslint-disable-line
	return new Promise(async (resolve, reject) => {
		const res = await _axios.request<IResponseProps<T>>({ ...rest, url, params: data, method: "GET" }); // eslint-disable-line
		if (!res?.data || res?.data.code) return reject(res.data);
		resolve({ data: res.data.data });
	});
};

const axiosPost = <T>(props: IAxiosGetProps): Promise<IDataProps<T>> => {
	const { url, data, ...rest } = props; // eslint-disable-line
	return new Promise(async (resolve, reject) => {
		const res = await _axios.request<IResponseProps<T>>({ ...rest, url, data, method: "post" }); // eslint-disable-line
		if (!res?.data || res?.data.code) return reject(res.data);
		resolve({ data: res.data.data });
	});
};
export default _axios;

export { axiosGet, axiosPost };

// export const AwsUpload = ({
// 	albumBucketName = "hashii-img/img",
// 	photoKey,
// 	file,
// }:{
// 	albumBucketName:string,
// 	photoKey:string,
// 	file:any
// }) =>  new AWS.S3.ManagedUpload({
//     params: {
//       Bucket: albumBucketName,
//       Key: photoKey,
//       Body: file,
// 	  ACL: 'public-read'
//     }
//   }).promise();

export const AwsUpload = ({
	Bucket = BucketName,
	Key,
	Body,
	ContentType,
	ContentDisposition = "inline",
}: {
	Bucket: string;
	Key: string;
	Body: Body;
	ContentType?: string;
	ContentDisposition?: "inline" | "attachment";
}) =>
	S3.upload(
		{
			Bucket,
			Key,
			Body,
			ACL: "public-read",
			ContentType,
			ContentDisposition,
		},
		{
			partSize: 10 * 1024 * 1024,
		}
	).promise();
