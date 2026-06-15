function updateDateTime() {
    const now = new Date();

    document.getElementById("datetime").innerHTML =
        now.toLocaleDateString("id-ID") +
        " | " +
        now.toLocaleTimeString("id-ID");
}

setInterval(updateDateTime, 1000);
updateDateTime();
const ctx = document.getElementById('myChart');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
{
    label: 'Suhu (°C)',
    data: [],
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56,189,248,0.20)',
    tension: 0.4,
    fill: true,
    borderWidth: 3
},
{
    label: 'Kelembaban (%)',
    data: [],
    borderColor: '#06B6D4',
    backgroundColor: 'rgba(6,182,212,0.20)',
    tension: 0.4,
    fill: true,
    borderWidth: 3
}
]
    },
    options:{
    responsive:true,

    plugins:{
    legend:{
        labels:{
            color:"#1E293B",
                font:{
                    size:14
                }
            }
        }
    },

    scales:{
    x:{
    ticks:{
        color:"#334155"
        },
        grid:{
            color:"rgba(148,163,184,0.15)"
        }
    },
    y:{
    ticks:{
        color:"#334155"
        },
        grid:{
            color:"rgba(148,163,184,0.15)"
        }
    }
}
}
});

let suhu = 28;
let kelembaban = 75;
let suhuMax = suhu;
let suhuMin = suhu;
let totalSuhu = 0;

let kelembabanMax = kelembaban;
let kelembabanMin = kelembaban;
let totalKelembaban = 0;

let jumlahData = 0;

function updateSensorData() {

    suhu += (Math.random() - 0.5);
kelembaban += (Math.random() - 0.5);

suhu = Number(suhu.toFixed(1));
kelembaban = Number(kelembaban.toFixed(1));
    document.getElementById("suhu").innerHTML = suhu + "°C";
    document.getElementById("kelembaban").innerHTML = kelembaban + "%";
    if (suhu > suhuMax) suhuMax = suhu;
    if (suhu < suhuMin) suhuMin = suhu;
    if (kelembaban > kelembabanMax)
    kelembabanMax = kelembaban;

    if (kelembaban < kelembabanMin)
    kelembabanMin = kelembaban;

totalSuhu += suhu;
totalKelembaban += kelembaban;

jumlahData++;

let rataRata =
(totalSuhu / jumlahData).toFixed(1);

let rataKelembaban =
(totalKelembaban / jumlahData).toFixed(1);

document.getElementById("suhuMax").innerHTML = suhuMax + "°C";
document.getElementById("suhuMin").innerHTML = suhuMin + "°C";
document.getElementById("suhuAvg").innerHTML = rataRata + "°C";
document.getElementById("kelembabanMax").innerHTML =
kelembabanMax + "%";

document.getElementById("kelembabanMin").innerHTML =
kelembabanMin + "%";

document.getElementById("kelembabanAvg").innerHTML =
rataKelembaban + "%";

document.getElementById("gaugeValue").innerHTML =
suhu + "°C";

document.getElementById("gaugeFill").style.width =
(suhu / 50 * 100) + "%";

const time = new Date().toLocaleTimeString();

chart.data.labels.push(time);
chart.data.datasets[0].data.push(suhu);
chart.data.datasets[1].data.push(kelembaban);

if (chart.data.labels.length > 10) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    chart.data.datasets[1].data.shift();
}

chart.update();
const table =
document.querySelector("#historyTable tbody");

const row =
table.insertRow(0);

row.insertCell(0).innerHTML = time;
row.insertCell(1).innerHTML = suhu + "°C";
row.insertCell(2).innerHTML = kelembaban + "%";

// saveData();

if(table.rows.length > 10){
    table.deleteRow(10);
}
document.getElementById("totalData").innerHTML =
table.rows.length;

document.getElementById("lastUpdate").innerHTML =
time;

const status = document.getElementById("status");
const alertBox = document.getElementById("alertBox");

if (suhu > 30 && kelembaban > 80) {

    document.getElementById("gaugeStatus").innerHTML =
"🔴 Bahaya";

    status.innerHTML = "Bahaya";
    status.className = "bahaya";

    alertBox.innerHTML =
        "🚨 BAHAYA! Suhu dan Kelembaban Tinggi";

    alertBox.className =
        "alert danger-alert";

}
else if (suhu > 30) {

    document.getElementById("gaugeStatus").innerHTML =
"🟠 Panas";

    status.innerHTML = "Panas";
    status.className = "panas";

    alertBox.innerHTML =
        "🔴 PERINGATAN! Suhu Terlalu Tinggi";

    alertBox.className =
        "alert danger-alert";

}
else if (kelembaban > 80) {

    document.getElementById("gaugeStatus").innerHTML =
"🟡 Lembab";

    status.innerHTML = "Lembab";
    status.className = "lembab";

    alertBox.innerHTML =
        "🟠 PERINGATAN! Kelembaban Tinggi";

    alertBox.className =
        "alert warning-alert";

}
else {

    status.innerHTML = "Normal";
    status.className = "normal";

    alertBox.innerHTML =
        "🟢 Kondisi Ruangan Normal";

    alertBox.className =
        "alert normal-alert";

}
}

// loadData();

setInterval(updateSensorData, 3000);
updateSensorData();

function resetData(){

    const konfirmasi =
    confirm(
        "Yakin ingin menghapus semua data monitoring?"
    );

    if(!konfirmasi) return;

    const table =
    document.querySelector(
        "#historyTable tbody"
    );

    table.innerHTML = "";

    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];

    chart.update();

    document.getElementById(
        "totalData"
    ).innerHTML = "0";

    document.getElementById(
    "lastUpdate"
).innerHTML = "-";

suhuMax = suhu;
suhuMin = suhu;
totalSuhu = 0;

kelembabanMax = kelembaban;
kelembabanMin = kelembaban;
totalKelembaban = 0;

jumlahData = 0;

localStorage.removeItem(
    "monitoringData"
);

alert(
    "Data monitoring berhasil dihapus!"
);

}
function saveData(){

    const rows =
    document.querySelectorAll(
        "#historyTable tbody tr"
    );

    let data = [];

    rows.forEach(row => {

        const cols =
        row.querySelectorAll("td");

        data.push({
            jam: cols[0].innerText,
            suhu: cols[1].innerText,
            kelembaban: cols[2].innerText
        });

    });

    localStorage.setItem(
        "monitoringData",
        JSON.stringify(data)
    );

}
function loadData(){

    const data =
    JSON.parse(
        localStorage.getItem(
            "monitoringData"
        )
    );

    if(!data) return;

    const table =
    document.querySelector(
        "#historyTable tbody"
    );

    data.forEach(item => {

        const row =
        table.insertRow();

        row.insertCell(0).innerHTML =
        item.jam;

        row.insertCell(1).innerHTML =
        item.suhu;

        row.insertCell(2).innerHTML =
        item.kelembaban;

    });

    document.getElementById(
        "totalData"
    ).innerHTML =
    table.rows.length;

}