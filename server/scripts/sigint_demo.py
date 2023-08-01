import signal
import os 
import time

# def handler(signum, frame):
#     signame = signal.Signals(signum).name
#     print(f"Signal Handler called with signal {signame} ({signum})")
#     exit()
#     # raise OSError("Couldn't open device or sumshit")

# signal.signal(signal.SIGINT, handler)
# # signal.alarm(5)
# a = True
# # time.sleep(10)
# while(a):
#     print("a",end=" ")
#     # time.sleep(1)
# a = False
# exit()

try: 
    while True:
        print("a" , end=" ", flush=True)
        time.sleep(1)
except KeyboardInterrupt:
    print("you pressed CTRL+C!!!")
finally:
    print("do all this finally stuff1")
    print("do all this finally stuff2")
    print("do all this finally stuff3")
    print("do all this finally stuff4")
    print("do all this finally stuff5")