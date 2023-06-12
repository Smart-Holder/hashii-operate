import React from "react";
import "./index.scss";

const Mobile = () => {
	return (
		<div className="mobile_page">
			<img src={require("../../assets/empty.png") as string} alt="..." />
			<div className="tip_text">视频正在制作中, 敬请期待~</div>
		</div>
	);
};

export default Mobile;
