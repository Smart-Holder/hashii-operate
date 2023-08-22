module.exports = {
	"src/*.js": ["npm run lint", "npx prettier --write"],
	"src/**/*.js": ["npm run lint", "npx prettier --write"],
	"*.ts": ["npm run lint", "npx prettier --write"],
	"*.tsx": ["npm run lint", "npx prettier --write"],
	"*.js": ["npx prettier --write"],
};
