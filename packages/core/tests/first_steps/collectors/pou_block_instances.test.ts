import { describe, it, expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';
import PlcController from "@/src/plcopen/plcController.js"

const first = fs.readFileSync(path.resolve(__dirname, '../first_steps.xml'), "utf-8")

describe('JSON-XML Transformations', () => {
  it('test', async () => {
    const collectors = new PlcController(first)
    console.dir(collectors.getPOUBlockInstances(), { depth: null })
  });
})
