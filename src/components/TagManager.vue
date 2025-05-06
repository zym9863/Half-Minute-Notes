<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import noteService from '../services/noteService';

const tags = computed(() => noteService.tags.value);
const newTagName = ref('');
const newTagColor = ref('#' + Math.floor(Math.random()*16777215).toString(16));
const showTagForm = ref(false);
const isEditing = ref(false);
const editingTag = ref<{name: string, color: string} | null>(null);
const tagFormTitle = computed(() => isEditing.value ? '编辑标签' : '添加标签');
const formButtonText = computed(() => isEditing.value ? '保存' : '添加');

// 生成更好看的随机颜色
const generateRandomColor = () => {
  // 使用更饱和的颜色
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 20) + 50; // 50-70%
  newTagColor.value = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// 添加或更新标签
const addOrUpdateTag = () => {
  if (newTagName.value.trim()) {
    if (isEditing.value && editingTag.value) {
      // 更新标签
      noteService.updateTag(editingTag.value.name, newTagName.value.trim(), newTagColor.value);
    } else {
      // 添加新标签
      noteService.addTag(newTagName.value.trim(), newTagColor.value);
    }
    resetForm();
  }
};

// 开始编辑标签
const startEditTag = (tag: {name: string, color: string}) => {
  isEditing.value = true;
  editingTag.value = tag;
  newTagName.value = tag.name;
  newTagColor.value = tag.color;
  showTagForm.value = true;
};

// 重置表单
const resetForm = () => {
  newTagName.value = '';
  newTagColor.value = '#' + Math.floor(Math.random()*16777215).toString(16);
  showTagForm.value = false;
  isEditing.value = false;
  editingTag.value = null;
};

// 取消编辑
const cancelEdit = () => {
  resetForm();
};

// 删除标签
const removeTag = (tagName: string) => {
  if (confirm(`确定要删除标签 "${tagName}" 吗？这将从所有笔记中移除该标签。`)) {
    noteService.deleteTag(tagName);
    // 如果正在编辑被删除的标签，重置表单
    if (isEditing.value && editingTag.value?.name === tagName) {
      resetForm();
    }
  }
};

// 计算每个标签的使用次数
const tagUsage = computed(() => {
  const usage: Record<string, number> = {};
  
  // 初始化所有标签的使用次数为0
  tags.value.forEach(tag => {
    usage[tag.name] = 0;
  });
  
  // 统计每个标签的使用次数
  noteService.notes.value.forEach(note => {
    note.tags.forEach(tagName => {
      if (usage[tagName] !== undefined) {
        usage[tagName]++;
      }
    });
  });
  
  return usage;
});

// 在组件挂载时生成一个好看的随机颜色
onMounted(() => {
  generateRandomColor();
});
</script>

<template>
  <div class="tag-manager">
    <div class="tag-manager-header">
      <h3>标签管理</h3>
      <button 
        v-if="!showTagForm" 
        class="add-tag-button" 
        @click="showTagForm = true"
      >
        添加标签
      </button>
    </div>
    
    <div v-if="showTagForm" class="tag-form">
      <div class="form-header">
        <h4>{{ tagFormTitle }}</h4>
        <button class="close-button" @click="cancelEdit">×</button>
      </div>
      
      <div class="form-group">
        <input 
          v-model="newTagName" 
          type="text" 
          placeholder="标签名称" 
          class="tag-input"
          ref="tagNameInput"
          @keyup.enter="addOrUpdateTag"
        />
        <div class="color-picker">
          <input 
            v-model="newTagColor" 
            type="color" 
            class="color-input"
          />
          <button 
            class="random-color-button" 
            @click="generateRandomColor"
            title="生成随机颜色"
          >
            🔄
          </button>
        </div>
      </div>
      
      <div class="tag-preview">
        <span>预览效果：</span>
        <div class="preview-tag" :style="{ backgroundColor: newTagColor }">
          {{ newTagName || '标签名称' }}
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          class="cancel-button" 
          @click="cancelEdit"
        >
          取消
        </button>
        <button 
          class="submit-button" 
          @click="addOrUpdateTag"
          :disabled="!newTagName.trim()"
        >
          {{ formButtonText }}
        </button>
      </div>
    </div>
    
    <div v-if="!showTagForm && tags.length === 0" class="empty-state">
      <div class="empty-icon">🏷️</div>
      <p>暂无标签，点击"添加标签"创建您的第一个标签</p>
    </div>
    
    <div v-else-if="!showTagForm" class="tags-list">
      <div 
        v-for="tag in tags" 
        :key="tag.name"
        class="tag-item"
      >
        <div class="tag-info">
          <span 
            class="tag-color" 
            :style="{ backgroundColor: tag.color }"
          ></span>
          <div class="tag-details">
            <span class="tag-name">{{ tag.name }}</span>
            <span class="tag-usage">{{ tagUsage[tag.name] || 0 }} 条笔记使用</span>
          </div>
        </div>
        <div class="tag-actions">
          <button 
            class="edit-tag-button" 
            @click="startEditTag(tag)"
            title="编辑标签"
          >
            ✏️
          </button>
          <button 
            class="delete-tag-button" 
            @click="removeTag(tag.name)"
            title="删除标签"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.tag-manager {
  width: 100%;
  margin: 0 auto;
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  animation: fadeIn 0.4s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tag-manager:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.tag-manager::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--accent-gradient);
}

