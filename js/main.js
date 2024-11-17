console.log("test top");
// Date stuff
var today = moment();
var inaguration = moment('2025-01-20')
var election = moment('2024-11-05')

$('#inaguration-days').html(inaguration.diff(today, 'days') > 0 ? inaguration.diff(today, 'days') : 'NA');

$('#days-in-office').html(today.diff(inaguration, 'days') > 0 ? today.diff(inaguration, 'days') : 0);

$('#days-since-election').html(today.diff(election, 'days') > 0 ? today.diff(election, 'days') : 0);

$(document).ready(function () {
    // Add handler to all the filterData checkboxes to filter the table.
    $('input[type=checkbox][name=filterData]').change(function () {
        if ($(this).is(':checked')) {
            $(`td:contains(${this.value})`).parent().show();
        } else {
            $(`td:contains(${this.value})`).parent().hide();
        }

        $('#count').html($('#dataTable tbody tr:visible').length);
    });

    $("#search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#dataTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });

        $('#count').html($('#dataTable tbody tr:visible').length);
    });

    $("#filterReset").click(function () {
        $('input[type=checkbox][name=filterData]').prop('checked', true);
        $("#search").prop('value', "");
        $('input[type=checkbox][name=filterData]').trigger('change');
    });

    $('input[type=checkbox][name=filterData]').trigger('change');
});
