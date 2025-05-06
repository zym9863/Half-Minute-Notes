<script setup lang="ts">
import { ref } from 'vue';
import NoteInput from './components/NoteInput.vue';
import NoteList from './components/NoteList.vue';
import TagManager from './components/TagManager.vue';

const showTagManager = ref(false);

// 切换标签管理器显示状态
const toggleTagManager = () => {
  showTagManager.value = !showTagManager.value;
};
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="app-branding">
        <h1 class="app-title">半刻笔记</h1>
        <div class="app-subtitle">捕捉你的灵感瞬间</div>
      </div>
      <button 
        class="tag-manager-button" 
        :class="{ 'active': showTagManager }" 
        @click="toggleTagManager"
      >
        <span class="button-icon">{{ showTagManager ? '📝' : '🏷️' }}</span>
        <span class="button-text">{{ showTagManager ? '返回笔记' : '管理标签' }}</span>
      </button>
    </header>

    <main class="app-content">
      <transition name="fade" mode="out-in">
        <div v-if="!showTagManager" class="notes-view fade-in" key="notes">
          <NoteInput />
          <NoteList />
        </div>
        <div v-else class="tag-manager-view fade-in" key="tags">
          <TagManager />
        </div>
      </transition>
    </main>

    <footer class="app-footer">
      <p>半刻笔记 &copy; {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<style>
/* 全局样式已移至style.css */
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding: 0 var(--spacing-sm);
}

.app-branding {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.app-title {
  font-size: 2.4rem;
  font-weight: 700;
  margin: 0;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  position: relative;
}

.app-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 4px;
  background: var(--accent-gradient);
  border-radius: 2px;
}

.app-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.tag-manager-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background-color: var(--card-bg);
  color: var(--text-primary);
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 10px 18px;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.tag-manager-button:hover {
  background-color: var(--card-bg-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.tag-manager-button.active {
  background-image: var(--primary-gradient);
  color: white;
}

.button-icon {
  font-size: 1.2rem;
}

.app-content {
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.app-footer {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md) 0;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-tertiary);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 640px) {
  .app-container {
    padding: var(--spacing-md) var(--spacing-sm);
  }
  
  .app-title {
    font-size: 1.8rem;
  }
  
  .app-subtitle {
    font-size: 0.9rem;
  }
  
  .button-text {
    display: none;
  }
  
  .button-icon {
    font-size: 1.4rem;
    margin: 0;
  }
  
  .tag-manager-button {
    padding: 8px 10px;
  }
}
</style>
