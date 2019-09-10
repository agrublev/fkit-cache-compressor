module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "3.2.1",
        loose: true,
        targets: {
          node: "current"
        }
      }
    ]
  ],
  plugins: [
    ["@babel/plugin-syntax-class-properties"],
    [
      "@babel/plugin-proposal-class-properties",
      {
        loose: true
      }
    ],
    "@babel/plugin-transform-runtime"
  ]
};
