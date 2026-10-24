# Ordrebekreftelse — mal (bokmål)

Mal til e-post. Bare teksten. Ingenting sendes herfra, og ingen integrasjon endres.

Avsender og emnefelt settes i det systemet som allerede sender ordrebekreftelser. Bruk bare kontaktadressene som allerede står på fortenergi.no.

**Emne:** Ordrebekreftelse {{ordrenummer}} — Fortenergi

---

Hei {{fornavn}},

Takk for bestillingen hos Fortenergi. Vi har registrert ordren.

**Ordrenummer:** {{ordrenummer}}  
**Dato:** {{dato}}

**Leveringsadresse**  
{{navn}}  
{{adresse}}  
{{postnummer}} {{sted}}  
Norge

**Varer**

{{varelinjer}}

Hver linje viser varenavn, antall og pris slik de sto da ordren ble betalt. Frakt og totalbeløp er de beløpene som ble vist før betaling:

- Varebeløp: {{varebelop}}
- Frakt: {{frakt}}
- Totalt: {{total}}

Betalingen er tatt imot via Stripe. Vi lagrer ikke kortnummeret ditt.

**Levering**  
Vi leverer til Norge. Forventet tid og fraktpris er de som sto i kassen og på [frakt og levering](https://fortenergi.no/frakt-og-levering.html). En ordre kan komme i flere pakker. Sporingsinformasjon sendes på e-post når transportøren tilbyr det.

**Kjøpsvilkår, angrerett og angreskjema**

- [Kjøpsvilkår](https://fortenergi.no/kjopsvilkar.html)
- [Angrerett](https://fortenergi.no/angrerett.html)
- [Angreskjema](https://fortenergi.no/angreskjema.html)

Du har 14 dagers angrerett etter angrerettloven, regnet slik kjøpsvilkårene og angrerett-siden beskriver. Vilkårene på de sidene gjelder. For å bruke angreretten, gi beskjed før fristen går ut til support@fortenergi.no. Angreskjemaet kan brukes, men er ikke obligatorisk.

**Kontakt**  
Ordre og levering: orders@fortenergi.no  
Retur, skade og reklamasjon: support@fortenergi.no  
Andre henvendelser: kontakt@fortenergi.no  
Telefon, SMS, Telegram og Viber: +47 912 90 416

Med vennlig hilsen  
Fortenergi  
Martinez Lozano Internasjonal Handel  
org.nr 935 407 095 MVA  
Norbygata 19, 0187 Oslo, Norge  
https://fortenergi.no/

---

Feltene i `{{klammer}}` fylles fra den enkelte ordren. Ikke legg inn eksempelbeløp, kundenavn eller sporingsnummer i denne malen.
