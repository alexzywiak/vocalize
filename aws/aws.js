var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

exports.createBucket = function(bucket) {
  var s3bucket = new AWS.S3({
    params: {
      Bucket: bucket
    }
  });

  s3bucket.createBucket()
  	.on('success', function(){
  		console.log('Bucket ' + bucket + ' successfully created.  Way to go!');
  	})
  	.on('error', function(err){
  		console.log('Error creating ' + bucket + '!', err);
  	});
};

exports.listBuckets = function() {
  var s3 = new AWS.S3();
  s3.listBuckets(function(err, data) {
    if (err) {
      console.log("Error:", err);
    } else {
      for (var index in data.Buckets) {
        var bucket = data.Buckets[index];
        console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
      }
    }
  });
};

exports.uploadFileToBucket = function(file, bucket, key) {
  file = path.join(__dirname, file);
  var body = fs.createReadStream(file).pipe(zlib.createGzip());
  var s3obj = new AWS.S3({
    params: {
      Bucket: bucket,
      Key: key
    }
  });
  s3obj.upload({
      Body: body
    })
    .on('httpUploadProgress', function(evt) {
      console.log(evt);
    })
    .send(function(err, data) {
      console.log(err, data)
    });
};

exports.downloadFileFromBucket = function(dlPath, bucket, key) {
  dlPath = path.join(__dirname, dlPath);
  var s3 = new AWS.S3();
  var params = {
    Bucket: bucket,
    Key: key
  };
  var file = fs.createWriteStream(dlPath);
  s3.getObject(params).createReadStream().pipe(file);
};

var flags = process.argv.slice(2);

switch (flags[0]) {
  case 'createBucket':
    exports.createBucket(flags[1]);
    break;

  case 'listBuckets':
    exports.listBuckets();
    break;

  case 'uploadFileToBucket':
    exports.uploadFileToBucket.apply(this, flags.slice(1));
    break;

  case 'downloadFileFromBucket':
    exports.downloadFileFromBucket.apply(this, flags.slice(1));
    break;
}
