# Simple Binary Sync (sbsync) - Initial Notes

## Alternatives

### [BSON](https://bsonspec.org/)


### [Protocol Buffers](https://protobuf.dev)


## Solution Components

- Binary format
- Binary diff format
- Serialization algorithm
- Deserialization algorithm
- Diff creation algorithm
- Diff application algorithm


## Binary Format

```
+-----------+-----------------+------+
| Meta data | Keys dictionary | Data |
+-----------+-----------------+------+
```

### Supported Data Types

- Document (1);
- Array (2);
- null (3);
- String (4). UTF-8 encoded;
- Boolean (5);
- Int8 (6);
- Int16 (7);
- Int32 (8);
- Int64 (9);
- Float64 (10).

The value `undefined` is always serialized to the value `null`.


### Meta Data

- Timestamp (8 bytes);
- Protocol major version (1 byte);
- Protocol minor version (1 byte);
- Length of Keys Dictionary (8 bytes);
- Reserved (32 B);
- Settings (16 B);


### Keys Dictionary

```
+----------+----------+-------------------+----------+
| ID       | Length   | Key name          | Length   |
| (uint64) | (uint16) | (variable length) | (uint16) |
+----------+----------+-------------------+----------+
```

`IDs` are strongly increasing.

The second `length` field is needed for `O(log n)` lookup of a key by its `ID`.


### Data

```
+----------+-----------+----------+-------------------+
| KeyID    | Data type | Length   | Value             |
| (uint64) | (uint8)   | (uint64) | (variable length) |
+----------+-----------+----------+-------------------+
```

For the root object, `KeyId` == 0.

For the `null` data type, the `Length` field contains value `0`, and the `Value` field is missing.

For `Document` and `Array` data types, the `Length` field contains value `4`.

For the `Document` data type, the field `Value` contains the actual number of properties (uint32).

For the `Array` data type, the field `Value` contains the actual number of elements in the array (uint32).

For the `Boolean` data type, the field `Length` contains value `1`, and the `Value` field contains either value `0::uint8` for `false`, or value `1::uint8` for `true`.



## Serialization Algorithm

1. Process the previous binary instance to:

   1.1. Build a hash map of existing keys (`HashMap<Key: string, [ID: uint64, isUsed: boolean]>`).

        A data structure implementing this hash map MUST guarantee that during iteration items are iterated in the order they are inserted in the hash map. This, in turn, guarantees that `ID`s are iterated in increasing order.

        The field `isUsed` is initially set to `false`.

   1.2. Store the largest `ID` in the variable `largestKeyId: uint64`.

   If there are no previos binary instance, take an empty document (i.e. `{}`) as the previos binary instance.

2. Traverse the source object (breadth-first). For each entry:

   2.1. Process the key name:

        2.1.1. Find an entry in the hashmap build on step 1.1 by the key name.

               2.1.1.1. If an entry is found, set its field `isUsed` to `true`. Go to step 2.1.2.

               2.1.1.2. If an entry is NOT found, add an item to the hash map with values:

                        Key -> key name;
                        ID -> `largestKeyId + 1`;
                        isUsed -> true;

        2.1.2. Store the key ID in a variable `currKeyId`.

   2.2. Add an entry into the `Data` buffer:

3. Filter out items with `isUsed == false` from the hash map of existing keys.

4. Build the new binary.




Decoding string values is fatal!!!
