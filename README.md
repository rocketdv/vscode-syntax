# Vscode Syntax Creator Tool

I decided to make this tool while working on extensions for my custom language, but tmLanguage seemed to tedious and didn't work for me. THIS IS NOT PRODUCTION READY. This is a proof of concept, it will surely be too slow on large files.

Clone this repo and run `yarn install` (or `npm install`) and create a file called `syntax.syn` just like below
```ruby
def ruleName regexMatcher #colorCode

# e.g.

def r_brack \[ #ffffff
```
* Rule names can not contain any special characters and must start with a letter

Once you are satisfied with you rules, run `node . -i <path to .syn syntax> -o <output .js file>` e.g. `node . -i test.syn -o extension.js`. Then follow the steps to create a basic vscode language extension and set activation events in your `package.json` to
```json
"activationEvents": [
    "onLanguage:<language id here>"
]
```
and the main field to
```json
"main": "./out/extension.js"
```
and then place the generated javascript file in `./out/extension.js` and install your extension