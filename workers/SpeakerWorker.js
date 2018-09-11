const io = global.utils.io;
const redis = global.utils.redis;

const amqp = require('amqplib/callback_api');
const geolib = require('geolib');
const geo = require('georedis').initialize(redis);

exports.init = () => {
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      const ex = 'push';

      ch.assertExchange(ex, 'direct', {durable: false});
        // direct 타입의 exchange에 연결된다.

      ch.assertQueue('', {exclusive: true}, function(err, q) {
        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        ch.bindQueue(q.queue, ex, "speaker");

        ch.consume(q.queue, function(msg) {
          if (msg && msg.content) {
            const parsedMsg = JSON.parse(msg.content.toString());
            console.log(parsedMsg);            
          }
        }, {noAck: true});
      });
    });
  });
};
