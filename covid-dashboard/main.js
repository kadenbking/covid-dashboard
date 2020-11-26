const totalStudents = 1132;
const totalFacultyStaff = 300;
var sheetUrl = 'https://spreadsheets.google.com/feeds/cells/1XJBCL5aTxpPcfBQhfyDqqAKglcZcnN-srGsZc-P2Sq0/1/public/full?alt=json';

let data = [];
let numCols = 7;

$(function () {

    //getDates();
    getData();

    $("#riskLevelInfo").hover(function () {
        $(this).popover({
            title: "Protect The Pride Risk Levels",
            content: "Green: No-to-minimal community spread <br /> Yellow: Minimal-to-moderate community spread <br /> Orange: Substantial community spread <br /> Red: Substantial and ongoing community spread",
            html: true
        }).popover('show');
    }, function () {
        $(this).popover('hide');
    });

    $("#dateSelect").change( function () {
        const selectedDate = $("#dateSelect").val();
        console.log(selectedDate);
        
        const current = rowForDate(selectedDate);
        
        showStats(current);
        drawDonutCharts();
        
    });
});

function rowForDate(date) {  
    
    for(let i=0; i < data.length; i++) {
        if(data[i].date == date) {
            return data[i];
        }
    }
    
    return null;
}

async function getDates() {
    //let response = await fetch("https://sheet.best/api/sheets/bf9fbbc3-aac1-48f4-98f2-7715cbb6d295");
    //let data = await response.json();
    //let values = Object.values(data);



    // for (i = data.length - 1; i >= 0; i--) {
    //     if (values[i].id == null || values[i].date == null || values[i].activeCasesStudent == null || values[i].activeCasesFacultyStaff == null || values[i].isolated == null || values[i].quarantined == null || values[i].riskLevel == null) {
    //         continue;
    //     }
    //     else {
    //         $("#dateSelect").append(new Option(values[i].date));
    //     }
    // };
};


async function getData() {
    let response = await fetch(sheetUrl);
    let sheetData = await response.json();
    let entry = sheetData.feed.entry;
  
    let dateSelect = $("#dateSelect");

    for (let i = numCols; i < entry.length; i += numCols) {
        data.push({
            id: entry[i].content.$t,
            date: entry[i + 1].content.$t,
            activeCasesStudent: parseInt(entry[i + 2].content.$t),
            activeCasesFacultyStaff: parseInt(entry[i + 3].content.$t),
            isolated: parseInt(entry[i + 4].content.$t),
            quarantined: parseInt(entry[i + 5].content.$t),
            riskLevel: entry[i + 6].content.$t
        });
        let date = entry[i + 1].content.$t;
        dateSelect.prepend(new Option(date));
    }  

    $("#dateSelect")[0].selectedIndex = 0;
    const current = rowForDate($("#dateSelect").val());

    showStats(current);
    drawDonutCharts();
    drawLineCharts();
}



function showStats(stats) {
    console.log(stats);
    $("#date").html(stats.date);
    $("#active-cases-student").html(stats.activeCasesStudent);
    $("#active-cases-faculty-staff").html(stats.activeCasesFacultyStaff);
    $("#isolated").html(stats.isolated);
    $("#quarantined").html(stats.quarantined);
    $("#risk-level").html("Risk Level: " + stats.riskLevel);
    setColor(stats.riskLevel);
}

function getIndex() {
    let date = $("#dateSelect").val();
    let index = data.length - 1;

    for (i = data.length - 1; i >= 0; i--) {
        if (date == data[i].date) 
            index = (data[i].id - 1);
    }

    return index;
}

function setColor(color) {
    if (color == "Green") {
        $(".bilboard h2").addClass("green");
    }
    else if (color == "Yellow") {
        $(".bilboard h2").addClass("yellow");
    }
    else if (color == "Orange") {
        $(".bilboard h2").addClass("orange");
    }
    else if (color == "Red") {
        $(".bilboard h2").addClass("red");
    }
}


