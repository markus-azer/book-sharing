const https = require('https');

module.exports = {
    CustomError: function (message, errorCode) {
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.message = message || 'The requested resource couldn\'t be found';
        this.errorCode = errorCode || 404;
    },
    notification: (config) => {
        var notificationsConfig = config && config.notifications;

        function sendSlackNotification(channelId, message) {
            try {

                return new Promise((resolve, reject) => {
                    try {
                        if (empty(notificationsConfig))
                            throw new Error('Config is Missing');

                        if (empty(notificationsConfig.slackHostName))
                            throw new Error('Config Slack Host Name is Missing');

                        if (empty(notificationsConfig.slackToken))
                            throw new Error('Config Slack Token is Missing');

                        if (empty(channelId) || empty(message))
                            throw new Error('channelId Or message is Missing');
                    } catch (error) {
                        reject(error)
                    }

                    const options = {
                        hostname: notificationsConfig.slackHostName,
                        port: 443,
                        path: "/api/chat.postMessage?token=" + notificationsConfig.slackToken + "&channel=" + channelId + "&username=elnotifier&text=" + encodeURI(message),
                        method: 'POST',
                    };


                    const req = https.request(options, (response) => {

                        // Continuously update stream with data
                        let body = '';
                        response.on('data', d => body += d);

                        // Data reception is done, do whatever with it!
                        response.on('end', () => resolve(body));

                    });

                    req.on('error', error => reject(error));
                    req.end();
                });

            } catch (error) {
                console.log(error.message);
            }
        }

        return {
            sendSlackNotification
        }
    }
}