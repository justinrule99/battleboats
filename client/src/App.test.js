import React from 'react';
import { render } from '@testing-library/react';
import App from './components/App.js';
import {test} from "jest-snapshot";

test('renders signin and start game buttons', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});