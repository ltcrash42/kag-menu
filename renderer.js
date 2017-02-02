// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const agGrid = require('ag-grid');

var columnDefs = [
        { headerName: 'Entr&eacute;e', field: 'entree', filter: 'text', width: 250 },
        { headerName: 'Hot Meals', field: 'hotMeals', filter: 'number', width: 125 },
        { headerName: 'Total Meals', field: 'totalMeals', filter: 'number', width: 125 },
        { headerName: 'Sales', field: 'sales', width: 125 },
        { headerName: 'Day of Week', field: 'dayOfWeek', filter: 'text', width: 125 },
        { headerName: 'Date', field: 'date', filter: 'text', width: 125 }
    ];


var rowData = [
    {entree: "Gyro", hotMeals: 143, totalMeals: 268, sales: 561.00, dayOfWeek: 'Monday', date: '1-1-2017'},
    {entree: "Baked Chicken", hotMeals: 158, totalMeals: 272, sales: 596.00, dayOfWeek: 'Tuesday', date: '1-2-2017'},
    {entree: "Maple Glazed Porkloin", hotMeals: 134, totalMeals: 255, sales: 535.50, dayOfWeek: 'Wednesday', date: '1-3-2017'},
    {entree: "Charbroiled CAB Sirloin", hotMeals: 158, totalMeals: 289, sales: 597.50, dayOfWeek: 'Thursday', date: '1-4-2017'},
    {entree: "Broiled Grouper", hotMeals: 155, totalMeals: 227, sales: 524.50, dayOfWeek: 'Friday', date: '1-5-2017'}
];

var gridOptions = {
        columnDefs: columnDefs,
        rowSelection: 'multiple',
        enableColResize: true,
        enableSorting: true,
        enableFilter: true,
        enableRangeSelection: true,
        suppressRowClickSelection: true,
        rowHeight: 22,
        animateRows: true,
        onModelUpdated: modelUpdated,
        debug: true,
        headerCellTemplate : '<div class="ag-header-cell">' +
        '<div id="agResizeBar" class="ag-header-cell-resize"></div>' +
        '<span id="agMenu" style="float: right; padding: 2px; margin-top: 4px; margin-left: 2px;"><i class="fa fa-bars"></i></span>' +
        '<div id="agHeaderCellLabel" class="ag-header-cell-label" style="padding: 4px;">' +
        '<span id="agText" class="ag-header-cell-text"></span>' +
        '<span id="agSortAsc"><i class="fa fa-long-arrow-down"></i></span>' +
        '<span id="agSortDesc"><i class="fa fa-long-arrow-up"></i></span>' +
        '<span id="agNoSort"></span>' +
        '<span id="agFilter"><i class="fa fa-filter"></i></span>' +
        '</div>' +
        '</div>'
    };

var btBringGridBack;
var btDestroyGrid;

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function() {
    btBringGridBack = document.querySelector('#btBringGridBack');
    btDestroyGrid = document.querySelector('#btDestroyGrid');

    // this example is also used in the website landing page, where
    // we don't display the buttons, so we check for the buttons existance
    if (btBringGridBack) {
        btBringGridBack.addEventListener('click', onBtBringGridBack);
        btDestroyGrid.addEventListener('click', onBtDestroyGrid);
    }

    addQuickFilterListener();
    onBtBringGridBack();
});

function onBtBringGridBack() {
    var eGridDiv = document.querySelector('#bestHtml5Grid');
    new agGrid.Grid(eGridDiv, gridOptions);
    if (btBringGridBack) {
        btBringGridBack.disabled = true;
        btDestroyGrid.disabled = false;
    }
    gridOptions.api.setRowData(rowData);
}

function onBtDestroyGrid() {
    btBringGridBack.disabled = false;
    btDestroyGrid.disabled = true;
    gridOptions.api.destroy();
}

function addQuickFilterListener() {
    var eInput = document.querySelector('#quickFilterInput');
    eInput.addEventListener("input", function () {
        var text = eInput.value;
        gridOptions.api.setQuickFilter(text);
    });
}

function modelUpdated() {
    var model = gridOptions.api.getModel();
    var totalRows = model.getTopLevelNodes().length;
    var processedRows = model.getRowCount();
  //  var eSpan = document.querySelector('#rowCount');
  //  eSpan.innerHTML = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
}
