type DownloadFunction = (fileContent: string) => void;

const downloadFile = (url: string, downloadFunction: DownloadFunction) => {
  setTimeout(() => {
    const fileContent = `Downloaded data from ${url}`;
    downloadFunction(fileContent);
  }, 2000);
};

const downloadFunction = (fileContent: string) => {
  console.log(fileContent);
};

downloadFile("http://example.com/file.txt", downloadFunction);
