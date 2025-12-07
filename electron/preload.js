// preload.js
import { contextBridge } from 'electron';

// 在渲染进程和主进程之间安全地传递 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 在这里可以添加需要在渲染进程中使用的 API
});