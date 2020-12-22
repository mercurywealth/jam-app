import uuid from './uuid'

test("uuid generation", ()=>{
    expect(uuid()).toMatch(/([a-f0-9]{8})-([a-f0-9]{4})-([a-z0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})/gm)
})