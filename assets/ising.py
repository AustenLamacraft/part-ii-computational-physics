import numpy as np
from pyodide import to_js

class IsingModel:
    def __init__(self, L):
        self.L = L
        self.config = np.random.choice(a=[True, False], size=(L, L))

    def glauber_update(self, beta):
        spins = 2 * self.config - 1
        fields = np.roll(spins, 1, 0) + np.roll(spins, -1, 0) + np.roll(spins, 1, 1) + np.roll(spins, -1, 1)
        delta_E = 2 * spins * fields
        flip_probabilities = 1 / (1 + np.exp(beta * delta_E))
        flips = np.random.random_sample(size=(self.L, self.L)) < flip_probabilities
        # Only update a site with probability 0.5
        flips = np.logical_and(flips, np.random.choice(a=[True, False], size=(self.L, self.L)))
        self.config = np.logical_xor(self.config, flips)
                
    def to_js(self):
        return to_js(self.config)
