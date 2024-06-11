import { describe, it, expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';
import {validateTc6} from "@/src/plcopen/tc6/xsdValidation.js";
import {XmlValidateError} from "libxml2-wasm";

const first = fs.readFileSync(path.resolve(__dirname, '../first_steps.xml'), "utf-8")
const firstInvalid = fs.readFileSync(path.resolve(__dirname, '../first_steps_invalid.xml'), "utf-8")

describe('TC6 validation', () => {
    test('Valid TC6', async () => {
        expect(validateTc6(first)).eq(true)
    });
    test('Invalid TC6', async () => {
        // first_steps_invalid has a missing required 'pouType' attribute for Pou AverageVal at line 23
        const result = validateTc6(firstInvalid) as XmlValidateError
        
        // Expect an error of type XMlValidateError
        expect(result).to.be.instanceof(XmlValidateError)
        
        // Expect a message to contain poutType missing
        expect(result.message)
            .to.includes("The attribute 'pouType' is required but missing")
    });
})