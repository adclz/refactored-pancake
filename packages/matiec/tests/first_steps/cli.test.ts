import {expect, test} from 'vitest'
//@ts-ignore No d.ts 
import Module from "../../src/matiec/iec2c.js"
import * as fs from "node:fs";
import * as path from "node:path";

// Assuming matiec is present in the output directory
// If not, run the DockerFile first

// In this test, we transpile the ST output of beremiz 'first_steps' example into c using iec2c wasm binary.
test('iec2c test [First Steps]', async () => {
    const testPlc = fs.readFileSync("./tests/first_steps/plc.st", "utf-8")
    
    const args = [
        "-I", "/lib", 
        "-T", "/test", "/test/plc.st"
    ]
    await Module({
        // Mandatory since FS has to be mounted before main fn is called
        noInitialRun: true,
        onRuntimeInitialized: function() {
            this.FS.mkdir('/lib');
            
            // Copy the lib directory inside emscripten FS 
            fs.readdirSync("./src/matiec/lib", { withFileTypes: true })
                .forEach(file => {
                if (file.isFile()) {  
                    const localContent = fs.readFileSync(path.join("./src/matiec/lib", file.name), 'utf-8');
                    this.FS.writeFile('/lib/' + file.name, localContent);
                } 
            })
            
            // Test folder with first_steps ST code            
            this.FS.mkdir('/test');
            this.FS.writeFile('/test/plc.st', testPlc)
            
            // Call iec2c 
            const status = this.callMain(args);  
            
            // Same error codes as beremiz
            expect(status).toBe(0);
            
            // No unit tests here but just checking in the console if c code is generated
            const files = this.FS.readdir('/test');
            console.log(files)
            for (const file of files) {
                if(file !== '.' && file !== '..') {
                    const content = this.FS.readFile('/test/' + file, { encoding: 'utf8' });
                    console.log("--- FILE: " + file)
                    console.log(content);  
                }
            }
        }
    })
})