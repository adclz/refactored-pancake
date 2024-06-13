import { describe, it, expect, test } from 'vitest';
import get from "@/src/i18n/getText.js"

describe('I18n', () => {
    test('de_DE', () => {
        get.setLocale("de_DE")
        expect(get.__(" Warning...")).to.be.eq("Warnung...")
        expect(get.__(`"%1" POU doesn't exist !!!`, "MyPou")).to.be.eq(`Baustein "MyPou" existiert nicht !!!`)
    }) 
    test('fr_FR', () => {
        get.setLocale("fr_FR")
        expect(get.__(" Warning...")).to.be.eq("Attention...")
        expect(get.__(`"%1" POU doesn't exist !!!`, "MyPou")).to.be.eq(`Le POU "MyPou" n'existe pas !!!`)
    })
})