import os
import time
os.system('dumb-init sockd &')
time.sleep(os.environ['PROXY_LIFETIME']);
exit(0)
