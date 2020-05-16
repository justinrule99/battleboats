import React from 'react';
import { render } from '@testing-library/react';
import P5Board from '../client/src/components/P5Board';
import {test} from "jest-snapshot";

test('renders signin and start game buttons', () => {
    const { getByText } = render(<P5Board />);
    // const linkElement = getByText(/learn react/i);
    // expect(linkElement).toBeInTheDocument();
});