// Section Properties Calculator
// CivilCalc Pro

export function sectionProperties({
  shape,
  width,
  depth,
  diameter,
}) {
  let area = 0
  let centroid = 0
  let moi = 0
  let sectionModulus = 0
  let radiusOfGyration = 0

  switch (shape) {
    case "rectangle":
      area = width * depth

      centroid = depth / 2

      moi = (width * Math.pow(depth, 3)) / 12

      sectionModulus = moi / (depth / 2)

      radiusOfGyration = Math.sqrt(moi / area)

      break

    case "circle":
      area = (Math.PI * Math.pow(diameter, 2)) / 4

      centroid = diameter / 2

      moi = (Math.PI * Math.pow(diameter, 4)) / 64

      sectionModulus = moi / (diameter / 2)

      radiusOfGyration = Math.sqrt(moi / area)

      break

    default:
      throw new Error("Unsupported section shape")
  }

  return {
    shape,

    area: area.toFixed(2),

    centroid: centroid.toFixed(2),

    momentOfInertia: moi.toFixed(2),

    sectionModulus: sectionModulus.toFixed(2),

    radiusOfGyration: radiusOfGyration.toFixed(2),

    formulas: {
      rectangle: {
        area: "A = b × h",
        centroid: "ȳ = h / 2",
        moi: "I = bh³ / 12",
        sectionModulus: "Z = I / y",
        radiusOfGyration: "r = √(I/A)",
      },

      circle: {
        area: "A = πd² / 4",
        centroid: "ȳ = d / 2",
        moi: "I = πd⁴ / 64",
        sectionModulus: "Z = I / y",
        radiusOfGyration: "r = √(I/A)",
      },
    },
  }
}
