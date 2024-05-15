const progressBar = document.getElementById('progress-bar');
const encodedUrls = [
  'aHR0cHM6Ly9meWxpbmsubGluay8jL2xvZ2lu',
  'aHR0cHM6Ly9meWxpbmsudGVjaC8jL2xvZ2lu'
];
let redirectionUrl = '';

const defaultUrl = 'aHR0cHM6Ly9meWxpbmsubGluay8jL2xvZ2lu'; 

let progress = 0;
let firstTryCompleted = false;

const checkUrl = (url) => {
  fetch(url, { mode: 'no-cors' })
    .then(() => {
      if (redirectionUrl === '') {
        redirectionUrl = url;
      }
    })
    .catch(error => {
      console.error(`Error fetching ${url}:`, error);
    });
};

encodedUrls.forEach(encodedUrl => {
  const url = atob(encodedUrl);
  checkUrl(url);
});

const progressInterval = setInterval(() => {
  progress += 1;

  if (progress >= 100) {
    clearInterval(progressInterval);
    progress = 0; // 重置进度条
    if (redirectionUrl !== '') {
      window.location.href = redirectionUrl;
    } else if (!firstTryCompleted){
      firstTryCompleted = true; // 标记第一次尝试已完成，准备进行第二次尝试
      progressBar.style.backgroundColor = 'red'; // 进度条颜色变为红色
      // 第二次尝试
      const secondTry = setInterval(() => {
        progress += 1;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
          clearInterval(secondTry);
          // 如果在第二次尝试结束后仍然没有可以用于重定向的URL，就进行跳转到默认url
          if (redirectionUrl === '') {
            window.location.href = atob(defaultUrl);
          }
        }
      }, 20);
    }
  }
}, 20);