import * as React from 'react';
import { Button } from 'react-native-paper';

export default function Button () {
    return (
        <Button raised
        theme = {{
            roundness: 3,
            font: { medium: 'Open Sans' }
        }}>
            hi im button :)
        </Button>
    );
}