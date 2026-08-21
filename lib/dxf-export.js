export function generateDXFContent(formData, result) {
  const plotLength = Number(formData.plotLength) || 50;
  const plotWidth = Number(formData.plotWidth) || 30;

  const lines = [
    "0",
    "SECTION",
    "2",
    "HEADER",
    "9",
    "$ACADVER",
    "1",
    "AC1027",
    "0",
    "ENDSEC",
    "0",
    "SECTION",
    "2",
    "ENTITIES",
  ];

  // Plot boundary
  lines.push("0", "LWPOLYLINE", "8", "Plot", "70", "1");
  lines.push("10", "0", "20", "0");
  lines.push("10", `${plotLength}`, "20", "0");
  lines.push("10", `${plotLength}`, "20", `${plotWidth}`);
  lines.push("10", "0", "20", `${plotWidth}`);

  // Setbacks
  const setbackFront = 20;
  const setbackRear = 15;
  const setbackLeft = 5;
  const setbackRight = 5;

  lines.push("0", "LWPOLYLINE", "8", "Setbacks", "70", "0");
  lines.push("10", `${setbackLeft}`, "20", `${setbackFront}`);
  lines.push("10", `${plotLength - setbackRight}`, "20", `${setbackFront}`);
  lines.push("10", `${plotLength - setbackRight}`, "20", `${plotWidth - setbackRear}`);
  lines.push("10", `${setbackLeft}`, "20", `${plotWidth - setbackRear}`);

  // Add text annotation
  lines.push("0", "TEXT", "8", "Labels");
  lines.push("10", `${plotLength / 2}`, "20", "-2", "40", "2.5");
  lines.push("1", `${plotLength} ft`);

  lines.push("0", "TEXT", "8", "Labels");
  lines.push("10", "-3", "20", `${plotWidth / 2}`, "40", "2.5");
  lines.push("1", `${plotWidth} ft`);

  lines.push("0", "TEXT", "8", "Labels");
  lines.push("10", `${plotLength / 2}`, "20", `${plotWidth + 2}`, "40", "2.5");
  lines.push("1", `Plot Area: ${(plotLength * plotWidth).toFixed(0)} sq ft`);

  lines.push("0", "ENDSEC", "0", "EOF");

  return lines.join("\r\n");
}

export function downloadDXF(formData, result, filename = "floor-plan") {
  const dxfContent = generateDXFContent(formData, result);
  const blob = new Blob([dxfContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.dxf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
