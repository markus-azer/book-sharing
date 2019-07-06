module.exports = (config) => {
    return {
      User: require('./users'),
      Space: require('./spaces'),
      Book: require('./books')
    };
  };