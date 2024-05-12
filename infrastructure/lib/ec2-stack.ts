import { Stack, StackProps, aws_ec2 as ec2, aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as path from 'path';

export class EC2Stack extends Stack {
  public readonly ec2Instance: ec2.Instance;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'FileProcessingVPC', {
      maxAzs: 1,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(
      this,
      'FileProcessingSecurityGroup',
      {
        vpc,
        allowAllOutbound: true,
      },
    );

    const processFileScript = fs.readFileSync(
      path.join(__dirname, '..', 'scripts', 'process_file.sh'),
      'utf8',
    );

    const userData = ec2.UserData.forLinux();
    userData.addCommands(processFileScript);

    this.ec2Instance = new ec2.Instance(this, 'FileProcessingInstance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      securityGroup,
      userData,
      role: new iam.Role(this, 'FileProcessingInstanceRole', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'AmazonDynamoDBFullAccess',
          ),
        ],
      }),
    });
  }
}
