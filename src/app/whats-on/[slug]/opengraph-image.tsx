import { ImageResponse } from "next/og";
import { api } from "@/lib/api";
import { scheduleLabel } from "@/lib/events";
import { eventPriceHeadline } from "@/lib/event-price";
import { absoluteUrl } from "@/lib/share";

export const runtime = "nodejs";
export const alt = "Blue Top Villa event";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function resolvePhoto(src: string | null) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return absoluteUrl(src);
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event, property] = await Promise.all([api.event(slug), api.property()]);
  const schedule = scheduleLabel(event, property.timezone);
  const price = eventPriceHeadline(event, property.currency);
  const photoSrc = resolvePhoto(event.imageUrl);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#161410",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {photoSrc ? (
          <img
            src={photoSrc}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, rgba(22,20,16,0.94) 0%, rgba(22,20,16,0.72) 48%, rgba(22,20,16,0.45) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "52px 56px",
            width: "100%",
            maxWidth: 780,
          }}
        >
          <div
            style={{
              color: "#d99d26",
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            {event.eventType}
          </div>
          <div
            style={{
              color: "#f4efe6",
              fontSize: event.title.length > 42 ? 46 : 56,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 18,
            }}
          >
            {event.title}
          </div>
          <div style={{ color: "rgba(244,239,230,0.88)", fontSize: 22, marginBottom: 10 }}>{schedule}</div>
          {event.location ? (
            <div style={{ color: "rgba(244,239,230,0.7)", fontSize: 18, marginBottom: 16 }}>{event.location}</div>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                background: "#d99d26",
                color: "#161410",
                fontSize: 22,
                fontWeight: 700,
                padding: "10px 20px",
                borderRadius: 8,
              }}
            >
              {price}
            </div>
            <div style={{ color: "rgba(244,239,230,0.55)", fontSize: 15 }}>Tap to reserve</div>
          </div>
          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: "1px solid rgba(244,239,230,0.2)",
              color: "rgba(244,239,230,0.65)",
              fontSize: 15,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Blue Top Villa · Kasoa, Ghana
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
