/**
 * Theme: Frogetor - Responsive Bootstrap 4 Admin Dashboard
 * Author: Mannatthemes
 * Jsgrid Js
 */


 
$(function() {

  $("#jsGrid").jsGrid({
    height: "70%",
    width: "100%",
    filtering: true,
    editing: true,
    inserting: false,
    sorting: true,
    paging: true,
    autoload: true,
    pageSize: 15,
    pageButtonCount: 5,
    deleteConfirm: "Вы реально хотите удалить строку?",
    controller: db,
    fields: [
        { name: "Заголовок", type: "text", width: 150 },
        { name: "Age", type: "number", width: 50 },
        { name: "Address", type: "text", width: 200 },
        { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
        { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
        { type: "control" }
    ]
});

});
