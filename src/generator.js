const utils = require('./utils')

exports.parse = function (source) {
    let lines = utils.getLines(source)

    let rules = []

    for (let line of lines) {
        let rule = utils.parseLine(line)
        rules.push(rule)
    }

    return exports.generateCode(rules)
}


exports.generateCode = function (rules) {
    // console.log(rules)

    const base = `"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
exports.activate = function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log('decorator sample is activated');
        let timeout = undefined;
        let activeEditor = vscode.window.activeTextEditor;
        {{styles}}
        function updateDecorations() {
            if (!activeEditor) {
                return;
            }
            {{matches}}
            let text = activeEditor.document.getText();
            console.log(text);
            let i = 0
            while (i < text.length) {
                let consumed = {{matchers}}.map(x => x(text.substring(i))).filter(x=>x>0).shift()
                if (consumed) {
                    i += consumed
                    continue
                }
                i++
            }
            {{set_styles}}
        }
        function triggerUpdateDecorations() {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
            timeout = setTimeout(updateDecorations, 0);
        }
        if (activeEditor) {
            triggerUpdateDecorations();
        }
        vscode.window.onDidChangeActiveTextEditor(editor => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations();
            }
        }, null, context.subscriptions);
        vscode.workspace.onDidChangeTextDocument(event => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations();
            }
        }, null, context.subscriptions);
    });
}
exports.deactivate = function deactivate() { };`

    let styleCode = rules.map(x => utils.generateStyleCode(x))
    let matcherCode = rules.map(x => utils.generateMatcherCode(x))

    let res = base
        .replace('{{styles}}', styleCode.join('\n'))
        .replace('{{matches}}', rules.map(x => `const ${x.name}s = [];`).join('\n'))
        .replace('{{matchers}}', `[${matcherCode.join(',')}]`)
        .replace('{{set_styles}}', rules.map(x=>`activeEditor.setDecorations(${x.name}Style, ${x.name}s);`).join('\n'))


    return res
}
