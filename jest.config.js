export default {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
    '^.+\\.(js|jsx|mjs)$': 'babel-jest', // Ensure Babel processes JS/JSX files, including those from node_modules if needed
    '^.+\\.css$': 'jest-transform-stub', // Mocks CSS imports
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub', // Mocks static assets
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // if you have a setup file
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Handle module aliases
    // If you have specific CSS module configurations or other mappings, add them here
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // More robust CSS mocking for modules
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [ // Ensure node_modules are transformed if they use ES6+ syntax not supported by your Node version
    '/node_modules/(?!lucide-react).+\\.js$' // Example: transform lucide-react, ignore others by default
  ],
  collectCoverage: true,
  coverageReporters: ["json", "html"],
};
