import axios from 'axios';

// 이미지 API 전용 BASE URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios 인스턴스
const imageApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 항상 res.data 만 반환하도록 처리
const unwrap = (promise) => promise.then((res) => res.data);

/**
 * 이미지 API 전용 서비스
 * 사용 예시:
 * APIService.get('/images')
 */
export const APIService = {
  get: (url, config = {}) => unwrap(imageApi.get(url, config)),
  post: (url, data = {}, config = {}) => unwrap(imageApi.post(url, data, config)),
  put: (url, data = {}, config = {}) => unwrap(imageApi.put(url, data, config)),
  delete: (url, config = {}) => unwrap(imageApi.delete(url, config)),
};

export default imageApi;
