import { APIService } from './axios';

export const getImages = async () => {
  try {
    const res = await APIService.public.get('/images');
    return res.data;
  } catch (err) {
    console.error('카테고리 조회 실패:', err);
    throw err;
  }
};
