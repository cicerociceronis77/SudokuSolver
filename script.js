const caselle = document.querySelectorAll('.cella');

caselle.forEach(input => {
    input.addEventListener('keydown', e => {
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

        if (allowedKeys.includes(e.key)) {
            if (e.key === 'Backspace' || e.key === 'Delete') {
              //svuota la cella se si preme backspace o delete
              e.preventDefault();
              e.target.value = '';
            }
            //per frecce e tab lascia fare
            return;
        }

        //permette solo numeri da 1 a 9
        if (!/^[1-9]$/.test(e.key)) {
            e.preventDefault();
            return;
        }

        //se un utente preme un numero valido nella cella viene scritto quel numero
        e.preventDefault();
        e.target.value = e.key;

    });
});

function erroreGriglia() {
    document.querySelector('.errore').style.display = 'block';
    document.querySelector('.sudoku-grid').style.border = '1px solid #e73c3c';
    document.querySelectorAll('.blocco').forEach(blocco => {blocco.style.border = '1px solid #e73c3c';});
}

function successoGriglia() {
    document.querySelector('.una-soluzione').style.display = 'block';
    document.querySelector('.sudoku-grid').style.border = '1px solid #2ecc71';
    document.querySelectorAll('.blocco').forEach(blocco => {blocco.style.border = '1px solid #2ecc71';});
}

function resettaGriglia() {
    document.querySelector('.errore').style.display = 'none';
    document.querySelector('.una-soluzione').style.display = 'none';
    document.querySelector('.due-soluzioni').style.display = 'none';
    document.querySelector('.nessuna-soluzione').style.display = 'none';
    document.querySelector('.sudoku-grid').style.border = '1px solid black';
    document.querySelectorAll('.blocco').forEach(blocco => {blocco.style.border = '1px solid black';});
}

function resetta() {
    caselle.forEach(celletta => {
      celletta.value = '';
    });
    resettaGriglia();
}

document.querySelector('.reset-btn').addEventListener('click', resetta);

function cellaVuota(casella){
    if(casella.value === ''){
        //console.log('casella vuota');
        return true;
    }
    //console.log('casella piena');
    return false;
}

//controlla se ci sono doppioni in una riga tramite set
function rigaValida(riga) {

    const setControlloRiga = new Set();

    for (let col = 1; col <= 9; col++) {
        const cellaRiga = document.querySelector(`.r${riga}c${col}`);
        const valoreaCellaRiga = cellaRiga.value;

        if (valoreaCellaRiga !== '') {
            if (setControlloRiga.has(valoreaCellaRiga)) {
                //console.log(`doppione nella riga trovato r${riga}c${col}`);
                return false;
            } else {
                setControlloRiga.add(valoreaCellaRiga);
            }
        }
    }
    //console.log('riga corretta');
    return true;
}

//controlla se ci sono doppioni in una colonna tramite set
function colonnaValida(colonna) {

    const setControlloColonna = new Set();

    for (let rig = 1; rig <= 9; rig++) {
        const cellaColonna = document.querySelector(`.r${rig}c${colonna}`);
        const valoreaCellaColonna = cellaColonna.value;

        if (valoreaCellaColonna !== '') {
            if (setControlloColonna.has(valoreaCellaColonna)) {
                //console.log(`doppione nella colonna trovato r${rig}c${colonna}`);
                return false;
            } else {
                setControlloColonna.add(valoreaCellaColonna);
            }
        }
    }
    //console.log('colonna corretta');
    return true;
}

function bloccoValido(blocco3per3) {

    const setControlloBlocco = new Set();
    let riga = Math.floor((blocco3per3 - 1) / 3) * 3 + 1;
    let colonna = ((blocco3per3 - 1) % 3) * 3 + 1;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            const cellaBlocco = document.querySelector(`.r${riga+i}c${colonna+j}`);
            const valoreaCellaBlocco = cellaBlocco.value;

            if (valoreaCellaBlocco!== '') {
                if (setControlloBlocco.has(valoreaCellaBlocco)) {
                    //console.log(`doppione nel blocco trovato r${riga+i}c${colonna+j}`);
                    return false;
                } else {
                    setControlloBlocco.add(valoreaCellaBlocco);
                }
            }
            
        }
    }
    //console.log('blocco corretto');
    return true;
}

function sudokuValido() {
    resettaGriglia();
    for (let i = 1; i <=9; i++) {
        if (!bloccoValido(i) || !rigaValida(i) || !colonnaValida(i)) {
            erroreGriglia();
            return false;
        }
    }
    return true;
}

//funzione che controlla solo la posizione
function posizioneValida(riga, colonna, blocco) {
    if (rigaValida(riga) && colonnaValida(colonna) && bloccoValido(blocco)) {
        return true;
    } else return false;
}

caselle.forEach(input => {
    input.addEventListener('keyup', () => {
        sudokuValido();
    });
});

function bloccoCor (x, y) {
    return (Math.floor((x - 1) / 3) * 3) + (Math.floor((y - 1) / 3) + 1);
}


const matrice = Array.from({ length: 9 }, () => Array(9).fill(0));

//mette ogni input nell'array
caselle.forEach(input => {
  input.addEventListener('keyup', e => {
    const target = e.target;
    const riga = parseInt(target.dataset.row) - 1;
    const colonna = parseInt(target.dataset.col) - 1;
    
    const val = parseInt(target.value);
    //console.log(`matrice[${riga}][${colonna}]: ${matrice[riga][colonna]}, valore inserito: ${val}`);
    //console.log(matrice);
    if (val >= 1 && val <= 9) {
    matrice[riga][colonna] = val;
    } else {
        matrice[riga][colonna] = 0;
    }
  });
});

