$(document).ready(function(){
  let profile = $("#profile");
  let editForm = $("#edit-form");
  let profileBtn = $("#toggle");
  let mySubjects = $("#my-subjects");
  let profileSubjects = $("#profile-subjects");
  let subjectsTable = $("#subjectsTable");
  editForm.hide();

  $("#toggle").click(function(){
    profile.toggle();
  });

  filterTableBySubjects();

  $("#edit-profile").click(function() {
    $("#name-input").val($("#profile-name").text());
    $("#age-input").val($("#profile-age").text());
    profile.hide();
    editForm.show();
    profileBtn.prop("disabled", true);
    profileBtn.hide();
  });

  $("#cancel-edit").click(function() {
    event.preventDefault();
    editForm.hide();
    profile.show();
    profileBtn.prop("disabled", false);
    profileBtn.show();
  });

  $("#save-edit").click(function(event) {
    event.preventDefault();
    let name = $("#name-input").val();
    let age = $("#age-input").val();

    function insertDepartmentsAsListItems() {
      let subjects = mySubjects.children('li');
      profileSubjects.empty();
      subjects.each(function(index) {
        let subjectName = $(this).text();
        let listItem = $("<p>").text(subjectName);
        profileSubjects.append(listItem);
      });
    }
  
    insertDepartmentsAsListItems();

    if (name === $("#profile-name").text() &&
        age === $("#profile-age").text()) {
      alert("No changes were made to name and age");
      return;
    }
    $("#profile-name").text(name);
    $("#profile-age").text(age);
    editForm.hide();
    profile.show();
    profileBtn.prop("disabled", false);
  });

  $.getJSON("subjects_data.json", function(data) {
    for (let i = 0; i < data.table.length; i++) {
      subjectsTable.append("<tr><td>" + data.table[i].subject + "</td><td>" + data.table[i].marks + "</td></tr>");
    }
    subjectsTable.find("tr").hide();
    initialFilter();
    function initialFilter() {
      let currentSubjects = [];
      profileSubjects.find("p").each(function() {
        currentSubjects.push($(this).text());
      });
    
      // Show only the rows that match the current subjects
      subjectsTable.find("tr").each(function() {
        let subject = $(this).find("td:first-child").text();
        if ($.inArray(subject, currentSubjects) !== -1) {
          $(this).show();
        }
      });
    }
  });
  function filterTableBySubjects() {
    let filteredSubjects = [];
    profileSubjects.find("p").each(function() {
      filteredSubjects.push($(this).text());
    });

    // Hide all rows in the table
    subjectsTable.find("tr").hide();
    profileSubjects.find("p").hide();

    // Show only the rows that match the filtered subjects
    subjectsTable.find("tr").each(function() {
      let subject = $(this).find("td:first-child").text();
      if ($.inArray(subject, filteredSubjects) !== -1) {
        $(this).show();
      }
    });
  }

  // Call the filterTableBySubjects function when the profile subjects change
  profileSubjects.on("DOMSubtreeModified", function() {
    filterTableBySubjects();
  });
});
