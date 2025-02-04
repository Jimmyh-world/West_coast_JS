import { describe, it, expect } from 'vitest';
describe('Testing Environment', () => {
    it('should work with TypeScript', () => {
        const sum = (a, b) => a + b;
        console.log('Running basic TypeScript test');
        expect(sum(1, 2)).toBe(3);
    });
});
//# sourceMappingURL=setup.test.js.map