import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import excludeDependencies from "rollup-plugin-exclude-dependencies-from-bundle"

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "app/assets/javascripts/stimulus_aria_widgets.js",
        format: "es",
      },
    ],
    plugins: [
      resolve(),
      typescript(),
      excludeDependencies(),
    ],
  },
]
