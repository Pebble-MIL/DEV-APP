import time
import random

# Mock ISLANDS data
NUM_ISLANDS = 1000
ISLANDS = [{"id": f"island_{i}", "requiredPebbles": (i+1)*100} for i in range(NUM_ISLANDS)]

# Mock user_data
NUM_UNLOCKED = 800
unlocked_list = [f"island_{i}" for i in range(NUM_UNLOCKED)]
total = 50000

def original_code():
    unlocked_ids = unlocked_list
    unlocked = [i for i in ISLANDS if i["id"] in unlocked_ids]

    next_island = None
    for i in ISLANDS:
        if i["id"] not in unlocked_ids:
            next_island = {**i, "progress": min(100, int(total / i["requiredPebbles"] * 100))}
            break
    return unlocked, next_island

def optimized_code():
    unlocked_ids = set(unlocked_list)
    unlocked = [i for i in ISLANDS if i["id"] in unlocked_ids]

    next_island = None
    for i in ISLANDS:
        if i["id"] not in unlocked_ids:
            next_island = {**i, "progress": min(100, int(total / i["requiredPebbles"] * 100))}
            break
    return unlocked, next_island

import timeit

print("Original code time:", timeit.timeit(original_code, number=1000))
print("Optimized code time:", timeit.timeit(optimized_code, number=1000))