function drawDonutCharts() {
    const currentRow = rowForDate( $("#dateSelect").val());

    let currentActiveStudentCases = currentRow.activeCasesStudent;
    let currentActiveFacultyCases = currentRow.activeCasesFacultyStaff;
    let currentTotalQuarantinedIsolated = currentRow.quarantined + currentRow.isolated;


    var studentsAffectedDoughnut = document.getElementById("studentsAffectedDoughnut");
    var myDoughnut1 = new Chart(studentsAffectedDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Student Active Cases', 'Total'],
            datasets: [{
                data: [currentActiveStudentCases, totalStudents-currentActiveStudentCases],
                backgroundColor: [
                    '#ffd301',
                    '#815558'
                ],
                borderWidth: 0
            }]
        }
    });

    var facultyAffectedDoughnut = document.getElementById("facultyAffectedDoughnut");
    var myDoughnut2 = new Chart(facultyAffectedDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Faculty/Staff Active Cases', 'Total'],
            datasets: [{
                data: [currentActiveFacultyCases, totalFacultyStaff-currentActiveFacultyCases],
                backgroundColor: [
                    '#ffd301',
                    '#815558'
                ],
                borderWidth: 0
            }]
        }
    });

    var quarantinedIsolatedDoughnut = document.getElementById("quarantinedIsolatedDoughnut");
    var myDoughnut3 = new Chart(quarantinedIsolatedDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['People in Quarantine or Isolation'],
            datasets: [{
                data: [currentTotalQuarantinedIsolated, totalStudents+totalFacultyStaff-currentTotalQuarantinedIsolated],
                backgroundColor: [
                    '#ffd301',
                    '#815558'
                ],
                borderWidth: 0
            }]
        }
    });


}

function drawLineCharts() {

    let activeStudentCasesList = [];
    let activeFacultyCasesList = [];
    let isolatedList = [];
    let quarantinedList = [];
    let quarantinedIsolatedList = [];
    let datesList = [];

    data.forEach(element => {
        activeStudentCasesList.push(element.activeCasesStudent);
        activeFacultyCasesList.push(element.activeCasesFacultyStaff);
        isolatedList.push(element.isolated);
        quarantinedList.push(element.quarantined);
        quarantinedIsolatedList.push(+element.quarantined + element.isolated);
        datesList.push(element.date);
    });

    

    var activeStudentCasesChart = document.getElementById('activeStudentCasesChart');
    var myChart1 = new Chart(activeStudentCasesChart, {
        type: 'line',
        data: {
            labels: datesList,
            datasets: [{
                label: 'Number of Active Student Cases',
                data: activeStudentCasesList,
                pointBackgroundColor: '#815558',
                pointBorderColor: 'rgb(128,0,0)',
                backgroundColor: '#815558',
                borderColor: 'rgb(128,0,0)',
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var activeFacultyCasesChart = document.getElementById('activeFacultyCasesChart');
    var myChart2 = new Chart(activeFacultyCasesChart, {
        type: 'line',
        data: {
            labels: datesList,
            datasets: [{
                label: 'Number of Active Faculty Cases',
                data: activeFacultyCasesList,
                pointBackgroundColor: '#815558',
                pointBorderColor: 'rgb(128,0,0)',
                backgroundColor: '#815558',
                borderColor: 'rgb(128,0,0)',
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    var quarantinedIsolatedChart = document.getElementById('quarantinedIsolatedChart');
    var myChart3 = new Chart(quarantinedIsolatedChart, {
        type: 'line',
        data: {
            labels: datesList,
            datasets: [
                {
                    label: 'Total in Isolation',
                    data: isolatedList,
                    pointBackgroundColor: '#ffd30188',
                    pointBorderColor: '#ffd301',
                    backgroundColor: '#ffd30188',
                    borderColor: '#ffd301',
                    borderWidth: 3
                },
                {
                label: 'Total in Quarantine',
                data: quarantinedList,
                pointBackgroundColor: '#800000',
                pointBorderColor: '#815558aa',
                backgroundColor: '#815558aa',
                borderColor: '#800000',
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

