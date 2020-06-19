const bunyan = require('bunyan'),
PrettyStream = require('bunyan-prettystream');

let prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

var bunyanConfig = bunyan.createLogger({
  name: "apollo-api",
  streams: [{
    type: 'raw',
    stream: prettyStdOut,
    level: process.env.LOG_LEVEL || "debug"
  }],
  serializers: {
    req: bunyan.stdSerializers.req,
    res: (res) =>{
      return {
        statusCode: res.statusCode,
        header: res._header,
        responseTime: res.elapsedTime,
        body: res.body
      };
    },
    // res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err,
    responseTime: function(responseTime){
      return responseTime;
    }
  }
})

module.exports = bunyanConfig;