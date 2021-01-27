import os
import time
os.system('dumb-init sockd &')
time.sleep(int(os.environ['PROXY_LIFETIME']));
exit(0)
