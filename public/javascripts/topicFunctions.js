$(document).ready(function() {
    var newTopicButton = $('#newTopicButton');
    var newTopicModal = $('#newTopicModal');

    initializeNewTopicButton(newTopicButton, newTopicModal);
    initializeTooltips();
})

function initializeNewTopicButton(topicButton, topicModal)
{
    topicButton.on('click', function() {
        topicModal.modal('show');
    })
}

function initializeTooltips()
{
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}

$('.topicItem').on('click', function(event)
{
    var topicId = $(this).data('topicid');
    var modalObject = $('#topicModal');

    if(!topicId)
    {
        return event.preventDefault();
    }

    initializeTopicModals(modalObject, topicId);
})

async function initializeTopicModals(modalObject, topicId)
{
    const topicData = await getTopicData(topicId);
    const { topicName, contentUrl } = topicData;

    modalObject.find('#topicName').text(topicName ? topicName : 'This topic has no name.');
    modalObject.find('#contentId').text(contentUrl ? contentUrl : 'This topic has no content connected to it.');

    modalObject.find('#updateTopic').on('click',
    {
        topic_data: topicData
    }, initializeTopicEditModal);

    modalObject.find('#deleteTopic').on('click', 
    {
        topic_id: topicId,
        topic_name: topicName
    }, deleteTopic);
    
    modalObject.modal('show');
}

function initializeTopicEditModal(event)
{
    const topicData = event.data.topic_data;
    const { topicId, topicName, contentId } = topicData;

    var topicModalObject = $('#topicModal');
    var topicEditModalObject = $('#topicEditModal');

    var topicNameInput = topicEditModalObject.find('#topicName');
    var contentIdInput = topicEditModalObject.find('#contentId');

    topicNameInput.val(topicName);
    contentIdInput.find('option[value="' + contentId + '"]').prop('selected', true);

    topicEditModalObject.find('#saveTopicUpdate').on('click', 
    {
        topic_id: topicId,
        topic_name_input: topicNameInput,
        content_id_input: contentIdInput
    }, updateTopic);

    topicEditModalObject.find('#cancelButton').on('click', function()
    {
        topicEditModalObject.modal('hide');
        topicModalObject.modal('show');
    })

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

async function getContentUrl(contentId)
{
    var content = $.ajax({
                            url: '/content/' + contentId,
                            type: 'get'
                        })
    
    return content.content_url;
}

function updateTopic(event)
{
    var topic_id = event.data.topic_id;
    var topic_name = event.data.topic_name_input.val();
    var content_id = event.data.content_id_input.val();

    $.ajax({
            url: '/topics',
            type: 'put',
            data: 
            {
                topicId: topic_id,
                topicName: topic_name,
                contentId: content_id
            },
            success: function() {
                location.reload();
            },
            error: function() {
                location.reload();
            }
        })
}

function deleteTopic(event)
{
    $.ajax({
            url: '/topics',
            type: 'delete',
            data: 
            {
                topicId: event.data.topic_id,
                topicName: event.data.topic_name
            },
            success: function() {
                location.reload();
            },
            error: function() {
                location.reload();
            }
        })
}