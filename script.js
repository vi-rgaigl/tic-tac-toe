let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let gameEnded = false;

function init() {
    render();
}

function render() {
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            const symbol = fields[index] === 'circle' ? generateAnimatedCircleSVG() : (fields[index] === 'cross' ? generateAnimatedCrossSVG() : '');
            tableHtml += `<td onclick="cellClick(${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    document.getElementById('content').innerHTML = tableHtml;
}

function generateAnimatedCircleSVG() {
    const svgCode = `<svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="35" cy="35" r="30" fill="transparent" stroke="#00b0ef" stroke-width="5" stroke-dasharray="0 188">
                            <animate attributeName="stroke-dasharray" values="0 188;188 0" dur="150ms" keyTimes="0;1" repeatCount="1" fill="freeze" />
                        </circle>
                    </svg>`;

    return svgCode;
}

function generateAnimatedCrossSVG() {
    const svgCode = `<svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                        <line x1="10" y1="10" x2="60" y2="60" stroke="#ffc000" stroke-width="5" stroke-dasharray="0 70">
                            <animate attributeName="stroke-dasharray" values="0 70;70 0" dur="150ms" keyTimes="0;1" repeatCount="1" fill="freeze" />
                        </line>
                        <line x1="10" y1="60" x2="60" y2="10" stroke="#ffc000" stroke-width="5" stroke-dasharray="0 70">
                            <animate attributeName="stroke-dasharray" values="0 70;70 0" dur="150ms" keyTimes="0;1" repeatCount="1" fill="freeze" />
                        </line>
                    </svg>`;

    return svgCode;
}

function cellClick(index) {
    if (!fields[index] && !gameEnded) {
        const placedSymbolsCount = fields.filter(symbol => symbol !== null).length;
        const symbol = placedSymbolsCount % 2 === 0 ? 'circle' : 'cross';
        fields[index] = symbol;
        const symbolHtml = symbol === 'circle' ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
        document.getElementsByTagName('td')[index].innerHTML = symbolHtml;
        document.getElementsByTagName('td')[index].removeAttribute('onclick');

        if (!checkGameOver()) {
            const nextSymbol = placedSymbolsCount % 2 === 0 ? 'cross' : 'circle';
            const nextSymbolHtml = nextSymbol === 'circle' ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
            if (!fields[index]) {
                document.getElementsByTagName('td')[index].innerHTML += nextSymbolHtml;
                document.getElementsByTagName('td')[index].removeAttribute('onclick');
                fields[index] = nextSymbol;
            }
            
            checkGameOver();
        }
    }
}

function checkGameOver() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            drawWinningLine(pattern);
            gameEnded = true;
            return true;
        }
    }

    if (fields.every(symbol => symbol !== null)) {
        alert("Unentschieden! Das Spiel endet.");
        gameEnded = true;
        return true;
    }

    return false;
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;
  
    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
  
    const contentRect = document.getElementById('content').getBoundingClientRect();
  
    const lineLength = Math.sqrt(
      Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
  
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
  }


  function restartGame() {
    // Hier setzen Sie alle relevanten Variablen und Zustände zurück
    fields = Array(9).fill(null);
    gameEnded = false;

    // Wiederherstellen des HTML-Zustands
    render();
}
