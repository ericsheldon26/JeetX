const CompileActionsAtLogin = async (actions) => {
    const transformedObject = actions.reduce((acc, curr) => {
        const {
            // systemId = {},
            subSystemId = {}, moduleId = {}, subModuleId = {} } = curr;
        // const system = {
        //     name: systemId.systemName || '',
        //     key: systemId.systemKey || '',
        //     indexing: systemId.indexing || 0
        // };
        const subSystem = {
            name: subSystemId.subSystemName || '',
            key: subSystemId.subSystemKey || '',
            icon: subSystemId.subSystemIcon || '',
            indexing: subSystemId.indexing || 0
        };

        const module = {
            name: moduleId.moduleName || '',
            key: moduleId.moduleKey || '',
            icon: moduleId.moduleIcon || '',
            indexing: moduleId.indexing || 0
        };

        const subModule = {
            subModuleName: subModuleId.subModuleName || '',
            subModuleKey: subModuleId.subModuleKey || '',
            subModuleIcon: subModuleId.subModuleIcon || '',
            subModuleIndexing: subModuleId.indexing || 0,
            // permissions: permissions
        };

        if (!acc[subSystem.name]) {
            acc[subSystem.name] = {
                subSystemName: subSystem.name,
                subSystemKey: subSystem.key,
                subSystemIcon: subSystem.icon,
                subSystemIndexing: subSystem.indexing,
                modules: {}
            };
        }

        if (!acc[subSystem.name].modules[module.name]) {
            acc[subSystem.name].modules[module.name] = {
                moduleName: module.name,
                moduleKey: module.key,
                moduleIcon: module.icon,
                moduleIndexing: module.indexing,
                subModules: []
            };
        }

        acc[subSystem.name].modules[module.name].subModules.push(subModule);

        return acc;
    }, {});

    const actionMenu = Object.values(transformedObject)
        .sort((a, b) => a.subSystemIndexing - b.subSystemIndexing) // sort subsystems
        .map(subSystem => ({
            subSystemName: subSystem.subSystemName,
            subSystemKey: subSystem.subSystemKey,
            subSystemIcon: subSystem.subSystemIcon,
            modules: Object.values(subSystem.modules)
                .sort((a, b) => a.moduleIndexing - b.moduleIndexing) // sort modules
                .map(module => ({
                    moduleName: module.moduleName,
                    moduleKey: module.moduleKey,
                    moduleIcon: module.moduleIcon,
                    subModules: module.subModules
                        .sort((a, b) => a.subModuleIndexing - b.subModuleIndexing) // sort submodules
                        .map(subModule => ({
                            subModuleName: subModule.subModuleName,
                            subModuleKey: subModule.subModuleKey,
                            subModuleIcon: subModule.subModuleIcon,
                            // permissions: subModule.permissions
                        }))
                }))
        }));

    // Get the permissions
    const permissions = actions.map(item => item.permissions);

    return { permissions, actionMenu };
}

module.exports = CompileActionsAtLogin;