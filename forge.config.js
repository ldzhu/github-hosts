module.exports = {
    hooks: {
        postMake: async (forgeConfig, options) => {
            const makeResult = options[0];
            console.log(`Completed make for ${makeResult.platform} / ${makeResult.arch} at ${makeResult.artifacts[0]}`);
        }
    },
    packagerConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "Github Hosts"
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: [
                "darwin"
            ]
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {}
        }
    ]
}
