const redis = global.utils.redis;

const amqp = require('amqplib/callback_api');
const FCM = require('fcm-node');

/** 안드로이드 단말에서 추출한 token값 */
// 안드로이드 App이 적절한 구현절차를 통해서 생성해야 하는 값이다.
// 안드로이드 단말에서 Node server로 POST방식 전송 후,
// Node서버는 이 값을 DB에 보관하고 있으면 된다.
const client_token = 'e0gaUhEbtHA:APA91bFB4-I23a_DyOXAqFqu2lP4imLZByD0K3TqkIGAuFEoLdL0uTquyt82qX4yOISedparIx6zTQkdLMBscgT_lYyj-QBHLAMQdsqu-w0nyUTfhU9t2NO6ri3k2nndRRrXbooxgc-L';

const message = {  
    to: client_token,                           // 수신 대상 (token)
    priority: 'high',                           // 메시지 중요도
    restricted_package_name: 'com.konkuk.dna',  // 패키지 이름
    data: {                                     // 앱에게 전달할 데이터
        key: 'push Test',
    },
    notification: {                             // 상태 바에 보일 푸시 메시지 내용
      title: "Title",
      body: "body",
      sound: "default",
      click_action: "FCM_PLUGIN_ACTIVITY",
      icon: "fcm_push_icon"
    }
};

exports.init = () => {
  const fcm = new FCM(process.env.FCM_API_KEY);
  fcm.send(message, (err, response) => {
    if (err) {
      console.error('Push 메시지 발송 실패 : ' + err);
      return;
    }
    console.log('Push 메시지 발송 성공 : ' + response);
  });
  
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
