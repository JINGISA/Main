$(function(){
    $('#post-comment').hide();
    $('#btn-comment').on('click', function(event) {
        event.preventDefault();
        
        $('#post-comment').slideDown();
    });

    $('#btn-like').on('click', function(event) {
        console.log("like func insert..0")
        event.preventDefault();

        var imgId = $(this).data('id');
        console.log("like insert..");
        console.log(imgId); 
        $.post('/images/' + imgId + '/like').done(function(data) {
            $('.likes-count').text(data.likes);
        });
        console.log("like insert..2")
    });

    $('#btn-delete').on('click', function(event){
        event.preventDefault();
        var $this = $(this);

        var remove =  confirm("are you sure?");

        if(remove){
            var img_id = $(this).data('id');
            $.ajax({
                url : '/images/' + img_id,
                type : 'DELETE' 
            }).done(function(result){
                if(result){
                    $this.removeClass('btn-danger').addClass('btn-success');
                    $this.find('i').removeClass('fa-times').addClass('fa-check');
                    $this.append('<span> DELETED!! </span>');
                }
            })

        }
    })
});
