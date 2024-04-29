import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EmployeeView from '../components/EmployeeView';

jest.mock('../controller/EmployeeController', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        boxes: [],
        addOrder: jest.fn(),
        deleteBox: jest.fn(),
        toggleInProgress: jest.fn(),
        cancelOrder: jest.fn(),
    })),
}));

describe('EmployeeView', () => {
    it('renders without crashing', () => {
        render(<EmployeeView />);
    });


});
