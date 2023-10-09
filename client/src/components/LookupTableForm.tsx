import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { LookupTableType } from "../utils/LookupTableUtil.tsx";



const LookupTableForm = ({resetButton, handleConfigureData}:{resetButton:boolean, handleConfigureData: (data: object) => void}) => {

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<LookupTableType>();

    const onSubmit: SubmitHandler<LookupTableType> = (data) => {
        let form_data = data;
        handleConfigureData(form_data);
    }

    // Reset form values when reset button is pressed
    useEffect(() => {
        reset();
    }, [resetButton]);

    return (
        <form id="lookupTableForm" name="lookupTableForm" onSubmit={handleSubmit(onSubmit)}>


            
        </form>
    );

};

export default LookupTableForm;