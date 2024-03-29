import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import typescript from 'rollup-plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'

import pkg from './package.json'

const config = {
  input: 'src/index.ts',
  output: {
    file: pkg.module,
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript({lib: ["es5", "es6", "dom"], target: "es5"}),
    external(),
    url(),
    resolve(),
    commonjs({
      include: [
        'node_modules/**'
      ],
      exclude: [
        'node_modules/process-es6/**'
      ],
      namedExports: {
        'node_modules/react/index.js': [
          'Fragment',
          'Children',
          'Component',
          'PropTypes',
          'createElement',
          'createRef',
          'useContext'
        ],
        'node_modules/react-dom/index.js': ['render']
      }
    })
  ],
  external: ['immer', 'react', 'react-dom']
}

export default [
  config,
  {
    ...config,
    plugins: [
      ...config.plugins,
      uglify()
    ],
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    }
  }]
