$(document).ready(function(){

    $.get('/profil/get_user_tags', { username : $('#username').text()},(data, jqHXR) => {
        if (jqHXR === "success") {
            if (data) {
                data.forEach((elem) => {
                    $('#div_user_tags').append('<div class="user_tag">' + elem['tag_name'] + '<a id="del_tag_' + elem['tag_name'] + '" class="del_tag" href=\'#\'>x</a></div>')
                    click_del_tag($('#del_tag_' + elem['tag_name']))
                })
            }
        }
    })

    $.get('/profil/get_all_tags', {tag_search: ''}, (data, jqHXR) => {
        if (jqHXR === "success") {
            console.log(data)
            if (data) {
                data.forEach((elem) => {
                    $('#div_list_tags').append('<a class=\'link_select_tag\' href(\'#\')><div class="select_tag">' + elem + '</div></a>')
                })
            }
        }
        click_tags () // Becouse tags weren't on the page at the begining we have to set onclick now
    })
    
    function clear_returns(){
        $("#return_email").empty()                    
        $("#return_firstname").empty()
        $("#return_lastname").empty()
        $("#return_gender").empty()                    
        $("#return_desire").empty()
        $("#return_bio").empty()
        $("#return_tags").empty()
    }

    // When user is typing it checks the validity
    $("#profil_firstname").keyup(function(e){
        if ($("#profil_firstname").val() === ''){
            if ($('#profil_firstname').hasClass('border-success'))
                $('#profil_firstname').removeClass('border-success')
            $('#profil_firstname').addClass('border-danger')
        }
        else {
            if ($('#profil_firstname').hasClass('border-danger'))
                $('#profil_firstname').removeClass('border-danger')
            $('#profil_firstname').addClass('border-success')
        }
    })

    // When change submit is clicked it changes the firstname
    $("#submit_firstname").click(function(e) {
        e.preventDefault()
        clear_returns()

        $.post('/profil/change_firstname', $('#profil_firstname'), function(data, jqHXR) {  
            if (jqHXR === "success") {
                if (data[0] === false) {                        
                    $("#return_firstname").empty()
                    $("#return_lastname").empty()
                    document.getElementById("return_firstname").innerHTML = data[1]
                    document.getElementById("profil_firstname").value = ''
                }
                else {
                    $("#return_firstname").empty()
                    $("#return_lastname").empty()                    
                    document.getElementById("profil_firstname").value = ''                        
                    document.getElementById("label_firstname").innerHTML = data[1]
                }
            }
        })
    })


    // When user is typing it checks the validity
    $("#profil_lastname").keyup(function(e){
        if ($("#profil_lastname").val() === ''){
            if ($('#profil_lastname').hasClass('border-success'))
                $('#profil_lastname').removeClass('border-success')
            $('#profil_lastname').addClass('border-danger')
        }
        else {
            if ($('#profil_lastname').hasClass('border-danger'))
                $('#profil_lastname').removeClass('border-danger')
            $('#profil_lastname').addClass('border-success')
        }
    })

    // When change submit is clicked it changes the lastname
    $("#submit_lastname").click(function(e) {
        e.preventDefault()
        clear_returns()

        $.post('/profil/change_lastname', $('#profil_lastname'), function(data, jqHXR) {  
            if (jqHXR === "success") {
                if (data[0] === false) {             
                    document.getElementById("return_lastname").innerHTML = data[1]
                    document.getElementById("profil_lastname").value = ''
                }
                else {                                              
                    document.getElementById("profil_lastname").value = ''                        
                    document.getElementById("label_lastname").innerHTML = data[1]
                }
            }
        })
    })
    

    $("#profil_email").keyup(function(e){
        $.post('/profil/first_email', $('#profil_email'), function(data, jqHXR) {   
            if (jqHXR === "success") {
                if (data === true){
                    if ($('#profil_email').hasClass('border-success'))
                        $('#profil_email').removeClass('border-success')
                    $('#profil_email').addClass('border-danger')
                }
                else {
                    if ($('#profil_email').hasClass('border-danger'))
                        $('#profil_email').removeClass('border-danger')
                    $('#profil_email').addClass('border-success')

                }
            }
        })
    })

    // When change submit is clicked it changes the email
    $("#submit_email").click(function(e) {
        e.preventDefault()
        clear_returns()

        if (confirm('Are you sure this is a good email ?')) {
            $.post('/profil/change_email', $('#profil_email'), function(data, jqHXR) {  
                if (jqHXR === "success") {
                    if (data[0] === false) {
                        document.getElementById("return_email").innerHTML = data[1]
                        document.getElementById("profil_email").value = ''
                    }
                    else {                
                        // document.getElementById("return_firstname").innerHTML = ''
                        document.getElementById("profil_email").value = ''                        
                        document.getElementById("label_email").innerHTML = data[1]
                    }
                }
            })
        } else {
            $("#profile_email").empty()
        }

    })

    // When change submit is clicked it changes the gender
    $("#submit_gender").click(function(e) {
        e.preventDefault()
        clear_returns()

        if ($('#profil_gender').val() === 'B' || $('#profil_gender').val() === 'M' || $('#profil_gender').val() === 'F')
        {
            $.post('/profil/change_gender', $('#profil_gender'), function(data, jqHXR) {  
                if (jqHXR === "success") {
                    if (data[0] === false)
                        document.getElementById("return_gender").innerHTML = data[1]
                    else
                        document.getElementById("label_gender").innerHTML = data[1]
                }
            })
        }
    })

    // When change submit is clicked it changes the gender
    $("#submit_desire").click(function(e) {
        e.preventDefault()
        clear_returns()

        if ($('#profil_desire').val() === 'B' || $('#profil_desire').val() === 'M' || $('#profil_desire').val() === 'F')
        {
            $.post('/profil/change_desire', $('#profil_desire'), function(data, jqHXR) {  
                if (jqHXR === "success") {
                    if (data[0] === false)
                        document.getElementById("return_desire").innerHTML = data[1]
                    else                               
                        document.getElementById("label_desire").innerHTML = data[1]
                }
            })
        }
    })

    $("#submit_bio").click(function(e) {
        e.preventDefault()
        clear_returns()

        console.log($('#profil_bio').val().length)

        if ($('#profil_bio').val().length > 249)
            document.getElementById("return_bio").innerHTML = 'Too long'
        else if ($('#profil_bio').val().length <= 0)
            document.getElementById("return_bio").innerHTML = 'Empty field'
        else {
            $.post('/profil/change_bio', $('#profil_bio'), function(data, jqHXR) {  
                if (jqHXR === "success") {
                    if (data[0] === false)
                        document.getElementById("return_bio").innerHTML = data[1]
                    else                               
                        document.getElementById("label_bio").innerHTML = data[1]
                }
            })
        }
    })

    $(".del_tag").click(function(e) {
        console.log("test")
        // e.preventDefault()
        clear_returns()

        $.get('/profil/del_user_tags',(data, jqHXR) => {
            if (jqHXR === "success") {
                // data.forEach((elem) => {
                    // $('#div_user_tags?').append('<div class="user_tag">' + elem['tag_name'] + '<a id="del_tag" class="del_tag">x</div>')
                // })
            }
        })
    })

    $("#profil_tag").keyup(function(e){
        console.log($("#profil_tag").val())
        clear_returns()
        $('#div_list_tags').empty()
        
        if ($("#profil_tag").val().length < 15) {
            $.get('/profil/get_all_tags', {tag_search: $("#profil_tag").val()}, (data, jqHXR) => {
                if (jqHXR === "success") {
                    console.log(data)
                    if (data) {
                        var res = false
                        data.forEach((elem) => {
                            $('#div_list_tags').append('<a class=\'link_select_tag\' href(\'#\')><div class="select_tag">' + elem + '</div></a>')
                            if (elem === $("#profil_tag").val())
                                res = true
                        })
                        if (res === false && $("#profil_tag").val() !== '')
                            $('#div_list_tags').prepend('<a class=\'link_select_tag\' href(\'#\')><div class="select_tag">' + $("#profil_tag").val() + '</div></a>')
                        click_tags () // Becouse tags weren't on the page at the begining we have to set onclick now
        
                    }
                }
            })
        }
        else
            document.getElementById("return_tags").innerHTML = 'Tag too long' 
    })


    function click_tags() { 
        $("#div_list_tags").children().on('click', function(e){
            console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJs")
            
            console.log($(e.target).text())
            clear_returns()
            // $('#div_list_tags').empty()

            if ($(e.target).text().length < 15) {
                $.get('/profil/add_tag', {new_tag: $(e.target).text()}, (data, jqHXR) => {
                    if (jqHXR === "success") {
                        if (data[0] === false && data[1] === 'redirect_error')
                            window.location.replace("/error")
                        else if (data[0] === false)
                            document.getElementById("return_tags").innerHTML = data[1]
                        else if (data[0] === true) {
                            $('#div_user_tags').prepend('<div class="user_tag">' + data[1] + '<a id="del_tag_' + data[1] + '" class="del_tag" href=\'#\'>x</a></div>')
                            click_del_tag($('#del_tag_' + data[1]))
                        }
                    }
                })
            }
            else
                document.getElementById("return_tags").innerHTML = 'Tag too long' 
        })
    }

    function click_del_tag(elem) { 
        elem.click(function(e){
            e.preventDefault()    
            console.log($(e.target).parent().text().substring(0, $(e.target).parent().text().length - 1))
            clear_returns()
            // $('#div_list_tags').empty()

            if ($(e.target).parent().text().length < 16) {
                console.log('test')
                $.get('/profil/del_tag', {tag_name: $(e.target).parent().text().substring(0, $(e.target).parent().text().length - 1)}, (data, jqHXR) => {
                    if (jqHXR === "success") {
                        if (data[0] === false && data[1] === 'redirect_error')
                            window.location.replace("/error")
                        else if (data[0] === false)
                            document.getElementById("return_tags").innerHTML = data[1]
                        else if (data[0] === true) {
                            $(e.target).parent().remove()
                        }
                    }
                })
            }
            else
                document.getElementById("return_tags").innerHTML = 'Tag too long' 
        })
    }
})
