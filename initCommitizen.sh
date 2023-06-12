#!/bin/zsh

####################################
# !!! node version must be 16+ !!! #
####################################

# for details, see https://typicode.github.io/husky/#/
isGlobalInstallCommitizen=$(npm ls commitizen -g)
# isGlobalInstallCommitizen='empty'
# 1.全局安装
if [[ $isGlobalInstallCommitizen == *'empty'* ]]; then
  echo '※未找到全局包 commitizen'
  installCommitizen='npm install commitizen -g'
  echo '※执行命令 '${installCommitizen}
  echo $installCommitizen | sh
fi

# 2.安装husky7以上版本
npx --yes husky-init && npm install

# 3.设置提交前的脚本
# 3.1检测commit msg是否符合规则 因为$1会被作为变量运行 所以通过echo追加
npx husky add .husky/commit-msg ""
echo 'npx --no-install commitlint --edit "$1"' >>.husky/commit-msg
# 3.2对已经commit的代码进行格式化
npx husky add .husky/pre-commit 'npx lint-staged'
# 3.3移除无用脚本
sed -i '' 's#npm test##' .husky/pre-commit

# 4.设置eslint脚本 如果没安装需要自行安装 这里先不管了 后面用prettier 格式化掉
npm set-script lint "eslint src --ext .ts,.tsx --max-warnings 0"

# 5.安装/设置changeLog脚本/配置
npm i cz-conventional-changelog -D
cat >>.czrc <<EOF
{
  "path": "cz-conventional-changelog",
  "scripts":{
      "commit":"cz"
  }
}
EOF

# 6. 全局安装commitlint/配置
npm install -g @commitlint/cli @commitlint/config-conventional
cat >>commitlint.config.js <<EOF
module.exports = {
    extends: ['@commitlint/config-conventional'],
    /**
     * Level [0..2]: 0 disables the rule. For 1 it will be considered a warning for 2 an error.
     * Applicable always|never: never inverts the rule.
     * Value: value to use for this rule.
     * 
     * for details see https://commitlint.js.org/#/reference-rules
     */
    rules: {
        "header-max-length": [2, "always", 83],
    }
}
EOF

# for details, see https://prettier.io/docs/en/install.html
# 7.仅在当前项目安装/配置
npm install -D --save-exact prettier
cat >>.prettierrc.js <<EOF
module.exports = {
  // 最大宽度 超过即自动换行 Default:80
  printWidth: 100,
  // tab制表符相当于的空格数 Default:2
  tabWidth: 4,
  // 使用制表符缩进  Default:false
  useTabs: true,
  // 在任何语句末尾添加分号 Default:true
  semi: true,
  // 使用单引号而不是双引号(不含jsx) Default:false
  singleQuote: false,
  // 仅在需要时在对象属性周围添加引号 Default:as-needed
  quoteProps: "as-needed",
  // jsx中使用单引号而不是双引号 Default:false
  jsxSingleQuote: false,
  // 在多行逗号分隔的句法结构中打印尾随逗号 如数组or对象 Default:es5
  trailingComma: "es5",
  // 在对象文字中的括号之间增加空格 Default:true
  bracketSpacing: true,
  // 将多行HTML/JSX元素的闭合标签 > 放在最后一行的末尾，而不是单独放在下一行（自闭合标签不适用) Default:false
  bracketSameLine: false,
  // 箭头函数仅一个参数时添加括号 (e)=> null  Default:always
  arrowParens: "always",
}
EOF

# 8.配置格式化需要忽略文件or目录
cat >>.prettierignore <<EOF
/build
/dist
/node_modules

.vscode
.git
.DS_Store
.pnp
.pnp.js

/coverage

.env.local
.env.development
.env.test.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

# 9.安装lint-staged 配合husky
npm i lint-staged -D

# for details, see https://github.com/okonet/lint-staged#configuration
# 10.写入lint-staged配置文件
cat >>.lintstagedrc.js <<EOF
module.exports = {
    "src/*.js": ["npm run lint", "npx prettier --write"],
    "src/**/*.js": ["npm run lint", "npx prettier --write"],
    "*.ts": ["npm run lint", "npx prettier --write"],
    "*.tsx": ["npm run lint", "npx prettier --write"]
}
EOF

# 10.全局安装conventional-changelog-cli 用于生成changeLog
npm install -g conventional-changelog-cli
npm set-script changelog "conventional-changelog -p angular -i CHANGELOG.md -s"
npm set-script changelog:all "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
