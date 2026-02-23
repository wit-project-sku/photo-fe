import { useEffect, useState } from 'react';
import styles from './PhotoPage.module.css';
import { getImages } from '@apis/imageApi';
import logo from '@assets/images/logo.png';

function PhotoPage() {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let urlFromQuery = params.get('imageUrl');

    // 1️⃣ URL로 전달된 imageUrl이 있으면
    if (urlFromQuery) {
      try {
        urlFromQuery = decodeURIComponent(urlFromQuery);
      } catch (e) {
        console.warn('decode 실패, 원본 URL 사용', e);
      }

      // 🔥 localStorage 저장
      localStorage.setItem('imageUrl', urlFromQuery);
      setImageUrl(urlFromQuery);

      // 🔥 URL에서 query 제거 (주소창 깨끗하게)
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // 2️⃣ localStorage에 저장된 값 사용
    const storedImage = localStorage.getItem('imageUrl');
    if (storedImage) {
      console.log('load image from localStorage');
      setImageUrl(storedImage);
      return;
    }

    // 3️⃣ fallback: API 호출
    const fetchImages = async () => {
      try {
        const data = await getImages();
        setImageUrl(data.data[0].imageUrl);
      } catch (err) {
        console.error(err);
      }
    };

    fetchImages();
  }, []);

  const handleSavePhoto = async () => {
    if (!imageUrl) return;

    try {
      // 모바일 Safari/Chrome 대응 다운로드 방식
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'photo.png';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('사진 저장 실패:', err);
      // fallback: 새 탭으로 열기 (사용자가 직접 저장 가능)
      window.open(imageUrl, '_blank');
    }
  };

  const handleCreateGoods = () => {
    window.open('https://www.insarang.kr/', '_blank');
  };

  return (
    <div className={styles.container}>
      {imageUrl && <img src={imageUrl} className={styles.photo} />}

      <div className={styles.buttonArea}>
        <button className={styles.saveBtn} onClick={handleSavePhoto}>
          사진 저장하기
          <span>&lt;SAVE PHOTO&gt;</span>
        </button>

        <button className={styles.goodsBtn} onClick={handleCreateGoods}>
          굿즈 만들기
          <span>&lt;WITH GOODS&gt;</span>
        </button>
      </div>

      <div className={styles.description}>
        <p>• 사진 저장하기 버튼을 먼저 눌러서 사진을 핸드폰에 저장하세요</p>
        <p>• 굿즈만들기 버튼을 누르시면 저장된 사진으로 굿즈를 만들 수 있어요</p>
        <p>• Save your photo to your phone first by tapping 'Save Photo'.</p>
        <p>• Then, tap 'Create Goods' to start making your own merch!</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerBrand}>
          <img src={logo} alt='WIT Logo' className={styles.logo} />
          <span>WIT Ai Smart‑Tourism Hardware Platform</span>
        </div>
        <div className={styles.website}>www.witworldwide.com</div>
      </div>
    </div>
  );
}

export default PhotoPage;
