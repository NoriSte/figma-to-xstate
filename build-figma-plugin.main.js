/**
 *
 * @param {import('esbuild').BuildOptions} buildOptions
 * @returns  {import('esbuild').BuildOptions} esbuild options
 */
module.exports = function (buildOptions) {
  return {
    ...buildOptions,
    mainFields: ['module', 'main', 'browser'],
  }
}
