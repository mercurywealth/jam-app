export function hex2bin(hex){
    return (parseInt(hex, 16)).toString(2).substr(0, 16);
}

export function bin2hex(bin){
    return bin.toString("hex");
}

export function uuid2bin(uuid){
    return Buffer.from(uuid.replace(/\-/gm, ""), "hex");
}

export function bin2uuid(bin){
    var hex = bin2hex(bin).toString();
    return hex.replace(/([\w]{8})([\w]{4})([\w]{4})([\w]{4})([\w]{12})/gm, "$1-$2-$3-$4-$5");
}