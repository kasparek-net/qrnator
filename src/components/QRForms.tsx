"use client";

import { Field, Input, Select, Switch, Textarea } from "./ui";
import type { QRPayload } from "@/lib/qr-types";
import { useI18n } from "@/lib/i18n-context";

type Setter = (p: QRPayload) => void;

export function QRForm({
  payload,
  onChange,
}: {
  payload: QRPayload;
  onChange: Setter;
}) {
  const { t } = useI18n();

  switch (payload.type) {
    case "link":
      return (
        <Field label={t("form.link.label")} hint={t("form.link.hint")}>
          <Input
            type="url"
            value={payload.url}
            onChange={(e) => onChange({ ...payload, url: e.target.value })}
            placeholder="https://example.com"
          />
        </Field>
      );
    case "text":
      return (
        <Field label={t("form.text.label")}>
          <Textarea
            value={payload.text}
            onChange={(e) => onChange({ ...payload, text: e.target.value })}
            placeholder={t("form.text.ph")}
          />
        </Field>
      );
    case "email":
      return (
        <div className="space-y-3">
          <Field label={t("form.email.to")}>
            <Input
              type="email"
              value={payload.to}
              onChange={(e) => onChange({ ...payload, to: e.target.value })}
              placeholder="hello@example.com"
            />
          </Field>
          <Field label={t("form.email.subject")}>
            <Input
              value={payload.subject}
              onChange={(e) =>
                onChange({ ...payload, subject: e.target.value })
              }
            />
          </Field>
          <Field label={t("form.email.body")}>
            <Textarea
              value={payload.body}
              onChange={(e) => onChange({ ...payload, body: e.target.value })}
            />
          </Field>
        </div>
      );
    case "phone":
      return (
        <Field label={t("form.phone.label")} hint={t("form.phone.hint")}>
          <Input
            type="tel"
            value={payload.phone}
            onChange={(e) => onChange({ ...payload, phone: e.target.value })}
            placeholder="+1 555 123 4567"
          />
        </Field>
      );
    case "sms":
      return (
        <div className="space-y-3">
          <Field label={t("form.sms.phone")}>
            <Input
              type="tel"
              value={payload.phone}
              onChange={(e) => onChange({ ...payload, phone: e.target.value })}
              placeholder="+1…"
            />
          </Field>
          <Field label={t("form.sms.message")}>
            <Textarea
              value={payload.message}
              onChange={(e) =>
                onChange({ ...payload, message: e.target.value })
              }
            />
          </Field>
        </div>
      );
    case "whatsapp":
      return (
        <div className="space-y-3">
          <Field label={t("form.wa.phone")} hint={t("form.wa.phoneHint")}>
            <Input
              type="tel"
              value={payload.phone}
              onChange={(e) => onChange({ ...payload, phone: e.target.value })}
              placeholder="15551234567"
            />
          </Field>
          <Field label={t("form.wa.message")}>
            <Textarea
              value={payload.message}
              onChange={(e) =>
                onChange({ ...payload, message: e.target.value })
              }
            />
          </Field>
        </div>
      );
    case "skype":
      return (
        <div className="space-y-3">
          <Field label={t("form.skype.user")}>
            <Input
              value={payload.user}
              onChange={(e) => onChange({ ...payload, user: e.target.value })}
              placeholder="username"
            />
          </Field>
          <Field label={t("form.skype.action")}>
            <Select
              value={payload.action}
              onChange={(e) =>
                onChange({
                  ...payload,
                  action: e.target.value as "chat" | "call",
                })
              }
            >
              <option value="chat">{t("form.skype.chat")}</option>
              <option value="call">{t("form.skype.call")}</option>
            </Select>
          </Field>
        </div>
      );
    case "zoom":
      return (
        <div className="space-y-3">
          <Field label={t("form.zoom.id")}>
            <Input
              value={payload.meetingId}
              onChange={(e) =>
                onChange({ ...payload, meetingId: e.target.value })
              }
              placeholder="123 456 7890"
            />
          </Field>
          <Field label={t("form.zoom.password")}>
            <Input
              value={payload.password}
              onChange={(e) =>
                onChange({ ...payload, password: e.target.value })
              }
            />
          </Field>
        </div>
      );
    case "wifi":
      return (
        <div className="space-y-3">
          <Field label={t("form.wifi.ssid")}>
            <Input
              value={payload.ssid}
              onChange={(e) => onChange({ ...payload, ssid: e.target.value })}
              placeholder="My WiFi"
            />
          </Field>
          <Field label={t("form.wifi.password")}>
            <Input
              type="text"
              value={payload.password}
              onChange={(e) =>
                onChange({ ...payload, password: e.target.value })
              }
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("form.wifi.encryption")}>
              <Select
                value={payload.encryption}
                onChange={(e) =>
                  onChange({
                    ...payload,
                    encryption: e.target.value as "WPA" | "WEP" | "nopass",
                  })
                }
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">{t("form.wifi.nopass")}</option>
              </Select>
            </Field>
            <div className="flex items-end pb-1">
              <Switch
                checked={payload.hidden}
                onChange={(v) => onChange({ ...payload, hidden: v })}
                label={t("form.wifi.hidden")}
              />
            </div>
          </div>
        </div>
      );
    case "vcard":
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("form.vcard.firstName")}>
              <Input
                value={payload.firstName}
                onChange={(e) =>
                  onChange({ ...payload, firstName: e.target.value })
                }
              />
            </Field>
            <Field label={t("form.vcard.lastName")}>
              <Input
                value={payload.lastName}
                onChange={(e) =>
                  onChange({ ...payload, lastName: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("form.vcard.org")}>
              <Input
                value={payload.org}
                onChange={(e) => onChange({ ...payload, org: e.target.value })}
              />
            </Field>
            <Field label={t("form.vcard.title")}>
              <Input
                value={payload.title}
                onChange={(e) =>
                  onChange({ ...payload, title: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("form.vcard.phone")}>
              <Input
                value={payload.phone}
                onChange={(e) =>
                  onChange({ ...payload, phone: e.target.value })
                }
              />
            </Field>
            <Field label={t("form.vcard.email")}>
              <Input
                type="email"
                value={payload.email}
                onChange={(e) =>
                  onChange({ ...payload, email: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label={t("form.vcard.website")}>
            <Input
              value={payload.website}
              onChange={(e) =>
                onChange({ ...payload, website: e.target.value })
              }
            />
          </Field>
          <Field label={t("form.vcard.address")}>
            <Input
              value={payload.address}
              onChange={(e) =>
                onChange({ ...payload, address: e.target.value })
              }
            />
          </Field>
        </div>
      );
    case "event":
      return (
        <div className="space-y-3">
          <Field label={t("form.event.title")}>
            <Input
              value={payload.title}
              onChange={(e) => onChange({ ...payload, title: e.target.value })}
            />
          </Field>
          <Field label={t("form.event.location")}>
            <Input
              value={payload.location}
              onChange={(e) =>
                onChange({ ...payload, location: e.target.value })
              }
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("form.event.start")}>
              <Input
                type="datetime-local"
                value={payload.start}
                onChange={(e) =>
                  onChange({ ...payload, start: e.target.value })
                }
              />
            </Field>
            <Field label={t("form.event.end")}>
              <Input
                type="datetime-local"
                value={payload.end}
                onChange={(e) => onChange({ ...payload, end: e.target.value })}
              />
            </Field>
          </div>
          <Field label={t("form.event.desc")}>
            <Textarea
              value={payload.description}
              onChange={(e) =>
                onChange({ ...payload, description: e.target.value })
              }
            />
          </Field>
        </div>
      );
    case "paypal":
      return (
        <div className="space-y-3">
          <Field label={t("form.paypal.email")}>
            <Input
              type="email"
              value={payload.email}
              onChange={(e) => onChange({ ...payload, email: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("form.paypal.amount")}>
              <Input
                type="number"
                step="0.01"
                value={payload.amount}
                onChange={(e) =>
                  onChange({ ...payload, amount: e.target.value })
                }
              />
            </Field>
            <Field label={t("form.paypal.currency")}>
              <Select
                value={payload.currency}
                onChange={(e) =>
                  onChange({ ...payload, currency: e.target.value })
                }
              >
                <option>EUR</option>
                <option>USD</option>
                <option>CZK</option>
                <option>GBP</option>
                <option>CHF</option>
                <option>PLN</option>
              </Select>
            </Field>
          </div>
        </div>
      );
    case "bitcoin":
      return (
        <div className="space-y-3">
          <Field label={t("form.btc.address")}>
            <Input
              value={payload.address}
              onChange={(e) =>
                onChange({ ...payload, address: e.target.value })
              }
              placeholder="bc1q…"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("form.btc.amount")}>
              <Input
                type="number"
                step="0.00000001"
                value={payload.amount}
                onChange={(e) =>
                  onChange({ ...payload, amount: e.target.value })
                }
              />
            </Field>
            <Field label={t("form.btc.label")}>
              <Input
                value={payload.label}
                onChange={(e) =>
                  onChange({ ...payload, label: e.target.value })
                }
              />
            </Field>
          </div>
        </div>
      );
  }
}
