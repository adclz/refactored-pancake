import { build } from 'esbuild';
import path from "node:path"
import fs from "node:fs"
import child_process from "node:child_process"
import findNodeModules from "find-node-modules"

const modulesDir = findNodeModules()

// Replace the content of a xslt file into a saxon SEF schema
// xslt3 does not have to be installed globally
const xsltToSef = (id) => {
  const xslt3Path = path.join(modulesDir[0], "/xslt3/xslt3.js")
  const sefJsonPath = id.replace(".xslt", ".sef.json");
  child_process.spawnSync("node", [`${xslt3Path}`, `-xsl:${id}`, `-export:${sefJsonPath}`], { cwd: process.cwd() })
    
  const code = fs.readFileSync(sefJsonPath, 'utf8')
      .replace("xmlns:ns=\"beremiz\"", "xmlns:ns=\"http://saxonica.com/ns/globalJS\"")
      .replace("version=\"1.0\"", "version=\"3.0\"")
  fs.rmSync(sefJsonPath)
  return code
}

export const esbuildOptions = {
    entryPoints: ['./src/**/*'],
    outdir: 'dist',
    format: 'esm',
    bundle: true,
    target: ['esnext'],
    plugins: [
        {
            name: 'assets transform',
            setup(build) {
                build.onLoad({ filter: /\.(xml|xsd|xslt|csv)$/ }, async (args) => {
                    if ((/\.(xslt)$/).test(args.path)) {
                        return {
                            contents: xsltToSef(args.path),
                            loader: 'json'
                        };
                    }
                    return {
                        contents: await fs.promises.readFile(args.path, 'utf8'),
                        loader: 'text'
                    };
                });
            }
        },
        {
            name: 'assets name to js',
            setup(build) {
                build.onResolve({ filter: /.*/ }, (args) => {
                    return {
                        path: args.path.replace(/\.(xml|xsd|xslt|csv)$/, '.js'),
                        external: true
                    };
                });
            }
        }
    ],
    loader: { 
        '.md': 'copy',
        '.d.ts': 'copy'
     }
}

build(esbuildOptions).catch(() => process.exit(1));
