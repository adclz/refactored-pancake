/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from "node:path"
import fs from "node:fs"
import child_process from "node:child_process"
import findNodeModules from "find-node-modules"

const modulesDir = findNodeModules()
const tmp = path.join(process.cwd(), modulesDir[0], "/tmp")
if (!fs.existsSync(tmp)) fs.mkdirSync(tmp)

// Replace the content of a xslt file into a saxon SEF schema
// xslt3 does not have to be installed globally
const xsltToSef = (id: string) => {
  const xslt3Path = path.join(process.cwd(), modulesDir[0], "/xslt3/xslt3.js")
  
  const tmpFile = path.join(tmp, path.basename(id))
  const tmpCode = fs.readFileSync(id, "utf-8")
      .replace('xmlns:ns="beremiz"', 'xmlns:ns="http://saxonica.com/ns/globalJS"')
      .replace('version="1.0"', 'version="3.0"')
  
  fs.writeFileSync(tmpFile, tmpCode)
  
  const sefJsonPath = id.replace(".xslt", ".sef.json");
  child_process.spawnSync("node", [`${xslt3Path}`, `-xsl:${tmpFile}`, `-export:${sefJsonPath}`])

  const code = fs.readFileSync(sefJsonPath, 'utf8')
  fs.rmSync(sefJsonPath)
  return code
}

const poToJson = (id: string) => {
  const po2JsonPath = path.join(process.cwd(), modulesDir[0], "/gettext.js/bin/po2json")

  const poJsonPath = path.join(tmp, path.basename(id))
  child_process.spawnSync("node", [`${po2JsonPath}`, `${id}`, `${poJsonPath}`])

  let code = fs.readFileSync(poJsonPath, 'utf8')
      .replaceAll("%s", "%1")

  for (let i = 1; i <= 5; i++)
    code = code.replaceAll(`a${i}`, `%${i}`)
  
  fs.rmSync(poJsonPath)
  return code
}

export default defineConfig({
  plugins: [
    {
      name: 'assets transform',
      transform(code, id) {
        if ((/\.(xml|xsd|xslt|csv|po)$/).test(id)) {

          if ((/\.(xslt)$/).test(id)) code = xsltToSef(id)
          if ((/\.(po)$/).test(id)) return {
              code: `export default ${poToJson(id)}`,
              map: { mappings: "" }
            }

          const json = JSON.stringify(code)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')

          return {
            code: `export default ${json};`,
            map: { mappings: "" }
          };
        }
      }
    }
  ]
})