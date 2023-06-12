import React, { useState } from "react";
import { Button as AtButton, ButtonProps, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, SearchOutlined } from "@ant-design/icons";

import "./index.scss";
import Text from "../text";

export interface IBottomBtnProps extends ButtonProps {
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void | Promise<string> | Promise<void> | string;
	btn_text?: string;
	children?: JSX.Element | string | null | React.ReactNode;
	className?: string;
	ghost?: boolean; // 是否幽灵👻样式
	disabled?: boolean;
	notLoading?: boolean;
	btnType?: "edit" | "delete" | "lock" | "unlock" | "info";
	tooltip?: string;
}

const btnIcon = {
	edit: <EditOutlined />,
	delete: <DeleteOutlined />,
	lock: <LockOutlined />,
	unlock: <UnlockOutlined />,
	info: <SearchOutlined />,
};

const Button = (props: IBottomBtnProps) => {
	const {
		onClick,
		children,
		className = "",
		ghost,
		disabled = false,
		btnType,
		notLoading = false,
		tooltip,
		...rest
	} = props;

	const [loading, setloading] = useState<boolean>(false);

	const btnClick = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (loading) {
			return false;
		}
		!notLoading && setloading(true);
		try {
			if (onClick) await onClick(e);
		} catch (error) {
			console.log(error, "error");
		}
		setloading(false);
		return true;
	};

	const button = (
		<AtButton
			icon={(btnType && btnIcon[btnType]) || props.icon}
			type={btnType ? "primary" : props.type}
			disabled={loading || disabled}
			loading={loading}
			className={`button_btn ${className} ${String(btnType)}`}
			onClick={btnClick}
			{...rest}
		>
			{/* {(btnType && btnIcon[btnType]) || children} */}
			<Text>{children}</Text>
		</AtButton>
	);

	if (tooltip) return <Tooltip title={<Text>{tooltip}</Text>}>{button}</Tooltip>;

	if (btnType) {
		return <Tooltip title={<Text>{children}</Text>}>{button}</Tooltip>;
	}
	return button;
};

export default Button;
