import React from "react";

type ErrorPageProps = {
  title: string;
  message: string;
};

const ErrorPage = ({ title, message }: ErrorPageProps) => {
  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1 style={{ fontSize: "2rem", color: "#ff4c4c" }}>{title}</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>{message}</p>
      <a href="/" style={{ marginTop: "2rem", display: "inline-block" }}>
        메인 페이지로 돌아가기
      </a>
    </div>
  );
};

export default ErrorPage;