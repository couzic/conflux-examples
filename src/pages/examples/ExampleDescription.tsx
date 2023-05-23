import { FC } from "react";

export const ExampleDescription = ({ children }: any) => (
  <div
    style={{
      width: "50vw",
      maxWidth: 800,
      backgroundColor: "#f2f2f2",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#333",
    }}
  >
    {children}
  </div>
);
