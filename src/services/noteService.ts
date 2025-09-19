import { ref, watch } from 'vue';
import type { Note, Tag } from '../types';

// 默认标签
const defaultTags: Tag[] = [
  { name: '工作', color: '#4CAF50' },
  { name: '生活', color: '#2196F3' },
  { name: '心情', color: '#FF9800' },
  { name: '灵感', color: '#9C27B0' },
];

// 初始化状态
const notes = ref<Note[]>([]);
const tags = ref<Tag[]>(defaultTags);

// 从本地存储加载数据
const loadFromLocalStorage = () => {
  const savedNotes = localStorage.getItem('half-minute-notes');
  const savedTags = localStorage.getItem('half-minute-tags');
  
  if (savedNotes) {
    notes.value = JSON.parse(savedNotes);
  }
  
  if (savedTags) {
    tags.value = JSON.parse(savedTags);
  } else {
    tags.value = defaultTags;
  }
};

// 保存到本地存储
const saveToLocalStorage = () => {
  localStorage.setItem('half-minute-notes', JSON.stringify(notes.value));
  localStorage.setItem('half-minute-tags', JSON.stringify(tags.value));
};

// 监听数据变化，自动保存
watch(notes, saveToLocalStorage, { deep: true });
watch(tags, saveToLocalStorage, { deep: true });

// 添加笔记
const addNote = (content: string, selectedTags: string[] = []) => {
  const newNote: Note = {
    id: Date.now().toString(),
    content,
    tags: selectedTags,
    createdAt: Date.now(),
  };
  
  notes.value.unshift(newNote); // 添加到列表开头
  return newNote;
};

// 删除笔记
const deleteNote = (id: string) => {
  const index = notes.value.findIndex(note => note.id === id);
  if (index !== -1) {
    notes.value.splice(index, 1);
  }
};

// 添加标签
const addTag = (name: string, color: string = '#' + Math.floor(Math.random()*16777215).toString(16)) => {
  // 检查标签是否已存在
  if (!tags.value.some(tag => tag.name === name)) {
    tags.value.push({ name, color });
  }
};

// 删除标签
const deleteTag = (name: string) => {
  const index = tags.value.findIndex(tag => tag.name === name);
  if (index !== -1) {
    tags.value.splice(index, 1);
    
    // 从所有笔记中移除该标签
    notes.value.forEach(note => {
      note.tags = note.tags.filter(tag => tag !== name);
    });
  }
};

// 更新标签
const updateTag = (oldName: string, newName: string, newColor: string) => {
  const tagIndex = tags.value.findIndex(tag => tag.name === oldName);
  if (tagIndex !== -1) {
    tags.value[tagIndex].name = newName;
    tags.value[tagIndex].color = newColor;
    
    // 更新所有笔记中的标签名称
    notes.value.forEach(note => {
      note.tags = note.tags.map(tag => tag === oldName ? newName : tag);
    });
  }
};

// 初始化
loadFromLocalStorage();

export default {
  notes,
  tags,
  addNote,
  deleteNote,
  addTag,
  deleteTag,
  updateTag,
};