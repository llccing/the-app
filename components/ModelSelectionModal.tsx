import { Button, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface ModelOption {
  id: string;
  name: string;
}

interface ModelSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  models: ModelOption[];
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

export function ModelSelectionModal({
  isVisible,
  onClose,
  models,
  selectedModel,
  onSelectModel,
}: ModelSelectionModalProps) {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Select Model</ThemedText>
          <View style={styles.modelList}>
            {models.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.modelItem,
                  selectedModel === item.id && styles.selectedModel
                ]}
                onPress={() => {
                  onSelectModel(item.id);
                  onClose();
                }}
              >
                <ThemedText style={styles.modelText}>{item.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modelList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modelItem: {
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedModel: {
    backgroundColor: '#2196f3',
  },
  modelText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 