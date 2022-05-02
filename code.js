// Default variables
const DEFAULT_STATE = 'nothing';
const DEAFULT_PRE_STATE = 'nothing';
const DEFAULT_PRE_NUM = undefined;
const DEFAULT_CURRENT_NUM = undefined;
const DEFAULT_FUNCTION = undefined;
const DEFAULT_LAST_CALC = undefined;
const DEFAULT_CLEAR_ALL = false;
const DEFAULT_LAST_EQUATION = undefined;
const DEFAULT_EQUAL_MODE = false;
const DEFAULT_OPERATOR = undefined;
const DEFAULT_MAX_TO_RECORD = 13;
const DEFAULT_RESULT = '';

// Current Variables
let currentState = DEFAULT_STATE;
let previuouState = DEAFULT_PRE_STATE;
let previousNum = DEFAULT_PRE_NUM;
let currentNum = DEFAULT_CURRENT_NUM;
let currentFunction = DEFAULT_FUNCTION;
let currentResult = DEFAULT_RESULT;
let lastCalc = DEFAULT_LAST_CALC;
let clearAll = DEFAULT_CLEAR_ALL;
let lastEquation = DEFAULT_LAST_EQUATION;
let maxToRecord = DEFAULT_MAX_TO_RECORD;
let equalMode = DEFAULT_EQUAL_MODE;
let currentOperator = DEFAULT_OPERATOR;
let actionSelected = false;
let operatorsArr = ['multiply', 'divide', 'minus', 'plus'];
let recordResultsArr = [];

// Elements control
const buttonsContainer = document.querySelector('.buttons');
const display = document.querySelector('.display');
const displayFunction = document.querySelector('.function');
const displayResult = document.querySelector('.result');
const calcBtns = document.querySelectorAll('.action')
const calculatorControl = document.querySelector('.calculator');
const lastResultsDisplay = document.createElement('div');
lastResultsDisplay.classList.add('record');
const preCalcs = document.querySelector('.last-calcs');
preCalcs.appendChild(lastResultsDisplay);
// calculatorControl.appendChild(lastResultsDisplay);

window.addEventListener('keydown', keyboardInput);

function keyboardInput(e){
    let keyName = '';
    if (e.key >= 0 && e.key <= 9) keyName = '#N' + e.key;
    else if (e.key === '.') keyName = '#NP';
    else if (e.key === '=' || e.key === 'Enter') keyName = '#E';
    else if (e.key === 'Backspace' || e.key == 'Delete') keyName = '#D';
    else if (e.key === 'Escape') keyName = '#C';
    else if (e.key === '+') keyName = '#PA';
    else if (e.key === '-') keyName = '#MA';
    else if (e.key === '*') keyName = '#MULA';
    else if (e.key === '/') keyName = '#DA';
    else if (e.key == '%') keyName = '#P';
    else return;
    enforceElementClicked(keyName);
}

function enforceElementClicked(key){
    const clicked = document.querySelector(key);
    clicked.click();
}

function setButtonsGrid(){
    buttonsContainer.style.gridTemplateColumns = `repeat(4, 1fr)`;
    buttonsContainer.style.gridTemplateRows = `repeat(5, 1fr)`;
    let buttonsContent = [
        {text: 'AC', class: 'all-clear', id: 'C'},
        {text: 'DEL', class: 'delete', id: 'D'},
        {text: '%', class: 'percent', id: 'P'},
        {text: 'ANS', class: 'last-answer', id: 'A'},
        {text: '7', class:'number', id: 'N7'},
        {text: '8', class:'number', id: 'N8'},
        {text: '9', class:'number', id: 'N9'},
        {text: '+', class: 'plus', id: 'PA'},
        {text: '4', class:'number', id: 'N4'},
        {text: '5', class:'number', id: 'N5'},
        {text: '6', class:'number', id: 'N6'},
        {text: '-', class:'minus', id: 'MA'},
        {text: '1', class:'number', id: 'N1'},
        {text: '2', class:'number', id: 'N2'},
        {text: '3', class:'number', id: 'N3'},
        {text: '/', class:'divide', id: 'DA'},
        {text: '.', class:'point', id: 'NP'},
        {text: '0', class:'number', id: 'N0'},
        {text: '=', class:'equal', id: 'E'},
        {text: 'X', class:'multiply', id: 'MULA'}
    ];
    for (let i=0; i<20; i++){
        const calcBtn = document.createElement('button');
        calcBtn.classList.add('action');
        calcBtn.classList.add(buttonsContent[i].class);
        calcBtn.id = buttonsContent[i].id;
        calcBtn.textContent = buttonsContent[i].text;
        buttonsContainer.appendChild(calcBtn);
        calcBtn.addEventListener('click', calc);
    }    
}

