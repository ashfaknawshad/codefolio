const repoHeader = document.querySelector('.gh-header-actions');

if (repoHeader) {
  const addToResumeButton = document.createElement('button');
  addToResumeButton.innerText = 'Add to Resume';
  addToResumeButton.className = 'btn ml-2';
  
  addToResumeButton.addEventListener('click', () => {
    const repoName = window.location.pathname.split('/').slice(1, 3).join('/');
    chrome.runtime.sendMessage({ type: 'ADD_PROJECT', payload: { repoName } });
  });

  repoHeader.prepend(addToResumeButton);
}