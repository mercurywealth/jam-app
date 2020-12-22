import * as HexBin from './hexbin';

test("hex2bin", () => {
    const result = HexBin.hex2bin("6578616d706c65206865782064617461");
    expect(result).toBeInstanceOf(Buffer);
    expect(result).toMatchObject(Buffer.from("example hex data"));
});

test("bin2hex", ()=>{
    const result = HexBin.bin2hex(Buffer.from("example hex data"));
    expect(result).toBe("6578616d706c65206865782064617461");
});

test("uuid2bin", ()=>{
    const result = HexBin.uuid2bin("75442486-0878-440c-9db1-a7006c25a39f");
    expect(result).toBeInstanceOf(Buffer);
    expect(result).toMatchObject(Buffer.from("754424860878440c9db1a7006c25a39f", "hex"));
});

test("bin2uuid", ()=>{
    const result = HexBin.bin2uuid(Buffer.from("754424860878440c9db1a7006c25a39f", "hex"));
    expect(result).toBe("75442486-0878-440c-9db1-a7006c25a39f");
});