from __future__ import annotations

from functools import lru_cache
from typing import TYPE_CHECKING, Literal

from dissect.btrfs.c_btrfs import c_btrfs

if TYPE_CHECKING:
    from collections.abc import Iterator

    from dissect.btrfs.btrfs import Btrfs


class BTree:
    """Represent a Btrfs B-tree.

    One of ``root_item`` or ``root_offset`` must be given.

    Args:
        btrfs: The filesystem this B-tree belongs to.
        root_item: Optional ``btrfs_root_item`` to open the B-tree from.
        root_offset: Optional offset to open the B-tree from.
    """

    def __init__(self, btrfs: Btrfs, root_item: c_btrfs.btrfs_root_item | None = None, root_offset: int | None = None):
        self.btrfs = btrfs

        if not root_item and not root_offset:
            raise ValueError("Either root_item or root_offset are required")

        self.root_item = root_item
        self.root_offset = root_offset or root_item.bytenr

        self._read_node = lru_cache(8192)(self._read_node)

    def cursor(self) -> Cursor:
        """Return a new cursor into the B-tree."""
        return Cursor(self)

    def find(
        self, objectid: int | None = None, type: int | None = None, offset: int | None = None
    ) -> tuple[c_btrfs.btrfs_item, memoryview]:
        """Search for a single item in the B-tree.

        Args:
            objectid: Optional object ID to search for.
            type: Optional type to search for.
            offset: Optional offset to search for.
        """
        cursor = self.cursor()
        if not cursor.search(objectid, type, offset) or _cmp_key(cursor.item().key, objectid, type, offset) != 0:
            raise KeyError(f"Can't find item with key ({objectid}, {type}, {offset})")

        return cursor.get()

    def _read_node(self, address: int) -> tuple[memoryview, c_btrfs.btrfs_header]:
        """Helper method for reading a node in the B-tree.

        Args:
            address: The address of the node to read.
        """
        node = memoryview(self.btrfs._read_node(address))
        header = c_btrfs.btrfs_header(node)

        return node, header


