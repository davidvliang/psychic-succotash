"""
Title: actuation_v3.py
Originally By: Spring 2023 EE VIP Students 
Modified By: david947
Date Created: 2023-10-22
Description:
    Modify '2023_05_01_User_Input_Toggle_Demux.py' to take input from JSON instead of keyboard. 
    Intentionally did not perform major refactor of original script.
    Implement 'on()' in thread function. Trigger 'stop_button' event to stop program. 
    Compatible with any array dimension.

    "This is a program designed for use in the actuation control system of a 4x4 IRS
    design. The DAQ will be used for enabling the multiplexer, providing
    the output signal to the drain of the multiplexer, and for selecting which
    output the signal will be output to."
"""


import sys
import time
import numpy as np
import json
import time 
import nidaqmx
from nidaqmx.constants import LineGrouping
from threading import Thread, Event


def pretty_print_array(p_arr_size, p_configuration):
    for i in range(p_arr_size*p_arr_size):
        state = p_configuration[f"cell_{i}"]["state"]
        negVoltage = p_configuration[f"cell_{i}"]["negVoltage"]
        posVoltage = p_configuration[f"cell_{i}"]["posVoltage"]
        dutyCycle = p_configuration[f"cell_{i}"]["dutyCycle"]
        frequency = p_configuration[f"cell_{i}"]["frequency"]
        
        if (en := p_configuration[f"cell_{i}"]["state"]) != "0":
            print(f"actuated cell [{en}] {i}", end="")


def process_input_as_json(json_input):
    """this does that thing."""

    data = json.loads(json_input)
    return (data['timestamp'],
            int(data['arrayDimension']),
            int(data['bitness']),
            data['configuration'])


def actuate_cells(p_arr_size, p_configuration, p_stop_button):
    output_delay = 0.25
    for i in range(p_arr_size*p_arr_size):
        if not p_stop_button.is_set():
            if (en := p_configuration[f"cell_{i}"]["state"]) != "0":
                print(f"actuated cell [{en}] {i}", end="")
                time.sleep(output_delay)


with nidaqmx.Task() as ac_task, nidaqmx.Task() as sel_task, nidaqmx.Task() as en_task:

    def set_params(p_rate, p_samps_per_chan):
        """ Function for setting the parameters of a signal.
            Channel Setup
            Check to see if channels have already been added to the task.
            If so, do not try to assign it again.
        """

        ## Analog channel for actuation (pin ao0)
        if ac_task.channel_names == []:
            print("assign analog channel")
            ac_channel = ac_task.ao_channels.add_ao_voltage_chan("Dev1/ao0")

        ## Digital channels for enable (pinp0.0)
        if en_task.channel_names == []:
            print("assign enable channel")
            en_channel = en_task.do_channels.add_do_chan(
                "Dev1/port0/line0", 
                line_grouping=LineGrouping.CHAN_FOR_ALL_LINES)
            
        ## Digital channel for a 1:16 demux select (pin p0.1:4)
        if sel_task.channel_names == []:
            print("assign selection channels")
            sel_channel = sel_task.do_channels.add_do_chan(
                "Dev1/port0/line1:4",
                line_grouping=LineGrouping.CHAN_FOR_ALL_LINES)

        ## Square wave parameter setting
        ac_task.timing.cfg_samp_clk_timing(rate=p_rate, samps_per_chan=p_samps_per_chan)

        ## Enable demux
        en_task.write(True)
        print("Demux enabled")



    def on(p_sample_array, p_rate, p_samps_per_chan, p_dmux_output_nums, p_stop_button):
        """Starts signal generation for the DAQ"""

        ## Print default duration
        max_duration = p_samps_per_chan / p_rate
        print(f"Default duration (s): {max_duration}")

        ## Output signal continuously until told to turn off
        start_time = time.time()
        ac_task.write(data=p_sample_array, auto_start=True)
        en_task.write(True)

        print(f"Selecting Output S: {p_dmux_output_nums}")
        while (time.time() - start_time < max_duration):
            for num in p_dmux_output_nums:
                ## Adjust demux select input
                sel_task.write(2*num) # no need -1, should already be 0 to 15 
            if p_stop_button.is_set():
                print("THREAD STOPPING")
                off()


    def new_on(p_arr_size, p_configuration, p_stop_button):
        output_delay = 0.25
        default_duration = 500

        ## Output signal continuously until told to turn off
        start_time = time.time()

        while (time.time() - start_time < max_duration):

            for i in range(p_arr_size*p_arr_size):

                if (en := p_configuration[f"cell_{i}"]) != "0":
                    time.sleep(output_delay)
                    print(f"actuated cell [{en}] {i}", end="")

                    ## Get Signal Parameters for Cell "i"
                    neg_voltage = en["negVoltage"]
                    pos_voltage = en["posVoltage"]
                    duty_cycle = en["dutyCycle"]
                    frequency = en["frequency"]

                    ## Define timing
                    samples = 100 # so in terms of percentages
                    rate = frequency * samples
                    samps_per_chan = default_duration * rate

                    ## Create and fill sample array
                    sample_array = np.arange(samples)
                    sample_array.fill(neg_voltage)
                    sample_array[0:duty_cycle] = pos_voltage

                    ## Actuate Signal
                    ac_task.write(data=p_sample_array, auto_start=True)
                    en_task.write(True)
                    sel_task.write(2*num) # no need -1, should already be 0 to 15 


                if p_stop_button.is_set():
                    print("THREAD STOPPING")
                    off()


    def off():
        """Off function for the DAQ, resets everything to 0"""

        ## Turn off square wave signal
        print("Resetting..")
        ac_task.stop()

        ## Turn off select and enable inputs
        en_task.write(False)
        sel_task.write(0)
        print("Reset complete.")
        sys.exit()


    def user_interface():
        """Basic User Prompt"""

        ## Process JSON Input
        input_string = sys.argv[1]
        [timestamp, arr_size, bitness, configuration] = process_input_as_json(input_string)

        ## Print Input to STDOUT 
        print(f"Reading JSON from '{timestamp}'\n", 
            f"   Array Size:       {arr_size}x{arr_size}\n",
            f"   Bitness:          {bitness}\n",
            f"   Configuration:    {configuration}",
            )

        ## Print Out of Bounds warning.
        if arr_size > 4:
            print("WARNING: array size exceeds 4x4. Cell selection may be out of bounds.")

        ## Set up settings
        set_params(rate, samps_per_chan)

        ## Init event to stop program
        stop_button = Event()

        ## Toggle signal using threaded function
        thread = Thread(target=new_on, args=(arr_size, configuration, stop_button))
        thread.start()
        stop_request = input()
        if stop_request:
            stop_button.set()
        thread.join()

        ## Exit
        off()


    user_interface()
    off()
