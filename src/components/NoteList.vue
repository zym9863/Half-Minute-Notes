<script setup lang="ts">
import { ref, computed } from 'vue';
import noteService from '../services/noteService';

const tags = computed(() => noteService.tags.value);
// 筛选状态
const selectedFilter = ref<string>('');

// 根据筛选条件过滤笔记
const filteredNotes = computed(() => {
  if (!selectedFilter.value) {
    return noteService.notes.value;
  }
  
  return noteService.notes.value.filter(note => 
    note.tags.includes(selectedFilter.value)
  );
});

// 格式化日期
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 删除笔记
const removeNote = (id: string) => {
  if (confirm('确定要删除这条笔记吗？')) {
    noteService.deleteNote(id);
  }
};
</script>

<template>
  <div class="note-list-container">
    <div class="filter-bar">
      <div 
        class="filter-item" 
        :class="{ active: selectedFilter === '' }"
        @click="selectedFilter = ''"
      >
        全部
      </div>
      <div 
        v-for="tag in tags" 
        :key="tag.name"
        class="filter-item"
        :class="{ active: selectedFilter === tag.name }"
        :style="{ borderColor: tag.color }"
        @click="selectedFilter = tag.name"
      >
        {{ tag.name }}
      </div>
    </div>
    
    <div class="notes-container">
      <div v-if="filteredNotes.length === 0" class="empty-state">
        <p>暂无笔记</p>
        <p v-if="selectedFilter">尝试选择其他标签或创建新笔记</p>
      </div>
      
      <div 
        v-for="note in filteredNotes" 
        :key="note.id"
        class="note-card"
      >
        <div class="note-content">{{ note.content }}</div>
        
        <div class="note-footer">
          <div class="note-tags">
            <span 
              v-for="tagName in note.tags" 
              :key="tagName"
              class="note-tag"
              :style="{ backgroundColor: tags.find(t => t.name === tagName)?.color }"
            >
              {{ tagName }}
            </span>
          </div>
          
          <div class="note-meta">
            <span class="note-time">{{ formatDate(note.createdAt) }}</span>
            <button class="delete-button" @click="removeNote(note.id)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-list-container {
  width: 100%;
  margin: var(--spacing-lg) auto 0;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding: 0 var(--spacing-sm);
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--bg-color);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  backdrop-filter: blur(8px);
}

.filter-item {
  padding: 8px 16px;
  border-radius: var(--border-radius-xl);
  border: 2px solid transparent;
  background-color: var(--card-bg);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 0.9rem;
  box-shadow: var(--shadow-sm);
}

.filter-item:hover {
  background-color: var(--card-bg-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.filter-item.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: 500;
  box-shadow: var(--shadow-md);
}

.notes-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.note-card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  border-left: 4px solid transparent;
  animation: fadeIn 0.4s ease;
}

.note-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  background-color: var(--card-bg-hover);
  border-left-color: var(--primary-color);
}

.note-content {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  white-space: pre-wrap;
  color: var(--text-primary);
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.note-tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: var(--border-radius-xl);
  color: white;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.note-tag:hover {
  transform: translateY(-1px);
}

.note-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.note-time {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
}

.note-time::before {
  content: '🕒';
  margin-right: 4px;
  font-size: 0.9rem;
}

.delete-button {
  background-color: transparent;
  color: var(--error-color);
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 4px;
}

.delete-button::before {
  content: '🗑️';
  font-size: 0.9rem;
}

.delete-button:hover {
  background-color: rgba(248, 113, 113, 0.1);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--text-tertiary);
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.empty-state p:first-child {
  font-size: 1.2rem;
  margin-bottom: var(--spacing-md);
}

.empty-state p:first-child::before {
  content: '📝';
  font-size: 2rem;
  display: block;
  margin-bottom: var(--spacing-md);
}
</style>
