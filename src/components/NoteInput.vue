<script setup lang="ts">
import { ref, computed } from 'vue';
import noteService from '../services/noteService';

const tags = computed(() => noteService.tags.value);
const noteContent = ref('');
const selectedTags = ref<string[]>([]);
const showTagSelector = ref(false);

// 切换标签选择
const toggleTag = (tagName: string) => {
  const index = selectedTags.value.indexOf(tagName);
  if (index === -1) {
    selectedTags.value.push(tagName);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

// 添加笔记
const addNote = () => {
  if (noteContent.value.trim()) {
    noteService.addNote(noteContent.value, selectedTags.value);
    noteContent.value = '';
    selectedTags.value = [];
    showTagSelector.value = false;
  }
};

// 快捷键处理
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl+Enter 提交笔记
  if (e.ctrlKey && e.key === 'Enter') {
    addNote();
  }
};
</script>

<template>
  <div class="note-input-container">
    <div class="input-area">
      <textarea 
        v-model="noteContent" 
        placeholder="写下你的想法..." 
        @keydown="handleKeydown"
        class="note-textarea"
      ></textarea>
      
      <div class="input-actions">
        <button 
          class="tag-button" 
          @click="showTagSelector = !showTagSelector"
          :class="{ active: showTagSelector }"
        >
          <span class="tag-icon">#</span>
        </button>
        
        <button 
          class="submit-button" 
          @click="addNote"
          :disabled="!noteContent.trim()"
        >
          记录
        </button>
      </div>
    </div>
    
    <div v-if="showTagSelector" class="tag-selector">
      <div 
        v-for="tag in tags" 
        :key="tag.name"
        class="tag-item"
        :style="{ backgroundColor: selectedTags.includes(tag.name) ? tag.color : 'transparent' }"
        @click="toggleTag(tag.name)"
      >
        {{ tag.name }}
      </div>
    </div>
    
    <div v-if="selectedTags.length > 0" class="selected-tags">
      <div 
        v-for="tagName in selectedTags" 
        :key="tagName"
        class="selected-tag"
        :style="{ backgroundColor: tags.find(t => t.name === tagName)?.color }"
      >
        {{ tagName }}
        <span class="remove-tag" @click.stop="toggleTag(tagName)">×</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-input-container {
  width: 100%;
  margin: 0 auto;
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.note-input-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--primary-gradient);
}

.input-area {
  display: flex;
  flex-direction: column;
}

.note-textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--spacing-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: var(--spacing-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.note-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(124, 142, 255, 0.25);
  outline: none;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-button, .submit-button {
  padding: 10px 18px;
  border-radius: var(--border-radius-sm);
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tag-button {
  background-color: var(--card-bg-hover);
  color: var(--text-secondary);
}

.tag-button.active {
  background-color: var(--primary-dark);
  color: white;
}

.tag-icon {
  font-size: 18px;
  font-weight: bold;
}

.submit-button {
  background-image: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-sm);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.submit-button:active {
  transform: translateY(0);
}

.submit-button:disabled {
  background-image: none;
  background-color: var(--card-bg-hover);
  color: var(--text-tertiary);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm);
  background-color: var(--card-bg-hover);
  border-radius: var(--border-radius-sm);
  animation: fadeIn 0.3s ease;
}

.tag-item {
  padding: 6px 12px;
  border-radius: var(--border-radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.tag-item:hover {
  border-color: var(--primary-color);
  background-color: rgba(124, 142, 255, 0.1);
  transform: translateY(-1px);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  animation: fadeIn 0.3s ease;
}

.selected-tag {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: var(--border-radius-xl);
  color: white;
  font-size: 0.9rem;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.selected-tag:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.remove-tag {
  margin-left: var(--spacing-xs);
  font-size: 16px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}

.remove-tag:hover {
  opacity: 1;
}
</style>
