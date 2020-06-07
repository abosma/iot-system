// Examples used from https://medium.com/building-ibotta/excelling-with-sinon-js-be35b974b75e

const sinon = require('sinon').createSandbox();
const assert = require('assert');
const database = require('../data/database_connector')
const content_handler = require('../business/content_handler')

describe('Testing database interaction with: Content', () => {

    before('Initializing database query reaction stub', () => {
        var queryStub = sinon.stub(database, 'query');

        queryStub.withArgs('SELECT * FROM content WHERE id = $1::integer', [1])
        .resolves(
            data = {
                rows: [{
                    id: 'stubbedId',
                    content_url: 'stubbedUrl',
                    content_type: 'stubbedType'
                }]
            }
        )

        queryStub.withArgs('SELECT * FROM content')
        .resolves(
            data = {
                rows: [{
                        id: 'stubbedId',
                        content_url: 'stubbedUrl',
                        content_type: 'stubbedType'
                    },
                    {
                        id: 'stubbedId2',
                        content_url: 'stubbedUrl2',
                        content_type: 'stubbedType2'
                    }
                ]
            },
        )

        queryStub.withArgs('SELECT * FROM content WHERE id = $1::integer', [2]).rejects();
    })

    describe('Testing content retrieval based on ID', () => {
        let returnedData;

        it('should return content data based on id', async () => {
            returnedData = await content_handler.getContentById(1);

            assert.notEqual(returnedData, null);
        })

        it('should get the right stubbed data as response', () => {
            assert.equal(returnedData.id, "stubbedId");
            assert.equal(returnedData.content_url, "stubbedUrl");
            assert.equal(returnedData.content_type, "stubbedType");
        })
    })

    describe('Testing multiple content retrieval', () => {
        let returnedDataArray;

        it('should return an array of content', async () => {
            returnedDataArray = await content_handler.getAllContent();

            assert.notEqual(returnedDataArray, null);
        })
    })

    describe('Testing content retrieval failure handling', () => {
        it('should throw an error when retrieving content by id', () => {
            assert.rejects(content_handler.getContentById(2));
        })
    })

    after(() => {
        sinon.restore();
    })
})