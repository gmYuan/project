function anonymous(obj) {
    let str = '';
    with(obj) {
        str += `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        ${name} ${age}
        `
        arr.forEach(item => {
            str += `
    
            <li>${item}</li>
        `
        })
        str += `
    
    </body>
    </html>`
    }
    return str;
}
let r = anonymous({arr:[1,2,3]});
console.log(r)