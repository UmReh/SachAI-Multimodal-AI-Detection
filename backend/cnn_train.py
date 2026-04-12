import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt
from tensorflow.keras.callbacks import Callback

# Paths to dataset folders
base_dir = "dataset"
train_dir = os.path.join(base_dir, "train")
val_dir = os.path.join(base_dir, "validation")
test_dir = os.path.join(base_dir, "test")

# Image properties
img_height, img_width = 128, 128
batch_size = 32

# Data generators
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True
)

val_test_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(train_dir,
                                                    target_size=(img_height, img_width),
                                                    batch_size=batch_size,
                                                    class_mode='binary')

val_generator = val_test_datagen.flow_from_directory(val_dir,
                                                     target_size=(img_height, img_width),
                                                     batch_size=batch_size,
                                                     class_mode='binary')

test_generator = val_test_datagen.flow_from_directory(test_dir,
                                                      target_size=(img_height, img_width),
                                                      batch_size=batch_size,
                                                      class_mode='binary')

# Load the model
model = load_model("custom_cnn_model.h5")

# Recompile for fine-tuning
model.compile(optimizer=Adam(learning_rate=0.00005),
              loss='binary_crossentropy',
              metrics=['accuracy'])

# ✅ Callback to store history for plotting
class PlotProgressCallback(Callback):
    def __init__(self, save_dir="graphs"):
        super().__init__()
        self.save_dir = save_dir
        os.makedirs(self.save_dir, exist_ok=True)
        self.history = {
            'accuracy': [],
            'val_accuracy': [],
            'loss': [],
            'val_loss': []
        }

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        self.history['accuracy'].append(logs.get('accuracy'))
        self.history['val_accuracy'].append(logs.get('val_accuracy'))
        self.history['loss'].append(logs.get('loss'))
        self.history['val_loss'].append(logs.get('val_loss'))

# Instantiate callback
plot_callback = PlotProgressCallback()

# Train for more epochs
new_epochs = 10  # You can change this to more
history = model.fit(train_generator,
                    epochs=new_epochs,
                    validation_data=val_generator,
                    callbacks=[plot_callback])

# Evaluate on test set
test_loss, test_acc = model.evaluate(test_generator)
print(f"✅ Updated Test accuracy: {test_acc:.4f}")

# Save updated model
model.save("custom_cnn_model.h5")
print("✅ Updated model saved as custom_cnn_model.h5")

# ✅ Plot full session progress AFTER training ends
acc = plot_callback.history['accuracy']
val_acc = plot_callback.history['val_accuracy']
loss = plot_callback.history['loss']
val_loss = plot_callback.history['val_loss']
epochs_range = range(1, len(acc) + 1)

plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Train Accuracy')
plt.plot(epochs_range, val_acc, label='Val Accuracy')
plt.title('Training Accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Train Loss')
plt.plot(epochs_range, val_loss, label='Val Loss')
plt.title('Training Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.savefig("final_model_progress.png")
plt.show()

# ✅ Save individual graphs per epoch (optional)
for i in epochs_range:
    plt.figure(figsize=(12, 5))

    # Accuracy
    plt.subplot(1, 2, 1)
    plt.plot(epochs_range[:i], acc[:i], label='Train Accuracy')
    plt.plot(epochs_range[:i], val_acc[:i], label='Val Accuracy')
    plt.title(f'Accuracy up to Epoch {i}')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend()

    # Loss
    plt.subplot(1, 2, 2)
    plt.plot(epochs_range[:i], loss[:i], label='Train Loss')
    plt.plot(epochs_range[:i], val_loss[:i], label='Val Loss')
    plt.title(f'Loss up to Epoch {i}')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()

    plt.tight_layout()
    plt.savefig(f"graphs/epoch_{i}_progress.png")
    plt.close()
