import { MenuUnfoldOutlined, MenuFoldOutlined, MailTwoTone, UserOutlined } from "@ant-design/icons";
import type { ProSettings } from "@ant-design/pro-components";
import {
	PageContainer,
	ProLayout,
	ProCard,
	ProBreadcrumb,
	ModalForm,
	ProFormCaptcha,
	ProFormDependency,
	ProFormText,
} from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import defaultProps from "./_defaultProps";
import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import LanguageSelect from "../../components/languageSelect";
import { Dropdown, MenuProps, Modal, message } from "antd";
import Button from "../../components/button";
import { getUserInfo, logout, t } from "../../utils/tools";
import { IUserSetpasswordProps, userSetpassword, userVerificationCode } from "../../models/user";
import ProFormInput from "../../components/input";
import { emailReg } from "../../utils/reg";

export const emailInput = (
	<ProFormInput
		name="email"
		fieldProps={{
			size: "large",
			prefix: <UserOutlined className={"prefixIcon"} />,
		}}
		placeholder={t("邮箱")}
		rules={[
			{ required: true, message: "请输入用户名!" },
			{ pattern: emailReg, message: "请输入正确的邮箱", transform: (val: string) => val.trim() },
		]}
	/>
);

export const passwordEditModal = (
	<ModalForm<IUserSetpasswordProps>
		title={t("修改密码")}
		trigger={
			<Button key="add" type="link">
				密码修改
			</Button>
		}
		onFinish={async (e: IUserSetpasswordProps) => {
			await userSetpassword(e);
			message.success(t("密码修改成功!"));
			Modal.destroyAll();
			return true;
		}}
		request={async () => {
			return { email: getUserInfo().email };
		}}
	>
		{emailInput}
		<ProFormDependency name={["email"]}>
			{({ email }: { email: string }) => {
				return (
					<ProFormCaptcha
						captchaTextRender={(time, count) => (time ? `${count} s` : t("获取验证码"))}
						fieldProps={{
							size: "large",
							prefix: <MailTwoTone />,
							maxLength: 4,
							// width: "120px",
						}}
						captchaProps={{ size: "large", style: { minWidth: "120px" } }}
						name="verificationCode"
						rules={[
							{
								required: true,
								message: t("请输入验证码"),
							},
						]}
						placeholder={t("请输入验证码")}
						onGetCaptcha={async () => {
							if (!email) throw new Error(t("未填写邮箱"));
							await userVerificationCode(email, localStorage.getItem("locale").toLowerCase() || "en");
							message.success(t(`邮箱验证码发送成功! 请注意查收`));
						}}
					/>
				);
			}}
		</ProFormDependency>

		<ProFormText.Password
			fieldProps={{ size: "large", maxLength: 30 }}
			name="newPassword"
			rules={[
				{
					required: true,
					message: t("请输入密码！"),
				},
			]}
			placeholder={t("请输入新密码")}
		/>
	</ModalForm>
);

const items: MenuProps["items"] = [
	{
		key: "1",
		label: passwordEditModal,
	},
	{
		key: "2",
		label: (
			<Button
				type="link"
				onClick={() => {
					logout();
				}}
			>
				退出登录
			</Button>
		),
	},
];

export default () => {
	const [settings] = useState<Partial<ProSettings> | undefined>({
		layout: "mix",
	});

	const [collapsed, setCollapsed] = useState<boolean>(false);

	const [pathname, setPathname] = useState<string>(window.location.pathname);

	const userinfo = getUserInfo();

	useEffect(() => {
		userinfo?.isDefaultPassword &&
			Modal.confirm({
				title: t("提示"),
				content: t("因你的密码目前是默认密码，为了保证您账户的安全建议您修改默认密码"),
				footer: (
					<div style={{ display: "flex", marginTop: 10, justifyContent: "flex-end" }}>
						<Button onClick={() => Modal.destroyAll()}>暂不修改</Button>
						{passwordEditModal}
					</div>
				),
			});
		// eslint-disable-next-line
	}, []); // eslint-disable-next-line

	const navigate = useNavigate();
	return (
		<div
			id="test-pro-layout"
			style={{
				height: "100vh",
			}}
		>
			<ProLayout
				siderWidth={216}
				onPageChange={(e) => {
					console.log(e.pathname, "key");
					e && navigate(e.pathname);
				}}
				collapsed={collapsed}
				collapsedButtonRender={false}
				headerContentRender={() => <ProBreadcrumb />}
				// logo={<img src={require("../../assets/ic_launcher.png") as string} alt="" />}
				// title={`${t("运营后台")}2.0`}
				title={"SmartHolder Container"}
				logo={null}
				menuFooterRender={() => {
					return (
						<div
							onClick={() => setCollapsed(!collapsed)}
							style={{
								cursor: "pointer",
								fontSize: "16px",
								textAlign: "center",
							}}
						>
							{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						</div>
					);
				}}
				{...defaultProps()}
				location={{
					pathname,
				}}
				actionsRender={(props) => {
					if (props.isMobile) return [];
					return [
						<LanguageSelect key="LanguageSelect" />,
						<Dropdown menu={{ items }}>
							<Button type="link">{userinfo?.email}</Button>
						</Dropdown>,
					];
				}}
				menuItemRender={(item, dom) => (
					<div
						onClick={() => {
							setPathname(item.path);
						}}
					>
						{dom}
					</div>
				)}
				{...settings}
			>
				<PageContainer
					onBack={
						window.location.pathname.split("/").length >= 4
							? () => {
									navigate(-1);
									setTimeout(() => {
										setPathname(window.location.pathname);
									}, 10);
							  }
							: undefined
					}
					breadcrumbRender={false}
				>
					<ProCard
						style={{
							minHeight: 800,
						}}
					>
						<Outlet />
						<div />
					</ProCard>
				</PageContainer>
			</ProLayout>
		</div>
	);
};
