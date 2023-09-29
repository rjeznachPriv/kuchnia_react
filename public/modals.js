$('#edit-ware-instance-modal').on('show.bs.modal', function (e) {
    var wareInstanceId = $(e.relatedTarget).data('ware-id');
    var elementToEdit = _.find(model.wareInstances(), ['guid', wareInstanceId]);

    console.log(elementToEdit);

    //model.selectedWare = ko.observable(elementToEdit.ware);
    model.selectedWare(elementToEdit.ware);
    console.log(model.selectedWare);
    console.log(model.selectedWare());

    //self.selectedWare = ko.observable();
    //self.selectedCloset = ko.observable();
    //self.selectedExpDate = ko.observable();
    //self.selectedPurchaseDate = ko.observable();
    //self.wareInstanceAmount = ko.observable();
    //self.openClosed = ko.observable();

    //yViewModel.personName('Mary')
});


$('#remove-ware-instance-modal').on('show.bs.modal', function (e) {
    var wareId = $(e.relatedTarget).data('ware-id');
    var wareName = $(e.relatedTarget).data('ware-name');
    $(e.currentTarget).find('input[name="wareInstanceId-modal-hidden"]').val(wareId);
    $(e.currentTarget).find('span[name="wareInstance-name"]').text(wareName);
});

$('#remove-ware-modal').on('show.bs.modal', function (e) {
    var wareId = $(e.relatedTarget).data('ware-id');
    var wareName = $(e.relatedTarget).data('ware-name');
    $(e.currentTarget).find('input[name="wareId-modal-hidden"]').val(wareId);
    $(e.currentTarget).find('span[name="ware-name"]').text(wareName);
});

