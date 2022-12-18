$(document).ready(function(){
    const getAllSports = () => {
        $.ajax({
            url: endpoint+"sports/getAllSports",
            type: "get",
            data: { 
                page: 0, 
                date_from: '', 
                date_to: '',
                sport_type_id: 0,
                limit: ''
            },
            success: function(response) {
                console.log(response);
                var sportsCarousel = $('.sports-events');
                sportsCarousel.empty();
                for(const sportEvent of response){
                    const eventDate = new Date(sportEvent.date_time);
                    sportsCarousel.append(
                        `<div class="item">
                            <div class="sports-grid" data-sport-event-id="${sportEvent.sport_id}">
                                <div class="movie-thumb c-thumb">
                                    <a href="sport-details.html">
                                        <img src="${sportEvent.sport_image}" alt="sports">
                                    </a>
                                    <div class="event-date">
                                        <h6 class="date-title">${eventDate.getDate()}</h6>
                                        <span>${eventDate.toLocaleString('en-US', {month: 'short'})}</span>
                                    </div>
                                </div>
                                <div class="movie-content bg-one">
                                    <h5 class="title m-0">
                                        <a href="sport-details.html">${sportEvent.title}</a>
                                    </h5>
                                    <div class="movie-rating-percent">
                                        <span>${sportEvent.ground_name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    );
                };
                buildSportsCarousel();
            },
            error: function(xhr) {
              //Do Something to handle error
            }
        });
    };
     getAllSports();

    $(".sports-events").on("click", ".sports-grid" , function() {
        localStorage.setItem('sportEventId', $(this).data('sportEventId'));
    });

    const buildSportsCarousel = () => {
        $('.sports-events').owlCarousel({
            loop:true,
            responsiveClass:true,
            nav:false,
            dots:false,
            margin: 30,
            autoplay:true,
            autoplayTimeout:2000,
            autoplayHoverPause:true,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:3
                },
                1000:{
                    items:4
                }
            }
        });
    }
});