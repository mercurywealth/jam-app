import {Like, MoreThan, getMetadataArgsStorage, ColumnOptions, InsertEvent, EntitySubscriberInterface, EventSubscriber, getConnection} from "typeorm";
import { EventListenerTypes } from "typeorm/metadata/types/EventListenerTypes";
import uuidgen from './uuid';
import {uuid2bin, bin2uuid} from './hexbin';
import {AuthenticationError} from 'apollo-server';
import { getMetadataStorage } from "type-graphql";
import Context from '../types/Context';
import { ParamMetadata } from "type-graphql/dist/metadata/definitions";

export enum Type {
    LIST,
    GET,
    CREATE,
    UPDATE,
    DELETE
}

export interface Options {
    search?: string | string[],
    paginated?: boolean | string,
    primaryField?: string,
    where?: {[key: string]: any}
}

// Setup
const PAGE_SIZE = 20;
var binaryFields = {};

export function Restricted(roles: string[] = [], rolesAnd: boolean = true): MethodDecorator{
    return function (target: any, key: string, descriptor: PropertyDescriptor){
        const ogMethod = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            const context: Context = args[args.length-1];
            if (!context.user) throw new AuthenticationError("You must be logged in to access this resource");
            if (context.user.hasRoles(roles, rolesAnd)) return ogMethod.apply(this, args)
            else throw new AuthenticationError("You do not have permission to access this resource")
        }
        const params = getMetadataStorage().params.filter((v:ParamMetadata)=>{
            return v.target == target.constructor;
        });
        //Context handler
        getMetadataStorage().collectHandlerParamMetadata({
            kind: "context",
            target: target.constructor,
            methodName: key,
            index: params.length,
            propertyName: ""
        });
    }
}

export function PrimaryUUIDColumn(){
    return function (object, propertyName) {
        var options = {
            primary: true,
            type: "varchar",
            length: 36,
        } as ColumnOptions;

        object.setupUUID = ()=>{
            object[propertyName] = uuidgen();
        }
        // object.fixUUID = ()=>{
        //     object[propertyName] = uuid2bin(object[propertyName]);
        // }
        // object.returnUUID = ()=>{
        //     object[propertyName] = bin2uuid(object[propertyName]);
        // }
        // if (!binaryFields[object.constructor]) binaryFields[object.constructor] = [];
        // binaryFields[object.constructor].push(propertyName);
        // Buffer.prototype.valueOf = function() {
        //     return bin2uuid(this);
        // };
        getMetadataArgsStorage().columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: "regular",
            options: options
        });
        getMetadataArgsStorage().entityListeners.push({
            target: object.constructor,
            propertyName: "setupUUID",
            type: EventListenerTypes.BEFORE_INSERT
        });
        // getMetadataArgsStorage().entityListeners.push({
        //     target: object.constructor,
        //     propertyName: "returnUUID",
        //     type: EventListenerTypes.AFTER_INSERT
        // });
        // getMetadataArgsStorage().entityListeners.push({
        //     target: object.constructor,
        //     propertyName: "fixUUID",
        //     type: EventListenerTypes.BEFORE_UPDATE
        // });
        // getMetadataArgsStorage().entityListeners.push({
        //     target: object.constructor,
        //     propertyName: "returnUUID",
        //     type: EventListenerTypes.AFTER_UPDATE
        // });

    }
}

// Generate default behaviour for CRUD ops
function GenerateDefault(type: Type, cl: any, options: Options = {}): MethodDecorator{
    // Method Decorator
    return function (target: any, key: string, descriptor: PropertyDescriptor){
        // Backup original method
        const ogMethod = descriptor.value;
        // Override method with default code
        descriptor.value = async function(...args: any[]){
            // Run the original method, so that we can still put code in there!
            const r = await ogMethod.apply(this, args);
            if (r != undefined && r!= null) return r; //If the og method returns data, return it here and skip the rest of the op. 
            const id = args[0];
            var item = null;

            // Context
            const params = getMetadataStorage().params.filter((v:ParamMetadata)=>{
                return v.target == target.constructor;
            });
            getMetadataStorage().collectHandlerParamMetadata({
                kind: "context",
                target: target.constructor,
                methodName: key,
                index: params.length,
                propertyName: ""
            });
            const me = args[args.length-1];

            //Get any relation columns for this type
            var relations = [];
            getConnection().getMetadata(cl).relations.forEach(v=>{
                relations.push(v.propertyName)
            });
            var ops = {where: {}, relations: relations, skip: 0, take: PAGE_SIZE}

            //Add where to ops
            if (options.where){
                for(var k in options.where){
                    if (options.where[k].indexOf("@") === 0){
                        switch(options.where[k]){
                            case "@me.id":
                                options.where[k] = me.user.id;
                            break;
                            case "@me.team": 
                                options.where[k] = me.user.team;
                            break;
                            case "@me.company":
                                options.where[k] = me.user.company;
                            break;
                        }
                    }
                    ops.where[k] = options.where[k];
                }
            }

            // Handle the request, depending on CRUD op type
            switch(type){
                case Type.LIST: 
                    const keys = Object.keys(options);
                    for(var i = 0; i < keys.length; i++){
                        const k = keys[i];
                        if (i >= args.length) break;
                        switch(k){
                            case "paginated":
                                const key = typeof options.paginated == "boolean" ? (options.paginated ? "id" : null) : options.paginated;
                                //const pops = {where:{}};
                                if (key){
                                    ops[key] = MoreThan(args[i]);
                                }
                            break;
                            case "search":
                                if (typeof options.search == "object"){
                                    options.search.forEach((v: any)=>{
                                        if (typeof args[i] == "object"){
                                            if (args[i][v]) ops[v] = Like("%"+args[i][v]+"%");
                                            console.log(args[i][v])
                                        }else{
                                            if (args[i]) ops[v] = Like("%"+args[i]+"%")
                                        }
                                    });
                                }else{
                                    ops.where[options.search] = Like("%"+args[i]+"%");
                                }
                            break;
                        }
                    }
                    return await cl.find(ops);
                case Type.GET:
                    const where = {};
                    where[options.primaryField ? options.primaryField : "id"] = id;
                    ops.where = where;
                    item = await cl.findOne(ops);
                    if (!item) throw new Error(`${cl.name} with ID "${id}" not found`);
                    return item;
                case Type.CREATE:
                    item = cl.create(args[0]);
                    await item.save();
                    return item;
                case Type.DELETE:
                    item = await cl.findOne({where: {id}});
                    if (!item) throw new Error(`${cl.name} with ID "${id}" not found`);
                    await item.remove();
                    return true;
                case Type.UPDATE:
                    item = await cl.findOne({where: {id}});
                    if (!item) throw new Error(`${cl.name} with ID "${id}" not found!`);
                    Object.assign(item, args[1]);
                    await item.save();
                    return item;
            }
        }
    }
}

export function List(cl: any, options: Options = {}): MethodDecorator{
    return GenerateDefault(Type.LIST, cl, options);
}
export function Get(cl: any, options: Options = {}): MethodDecorator{
    return GenerateDefault(Type.GET, cl, options);
}
export function Create(cl: any, options: Options = {}): MethodDecorator{
    return GenerateDefault(Type.CREATE, cl, options);
}
export function Delete(cl: any, options: Options = {}): MethodDecorator{
    return GenerateDefault(Type.DELETE, cl, options);
}
export function Update(cl: any, options: Options = {}): MethodDecorator{
    return GenerateDefault(Type.UPDATE, cl, options);
}
