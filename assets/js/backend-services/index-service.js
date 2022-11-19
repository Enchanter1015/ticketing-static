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
                    console.log(sportEvent);
                    sportsCarousel.append(
                        `<div class="item">
                        <div class="sports-grid">
                            <div class="movie-thumb c-thumb">
                                <a href="sport-details.html">
                                    <img src="./assets/images/sports/sports01.jpg" alt="sports">
                                </a>
                                <div class="event-date">
                                    <h6 class="date-title">28</h6>
                                    <span>Dec</span>
                                </div>
                            </div>
                            <div class="movie-content bg-one">
                                <h5 class="title m-0">
                                    <a href="sport-details.html">football league tournament</a>
                                </h5>
                                <div class="movie-rating-percent">
                                    <span>327 Montague Street</span>
                                </div>
                            </div>
                        </div>
                    </div>
                        `
                    );
                }
            },
            error: function(xhr) {
              //Do Something to handle error
            }
        });
    };
    // getAllSports();
});