class Cursor:
    """A basic cursor implementation for interacting with a :class:`BTree`.

    Args:
        btree: The :class:`BTree` to open a cursor on.
    """

    def __init__(self, btree: BTree):
        self.btree = btree

        self._node = None
        self._header = None
        self._keys = {}
        self._items = {}
        self._index = None
        self._path = []
        self.reset()

    def reset(self) -> None:
        """Reset the cursor."""
        self._node = None
        self._header = None
        self._keys = {}
        self._items = {}
        self._index = None
        self._path = []
        self.push(self.btree.root_offset)

    def push(self, address: int, initial_index: int = 0) -> None:
        """Push the cursor down a node.

        Args:
            address: The address of the node to push down to.
            initial_index: The initial index to seek to in the new node. ``-1`` means the last item.
        """
        self._path.append((self._node, self._header, self._keys, self._items, self._index))

        self._node, self._header = self.btree._read_node(address)
        self._keys = {}
        self._items = {}
        self._index = self._header.nritems if initial_index == -1 else initial_index

    def pop(self) -> None:
        """Pop up a node."""
        self._node, self._header, self._keys, self._items, self._index = self._path.pop()

    def _read_key(self, index: int) -> c_btrfs.btrfs_disk_key:
        """Read a key at the specified index.

        Args:
            index: The index of the key to read.
        """
        if key := self._keys.get(index):
            return key

        struct = c_btrfs.btrfs_key_ptr if self._header.level else c_btrfs.btrfs_item
        offset = len(c_btrfs.btrfs_header) + (len(struct) * index)
        key = c_btrfs.btrfs_disk_key(self._node[offset : offset + len(c_btrfs.btrfs_disk_key)])
        self._keys[index] = key

        return key

    def _read_item(self, index: int) -> c_btrfs.btrfs_key_ptr | c_btrfs.btrfs_item:
        """Read an item at the specified index.

        Args:
            index: The index of the item to read.
        """
        if item := self._items.get(index):
            return item

        struct = c_btrfs.btrfs_key_ptr if self._header.level else c_btrfs.btrfs_item
        offset = len(c_btrfs.btrfs_header) + (len(struct) * index)
        item = struct(self._node[offset : offset + len(struct)])
        self._items[index] = item

        if index not in self._keys:
            self._keys[index] = item.key

        return item

    def next(self) -> None:
        """Traverse to the next leaf item.

        Will move up and down the tree to find the next leaf item.
        """
        self.next_node()
        while self._header.level:
            self.push(self.item().blockptr)

    def next_node(self) -> None:
        """Traverse to the next node.

        Will move up and down the tree to find the next node.
        """
        while self._index is not None and self._index + 1 >= self._header.nritems:
            self.pop()

        if self._index is None:
            raise ValueError("Reached end")

        self._index += 1
        if self._header.level:
            self.push(self.item().blockptr)

    def prev(self) -> None:
        """Traverse to the previous leaf item.

        Will move up and down the tree to find the previous leaf item.
        """
        self.prev_node()
        while self._header.level:
            self.push(self.item().blockptr, -1)

    def prev_node(self) -> None:
        """Traverse to the previous leaf item.

        Will move up and down the tree to find the previous leaf item.
        """
        while self._index is not None and self._index - 1 < 0:
            self.pop()

        if self._index is None:
            raise ValueError("Reached start")

        self._index -= 1
        if self._header.level:
            self.push(self.item().blockptr, -1)

    def first(self) -> None:
        """Move the cursor to the first leaf item."""
        self.reset()
        while self._header.level:
            self.push(self.item().blockptr)

    def last(self) -> None:
        """Move the cursor to the last leaf item."""
        self.reset()
        self._index = self._header.nritems - 1
        while self._header.level:
            self.push(self.item().blockptr, -1)

    def get(self) -> tuple[c_btrfs.btrfs_item, memoryview]:
        """Retrieve the leaf item and the associated data at the current cursor position.

        Cursor must be positioned at a leaf item.
        """
        return self.item(), self.data()

    def item(self) -> c_btrfs.btrfs_key_ptr | c_btrfs.btrfs_item:
        """Retrieve a leaf or branch item.

        Cursor can be positioned at a branch or leaf item.
        """
        if self._index is None:
            raise ValueError("Cursor not set")

        return self._read_item(self._index)

    def items(self) -> Iterator[c_btrfs.btrfs_key_ptr | c_btrfs.btrfs_item]:
        """Iterate over all items in the current node."""
        for i in range(self._header.nritems):
            yield self._read_item(i)

    def data(self) -> memoryview:
        """Return the associated data of the current leaf item."""
        if self._index is None:
            raise ValueError("Cursor not set")

        if self._header.level:
            raise ValueError("Cursor not set to a leaf")

        header_size = len(c_btrfs.btrfs_header)
        item = self.item()

        offset = header_size + item.offset
        return self._node[offset : offset + item.size]

    def iter(
        self,
        objectid: int | None = None,
        type: int | None = None,
        offset: int | None = None,
        ignore_offset: bool = False,
    ) -> Iterator[tuple[c_btrfs.btrfs_item, memoryview]]:
        """Search and iterate the B-tree for the specified key.

        Stop iterating if the current item no longer matches the given parameters.

        Args:
            objectid: Optional object ID to search for.
            type: Optional type to search for.
            offset: Optional offset to search for.
            ignore_offset: Only use the ``offset`` argument for the initial positioning of the cursor,
                but ignore it for future iterations. This is useful for e.g. iterating file extents.
        """
        if not self.search(objectid, type, offset):
            return

        while _cmp_key(self.item().key, objectid, type, None if ignore_offset else offset) == 0:
            yield self.get()

            try:
                self.next()
            except ValueError:
                return

    def walk(
        self,
        objectid: int | None = None,
        type: int | None = None,
        offset: int | None = None,
    ) -> Iterator[tuple[c_btrfs.btrfs_item, memoryview]]:
        """Walk all leaf items of the B-tree and yield all matching leafs.

        Args:
            objectid: Optional object ID to yield items of.
            type: Optional type to yield items of.
            offset: Optional offset to yield items of.
        """
        self.first()

        while True:
            if _cmp_key(self.item().key, objectid, type, offset) == 0:
                yield self.get()

            try:
                self.next()
            except ValueError:
                return

    def search(self, objectid: int | None = None, type: int | None = None, offset: int | None = None) -> bool:
        """Perform a binary search on the current node for the key with the given parameters.

        Puts the cursor at the index of the matching item, or just before a "greater" item if no exact match is found.
        ``True`` is returned if this is the case, else ``False`` is returned and the cursor position is reset.

        Args:
            objectid: Optional object ID to search for.
            type: Optional type to search for.
            offset: Optional offset to search for.
        """
        while True:
            min_idx = 0
            max_idx = self._header.nritems - 1

            while min_idx != max_idx:
                test_idx = (min_idx + max_idx) // 2
                key = self._read_key(test_idx)

                result = _cmp_key(key, objectid, type, offset or 0)
                if result < 0:
                    min_idx = test_idx + 1
                else:
                    max_idx = test_idx

            result = _cmp_key(self._read_key(min_idx), objectid, type, offset)
            if self._header.level:
                if result > 0 and min_idx > 0:
                    # When we're at a node level, and the next key is larger than what we're searching for, then
                    # we must traverse down the previous node
                    min_idx -= 1
                self._index = min_idx
                self.push(self._read_item(min_idx).blockptr)
                continue

            if result >= 0:
                # Count a matching or larger key as a win
                self._index = min_idx
                return True

            if min_idx == self._header.nritems - 1:
                # Special case where we have exhausted all leaf nodes but all keys are still smaller
                # In this case, try to travel to the next node (up one level, next item, down one level)
                # Worst case we end up at a key that's larger than our search parameters.
                self._index = min_idx
                try:
                    self.next_node()
                    continue
                except ValueError:
                    self._index = None
                    return False

            break

        self._index = None
        return False


def _cmp_key(
    key: c_btrfs.btrfs_disk_key,
    objectid: int | None = None,
    type: int | None = None,
    offset: int | None = None,
) -> Literal[1, -1, 0]:
    """Compare a B-tree key on disk to a given object ID, type and offset.

    Returns -1 if the key on disk is less, 0 if the key is equal and 1 if the key is greater.
    Search parameters of ``None`` are ignored in the comparison.

    Args:
        key: The key on disk to compare.
        objectid: Optional object ID to compare against.
        type: Optional type to compare against.
        offset: Optional offset to compare against.
    """
    if objectid is not None:
        if key.objectid > objectid:
            return 1
        if key.objectid < objectid:
            return -1
    if type is not None:
        if key.type > type:
            return 1
        if key.type < type:
            return -1
    if offset is not None:
        if key.offset > offset:
            return 1
        if key.offset < offset:
            return -1
    return 0
