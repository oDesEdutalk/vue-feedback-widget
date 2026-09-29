<template>
  <div class="demo-container">
    <header class="demo-header">
      <h1>Vue Feedback Widget Playground</h1>
      <p>Trang thử nghiệm & xem trước widget phản hồi, báo lỗi và chụp ảnh màn hình.</p>
    </header>

    <main class="demo-content">
      <div class="card">
        <h2>Trạng thái & Hướng dẫn</h2>
        <p>
          Widget nút tròn nổi (Floating Button) đã được kích hoạt ở góc dưới màn hình.
          Bạn có thể bấm vào nút đó để mở modal báo lỗi / góp ý.
        </p>
        <div class="actions">
          <button class="btn btn-primary" @click="openWidget('bug')">
            Mở Báo Lỗi (Bug Report)
          </button>
          <button class="btn btn-secondary" @click="openWidget('feedback')">
            Mở Góp Ý (Feedback)
          </button>
          <button class="btn btn-info" @click="openWidget('idea')">
            Mở Ý Tưởng (Idea)
          </button>
        </div>
      </div>

      <div class="card">
        <h2>Khu vực Test giao diện & Chụp ảnh</h2>
        <p>Hãy thử tương tác với các thành phần bên dưới rồi chụp ảnh màn hình phản hồi:</p>
        <div class="sample-box">
          <div class="box-item box-blue">Khối 1: Thông tin hệ thống</div>
          <div class="box-item box-green">Khối 2: Trạng thái kết nối OK</div>
          <div class="box-item box-amber">Khối 3: Cảnh báo thử nghiệm</div>
        </div>
      </div>
    </main>

    <!-- Floating Widget Component -->
    <FeedbackFloatingButton />
  </div>
</template>

<script setup lang="ts">
import { FeedbackFloatingButton, useFeedback } from '../src/index'
import type { FeedbackType } from '../src/types'

const { openModal } = useFeedback()

const openWidget = (type: FeedbackType) => {
  openModal(type)
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  min-height: 100vh;
}

.demo-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 32px;
}

.demo-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.demo-header p {
  color: #64748b;
  font-size: 16px;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.card h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1e293b;
}

.card p {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #ef4444;
  color: white;
}
.btn-primary:hover {
  background-color: #dc2626;
}

.btn-secondary {
  background-color: #3b82f6;
  color: white;
}
.btn-secondary:hover {
  background-color: #2563eb;
}

.btn-info {
  background-color: #10b981;
  color: white;
}
.btn-info:hover {
  background-color: #059669;
}

.sample-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.box-item {
  padding: 20px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
}

.box-blue {
  background-color: #dbeafe;
  color: #1e40af;
}

.box-green {
  background-color: #dcfce7;
  color: #166534;
}

.box-amber {
  background-color: #fef3c7;
  color: #92400e;
}
</style>