.tag-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tag-manager-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.tag-manager-header h3::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 30px;
  height: 3px;
  background: var(--accent-gradient);
  border-radius: 2px;
}

.add-tag-button {
  background-image: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  position: relative;
  overflow: hidden;
}

.add-tag-button::before {
  content: '+';
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 2px;
  transition: transform 0.3s ease;
}

.add-tag-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.add-tag-button:hover::before {
  animation: pulse 0.6s ease infinite;
}

.add-tag-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.add-tag-button:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

.tag-form {
  background-color: var(--card-bg-hover);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  border-left: 3px solid var(--primary-color);
  animation: slideIn 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tag-form::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30%;
  height: 3px;
  background: linear-gradient(to right, transparent, var(--primary-color));
  border-radius: 3px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.form-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-button {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.tag-preview {
  margin: var(--spacing-sm) 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.preview-tag {
  padding: 4px 10px;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  display: inline-block;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  animation: pulse 2s infinite;
  font-weight: 500;
}

.form-group {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.tag-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: var(--input-bg);
  color: var(--text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.tag-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(124, 142, 255, 0.25);
  outline: none;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.color-input {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  background-color: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 0 0 0 rgba(124, 142, 255, 0);
}

.color-input:hover, .color-input:focus {
  border-color: var(--primary-color);
  transform: scale(1.05);
  box-shadow: 0 0 0 4px rgba(124, 142, 255, 0.15);
}

.random-color-button {
  background-color: var(--card-bg-hover);
  color: var(--text-primary);
  border: none;
  border-radius: var(--border-radius-sm);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.random-color-button:hover {
  background-color: var(--card-bg);
  transform: rotate(180deg);
  box-shadow: var(--shadow-md);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button, .submit-button {
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.cancel-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.cancel-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
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

.submit-button:disabled {
  background-image: none;
  background-color: #444;
  color: #777;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: var(--spacing-md);
}

.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.4s ease;
}

.tag-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.tag-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tag-color {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-block;
  transition: transform var(--transition-fast);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.tag-item:hover .tag-color {
  transform: scale(1.2);
}

.tag-name {
  font-size: 1rem;
  font-weight: 500;
  transition: transform var(--transition-fast);
}

.tag-item:hover .tag-name {
  transform: translateX(4px);
}

.delete-tag-button {
  background-color: transparent;
  color: #ff4757;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  opacity: 0.7;
}

.delete-tag-button:hover {
  background-color: rgba(255, 71, 87, 0.1);
  color: #ff6b7a;
  opacity: 1;
}

@media (max-width: 768px) {
  .tag-manager {
    padding: var(--spacing-sm);
  }
  
  .tag-item {
    padding: 8px 12px;
  }
  
  .tag-color {
    width: 16px;
    height: 16px;
  }
  
  .tag-name {
    font-size: 0.9rem;
  }
}
</style>
