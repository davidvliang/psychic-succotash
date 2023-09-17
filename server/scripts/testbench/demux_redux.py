"""
Title: demux_redux.py
Originally By: Spring 2023 EE VIP Students 
Modified By: david947
Date Created: 2023-07-11
Description:
    Modify '2023_05_01_User_Input_Toggle_Demux.py' to take input from JSON instead of keyboard. 
    Implement signal_handler() function to stop program

    "This is a program designed for use in the actuation control system of a 4x4 IRS
    design. The DAQ will be used for enabling the multiplexer, providing
    the output signal to the drain of the multiplexer, and for selecting which
    output the signal will be output to."
"""


import sys
import time
import numpy as np
import nidaqmx
from nidaqmx.constants import LineGrouping

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

class ControlSystem:
    # def __init__(self, c_rate: int, c_samps_per_chan: int, sample_array: object) -> None:
    def __init__(self) -> None:
        self.ac_task = nidaqmx.Task()
        self.sel_task = nidaqmx.Task()
        self.en_task = nidaqmx.Task()
    
    def set_params(p_rate, p_samps_per_chan, p_dmux_output_num):
        """ Function for setting the parameters of a signal.
            Channel Setup
            Check to see if channels have already been added to the task.
            If so, do not try to assign it again.
        """

    def on():
        pass 
    
    def off():
        pass 
    
    def user_interface():
        pass


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
    
    ## Define timing
    samples = 100 # so in terms of percentages
    rate = frequency * samples
    samps_per_chan = default_duration * rate

    ## Create and fill sample array
    sample_array = np.arange(samples)
    sample_array.fill(neg_voltage)
    sample_array[0:duty_cycle] = pos_voltage
    
    ## Init Control System
    AliasControlSystem = ControlSystem()
    
    ## Set up settings
    AliasControlSystem.set_params(rate, samps_per_chan, dmux_output_num)
    AliasControlSystem.user_interface()

