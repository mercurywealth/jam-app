const SequentialUUID = require("sequential-uuid");
export default function generate() {
    return (new SequentialUUID({
        valid: true,
        dashes: true,
        unsafeBuffer: true
    })).generate();
}