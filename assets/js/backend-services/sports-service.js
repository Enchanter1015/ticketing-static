$(document).ready(function(){
    var params = {
        page: 0, 
        dateFrom: '', 
        dateTo: '',
        sportTypeId: 0,
        limit: ''
    };
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

    const getAllSports = (searchParams) => {
        $.ajax({
            url: endpoint+"sports/getAllSports",
            type: "get",
            data: { 
                page: searchParams.page, 
                date_from: searchParams.dateFrom, 
                date_to: searchParams.dateTo,
                sport_type_id: searchParams.sportTypeId,
                limit: searchParams.limit
            },
            success: function(response) {
                var sportEventTilesParent = $('.sport-event-tiles');
                sportEventTilesParent.empty();
                for (const sportEvent of response) {
                    const eventDate = new Date(sportEvent.date_time);
                    var time = pad_digits(eventDate.getHours())+":"+pad_digits(eventDate.getMinutes());
                    sportEventTilesParent.append(
                        `<div class="col-sm-6 col-lg-4 sport-tile" data-sport-event-id="${sportEvent.sport_id}">
                            <div class="sports-grid">
                                <div class="movie-thumb c-thumb">
                                    <a href="sport-details.html">
                                        <img src="${sportEvent.image_url}" alt="sports">
                                    </a>
                                    <div class="event-date">
                                        <h6 class="date-title">${time}</h6>
                                        <span>${eventDate.getDate()} ${eventDate.toLocaleString('en-US', {month: 'short'})}</span>
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
                        </div>`
                    );
                }
            },
            error: function(xhr) {
              //Do Something to handle error
            }
        });
    };

    const renderPage = () => {
        var sortOption = $('.tile-sort-option').find(":selected").val() 
        var params = {
            page: 0, 
            dateFrom: '', 
            dateTo: '',
            sportTypeId: 0,
            limit: $('.tile-count-option').find(":selected").val()
        };
        getAllSports(params);
    }

    renderPage();

    $('.tile-count-option').on('change', function() {
        renderPage();
    });

    $('.tile-sort-option').on('change', function() {
        renderPage();
    });

    $(".check-area input:checkbox").change(function() {

        var val = [];
        $('.check-area input:checkbox:checked').each(function(i){
            val.push( this.id);
        });
        console.log(val);
        // var ischecked= $(this).is(':checked');
        // console.log( this.id);
        // if(ischecked){
        //     console.log('Checked ' + $(this).val());
        // }else{
        //     console.log('Unchecked ' + $(this).val());
        // }
        
    }); 
    
    $(".clear-check" ).click(function( event ) {
        event.preventDefault();
        $('.check-area input:checkbox:checked').each(function(i){
            this.checked = false;
        });
    });

    $(".sport-event-tiles").on("click", ".sport-tile" , function() {
        localStorage.setItem('sportEventId', $(this).data('sportEventId'));
        console.log( $(this).data('sportEventId'));
    });
});