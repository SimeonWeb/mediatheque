<?php

namespace App\State;

use ApiPlatform\State\Pagination\PartialPaginatorInterface;

/**
 * @template T of object
 *
 * @implements PartialPaginatorInterface<T>
 */
final readonly class CursorPaginator implements \IteratorAggregate, PartialPaginatorInterface
{
    /**
     * @param list<T> $items
     */
    public function __construct(
        private array $items,
        private int $itemsPerPage,
    ) {
    }

    public function getCurrentPage(): float
    {
        return 1.0;
    }

    public function getItemsPerPage(): float
    {
        return (float) $this->itemsPerPage;
    }

    public function count(): int
    {
        return count($this->items);
    }

    public function getIterator(): \Traversable
    {
        yield from $this->items;
    }
}
