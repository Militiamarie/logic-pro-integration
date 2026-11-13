/*
  Melitia 808 Humanizer — Logic Pro Scripter MIDI FX example
  Load: track > MIDI FX > Scripter > Open Script in Editor > paste > Run Script.
  - Randomizes velocity (humanize) and adds slight timing push/drag
  - Optional octave-down "sub" double for 808 patterns
*/
var NeedsTimingInfo = true;

var PluginParameters = [
  { name: "Velocity Humanize", type: "lin", minValue: 0, maxValue: 40, numberOfSteps: 40, defaultValue: 10 },
  { name: "Timing Drift (ms)", type: "lin", minValue: 0, maxValue: 30, numberOfSteps: 30, defaultValue: 6 },
  { name: "Sub Octave", type: "menu", valueStrings: ["Off", "On"], defaultValue: 0 }
];

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function HandleMIDI(event) {
  if (event instanceof NoteOn) {
    var spread = GetParameter("Velocity Humanize");
    event.velocity = clamp(Math.round(event.velocity + (Math.random() * 2 - 1) * spread), 1, 127);
    var drift = Math.random() * GetParameter("Timing Drift (ms)");
    event.sendAfterMilliseconds(drift);
    if (GetParameter("Sub Octave") === 1 && event.pitch >= 12) {
      var sub = new NoteOn(event);
      sub.pitch = event.pitch - 12;
      sub.sendAfterMilliseconds(drift);
    }
  } else if (event instanceof NoteOff) {
    var d = GetParameter("Timing Drift (ms)");
    event.sendAfterMilliseconds(d); // never cut a note before its (delayed) note-on
    if (GetParameter("Sub Octave") === 1 && event.pitch >= 12) {
      var subOff = new NoteOff(event);
      subOff.pitch = event.pitch - 12;
      subOff.sendAfterMilliseconds(d);
    }
  } else {
    event.send();
  }
}
