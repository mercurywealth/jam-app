const tenant = process.env.REACT_APP_B2C_TENANT!;
const subdomain = tenant.split(".")[0];
const flow = process.env.REACT_APP_B2C_SIGNINFLOW!;
const resetflow = process.env.REACT_APP_B2C_RESETFLOW!;

export default {
    authorities: {
        login: `https://${subdomain}.b2clogin.com/tfp/${tenant}/${flow}`,
        reset: `https://${subdomain}.b2clogin.com/tfp/${tenant}/${resetflow}`,
    }
}