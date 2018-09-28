import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';
import deepPurple from '@material-ui/core/colors/deepPurple';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';
import lightBlue from '@material-ui/core/colors/lightBlue';
import cyan from '@material-ui/core/colors/cyan';
import teal from '@material-ui/core/colors/teal';
import green from '@material-ui/core/colors/green';
import lightGreen from '@material-ui/core/colors/lightGreen';
import lime from '@material-ui/core/colors/lime';
import yellow from '@material-ui/core/colors/yellow';
import amber from '@material-ui/core/colors/amber';
import orange from '@material-ui/core/colors/orange';
import deepOrange from '@material-ui/core/colors/deepOrange';
import brown from '@material-ui/core/colors/brown';
import grey from '@material-ui/core/colors/grey';
import blueGrey from '@material-ui/core/colors/blueGrey';

let randomColors = [];
let muiColors = [red, deepPurple, lightBlue, green, yellow, deepOrange, blueGrey,
    pink, indigo, cyan, lightGreen, amber, brown, purple, blue, teal, lime, orange, grey
];

for (let c = 800; c >=200; c -= 100) {
    for (let i = 0; i < muiColors.length; i++) {
        randomColors.push(muiColors[i][c]);
    }
}

export default function getRandomColors(index){
    if(index < randomColors.length){
        return randomColors[index];
    }
    else{
        var newIndex = index % randomColors.length;
        return randomColors[newIndex];
    }
}
