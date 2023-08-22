module.exports = {
	extends: ["@commitlint/config-conventional"],
	/**
	 * Level [0..2]: 0 disables the rule. For 1 it will be considered a warning for 2 an error.
	 * Applicable always|never: never inverts the rule.
	 * Value: value to use for this rule.
	 *
	 * for details see https://commitlint.js.org/#/reference-rules
	 */
	rules: {
		"header-max-length": [2, "always", 83],
	},
};
