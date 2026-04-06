# Auth emails — 360 Living Institute (Supabase)

Your screenshot shows **“Supabase Auth”** and **`noreply@mail.app.supabase.io`** because Auth is still using **Supabase’s shared mail**. The HTML body can be customized in the dashboard, but **the real “from” address and sender name** only change when you turn on **custom SMTP** (recommended: **Resend**, same stack as your app).

---

## Quick checklist

1. **URL configuration** — **Authentication → URL configuration**
   - **Site URL**: production site, e.g. `https://360livinginstitute.com`
   - **Redirect URLs**: `https://360livinginstitute.com/**`, `http://localhost:3000/**` (see repo notes under “redirect URLs” if you use more hosts)

2. **Sender identity (still shows “Supabase Auth” until SMTP is on)** — After SMTP below, set in the same Auth email area:
   - **Sender name**: e.g. `360 Living Institute`
   - **Sender email**: an address on a domain you **verified** in Resend (e.g. `info@360livinginstitute.com`), matching what Resend allows you to send from.

3. **Custom SMTP with Resend** (removes `@mail.app.supabase.io` for Auth mail)
   - In **Resend**: verify your domain, create an **API key**.
   - In Supabase: **Project Settings → Authentication** (or **Authentication → Emails** depending on UI) → **SMTP / Enable custom SMTP**
   - Typical Resend values (confirm in [Resend + Supabase](https://resend.com/docs/send-with-supabase-smtp)):
     - **Host**: `smtp.resend.com`
     - **Port**: `465` (TLS) or **587** if your UI specifies STARTTLS
     - **Username**: `resend`
     - **Password**: your **Resend API key**
     - **Sender email**: must be from a verified domain in Resend (align with `RESEND_FROM_EMAIL` / `RESEND_FROM` in your Next app if you want one brand).
   - Save, then send a **password reset** or **invite** to yourself and confirm the new From line.

4. **Templates** — **Authentication → Email templates** (or “Emails”). For each type, set **Subject** and paste the HTML from the sections below.  
   Required placeholder in links: **`{{ .ConfirmationURL }}`** (do not delete).

| Supabase template        | Subject suggestion (edit freely) |
| ------------------------ | -------------------------------- |
| Confirm signup           | Confirm your email — 360 Living Institute |
| Invite user              | You are invited — 360 Living Institute |
| Magic link               | Your sign-in link — 360 Living Institute |
| Reset password           | Reset your password — 360 Living Institute |
| Change email address     | Confirm your new email — 360 Living Institute |
| Reauthentication         | Confirm it is you — 360 Living Institute |

5. **App env alignment** (Next.js `email.ts`): optional but nice to keep **the same** From as Supabase SMTP: `RESEND_FROM`, or `RESEND_FROM_NAME` + `RESEND_FROM_EMAIL`.

Official overview: [Supabase — Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)

---

## Where to paste the HTML below

**Dashboard → Authentication → Email templates**

Use your **production** site URL under **Authentication → URL configuration** (same as checklist above).

Confirmation links use `{{ .ConfirmationURL }}` — do not remove that placeholder.

---

## Confirm signup

**Subject:** Confirm your email — 360 Living Institute

```html
<!DOCTYPE html>
<html>
<body style="margin:0;background:#F7F5F2;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(61,61,61,0.08);">
          <tr>
            <td style="padding:28px 32px 8px;font-family:'DM Sans',Arial,sans-serif;">
              <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#E8007D;font-weight:600;">360 Living Institute</p>
              <h1 style="margin:12px 0 8px;font-size:22px;font-weight:400;color:#3D3D3D;font-family:Georgia,serif;">Confirm your email</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#6B6B6B;font-family:'DM Sans',Arial,sans-serif;">
                Thanks for joining. Tap the button below to verify your address and finish setting up your account.
              </p>
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 28px;background:#E8007D;color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;font-family:'DM Sans',Arial,sans-serif;">
                Confirm email
              </a>
              <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#9a9a9a;font-family:'DM Sans',Arial,sans-serif;">
                If the button doesn’t work, copy this link into your browser:<br />
                <span style="color:#6B6B6B;word-break:break-all;">{{ .ConfirmationURL }}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #F0EEEB;font-family:'DM Sans',Arial,sans-serif;">
              <p style="margin:0;font-size:11px;color:#9a9a9a;line-height:1.5;">
                31 Awudome Roundabout, Awudome, Accra, Ghana · You received this because someone signed up with this email at 360 Living Institute.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Magic link

**Subject:** Your sign-in link — 360 Living Institute

Paste under **Magic link** in Email templates.

```html
<!DOCTYPE html>
<html>
<body style="margin:0;background:#F7F5F2;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(61,61,61,0.08);">
          <tr>
            <td style="padding:28px 32px 8px;font-family:'DM Sans',Arial,sans-serif;">
              <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#E8007D;font-weight:600;">360 Living Institute</p>
              <h1 style="margin:12px 0 8px;font-size:22px;font-weight:400;color:#3D3D3D;font-family:Georgia,serif;">Sign in to your account</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#6B6B6B;font-family:'DM Sans',Arial,sans-serif;">
                Click the button below to sign in without a password. For your security, this link expires soon—if it stops working, request a new one from the login page.
              </p>
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 28px;background:#E8007D;color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;font-family:'DM Sans',Arial,sans-serif;">
                Sign in
              </a>
              <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#9a9a9a;font-family:'DM Sans',Arial,sans-serif;">
                If the button does not work, copy this link into your browser:<br />
                <span style="color:#6B6B6B;word-break:break-all;">{{ .ConfirmationURL }}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #F0EEEB;font-family:'DM Sans',Arial,sans-serif;">
              <p style="margin:0;font-size:11px;color:#9a9a9a;line-height:1.5;">
                31 Awudome Roundabout, Awudome, Accra, Ghana · You received this because a sign-in link was requested for this address at 360 Living Institute. If this was not you, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Reset password

**Subject:** Reset your password — 360 Living Institute

Paste under **Reset password** in Email templates.

```html
<!DOCTYPE html>
<html>
<body style="margin:0;background:#F7F5F2;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(61,61,61,0.08);">
          <tr>
            <td style="padding:28px 32px 8px;font-family:'DM Sans',Arial,sans-serif;">
              <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#E8007D;font-weight:600;">360 Living Institute</p>
              <h1 style="margin:12px 0 8px;font-size:22px;font-weight:400;color:#3D3D3D;font-family:Georgia,serif;">Reset your password</h1>
              <p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#6B6B6B;font-family:'DM Sans',Arial,sans-serif;">
                We received a request to reset the password for your account. Use the button below to choose a new password.
              </p>
              <p style="margin:0 0 20px;font-size:14px;line-height:1.65;color:#6B6B6B;font-family:'DM Sans',Arial,sans-serif;">
                If you did not ask for this, you can safely ignore this email—your password will stay the same.
              </p>
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 28px;background:#E8007D;color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;font-family:'DM Sans',Arial,sans-serif;">
                Choose a new password
              </a>
              <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#9a9a9a;font-family:'DM Sans',Arial,sans-serif;">
                If the button does not work, copy this link into your browser:<br />
                <span style="color:#6B6B6B;word-break:break-all;">{{ .ConfirmationURL }}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #F0EEEB;font-family:'DM Sans',Arial,sans-serif;">
              <p style="margin:0;font-size:11px;color:#9a9a9a;line-height:1.5;">
                31 Awudome Roundabout, Awudome, Accra, Ghana · This message was sent because a password reset was requested at 360 Living Institute.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Change email address

**Subject:** Confirm your new email — 360 Living Institute

Paste under **Change email address** in Email templates.

```html
<!DOCTYPE html>
<html>
<body style="margin:0;background:#F7F5F2;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(61,61,61,0.08);">
          <tr>
            <td style="padding:28px 32px 8px;font-family:'DM Sans',Arial,sans-serif;">
              <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#E8007D;font-weight:600;">360 Living Institute</p>
              <h1 style="margin:12px 0 8px;font-size:22px;font-weight:400;color:#3D3D3D;font-family:Georgia,serif;">Confirm your new email</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#6B6B6B;font-family:'DM Sans',Arial,sans-serif;">
                Confirm this email address to finish updating your 360 Living Institute account. After you confirm, you will use this address to sign in.
              </p>
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 28px;background:#E8007D;color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;font-family:'DM Sans',Arial,sans-serif;">
                Confirm new email
              </a>
              <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#9a9a9a;font-family:'DM Sans',Arial,sans-serif;">
                If the button does not work, copy this link into your browser:<br />
                <span style="color:#6B6B6B;word-break:break-all;">{{ .ConfirmationURL }}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #F0EEEB;font-family:'DM Sans',Arial,sans-serif;">
              <p style="margin:0;font-size:11px;color:#9a9a9a;line-height:1.5;">
                31 Awudome Roundabout, Awudome, Accra, Ghana · You received this because your account email is being changed to this address.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Re-invite / password for existing test users

After template changes, users who never confirmed can **sign up again** or you can **resend** from Authentication → Users, or delete and recreate the user.
