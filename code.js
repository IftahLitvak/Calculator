const DEFAULT_STATE = 'nothing';
const DEFAULT_PRE_NUM = undefined;
const DEFAULT_CURRENT_NUM = undefined;
const DEFAULT_FUNCTION = undefined;
const DEFAULT_LAST_CALC = undefined;
const DEFAULT_CLEAR_ALL = false;
const DEFAULT_LAST_EQUATION = undefined;
const DEFAULT_EQUAL_MODE = false;
const DEFAULT_MAX_TO_RECORD = 18;
const DEFAULT_RESULT = '';

let currentState = DEFAULT_STATE;
let previuosNum = DEFAULT_PRE_NUM;
let currentNum = DEFAULT_CURRENT_NUM;
let currentFunction = DEFAULT_FUNCTION;
let currentResult = DEFAULT_RESULT;
let lastCalc = DEFAULT_LAST_CALC;
let clearAll = DEFAULT_CLEAR_ALL;
let lastEquation = DEFAULT_LAST_EQUATION;
let maxToRecord = DEFAULT_MAX_TO_RECORD;
let equalMode = DEFAULT_EQUAL_MODE;
let recordResultsArr = [];


const buttonsContainer = document.querySelector('.buttons');
const display = document.querySelector('.display');
const displayFunction = document.querySelector('.function');
const displayResult = document.querySelector('.result');
const calcBtns = document.querySelectorAll('.action')
const calculatorControl = document.querySelector('.calculator');
const lastResultsDisplay = document.createElement('div');
lastResultsDisplay.classList.add('record');
calculatorControl.appendChild(lastResultsDisplay);

window.addEventListener('keydown', keyboardInput);



function setButtonsGrid(){
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
        {text: 'X', class:'multiply'}
    ];
    for (let i=0; i<20; i++){
        const calcBtn = document.createElement('button');
        calcBtn.classList.add('action');
        calcBtn.classList.add(buttonsContent[i].class);
        calcBtn.textContent = buttonsContent[i].text;
        buttonsContainer.appendChild(calcBtn);
        calcBtn.addEventListener('click', calc);
    }    
}

