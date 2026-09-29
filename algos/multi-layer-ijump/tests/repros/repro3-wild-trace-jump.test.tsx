import { MultilayerIjump } from "algos/multi-layer-ijump/MultilayerIjump"
import { expect, test } from "bun:test"

const autorouterParams = {
  isRemovePathLoopsEnabled: true,
  input: {
    layerCount: 1,
    minTraceWidth: 0.15,
    obstacles: [
      {
        type: "rect",
        layers: ["top"],
        center: { x: -1.5, y: -10 },
        width: 0.6,
        height: 0.7,
        connectedTo: [],
      },
      {
        type: "rect",
        layers: ["top"],
        center: { x: -0.5, y: -10 },
        width: 0.6,
        height: 0.7,
        connectedTo: [],
      },
      {
        type: "rect",
        layers: ["top"],
        center: { x: -1.0, y: -10.8 },
        width: 0.4,
        height: 0.6,
        connectedTo: [],
      },
      {
        type: "rect",
        layers: ["top"],
        center: { x: -1.5, y: -5.0 },
        width: 0.6,
        height: 10.0,
        connectedTo: [],
      },
      {
        type: "rect",
        layers: ["top"],
        center: { x: -1.25, y: -9.25 },
        width: 0.5,
        height: 0.2,
        connectedTo: [],
      },
      {
        type: "rect",
        layers: ["top"],
        center: { x: -0.6, y: 0 },
        width: 0.5,
        height: 0.6,
        connectedTo: [],
      },
      {
        type: "rect",
        layers: ["top"],
        center: { x: 2.0, y: -5 },
        width: 0.5,
        height: 14,
        connectedTo: [],
      },
    ],
    connections: [
      {
        name: "net1",
        pointsToConnect: [
          { x: -1.0, y: -10.2, layer: "top", layers: ["top"] },
          { x: -0.5, y: -10.8, layer: "top", layers: ["top"] },
        ],
      },
    ],
    bounds: { minX: -5, maxX: 5, minY: -12, maxY: 2 },
  },
}

test("repro3: no wild trace jump to distant obstacle when continuing forward", () => {
  const autorouter = new MultilayerIjump(autorouterParams as any)
  const solution = autorouter.solveAndMapToTraces()
  expect(solution).toHaveLength(1)

  const maxTraceY = Math.max(...solution[0].route.map((pt) => pt.y))
  expect(maxTraceY).toBeLessThan(-8)
})
