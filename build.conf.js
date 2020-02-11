module.exports = {
    module: {
        name: 'pipSystem',
        styles: 'index',
        export: 'pip.system',
        standalone: 'pip.system'
    },
    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        sass: true,
        lib: true,
        images: true,
        dist: false
    },
    file: {
        lib: [
            '../node_modules/pip-webui-all/dist/**/*',
            '../node_modules/pip-suite-all/dist/**/*',
            '../pip-admin-shell/dist/**/*'
        ]
    },
    samples: {
        port: 8187,
        https: false
    },
    api: {
        port: 8188
    }
};
