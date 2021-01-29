var rmrf = require("rimraf");

//Cleanup the dist folder
async function cleanup() {
    await new Promise((pass,reject)=>{
        rmrf("./dist", (error)=>{
            if(error) reject(error);
            else pass();
        });
    });
}
cleanup();