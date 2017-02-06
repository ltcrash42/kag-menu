// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const agGrid = require('ag-grid');
const jsonFile = require('jsonfile');
jsonFile.spaces = 4;

var columnDefs = [
        { headerName: 'Entr&eacute;e', field: 'entree', filter: 'text', width: 250 },
        { headerName: 'Hot Meals', field: 'hotMeals', filter: 'number', width: 125 },
        { headerName: 'Total Meals', field: 'totalMeals', filter: 'number', width: 125 },
        { headerName: 'Sales', field: 'sales', width: 125 },
        { headerName: 'Day of Week', field: 'dayOfWeek', filter: 'text', width: 125 },
        { headerName: 'Date', field: 'date', filter: 'text', width: 125 }
    ];

var gridOptions = {
        columnDefs: columnDefs,
        rowSelection: 'multiple',
        enableColResize: true,
        enableSorting: true,
        enableFilter: true,
        enableRangeSelection: true,
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        singleClickEdit: true,
        rowHeight: 22,
        animateRows: false,
        onModelUpdated: modelUpdated,
        debug: false,
        suppressClickEdit: false,
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
    var btAddEntree = document.querySelector('#btAddEntree');

    // this example is also used in the website landing page, where
    // we don't display the buttons, so we check for the buttons existance
    if (btAddEntree) {
        btAddEntree.addEventListener('click', onBtAddEntree);
    }

    addQuickFilterListener();
    initializeGrid();
});

function initializeGrid() {
    var eGridDiv = document.querySelector('#dataGrid');
    new agGrid.Grid(eGridDiv, gridOptions);

    jsonFile.readFile('data.json', function(err,obj) {
      gridOptions.api.setRowData(obj);
    });
}

function destroyGrid() {
    gridOptions.api.destroy();
}

function onBtAddEntree() {
  var entreeInput = document.querySelector('#entreInput');
  var hotMealsInput = document.querySelector('#hotMealsInput');
  var totalMealsInput = document.querySelector('#totalMealsInput');
  var salesInput = document.querySelector('#salesInput');
  var dateInput = document.querySelector('#dateInput');
  var date = new Date(dateInput.value);
  var dayOfWeek = date.getDay();

  jsonFile.readFile('data.json', function(err, obj) {
      obj.push({
          "entree":entreeInput.value,
          "hotMeals":parseInt(hotMealsInput.value),
          "totalMeals":parseInt(totalMealsInput.value),
          "sales":parseFloat(salesInput.value),
          "dayOfWeek":getWeekday(dayOfWeek),
          "date":date.toLocaleDateString('en-US')
      });
      jsonFile.writeFile('data.json', obj);
      destroyGrid();
      initializeGrid();
      entreeInput.value = '';
      hotMealsInput.value = '';
      totalMealsInput.value = '';
      salesInput.value = '';
      dateInput.value = '';
  });
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

function getWeekday(dayInt){
  switch(dayInt){
    case 0: return 'Sunday';
    case 1: return 'Monday';
    case 2: return 'Tuesday';
    case 3: return 'Wednesday';
    case 4: return 'Thursday';
    case 5: return 'Friday';
    case 6: return 'Saturday';
  }
}
