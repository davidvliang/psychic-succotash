import sys
import json
import time
from threading import Thread, Event
import pprint as pp

def pretty_print_array(arr, dim):
    int_arr = arr[0:dim*dim]
    int_arr = [int(x) for x in int_arr]
    arr_string = [f"{en} " if ((i+1) % dim) else f"{en}\n\t\t      " for i, en in enumerate(int_arr)]
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
    # print(data['configuration'])
    # for cell in data['configuration']:
    #     print(data['configuration'][cell]['state'])
    #     print(data['configuration'][cell]['negVoltage'])
    #     print(data['configuration'][cell]['posVoltage'])
    #     print(data['configuration'][cell]['dutyCycle'])
    #     print(data['configuration'][cell]['frequency'])
    # return data
    return (data['timestamp'],
            int(data['arrayDimension']),
            # int(data['bitness']),
            data['configuration'])
            # float(data['negVoltage']), 
            # float(data['posVoltage']), 
            # int(data['frequency']), 
            # int(data['dutyCycle']), 
            # int(data['defaultDuration']), 
            # list(data['dmuxOutputNum']))


def actuate_cells(p_dmux_output_nums, p_stop_button):
    output_delay = 0.25
    for i, en in enumerate(p_dmux_output_nums):
        if not p_stop_button.is_set() and en != "0":
            print(f"actuated cell [{en}] {i}", end="")
            time.sleep(output_delay)


if __name__ == "__main__":

    # print(sys.argv[1])
    # test_string = '{"dmuxOutputNum":[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],"negVoltage":"-10","posVoltage":"10","frequency":"50","dutyCycle":"50","defaultDuration":"10","timestamp":"08/01/2023, 11:15:05 AM"}'

    # Process JSON Input
    # [timestamp, pos_voltage, neg_voltage, frequency,
    #  duty_cycle, default_duration, dmux_output_num] = process_input_as_json(test_string)

    input_string = sys.argv[1]


    [timestamp, arr_size, configuration] = process_input_as_json(input_string)
    # [timestamp, neg_voltage, pos_voltage, frequency, 
    # duty_cycle, default_duration, arr_size, dmux_output_array] = process_input_as_json(input_string)

    ## Print Input to STDOUT 
    print(f"Reading JSON from '{timestamp}'\n", 
        # f"   Negative Voltage: {neg_voltage} V\n",
        # f"   Positive Voltage: {pos_voltage} V\n",
        # f"   Frequency:        {frequency} Hz\n",
        # f"   Duty Cycle:       {duty_cycle} %\n",
        # f"   Default Duration: {default_duration} s\n",
        f"   Array Size:       {arr_size}x{arr_size}\n",
        f"   Bitness:          1\n",
        f"   Configuration:    {pp.pprint(configuration)}",
        # f"   Configuration:    {pretty_print_array(dmux_output_array, arr_size)}", end=""
        )

    exit()
    ## Init event to stop program
    stop_button = Event()

    ## Toggle signal using threaded function
    thread = Thread(target=actuate_cells, args=(dmux_output_nums,stop_button))
    thread.start()
    stop_request = input()
    if stop_request:
        stop_button.set()
    thread.join()
    
    print("Program Aborted!!", end="")
    exit()
