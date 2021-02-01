const metadata_uri = `https://${process.env.B2C_TENANT}.b2clogin.com/${process.env.B2C_TENANT}.onmicrosoft.com/${process.env.B2C_FLOW}/v2.0/.well-known/openid-configuration`;

async function fetchMetadata() {
    const response = await fetch(metadata_uri);
    return await response.json();
}

export async function get(key?: string) {
    const metadata = await fetchMetadata();
    if (key) return metadata[key];
    return metadata;
}