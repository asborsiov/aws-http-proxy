import boto3
import json
import time

region = 'us-east-1'

def lambda_handler(event,context):
  ensure_cluster_definition()
  vpc_id, subnets = get_vpc_subnets()
  fargate_task_arn = run_fargate_task(subnets[0]);
  time.sleep(15)
  public_ip = get_public_ip(fargate_task_arn)
  return(public_ip)
  
def run_fargate_task(subnet):
  client = boto3.client('ecs', region_name=region)
  
  activeTaskDefinition = client.list_task_definitions(
    familyPrefix='Dante',
    status='ACTIVE'
  )["taskDefinitionArns"][0]
  
  activeTaskDefinition = activeTaskDefinition.split('/')[1]
  
  fargate_task = client.run_task(
  cluster='Proxy', # name of the cluster
  launchType = 'FARGATE',
  taskDefinition=activeTaskDefinition, # replace with your task definition name and revision
  count = 1,
  platformVersion='LATEST',
  networkConfiguration={
        'awsvpcConfiguration': {
            'subnets': [subnet],
            'assignPublicIp': 'ENABLED'
        }
    },
  overrides = {
    'containerOverrides': [
     {
     'name': "Dante",
     'environment': [{'name': "PROXY_LIFETIME", "value": "30"}]
      }
      ]
  })
  
  return str(fargate_task["tasks"][0]["taskArn"])
  
def get_public_ip(fargate_task_arn):
  client = boto3.client('ecs', region_name=region)
  task = client.describe_tasks(
    cluster='Proxy',
    tasks=[
        fargate_task_arn
    ])
  eni = boto3.resource('ec2', region_name=region).NetworkInterface(task['tasks'][0]['attachments'][0]['details'][1]['value'])
  return (eni.association_attribute['PublicIp'])


def get_vpc_subnets():
  client = boto3.client('ec2', region_name=region)
  response = client.describe_vpcs()
  vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')
  
  resource = boto3.resource('ec2', region_name=region)
  vpc = resource.Vpc(vpc_id)
  subnets_superset = vpc.subnets.all()
  subnets = []
  for subnet in subnets_superset:
      subnets.append(subnet.id)
  return(vpc_id, subnets)
  
def ensure_cluster_definition():
  stack_name = 'dante-CF'
  client = boto3.client('cloudformation', region_name=region)
  stacks = client.list_stacks()['StackSummaries']
  for stack in stacks:
    if stack['StackStatus'] == 'DELETE_COMPLETE':
      continue
    if stack_name == stack['StackName']:
      return True
  with open('template.yaml', 'r') as content_file:
    content = content_file.read()
  response = client.create_stack(
    StackName=stack_name,
    TemplateBody=content,
    Capabilities = ['CAPABILITY_IAM'] 
  )
  time.sleep(60)
  return(response)
