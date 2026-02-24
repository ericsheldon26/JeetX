const CompileAPIActions = async (actions) => {
    const transformedObject = actions.reduce((acc, curr) => {
        const systemName = curr.systemId.systemName;
        const systemKey = curr.systemId.systemKey;

        const subSystemName = curr.subSystemId.subSystemName;
        const subSystemKey = curr.subSystemId.subSystemKey;
        const subSystemIcon = curr.subSystemId.subSystemIcon;
        const subSystemIndexing = curr.subSystemId.indexing;

        const moduleName = curr.moduleId.moduleName;
        const moduleKey = curr.moduleId.moduleKey;
        const moduleIcon = curr.moduleId.moduleIcon;
        const moduleIndexing = curr.moduleId.indexing;

        const subModuleName = curr.subModuleId.subModuleName;
        const subModuleKey = curr.subModuleId.subModuleKey;
        const subModuleIcon = curr.subModuleId.subModuleIcon;
        const subModuleIndexing = curr.subModuleId.indexing;
        const actionKey = curr.actionKey;

        if (!acc[systemName]) {
            acc[systemName] = {
                systemName,
                systemKey,
                subSystems: {}
            };
        }
        if (!acc[systemName].subSystems[subSystemName]) {
            acc[systemName].subSystems[subSystemName] = {
                subSystemName,
                subSystemKey,
                subSystemIcon,
                subSystemIndexing,
                modules: {}
            };
        }
        if (!acc[systemName].subSystems[subSystemName].modules[moduleName]) {
            acc[systemName].subSystems[subSystemName].modules[moduleName] = {
                moduleName,
                moduleKey,
                moduleIcon,
                moduleIndexing,
                subModules: []
            };
        }
        acc[systemName].subSystems[subSystemName].modules[moduleName].subModules.push({
            subModuleName,
            subModuleKey,
            subModuleIcon,
            subModuleIndexing,
            actionKey
        });
        return acc;
    }, {});
    const actionMenu = Object.values(transformedObject).map(system => {
        // Sort subSystems
        const sortedSubSystems = Object.values(system.subSystems).sort(
            (a, b) => a.subSystemIndexing - b.subSystemIndexing
        );

        return {
            systemName: system.systemName,
            systemKey: system.systemKey,
            systemIcon: system.systemIcon,
            subSystems: sortedSubSystems.map(subsystem => {
                // Sort modules
                const sortedModules = Object.values(subsystem.modules).sort(
                    (a, b) => a.moduleIndexing - b.moduleIndexing
                );

                return {
                    subsystemName: subsystem.subsystemName,
                    subsystemKey: subsystem.subsystemKey,
                    subsystemIcon: subsystem.subsystemIcon,
                    modules: sortedModules.map(module => {
                        // Sort subModules
                        const sortedSubModules = module.subModules.sort(
                            (a, b) => a.subModuleIndexing - b.subModuleIndexing
                        );

                        return {
                            moduleName: module.moduleName,
                            moduleKey: module.moduleKey,
                            moduleIcon: module.moduleIcon,
                            subModules: sortedSubModules.map(submodule => ({
                                subModuleName: submodule.subModuleName,
                                subModuleKey: submodule.subModuleKey,
                                subModuleIcon: submodule.subModuleIcon,
                                // indexing: submodule.subModuleIndexing
                            }))
                        };
                    })
                };
            })
        };
    });

    // Get the permissions

    return actionMenu;
}

module.exports = CompileAPIActions;