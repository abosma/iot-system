// Examples used from https://medium.com/building-ibotta/excelling-with-sinon-js-be35b974b75e

const sinon = require('sinon').createSandbox();
const assert = require('assert');
const database = require('../data/database_connector');
const user_handler = require('../business/user_handler');

describe('Testing database interaction with: Users', () => {

    before('Initializing database query reaction stub', () => {
        var queryStub = sinon.stub(database, 'query');

        queryStub.withArgs('SELECT * FROM users WHERE id = $1::integer', [1])
        .resolves(
            data = {
                rows: [{
                    id: 'stubbedId',
                    username: 'stubbedUsername',
                    password: 'stubbedPassword'
                }]
            }
        )

        queryStub.withArgs('SELECT * FROM users WHERE username = $1::varchar', ['TestUsername'])
        .resolves(
            data = {
                rows: [{
                    id: 'stubbedId',
                    username: 'TestUsername',
                    password: 'stubbedPassword'
                }]
            },
        )

        queryStub.withArgs('SELECT * FROM users WHERE id = $1::integer', [2]).rejects();
        
        queryStub.withArgs('SELECT * FROM users WHERE username = $1::varchar', ['UnknownUsername']).rejects();
    })

    describe('Testing user retrieval based on ID', () => {
        let returnedData;

        it('should return user data based on id', async () => {
            returnedData = await user_handler.getUserById(1);

            assert.notEqual(returnedData, null);
        })

        it('should get the right stubbed data as response', () => {
            assert.equal(returnedData.id, "stubbedId");
            assert.equal(returnedData.username, "stubbedUsername");
            assert.equal(returnedData.password, "stubbedPassword");
        })
    })

    describe('Testing user retrieval based on username', () => {
        let returnedData;

        it('should return user data based on username', async () => {
            returnedData = await user_handler.getUserByUsername('TestUsername');

            assert.notEqual(returnedData, null);
        })

        it('should get the right stubbed data as response', () => {
            assert.equal(returnedData.id, "stubbedId");
            assert.equal(returnedData.username, "TestUsername");
            assert.equal(returnedData.password, "stubbedPassword");
        })
    })

    describe('Testing user retrieval failure handling', () => {
        it('should throw an error when retrieving user by non-existant id', () => {
            assert.rejects(user_handler.getUserById(2));
        })

        it('should throw an error when retrieving user by non-existant username', () => {
            assert.rejects(user_handler.getUserByUsername('UnknownUsername'));
        })
    })

    after(() => {
        sinon.restore();
    })
})