import { isFile, isVideo } from "../../utils/reg";
import { Image, ImageProps, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
import "./index.scss";
import Glb from "../../pages/works/Model";
interface IMediumProps extends ImageProps {
	path: string;
}
const Medium = (props: IMediumProps) => {
	const { path, ...rest } = props;

	if (/\.(gif)/.test(path))
		return (
			<div className="medium_box">
				<Image src={path} alt="..." {...rest} />
			</div>
		);
	if (isFile(path))
		return (
			<div className="medium_box">
				{/* <Glb /> */}
				<Image
					// onClick={() => (/\.(svg)/.test(path) ? null : window.open(path))}
					onClick={() =>
						Modal.info({
							wrapClassName: "glb_modal",
							width: "40%",
							title: "preview",
							content: <Glb glb_url={path} />,
						})
					}
					src={path}
					alt="..."
					fallback="https://files.smartholder.jp/img/test-2023-04/e3a9e868-d76c-11ed-8290-0242ac110004.jpg"
					preview={/\.(svg)/.test(path)}
					// {...rest}
					style={{ cursor: "pointer" }}
				/>
			</div>
		);
	return (
		<div className="medium_box">
			{isVideo(path) ? (
				<video style={{ width: "100%", height: "100%" }} src={path} controls />
			) : (
				<Image
					src={path}
					alt="..."
					fallback={"https://nftimg.stars-mine.com/img/dev-2023-03/3dda4bc1-c7b8-11ed-96ce-0242ac110002.jpg"}
					placeholder={<LoadingOutlined />}
					{...rest}
				/>
			)}
		</div>
	);
};
// https://nftimg.stars-mine.com/img/dev-2023-03/a0f8a823-c7b8-11ed-96ce-0242ac110002.png
export default Medium;
