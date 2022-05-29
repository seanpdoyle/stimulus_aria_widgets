import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"

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
    ],
  },
]
