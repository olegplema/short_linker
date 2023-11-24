const esbuild = require('esbuild')

const entryPoints = {
    'auth/signUp': 'src/auth/signUp.ts',
    'auth/signIn': 'src/auth/signIn.ts',
    'auth/authorizer': 'src/auth/authorizer.ts',
    'links/createLink': 'src/links/createLink.ts',
    'links/deactivateLink': 'src/links/deactivateLink.ts',
    'links/getList': 'src/links/getList.ts',
    'links/followLink':'src/links/followLink.ts',
    'notifications/checkLinkExpiration': 'src/notifications/checkLinkExpiration.ts',
    'notifications/sendEmail': 'src/notifications/sendEmail.ts',
}

Object.entries(entryPoints).map(([outputName, entryPoint]) => {
    return esbuild.buildSync({
        entryPoints: [entryPoint],
        bundle: true,
        outfile: `dist/${outputName}.js`,
        format: 'cjs',
    })
})
