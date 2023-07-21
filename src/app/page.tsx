"use client";
import axios from "axios";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const uploadFile = async (file: File | null) => {
    try {
      if (!file) {
        console.log('No file!')
        return;
      }

      const filename = encodeURIComponent(file.name);
      const fileType = encodeURIComponent(file.type);

      const res = await axios.get(`/api`, {
        params: {
          file: filename,
          fileType,
        },
      });

      const { url, fields } = await res.data;
      const formData = new FormData();

      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      console.log(res.data, url)

      const upload = await axios
        .post(url, formData)
        .then((res) => res)
        .catch((err) => err);

      if (upload.status === 204) {
        // 직전에 업로드한 file 위치
        setFileUrl(`${url}/files/${file.name}`);
        console.log("Uploaded successfully!");
      } else {
        alert("파일 용량 초과");
        console.error("Upload failed.");
      }
    } catch (error) {}
  };

  return (
    <main className={styles.main}>
      <h1>AWS S3 파일 업로드</h1>
      <div>
        <input onChange={onChangeFile} type="file" />
        <button onClick={() => uploadFile(file)}>저장!</button>
      </div>
      <div>
        <button onClick={() => download(fileUrl, file?.name)}>다운로드</button>
      </div>
    </main>
  );
}

const download = async (fileUrl: string, name:any) => {
  const response = await axios.get(fileUrl, { responseType: "blob" });
  const blob = response.data;
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", name || "파일명");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