//funzioni per validificare il sudoku nella matrice
function rigaValidaMatrice(riga, matrice){
        const setControlloRigaMatrice = new Set();

    for (let col = 0; col < 9; col++) {
    
        const valoreCellaMatrice = matrice[riga][col];

        if (valoreCellaMatrice !== 0) {
            if (setControlloRigaMatrice.has(valoreCellaMatrice)) {
                //console.log(`doppione nella riga trovato r${riga}c${col}`);
                return false;
            } else {
                setControlloRigaMatrice.add(valoreCellaMatrice);
            }
        }
    }
    //console.log('riga corretta');
    return true;
}

function colonnaValidaMatrice(colonna, matrice){
        const setControlloColonnaMatrice = new Set();

    for (let rig = 0; rig < 9; rig++) {
    
        const valoreCellaMatrice = matrice[rig][colonna];

        if (valoreCellaMatrice !== 0) {
            if (setControlloColonnaMatrice.has(valoreCellaMatrice)) {
                //console.log(`doppione nella riga trovato r${riga}c${col}`);
                return false;
            } else {
                setControlloColonnaMatrice.add(valoreCellaMatrice);
            }
        }
    }
    //console.log('riga corretta');
    return true;
}

function bloccoValidoMatrice(riga, colonna, matrice) {

    const setControlloBloccoMatrice = new Set();
    let rigaInizioBlocco = Math.floor(riga / 3) * 3;
    let colonnaInizioBlocco = Math.floor(colonna / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            
            const valoreaCellaBloccoMatrice = matrice[rigaInizioBlocco+i][colonnaInizioBlocco+j]

            if (valoreaCellaBloccoMatrice !== 0) {
                if (setControlloBloccoMatrice.has(valoreaCellaBloccoMatrice)) {
                    //console.log(`doppione nel blocco trovato r${riga+i}c${colonna+j}`);
                    return false;
                } else {
                    setControlloBloccoMatrice.add(valoreaCellaBloccoMatrice);
                }
            }
            
        }
    }
    //console.log('blocco corretto');
    return true;
}


function sudokuValidoMatrice(matrice) {
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++){
            if (!bloccoValidoMatrice(i, j, matrice) || !rigaValidaMatrice(i, matrice) || !colonnaValidaMatrice(j, matrice)) {
                return false;
            }
        }
    }
    return true;
}

function posizioneValidaMatrice(matrice, riga, colonna) {
    if (!bloccoValidoMatrice(riga, colonna, matrice) || !rigaValidaMatrice(riga, matrice) || !colonnaValidaMatrice(colonna, matrice)) {
        return false;
    }
    return true;
}

// funzione che serve per copiare una matrice nella griglia del sudoku
function copiaMatriceNelSudoku(matrice) {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++){
            if (matrice[i][j] === 0){
                document.querySelector(`.r${i+1}c${j+1}`).value = '';
            } else {
                document.querySelector(`.r${i+1}c${j+1}`).value = matrice[i][j];
            }
        }
    }
}

function copiaMatriceInMatrice(matriceA, matriceB) {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++){
            matriceB[i][j] = matriceA[i][j];
        }
    }
}

function azzeraMatrice(matrice) {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++){
            matrice[i][j] = 0;
        }
    }
}

function matriciUguali(matriceA, matriceB) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++){
            if (matriceA[i][j] !== matriceB[i][j]) {
                return false;
            }
        }
    }
    return true;
}

let soluzioniTrovate = 0;
const matricePrimaSoluzione = Array.from({ length: 9 }, () => Array(9).fill(0));
let interrotta = false;
let passiTentati = 0;
const limitePassi = 10000000;
azzeraMatrice(matricePrimaSoluzione);

function risolviMatriceSudoku(matrice) {

    if (interrotta || passiTentati > limitePassi) {
        return;
    }

    if (!sudokuValidoMatrice(matrice)) {
        return;
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++){
            if (matrice[i][j] === 0){
                for (let k = 1; k <= 9; k++){
                    matrice[i][j] = k;
                    passiTentati++;
                    if (posizioneValidaMatrice(matrice, i, j)){
                        risolviMatriceSudoku(matrice);
                        if (soluzioniTrovate > 1) {
                            interrotta = true;
                            return;
                        }
                    }
                    matrice[i][j] = 0;
                }
                return;
            }
        }
    }
    
    if (soluzioniTrovate === 0) {
        soluzioniTrovate = 1;
        copiaMatriceInMatrice(matrice, matricePrimaSoluzione);
        copiaMatriceNelSudoku(matricePrimaSoluzione);
    } else {
        if (!matriciUguali(matrice, matricePrimaSoluzione)) {
            soluzioniTrovate = 2;
            interrotta = true;
            return;
        }
    }
}

document.querySelector('.risolvi-btn').addEventListener('click', () => {
    soluzioniTrovate = 0;     // resetto variabili prima di iniziare
    passiTentati = 0;
    interrotta = false;
    azzeraMatrice(matricePrimaSoluzione);

    risolviMatriceSudoku(matrice);

    if (soluzioniTrovate === 0) {
        document.querySelector('.nessuna-soluzione').style.display = 'block';
    } else if (soluzioniTrovate === 1) {
        successoGriglia();
    } else {
        document.querySelector('.due-soluzioni').style.display = 'block';
    }

    
    azzeraMatrice(matrice);
});
