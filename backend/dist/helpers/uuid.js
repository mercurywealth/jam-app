"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SequentialUUID = require("sequential-uuid");
function generate() {
    return (new SequentialUUID({
        valid: true,
        dashes: false,
        unsafeBuffer: true
    })).generate();
}
exports.default = generate;
//# sourceMappingURL=uuid.js.map