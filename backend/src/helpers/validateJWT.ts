import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa'
import logger from './log'
import * as Metadata from '@helpers/metadata';
import { AuthenticationError } from 'apollo-server';

const log = logger("jwt")
var metadata: {[key: string]: any} = {};

function getKey(header, callback) {
    const client = jwksClient({
        jwksUri: metadata["jwks_uri"]
    });
    client.getSigningKey(header.kid, (err,key: any)=>{
        if (err){
            callback(err, null)
        }else{
            var signingKey = key.getPublicKey() || key.rsaPublicKey
            callback(null, signingKey)
        }
    })
}

export async function isTokenValid(token: string) {
    const enviss = process.env.JWT_ISSUER ? process.env.JWT_ISSUER.split(",") : [];
    metadata = await Metadata.get();
    return new Promise((resolve, reject)=>{
        const options = {
            audience: process.env.JWT_AUDIENCE.split(","),
            issuer: [...enviss, metadata["issuer"]]
        };
        jwt.verify(token, getKey, options, (err, decoded)=>{
            if (err){
                log.error(err);
                reject(err);
            } else {
                resolve(decoded);
            }
        })
    });
}