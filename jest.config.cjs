/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  maxWorkers: 1,
  clearMocks: true,
  testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },
};
