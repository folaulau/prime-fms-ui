
$(document).ready(function(){
    // call api to get all customers

    $('#apiMessage').puimessages();

    $('#addButton').puibutton();

    $('#in').puiinputtext();

    $('#slinAddUpdateRow').puifieldset();

    $('#saveButton').puibutton();

    var columnHeaders = [
        {
            field: "uid",
            headerText: "UID",
            sortable: true,
            filter: true,
            filterMatchMode: 'contains',
            editor: 'input'
        },
        {
            field: "chargeCode",
            headerText: "Charge Code",
            sortable: true,
            filter: true,
            filterMatchMode: 'contains',
            editor: 'input'
        },
        {
            field: "slin",
            headerText: "SLIN",
            sortable: true,
            filter: true,
            filterMatchMode: 'contains',
            editor: 'input'
        },
        {
            field: "tpsId",
            headerText: "TPS ID",
            sortable: true,
            filter: true,
            filterMatchMode: 'contains',
            editor: 'input'
        },
        {
            field: "tpsName",
            headerText: "TPS Name",
            sortable: true,
            filter: true,
            filterMatchMode: 'contains',
            editor: 'input'
        },
        {
            field: "notes",
            headerText: "Notes",
            sortable: true,
            filter: true,
            filterMatchMode: 'contains',
            editor: 'input'
        },
        {
            field: "effectiveDate",
            headerText: "Effective Date",
            sortable: true,
            filter: true,
            filterMatchMode: 'contains',
            editor: 'input'
        },
        {
            field: "closedDate",
            headerText: "Closed Date",
            sortable: true,
            filter: true,
            filterMatchMode: 'contains',
            editor: 'input'
        }
    ];


    var slinRows = [];
    var updatedRows = [];
    var pageNumber = 0;
    var pageSize = 1000;

    loadData(pageNumber, pageSize);

    // displaySlinDataTable(pageNumber, pageSize);

    var latestId = 0;
    var pageResults = {};

    function loadData(pageNumber, pageSize){
        var customers = [];
        var pagination = {
            pageNumber: pageNumber,
            pageSize: pageSize
        };

        getSlins(pagination).then(data => {
            console.log('data');
            console.log(data);
            slinRows = data.content;
            pageResults = data;
            latestId = Math.max(...slinRows.map(slinRow => slinRow.uid));
            console.log(`latestId: `, latestId); // Output: 5

            displayTable(pageNumber, pageSize);
        });

        // slinRows = backendData;
        // latestId = Math.max(...slinRows.map(slinRow => slinRow.id));
        // displayTable(pageNumber, pageSize);
    }



    function displayTable( pageNumber, pageSize){
        console.log('slinRows');
        console.log(slinRows);

        $('#currentSlinsTable').puidatatable({
            responsive: true,
            columns: columnHeaders,
            datasource: slinRows,
            paginator: { rows: 10 },
            editMode: 'cell',
            cellEdit: hanldeCellEdit
        });
    }

    
    // function displaySlinDataTable( pageNumber, pageSize){

    //     $('#slinDataTable').puidatatable({
    //         responsive: true,
    //         columns: slindDataColumnHeaders,
    //         datasource: slinData,
    //         paginator: { rows: 10 }
    //     });
    // }

    function isUnchangedRow(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) { // Ensure it's a direct property of the object
                const field = obj[key];
                if (field.initialValue !== field.value) {
                    return false; // If any field has a different value, return false
                }
            }
        }
        return true; // If all pairs are equal, return true
    }

    var updatedRowData = {};

    function updateRowData(rowId, column, oldValue, newValue){
        let row = updatedRowData[rowId];
        if(row === undefined){
            row = {};
        }

        if(row[column] === undefined){
            row[column] = {};
            row[column]['initialValue'] = oldValue;
        }

        let initialValue = row[column]['initialValue'];

        console.log("initialValue", initialValue);
        console.log("newValue", newValue);

        row[column]['value'] = newValue;

        if(initialValue === newValue){
            // no change
            return !isUnchangedRow(row);
        }
        
        updatedRowData[rowId] = row;

        console.log("row", row);

        return true;
    }


    function hanldeCellEdit(event, data){
        console.log("hanldeCellEdit");
        console.log(`event `, event);
        console.log(`data `, data);
        console.log("Updated updatedRows:", updatedRows);

        // Extract the row data and ID
        const fieldName = data.field;
        const editedRow = data.data;
        const rowUid = editedRow.uid;

        const table = $('#currentSlinsTable'); // Ensure this matches your table's ID or selector
        const tableRows = table.find('tbody tr'); // Get all rows in the table

        const matchingRow = tableRows.filter((index, row) => {
            // console.log("row", row);
            // console.log("$row", $(row));
            const firstCell = $(row).find('td:first');
            // console.log("firstCell", firstCell);
            // console.log("firstCell.text()", firstCell.text());
            id = firstCell.text().replace(/\D/g, ""); // Extract the ID from the first cell
            return id === String(editedRow.uid); // Match the `id` attribute with the edited row ID
        });

          // Check and validate Effective Date or Closed Date format
        if (fieldName === 'effectiveDate' || fieldName === 'closedDate') {
            let dateValue = data.newValue;

            const cellIndex = columnHeaders.findIndex(header => header.field === fieldName);
            console.log(`cellIndex:`, cellIndex);
            const dateCell = matchingRow.find(`td:eq(${cellIndex})`);
            console.log(`Specific Cell for ${fieldName}:`, dateCell);

            if (!isValidDate(dateValue)) {
                // Highlight invalid cells
                dateCell.addClass('invalid-date-format-cell');
                showMessage('error', 'Invalid Date Format', 'Please enter a valid date format (yyyy-mm-dd)');
                // return;
            } else {
                dateCell.removeClass('invalid-date-format-cell');
            }
        }

        // // if fieldName is effectiveDate or closedDate, validate the format of the date
        // if(fieldName === 'effectiveDate' || fieldName === 'closedDate'){
        //     let dateValue = data.newValue;
        //     if(!isValidDate(dateValue)){
        //         showMessage('error', 'Invalid Date Format', 'Please enter a valid date format (yyyy-mm-dd)');
        //         return;
        //     }
        // }

        // Check if the row already exists in updatedRows
        const existingIndex = updatedRows.findIndex(row => row != undefined && row != null && row.uid === rowUid);

        console.log("existingIndex:", existingIndex);

        if (existingIndex >= 0) {
            // Replace the existing entry
            updatedRows[existingIndex] = editedRow;
            console.log(`Replaced existing row at index ${existingIndex} in updatedRows.`);
        } else {
            // Add the new row
            updatedRows.push(editedRow);
            console.log("Added new row to updatedRows.");
        }



        let isUpdated = updateRowData(rowUid, data.field, data.oldValue, data.newValue);

        console.log("isUpdated ", isUpdated);

        if (isUpdated && matchingRow.length > 0) {
            $(matchingRow).addClass('updated-row'); // Add the `updated-row` class
            console.log("Row highlighted:", matchingRow);
        } else {
            $(matchingRow).removeClass('updated-row');
            console.warn("No matching row found for ID:", editedRow.uid);
        }

        console.log("Updated updatedRows:", updatedRows);

    }

    function isValidDate(dateString){
        if(dateString === null || dateString === undefined || dateString === ''){
            return true;
        }
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)){
            return false;
        }
        return true
    }

    function showMessage(type, summary, detail, duration){
        $('#apiMessage').puimessages('show', type, {summary: summary, detail: detail});

        if(duration === undefined || duration === null){
            duration = 2000;
        }

        // Hide the message after 2 seconds
        setTimeout(function () {
            $('#apiMessage').puimessages('clear');
        }, duration); // 2000 milliseconds = 2 seconds
    }

    $("#saveButton").click(function(){

        console.log('save updatedRows', updatedRows);

        // if(updatedRows.length === 0){
        //     showMessage('warn', 'No valid data to save', '');
        //     return;
        // }
        
        var errorMessages = '';
        updatedRows.forEach(row => {
            let effectiveDate = row.effectiveDate;
            if(effectiveDate !== null && effectiveDate !== undefined && effectiveDate !== ''){
                if(!isValidDate(effectiveDate)){
                    errorMessages += `Invalid Effective Date format for row with UID: ${row.uid}<br/>`;
                }
            }

            let closedDate = row.closedDate;
            if(closedDate !== null && closedDate !== undefined && closedDate !== ''){
                if(!isValidDate(closedDate)){
                    errorMessages += `Invalid Closed Date format for row with UID: ${row.uid}<br/>`;
                }
            }
        });

        console.log("errorMessages: "+ errorMessages);

        if(errorMessages !== ''){
            console.log("show errorMessages: "+ errorMessages);
            showMessage('error', 'Invalid Values', errorMessages, 999999);
            return;
        }

        updatedRows = updatedRows.map(row => {
            if (String(row.uid).startsWith("New Id")) {
              row.uid = null;
            }
            return row;
        });

        addUpdate(updatedRows);
    });

    function addUpdate(rows){
        console.log("rows", rows);
        var payload = rows;
        updateSlinTpsMapping(payload).then(data => {
            console.log('newly saved data', data);
            showMessage('info', 'Successfully saved data', '');
            loadData(pageNumber, pageSize);
            updatedRows = [];
        });
    }

    $("#addButton").click(function(){
        latestId++;
        console.log('add button clicked, '+latestId);
  
        slinRows.unshift({
            uid: 'New Id '+latestId,
            chargeCode: '',
            slin: '',
            tpsId: '',
            tpsName: '',
            notes: '',
            effDate: '',
            closedDate: ''
        });

        displayTable();
        
    });

    

    // displayTable();
});
