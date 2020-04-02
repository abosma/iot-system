$('.topicItem').on('click', function(event)
{
    var topicId = $(this).data('topicid');
    var modalObject = $('#topicModal');

    if(!topicId)
    {
        return event.preventDefault();
    }

    initializeTopicModal(modalObject, topicId);

    modalObject.find('#updateTopic').on('click',
    {
        topic_id: topicId
    }, initializeTopicEditModal);
})

async function initializeTopicModal(modalObject, topicId)
{
    const topicData = await getTopicData(topicId);

    const { topicName, contentId } = topicData;

    modalObject.find('#topicName').text(topicName ? topicName : 'This topic has no name.');
    modalObject.find('#contentId').text(contentId ? contentId : 'This topic has no content connected to it.');

    modalObject.find('#deleteTopic').on('click', 
    {
        topic_id: topicId,
        topic_name: topicName
    }, deleteTopic);
    
    modalObject.modal('show');
}

function initializeTopicEditModal(event)
{
    var topicId = event.data.topic_id;

    var topicModalObject = $('#topicModal');
    var topicEditModalObject = $('#topicEditModal');

    var topicNameInput = topicEditModalObject.find('#topicName');
    var contentIdInput = topicEditModalObject.find('#contentId');

    topicEditModalObject.find('#saveTopicUpdate').on('click', 
    {
        topic_id: topicId,
        topic_name: topicNameInput.val(),
        content_id: contentIdInput.val()
    }, updateTopic);

    topicModalObject.modal('hide');
    topicEditModalObject.modal('show');
}

async function getTopicData(topicId)
{
    return $.ajax({
            url: '/topics/' + topicId,
            type: 'get'
        })
}

function updateTopic(event)
{
    $.ajax(
        {
            url: '/topics',
            type: 'put',
            data: 
            {
                topicId: event.data.topic_id,
                topicName: event.data.topic_name,
                contentId: event.data.content_id
            }
        }
    ).done(function()
    {
        location.reload();
    })
}

function deleteTopic(event)
{
    $.ajax(
        {
            url: '/topics',
            type: 'delete',
            data: 
            {
                topicId: event.data.topic_id,
                topicName: event.data.topic_name
            }
        }
    ).done(function()
    {
        location.reload();
    })
}