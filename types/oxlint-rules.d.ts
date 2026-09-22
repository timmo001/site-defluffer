// The shared package does not yet publish declarations for its config exports.
declare module "@timmo001/oxlint-rules/configs/recommended" {
  const recommended: import("oxlint").OxlintConfig;
  export default recommended;
}
