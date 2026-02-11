"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
askingpath();
function askingpath() {
    rl.question('Please enter the path for the file (default: current directory): ', (answer) => {
        if (answer == 'exit') {
            rl.close();
            return;
        }
        let filepath = answer || 'tree.txt';
        let dir = path.dirname(filepath);
        if (answer == '.' || answer == '..') {
            filepath = filepath + '/tree.txt';
            askingheight(filepath);
        }
        if (fs.existsSync(dir)) {
            askingheight(filepath);
        }
        else {
            console.log('Directory does not exist. Try again or type \'exit\'');
            askingpath();
        }
    });
}
function askingheight(filepath) {
    rl.question('Please enter height of the tree: ', (answer) => {
        if (isNaN(parseInt(answer)) || parseInt(answer) <= 1) {
            if (answer == 'exit') {
                rl.close();
                return;
            }
            else {
                console.log('Wrong value! Try again or type \'exit\'');
                askingheight(filepath);
            }
        }
        else {
            const tree = tree_gen(parseInt(answer));
            fs.writeFileSync(filepath, tree.join('\n'));
            rl.close();
        }
    });
}
function tree_gen(height) {
    console.log('Width of the tree is: ' + (1 + (height - 1) * 4) + ' symbols');
    let image = [];
    //star
    let firstrow = '';
    for (let j = (height - 1) * 2; j >= 0; j--) {
        firstrow = firstrow.concat(' ');
    }
    firstrow = firstrow.concat('W');
    image.push(firstrow);
    //main part
    for (let i = 0; i < height; i++) {
        let row = '';
        let leaves = '';
        let space = '';
        for (let j = (height - 1) * 2 - 2 * i; j >= 0; j--) {
            if ((i % 2 != 0) && (j == 0)) {
                space = space.concat('@');
            }
            else {
                space = space.concat(' ');
            }
        }
        row = row.concat(space);
        for (let k = 0; k < (2 + (height - 1) * 2 - space.length) * 2 - 1; k++) {
            leaves = leaves.concat('*');
        }
        row = row.concat(leaves);
        if ((i % 2 == 0) && (i != 0)) {
            row = row.concat('@');
        }
        image.push(row);
    }
    //tree trunc
    for (let i = 0; i < 2; i++) {
        let trunc = '';
        for (let j = (height - 1) * 2 - 2; j >= 0; j--) {
            trunc = trunc.concat(' ');
        }
        trunc = trunc.concat('TTTTT');
        image.push(trunc);
    }
    return image;
}
