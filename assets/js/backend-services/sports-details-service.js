$(document).ready(function(){

  window.onbeforeunload = function(event)
  {
      localStorage.setItem("sportEventId", sportEventId);
      return;
  };
  var sportEventId = localStorage.getItem('sportEventId');

  const removeLsData = () => {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      localStorage.removeItem('sectionId');
      localStorage.removeItem('sportEventId');
  }

  removeLsData();

    const pad_digits = (n) =>{
      return (n < 10 ? '0' : '') + n;
    }

    const eventCountDown = (eventDate) => {
      const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
      const countDown = new Date(eventDate).getTime(),
      x = setInterval(function() {
          const now = new Date().getTime(),
              distance = countDown - now;
          $(".days").text(pad_digits(Math.floor(distance / (day)))),
          $(".hours").text(pad_digits(Math.floor((distance % (day)) / (hour)))),
          $(".minutes").text(pad_digits(Math.floor((distance % (hour)) / (minute)))),
          $(".seconds").text(pad_digits(Math.floor((distance % (minute)) / second)));
        if (distance < 0) {
          clearInterval(x);
          window.location.href = "sports.html";
        }
      }, 1000);
    }

    const getSportById = (sportsId) => {
        $.ajax({
            url: endpoint+"sports/getSportsById",
            type: "get",
            data: { 
                sport_Id: sportsId
            },
            success: function(response) {
              $('.event-about h2').text(response[0].title);
              $('.event-search-top h3').text(response[0].title);
              $('.event-about p').text(response[0].description);
              $('.address-line-one').text(response[0].ground_name);
              $('.address-line-two').text(response[0].ground_location);
              $('.event-about-thumb img').attr('src', response[0].image_url);
              eventCountDown(response[0].date_time);
            },
            error: function(xhr) {
              //Do Something to handle error
            }
        });
    };
    getSportById(sportEventId);
 });