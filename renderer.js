// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const agGrid = require('ag-grid');
const jsonFile = require('jsonfile');
jsonFile.spaces = 4;

var columnDefs = [
        { headerName: 'Id', field: 'id', hide: true},
        { headerName: 'Entr&eacute;e', field: 'entree', filter: 'text', width: 450 },
        { headerName: 'Hot Meals', field: 'hotMeals', filter: 'number', width: 130 },
        { headerName: 'Total Meals', field: 'totalMeals', filter: 'number', width: 130 },
        { headerName: 'Sales', field: 'sales', width: 130, cellRenderer: SalesCellRenderer },
        { headerName: 'Day of Week', field: 'dayOfWeek', filter: 'text', width: 135,
          values:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        { headerName: 'Date', field: 'date', filter: 'text', width: 125 }
    ];

var gridOptions = {
        columnDefs: columnDefs,
        rowSelection: 'single',
        enableColResize: true,
        enableSorting: true,
        enableFilter: true,
        debug: false,
        defaultColDef: {
          editable: false,
          suppressMovable: true
        },
        suppressCellSelection: true,
        suppressRowClickSelection: false,
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

var formAddEntree;

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function() {
    var btAddEntree = document.querySelector('#btAddEntree');
    var btRemoveSelected = document.querySelector('#btRemoveSelected');
    var btDeselectAll = document.querySelector('#btDeselectAll');
    formAddEntree = $('#formAddEntree');

    if (btAddEntree) {
        btAddEntree.addEventListener('click', onBtAddEntree);
        btRemoveSelected.addEventListener('click', onRemoveSelected);
        btDeselectAll.addEventListener('click', deselectAll);
    }

    addQuickFilterListener();
    initializeGrid();
});

function initializeGrid() {
    var eGridDiv = document.querySelector('#dataGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    gridOptions.api.addEventListener('rowSelected', onSelected);
    jsonFile.readFile('data.json', function(err,obj) {
      gridOptions.api.setRowData(obj);
    });
}

function destroyGrid() {
    gridOptions.api.destroy();
}

function onSelected(){
  var selected = gridOptions.api.getSelectedRows();
  if(selected != undefined && selected.length > 0)
  {
    $('#btRemoveSelected').prop('disabled', false);
  }
  else {
    $('#btRemoveSelected').prop('disabled', true);
  }
}

function deselectAll() {
  gridOptions.api.deselectAll();
  $('.ag-bootstrap .ag-cell-focus').removeClass('ag-cell-focus');
}

function onBtAddEntree() {
  var entreeInput = document.querySelector('#entreInput');
  var hotMealsInput = document.querySelector('#hotMealsInput');
  var totalMealsInput = document.querySelector('#totalMealsInput');
  var salesInput = document.querySelector('#salesInput');
  var dateInput = document.querySelector('#dateInput');
  var date = new Date(dateInput.value);
  var dayOfWeek = date.getUTCDay();

  var invalidFields = formAddEntree.find(':invalid');
  invalidFields.each(function(){
    $(this).parents('.form-group').addClass('has-error');
  });
  if(invalidFields.length > 0){return false;}

  var newEntree = {
      "id":guid(),
      "entree":entreeInput.value,
      "hotMeals":parseInt(hotMealsInput.value),
      "totalMeals":parseInt(totalMealsInput.value),
      "sales":parseFloat(salesInput.value),
      "dayOfWeek":getWeekday(dayOfWeek),
      "date":dateInput.value
  };

  jsonFile.readFile('data.json', function(err, obj) {
      if(!obj){obj = [];}
      obj.push(newEntree);
      jsonFile.writeFile('data.json', obj);
      gridOptions.api.addItems([newEntree]);
      formAddEntree.find('input').each(function(){
        $(this).parents('.form-group').removeClass('has-error');
        $(this).val('');
      });
  });
  return false;
}

function onRemoveSelected(){
    var selectedNodes = gridOptions.api.getSelectedNodes();
    gridOptions.api.removeItems(selectedNodes);
    jsonFile.readFile('data.json', function(err, obj){
      var selected = obj.map(function(e) {return e.id;}).indexOf(selectedNodes[0].data.id);
      obj.splice(selected, 1);
      jsonFile.writeFile('data.json', obj);
    });
}

function addQuickFilterListener() {
    var eInput = document.querySelector('#quickFilterInput');
    eInput.addEventListener("input", function () {
        var text = eInput.value;
        gridOptions.api.setQuickFilter(text);
    });
}

function SalesCellRenderer(){

}

SalesCellRenderer.prototype.init = function (params) {
    if (params.value === "" || params.value === undefined || params.value === null) {
        this.eGui = '';
    } else {
        var dollar = '<span class="fa fa-dollar"></span>';
        this.eGui = dollar + params.value;
    }
};

SalesCellRenderer.prototype.getGui = function() {
    return this.eGui;
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

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
