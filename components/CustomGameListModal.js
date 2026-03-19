import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemeContext } from '../utils/ThemeContext';
import GameButton from './ui/GameButton';
import { getCustomGames, deleteCustomGame } from '../utils/customGameStorage';

const CustomGameListModal = ({ visible, onClose, onEdit }) => {
  const { theme } = useContext(ThemeContext);
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (visible) {
      loadGames();
    }
  }, [visible]);

  const loadGames = async () => {
    const loaded = await getCustomGames();
    setGames(loaded);
  };

  const handleDelete = async (id) => {
    await deleteCustomGame(id);
    loadGames();
  };

  const renderItem = ({ item }) => {
    // Determine preview image (fallback to digit 1, then placeholder)
    const preview = item.images && item.images['1'] ? { uri: item.images['1'] } : null;

    return (
      <View style={[styles.gameCard, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          {preview ? (
            <Image source={preview} style={styles.previewImage} resizeMode="contain" />
          ) : (
            <View style={[styles.previewPlaceholder, { backgroundColor: theme.cellBackground }]}>
              <Text style={{ color: theme.text }}>Img 1</Text>
            </View>
          )}
          <Text style={[styles.gameName, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.primary }]} 
            onPress={() => onEdit(item)}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.danger }]} 
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: theme.modalBackdrop }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Your Custom Games</Text>
          
          {games.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={[styles.emptyText, { color: theme.subText }]}>
                No custom games found. Create one to see it here!
              </Text>
            </View>
          ) : (
            <FlatList
              data={games}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
            />
          )}

          <GameButton
            title="Close"
            variant="secondary"
            onPress={onClose}
            style={styles.closeBtn}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  previewImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  previewPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: 16,
  },
});

export default CustomGameListModal;
