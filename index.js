const package = require('./package.json')
const fs = require('fs')
const path = require('path')
const generator = require('./src/generator')

const commander = require('commander')
const program = new commander.Command()
program
    .version(package.version)
    .option('-i, --input <file>', 'input a .syn file')
    .option('-o, --output <file>', 'output file .js')
    .parse(process.argv)



if (!fs.existsSync(program.output)) {
    fs.mkdirSync(path.dirname(program.output), { recursive: true })
}

let src = fs.readFileSync(program.input, 'utf8')
let source = generator.parse(src)

fs.writeFileSync(program.output, source)