import sys
import json
import time

output_delay = 0.7

def pretty_print_array(arr, dim):
    int_arr = [1 if x else 0 for x in arr]
    arr_string = [f"{en} " if ((i+1)%dim) else f"{en}\n\t\t      " for i, en in enumerate(int_arr)]
    return ''.join(arr_string)   

def process_input_as_json(json_input):
    """this does that thing.

    Args:
        json_input (string): Stringified JSON from web app.

    Returns:
        timestamp: Time the command was called on the web interface Used as identifier.
        neg_voltage: Negative voltage (V). Between -10 and 10.
        pos_voltage: User-specified positive voltage (V). Between -10 and 10.
        frequency: Frequency (Hz)
        duty_cycle: Duty cycle (whole %). Between 0 and 100.
        dmux_output_num: Python dict to configure cells 0 to 15  

    """

    data = json.loads(json_input)

    return (data['timestamp'],
            float(data['negVoltage']), 
            float(data['posVoltage']), 
            int(data['frequency']), 
            int(data['dutyCycle']), 
            int(data['defaultDuration']), 
            list(data['dmuxOutputNum']))

def actuate_cells(dmux_output_num):
    for i,en in enumerate(dmux_output_num):
        if en:
            time.sleep(output_delay)
            print(f"actuated cell {i}",end="")
    time.sleep(output_delay)

if __name__ == "__main__":

    ## Process JSON Input
    [timestamp, pos_voltage, neg_voltage, frequency, 
     duty_cycle, default_duration, dmux_output_num] = process_input_as_json(sys.argv[1])

    ## Print Input to STDOUT 
    print(f"Reading JSON from '{timestamp}'\n", 
          f"   Negative Voltage: {neg_voltage} V\n",
          f"   Positive Voltage: {pos_voltage} V\n",
          f"   Frequency:        {frequency} Hz\n",
          f"   Duty Cycle:       {duty_cycle} %\n",
          f"   Default Duration: {default_duration} s\n",
          f"   Configuration:    {pretty_print_array(dmux_output_num,4)}", end="")
    
    ## Simulate Cell Actuation
    actuate_cells(dmux_output_num)

    ## Test Stop Button
    if input("Waiting to end program.. ") == "q":
        print("Program Aborted!!", end="", flush=True)
        exit()
