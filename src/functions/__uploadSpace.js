import AWS from 'aws-sdk';
const spacesEndpoint = new AWS.Endpoint('');

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: '',
  secretAccessKey: ''
});

async function __uploadSpace(path, file) {
  return new Promise(resolve => {
      try {
          var params = {
              Bucket: 'omb',
              Key: path,
              Body: file,
              ACL: "public-read"
          };

          s3.putObject(params, function (err, data) {
              if (err) console.log(err, err.stack);
              else console.log(data);
          });
      } catch (error) {
          console.log(error)
      }
  })
}
export default __uploadSpace;
