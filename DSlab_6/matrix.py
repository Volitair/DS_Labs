import random

random.seed(9320)
n = 12
n3 = 2
n4 = 0
for i in range(n):
    for j in range(n):
        print(f'{round((1 - 0.01 * n3 - 0.005 * n4 - 0.15) * (random.random()))},', end=' ')
    print('')