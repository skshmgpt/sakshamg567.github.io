import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Saksham Gupta - Full Stack Developer & CS Undergrad";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#000",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#fff",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Saksham Gupta
          </h1>
          <p
            style={{
              fontSize: "32px",
              color: "#a1a1aa",
              margin: 0,
            }}
          >
            @skshmgpt
          </p>
          <p
            style={{
              fontSize: "28px",
              color: "#fbbf24",
              margin: 0,
              marginTop: "20px",
            }}
          >
            Full Stack Developer · CS Undergrad
          </p>
          <p
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              margin: 0,
              marginTop: "10px",
              maxWidth: "900px",
            }}
          >
            Backend · Distributed Systems · Networking · Infrastructure
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
