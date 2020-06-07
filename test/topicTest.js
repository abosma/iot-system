// Examples used from https://medium.com/building-ibotta/excelling-with-sinon-js-be35b974b75e

const sinon = require('sinon').createSandbox();
const assert = require('assert');
const database = require('../data/database_connector')
const topic_handler = require('../business/topic_handler')

describe('Testing database interaction with: Topics', () => {

    before('Initializing database query reaction stub', () => {
        var queryStub = sinon.stub(database, 'query');

        queryStub.withArgs('SELECT * FROM topic WHERE id = $1::integer', [1])
        .resolves(
            data = {
                rows: [{
                    id: 'stubbedId',
                    content_id: 'stubbedContentId',
                    topic_name: 'stubbedTopicName'
                }]
            }
        )

        queryStub.withArgs('SELECT * FROM topic')
        .resolves(
            data = {
                rows: [{
                        id: 'stubbedId',
                        content_id: 'stubbedContentId',
                        topic_name: 'stubbedTopicName'
                    },
                    {
                        id: 'stubbedId2',
                        content_id: 'stubbedContentId2',
                        topic_name: 'stubbedTopicName2'
                    }
                ]
            },
        )

        queryStub.withArgs('SELECT * FROM topic WHERE id = $1::integer', [2]).rejects();
    })

    describe('Testing topic retrieval based on ID', () => {
        let returnedData;

        it('should return topic data based on id', async () => {
            returnedData = await topic_handler.getTopicById(1);

            assert.notEqual(returnedData, null);
        })

        it('should get the right stubbed data as response', () => {
            assert.equal(returnedData.id, "stubbedId");
            assert.equal(returnedData.content_id, "stubbedContentId");
            assert.equal(returnedData.topic_name, "stubbedTopicName");
        })
    })

    describe('Testing multiple topic retrieval', () => {
        let returnedDataArray;

        it('should return an array of topics', async () => {
            returnedDataArray = await topic_handler.getTopics();

            assert.notEqual(returnedDataArray, null);
        })
    })

    describe('Testing topic retrieval failure handling', () => {
        it('should throw an error when retrieving topic by id', () => {
            assert.rejects(topic_handler.getTopicById(2));
        })
    })

    after(() => {
        sinon.restore();
    })
})