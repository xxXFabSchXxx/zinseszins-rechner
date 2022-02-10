function runde(zahl, anzahlStellen) {
    zahl = zahl * Math.pow(10, anzahlStellen);
    zahl = Math.round(zahl);
    zahl = zahl / Math.pow(10, anzahlStellen);

    return zahl;
}
function minNumber(zahlen) {

    let min = zahlen[0];
    for (let i = 0; i < zahlen.length; i++) {
        if (zahlen[i] < min) {
            min = zahlen[i];
        }
    }
    return min;
}
function maxNumber(zahlen) {

    let max = zahlen[0];
    for (let i = 0; i < zahlen.length; i++) {
        if (zahlen[i] > max) {
            max = zahlen[i];
        }
    }
    return max;
}
function erstelleZufallszahl(start, end) {
    return Math.random() * (end - start) + start;
}
function perzentil(zahlen, percent) {
    let index = Math.ceil(percent / 100.0 * zahlen.length);
    return zahlen[index - 1];
}
function sucheIndex(liste, gesuchteNummer) {
    liste.sort(function (a, b) { return a - b; });
    for (let i = 0; i < liste.length; i++) {
        if (gesuchteNummer < liste[i]) {
            return i;
        }
    }
    return -1;
}
function createTableHeader(text) {
    let th = document.createElement('th')
    th.appendChild(document.createTextNode(text))
    return th;
}
function createTableData(text) {
    let td = document.createElement('td')
    td.setAttribute('align', 'center')
    td.appendChild(document.createTextNode(text))
    return td;
}
function createTableBodyPart(jahr, vermoegen, zinsen, sparRate, sparRatenErhoeung) {
    let tr = document.createElement('tr')
    tr.appendChild(createTableData(jahr))
    tr.appendChild(createTableData(vermoegen))
    tr.appendChild(createTableData(zinsen))
    tr.appendChild(createTableData(sparRate))
    tr.appendChild(createTableData(sparRatenErhoeung))

    return tr;
}
function createTable(dauer, zinsenListe, zinsProzentsatz, gehaltsListe, gehaltsProzentsatz) {
    let tr = document.createElement('tr')
    tr.appendChild(createTableHeader('Jahr'))
    tr.appendChild(createTableHeader('Vermögen [€]'))
    tr.appendChild(createTableHeader('Prozentsatz [%]'))
    tr.appendChild(createTableHeader('Spar Rate [€]'))
    tr.appendChild(createTableHeader('Prozentsatz [%]'))


    let table = document.getElementById('tabelle');
    table.innerHTML = ''
    table.appendChild(tr)
    for (let i = 0; i < dauer; i++) {
        table.appendChild(createTableBodyPart(i, runde(zinsenListe[i], 2), runde(zinsProzentsatz[i], 1),
            runde(gehaltsListe[i], 2), runde(gehaltsProzentsatz[i], 1)))

    }
}
function berechnen(vermoegen, dauer, anfangsSparRate, zinsenStart, zinsenEnde, gehaltsZinsenStart, gehaltsZinsenEnde) {

    let zinsenListe = [];
    let gehaltsListe = [];
    let zinsProzentsatz = [];
    let gehaltsProzentsatz = [];

    zinsenListe[0] = vermoegen;
    gehaltsListe[0] = anfangsSparRate;
    zinsProzentsatz[0] = 0;
    gehaltsProzentsatz[0] = 0

    for (let i = 1; i < dauer; i++) {

        zinsProzentsatz[i] = erstelleZufallszahl(zinsenStart, zinsenEnde);

        if (i % 2 == 0) {
            gehaltsProzentsatz[i] = erstelleZufallszahl(gehaltsZinsenStart, gehaltsZinsenEnde);
        } else {
            gehaltsProzentsatz[i] = 0;
        }
        gehaltsListe[i] = gehaltsListe[i - 1] + gehaltsListe[i - 1] * gehaltsProzentsatz[i] / 100;
        zinsenListe[i] = zinsenListe[i - 1] + gehaltsListe[i];
        zinsenListe[i] = zinsenListe[i] + zinsenListe[i] * zinsProzentsatz[i] / 100;
    }
    return [zinsenListe, zinsProzentsatz, gehaltsListe, gehaltsProzentsatz];
}

function buttonClick() {
    let vermoegen = Number(document.getElementById('vermoegen').value);
    let dauer = Number(document.getElementById('dauer').value);
    let anfangsSparRate = Number(document.getElementById('anfangsSparRate').value);
    let zinsenStart = Number(document.getElementById('zinsenStart').value);
    let zinsenEnde = Number(document.getElementById('zinsenEnde').value);
    let gehaltsZinsenStart = Number(document.getElementById('gehaltsZinsenStart').value);
    let gehaltsZinsenEnde = Number(document.getElementById('gehaltsZinsenEnde').value);
    let anzahlSimualtion = Number(document.getElementById('anzahlSimualtion').value);
    let customzahlEingabe = Number(document.getElementById('customzahlEingabe').value);
    let gespeicherteErgebnise = [];

    let berechneteTabelle = berechnen(vermoegen, dauer, anfangsSparRate, zinsenStart, zinsenEnde, gehaltsZinsenStart, gehaltsZinsenEnde);
    for (let i = 0; i < anzahlSimualtion; i++) {
        let berechnungen = berechnen(vermoegen, dauer, anfangsSparRate, zinsenStart, zinsenEnde, gehaltsZinsenStart, gehaltsZinsenEnde);
        let zinsenListe = berechnungen[0];
        gespeicherteErgebnise[i] = zinsenListe[zinsenListe.length - 1]
    }

    gespeicherteErgebnise.sort(function (a, b) { return a - b; });

    let min1 = perzentil(gespeicherteErgebnise, 1);
    let min5 = perzentil(gespeicherteErgebnise, 5);
    let max5 = perzentil(gespeicherteErgebnise, 95);
    let max1 = perzentil(gespeicherteErgebnise, 99);
    let customzahlberechnen = 100 - customzahlEingabe
    let customzahl = perzentil(gespeicherteErgebnise, customzahlberechnen);

    createTable(dauer, berechneteTabelle[0], berechneteTabelle[1], berechneteTabelle[2], berechneteTabelle[3])

    let ergebnisSatz = document.getElementById('ergebnisSatz')
    ergebnisSatz.innerHTML = '<p>Mit einer Warscheinlichkeit von <strong>99%</strong> bekommt man mindestens <strong>' + runde(min1, 2) + '€</strong>.</p>'
        + '<p>Mit einer Warscheinlichkeit von <strong>95%</strong> bekommt man mindestens <strong>' + runde(min5, 2) + '€</strong>.</p>'
        + '<p>Mit einer Warscheinlichkeit von <strong>5%</strong> bekommt man mindestens <strong>' + runde(max5, 2) + '€</strong>.</p>'
        + '<p> Mit einer Warscheinlichkeit von <strong>1%</strong> bekommt man mindestens <strong>' + runde(max1, 2) + '€</strong>.</p>'
        + '<p> Mit einer Warscheinlichkeit von <strong>' + customzahlEingabe + '%</strong> bekommt man mindestens <strong>' + runde(customzahl, 2) + '€</strong>.</p>';

    let ergebnis = document.getElementById('ergebnis')
    ergebnis.style.display = 'block'

    return false
}