import React, { useState, useContext, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ThemeContext } from '../utils/ThemeContext';
import GameButton from '../components/ui/GameButton';
import CustomGameListModal from '../components/CustomGameListModal';
import { saveCustomGame } from '../utils/customGameStorage';

const CustomGameScreen = ({ navigation, route }) => {
  const { theme, hapticsEnabled } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [images, setImages] = useState({});
  const [saving, setSaving] = useState(false);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    // If we're passing a game to edit via route params
    if (route.params?.editGame) {
      loadGameForEdit(route.params.editGame);
    }
  }, [route.params?.editGame]);

  const loadGameForEdit = (game) => {
    setEditId(game.id);
    setName(game.name || '');
    setImages(game.images || {});
    setListModalVisible(false); // Make sure modal closes if loaded from it
  };

  const handlePickImage = async (digit) => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
      maxWidth: 300,
      maxHeight: 300,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to pick image.');
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setImages(prev => ({ ...prev, [digit]: uri }));
    }
  };

  const clearImage = (digit) => {
    setImages(prev => {
      const updated = { ...prev };
      delete updated[digit];
      return updated;
    });
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for your custom game.');
      return;
    }

    if (Object.keys(images).length === 0) {
      Alert.alert('Missing Images', 'Please upload at least one image.');
      return;
    }

    try {
      setSaving(true);
      await saveCustomGame({
        id: editId,
        name: name.trim(),
        images,
      });
      
      Alert.alert('Success', 'Custom game saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save custom game.');
    } finally {
      setSaving(false);
    }
  };

  const renderDigitBox = (digit) => {
    const hasImage = !!images[digit];

    return (
      <View key={`digit-${digit}`} style={styles.digitContainer}>
        <Text style={[styles.digitLabel, { color: theme.text }]}>Digit {digit}</Text>
        <TouchableOpacity 
          style={[
            styles.imageBox, 
            { 
              backgroundColor: theme.cellBackground, 
              borderColor: theme.borderStrong 
            }
          ]}
          onPress={() => handlePickImage(digit)}
        >
          {hasImage ? (
            <Image source={{ uri: images[digit] }} style={styles.image} />
          ) : (
            <Text style={[styles.placeholderText, { color: theme.subText }]}>+</Text>
          )}
        </TouchableOpacity>
        
        {hasImage && (
          <TouchableOpacity 
            style={[styles.removeBtn, { backgroundColor: theme.danger }]}
            onPress={() => clearImage(digit)}
          >
            <Text style={styles.removeBtnText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {editId ? 'Edit Game' : 'Create Game'}
        </Text>
        
        <TouchableOpacity 
          style={styles.listBtn} 
          onPress={() => setListModalVisible(true)}
        >
          <Text style={[styles.listBtnText, { color: theme.primary }]}>📄 List</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Game Name</Text>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: theme.cardAlt, 
              color: theme.text,
              borderColor: theme.border
            }
          ]}
          placeholder="E.g., My Family, Cool Cars..."
          placeholderTextColor={theme.subText}
          value={name}
          onChangeText={setName}
          maxLength={30}
        />

        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>
          Number Images
        </Text>
        <Text style={[styles.helperText, { color: theme.subText }]}>
          Upload pictures to replace the numbers on the Sudoku board.
        </Text>

        <View style={styles.gridContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderDigitBox)}
        </View>

        <GameButton
          title={saving ? "Saving..." : "Save Custom Game"}
          onPress={handleSave}
          disabled={saving}
          style={styles.saveBtn}
        />
      </ScrollView>

      <CustomGameListModal 
        visible={listModalVisible} 
        onClose={() => setListModalVisible(false)}
        onEdit={(game) => loadGameForEdit(game)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60, // Adjust for status bar
    paddingBottom: 20,
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  listBtn: {
    padding: 8,
  },
  listBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 30,
  },
  digitContainer: {
    width: '30%',
    alignItems: 'center',
    position: 'relative',
  },
  digitLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 20,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  removeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 16,
  },
  saveBtn: {
    marginTop: 10,
  },
});

export default CustomGameScreen;
