export type QRType =
  | "link"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "whatsapp"
  | "skype"
  | "zoom"
  | "wifi"
  | "vcard"
  | "event"
  | "paypal"
  | "bitcoin";

export type QRPayload =
  | { type: "link"; url: string }
  | { type: "text"; text: string }
  | { type: "email"; to: string; subject: string; body: string }
  | { type: "phone"; phone: string }
  | { type: "sms"; phone: string; message: string }
  | { type: "whatsapp"; phone: string; message: string }
  | { type: "skype"; user: string; action: "chat" | "call" }
  | { type: "zoom"; meetingId: string; password: string }
  | {
      type: "wifi";
      ssid: string;
      password: string;
      encryption: "WPA" | "WEP" | "nopass";
      hidden: boolean;
    }
  | {
      type: "vcard";
      firstName: string;
      lastName: string;
      org: string;
      title: string;
      phone: string;
      email: string;
      website: string;
      address: string;
    }
  | {
      type: "event";
      title: string;
      location: string;
      start: string;
      end: string;
      description: string;
    }
  | { type: "paypal"; email: string; amount: string; currency: string }
  | { type: "bitcoin"; address: string; amount: string; label: string };

export function encodePayload(p: QRPayload): string {
  switch (p.type) {
    case "link":
      return p.url || "https://";
    case "text":
      return p.text || "";
    case "email": {
      const q = new URLSearchParams();
      if (p.subject) q.set("subject", p.subject);
      if (p.body) q.set("body", p.body);
      const qs = q.toString();
      return `mailto:${p.to}${qs ? `?${qs}` : ""}`;
    }
    case "phone":
      return `tel:${p.phone}`;
    case "sms":
      return `SMSTO:${p.phone}:${p.message}`;
    case "whatsapp": {
      const num = p.phone.replace(/[^0-9]/g, "");
      return `https://wa.me/${num}${p.message ? `?text=${encodeURIComponent(p.message)}` : ""}`;
    }
    case "skype":
      return `skype:${p.user}?${p.action}`;
    case "zoom":
      return `https://zoom.us/j/${encodeURIComponent(p.meetingId)}${p.password ? `?pwd=${encodeURIComponent(p.password)}` : ""}`;
    case "wifi": {
      const esc = (s: string) =>
        s.replace(/([\\;,":])/g, "\\$1");
      return `WIFI:T:${p.encryption};S:${esc(p.ssid)};P:${esc(p.password)};${p.hidden ? "H:true;" : ""};`;
    }
    case "vcard": {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${p.lastName};${p.firstName}`,
        `FN:${p.firstName} ${p.lastName}`.trim(),
        p.org && `ORG:${p.org}`,
        p.title && `TITLE:${p.title}`,
        p.phone && `TEL:${p.phone}`,
        p.email && `EMAIL:${p.email}`,
        p.website && `URL:${p.website}`,
        p.address && `ADR:;;${p.address};;;;`,
        "END:VCARD",
      ].filter(Boolean);
      return lines.join("\n");
    }
    case "event": {
      const fmt = (d: string) =>
        d ? d.replace(/[-:]/g, "").replace(/\.\d+/, "") : "";
      const lines = [
        "BEGIN:VEVENT",
        p.title && `SUMMARY:${p.title}`,
        p.location && `LOCATION:${p.location}`,
        p.description && `DESCRIPTION:${p.description}`,
        p.start && `DTSTART:${fmt(p.start)}`,
        p.end && `DTEND:${fmt(p.end)}`,
        "END:VEVENT",
      ].filter(Boolean);
      return lines.join("\n");
    }
    case "paypal": {
      const q = new URLSearchParams();
      q.set("cmd", "_xclick");
      q.set("business", p.email);
      if (p.amount) q.set("amount", p.amount);
      if (p.currency) q.set("currency_code", p.currency);
      return `https://www.paypal.com/cgi-bin/webscr?${q.toString()}`;
    }
    case "bitcoin": {
      const q = new URLSearchParams();
      if (p.amount) q.set("amount", p.amount);
      if (p.label) q.set("label", p.label);
      const qs = q.toString();
      return `bitcoin:${p.address}${qs ? `?${qs}` : ""}`;
    }
  }
}

export const defaultPayloads: Record<QRType, QRPayload> = {
  link: { type: "link", url: "https://qr.kasparek.net" },
  text: { type: "text", text: "Ahoj!" },
  email: { type: "email", to: "", subject: "", body: "" },
  phone: { type: "phone", phone: "" },
  sms: { type: "sms", phone: "", message: "" },
  whatsapp: { type: "whatsapp", phone: "", message: "" },
  skype: { type: "skype", user: "", action: "chat" },
  zoom: { type: "zoom", meetingId: "", password: "" },
  wifi: {
    type: "wifi",
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  },
  vcard: {
    type: "vcard",
    firstName: "",
    lastName: "",
    org: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    address: "",
  },
  event: {
    type: "event",
    title: "",
    location: "",
    start: "",
    end: "",
    description: "",
  },
  paypal: { type: "paypal", email: "", amount: "", currency: "EUR" },
  bitcoin: { type: "bitcoin", address: "", amount: "", label: "" },
};
