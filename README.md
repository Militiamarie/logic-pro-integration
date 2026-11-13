# Logic Pro Integration

A starter repo for building things that plug into **Apple Logic Pro** — plus a short map of Adobe's current developer SDKs.
By Melitia Marie Productions.

> **Heads-up: there is no official public "Logic Pro SDK".** Apple does not publish an API for scripting or
> automating the Logic Pro app itself. You integrate with Logic through the standard Apple audio/MIDI plug-in
> formats and control protocols below.

## How you can extend Logic Pro

| Extension point | What it is | Build with |
|---|---|---|
| **Audio Units (AU v2 / AUv3)** | Instruments, audio effects and MIDI FX that load in Logic's channel strips. AUv3 = app extension (ships inside a macOS/iOS app, works in Logic Pro for Mac and iPad). AU v2 = legacy `.component` bundle in `~/Library/Audio/Plug-Ins/Components`. | Xcode, Swift/C++, AudioToolbox `AUAudioUnit`, or cross-platform frameworks like JUCE |
| **MIDI FX Audio Units** | AU type `aumi` (MIDI processor) — arpeggiators, chord generators, MIDI transformers in Logic's MIDI FX slot. | AUv3 MIDI processor + Core MIDI types |
| **Scripter** | Logic's built-in JavaScript MIDI FX plug-in. Write `HandleMIDI(event)` / `ProcessMIDI()` scripts with sliders/menus, no compiling. Saved inside the project or as a patch. | Plain JavaScript (see [`scripter/`](scripter/)) |
| **Control surfaces** | Hardware/software controllers via Mackie Control, HUI, Logic's Controller Assignments (MIDI Learn), and OSC-capable devices. | MIDI / OSC, Core MIDI |
| **Logic Remote** | Apple's iPad/iPhone remote app for Logic (transport, mixer, Smart Controls, Live Loops). | Use as-is (no public API) |
| **MIDI / MTC / MMC sync** | Drive Logic or follow it from another app/device over virtual or network MIDI. | Core MIDI (IAC Driver, Network MIDI) |
| **File interchange** | AAF, XML (Final Cut Pro), MusicXML, MIDI files, stems, ADM BWF (Dolby Atmos export). | Your app reads/writes the files |

### Integration recipe (Audio Unit — the main route)
1. In Xcode create a new project from the **Audio Unit Extension App** template (macOS or iOS/iPadOS).
2. Pick the type: instrument (`aumu`), effect (`aufx`), or MIDI processor (`aumi`); set a 4-char manufacturer + subtype code.
3. Implement DSP in the `AUAudioUnit` subclass's render block (real-time safe: no allocation, locks or I/O).
4. Expose parameters through an `AUParameterTree` so Logic can automate them; add a SwiftUI/AppKit view.
5. Build, launch the container app once (registers the extension), then validate:
   `auval -a` (list) and `auval -v aufx Demo Mmrp` (validate — use your type/subtype/manufacturer).
6. Open Logic Pro → **Settings → Plug-in Manager** → rescan if needed, then load it on a channel strip.
7. Ship: sign + notarize the app; distribute via the Mac App Store or directly.

### Integration recipe (Scripter — zero-install, fastest)
1. In Logic Pro enable **Settings → Advanced → Enable Complete Features**.
2. On a software-instrument track, add **MIDI FX → Scripter** → **Open Script in Editor**.
3. Paste [`scripter/melitia-808-humanizer.js`](scripter/melitia-808-humanizer.js) → **Run Script**.
4. Save the project or save the plug-in setting to reuse it.

### Official references (Apple)
- Audio Unit v3 plug-ins: https://developer.apple.com/documentation/audiotoolbox/audio-unit-v3-plug-ins
- `AUAudioUnit`: https://developer.apple.com/documentation/audiotoolbox/auaudiounit
- Audio Toolbox: https://developer.apple.com/documentation/audiotoolbox
- Core MIDI: https://developer.apple.com/documentation/coremidi
- Use Scripter in Logic Pro: https://support.apple.com/guide/logicpro/use-scripter-lgce728c68f6/mac
- Scripter API overview: https://support.apple.com/guide/logicpro/scripter-api-overview-lgce3905a48c/mac
- Scripter `HandleMIDI`: https://support.apple.com/guide/logicpro/handlemidi-function-lgce12088271/mac
- Control Surfaces Support for Logic Pro: https://support.apple.com/guide/logicpro-css/welcome/mac
- Logic Pro: https://www.apple.com/logic-pro/

## Adobe SDKs (quick note)
The old **Adobe Creative SDK is end-of-life** (image editor components ended 2017; content/workflow/auth components ended April 2019) —
[Adobe's announcement](https://github.com/AdobeDocs/creative-sdk/blob/master/announcement/creative-sdk-components-end-of-life.md).
Current options:

| SDK | Use it for | Docs |
|---|---|---|
| Adobe Express Embed SDK | Embed Adobe Express editing (design, quick actions) inside your own web app | https://developer.adobe.com/express/embed-sdk/ |
| Adobe Express add-ons | Build add-ons that run inside Adobe Express | https://developer.adobe.com/express/add-ons/ |
| UXP (Unified Extensibility Platform) | JavaScript plug-ins for Photoshop, InDesign, Premiere Pro | https://developer.adobe.com/photoshop/uxp/ · https://developer.adobe.com/premiere-pro/uxp/ |
| After Effects SDK | C/C++ effect & AEGP plug-ins | https://developer.adobe.com/after-effects/ |
| Audition | Audition developer resources (audio effects use standard VST3/AU plug-ins) | https://developer.adobe.com/audition/ |
| Adobe Developer home | All APIs (Firefly, PDF Services, Photoshop API, etc.) | https://developer.adobe.com/ |

**Audio crossover tip:** one AU/VST3 plug-in (e.g. built with JUCE) can run in Logic Pro *and* Adobe Audition / Premiere Pro.

## Repo contents
- `README.md` — this guide
- `index.html` — simple landing page (open in any browser / deploy as a static site)
- `scripter/melitia-808-humanizer.js` — example Logic Pro Scripter MIDI FX script

## License
MIT — use freely.
