"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const config_1 = require("../src/config");
(0, globals_1.test)('getOptional input should return optional when input is not present', () => {
    const out = (0, config_1.getOptionalInput)('no-key', 'someval');
    (0, globals_1.expect)(out).toBe('someval');
});
