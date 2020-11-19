$(function(){

    getDates();
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

    $("#dateSelect").change(function() {
        getData();
    });

});

async function getDates() {
    let response = await fetch("https://sheet.best/api/sheets/bf9fbbc3-aac1-48f4-98f2-7715cbb6d295");
    let data = await response.json();
    let values = Object.values(data);
    for (i=data.length-1; i>=0; i--){
        if (values[i].id == null || values[i].date == null || values[i].activeCasesStudent == null || values[i].activeCasesFacultyStaff == null || values[i].isolated == null || values[i].quarantined == null || values[i].riskLevel == null) {
            continue;
        }
        else {
            $("#dateSelect").append(new Option(values[i].date));
        }
    };
};

async function getData(){
    let response = await fetch("https://sheet.best/api/sheets/bf9fbbc3-aac1-48f4-98f2-7715cbb6d295");
    let data = await response.json();
    let index = getIndex(data);
    let current = data[index];
    let values = Object.values(current);
    getValues(values);
    drawCharts(data);
};

function getValues(values) {
    $("#date").html(values[1]);
    $("#active-cases-student").html(values[2]);
    $("#active-cases-faculty-staff").html(values[3]);
    $("#isolated").html(values[4]);
    $("#quarantined").html(values[5]);
    $("#risk-level").html("Risk Level: " + values[6]);
    setColor(values[6]);
};

function getIndex(data) {
    let date = $("#dateSelect").val();
    let index = data.length-1;

    for (i=data.length-1; i>=0; i--){
        if (date == data[i].date) index = (data[i].id - 1);
    };

    return index;
};

function setColor(color) {
    if (color == "Green"){
        $(".bilboard h2").addClass("green");
    }
    else if (color == "Yellow"){
        $(".bilboard h2").addClass("yellow");
    }
    else if (color == "Orange"){
        $(".bilboard h2").addClass("orange");
    }
    else if (color == "Red"){
        $(".bilboard h2").addClass("red");
    }
};

function drawCharts(input) {

    let currentActiveStudentCases = input[input.length-1].activeCasesStudent;
    let currentActiveFacultyCases = input[input.length-1].activeCasesFacultyStaff;
    let currentTotalQuarantinedIsolated = +input[input.length-1].quarantined + +input[input.length-1].isolated;
    let activeStudentCasesList = [];
    let activeFacultyCasesList = [];
    let quarantinedIsolatedList = [];
    let datesList = [];
    input.forEach(element => {
        activeStudentCasesList.push(element.activeCasesStudent);
        activeFacultyCasesList.push(element.activeCasesFacultyStaff);
        quarantinedIsolatedList.push(+element.quarantined + +element.isolated);
        datesList.push(element.date);
    });

    // Total number of students = 1132
    // Total number of faculty = 300

    var studentsAffectedDoughnut = document.getElementById("studentsAffectedDoughnut");
    var myDoughnut1 = new Chart(studentsAffectedDoughnut, {
    type: 'pie',
    data: {
        labels: ['Current Student Active Cases', 'Total Students'],
        datasets: [{
        data: [currentActiveStudentCases, 1132],
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
    type: 'pie',
    data: {
        labels: ['Current Faculty/Staff Active Cases', 'Total Faculty/Staff'],
        datasets: [{
        data: [currentActiveFacultyCases, 300],
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
        labels: ['Total in Quarantine or Isolation', 'Total On Campus'],
        datasets: [{
        data: [currentTotalQuarantinedIsolated, 1132 + 300],
        backgroundColor: [
            '#ffd301',
            '#815558'
        ],
        borderWidth: 0
        }]
    }
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
        datasets: [{
            label: 'Total in Quarantine or Isolation',
            data: quarantinedIsolatedList,
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
};

