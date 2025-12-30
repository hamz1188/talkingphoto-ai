import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GalleryState, GalleryActions, GalleryVideo } from '@/types';

const GALLERY_STORAGE_KEY = '@talkingphoto_gallery';

const initialState: GalleryState = {
  videos: [],
};

export const useGalleryStore = create<GalleryState & GalleryActions>((set, get) => ({
  ...initialState,

  addVideo: async (video) => {
    const newVideo: GalleryVideo = {
      ...video,
      id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };

    const updatedVideos = [newVideo, ...get().videos];
    set({ videos: updatedVideos });

    // Persist to storage
    try {
      await AsyncStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedVideos));
    } catch (error) {
      console.error('Failed to save gallery:', error);
    }
  },

  removeVideo: async (id) => {
    const updatedVideos = get().videos.filter((v) => v.id !== id);
    set({ videos: updatedVideos });

    // Persist to storage
    try {
      await AsyncStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedVideos));
    } catch (error) {
      console.error('Failed to save gallery:', error);
    }
  },

  clearGallery: async () => {
    set({ videos: [] });
    try {
      await AsyncStorage.removeItem(GALLERY_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear gallery:', error);
    }
  },

  loadGallery: async () => {
    try {
      const stored = await AsyncStorage.getItem(GALLERY_STORAGE_KEY);
      if (stored) {
        const videos = JSON.parse(stored) as GalleryVideo[];
        set({ videos });
      }
    } catch (error) {
      console.error('Failed to load gallery:', error);
    }
  },
}));
