import sys
import json
import pprint as pp
import numpy

def pretty_print_array(arr, dim):
    int_arr = [1 if x else 0 for x in arr]
    arr_string = ""
    for i, en in enumerate(int_arr):
        if (i+1)%dim:
            arr_string = arr_string+f"{en} "
        else:
            arr_string = arr_string+f"{en}\n\t\t     "
    return arr_string
    
def process_json(json_path):
    """_summary_

    Args:
        json_path (string): path to JSON file

    Returns:
        timestamp: Time the command was called on the web interface Used as identifier.
        pos_voltage: User-specified positive voltage (V). Between -10 and 10.
        neg_voltage: Negative voltage (V). Between -10 and 10.
        frequency: Frequency (Hz)
        duty_cycle: Duty cycle (whole %). Between 0 and 100.
        dmux_output_num: Python dict to configure cells 0 to 15  

    """

    with open(json_path, "r") as json_file:
        data = json.load(json_file)
        index = -1  # grab the most recent entry

        timestamp = data[index]['timestamp']
        pos_voltage = float(data[index]['posVoltage'])
        neg_voltage = float(data[index]['negVoltage'])
        frequency = int(data[index]['frequency'])
        duty_cycle = int(data[index]['dutyCycle'])
        default_duration = int(data[index]['defaultDuration'])
        dmux_output_num = dict(data[index]['dmuxOutputNum'])

    return timestamp, pos_voltage, neg_voltage, frequency, duty_cycle, default_duration, dmux_output_num

def process_input_as_json(json_input):
    """_summary_

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

    return data['timestamp'], float(data['negVoltage']), float(data['posVoltage']), int(data['frequency']), int(data['dutyCycle']), int(data['defaultDuration']), list(data['dmuxOutputNum'])


if __name__ == "__main__":
    
    
    [timestamp, pos_voltage, neg_voltage, frequency, 
     duty_cycle, default_duration, dmux_output_num] = process_input_as_json(sys.argv[1])
    
    # [timestamp, pos_voltage, neg_voltage, frequency, duty_cycle,
    #     dmux_output_num] = process_json("dummy.json")

    print(f"Reading JSON from '{timestamp}'")
    print(f"   Negative Voltage: {neg_voltage} V")
    print(f"   Positive Voltage: {pos_voltage} V")
    print(f"   Frequency:        {frequency} Hz")
    print(f"   Duty Cycle:       {duty_cycle} %")
    print(f"   Default Duration: {default_duration} s")
    print(f"   Configuration:    {pretty_print_array(dmux_output_num,4)}")

    while (1):
        print("Waiting for SIGINT: ")
        a = input()
        if a == 'q':
            print("Program Aborted!!", end="")
            exit()
