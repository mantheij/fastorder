import useEmployeeController from '../controller/EmployeeController';

describe('EmployeeController', () => {
    let controller;

    beforeEach(() => {
        controller = useEmployeeController();
    });

    it('should add an order', () => {
        controller.addOrder(1, 'Test order');
        expect(controller.boxes).toHaveLength(1);
    });

    it('should delete an order', () => {
        controller.addOrder(1, 'Test order');
        const initialLength = controller.boxes.length;
        controller.deleteBox(0);
        expect(controller.boxes).toHaveLength(initialLength - 1);
    });

    it('should toggle order in progress', () => {
        controller.addOrder(1, 'Test order');
        const initialInProgress = controller.boxes[0].inProgress;
        controller.toggleInProgress(0);
        expect(controller.boxes[0].inProgress).toBe(!initialInProgress);
    });

    it('should cancel an order', () => {
        controller.addOrder(1, 'Test order');
        const initialLength = controller.boxes.length;
        controller.cancelOrder(0);
        expect(controller.boxes).toHaveLength(initialLength - 1);
    });
});
