import { render, screen, fireEvent, act } from '@testing-library/react';
import { useRadioFilter } from '@/store/useRadioFilter';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Store the mock function reference for useDisclosure
const mockOnOpen = jest.fn();
const mockOnOpenChange = jest.fn();
const mockOnClose = jest.fn();
let isModalOpen = false;

jest.mock('@heroui/modal', () => ({
  Modal: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
  ModalContent: ({
    children,
  }: {
    children: ((onClose: () => void) => React.ReactNode) | React.ReactNode;
  }) => (
    <div data-testid="modal-content">
      {typeof children === 'function' ? children(mockOnClose) : children}
    </div>
  ),
  ModalHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-header">{children}</div>
  ),
  ModalBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-body">{children}</div>
  ),
  ModalFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-footer">{children}</div>
  ),
  useDisclosure: () => ({
    isOpen: isModalOpen,
    onOpen: mockOnOpen,
    onOpenChange: mockOnOpenChange,
    onClose: mockOnClose,
  }),
}));

jest.mock('@/components/Modal/ModalHeader', () => ({
  AppModalHeader: ({
    modalName,
    children,
  }: {
    modalName: string;
    children?: React.ReactNode;
  }) => (
    <div data-testid="app-modal-header">
      <span>{modalName}</span>
      {children}
    </div>
  ),
}));

const mockCategories = ['rock', 'pop', 'jazz', 'electronic', 'classical'];

// Import AFTER mocks are set up
import { CategoryFilters } from '../index';

describe('CategoryFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isModalOpen = false;

    act(() => {
      useRadioFilter.setState({
        filters: [],
        applyedFilters: [],
      });
    });
  });

  describe('Filter Button', () => {
    it('should render filter button', () => {
      render(<CategoryFilters categories={mockCategories} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('should call onOpen when filter button is clicked', () => {
      render(<CategoryFilters categories={mockCategories} />);

      const filterButton = screen.getByText('Filters');
      fireEvent.click(filterButton);

      expect(mockOnOpen).toHaveBeenCalled();
    });
  });

  describe('Modal Content', () => {
    beforeEach(() => {
      isModalOpen = true;
    });

    it('should render modal when open', () => {
      render(<CategoryFilters categories={mockCategories} />);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should render all category buttons', () => {
      render(<CategoryFilters categories={mockCategories} />);

      mockCategories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it('should render modal header', () => {
      render(<CategoryFilters categories={mockCategories} />);

      expect(screen.getByTestId('app-modal-header')).toBeInTheDocument();
    });

    it('should render Apply and Cancel buttons', () => {
      render(<CategoryFilters categories={mockCategories} />);

      expect(screen.getByText('Apply filters')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render Clear all button', () => {
      render(<CategoryFilters categories={mockCategories} />);

      expect(screen.getByText('Clear all')).toBeInTheDocument();
    });
  });

  describe('Category Selection', () => {
    beforeEach(() => {
      isModalOpen = true;
    });

    it('should toggle category selection on click', () => {
      render(<CategoryFilters categories={mockCategories} />);

      const rockButton = screen.getByText('rock');
      fireEvent.click(rockButton);

      const { filters } = useRadioFilter.getState();
      expect(filters).toContain('rock');
    });

    it('should deselect category on second click', () => {
      act(() => {
        useRadioFilter.setState({ filters: ['rock'] });
      });

      render(<CategoryFilters categories={mockCategories} />);

      const rockButton = screen.getByText('rock');
      fireEvent.click(rockButton);

      const { filters } = useRadioFilter.getState();
      expect(filters).not.toContain('rock');
    });
  });

  describe('Empty Categories', () => {
    beforeEach(() => {
      isModalOpen = true;
    });

    it('should show empty state when no categories', () => {
      render(<CategoryFilters categories={[]} />);

      expect(screen.getByText('No categories available')).toBeInTheDocument();
    });
  });

  describe('Selected Count Display', () => {
    beforeEach(() => {
      isModalOpen = true;
    });

    it('should show "Select to filter stations" when no filters selected', () => {
      render(<CategoryFilters categories={mockCategories} />);

      expect(screen.getByText('Select to filter stations')).toBeInTheDocument();
    });

    it('should show count when filters are applied', () => {
      act(() => {
        useRadioFilter.setState({
          filters: ['rock', 'pop'],
          applyedFilters: ['rock', 'pop'],
        });
      });

      render(<CategoryFilters categories={mockCategories} />);

      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });
  });

  describe('Footer Actions', () => {
    beforeEach(() => {
      isModalOpen = true;
    });

    it('should call applyFilters and close modal when Apply is clicked', () => {
      act(() => {
        useRadioFilter.setState({ filters: ['rock'] });
      });

      render(<CategoryFilters categories={mockCategories} />);

      const applyButton = screen.getByText('Apply filters');
      fireEvent.click(applyButton);

      const { applyedFilters } = useRadioFilter.getState();
      expect(applyedFilters).toContain('rock');
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should clear all filters when Clear all is clicked', () => {
      act(() => {
        useRadioFilter.setState({
          filters: ['rock', 'pop'],
          applyedFilters: ['rock', 'pop'],
        });
      });

      render(<CategoryFilters categories={mockCategories} />);

      const clearButton = screen.getByText('Clear all');
      fireEvent.click(clearButton);

      const { filters, applyedFilters } = useRadioFilter.getState();
      expect(filters).toEqual([]);
      expect(applyedFilters).toEqual([]);
    });
  });
});
