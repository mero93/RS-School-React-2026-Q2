import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ItemCard from './ItemCard';
import type { ComicStrip } from '../../types/comic-strip';

describe('ItemCard - Unit Tests', () => {
  const mockItem: ComicStrip = {
    uid: '123',
    title: 'Star Trek: Mirror Universe',
    publishedYearFrom: 1967,
    publishedYearTo: 1968,
    numberOfPages: 32,
  };

  it('calls openCard with the correct uid when clicked', () => {
    const mockOpenCard = vi.fn();
    const { container } = render(
      <ItemCard 
        item={mockItem} 
        toggleCard={vi.fn()} 
        isSelected={false} 
        openCard={mockOpenCard} 
      />
    );

    const card = container.querySelector('.item-card');
    if (!card) throw new Error('Could not find element with class .item-card');

    fireEvent.click(card);

    expect(mockOpenCard).toHaveBeenCalledTimes(1);
    expect(mockOpenCard).toHaveBeenCalledWith('123');
  });

  it('calls openCard when the Enter key is pressed', () => {
    const mockOpenCard = vi.fn();
    const { container } = render(
      <ItemCard 
        item={mockItem} 
        toggleCard={vi.fn()} 
        isSelected={false} 
        openCard={mockOpenCard} 
      />
    );

    const card = container.querySelector('.item-card');
    if (!card) throw new Error('Could not find element with class .item-card');

    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });

    expect(mockOpenCard).toHaveBeenCalledTimes(1);
    expect(mockOpenCard).toHaveBeenCalledWith('123');
  });

  it('does not call openCard when other keys are pressed', () => {
    const mockOpenCard = vi.fn();
    const { container } = render(
      <ItemCard 
        item={mockItem} 
        toggleCard={vi.fn()} 
        isSelected={false} 
        openCard={mockOpenCard} 
      />
    );

    const card = container.querySelector('.item-card');
    if (!card) throw new Error('Could not find element with class .item-card');

    fireEvent.keyDown(card, { key: 'Space', code: 'Space' });

    expect(mockOpenCard).not.toHaveBeenCalled();
  });

  it('calls toggleCard and switches icons when checkbox is clicked', () => {
    const mockToggleCard = vi.fn();

    const { container, rerender } = render(
      <ItemCard
        item={mockItem}
        toggleCard={mockToggleCard}
        isSelected={false}
        openCard={vi.fn()}
      />
    );

    const checkbox = container.querySelector('.checkbox');
    if (!checkbox) throw new Error('Checkbox not found');

    expect(container.innerHTML).toContain('lucide-square');
    expect(container.innerHTML).not.toContain('lucide-square-check-big');

    fireEvent.click(checkbox);
    expect(mockToggleCard).toHaveBeenCalledTimes(1);

    rerender(
      <ItemCard
        item={mockItem}
        toggleCard={mockToggleCard}
        isSelected={true}
        openCard={vi.fn()}
      />
    );

    expect(container.innerHTML).toContain('lucide-square-check-big');
    expect(container.innerHTML).not.toContain('lucide-square"');
  });
});