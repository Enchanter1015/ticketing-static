$(document).ready(function(){
    window.onbeforeunload = function(event)
    {
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("userId", userId);
        localStorage.setItem("sectionId", sectionId);
        localStorage.setItem("sportEventId", sportEventId);
        return;
    };
    var sessionId = localStorage.getItem('sessionId');
    var userId = localStorage.getItem('userId');
    var sectionId = localStorage.getItem('sectionId');
    var sportEventId = localStorage.getItem('sportEventId');

    const removeLsData = () => {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userId');
        localStorage.removeItem('sectionId');
        localStorage.removeItem('sportEventId');
    }

    const clearMainVariables = () => {
        sessionId = '';
        userId = '';
        sectionId = '';
        sportEventId ='';
    }

    removeLsData();
    
    var ticketPrice = 0;
    var ticketsCount = 0;
    var sectionName = '';


    const updateBookingSummary = () => {
        $('.tickets-price').text('LKR '+(ticketsCount*ticketPrice));
        $('.ticket-section-summary').html(`<span>${sectionName}</span><span>${ticketsCount}</span>`);
    }
    updateBookingSummary();


    const pad_digits = (n) =>{
        return (n < 10 ? '0' : '') + n;
    }

    const ticketBookingCountDown = (expiresDate) => {
        const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
          
        const countDown = new Date(expiresDate).getTime(),
        x = setInterval(function() {
            const now = new Date().getTime(),
                distance = countDown - now;
            if (Math.floor(distance/1000) < 60){
                $(".countdown-timer").css('color', 'red');
            }
            $(".countdown-timer").text(pad_digits(Math.floor((distance % (hour)) / (minute)))+":"+pad_digits(Math.floor((distance % (minute)) / second)));
            if (Math.floor(distance/1000) < 0) {
                clearInterval(x);
                $(".countdown-timer").text("00:00");
                deleteSession();
                removeLsData();
                redirectToSportsPage();
            }
        }, 1000);
    }

    const createNewSession = () => {
        $.ajax({
            url: endpoint+"session/createSession",
            type: "post",
            success: function(response) {
                sessionId = response[0].session_id;
                ticketBookingCountDown(response[0].expires_on);
            },
            error: function(xhr) {
                removeLsData();
                redirectToSportsPage();
            }
        });
        
    };

    const getSessionById = () => {
        $.ajax({
            url: endpoint+"session/getSessionById",
            type: "get",
            data: { 
                session_id: sessionId
            },
            success: function(response) {
                if(response.length>0){
                    sessionId = response[0].session_id;
                    ticketBookingCountDown(response[0].expires_on);
                    // console.log("sessionId => "+sessionId+"\nuserId=> "+userId+"\nsectionId => "+sectionId+"\nsportEventId => "+sportEventId);
                }else{
                    removeLsData();
                    redirectToSportsPage();
                }
            },
            error: function(xhr) {
                removeLsData();
                redirectToSportsPage();
            }
        });
    };
    

    if(sessionId){
        if(userId == 'null'){
            window.location.href = "sports-ticket.html";
        }
        getSessionById();
        $('.ticket-reservation').attr("hidden",false);
        $('.user-deails').attr("hidden",true); 
    }else{
        createNewSession();
    }
    
    const redirectToSportsPage = () => {
        window.location.href = "sports.html";
    }

    const deleteSession = () => {
        $.ajax({
            url: endpoint+"session/CleanSession?session_id="+sessionId,
            type: "DELETE",
            success: function(response) {
                removeLsData();
            },
            error: function(xhr) {
                removeLsData();  
            }
        });
    };

    const getSectionById = () => {
        $.ajax({
            url: endpoint+"section/getSectionById",
            type: "GET",
            data: { 
                ticket_section_id: sectionId
            },
            success: function(response) {
                $('.ticket-section').text(response[0].title);
                sectionName = response[0].title;
                $('.availableTicketCount').text(response[0].available_seat_count);
                $('.ticket-section-summary').html(`<span>${sectionName}</span><span>0</span>`);
                $('.ticket-title').html(`<sup>LKR</sup>${response[0].price}`);
                ticketPrice = response[0].price;
            },
            error: function(xhr) {
                removeLsData();
                redirectToSportsPage();
            }
        });
    };
    getSectionById();

    $(".checkout-user-data-form").submit(function(e) {
        e.preventDefault();

        var userName = $('#userName').val();
        var emailAddress = $('#emailAddress').val();
        var contactNumber = $('#contactNumber').val();

        if(userName.trim()==""||emailAddress.trim()==""||contactNumber.trim()==""){
            alert("Some fields are empty!!!");
        }else{
            $.ajax({
                url: endpoint+"user/createUser",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType   : "json",
                data: JSON.stringify(
                    {
                        name:userName,
                        email: emailAddress,
                        contact_no: contactNumber
                    }
                ),
                success: function(response) {
                    userId = response[0].user_id;
                    $('.ticket-reservation').attr("hidden",false);
                    $('.user-deails').attr("hidden",true);
                },
                error: function(xhr) {
                  alert("An error occured while submitting your data");
                }
            });
        }
    });

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
                $('.sport-subtitle').text(response[0].subtitle);
                $('.sport-venue').text(response[0].ground_name +", "+response[0].ground_location);
                $('.sport-event-date').text(days[eventDate.getDay()]+", "+monthShort+" "+eventDate.getDate()+" "+eventDate.getFullYear());
                $('.sport-venue-summary').text(monthShort+" "+eventDate.getDate()+" "+eventDate.getFullYear());
            },
            error: function(xhr) {
                alert("An error occured while reserving your ticket");
            }
        });
    };

    getSportById(sportEventId);

    const addRemoveTicket = (command) => {
        $.ajax({
            url: endpoint+"ticket/AddRemoveTicket",
            type: "POST",
            contentType: "application/json",
            dataType   : "json",
            data: 
                `{
                    "section_id": "${sectionId}",
                    "user_id": "${userId}",
                    "session_id": "${sessionId}",
                    "command": "${command}"
                }`,
            success: function(response) {
                ticketsCount = response[0].reserved_seat_count;
                $('.cart-plus-minus-box').val(response[0].reserved_seat_count);
                $('.availableTicketCount').text(response[0].available_seat_count);
                $('.ticket-section-summary').html(`<span>${sectionName}</span><span>${response[0].reserved_seat_count}</span>`);
                updateBookingSummary();
                if(response[0].error_status == 1){
                    alert(response[0].message);
                }
            },
            error: function(xhr) {
                alert("An error occured when reserving your ticket");
            }
        });
    };

    $('.cart-button').on('click', '.qtybutton', function(){
        var clasList = $(this).attr("class").split(/\s+/);
        if (clasList.indexOf("inc") > -1){
            addRemoveTicket("1");
        }else{
            addRemoveTicket("0");
        }
    });

    $('.book-tickets').click(function(e){
        e.preventDefault();
        $.ajax({
            url: endpoint+"ticket/ConfirmTicket",
            type: "get",
            data: { 
                session_id: sessionId
            },
            success: function(response) {
                localStorage.setItem('TS', JSON.stringify(response[0]));
                deleteSession();
                clearMainVariables();
                window.location.href = "print-ticket.html";
            },
            error: function(xhr) {
                deleteSession();
                clearMainVariables();
                redirectToSportsPage();
            }
        });
    });
    
});