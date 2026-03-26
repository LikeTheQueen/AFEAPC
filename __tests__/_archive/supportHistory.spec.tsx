import { render, screen } from '@testing-library/react';
import   SupportHistory   from '../../src/routes/supportHistory';

describe('SupportHistory', () => {
    test('Renders the Support History Screen', () => {
        render(<SupportHistory />);
        expect(screen.getByText('React Router Docs')).toBeInTheDocument();
    })
})