function calc(e){
    let buttonType = e.target.classList[1]; 
    switch (buttonType){
        case 'number':
            if(!previuosNum && previuosNum != '0'){  // We start a new calculation
                previuosNum = e.target.textContent;
                currentFunction = previuosNum;
                currentResult = previuosNum;
            }
            else {
                if (currentState == 'nothing'){ // The number length is bigger then one
                    previuosNum += e.target.textContent;
                    currentFunction = previuosNum;
                    currentResult = previuosNum;
                }
                else {
                    if (!currentNum){
                        currentNum = e.target.textContent;
                        currentFunction += ' ' + currentNum;
                    }
                    else {
                        currentNum += e.target.textContent;
                        currentFunction += e.target.textContent;
                    }
                    currentResult = currentNum;
                    
                };
            }
            equalMode = false;
            break;
        case 'plus':
            if (!previuosNum && previuosNum != '0'){return;}
            if (!currentNum && !equalMode){
                currentFunction += ' ' + e.target.textContent;
            }
            else {
                calcAction();
                currentFunction = currentResult + ' ' + e.target.textContent;
                previuosNum = currentResult;
                currentNum = undefined;
            }
            currentState = buttonType;
            equalMode = false;
            break;
        case 'minus':
            if (!previuosNum && previuosNum != '0'){return;}
            if (!currentNum && !equalMode){
                currentFunction += ' ' + e.target.textContent;
            }
            else {
                calcAction();
                currentFunction = currentResult + ' ' + e.target.textContent;
                previuosNum = currentResult;
                currentNum = undefined;
            }
            currentState = buttonType;
            equalMode = false;
            break;
        case 'point':
            if (!currentNum && currentNum != '0'){
                if(currentFunction == previuosNum){
                    if (!previuosNum){
                        previuosNum = '0.'
                    }
                    else {
                        previuosNum += '.';
                    }
                    currentFunction = previuosNum;
                    currentResult = previuosNum;
                }
                else {
                    currentNum = '0.'
                    currentFunction += ' ' + currentNum;
                    currentResult = currentNum;
                }
            }
            else{
                currentNum += '.';
                currentFunction += '.';
                currentResult = currentNum;
            }
            break;
        case 'divide':
            if (!previuosNum && previuosNum != '0'){return;}
            if (!currentNum && !equalMode){
                currentFunction += ' ' + e.target.textContent;
            }
            else {
                calcAction();
                currentFunction = currentResult + ' ' + e.target.textContent;
                previuosNum = currentResult;
                currentNum = undefined;
            }
            currentState = buttonType;
            equalMode = false;
            break;
        case 'multiply':
            if (!previuosNum && previuosNum != '0'){return;}
            if (!currentNum && !equalMode){
                currentFunction += ' ' + e.target.textContent;
            }
            else {
                calcAction();
                currentFunction = currentResult + ' ' + e.target.textContent;
                previuosNum = currentResult;
                currentNum = undefined;
            }
            currentState = buttonType;
            equalMode = false;
            break;
        case 'equal':
            if (currentState == 'equal' || equalMode){return;}
            currentFunction += ' ' + '=';
            calcAction();
            currentState = 'equal';
            currentNum = undefined;
            lastEquation = currentFunction + ' ' + currentResult;
            if (recordResultsArr.length >= maxToRecord){
                recordResultsArr.shift();
            }
            recordResultsArr.push(lastEquation);
            recordResult();
            previuosNum = currentResult;
            currentState = 'nothing';
            equalMode = true;
            break;
        case 'last-answer':
            if (!lastCalc && lastCalc != '0'){ // No calculation has been made
                return;
            }
            else {
                if (!previuosNum && previuosNum != '0'){
                    previuosNum = lastCalc;
                    currentFunction = previuosNum;
                    currentResult = previuosNum;
                }
                else if (!currentNum && currentNum != '0'){
                    currentNum = lastCalc;
                    currentFunction += ' ' + currentNum;
                    currentResult = currentNum;
                }
            }
            break;
        case 'all-clear':
            clearAll = true;
            currentFunction = undefined;
            currentResult = '';
            currentNum = undefined;
            previuosNum = undefined;
            currentState = 'nothing';
            break;
        case 'percent':
            if (currentNum == undefined){return;}
            calcPrecent();
            currentFunction += '%' + ' ' + '=';
            lastEquation = currentFunction + ' ' + currentResult;
            if (recordResultsArr.length >= maxToRecord){
                recordResultsArr.shift();
            }
            recordResultsArr.push(lastEquation);
            recordResult();
            currentNum = undefined;
            previuosNum = currentResult;
            currentState = 'nothing';
            equalMode = true;
            break;

    }
    displayUpdate();
}

function recordResult(){
    let totalRecorded = recordResultsArr.length;
    removeRecordedResults();
    for (let i=0; i<totalRecorded; i++){
        const result_record = document.createElement('div');
        result_record.classList.add('result-record');
        result_record.textContent = recordResultsArr[totalRecorded-i-1];
        lastResultsDisplay.appendChild(result_record);
    }
}

function removeRecordedResults(){
    const allResults = document.querySelectorAll('.result-record');
    allResults.forEach(res => res.remove());
}

function calcPrecent(){
    let num = parseFloat(previuosNum);
    let numPrecent = parseFloat(currentNum);
    currentNum = (numPrecent/100) * num;
    calcAction();
}

function calcAction(){
    let preNum = parseFloat(previuosNum);
    let currNum = parseFloat(currentNum);
    switch(currentState){
        case 'plus':
            currentResult = preNum + currNum;
            break;
        case 'minus':
            currentResult = previuosNum - currentNum;
            break;
        case 'divide':
            currentResult = previuosNum / currentNum;
            break;
        case 'multiply':
            currentResult = previuosNum * currentNum;
            break;
    }
    currentResult = +parseFloat((currentResult).toFixed(2));
    lastCalc = currentResult;
}

function displayUpdate(){
    if (clearAll){
        displayFunction.textContent = '';
        displayResult.textContent = '';
        clearAll = false;
        return;
    }
    else {
        displayFunction.textContent = currentFunction;
        displayResult.textContent = currentResult;
    }
    
}

window.onload = () => {
    setButtonsGrid();
}
