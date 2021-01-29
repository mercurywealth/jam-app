import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa'
import logger from './log'

const log = logger("jwt")
const client = jwksClient({
    jwksUri: process.env.B2C_JWKSURI
});
export function getKey(header, callback) {
    client.getSigningKey(header.kid, (err,key: any)=>{
        if (err){
            callback(err, null)
        }else{
            var signingKey = key.getPublicKey() || key.rsaPublicKey
            callback(null, signingKey)
        }
    })
}

export function isTokenValid(token: string) {
    return new Promise((resolve)=>{
        const options = {
            audience: process.env.JWT_AUDIENCE.split(","),
            issuer: process.env.JWT_ISSUER.split(",")
        };
        jwt.verify(token, getKey, options, (err, decoded)=>{
            if (err){
                resolve(false);
            } else {
                resolve(decoded);
            }
        })
    });
}