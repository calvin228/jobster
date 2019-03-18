$(function() {
  $.getJSON("/json/kota-kabupaten.json", location => {
    $.each(location, (index, value) => {
      $("#location").append(`<option value="${value}">${value}</li>`);
    });
  });
});
