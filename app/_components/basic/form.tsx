"use client"

import React, { useRef } from "react";
import SubmitButton from "@/app/_components/basic/button_submit";
import { type TInputType, type TRowData, type State, type StatePromise, type TFormMode } from "@/app/_libs/types";
import { toast } from "react-hot-toast";
import { getString } from "@/app/_libs/toString_handler";
import { useFormState } from "react-dom";
import { redirect } from "next/navigation";
import Link from "next/link";

type FormProps = {
    formTitle: string,
    inputType: TInputType,
    rowData: TRowData | null,
    selectOptionData: TRowData[] | null,
    action: TFormMode,
    formAction: (prevState: State, formData: FormData) => StatePromise, 
    redirectLink: string,
};

export default function Form( {formTitle, inputType, rowData, selectOptionData, action, formAction, redirectLink}: FormProps ) {

    const initialState  = { message: null, errors: {} };
    const [state, dispatch] = useFormState(formAction, initialState);

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
                        {state.error?.[key] && 
                        <p id={key+"-error"} aria-live="polite" className="mb-[2%] font-semibold text-red-500 dark:text-red-500">
                            {state.error[key][0]}
                        </p>
                        }
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
                        {state.error?.[key] && 
                        <p id={key+"-error"} aria-live="polite" className="mb-[2%] font-semibold text-red-500 dark:text-red-500">
                            {state.error[key][0]}
                        </p>
                        }
                    </React.Fragment>
                );
            }
    
            else if (inputType[key] === 'dynamic') {
                return (
                    <React.Fragment key={key}>
                        <label className="label" htmlFor={key}>{key}: </label>
                        <input name={key} aria-describedby={key+"-error"} className="input" type="text" placeholder="placeholder" defaultValue={getString(rowData?.[key])} required readOnly formNoValidate />
                        {state.error?.[key] && 
                        <p id={key+"-error"} aria-live="polite" className="mb-[2%] font-semibold text-red-500 dark:text-red-500">
                            {state.error[key][0]}
                        </p>
                        }
                    </React.Fragment>
                );
            }
    
            else if (inputType[key] === 'number') {
                return (
                    <React.Fragment key={key}>
                        <label className="label" htmlFor={key}>{key}: </label>
                        <input name={key} aria-describedby={key+"-error"} className="input" type="number" step="any" required formNoValidate />
                        {state.error?.[key] && 
                        <p id={key+"-error"} aria-live="polite" className="mb-[2%] font-semibold text-red-500 dark:text-red-500">
                            {state.error[key][0]}
                        </p>
                        }
                    </React.Fragment>
                );
            }
    
            else {
                return (
                    <React.Fragment key={key}>
                        <label className="label" htmlFor={key}>{key}: </label>
                        <input name={key} aria-describedby={key+"-error"} className="input" type={inputType[key]} required formNoValidate />
                        {state.error?.[key] && 
                        <p id={key+"-error"} aria-live="polite" className="mb-[2%] font-semibold text-red-500 dark:text-red-500">
                            {state.error[key][0]}
                        </p>
                        }
                    </React.Fragment>
                );
            }
        });

        return (
            <>{inputs}</>
        );
    };

    if (state.message && state.error) {
        toast.error(state.message);
    }
    else if (state.message) {
        toast.success(state.message);
        redirect(redirectLink);
    }

    return (
        <form ref={formRef} className="my-[2%] mx-[2%]" action={dispatch}>
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