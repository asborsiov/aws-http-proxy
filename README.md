# aws-http-proxy
Chrome directory contains chrome proxy app.<br>
Docker folder contains Dante proxy, modified with script to automatically exit within timeout.<br>
Lambda directory contains lambda function with cloudformation template to create ECS Fargate cluster and launch task.<br>
# ToDo
- Create and update security group rules to restrict only caller IP address.<br>
- Create parameteters in API Gateway to adjust region and proxy duration.<br>
