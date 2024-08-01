# perimeter-service

Server for perimiter code challenge

### Deploy output

Serverless Output
Service Information
service: perimeter-service
stage: dev
region: us-east-1
stack: perimeter-service-dev
resources: 14
api keys:
None
endpoints:
POST - https://eva4smr2zi.execute-api.us-east-1.amazonaws.com/dev/graphql
functions:
graphql: perimeter-service-dev-graphql
layers:
None

Stack Outputs
GraphqlLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:272926821434:function:perimeter-service-dev-graphql:1
ServiceEndpoint: https://eva4smr2zi.execute-api.us-east-1.amazonaws.com/dev
ServerlessDeploymentBucketName: perimeter-service-dev-serverlessdeploymentbucket-jlocs07u4ivh

### Authorizer

Right now this is just an open API. With more time, I would add a AWS IAM authorizer.

```
authorizer:
            type: AWS_IAM
```

The frontend would get something like this

```
const authLink = setContext((_, { headers }) => {
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  };

  const signedRequest = aws4.sign(
    {
      service: 'execute-api',
      region: process.env.AWS_REGION,
      method: 'POST',
      path: '/graphql',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    },
    credentials
  );

  return {
    headers: {
      ...headers,
      ...signedRequest.headers,
    },
  };
});
```
