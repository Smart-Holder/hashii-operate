import { message, Statistic } from "antd";
import React, { useState } from "react";
import Button, { IBottomBtnProps } from "../button";

const { Countdown } = Statistic;

interface ICountDownProps {
	onClick?: () => Promise<void> | void;
	btnConfig?: IBottomBtnProps;
}

const CountDown = (props: ICountDownProps) => {
	const [isCountdown, setisCountdown] = useState<boolean>(false);
	const [dateNow, setDateNow] = useState<number>(Date.now());
	const { onClick, btnConfig } = props;
	const getVcode = async () => {
		onClick && (await onClick());
		message.success("已发送验证码!");
		setisCountdown(true);
		setDateNow(Date.now());
	};

	const countdownFinish = () => {
		setisCountdown(false);
	};
	return (
		<div>
			{isCountdown ? (
				<Countdown
					onFinish={countdownFinish}
					valueStyle={{ fontSize: ".28rem", marginRight: ".3rem", whiteSpace: "nowrap" }}
					format="s 秒"
					value={dateNow + 60 * 1000}
				/>
			) : (
				<Button
					{...btnConfig}
					style={{ padding: 0, border: 0, height: "auto" }}
					type="link"
					className="get_vcode"
					onClick={getVcode}
				>
					获取验证码
				</Button>
			)}
		</div>
	);
};

export default CountDown;
