import timeit

ISLANDS = [
    {"id": f"isla_{i}", "name": f"Isla {i}", "order": i, "requiredPebbles": i*3, "unlockedContentId": f"story_{i}"} for i in range(100)
]

unlocked_ids = {f"isla_{i}" for i in range(99)}
total = 200

def original():
    next_island = None
    for i in ISLANDS:
        if i["id"] not in unlocked_ids:
            if i["requiredPebbles"] > 0:
                progress = min(100, int(total / i["requiredPebbles"] * 100))
            else:
                progress = 100
            next_island = {**i, "progress": progress}
            break
    return next_island

def optimized_for_loop():
    next_island = None
    for i in ISLANDS:
        if i["id"] not in unlocked_ids:
            next_island = i
            break
    if next_island:
        req = next_island["requiredPebbles"]
        progress = min(100, int(total / req * 100)) if req > 0 else 100
        next_island = {**next_island, "progress": progress}
    return next_island

print("Original (large list, near end):", timeit.timeit(original, number=100000))
print("Optimized for loop (large list, near end):", timeit.timeit(optimized_for_loop, number=100000))
