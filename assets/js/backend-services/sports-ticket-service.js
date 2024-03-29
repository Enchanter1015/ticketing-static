$(document).ready(function(){
    window.onbeforeunload = function(event)
  {
      localStorage.setItem("sportEventId", sportEventId);
      localStorage.setItem("sectionId", sectionId);
      return;
  };
  var sportEventId = localStorage.getItem('sportEventId');
  var sectionId = localStorage.getItem('sectionId');

  const removeLsData = () => {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      localStorage.removeItem('sectionId');
      localStorage.removeItem('sportEventId');
  };

  removeLsData();
  
    const getSectionsBySportById = (sportsId) => {
        $.ajax({
            url: endpoint+"section/getSectionsBySportId",
            type: "get",
            data: { 
                sport_Id: sportsId
            },
            success: function(response) {
                var ticketSections = $('.ticket-sections');
                for (const ticketSection of response){

                    ticketSections.append(
                        `
                        <div class="col-12 ticket-section" data-image=${ticketSection.section_img} data-section-id=${ticketSection.ticket_section_id} style="margin-bottom:10px;cursor:pointer">
                            <div class="list-group-item list-group-item-action flex-column align-items-start active" style="background-color: #0a1e5e;" >
                                <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">${ticketSection.title}</h5>
                                </div>
                                <h3 class="mb-1">LKR ${ticketSection.price}</h3>
                                <small>Available seats : ${ticketSection.available_seat_count}</small>
                                <a href="${ticketSection.available_seat_count > 0 ? 'sports-checkout.html':'#'}" class="custom-button section-ticket-reserve ml-3">proceed</a>
                            </div>
                        </div>`

                    );
                }
            },
            error: function(xhr) {
              //Do Something to handle error
            }
        });
    };

    const getSportById = (sportsId) => {
        $.ajax({
            url: endpoint+"sports/getSportsById",
            type: "get",
            data: { 
                sport_Id: sportsId
            },
            success: function(response) {
                const eventDate = new Date(response[0].date_time);
                const monthShort = eventDate.toLocaleString('en-US', {month: 'short'}).toString().toUpperCase();
                var days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
                $('.sport-title').text(response[0].title);
                $('.sport-venue').text(response[0].ground_name +", "+response[0].ground_location);
                $('.sport-event-date').text(days[eventDate.getDay()]+", "+monthShort+" "+eventDate.getDate()+" "+eventDate.getFullYear());
                $('.section-main-img').attr('src', response[0].ground_img);
                $('.section-main-img').attr('data-default-image', response[0].ground_img);
            },
            error: function(xhr) {
              //Do Something to handle error
            }
        });
    };
    getSportById(sportEventId);
    getSectionsBySportById(sportEventId)

    $(".ticket-sections").on("mouseover", ".ticket-section" , function() {
        $('.section-main-img').attr('src', $(this).data('image'))
    });

    $(".ticket-sections").on("mouseout", ".ticket-section" , function() {
        var groundImage = $('.section-main-img');
        groundImage.attr('src', groundImage.data('defaultImage'))
    });

    $(".ticket-sections").on("click", ".ticket-section" , function() {
        sectionId= $(this).data('sectionId');
    });
});