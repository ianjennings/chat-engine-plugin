
const assert = require('chai').assert;
const append = require('./plugin.js');

const OpenChatFramework = require('../open-chat-framework/src/index.js'); 

const pub_append = 'pub' + new Date().getTime();
const sub_append = 'sub' + new Date().getTime();

let pluginchat;
let OCF;

describe('config', function() {

    it('should be configured', function() {

        OCF = OpenChatFramework.create({
            globalChannel: 'test-channel',
            rltm: {
                service: 'pubnub', 
                    config: {
                    publishKey: 'pub-c-07824b7a-6637-4e6d-91b4-7f0505d3de3f',
                    subscribeKey: 'sub-c-43b48ad6-d453-11e6-bd29-0619f8945a4f',
                    uuid: new Date(),
                    state: {}
                }
            }
        });

        assert.isOk(OCF);

    });

});

describe('connect', function() {

    it('should be identified as new user', function() {

        me = OCF.connect('robot-tester', {works: true});
        assert.isObject(me);

    });

});

describe('plugins', function() {

    it('should be created', function() {
        
        pluginchat = new OCF.Chat('pluginchat' + new Date().getTime());

        pluginchat.plugin(append({
            send: pub_append,
            broadcast: sub_append
        }));

    });

    it('publish and subscribe hooks should be called', function(done) {

        pluginchat.ready(() => {

            pluginchat.on('message', (payload) => {

                assert.isObject(payload);
                assert.isAbove(payload.data.text.indexOf(pub_append), 0, 'publish hook executed');
                assert.isAbove(payload.data.text.indexOf(sub_append), 0, 'subscribe hook executed');
                assert.isAbove(payload.data.text.indexOf(sub_append), payload.data.text.indexOf(pub_append), 'subscribe hook was called before publish hook');
                done();

            });

            pluginchat.send('message', {
                text: 'hello world'
            });

        });

    });

});
