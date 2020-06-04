$(document).ready(function() {
    initializeTooltips();
})


function initializeTooltips()
{
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}

$('.contentItem').on('click', function(event)
{
    var contentId = $(this).data('contentid');
    var modalObject = $('#contentModal');

    if(!contentId)
    {
        return event.preventDefault();
    }

    initializeContentModal(modalObject, contentId);

    modalObject.find('#updateContent').on('click',
    {
        content_id: contentId
    }, initializeContentEditModal);
})

async function initializeContentModal(modalObject, contentId)
{
    const contentData = await getContentData(contentId);

    const { contentUrl, contentType } = contentData;

    modalObject.find('#contentTitle').text(contentId);
    modalObject.find('#contentUrl').text(contentUrl ? contentUrl : 'This content has no URL.');
    modalObject.find('#contentType').text(contentType ? contentType : 'This content has no type.');
    
    modalObject.find('#deleteContent').on('click', 
    {
        content_id: contentId,
        content_url: contentUrl
    }, deleteContent);

    modalObject.modal('show');
}

function initializeContentEditModal(event)
{
    var contentId = event.data.content_id;

    var contentModalObject = $('#contentModal');
    var contentEditModalObject = $('#contentEditModal');

    var contentUrlInput = contentEditModalObject.find('#contentUrl');
    var contentTypeInput = contentEditModalObject.find('#contentType');

    contentEditModalObject.find('#saveContentUpdate').on('click', 
    {
        content_id: contentId,
        content_url: contentUrlInput.val(),
        content_type: contentTypeInput.val()
    }, updateContent);

    contentModalObject.modal('hide');
    contentEditModalObject.modal('show');
}

async function getContentData(contentId)
{
    return $.ajax({
            url: '/content/' + contentId,
            type: 'get'
        })
}

function updateContent(event)
{
    $.ajax(
        {
            url: '/content',
            type: 'put',
            data: 
            {
                contentId: event.data.content_id,
                contentUrl: event.data.content_url,
                contentType: event.data.content_type
            }
        }
    ).done(function()
    {
        location.reload();
    })
}

function deleteContent(event)
{
    $.ajax(
        {
            url: '/content',
            type: 'delete',
            data: 
            {
                contentId: event.data.content_id,
                contentUrl: event.data.content_url
            }
        }
    ).done(function()
    {
        location.reload();
    })
}