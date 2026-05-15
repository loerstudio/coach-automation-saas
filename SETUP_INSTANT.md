# 🚀 SETUP INSTANT - Tutto Funzionante in 10 Minuti!

NO OAuth, NO approvazioni, NO attese! Tutto instant.

## 1️⃣ CLERK (Auth Instant - 2 min)
1. Vai su https://clerk.com
2. Sign up gratuito
3. Crea app "CoachFlow"
4. Copia le API keys nel `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

## 2️⃣ AIRTABLE (Database Instant - 3 min)
1. Vai su https://airtable.com
2. Sign up gratuito
3. Crea base "Coach Automation"
4. Crea tabella "Contacts" con colonne:
   - Name (Single line text)
   - Email (Email)
   - Phone (Phone number)
   - Status (Single select: "To Contact", "Contacted")
   - Message (Long text)
   - Last Contact (Date)
5. Vai in Account → Generate API key
6. Copia nel `.env.local`:
```
AIRTABLE_API_KEY=patxxxxx
AIRTABLE_BASE_ID=appxxxxx (lo trovi nell'URL)
```

## 3️⃣ TWILIO (WhatsApp Instant - 3 min)
1. Vai su https://www.twilio.com
2. Sign up gratuito ($15 credito gratis!)
3. Vai su Messaging → Try it out → Send a WhatsApp message
4. Salva il numero sandbox: `whatsapp:+14155238886`
5. Account → API keys & tokens
6. Copia nel `.env.local`:
```
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**NOTA**: I tuoi clienti devono mandare "join <your-sandbox-word>" al numero Twilio per ricevere messaggi (solo per test, in produzione avrai numero dedicato)

## 4️⃣ RESEND (Email Instant - 2 min)
1. Vai su https://resend.com
2. Sign up gratuito
3. API Keys → Create API Key
4. Copia nel `.env.local`:
```
RESEND_API_KEY=re_xxxxx
```

**NOTA**: Per inviare da tuo dominio, aggiungi i DNS records che ti dà Resend

## 5️⃣ AVVIA L'APP
```bash
npm run dev
```

## 📱 COME USARE:

1. **Aggiungi contatti in Airtable**:
   - Nome, Email, Telefono
   - Status = "To Contact"
   - Message = il messaggio da inviare

2. **L'automazione ogni 15 min**:
   - Legge Airtable
   - Trova contatti con Status "To Contact"
   - Invia email via Resend
   - Invia WhatsApp via Twilio
   - Aggiorna Status a "Contacted"

## 💰 COSTI REALI:
- **Clerk**: Free fino a 10,000 utenti
- **Airtable**: Free fino a 1,200 records
- **Twilio**: $0.005 per WhatsApp (~200 gratis)
- **Resend**: Free 100 email/giorno

**TOTALE**: €0/mese per iniziare!

## 🎯 PER PRODUZIONE:
1. Twilio: Richiedi numero WhatsApp dedicato (~$50/mese)
2. Resend: Verifica tuo dominio
3. Deploy su Vercel (gratis)
4. Stripe per pagamenti (2.9% + 30¢)

---

**TUTTO PRONTO!** Zero approvazioni, zero OAuth, funziona SUBITO! 🚀