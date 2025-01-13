import * as cdk from "aws-cdk-lib";
import { Duration, RemovalPolicy, Stack, aws_lambda_nodejs } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import { Construct } from "constructs";
import * as path from "path";

import { defaultBucketSettings } from "../helpers/S3Settings";
import StepFunctionApiIntegration from "../helpers/StepFunctionApiIntegration";
import { StepFunctionInvokeLambda } from "../helpers/StepFunctionInvokeLambda";

interface FileShareBackendProps {
  stackName: string;
  region: string;
}

export class FileShareBackend extends Construct {
  public api: apigateway.RestApi;
  public userPool: cognito.UserPool;
  public userPoolClient: cognito.UserPoolClient;
  public loggingBucket: s3.Bucket;
  public analyticsBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: FileShareBackendProps) {
    super(scope, id);

    /*-------------------------------
     * Set up S3 buckets
     -------------------------------*/

    // Create an S3 bucket to store S3 access logs
    this.loggingBucket = new s3.Bucket(this, "s3-logs", defaultBucketSettings);

    // Create S3 analytics bucket for running Athena queries
    this.analyticsBucket = new s3.Bucket(
      this,
      "s3-analytics",
      defaultBucketSettings,
    );

    // Create an S3 bucket to store the files to share/download
    const bucket = new s3.Bucket(this, "s3-files", {
      ...defaultBucketSettings,
      serverAccessLogsBucket: this.loggingBucket,
      serverAccessLogsPrefix: "file_access_logs/",
      cors: [
        {
          allowedOrigins: ["*"],
          allowedMethods: [s3.HttpMethods.PUT],
          allowedHeaders: ["*"],
        },
      ],
    });

    /*-------------------------------
     * Set up Dynamo DB tables
     -------------------------------*/

    // Create a DynamoDB table to store file meta data and permissions
    const fileTable = new dynamodb.Table(this, "files", {
      partitionKey: { name: "fileId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "recipientEmail", type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create global secondary index to query files by owner
    fileTable.addGlobalSecondaryIndex({
      indexName: "OwnerIndex",
      partitionKey: { name: "ownerId", type: dynamodb.AttributeType.STRING },
    });

    // Create global secondary index to query files by recipient
    fileTable.addGlobalSecondaryIndex({
      indexName: "RecipientIndex",
      partitionKey: {
        name: "recipientEmail",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Create a DynamoDB table to track download requests
    const downloadTable = new dynamodb.Table(this, "downloads", {
      partitionKey: { name: "fileId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "downloadId", type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const auditTable = new dynamodb.Table(this, 'auditShare', {
      partitionKey: { name: 'auditId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Add this to your existing DynamoDB tables section
    const roleTable = new dynamodb.Table(this, "RoleTable", {
      partitionKey: {
        name: "roleId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Add GSI for role name if needed
    roleTable.addGlobalSecondaryIndex({
      indexName: "roleName-index",
      partitionKey: {
        name: "roleName",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const userTable = new dynamodb.Table(this, "UserTable", {
      partitionKey: {
        name: "userId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for development
    });

    userTable.addGlobalSecondaryIndex({
      indexName: "username-index",
      partitionKey: {
        name: "username",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const userGroupTable = new dynamodb.Table(this, "UserGroupTable", {
      partitionKey: {
        name: "groupId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "userId", // This allows us to store group members
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    userGroupTable.addGlobalSecondaryIndex({
      indexName: "userId-index",
      partitionKey: {
        name: "userId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Create the Lambda function for post confirmation
    /*-------------------------------
     * Set up Cognito for authentication
     -------------------------------*/

    const postConfirmationFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      "postConfirmationFunction",
      {
        entry: `./src/functions/cognitoPostConfirmation.ts`,
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "handler",
        environment: {
          USER_TABLE_NAME: userTable.tableName,
          ROLE_TABLE_NAME: roleTable.tableName,
        },
      },
    );

    // Create a Cognito user pool
    this.userPool = new cognito.UserPool(this, "user-pool", {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      standardAttributes: { fullname: { required: true } },
      passwordPolicy: {
        minLength: 8,
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lambdaTriggers: {
        postConfirmation: postConfirmationFunction,
      },
    });

    // Create a Cognito user pool client
    this.userPoolClient = new cognito.UserPoolClient(this, "user-pool-client", {
      userPool: this.userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    // Cognito API Gateway authorizer
    const cognitoAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      "cognito-authorizer",
      {
        cognitoUserPools: [this.userPool],
      },
    );

    // Authorizer settings for each API end point
    const authorizerSettings = {
      authorizer: cognitoAuthorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizationScopes: ["aws.cognito.signin.user.admin"],
    };

    // IAM policy for Lambda functions to retrieve Cognito user info
    const cognitoIamPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["cognito-idp:AdminGetUser"],
      resources: [
        cdk.Arn.format(
          {
            service: "cognito-idp",
            resource: "userpool",
            resourceName: this.userPool.userPoolId,
          },
          cdk.Stack.of(this),
        ),
      ],
    });

    /*-------------------------------
     * Set up Lambda function settings
     -------------------------------*/
     
    // Create log group for API gateway
    const apiLogGroup = new logs.LogGroup(this, "api-access-logs", {
      retention: logs.RetentionDays.ONE_WEEK,
    });

    // Create an API Gateway to expose the Lambda function
    this.api = new apigateway.RestApi(this, "rest-api", {
      restApiName: props.stackName,
      description: "API for downloading files from S3",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowCredentials: true,
      },
      deployOptions: {
        stageName: "prod",
        accessLogDestination: new apigateway.LogGroupLogDestination(
          apiLogGroup,
        ),
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        tracingEnabled: true,
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL],
    });

    // Declare environment variables for Lambda functions
    const environment = {
      AWS_ACCOUNT_ID: Stack.of(this).account,
      POWERTOOLS_SERVICE_NAME: props.stackName,
      POWERTOOLS_METRICS_NAMESPACE: props.stackName,
      POWERTOOLS_LOGGER_LOG_LEVEL: "WARN",
      POWERTOOLS_LOGGER_SAMPLE_RATE: "0.01",
      POWERTOOLS_LOGGER_LOG_EVENT: "true",
      BUCKET_NAME: bucket.bucketName,
      FILE_TABLE: fileTable.tableName,
      DOWNLOAD_TABLE: downloadTable.tableName,
      USER_TABLE_NAME: userTable.tableName,
      USER_GROUP_TABLE_NAME: userGroupTable.tableName,
      AUDIT_SHARE_TABLE: auditTable.tableName,
      ROLE_TABLE_NAME: roleTable.tableName,
      COGNITO_USER_POOL_ID: this.userPool.userPoolId,
      REGION: props.region,
      PINPOINT_PROJECT_ID: "f3509ea4d0ba4b67a9a02cc53e8b9307",
      API_URL: `https://${this.api.restApiId}.execute-api.${props.region}.amazonaws.com/prod` // Set your API URL here
    };

    // Global Lambda settings for each function
    const functionSettings = {
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 256,
      environment,
      logRetention: logs.RetentionDays.THREE_MONTHS,
      logRetentionRetryOptions: {
        base: cdk.Duration.millis(200),
        maxRetries: 10,
      },
      tracing: lambda.Tracing.ACTIVE,
      bundling: {
        minify: true,
      },
      awsSdkConnectionReuse: true,
      timeout: Duration.seconds(600),
    };

    // Helper function create a lambda function
    const createLambdaFn = (name: string, path: string) => {
      return new aws_lambda_nodejs.NodejsFunction(this, name, {
        entry: `./src/functions/${path}`,
        ...functionSettings,
      });
    };

    /*-------------------------------
     * Lambda functions
     -------------------------------*/

    // Create Lambda functions

    // Grant DynamoDB permissions to the Lambda
    userTable.grantWriteData(postConfirmationFunction);

    const getOwnedFilesFn = createLambdaFn("getOwnedFiles", "getOwnedFiles.ts");
    const getSharedFilesFn = createLambdaFn(
      "getSharedFiles",
      "getSharedFiles.ts",
    );
    const deleteRecipientsFn = createLambdaFn(
      "deleteRecipients",
      "deleteRecipients.ts",
    );
    const deleteFileFn = createLambdaFn("deleteFile", "deleteFile.ts");
    const uploadFileFn = createLambdaFn("uploadFile", "uploadFile.ts");
    const getUserInfoFn = createLambdaFn("getUserInfo", "getUserInfo.ts");
    const getUserByIdFn = createLambdaFn("getUserById", "getUserById.ts");
    const validateDownloadRequestFn = createLambdaFn(
      "validateDownloadRequest",
      "download/validateDownloadRequest.ts",
    );
    const authorizeDownloadRequestFn = createLambdaFn(
      "authorizeDownloadRequest",
      "download/authorizeDownloadRequest.ts",
    );
    const auditDownloadRequestFn = createLambdaFn(
      "auditDownloadRequest",
      "download/auditDownloadRequest.ts",
    );
    const processDownloadRequestFn = createLambdaFn(
      "processDownloadRequest",
      "download/processDownloadRequest.ts",
    );
    const validateShareRequestFn = createLambdaFn(
      "validateShareRequest",
      "share/validateShareRequest.ts",
    );
    const authorizeShareRequestFn = createLambdaFn(
      "authorizeShareRequest",
      "share/authorizeShareRequest.ts",
    );
    const auditShareRequestFn = createLambdaFn(
      "auditShareRequest",
      "share/auditShareRequest.ts",
    );
    const processShareRequestFn = createLambdaFn(
      "processShareRequest",
      "share/processShareRequest.ts",
    );
    const sendNotificationsFn = createLambdaFn(
      "sendNotifications",
      "share/sendNotifications.ts",
    );

    const getAuditLogsFn = createLambdaFn("getAuditLogs", "download/getAuditLogs.ts");
    userTable.grantReadData(getAuditLogsFn);
    fileTable.grantReadData(getAuditLogsFn);
    downloadTable.grantReadData(getAuditLogsFn);
    // Create Lambda functions
    const createRoleFn = createLambdaFn("createRole", "roles/createRole.ts");
    const listRolesFn = createLambdaFn("listRoles", "roles/listRoles.ts");
    const updateRoleFn = createLambdaFn("updateRole", "roles/updateRole.ts");

    const listUsersFn = createLambdaFn("listUsers", "listUsers.ts");

    const updateUserFn = createLambdaFn("updateUser", "updateUser.ts");
    userTable.grantReadWriteData(updateUserFn);
    userTable.grantReadData(getUserByIdFn);
    roleTable.grantReadData(getUserByIdFn);

    updateUserFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
        resources: [userTable.tableArn, roleTable.tableArn],
      }),
    );
    // Create Lambda functions for group management
    const createGroupFn = createLambdaFn(
      "createGroup",
      "groups/createGroup.ts",
    );
    const getGroupFn = createLambdaFn("getGroup", "groups/getGroup.ts");
    const listGroupsFn = createLambdaFn("listGroups", "groups/listGroups.ts");
    const updateGroupFn = createLambdaFn(
      "updateGroup",
      "groups/updateGroup.ts",
    );
    const deleteGroupFn = createLambdaFn(
      "deleteGroup",
      "groups/deleteGroup.ts",
    );
    const addFileToGroupFn = createLambdaFn(
      "addFileToGroup",
      "groups/addFileToGroup.ts",
    );

    userGroupTable.grantWriteData(createGroupFn); // This grants PutItem, UpdateItem, DeleteItem
    // Add explicit policy for BatchWriteItem
    createGroupFn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["dynamodb:BatchWriteItem"],
        resources: [userGroupTable.tableArn],
      }),
    );
    userGroupTable.grantReadData(getGroupFn);
    userGroupTable.grantReadData(listGroupsFn);
    userGroupTable.grantReadWriteData(updateGroupFn);
    userGroupTable.grantReadWriteData(deleteGroupFn);
    userGroupTable.grantReadWriteData(addFileToGroupFn);

    roleTable.grantWriteData(createRoleFn);
    roleTable.grantReadData(listRolesFn);
    roleTable.grantReadWriteData(updateRoleFn);
    roleTable.grantReadWriteData(postConfirmationFunction);
    // If the function needs to read from the users table
    userTable.grantReadData(createGroupFn);
    // Add permissions to read data from database
    fileTable.grantReadData(getOwnedFilesFn);
    fileTable.grantReadData(getSharedFilesFn);
    fileTable.grantReadData(deleteRecipientsFn);
    fileTable.grantReadData(deleteFileFn);
    fileTable.grantReadData(authorizeDownloadRequestFn);
    fileTable.grantReadData(processShareRequestFn);
    downloadTable.grantReadData(authorizeDownloadRequestFn);
    userTable.grantReadData(listUsersFn);

    listUsersFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Scan", "dynamodb:GetItem"],
        resources: [userTable.tableArn, roleTable.tableArn],
      }),
    );

    auditShareRequestFn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:PutItem'],
      resources: [auditTable.tableArn],
    }));

    
    // sendNotificationsFn.addToRolePolicy(new iam.PolicyStatement({
    //   actions: ['pinpoint:SendMessages'],
    //   resources: [`arn:aws:pinpoint:${environment.REGION}:${environment.AWS_ACCOUNT_ID}:apps/${environment.PINPOINT_PROJECT_ID}`],
    // }));

    sendNotificationsFn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['mobiletargeting:SendMessages','ses:SendEmail',
        'ses:SendRawEmail'],
      resources: [`arn:aws:mobiletargeting:${props.region}:${Stack.of(this).account}:apps/${environment.PINPOINT_PROJECT_ID}/messages`,
        `arn:aws:ses:${props.region}:${Stack.of(this).account}:identity/*`
      ],
    }));

    // Add permissions to write data to database
    fileTable.grantWriteData(deleteRecipientsFn);
    fileTable.grantWriteData(deleteFileFn);
    fileTable.grantWriteData(processShareRequestFn);
    downloadTable.grantWriteData(auditDownloadRequestFn);
    userTable.grantWriteData(listUsersFn);

    // Add permissions fetch user info from cognito
    getSharedFilesFn.addToRolePolicy(cognitoIamPolicy);
    getUserInfoFn.addToRolePolicy(cognitoIamPolicy);

    // Add permissions to fetch meta data from S3 file bucket
    bucket.grantRead(processDownloadRequestFn);
    bucket.grantRead(authorizeShareRequestFn);

    // Add permissions to read/write from S3 file bucket
    bucket.grantReadWrite(uploadFileFn);
    bucket.grantReadWrite(deleteFileFn);

    /*-------------------------------
     * Set up API gateway
     -------------------------------*/


    
    /*-------------------------------
     * Set up API Gateway routes
     -------------------------------*/

    // Declare API route: /owned-files
    const ownedFiles = this.api.root.addResource("owned-files");

    // Declare API route: /owned-files/{fileId}
    const ownedFilesFile = ownedFiles.addResource("{fileId}");

    // Declare API route: /owned-files/{fileId}/recipients
    const ownedFilesRecipients = ownedFilesFile.addResource("recipients");

    // GET /owned-files
    ownedFiles.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getOwnedFilesFn),
      authorizerSettings,
    );

    // DELETE /owned-files/{fileId}
    ownedFilesFile.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(deleteFileFn),
      authorizerSettings,
    );

    // DELETE /owned-files/{fileId}/recipients
    ownedFilesRecipients.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(deleteRecipientsFn),
      authorizerSettings,
    );

    // Add API routes
    const groups = this.api.root.addResource("groups");
    const groupId = groups.addResource("{groupId}");
    const groupFiles = groupId.addResource("files");

    groups.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createGroupFn),
      authorizerSettings,
    );
    groups.addMethod(
      "GET",
      new apigateway.LambdaIntegration(listGroupsFn),
      authorizerSettings,
    );
    groupId.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getGroupFn),
      authorizerSettings,
    );
    groupId.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(updateGroupFn),
      authorizerSettings,
    );
    groupId.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(deleteGroupFn),
      authorizerSettings,
    );
    groupFiles.addMethod(
      "POST",
      new apigateway.LambdaIntegration(addFileToGroupFn),
      authorizerSettings,
    );

    const roles = this.api.root.addResource("roles");
    const role = roles.addResource("{roleId}");

    // POST /roles
    roles.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createRoleFn),
      authorizerSettings,
    );

    // GET /roles
    roles.addMethod(
      "GET",
      new apigateway.LambdaIntegration(listRolesFn),
      authorizerSettings,
    );

    // PUT /roles/{roleId}
    role.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(updateRoleFn),
      authorizerSettings,
    );

    const users = this.api.root.addResource("users");
    const user = users.addResource("{userId}");
    // GET /users
    users.addMethod("GET", new apigateway.LambdaIntegration(listUsersFn));

    user.addMethod("GET", new apigateway.LambdaIntegration(getUserByIdFn));

    user.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(updateUserFn),
      authorizerSettings,
    );
    // GET /shared-files
    this.api.root
      .addResource("shared-files")
      .addMethod(
        "GET",
        new apigateway.LambdaIntegration(getSharedFilesFn),
        authorizerSettings,
      );

      // GET /audit-logs
    this.api.root
    .addResource("audit-logs")
    .addMethod(
      "GET",
      new apigateway.LambdaIntegration(getAuditLogsFn),
      authorizerSettings,
    );

    // GET /upload/{filepath+}
    this.api.root
      .addResource("upload")
      .addResource("{filepath+}")
      .addMethod(
        "GET",
        new apigateway.LambdaIntegration(uploadFileFn),
        authorizerSettings,
      );

    /*-------------------------------
     * Step functions
     -------------------------------*/

    // define fail states
    const downloadErrorStep = new sfn.Fail(this, "Download Error", {
      error: "Download step function failed",
    });

    const shareErrorStep = new sfn.Fail(this, "Share Error", {
      error: "Share step function failed",
    });

    // define 'Download' state machine
    const downloadStepFunction = new sfn.StateMachine(
      this,
      "download-step-function",
      {
        stateMachineType: sfn.StateMachineType.EXPRESS,
        tracingEnabled: true,
        definitionBody: sfn.DefinitionBody.fromChainable(
          sfn.Chain.start(
            StepFunctionInvokeLambda(
              this,
              validateDownloadRequestFn,
              "Validate download request",
              downloadErrorStep,
            )
              .next(
                StepFunctionInvokeLambda(
                  this,
                  getUserInfoFn,
                  "Get user info for download request",
                  downloadErrorStep,
                ),
              )
              .next(
                StepFunctionInvokeLambda(
                  this,
                  authorizeDownloadRequestFn,
                  "Authorize download request",
                  downloadErrorStep,
                ),
              )
              .next(
                StepFunctionInvokeLambda(
                  this,
                  auditDownloadRequestFn,
                  "Audit download request",
                  downloadErrorStep,
                ),
              )
              .next(
                StepFunctionInvokeLambda(
                  this,
                  processDownloadRequestFn,
                  "Process download request",
                  downloadErrorStep,
                ),
              ),
          ),
        ),
      },
    );

    // add 'Download' state machine to API
    this.api.root
      .addResource("download")
      .addResource("{fileId}")
      .addMethod(
        "GET",
        StepFunctionApiIntegration(downloadStepFunction, [
          { name: "fileId", sourceType: "params" },
        ]),
        authorizerSettings,
      );

          // add 'Download' state machine to API
    this.api.root
    .addResource("download-location")
    .addResource("{fileId}")
    .addMethod(
      "GET",
      StepFunctionApiIntegration(downloadStepFunction, [
        { name: "fileId", sourceType: "params" },
        { name: "latitude", sourceType: "query" },
        { name: "longitude", sourceType: "query" },
        { name: "ipAddress", sourceType: "query" },
      ]),
     {
      ...authorizerSettings,
      requestParameters: {
        'method.request.querystring.latitude': false,  // false means optional
        'method.request.querystring.longitude': false,
        'method.request.querystring.ipAddress': false
      }
    }
      
    );

    const validateShareErrorStep = new sfn.Fail(this, "Validate Share Error", {
      error: "Validate Share step function failed",
    });

    const getUserInfoShareErrorStep = new sfn.Fail(
      this,
      "Get User Info Share Error",
      {
        error: "Get User Info Share step function failed",
      },
    );

    const authorizeShareErrorStep = new sfn.Fail(
      this,
      "Authorize Share Error",
      {
        error: "Authorize Share step function failed",
      },
    );

    const auditShareErrorStep = new sfn.Fail(this, "Audit Share Error", {
      error: "Audit Share step function failed",
    });

    const processShareErrorStep = new sfn.Fail(this, "Process Share Error", {
      error: "Process Share step function failed",
    });

    const sendNotificationsErrorStep = new sfn.Fail(
      this,
      "Send Notifications Error",
      {
        error: "Send Notifications step function failed",
      },
    );

    // define 'Share' state machine
    const shareStepFunction = new sfn.StateMachine(
      this,
      "share-step-function",
      {
        stateMachineType: sfn.StateMachineType.EXPRESS,
        tracingEnabled: true,
        definitionBody: sfn.DefinitionBody.fromChainable(
          sfn.Chain.start(
            StepFunctionInvokeLambda(
              this,
              validateShareRequestFn,
              "Validate share request",
              validateShareErrorStep,
            )
              .next(
                StepFunctionInvokeLambda(
                  this,
                  getUserInfoFn,
                  "Get user info for share request",
                  getUserInfoShareErrorStep,
                ),
              )
              .next(
                StepFunctionInvokeLambda(
                  this,
                  authorizeShareRequestFn,
                  "Authorize share request",
                  authorizeShareErrorStep,
                ),
              )
              .next(
                StepFunctionInvokeLambda(
                  this,
                  auditShareRequestFn,
                  "Audit share request",
                  auditShareErrorStep,
                ),
              )
              .next(
                StepFunctionInvokeLambda(
                  this,
                  processShareRequestFn,
                  "Process share request",
                  processShareErrorStep,
                ),
              )
              .next(
                StepFunctionInvokeLambda(
                  this,
                  sendNotificationsFn,
                  "Send notifications",
                  sendNotificationsErrorStep,
                ),
              ),
          ),
        ),
      },
    );

    // add 'Share' state machine to API
    this.api.root
      .addResource("share")
      .addResource("{fileId}")
      .addMethod(
        "POST",
        StepFunctionApiIntegration(shareStepFunction, [
          { name: "fileId", sourceType: "params" },
          { name: "recipients", sourceType: "body" },
          { name: "expiryDate", sourceType: "body" },
          { name: "downloadLimit", sourceType: "body" },
        ]),
        authorizerSettings,
      );

    /*-------------------------------
     * Add Cognito Post Confirmation Lambda Trigger
     -------------------------------*/
    // Add this to your construct class
  }
}
