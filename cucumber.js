export default {
  default: {
    requireModule: ["tsx"],
    require: ["tests/bdd/world.ts", "tests/bdd/steps/**/*.ts"],
    paths: ["tests/bdd/features/**/*.feature"],
    format: ["progress", "html:reports/cucumber-report.html"],
  },
};
