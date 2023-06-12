// import React from 'react';
import { createFromIconfontCN } from "@ant-design/icons";
import { IconFontProps } from "@ant-design/icons/lib/components/IconFont";
import React from "react";

const IconFontCN = createFromIconfontCN({
	// scriptUrl: '//at.alicdn.com/t/font_2717960_zvh1qlvpq7.js',
	//at.alicdn.com/t/font_2717960_4tyhyvdxrd.js
	scriptUrl: "//at.alicdn.com/t/c/font_3954609_zcc1txei5de.js",
});

const IconFont = (props: IconFontProps) => {
	return <IconFontCN {...props} />;
};

export default IconFont;
