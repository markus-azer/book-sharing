const ValidationError = require('mongoose').Error.ValidationError;
const {
    isDev
} = global.serverConfig;

const errorHandler = (payload, req, res, next) => {
        try {
console.log(payload);
            if (payload instanceof CustomError) {
                return res
                    .status(payload.errorCode)
                    .json([payload.message]);
            }

            if (payload instanceof ValidationError) {
                const errorArray = [];
                for (field in payload.errors) {
                    errorArray.push(payload.errors[field].message);
                }

                return res
                    .status(payload.errorCode || 400)
                    .json((!empty(errorArray) && errorArray) || payload.message);
            }

            if (payload instanceof Error) {

                if (isDev) {
                    console.log('DEVELOPMENT ERRORS');
                    console.log(payload);
                }

                SendNotifications.sendSlackNotification('CH8V68L9Y', `${'Error on Admin System \n' + '```'}${payload.stack}\`\`\``).catch(error => console.log(error.message));
      return res
        .status(500)
        .json('Internal Server Error');
    }

    next(payload);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json('Internal Server Error');
  }
};

const dataHandler = (payload, req, res, next) => res.status(200).json({
  statusCode: 200,
  message: payload.message ? payload.message : 'data successfully retrieved',
  data: payload && payload.data,
});

module.exports = {
  errorHandler,
  dataHandler
};