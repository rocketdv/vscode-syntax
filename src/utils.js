exports.getLines = function (src) {
    return src
        .split('\n')
        .map(x => x.trim())
        .filter(x => x)
        .filter(x => !x.startsWith('#'))
}


exports.parseLine = function (line) {
    let cmd = line.slice(0, line.indexOf(' '))
    let args = exports.getArgs(line.slice(line.indexOf(' '))) // .map(x => x.trim())
    // .filter(x => x)


    // console.log([args, cmd])

    switch (cmd) {
        case 'def':
            return exports.parseDef(args)
            break
        default:
            console.log(cmd)
    }
}


exports.parseDef = function (def) {
    let res = {
        color: null,
        match: null,
        name: null
    }

    res.name = def.shift()
    let reg = def.shift()
    res.match = new RegExp('^' + reg)

    if (def.length > 0) {
        res.color = def.shift()
    }

    return res
}


exports.escapeReg = function (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}


exports.generateStyleCode = function (rule) {
    let code = ''
    let options = '{'
    if (rule.color) {
        options += `color: '${rule.color}'`
    }
    options += '}'
    let styleVar = rule.name + 'Style'
    code += `const ${styleVar} = vscode.window.createTextEditorDecorationType(${options});`


    return code
}

exports.generateMatcherCode = function (rule) {
    let code = ''
    code += `function(s) {
        let match = 0;
        if (!(match=s.match(${rule.match.toString()}))) {
            return 0
        } 
        const startPos = activeEditor.document.positionAt(i);
        const endPos = activeEditor.document.positionAt(i + match[0].length);
        ${rule.name}s.push({
            range: new vscode.Range(startPos, endPos)
        });
        return match[0].length;
    }`


    return code
}


exports.getArgs = function (args) {
    args = args.trim()
    let name = args.slice(0, args.indexOf(' ')).trim()
    args = args.replace(name, '').trim()
    let color = args.slice(args.lastIndexOf('#')).trim()
    args = args.replace(color, '').trim()
    let reg = args
    return [name, reg, color]
}