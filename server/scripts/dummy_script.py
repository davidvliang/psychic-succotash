import sys
import json

def pretty_print_array(arr, dim):
    int_arr = [1 if x else 0 for x in arr]
    arr_string = [f"{en} " if ((i+1)%dim) else f"{en}\n\t\t     " for i, en in enumerate(int_arr)]
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


if __name__ == "__main__":

    ## Process JSON Input
    [timestamp, pos_voltage, neg_voltage, frequency, 
     duty_cycle, default_duration, dmux_output_num] = process_input_as_json(sys.argv[1])

    print(f"Reading JSON from '{timestamp}'")
    print(f"   Negative Voltage: {neg_voltage} V")
    print(f"   Positive Voltage: {pos_voltage} V")
    print(f"   Frequency:        {frequency} Hz")
    print(f"   Duty Cycle:       {duty_cycle} %")
    print(f"   Default Duration: {default_duration} s")
    print(f"   Configuration:    {pretty_print_array(dmux_output_num,4)}")

    ## Test Stop Button
    if input("Waiting to end program: ") == "q":
        print("Program Aborted!!", end="")
        exit()
