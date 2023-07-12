"""
Title: demux_redux.py
Originally By: Dr. Zheng's Spring 2023 EE x96 
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
import keyboard as kb
import nidaqmx
from nidaqmx.constants import LineGrouping


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




with nidaqmx.Task() as ac_task, nidaqmx.Task() as sel_task, nidaqmx.Task() as en_task:

    def setParams(rte, spc, i):
        """Function for setting the parameters of the signal taken from user input.

        Args:
            rte (integer): rate
            spc (integer): spc
            i (integer): demultiplexer output number
        """
        
        # channel setup
        # analog channel for actuation (pin ao0)
        # Check to see if the channels have already been added to the task. 
        # If they have, do not try to assign it again
        if ac_task.channel_names == []: 
            print("assign analog channel")
            ac_channel = ac_task.ao_channels.add_ao_voltage_chan("Dev1/ao0")
            
        # digital channel for enable (pin p0.0)
        if en_task.channel_names == []:
            print("assign enable channel")
            en_channel = en_task.do_channels.add_do_chan(
                'Dev1/port0/line0',
                line_grouping=LineGrouping.CHAN_FOR_ALL_LINES)
            
        # digital channel for a 1:16 demux select (pin p0.1:4)
        # p0.1 wired to A0 of demux, p0.2 wired to A1 of demux, etc.
        if(sel_task.channel_names == []):
            print("assign selection channels")
            sel_channel = sel_task.do_channels.add_do_chan(
                'Dev1/port0/line1:4',
                line_grouping=LineGrouping.CHAN_FOR_ALL_LINES)
            
        # square wave parameter setting
        # frequency = rate/samples, duration = samps_per_chan/rate
        ac_task.timing.cfg_samp_clk_timing(rate = rte, samps_per_chan = spc)
        
        # enable the demux
        en_task.write(True)
        print("demux enabled")
        
        # adjust demux select input
        # need to subtract 1 from i because the demux selection goes from 0-15
        # instead of 1-16
        # need to multiply by 2 because the selection pins start with p0.1 and
        # not p0.0
        sel_task.write(2*(i-1))
        print("selecting output S", i)
        
        
        
    def on(s1, rte, spc):
        """Starts signal generation for DAQ. Output the actuation signal continuously until user stop. 

        Args:
            s1 (float array): numpy array of samples 
            rte (integer): rate
            spc (integer): samples per channel
        """
        
        # print the default duration
        maxDuration = spc/rte
        print("default duration (s):", maxDuration)
        turn_off = False
        time.sleep(1)
        print("signal generation start, press t to disable the demux")
        
        # output the signal continuously until told to turn off
        while (~turn_off):
            ac_task.write(s1, auto_start=True)
            # disable demux if user presses t
            # check to see if t is pressed until signal generation is done
            startTime = time.time()
            while (time.time() - startTime < maxDuration):
                #disable demux if user presses t
                if(kb.is_pressed("t") and turn_off == False):
                    en_task.write(False)
                    turn_off = True;
                    print("Demux disabled, press t to re-enable the demux or wait until signal generation is done to quit/change the signal")
                    #short delay needed to avoid constant switching
                    time.sleep(1)
                #re-enable to demux if user presses t again
                elif (kb.is_pressed("t") and turn_off == True):
                    en_task.write(True)
                    turn_off = False;
                    print("Demux enabled, press t again to disable the demux")
                    #short delay needed to avoid constant switching
                    time.sleep(1)
            ac_task.wait_until_done(100)
            ac_task.stop()
        #reset output voltage to 0 V
        ac_task.timing.cfg_samp_clk_timing(rate = 2, samps_per_chan = 2)
        ac_task.write([0, 0], auto_start=True)
        ac_task.wait_until_done(100)
        ac_task.stop()
        ac_task.timing.cfg_samp_clk_timing(rate = rte, samps_per_chan = spc)
        #enable demux
        en_task.write(True)
        print("signal generation done")
        
        
        
    def off():
        """Off function for DAQ. Resets everything to 0."""
        
        
        #turn off square wave signal
        print("reset start")
        ac_task.timing.cfg_samp_clk_timing(rate = 2, samps_per_chan = 2)
        ac_task.write([0, 0], auto_start=True)
        ac_task.wait_until_done(100)
        ac_task.stop()
        #turn off select and enable inputs
        en_task.write(False)
        sel_task.write(0)
        print("reset done")



    def UI():
        """Basic user prompt."""
        
        exit_flag = False
        while (~exit_flag):
            
            # Input Statement 
            # input_file = string(sys.argv[1])
            input_file = "dummy.json"
            [timestamp, pos_voltage, neg_voltage, frequency, duty_cycle, default_duration, dmux_output_num] = process_json(input_file)
            print(f"Reading JSON for '{timestamp}'..")
            
            # Defining Variables
            samples = 100
            rate = (frequency*samples)
            samps_per_chan = (default_duration*rate)
            
            # Create and fill sample array
            sArray = np.arange(100)
            sArray.fill(neg_voltage)
            sArray[0:duty_cycle] = pos_voltage
            
            # set up settings 
            setParams(rate, samps_per_chan, DemuxOutNum)
            
            # loop for running signal
            print("press t to turn on the signal (off by default), press q to quit or change signal parameters")
            while True:
                #press q to quit 
                if kb.read_key() == "q":
                    off()
                    break
                #press t to toggle signal
                elif kb.read_key() == "t":
                    on(sArray, rate, samps_per_chan)
                #else:
                    #off()
            
            # Option to continue or quit entirely
            option = input("Enter q to quit, c to continue with different signal parameters: ")
            
            while (~exit_flag):
                if(option == "q"):
                    exit_flag = True
                elif(option == "c"):
                    break
                else:
                    print("Inavlid Input, Try Again")
                    option = input("Enter q to quit, c to continue with different signal parameters: ")
                
    #main    
    UI()


    
    
