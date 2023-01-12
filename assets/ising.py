import numpy as np
from pyodide.ffi import to_js
from collections import deque 


class IsingModel:
    def __init__(self, L):
        self.L = L
        self.spins = np.random.choice(a=[1, -1], size=(L, L))

    def gibbs_update(self, beta):
        '''
        Choose roughly half the spins to update at random.
        Strictly this is not correct as adjacent spins are not independent
        but it makes a nice picture.
        '''
        fields = np.roll(self.spins, 1, 0) + np.roll(self.spins, -1, 0) + np.roll(self.spins, 1, 1) + np.roll(self.spins, -1, 1)
        delta_E = 2 * fields
        spin_up_probabilities = 1 / (1 + np.exp(- beta * delta_E))
        new_spins = 2 * (np.random.random_sample(size=(self.L, self.L)) < spin_up_probabilities) - 1
        to_update = np.random.choice(a=[True, False], size=(self.L, self.L))
        self.spins = np.choose(to_update, [self.spins, new_spins])

    def glauber_update(self, beta):
        x, y = np.random.randint(self.L, size=2)
        fields = 0
        for neighbour in [((x + 1) % self.L, y), ((x - 1) % self.L, y), (x, (y + 1) % self.L), (x, (y - 1) % self.L)]:
            fields += self.spins[neighbour]
        delta_E = 2 * fields
        spin_up_probability = 1 / (1 + np.exp(- beta * delta_E))        
        if np.random.rand() < spin_up_probability:
            self.spins[x, y] = 1
        else:
            self.spins[x, y] = -1

    def wolff_update(self, beta):
        '''
        Wolff cluster update
        '''
        initial_x, initial_y = np.random.randint(self.L, size=2)
        initial_spin = self.spins[initial_x, initial_y]
        cluster = deque([(initial_x, initial_y)])
        add_prob = 1 - np.exp(-2 * beta)

        while len(cluster) != 0:
            x, y = cluster.popleft()
            if self.spins[x, y] == initial_spin:
                self.spins[x, y] *= -1
                for neighbour in (((x + 1) % self.L, y), ((x - 1) % self.L, y), (x, (y + 1) % self.L), (x, (y - 1) % self.L)):
                    if self.spins[neighbour] == initial_spin:
                        if np.random.rand() < add_prob:
                            cluster.append(neighbour)
                
    def to_js(self):
        return to_js(self.spins)