function calc(e){
    let buttonType = e.target.classList[1]; 
    switch (buttonType){
        case 'number':
            if((!previousNum && previousNum != '0') || (equalMode)){  // We start a new calculation
                previousNum = e.target.textContent;
                currentFunction = previousNum;
                currentResult = previousNum;
                equalMode = false;
            }
            else if ((currentState == 'nothing' || currentState == 'num' || currentState == 'point') && (!currentNum && currentNum != '0')){ // The number length is bigger then one
                if (previousNum == '0'){return;} // Don't continue writing a number after 0 :: '04' not a number
                previousNum += e.target.textContent;
                currentResult = previousNum;
                if (currentOperator != 'nothing'){ // An operator already made
                    currentFunction += e.target.textContent;
                }
                else {                            // No operator yet selected
                    currentFunction = previousNum;
                }
            }  
            else { // Write the second number
                if (currentNum == '0'){return;} // don't write after 0
                if (!currentNum){               // No current num yet
                    currentNum = e.target.textContent;
                    currentFunction += ' ' + currentNum;
                }
                else {                         // Current num already exist
                    currentNum += e.target.textContent;
                    currentFunction += e.target.textContent;
                }
                currentResult = currentNum;
                
            };
            
            equalMode = false;
            changeState('num');
            break;
        case 'plus':
            actionSelected = true;
            break;
        case 'minus':
            actionSelected = true;
            break;
        case 'divide':
            actionSelected = true;
            break;
        case 'multiply':
            actionSelected = true;
            break;
        case 'point':
            if (currentResult.includes('.')){return;}
            if (!currentNum && currentNum != '0'){
                if(currentFunction == previousNum){
                    if (!previousNum){
                        previousNum = '0.';
                    }
                    else {
                        previousNum += '.';
                    }
                    currentFunction = previousNum;
                    currentResult = previousNum;
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
            changeState('point');
            break;
        case 'equal':
            if (currentState == 'equal' || equalMode || currentFunction == '' || currentNum == null){return;}
            if (operatorsArr.includes(currentState)){return;}
            currentFunction += ' ' + '=';
            calcAction();
            changeState(buttonType);
            currentNum = undefined;
            lastEquation = currentFunction + ' ' + currentResult;
            if (recordResultsArr.length >= maxToRecord){
                recordResultsArr.shift();
            }
            recordResultsArr.push(lastEquation);
            recordResult();
            currentResult = currentResult.toString();
            previousNum = currentResult;
            changeState('nothing');
            currentOperator = 'nothing';
            equalMode = true;
            break;
        case 'last-answer':
            if ((!lastCalc && lastCalc != '0') || (lastCalc == 'Math Error!') || (lastCalc == '∞')
            || currentState == 'num' || currentState == 'point'){ // No calculation has been made
                return;
            }
            else {
                if ((!previousNum && previousNum != '0') || (equalMode)){
                    previousNum = lastCalc.toString();
                    currentFunction = previousNum;
                    currentResult = previousNum;
                    equalMode = false;
                }
                else if (!currentNum && currentNum != '0'){
                    currentNum = lastCalc.toString();
                    currentFunction += ' ' + currentNum;
                    currentResult = currentNum;
                }
            }
            changeState('num');
            break;
        case 'all-clear':
            clearAll = true;
            currentFunction = undefined;
            currentResult = '';
            currentNum = undefined;
            previousNum = undefined;
            currentOperator = 'nothing';
            changeState('nothing');
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
            currentResult = currentResult.toString();
            previousNum = currentResult;
            changeState('nothing');
            equalMode = true;
            currentOperator = 'nothing';
            break;
        case 'delete':
            //     previuosNum = e.target.textContent;
            //     currentFunction = previuosNum;
            //     currentResult = previuosNum;
            //     equalMode = false;
            //     currentState = 'num';
            if (equalMode || currentState == 'nothing'){return;}
            if (currentState == 'num'){
                if (!currentNum && currentNum != '0'){
                    previousNum = previousNum.slice(0,-1);
                    currentFunction = currentFunction.slice(0,-1);
                    currentResult = currentResult.slice(0,-1);
                }
                // else if (currentNum == '') {
                //     currentFunction = currentFunction.slice(0,-3);
                //     currentNum = undefined;
                // }
                else {
                    currentNum = currentNum.slice(0,-1);
                    currentFunction = currentFunction.slice(0,-1);
                    currentResult = currentResult.slice(0,-1);
                    if (currentNum == '') {
                        currentNum = undefined;
                        currentFunction = currentFunction.slice(0,-1);
                        changeState(currentOperator);
                    }
                }
                
            }
            else if (currentOperator != 'nothing'){
                currentFunction = currentFunction.slice(0,-2);
                changeState('num');
                currentOperator = 'nothing';
            }
            break;
    }
    if (actionSelected){
        if (operatorsArr.includes(currentState)){return;} // An operator is selected already
            if (!previousNum && previousNum != '0'){return;} // No number to work with
            else if (!isNumLegal(previousNum)){return;}      // Number ends with a floating point
            currentOperator = buttonType;
            changeState(buttonType);
            if (!currentNum && currentNum!='0' && !equalMode){ // No current num selected and no calc has been made yet
                currentFunction += ' ' + e.target.textContent;
            }
            else if (!currentNum && currentNum!='0' && equalMode){ // calc already made --> create new function
                currentFunction = previousNum + ' ' + e.target.textContent;
            }
            else {  // A full function already entered --> calc it --> present it
                calcAction();
                currentFunction = currentResult + ' ' + e.target.textContent;
                previousNum = currentResult.toString();;
                currentNum = undefined;
            }
            equalMode = false;
            actionSelected = false;
    }
    displayUpdate();
}

function isNumLegal(num){
    if (num.endsWith('.')){
        return false;
    }
    else {
        return true;
    }
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
    let num = parseFloat(previousNum);
    let numPrecent = parseFloat(currentNum);
    currentNum = (numPrecent/100) * num;
    calcAction();
}

function calcAction(){
    let preNum = parseFloat(previousNum);
    let currNum = parseFloat(currentNum);
    switch(currentOperator){
        case 'plus':
            currentResult = preNum + currNum;
            break;
        case 'minus':
            currentResult = previousNum - currentNum;
            break;
        case 'divide':
            currentResult = previousNum / currentNum;
            break;
        case 'multiply':
            currentResult = previousNum * currentNum;
            break;
    }
    currentResult = +parseFloat((currentResult).toFixed(2));
    if (isNaN(currentResult)){currentResult = 'Math Error!';}
    if(currentResult == 'Infinity'){currentResult = '∞';}
    lastCalc = currentResult;
}

function changeState(state){
    previuouState = currentState;
    currentState = state;
}

function displayUpdate(){
    if (clearAll){
        displayFunction.textContent = '';
        displayResult.textContent = '';
        clearAll = false;
        return;
    }
    else if ((currentFunction.includes('-')) && (currentFunction.includes('+'))){
        let deleteInd = currentFunction.indexOf('+');
        // currentFunction = currentFunction.slice(deleteInd-1, deleteInd+2);
        currentFunction = currentFunction.slice(0, deleteInd) + '- ' + currentFunction.slice(deleteInd+3);
        displayFunction.textContent = currentFunction;
        displayResult.textContent = currentResult;
    }
    else if (currentFunction.includes('- -')){
        let deleteInd = currentFunction.indexOf('-');
        // currentFunction = currentFunction.slice(deleteInd-1, deleteInd+2);
        currentFunction = currentFunction.slice(0, deleteInd) + '+ ' + currentFunction.slice(deleteInd+3);
        displayFunction.textContent = currentFunction;
        displayResult.textContent = currentResult;
    }
    else {
        displayFunction.textContent = currentFunction;
        displayResult.textContent = currentResult;
    }
}

window.onload = () => {
    setButtonsGrid();
}
