$(document).ready(function() {
    var newContentButton = $('#newContentButton');
    var newContentModal = $('#newContentModal');

    initializeNewContentButton(newContentButton, newContentModal)
    initializeTooltips();
})

function initializeNewContentButton(newContentButton, newContentModal)
{
    newContentButton.on('click', function() {
        newContentModal.modal('show');
    })
}

function initializeTooltips()
{
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}

$('.deleteContent').on('click', function(event) 
{
    var contentId = $(this).data('contentid');
    var contentUrl = $(this).data('contenturl');

    deleteContent(contentId, contentUrl);
})

function deleteContent(contentId, contentUrl)
{
    $.ajax({
            url: '/content',
            type: 'delete',
            data: 
            {
                contentId,
                contentUrl
            },
            success: function() {
                location.reload();
            },
            error: function() {
                location.reload();
            }
        })
}