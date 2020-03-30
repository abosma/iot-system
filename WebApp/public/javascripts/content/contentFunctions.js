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

    modalObject.find('#deleteContent').on('click', 
    {
        content_id: contentId
    }, deleteContent);
})

async function initializeContentModal(modalObject, contentId)
{
    var contentData = await getContentData(contentId);

    modalObject.find('#contentTitle').text(contentData.contentId);
    modalObject.find('#contentUrl').text(contentData.contentUrl);
    modalObject.find('#contentType').text(contentData.contentType);
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
                contentId: event.data.content_id
            }
        }
    ).done(function()
    {
        location.reload();
    })
}