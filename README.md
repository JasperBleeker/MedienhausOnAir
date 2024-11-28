
---

# MedienhausOnAir

## Projektbeschreibung
**MedienhausOnAir** ist ein IoT-Projekt, das den Live-Status des Radiostudios überwacht und visualisiert. Das Ziel ist es, Multi Media Production Studierenden eine einfache Möglichkeit zu bieten, den Status des Radiostudios aus der Ferne zu überprüfen. Das Projekt wurde inspiriert vom "ON AIR"-Licht vor dem Radiostudio, das den Live-Status anzeigt.

---

## UX - Kreative Konzeption

### Inspirationen
Die eingeschränkte Auswahl an Aktoren und Sensoren hat eine gewisse Kreativität erfordert. Dieses Projekt gab mir die Möglichkeit, eine Idee umzusetzen, die ich schon länger hatte: den Status des Radiostudios aus der Ferne überwachen zu können.

### Designentscheidungen
- Die Farbe **Rot** für den Statusanzeiger wurde vom ON AIR-Licht des Radiostudios inspiriert.
- Der Fokus lag auf der Mikrocontroller-Programmierung und der Backend-Entwicklung. Daher wurde weniger Augenmerk auf das Frontend gelegt.
- Zielpublikum: Multi Media Production Studierende, die den Live-Status des Radiostudios in Echtzeit abrufen möchten.

### Planung und Prozess
- Ein Flussdiagramm wurde erstellt, um den Informationsfluss zu visualisieren. [Hier Diagramm einfügen, wenn verfügbar]
- Iterative Entwicklung mit Fokus auf Hardware und Softwareintegration.

---

## Technik - Technische Konzeption und Umsetzung

### Verbindungsschema
**Hardware:**
- **Lichtsensor**: Erkennt, ob das ON AIR-Licht ein- oder ausgeschaltet ist.
- **Mikrocontroller**: Steuerung der Datenverarbeitung und Kommunikation (ESP32-C6).
- **LCD-Display**: Zeigt die IP-Adresse des Mikrocontrollers an, um auf einer lokalen Webseite Einstellungen vorzunehmen (z. B. Ausleseintervall, Kalibrierung des Sensors).

**Software:**
- HTTP-Kommunikation zwischen Mikrocontroller und Webinterface.
- Lokale Webseite zur Steuerung und Kalibrierung.

### Herausforderungen und Lösungen
1. **Verkabelung der Hardware**: Die Zuordnung von Pinouts und Inputs des Mikrocontrollers war schwierig. Dieses [YouTube-Video](https://www.youtube.com/watch?v=g_6OJDyUw1w&t=321s) war hilfreich bei der LCD-Verdrahtung.
2. **Kalibrierung des Sensors**: Diese war stark abhängig von Umgebungslichtbedingungen (Sonnenlicht, künstliche Beleuchtung). Eine bessere Gehäusemontage könnte hier zukünftige Stabilität bieten.

### Kommunikation zwischen den Medienkomponenten
Die einzelnen Komponenten kommunizieren über **HTTP**, wobei der Mikrocontroller als Server agiert und Daten an das Webinterface sendet.

---

## Ablaufdiagramm
![[Screenshot 2024-10-31 at 11.55.51 1.png]]

---

## Known Bugs
- Die Kalibrierung des Sensors ist nicht immer zuverlässig und stark von den Lichtverhältnissen abhängig.
- Die Hardware ist aktuell nicht optimal montiert und benötigt ein Schutzgehäuse für dauerhaften Einsatz.

---

## Lernerfolge
- Vertiefte Kenntnisse in der Mikrocontroller-Programmierung.
- Praktische Einblicke in IoT-Anwendungen für Unterhaltung, Live-Events und Maker-Projekte.
- Inspiration für zukünftige IoT-Projekte.

---

## Aufgabenaufteilung
Das Projekt wurde vollständig von **Jasper Bleeker** umgesetzt.

---
