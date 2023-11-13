"use client"

import React, { useRef } from "react";
import SubmitButton from "@/app/_components/basic/button_submit";
import { type TInputType, type TRowData, type State, type StatePromise, type TFormMode } from "@/app/_libs/types";
import { toast } from "react-hot-toast";
import { getString } from "@/app/_libs/toString_handler";
import Link from "next/link";

type FormWithoutStateProps = {
    formTitle: string,
    inputType: TInputType,
    rowData: TRowData | null,
    selectOptionData: TRowData[] | null,
    action: TFormMode,
    formAction: (formData: FormData) => StatePromise, 
    redirectLink: string,
};

export default function FormWithoutState( {formTitle, inputType, rowData, selectOptionData, action, formAction, redirectLink}: FormWithoutStateProps ) {

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmitClick = (action: TFormMode) => (e: React.MouseEvent<HTMLButtonElement>) => {

        // set confirmMsg
        let confirmMsg = 'Confirm?';
        if (action === 'create') {
            confirmMsg = 'Are you sure to add this new item?';
        }
        
        else if (action === 'update') {
            confirmMsg = 'Are you sure to update this item?'
        }

        //if any button other than submit is clicked, preventDefault submit routing!
        if (!window.confirm(confirmMsg)) {
            e.preventDefault();
            return;
        };
    };

    // Generate select options
    function generateSelectOption(key: string, selectOptionData: TRowData[] | null) {

        // map each row into select option
        const selectOption = selectOptionData?.map((row) => {

            return (
                <option key={getString(row?.[key])} defaultValue={getString(row?.[key])}>{getString(row?.[key])}</option>
            );
        });

        return selectOption;
    };


    // Generate form inputs
    function generateFormInput(inputType: TInputType, rowData: TRowData | null, selectOptionData: TRowData[] | null) {

        const inputs = Object.keys(inputType).map(key => {

            if (inputType[key] === 'hidden') {
                return (
                    <React.Fragment key={key}>
                        <input name={key} aria-describedby={key+"-error"} className="input" type="text" placeholder="placeholder" defaultValue={getString(rowData?.[key])} required readOnly hidden formNoValidate />
                    </React.Fragment>
                );
            }
    
            else if (inputType[key] === 'readonly') {
                return (
                    <React.Fragment key={key}>
                        <label className="label" htmlFor={key}>{key}: </label>
                        <input name={key} aria-describedby={key+"-error"} className="input" type="text" placeholder="placeholder" defaultValue={getString(rowData?.[key])} required readOnly formNoValidate />
                    </React.Fragment>
                );
            }
    
            else if (inputType[key] === 'select') {
                return (
                    <React.Fragment key={key}>
                        <label className="label" htmlFor={key}>{key}: </label>
                        <select name={key} aria-describedby={key+"-error"} className="input" defaultValue={getString(rowData?.[key]) || ""} required>
                            <option value="" disabled></option>
                            {generateSelectOption(key, selectOptionData)}
                        </select>
                    </React.Fragment>
                );
            }
    
            else if (inputType[key] === 'dynamic') {
                return (
                    <React.Fragment key={key}>
                        <label className="label" htmlFor={key}>{key}: </label>
                        <input name={key} aria-describedby={key+"-error"} className="input" type="text" placeholder="placeholder" defaultValue={getString(rowData?.[key])} required readOnly formNoValidate />
                    </React.Fragment>
                );
            }
    
            else if (inputType[key] === 'number') {
                return (
                    <React.Fragment key={key}>
                        <label className="label" htmlFor={key}>{key}: </label>
                        <input name={key} aria-describedby={key+"-error"} className="input" type="number" step="any" required formNoValidate />
                    </React.Fragment>
                );
            }
    
            else {
                return (
                    <React.Fragment key={key}>
                        <label className="label" htmlFor={key}>{key}: </label>
                        <input name={key} aria-describedby={key+"-error"} className="input" type={inputType[key]} required formNoValidate />
                    </React.Fragment>
                );
            }
        });

        return (
            <>{inputs}</>
        );
    };

    return (
        <form ref={formRef} className="my-[2%] mx-[2%]" action={ async (formData) => {
            const result = await formAction(formData);
            if (result?.error && result?.message) {
                toast.error(result.message);
            }
            else if (result?.message) {
                toast.success(result.message);
            }
            formRef.current?.reset();
        }
    }>
            <h2>{formTitle}</h2>
            {generateFormInput(inputType, rowData, selectOptionData)}
            <SubmitButton buttonClass="btn-ok w-40 mr-4 mt-10" buttonTitle="Submit" onButtonClick={handleSubmitClick(action)} submitingButtonTitle="Submitting" />
            <Link className="no-underline text-black dark:text-white hover:text-black hover:dark:text-white" href={redirectLink}>
                <button type="button" className="btn-cancel w-40 mr-4 mt-4">
                    Close
                </button>
            </Link>
            <button type="button" className="btn-cancel w-40 mr-4 mt-4" onClick={() => formRef.current?.reset()}>Reset</button>
        </form>
    );
};