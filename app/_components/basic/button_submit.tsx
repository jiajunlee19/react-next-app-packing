import {useFormStatus} from 'react-dom';
import React from 'react';

type SubmitButtonProps = {
    buttonClass: string,
    buttonTitle: string | React.JSX.Element,
    onButtonClick: React.MouseEventHandler,
    submitingButtonTitle: string | React.JSX.Element,
};

export default function SubmitButton( {buttonClass, buttonTitle, onButtonClick, submitingButtonTitle}: SubmitButtonProps ) {

    // useFormStatus gives a pending boolean, use this to tell if the button should be disabled or not
    const { pending } = useFormStatus();

    return (
        <button className={buttonClass} type="submit" disabled={pending} onClick={onButtonClick}>
            {pending ? submitingButtonTitle : buttonTitle}
        </button>
    );
};