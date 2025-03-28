$(document).ready(function(){


    $('#apiMessage').puimessages();
    var apiDomain = 'http://localhost:8092/api';

    $("#createWADPerSingleEmployeeBtn").click(function(){
        console.log("createWADPerSingleEmployeeBtn clicked! ");
        let employeeUid = $("#createWADEmployeeUidInput").val();
        console.log("employeeUid ", employeeUid);

        let requestPayload = {
            uid: employeeUid
        };

        $.ajax({
            url: apiDomain+'/employees/create-wad',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestPayload),
            success: function(data) {
                console.log(data);
                showMessage('info', 'Successfully created WAD', '',2000);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                showMessage('error', '', errorMessages, 999999);
            }
        });
    });

    $("#createWADForSupervisorAndTPSIdBtn").click(function(){
        console.log("createWADForSupervisorAndTPSIdBtn clicked! ");
        let supervisorUuid = $("#createWADSupervisorUidAndTPSId_supUid_Input").val();
        console.log("supervisorUuid ", supervisorUuid);
        let tpsId = $("#createWADSupervisorUidAndTPSId_tps_Input").val();

        let requestPayload = {
            supervisorUuid: supervisorUuid,
            tpsId: tpsId
        };

        $.ajax({
            url: apiDomain+'/employees/create-wad/for-supervisor',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestPayload),
            success: function(data) {
                console.log(data);
                showMessage('info', 'Successfully created WAD', '',2000);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                showMessage('error', '', errorMessages, 999999);
            }
        });
    });

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
});