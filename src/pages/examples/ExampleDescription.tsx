import { CSSProperties } from "react";

export const ExampleDescription = ({ children }: any) => (
  <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
    <div
      style={{
        maxWidth: 600,
        backgroundColor: "#f2f2f2",
        padding: "0px 20px 10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#333",
      }}
    >
      {children}
    </div>
  </div>
);

export const descriptionButtonStyle: CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#f5f5f5",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  color: "#333",
};
