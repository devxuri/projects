$(document).ready(function() {
    let maxSubjects = 3; 
    
    $(".draggable-element").draggable({
      revert: "invalid",
      helper: "clone"
    });

    $(".droppable-area").droppable({
      drop: function(event, ui) {
        let subject = ui.draggable;
        
        if ($(this).attr('id') == 'my-subjects') {
          if ($("#my-subjects .draggable-element").length >= maxSubjects) {
            alert("You have reached the maximum number of subjects allowed. Please remove a subject before adding a new one.");
            return false;
          }
    
          $(this).append(subject.clone());
          subject.remove();
        } else {
          let id = subject.attr('data-id');
          $('#' + id).appendTo('#available-subjects');
        }
        
        $(".draggable-element").draggable({
          revert: "invalid",
          helper: "clone"
        });
      }
    });
  });