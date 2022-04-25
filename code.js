const DEFAULT_STATE = 'nothing to do';
const DEFAULT_PRE_NUM = undefined;

let currentState = DEFAULT_STATE;
let previuosPressedNum = DEFAULT_PRE_NUM;
let mouseClicked;

document.body.onmousedown = () => {
    mouseClicked = true;
}
document.body.onmouseup = () => {
    mouseClicked = false;
}

const buttonsContainer = document.querySelector('.buttons');
const resultDisplay = document.querySelector('.display');



function setNumbersButtons(){
    let num;
    buttonsContainer.style.gridTemplateColumns = `repeat(4, 1fr)`;
    buttonsContainer.style.gridTemplateRows = `repeat(5, 1fr)`;
    let buttonsContent = [
        {text: 'AC', class: 'all-clear'},
        {text: 'DEL', class: 'delete'},
        {text: '%', class: 'percent'},
        {text: 'ANS', class: 'last-answer'},
        {text: '7', class:'number'},
        {text: '8', class:'number'},
        {text: '9', class:'number'},
        {text: '+', class: 'plus'},
        {text: '4', class:'number'},
        {text: '5', class:'number'},
        {text: '6', class:'number'},
        {text: '-', class:'minus'},
        {text: '1', class:'number'},
        {text: '2', class:'number'},
        {text: '3', class:'number'},
        {text: '/', class:'divide'},
        {text: '.', class:'point'},
        {text: '0', class:'number'},
        {text: '=', class:'equal'},
        {text: '*', class:'multiply'}
    ];
    for (let i=0; i<20; i++){
        const calcBtn = document.createElement('button');
        calcBtn.classList.add(buttonsContent[i].class);
        calcBtn.textContent = buttonsContent[i].text;
        calcBtn.addEventListener('mousedown', calc);
        buttonsContainer.appendChild(calcBtn);
    }    
}

function calc(e){
    if (mouseClicked){
        return;
    }
    switch (e.target.classList){
        case 'number':
            if(!previuosPressedNum){
                previuosPressedNum = e.target.textContent;
            }

            break;
        case 'equal':

            break;
        case 'Ans':

            break;
        case 'action':

            break;
    }
}

window.onload = () => {
    setNumbersButtons();
}
