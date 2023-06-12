import { LockOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText, ProConfigProvider } from "@ant-design/pro-components";
import { Row, Col, message } from "antd";
import React, { useEffect } from "react";
import LanguageSelect from "../../components/languageSelect";
import { userLogin } from "../../models/user";
import { RouterConfig } from "../../interface";
import { useNavigate } from "react-router-dom";
import { setUserInfo, t } from "../../utils/tools";
import { emailInput, passwordEditModal } from "../main";
import "./index.scss";

const Login = () => {
	const navigate = useNavigate();

	useEffect(() => {
		localStorage.removeItem("userInfo");
	}, []);

	return (
		<div className="login_page">
			<ProConfigProvider hashed={false}>
				<div style={{ backgroundColor: "white" }}>
					<LoginForm<{ email: string; password: string }>
						title="SmartHolder Container"
						// title="Hashii"
						// subTitle={`hashii${t("运营后台")}2.0`}
						subTitle={` `}
						onFinish={async (valus) => {
							valus.email = valus.email.trim();
							const { data } = await userLogin(valus);
							setUserInfo(data);
							message.success(t("登录成功"));
							navigate(RouterConfig.Path.works);
						}}
					>
						<>
							{emailInput}
							<ProFormText.Password
								name="password"
								fieldProps={{
									size: "large",
									prefix: <LockOutlined className={"prefixIcon"} />,
								}}
								placeholder={t("请输入账号密码")}
								rules={[
									{
										required: true,
										message: t("请输入密码！"),
									},
								]}
							/>
						</>

						<div
							style={{
								marginBlockEnd: 24,
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Row align="middle">
								<Col>{t("语言")}: </Col>
								<Col>
									<LanguageSelect />
								</Col>
							</Row>

							{passwordEditModal}
						</div>
					</LoginForm>
				</div>
			</ProConfigProvider>
		</div>
	);
};
export default Login;
