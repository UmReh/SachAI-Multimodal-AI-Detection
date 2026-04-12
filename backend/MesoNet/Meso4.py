import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, BatchNormalization, Dropout

class Meso4:
    def __init__(self, learning_rate=0.001):
        self.model = Sequential()

        self.model.add(Conv2D(8, (3, 3), padding='same', activation='relu', input_shape=(256, 256, 3)))
        self.model.add(BatchNormalization())
        self.model.add(MaxPooling2D(pool_size=(2, 2), padding='same'))

        self.model.add(Conv2D(8, (5, 5), padding='same', activation='relu'))
        self.model.add(BatchNormalization())
        self.model.add(MaxPooling2D(pool_size=(2, 2), padding='same'))

        self.model.add(Conv2D(16, (5, 5), padding='same', activation='relu'))
        self.model.add(BatchNormalization())
        self.model.add(MaxPooling2D(pool_size=(2, 2), padding='same'))

        self.model.add(Conv2D(16, (5, 5), padding='same', activation='relu'))
        self.model.add(BatchNormalization())
        self.model.add(MaxPooling2D(pool_size=(4, 4), padding='same'))

        self.model.add(Flatten())

        self.model.add(Dense(16))
        self.model.add(Dropout(0.5))
        self.model.add(Dense(1, activation='sigmoid'))

        self.model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
                           loss='mean_squared_error',
                           metrics=['accuracy'])

    def load(self, weight_path):
        self.model.load_weights(weight_path)

    def predict(self, x):
        return self.model.predict(x)
