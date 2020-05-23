import pkg from "./package.json";
import babel from "rollup-plugin-babel";

export default {
  input: "src/web-monetized-video.js",
  output: [
    {
      name: "WebMonetizationVideo",
      file: pkg.browser,
      format: "umd",
    },
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
  ],
  plugins: [
    babel({
      exclude: "node_modules/**", // only transpile our source code
    }),
  ],
};