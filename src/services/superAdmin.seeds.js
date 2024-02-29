const { generateId } = require('../utils/helpers');
const { Encryption } = require('../utils/encryption');
const Users = require('../model/user.model');
const userId = generateId();
const userSalt = Encryption.makeUserSalt(16);
const encryptPassword = Encryption.encryptPassword("Super@123", userSalt);
const superSeeds = {
    firstName:"super",
    lastName:"admin",
    email:"superadmin@yopmail.com",
    password:encryptPassword,
    userType:"superadmin",
    userId,
    parentId:userId,
    parentTree:[userId],
    emailVerified:true,
    userSalt
};

/**
 * @description This is SuperAdmin creation 
 */
exports.createSuperAdmin = async()=>{
    const count = await Users.findOne({},{_id:1});
    if(!count){
        await Users.create(superSeeds);
    }
};