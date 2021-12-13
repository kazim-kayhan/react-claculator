import React from 'react';
import { ACTIONS } from "./App";

const OperationButtons = ( { dispatch, operation } ) =>
{
    return (
        <button onClick={ () => dispatch( { type: ACTIONS.OPERATIONS, payload: { operation } } ) }>
            { operation }
        </button>
    );
};

export default OperationButtons;
